# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start Next.js (localhost:3000)
npm run dev:clean        # Clear .next cache and start
cd studio && npm run dev # Start Sanity Studio (localhost:3333)

# Quality
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run build            # Production build

# Testing
npm run test             # Playwright tests
npm run test:screenshots # Screenshot tests only

# Sanity Studio deployment
cd studio && npm run deploy
```

## Code Standards

- **NEVER use `any` type** - look up types rather than guessing
- **Throw errors early** - no fallbacks, we are in pre-production
- **Break code when refactoring** - do not maintain backwards compatibility

## Architecture

### Data Flow Pattern

All CMS content flows through a single pattern:
1. **GROQ queries** defined in `lib/queries.ts` using `defineQuery()` from next-sanity
2. **Sanity client** in `lib/client.ts` executes queries with CDN in production
3. **Types** in `types/index.ts` match query return shapes
4. **Pages** are async Server Components that fetch and render directly

Example pattern:
```typescript
// lib/queries.ts - define query
export const MY_QUERY = defineQuery(`*[_type == "myType"]{...}`)

// app/page.tsx - fetch in Server Component
const data = await client.fetch<MyType[]>(MY_QUERY)
```

### Image Handling

All Sanity image queries use `imageFragment` from `lib/queries.ts`:
```groq
asset->{ _id, url, metadata { lqip, dimensions } }, alt
```

Use `SanityImage` type from `types/index.ts` for image fields.

### Global Layout Data

`app/layout.tsx` fetches agents at the root level and passes to:
- `Footer` - displays agent contact info
- `ConnectForm` - flyout contact form with agent selection

### Static Data

`lib/data.ts` contains:
- `NAV_ITEMS` - navigation structure (hardcoded, not CMS)
- `STATS`, `HERO`, `ABOUT` - fallback content
- `VENDORS` - large static vendor list (not from CMS)

### ISR Revalidation

Pages use `export const revalidate = 86400` (24 hours).
On-demand revalidation via `/api/revalidate` webhook from Sanity (requires `SANITY_REVALIDATE_SECRET` header).

## Sanity

**Project ID**: `mw8duas2` | **Dataset**: `production`

Studio is standalone in `/studio` with separate `package.json`.

### Singleton vs Collection Schemas

**Singletons** (one instance, fetched with `[0]`):
- `siteSettings`, `home`, `buyPage`, `sellingPage`, `aboutPage`, `schoolGuidancePage`

**Collections** (multiple documents):
- `listing`, `testimonial`, `agent`, `event`, `newsletter`, `vendor`

### Key Schema Fields

- `listing.statusType`: `'active' | 'coming' | 'sold'` - determines filtering
- `listing.featured`: boolean - shows on homepage
- `listing.isHalcyonProject`: boolean - shows on Halcyon page
- `testimonial.pinOnHomePage`: boolean - prioritized on homepage

## Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=mw8duas2
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=       # Server-side fetches
SANITY_REVALIDATE_SECRET=    # Webhook auth
```
