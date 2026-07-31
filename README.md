# PorterGoldberg Residential

Chicago luxury real estate website built with Next.js 15 and Sanity CMS.

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd portergoldberg

# Install Next.js app
npm install

# Install Sanity Studio
cd studio && npm install && cd ..
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (`mw8duas2`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (`production`) |
| `SANITY_API_READ_TOKEN` | API token for server-side fetches |
| `SANITY_REVALIDATE_SECRET` | Secret for webhook revalidation |
| `HUBSPOT_API_KEY` | HubSpot API key for contact management |

Optional environment variables:

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Fine-grained PAT for error tracking via GitHub Issues |
| `RESEND_API_KEY` | Resend API key (optional, for transactional emails) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP config for contact form emails |
| `SMTP_FROM_EMAIL` | Sender email for SMTP |
| `CONTACT_EMAIL` | Primary recipient for contact form |
| `CONTACT_CC_EMAIL` | CC recipient for contact form submissions |

### 3. Run Locally

**Terminal 1 - Next.js App:**
```bash
npm run dev
# → http://localhost:3000
```

**Terminal 2 - Sanity Studio:**
```bash
cd studio && npm run dev
# → http://localhost:3333
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 19, TypeScript 5.7 |
| **CMS** | Sanity v5 (standalone studio) |
| **Email** | Nodemailer/SMTP (contact forms), Resend (optional) |
| **Error Tracking** | GitHub Issues (automatic) |
| **CRM** | HubSpot (contact/newsletter management) |
| **Styling** | Plain CSS with CSS variables |
| **Testing** | Playwright (screenshot tests) |
| **Linting** | ESLint 9 (flat config) |

## Project Structure

```
portergoldberg/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Homepage
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── not-found.tsx               # 404 page (creates GitHub issue)
│   ├── error.tsx                   # Error page
│   ├── global-error.tsx            # Root error page
│   ├── about-us/page.tsx
│   ├── buying/page.tsx
│   ├── client-resources/page.tsx
│   ├── contact/page.tsx
│   ├── events/page.tsx
│   ├── halcyon-development/
│   │   ├── page.tsx
│   │   └── components.tsx
│   ├── inventory/page.tsx
│   ├── newsletters/
│   │   ├── page.tsx                # Newsletter archive
│   │   └── [slug]/page.tsx         # Newsletter detail
│   ├── press/page.tsx
│   ├── selling/page.tsx
│   ├── testimonials/page.tsx
│   ├── vendors/page.tsx
│   ├── actions.ts                  # Server Actions (contact form)
│   └── api/
│       ├── error-notify/route.ts   # Error → GitHub Issues
│       ├── revalidate/route.ts     # Sanity webhook revalidation
│       ├── subscribe/route.ts      # Newsletter signup
│       ├── unsubscribe/route.ts    # Newsletter unsubscribe
│       └── vendor-list/route.ts    # Vendor list signup
│
├── components/
│   ├── ConnectForm.tsx             # Flyout contact form
│   ├── Footer.tsx                  # Site footer
│   ├── Hero.tsx                    # Homepage hero
│   ├── ListingCard.tsx             # Property listing card
│   ├── Nav.tsx                     # Main navigation
│   ├── Newsletter.tsx              # Newsletter signup section
│   ├── Testimonials.tsx            # Testimonial carousel
│   ├── TestimonialsList.tsx        # Testimonials page list
│   └── ...                         # Other components
│
├── lib/
│   ├── client.ts                   # Sanity client config
│   ├── queries.ts                  # GROQ queries
│   ├── data.ts                     # Navigation & static data
│   ├── email.ts                    # SMTP email sending
│   ├── github.ts                   # GitHub Issues API
│   ├── hubspot.ts                  # HubSpot API client
│   ├── portableText.tsx            # Portable Text config
│   ├── resend.ts                   # Resend client (optional)
│   └── utils/                      # Utility functions
│
├── middleware.ts                   # Captures URL for 404 tracking
│
├── studio/                         # Standalone Sanity Studio
│   ├── schemas/                    # Content type definitions
│   ├── deskStructure.js            # Custom desk structure
│   ├── sanity.config.js
│   └── package.json
│
├── styles/
│   └── globals.css                 # All site styling
│
├── types/
│   └── index.ts                    # TypeScript types
│
├── scripts/                        # Utility scripts
│   └── update-testimonial-order.ts # Bulk update testimonial order
│
├── public/                         # Static assets
│   ├── sitemap.xml                 # SEO sitemap
│   └── llms.txt                    # AI crawler directives
│
├── next.config.ts                  # Next.js config & redirects
├── tsconfig.json                   # TypeScript config
├── eslint.config.mjs               # ESLint flat config
├── playwright.config.ts            # Playwright config
└── CLAUDE.md                       # AI assistant instructions
```

## Sanity CMS

### Live Studio

https://portergoldberg.sanity.studio/

### Content Types

**Singleton Documents** (one instance each):

| Type | Description |
|------|-------------|
| `siteSettings` | Company name, hero text, stats, about section, social links |
| `home` | Homepage-specific content |
| `buyPage` | Buying page title, headline, flipbook images |
| `sellingPage` | Selling page sections (hero, marketing, prep, staging) |
| `halcyonPage` | Halcyon Development page content |
| `schoolGuidancePage` | School guidance content |

**Collection Documents** (multiple instances):

| Type | Description |
|------|-------------|
| `listing` | Property listings with address, price, status, images, brochure |
| `testimonial` | Client quotes with `order` field for custom sorting |
| `agent` | Team member profiles with bio |
| `event` | Events with dates, speakers, sessions, replay URLs |
| `newsletter` | Newsletter archives with flipbook images |
| `press` | Press mentions with logos and links |

### Testimonial Ordering

Testimonials use an `order` field for custom sorting:
- Lower numbers appear first
- New testimonials without an `order` appear at the TOP (sorted by creation date)
- Set `order` in Sanity Studio to position testimonials permanently

### Deploying Studio Changes

```bash
cd studio && npm run deploy
```

### Newsletter Layouts

Newsletters use date-based layout rendering:

- **Before July 27, 2026**: Side-by-side layout (`SideBySideLayout.tsx`) - legacy format
- **On/after July 27, 2026**: Stacked layout (`StackedLayout.tsx`) - matches exported email newsletter

**To deprecate the side-by-side layout** (when all newsletters use stacked):

1. Delete `components/newsletter/SideBySideLayout.tsx`
2. In `app/newsletters/[slug]/page.tsx`:
   - Remove `SideBySideLayout` import
   - Remove date check logic (lines 228-233)
   - Replace conditional rendering with: `<StackedLayout sections={newsletter.imageSections} />`

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/error-notify` | POST | Creates GitHub Issue for errors |
| `/api/revalidate` | POST | Sanity webhook for ISR cache revalidation |
| `/api/subscribe` | POST | Newsletter subscription (HubSpot) |
| `/api/unsubscribe` | POST | Newsletter unsubscribe (HubSpot) |
| `/api/vendor-list` | POST | Vendor list signup request |

The revalidate endpoint requires `x-revalidate-secret` header matching `SANITY_REVALIDATE_SECRET`.

## Error Tracking (GitHub Issues)

Errors are automatically tracked as GitHub Issues instead of email notifications.

**Setup:** Create a fine-grained PAT with `issues:write` permission on this repo, add as `GITHUB_TOKEN` env var.

**How it works:**
- 404 errors create issues titled `404: /path` with `bug/404` label
- Runtime errors create issues with `bug/runtime` label
- Global errors create issues with `bug/global-error` label
- Duplicate errors add comments to existing open issues instead of creating new ones
- Closing an issue resets tracking (new occurrence = new issue)

**Labels used:**
- `bug/404` - Page not found errors
- `bug/runtime` - Runtime errors in pages
- `bug/global-error` - Root layout errors

## Contact Form & HubSpot

Contact form submissions:
1. Send HTML email via SMTP to agent emails
2. Create/update contact in HubSpot with tier tracking
3. Optionally subscribe to newsletter and/or vendor list

HubSpot tiers track engagement level: `Newsletter`, `Warm`, `VendorList`, etc.

## URL Redirects

Configured in `next.config.ts`:

| From | To |
|------|-----|
| `/buy` | `/buying` |
| `/lets-connect` | `/contact` |
| `/our-trusted-vendors` | `/client-resources` |
| `/local-school-guidance` | `/client-resources` |

## Commands

### Next.js App

```bash
npm run dev           # Start dev server (localhost:3000)
npm run dev:clean     # Clear cache and start dev server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript compiler check
```

### Testing

```bash
npm run test              # Run all Playwright tests
npm run test:screenshots  # Run screenshot tests only
```

### Sanity Studio (from /studio)

```bash
npm run dev          # Local studio (localhost:3333)
npm run build        # Build studio
npm run deploy       # Deploy to portergoldberg.sanity.studio
```

### Cache Revalidation

Trigger on-demand revalidation:

```bash
curl -X POST "https://www.portergoldberg.com/api/revalidate" \
  -H "x-revalidate-secret: YOUR_SECRET"
```

## CSS Architecture

Styling uses plain CSS with CSS variables in `styles/globals.css`:

**Colors:**
- Primary: Navy (`#000035`), Sage (`#79a52c`), Teal (`#50b08a`), Gold (`#A8904E`)
- Neutrals: Black, Charcoal (`#1A1917`), Cream (`#F5F3EE`)

**Typography:**
- Primary: Quicksand (Google Fonts)
- Secondary: Nunito Sans, Proxima Nova

**Breakpoint:** 768px (mobile/desktop)

## Sanity Project Details

| Property | Value |
|----------|-------|
| Project ID | `mw8duas2` |
| Dataset | `production` |
| API Version | `2024-01-01` |
| Studio URL | https://portergoldberg.sanity.studio/ |

## Code Standards

- **Never use `any` type** - use proper TypeScript types
- **Throw errors early** - no fallbacks in pre-production
- **Break code when refactoring** - no backwards compatibility requirements
