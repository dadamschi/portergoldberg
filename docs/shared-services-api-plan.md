# Shared Services API - Architecture & Implementation Plan

## Overview

Build a centralized API service that provides email (Resend), CRM (HubSpot), and contact form handling across multiple client projects. Each project authenticates with an API key and gets its own configuration (HubSpot credentials, notification emails, branding).

## Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | **Hono** on Cloudflare Workers | Lightweight, fast cold starts, edge deployment, TypeScript-first |
| Database | **Cloudflare D1** (SQLite) | Same platform as Workers, zero config, generous free tier |
| Email | **Resend** | Already using, simple API |
| CRM | **HubSpot API** | Already integrated |
| Deployment | **Cloudflare Workers** | Global edge, generous free tier, Wrangler CLI |

### Why Cloudflare D1?

| Option | Free Tier | Notes |
|--------|-----------|-------|
| **Cloudflare D1** ✓ | 5GB, 25M reads/mo | Same platform, native integration, SQLite |
| Turso | 9GB, 500M reads/mo | Distributed SQLite, separate service |
| Supabase | 500MB, 50k rows | Postgres, more features but separate account |
| Cloudflare KV | 1GB, 100k reads/day | Key-value only, no SQL |

D1 is the simplest choice since you're already on Cloudflare Workers - no additional accounts or services to manage.

## Repository Structure

```
shared-services-api/
├── src/
│   ├── index.ts                 # Hono app entry point
│   ├── middleware/
│   │   ├── auth.ts              # API key validation
│   │   ├── rateLimit.ts         # Rate limiting per project
│   │   └── logging.ts           # Request logging
│   ├── routes/
│   │   ├── email.ts             # POST /email/send
│   │   ├── contacts.ts          # POST /contacts, GET /contacts/:id
│   │   ├── forms.ts             # POST /forms/contact, POST /forms/newsletter
│   │   └── vendors.ts           # GET /vendors
│   ├── services/
│   │   ├── resend.ts            # Resend client wrapper
│   │   └── hubspot.ts           # HubSpot client (port from portergoldberg)
│   ├── db/
│   │   ├── schema.sql           # D1 table definitions
│   │   └── queries.ts           # Type-safe query helpers
│   ├── types/
│   │   └── index.ts             # Shared types
│   └── utils/
│       └── validation.ts        # Zod schemas for request validation
├── wrangler.toml                # Cloudflare Workers config
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema (Cloudflare D1)

D1 uses SQLite. Create and manage with Wrangler CLI:

```bash
# Create database
wrangler d1 create services-db

# Run migrations
wrangler d1 execute services-db --file=./src/db/schema.sql

