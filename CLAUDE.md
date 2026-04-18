# Porter Goldberg Residential

React/Next.js real estate website with Sanity CMS.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript
- **CMS**: Sanity v5 (standalone studio)
- **Styling**: Plain CSS (`styles/globals.css`)

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── About.tsx
│   ├── Listings.tsx
│   ├── Testimonials.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── index.ts
├── lib/
│   ├── data.ts                 # Static content (migrate to Sanity)
│   ├── client.ts               # Sanity client
│   └── queries.ts              # GROQ queries
├── studio/                     # STANDALONE Sanity Studio
│   ├── schemas/                # Content schemas
│   ├── sanity.config.js
│   ├── sanity.cli.js
│   └── package.json            # Separate dependencies
├── styles/
│   └── globals.css
└── types/
    └── index.ts                # TypeScript types
```

## Code Standards

- **NEVER use `any` type** - look up types rather than guessing
- **Throw errors early** - no fallbacks, we are in pre-production
- **Break code when refactoring** - do not maintain backwards compatibility

## Running Locally

**Next.js App:**
```bash
npm install
npm run dev
# → http://localhost:3000
```

**Sanity Studio (separate terminal):**
```bash
cd studio
npm install
npm run dev
# → http://localhost:3333
```

## Deployed Studio

**Live**: https://portergoldberg.sanity.studio/

Deploy changes:
```bash
cd studio && npm run deploy
```

## Sanity Schemas

| Schema | Type | Description |
|--------|------|-------------|
| `listing` | document | Properties with address, price, status |
| `testimonial` | document | Client quotes for carousel |
| `agent` | document | Team member profiles |
| `siteSettings` | singleton | Hero, stats, about section |
| `sellingProcess` | singleton | Our Process page |
| `aboutPage` | singleton | About page content |

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=mw8duas2
NEXT_PUBLIC_SANITY_DATASET=production
```

## Sanity Project Info

- **Project ID**: `mw8duas2`
- **Dataset**: `production`
- **Studio URL**: https://portergoldberg.sanity.studio/

## Fetching Content from Sanity

```ts
import { client } from '@/lib/client'

// Example query
const listings = await client.fetch(`*[_type == "listing"] | order(order asc)`)
```
