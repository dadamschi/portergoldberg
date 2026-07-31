# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brand Guidelines

See **[BRAND.md](./BRAND.md)** for brand rules including:
- **PorterGoldberg** is always one word (never "Porter Goldberg")
- Team member names and titles
- Social media handles
- Legal disclaimer text

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
npx playwright test tests/screenshots.spec.ts --grep "homepage" # Run single test

# Utility Scripts
npm run check:sitemap    # Verify sitemap.xml is up-to-date
npx tsx scripts/<script-name>.ts  # Run TypeScript scripts directly (preferred)
npx ts-node scripts/<script-name>.ts  # Alternative script runner

# Sanity Studio deployment
cd studio && npm run deploy
```

## Before Pushing

- **Check `public/sitemap.xml`** - update if routes were added/removed/renamed
- **Check `public/llms.txt`** - update if site structure or content changed significantly

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

### Middleware

`middleware.ts` runs on all routes and:

- Sets `x-url` and `x-pathname` headers for server components (used for 404 tracking)
- Adds security headers (X-Content-Type-Options, X-Frame-Options, etc.)

## Sanity

**Project ID**: `mw8duas2` | **Dataset**: `production` | **API Version**: `2026-02-01`

Studio is standalone in `/studio` with separate `package.json`.

### Sanity Clients

Two clients are available in `lib/client.ts`:

- **`client`** - Read-only client for fetching data (uses `SANITY_API_READ_TOKEN`)
- **`writeClient`** - Write client for creating/updating documents (uses `SANITY_API_WRITE_TOKEN`, server-side only)

### Singleton vs Collection Schemas

**Singletons** (one instance, fetched with `[0]`):

- `siteSettings`, `home`, `buyPage`, `sellingPage`, `schoolGuidancePage`

**Collections** (multiple documents):

- `listing`, `testimonial`, `zillowReview`, `agent`, `event`, `newsletter`, `vendor`

### Key Schema Fields

- `listing.statusType`: `'active' | 'coming' | 'sold'` - determines filtering
- `listing.featured`: boolean - shows on homepage
- `listing.isHalcyonProject`: boolean - shows on Halcyon page
- `testimonial.pinOnHomePage`: boolean - prioritized on homepage

### Newsletter Images

Newsletter section images (`newsletter.imageSections[].image`) are displayed at **509x454 pixels (9:8 aspect ratio)** on the website.

**Important**: When cropping images in Sanity Studio for newsletters:
- Avoid using "Panorama" (16:9) preset - it will be distorted
- Use crop handles to create an approximately **9:8 ratio** (slightly wider than square)
- The aspect ratio is 509:454 = 1.12:1
- Crop and hotspot settings are respected via `components/newsletter/SectionImage.tsx`

### Newsletter Layouts

Newsletters use **date-based layout rendering**:
- **Before July 27, 2026**: Side-by-side layout (`components/newsletter/SideBySideLayout.tsx`) - legacy
- **On/after July 27, 2026**: Stacked layout (`components/newsletter/StackedLayout.tsx`) - matches exported email

The cutoff date is defined in `app/newsletters/[slug]/page.tsx:231`.

**Deprecation path**: When ready to remove side-by-side layout:
1. Delete `components/newsletter/SideBySideLayout.tsx`
2. In `app/newsletters/[slug]/page.tsx`: remove date check and always use `StackedLayout`

Routes:
- `/newsletters` - Archive page (grid of newsletter cards)
- `/newsletters/[slug]` - Individual newsletter detail page

## Email (Resend)

Transactional emails are sent via [Resend](https://resend.com).

**Domain**: `portergoldberg.com` (verified in Resend dashboard)

### How It Works

```text
Contact Form (ContactPageForm.tsx)
    → submitConnectForm() (app/actions.ts)
        → sendEmail() (lib/email.ts)
            → Resend API
```

### Key Files

- `lib/email.ts` - Resend client and `sendEmail()` function
- `lib/constants.ts` - `EMAIL_NOTIFICATION_RECIPIENTS` (where notifications go)
- `app/actions.ts` - Server action that sends contact form emails

### Configuration

- **From address**: `noreply@portergoldberg.com` (no real mailbox needed, just verified domain)
- **Reply-To**: Set to the submitter's email so replies go to them
- **Recipients**: `info@portergoldberg.com` in dev

### Environment Variable

```env
RESEND_API_KEY=              # Resend API key (required)
```

## Analytics & Tracking

Both tracking scripts are **production-only** (disabled on localhost) and configured in `app/layout.tsx`.

### Google Analytics (GA4)

- **Property**: PorterGoldberg Residential
- **Measurement ID**: `G-JX5PSVD7FM`
- **Owner**: dadams.chi@gmail.com
- **Dashboard**: [analytics.google.com](https://analytics.google.com)

### HubSpot Tracking

- **Portal ID**: `46095216`
- **Script**: `js.hs-scripts.com/46095216.js`
- **Dashboard**: [app.hubspot.com](https://app.hubspot.com)

CSP domains for HubSpot are configured in `next.config.ts` (script-src, connect-src, img-src, frame-src).

## HubSpot

**NEVER make changes to HubSpot (create properties, update contacts, create associations, etc.) without explicitly asking first.** Read-only operations (fetching contacts, listing properties) are fine.

Scripts in `scripts/` for HubSpot and data operations (run with `npx ts-node scripts/<name>.ts`):

- **Contact Management**: `export-hubspot-contacts.ts`, `find-duplicate-contacts.ts`, `generate-duplicate-report.ts`, `hubspot-associations.ts`, `list-hubspot-contacts.ts`
- **Property Management**: `create-team-property.ts`, `create-vendor-category-property.ts`, `create-contact-type-property.ts`, `check-property-usage.ts`
- **Vendors**: `populate-vendor-categories.ts`, `test-one-vendor.ts`
- **Testimonials**: `match-testimonials.ts`, `create-testimonial-mapping.ts`, `generate-review-token.ts`, `generate-review-links.ts`
- **Listings**: `update-sold-listings.ts`, `merge-sold-listings.ts`
- **Deals/Pipelines**: `list-pipelines.ts`, `list-deals.ts`, `analyze-deal-properties.ts`, `get-pipeline-config.ts`, `get-pipeline-details.ts`
- **Newsletters**: `sync-newsletter-to-hubspot.ts`, `update-newsletter-content.ts`
- **Other**: `check-sitemap.ts`, `fetch-google-reviews.ts`

## Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=mw8duas2
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=       # Server-side fetches (read-only)
SANITY_API_WRITE_TOKEN=      # Server-side writes (creating/updating documents)
SANITY_REVALIDATE_SECRET=    # Webhook auth
HUBSPOT_API_KEY=             # HubSpot API access
RESEND_API_KEY=              # Resend email API
```