# Local development
wrangler d1 execute services-db --local --file=./src/db/schema.sql
```

### `projects` table
Stores configuration for each client project.

```sql
-- src/db/schema.sql
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,                         -- UUID as text
  name TEXT NOT NULL,                          -- "PorterGoldberg", "ClientB"
  slug TEXT UNIQUE NOT NULL,                   -- "portergoldberg", "clientb"
  api_key_hash TEXT UNIQUE NOT NULL,           -- hashed API key for auth

  -- Email config
  resend_api_key TEXT NOT NULL,                -- encrypted
  from_email TEXT NOT NULL,                    -- "Company <noreply@domain.com>"
  notification_emails TEXT NOT NULL,           -- JSON array: '["info@domain.com"]'

  -- HubSpot config
  hubspot_api_key TEXT,                        -- encrypted, nullable if not using
  hubspot_client_id TEXT,                      -- for building contact links

  -- Defaults
  default_tier TEXT DEFAULT 'Warm',

  -- Metadata
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_api_key ON projects(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
```

### `request_logs` table
For debugging and analytics.

```sql
CREATE TABLE IF NOT EXISTS request_logs (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  duration_ms INTEGER,
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_logs_created_at ON request_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_project_id ON request_logs(project_id);
```

### Wrangler Configuration

```toml
# wrangler.toml
name = "shared-services-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "services-db"
database_id = "<your-database-id>"  # from `wrangler d1 create`
```

### Type-Safe Query Helpers

```typescript
// src/db/queries.ts
import type { D1Database } from '@cloudflare/workers-types'

export type Project = {
  id: string
  name: string
  slug: string
  api_key_hash: string
  resend_api_key: string
  from_email: string
  notification_emails: string  // JSON string, parse with JSON.parse()
  hubspot_api_key: string | null
  hubspot_client_id: string | null
  default_tier: string
  created_at: string
  updated_at: string
}

export async function getProjectByApiKey(
  db: D1Database,
  apiKeyHash: string
): Promise<Project | null> {
  return db
    .prepare('SELECT * FROM projects WHERE api_key_hash = ?')
    .bind(apiKeyHash)
    .first<Project>()
}

export async function getProjectBySlug(
  db: D1Database,
  slug: string
): Promise<Project | null> {
  return db
    .prepare('SELECT * FROM projects WHERE slug = ?')
    .bind(slug)
    .first<Project>()
}

export async function logRequest(
  db: D1Database,
  log: {
    id: string
    project_id: string
    endpoint: string
    method: string
    status_code: number
    duration_ms: number
    error_message?: string
  }
): Promise<void> {
  await db
    .prepare(`
      INSERT INTO request_logs (id, project_id, endpoint, method, status_code, duration_ms, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      log.id,
      log.project_id,
      log.endpoint,
      log.method,
      log.status_code,
      log.duration_ms,
      log.error_message ?? null
    )
    .run()
}
```

## API Endpoints

### Authentication

All requests require `Authorization: Bearer <API_KEY>` header.

```typescript
// src/middleware/auth.ts
import type { Context, Next } from 'hono'
import type { D1Database } from '@cloudflare/workers-types'
import { getProjectByApiKey, type Project } from '../db/queries'

type Env = {
  DB: D1Database
}

// Simple hash function for API keys (use crypto.subtle in production)
async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing API key' }, 401)
  }

  const apiKey = authHeader.slice(7)
  const hashedKey = await hashApiKey(apiKey)

  const project = await getProjectByApiKey(c.env.DB, hashedKey)

  if (!project) {
    return c.json({ error: 'Invalid API key' }, 401)
  }

  c.set('project', project)
  await next()
}
```

### Endpoints

#### `POST /email/send`
Send a transactional email.

```typescript
// Request
{
  "to": "user@example.com" | ["user1@example.com", "user2@example.com"],
  "subject": "Your inquiry",
  "html": "<h1>Hello</h1>",
  "replyTo": "sender@example.com"  // optional
}

// Response
{ "success": true, "messageId": "abc123" }
```

#### `POST /contacts`
Create or update a HubSpot contact.

```typescript
// Request
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "properties": [                    // optional
    { "property": "tier", "value": "Newsletter" }
  ]
}

// Response
{
  "success": true,
  "contact": {
    "id": "12345",
    "email": "user@example.com",
    "hubspotLink": "https://app.hubspot.com/contacts/..."
  },
  "created": true
}
```

#### `GET /contacts/search?email=user@example.com`
Find a contact by email.

```typescript
// Response
{
  "contact": {
    "id": "12345",
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "tier": "Newsletter;Warm"
  }
}
```

#### `POST /contacts/:id/properties`
Update contact properties.

```typescript
// Request
{
  "properties": [
    { "property": "tier", "value": "Client" },
    { "property": "interested_property_list", "value": "123 Main St" }
  ]
}

// Response
{ "success": true }
```

#### `POST /forms/contact`
High-level endpoint that handles full contact form flow (creates contact, sends notification email).

```typescript
// Request
{
  "name": "John Doe",
  "email": "user@example.com",
  "message": "I'm interested in...",
  "subscribeNewsletter": true,
  "propertyAddress": "123 Main St",   // optional
  "pageUrl": "https://site.com/contact" // optional
}

// Response
{
  "success": true,
  "message": "Thanks for reaching out!"
}
```

#### `POST /forms/newsletter`
Subscribe to newsletter.

```typescript
// Request
{
  "email": "user@example.com",
  "name": "John Doe"  // optional
}

// Response
{ "success": true }
```

#### `POST /forms/unsubscribe`
Unsubscribe from newsletter.

```typescript
// Request
{ "email": "user@example.com" }

// Response
{ "success": true }
```

#### `GET /vendors`
Fetch vendors from HubSpot (cached).

```typescript
// Response
{
  "vendors": [
    {
      "category": "Plumber",
      "company": "ABC Plumbing",
      "phone": "312-555-1234",
      "email": "info@abc.com"
    }
  ]
}
```

## Implementation Details

### Entry Point

```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { D1Database } from '@cloudflare/workers-types'
import { authMiddleware } from './middleware/auth'
import { loggingMiddleware } from './middleware/logging'
import emailRoutes from './routes/email'
import contactRoutes from './routes/contacts'
import formRoutes from './routes/forms'
import vendorRoutes from './routes/vendors'

// Define environment bindings
type Env = {
  DB: D1Database
  ENCRYPTION_KEY: string
}

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use('*', cors())
app.use('*', loggingMiddleware)

// Health check (no auth)
app.get('/health', (c) => c.json({ status: 'ok' }))

// Protected routes
app.use('/email/*', authMiddleware)
app.use('/contacts/*', authMiddleware)
app.use('/forms/*', authMiddleware)
app.use('/vendors/*', authMiddleware)

app.route('/email', emailRoutes)
app.route('/contacts', contactRoutes)
app.route('/forms', formRoutes)
app.route('/vendors', vendorRoutes)

export default app
```

### Email Service

```typescript
// src/services/resend.ts
import { Resend } from 'resend'
import type { Project } from '../types'

export async function sendEmail(
  project: Project,
  options: {
    to: string | string[]
    subject: string
    html: string
    replyTo?: string
  }
) {
  const resend = new Resend(project.resend_api_key)

  const { data, error } = await resend.emails.send({
    from: project.from_email,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  })

  if (error) {
    throw new Error(error.message)
  }

  return { messageId: data?.id }
}
```

### HubSpot Service

Port the existing `lib/hubspot.ts` with these modifications:

1. Accept `hubspotApiKey` as parameter instead of reading from `process.env`
2. Accept `hubspotClientId` for building contact links
3. Keep all existing functions: `searchContactByEmail`, `createContact`, `updateContactProperties`, etc.

```typescript
// src/services/hubspot.ts
import type { Project } from '../types'

const HUBSPOT_API_BASE = 'https://api.hubapi.com'

export class HubSpotClient {
  private apiKey: string
  private clientId: string

  constructor(project: Project) {
    if (!project.hubspot_api_key) {
      throw new Error('HubSpot not configured for this project')
    }
    this.apiKey = project.hubspot_api_key
    this.clientId = project.hubspot_client_id || ''
  }

  async searchContactByEmail(email: string) {
    // ... existing implementation with this.apiKey
  }

  async addContact(options: AddContactOptions) {
    // ... existing implementation
  }

  buildContactLink(contactId: string) {
    return `https://app.hubspot.com/contacts/${this.clientId}/record/0-1/${contactId}`
  }

  // ... rest of methods
}
```

### Forms Route (Orchestration)

```typescript
// src/routes/forms.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { sendEmail } from '../services/resend'
import { HubSpotClient } from '../services/hubspot'
import type { Project } from '../types'

const forms = new Hono()

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  subscribeNewsletter: z.boolean().optional(),
  propertyAddress: z.string().optional(),
  pageUrl: z.string().url().optional(),
})

forms.post('/contact', zValidator('json', contactFormSchema), async (c) => {
  const project = c.get('project') as Project
  const data = c.req.valid('json')

  const [firstName, ...lastParts] = data.name.trim().split(/\s+/)
  const lastName = lastParts.join(' ')

  // Create/update HubSpot contact
  const hubspot = new HubSpotClient(project)
  const { contact } = await hubspot.addContact({
    email: data.email,
    firstName,
    lastName,
  })

  // Update properties
  const properties = [
    { property: 'tier', value: project.default_tier },
  ]
  if (data.subscribeNewsletter) {
    properties.push({ property: 'tier', value: 'Newsletter' })
  }
  if (data.propertyAddress) {
    properties.push({ property: 'interested_property_list', value: data.propertyAddress })
  }
  await hubspot.updateContactProperties(contact.id, properties)

  // Send notification email
  const hubspotLink = hubspot.buildContactLink(contact.id)
  await sendEmail(project, {
    to: project.notification_emails,
    replyTo: data.email,
    subject: `New inquiry from ${data.name}${data.propertyAddress ? ` - ${data.propertyAddress}` : ''}`,
    html: `
      <h2>New Contact Form Submission</h2>
      ${data.pageUrl ? `<p><em>Submitted from: <a href="${data.pageUrl}">${data.pageUrl}</a></em></p>` : ''}
      <hr>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><strong>Newsletter signup:</strong> ${data.subscribeNewsletter ? 'Yes' : 'No'}</p>
      <p><strong>HubSpot contact:</strong> <a href="${hubspotLink}">${hubspotLink}</a></p>
    `,
  })

  return c.json({
    success: true,
    message: "Thanks for reaching out! We'll be in touch soon.",
  })
})

export default forms
```

## Client SDK (Optional)

Create a lightweight TypeScript client for consuming projects:

```typescript
// @yourusername/services-client

export class ServicesClient {
  private baseUrl: string
  private apiKey: string

  constructor(options: { apiKey: string; baseUrl?: string }) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl || 'https://services.yourdomain.com'
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || `HTTP ${res.status}`)
    }

    return res.json()
  }

  async submitContactForm(data: ContactFormData) {
    return this.fetch('/forms/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async sendEmail(data: EmailData) {
    return this.fetch('/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async addContact(data: AddContactData) {
    return this.fetch('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getVendors() {
    return this.fetch('/vendors')
  }
}
```

Usage in a Next.js project:

```typescript
// lib/services.ts
import { ServicesClient } from '@yourusername/services-client'

export const services = new ServicesClient({
  apiKey: process.env.SERVICES_API_KEY!,
})

// app/actions.ts
'use server'
import { services } from '@/lib/services'

export async function submitContactForm(data: FormData) {
  return services.submitContactForm({
    name: data.get('name') as string,
    email: data.get('email') as string,
    message: data.get('message') as string,
  })
}
```

## Migration Path

### Phase 1: Deploy API
1. Create new repo `shared-services-api`
2. Set up Hono + Cloudflare Workers with Wrangler
3. Create D1 database: `wrangler d1 create services-db`
4. Run schema migrations: `wrangler d1 execute services-db --file=./src/db/schema.sql`
5. Port `lib/hubspot.ts` and `lib/email.ts` to services
6. Implement all routes
7. Deploy: `wrangler deploy`

### Phase 2: Create Client SDK
1. Create `@yourusername/services-client` package
2. Publish to npm (private or public)
3. Add types for all endpoints

### Phase 3: Migrate PorterGoldberg
1. Add `SERVICES_API_KEY` to env
2. Replace `lib/hubspot.ts` calls with SDK
3. Replace `lib/email.ts` calls with SDK
4. Update `app/actions.ts` to use SDK
5. Test thoroughly
6. Remove old lib files

### Phase 4: Onboard New Projects
1. Add project record to D1:
   ```bash
   wrangler d1 execute services-db --command="INSERT INTO projects (...) VALUES (...)"
   ```
2. Or create an admin endpoint to add projects via API
3. Install SDK in new project
4. Use SDK in server actions

## Environment Variables

### API Service (Cloudflare Workers)

D1 bindings are configured in `wrangler.toml`, not environment variables:

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "services-db"
database_id = "<from wrangler d1 create>"
```

For secrets (encryption key for stored API keys):

```bash
# Set secrets via Wrangler CLI
wrangler secret put ENCRYPTION_KEY
```

### Client Projects
```env
SERVICES_API_KEY=sk_live_xxx
SERVICES_API_URL=https://services.yourdomain.com  # optional, has default
```

## Security Considerations

1. **API Key Hashing**: Store hashed API keys in database, not plaintext
2. **Credential Encryption**: Encrypt stored HubSpot/Resend keys at rest
3. **Rate Limiting**: Implement per-project rate limits (e.g., 100 req/min)
4. **CORS**: Restrict to known origins or use server-side only
5. **Input Validation**: Use Zod for all request validation
6. **Logging**: Log requests but redact sensitive data (emails, keys)

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Cloudflare Workers | 100k req/day | $5/mo for 10M req |
| Cloudflare D1 | 5GB storage, 25M reads/mo, 50k writes/day | $0.75/M reads, $1/M writes |
| Resend | 100 emails/day | $20/mo for 50k |
| **Total** | **$0 for low traffic** | **~$25/mo** |

All on one platform (Cloudflare) = simpler billing and management.

## Versioning Strategy

### Your API Versioning

Use URL path versioning for clarity:

```
https://services.yourdomain.com/v1/contacts
https://services.yourdomain.com/v2/contacts
```

**Implementation:**

```typescript
// src/index.ts
import { Hono } from 'hono'
import v1Routes from './routes/v1'
import v2Routes from './routes/v2'

const app = new Hono()

app.route('/v1', v1Routes)
app.route('/v2', v2Routes)

// Redirect unversioned to latest stable
app.get('/contacts/*', (c) => c.redirect(`/v1${c.req.path}`))
```

**Directory structure with versioning:**

```
src/
├── routes/
│   ├── v1/
│   │   ├── index.ts
│   │   ├── contacts.ts
│   │   ├── email.ts
│   │   └── forms.ts
│   └── v2/
│       ├── index.ts
│       └── contacts.ts   # New version with breaking changes
├── services/
│   ├── hubspot/
│   │   ├── v3.ts         # HubSpot CRM v3 API
│   │   └── v4.ts         # HubSpot CRM v4 API (associations, etc.)
│   └── resend.ts
```

### HubSpot API Version Handling

HubSpot has multiple API versions (v3, v4 for associations). Handle this internally:

```typescript
// src/services/hubspot/client.ts
import { HubSpotV3 } from './v3'
import { HubSpotV4 } from './v4'
import type { Project } from '../../types'

export class HubSpotClient {
  public v3: HubSpotV3
  public v4: HubSpotV4

  constructor(project: Project) {
    const apiKey = project.hubspot_api_key
    if (!apiKey) throw new Error('HubSpot not configured')

    this.v3 = new HubSpotV3(apiKey, project.hubspot_client_id)
    this.v4 = new HubSpotV4(apiKey)
  }
}

// src/services/hubspot/v3.ts
const HUBSPOT_V3_BASE = 'https://api.hubapi.com/crm/v3'

export class HubSpotV3 {
  constructor(private apiKey: string, private clientId: string) {}

  async searchContactByEmail(email: string) {
    const response = await fetch(`${HUBSPOT_V3_BASE}/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{ propertyName: 'email', operator: 'EQ', value: email.toLowerCase() }]
        }],
        properties: ['email', 'firstname', 'lastname', 'tier'],
      }),
    })
    // ...
  }

  async createContact(email: string, firstName: string, lastName: string) { /* ... */ }
  async updateContactProperties(contactId: string, properties: Property[]) { /* ... */ }
}

// src/services/hubspot/v4.ts
const HUBSPOT_V4_BASE = 'https://api.hubapi.com/crm/v4'

export class HubSpotV4 {
  constructor(private apiKey: string) {}

  async getContactAssociations(contactId: string, toObjectType: string) {
    const response = await fetch(
      `${HUBSPOT_V4_BASE}/objects/contacts/${contactId}/associations/${toObjectType}`,
      { headers: { 'Authorization': `Bearer ${this.apiKey}` } }
    )
    // ...
  }

  async createAssociation(fromId: string, toId: string, type: string) { /* ... */ }
}
```

**Usage in routes:**

```typescript
// src/routes/v1/contacts.ts
import { HubSpotClient } from '../../services/hubspot/client'

contacts.get('/:id/deals', async (c) => {
  const project = c.get('project')
  const hubspot = new HubSpotClient(project)

  // Use v4 for associations
  const associations = await hubspot.v4.getContactAssociations(c.req.param('id'), 'deals')

  // Use v3 for fetching deal details
  const deals = await hubspot.v3.batchGetDeals(associations.map(a => a.toObjectId))

  return c.json({ deals })
})
```

### Per-Project API Version Override

Allow projects to opt into specific versions via database config. Add columns to schema:

```sql
-- Add to src/db/schema.sql or run as migration
ALTER TABLE projects ADD COLUMN api_version TEXT DEFAULT 'v1';
ALTER TABLE projects ADD COLUMN hubspot_api_version TEXT DEFAULT 'v3';
```

```typescript
// Middleware to route based on project's preferred version
app.use('/contacts/*', async (c, next) => {
  const project = c.get('project')
  const preferredVersion = project.api_version || 'v1'

  // Rewrite path if no version specified
  if (!c.req.path.match(/^\/v\d+\//)) {
    return c.redirect(`/${preferredVersion}${c.req.path}`)
  }

  await next()
})
```

### Deprecation Strategy

1. **Announce deprecation** 3 months before removing old version
2. **Add `Deprecation` header** to responses from old versions:
   ```typescript
   c.header('Deprecation', 'true')
   c.header('Sunset', 'Sat, 01 Jan 2026 00:00:00 GMT')
   c.header('Link', '</v2/contacts>; rel="successor-version"')
   ```
3. **Log usage** of deprecated endpoints for migration tracking
4. **Never remove** v1 without migrating all active projects

## Open Questions

1. **Domain**: Where to host? `api.yourdomain.com` or `services.yourdomain.com`?
2. **Additional services**: Any other services to include? (e.g., file uploads via R2, webhooks)
3. **Multi-HubSpot**: Should each project be able to have multiple HubSpot portals?
4. **Admin UI**: Build a simple admin dashboard for managing projects, or just use Wrangler CLI + direct D1 queries?
