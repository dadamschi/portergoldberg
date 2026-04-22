# Porter Goldberg Residential

React/Next.js real estate website with Sanity CMS.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript
- **CMS**: Sanity v5 (standalone studio)
- **Styling**: Plain CSS (`styles/globals.css`)
- **Testing**: Playwright (screenshots)
- **Linting**: ESLint 9 (flat config)

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage
│   ├── about-us/
│   ├── buying/
│   ├── client-resources/
│   ├── contact/
│   ├── events/
│   ├── halcyon-development/
│   ├── inventory/
│   ├── newsletters/
│   │   └── [slug]/
│   ├── selling/
│   ├── testimonials/
│   ├── vendors/
│   └── api/
│       ├── connect/                # Contact form submissions
│       ├── revalidate/             # Sanity webhook revalidation
│       ├── subscribe/              # Newsletter signup
│       └── vendor-list/            # Vendor list signup
├── components/
│   ├── AgentCard.tsx               # Reusable agent/CTA banner
│   ├── ConnectForm.tsx             # Flyout contact form
│   ├── Flipbook.tsx                # Newsletter flipbook viewer
│   ├── Hero.tsx                    # Homepage hero with stats
│   ├── ImageLightbox.tsx           # Image gallery lightbox
│   ├── ListingCard.tsx             # Property listing card
│   ├── Nav.tsx                     # Main navigation
│   ├── Newsletter.tsx              # Newsletter signup section
│   ├── Footer.tsx
│   └── index.ts
├── lib/
│   ├── client.ts                   # Sanity client
│   ├── queries.ts                  # GROQ queries
│   ├── data.ts                     # Static fallback content
│   └── utils/
│       ├── dateTime.tsx            # Date formatting
│       └── numbers.tsx             # Number formatting
├── studio/                         # STANDALONE Sanity Studio
│   ├── schemas/
│   ├── sanity.config.js
│   └── package.json
├── styles/
│   └── globals.css
├── tests/
│   └── screenshots.spec.ts         # Playwright screenshot tests
└── types/
    └── index.ts
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

**Run Tests:**
```bash
npm run test           # Run Playwright tests
npm run test:ui        # Playwright UI mode
```

**Lint:**
```bash
npm run lint
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
| `testimonial` | document | Client quotes |
| `agent` | document | Team member profiles |
| `event` | document | Upcoming events |
| `newsletter` | document | Newsletter archives |
| `vendor` | document | Trusted vendors |
| `siteSettings` | singleton | Global site settings |
| `home` | singleton | Homepage content |
| `sellingPage` | singleton | Selling/Our Process page |
| `buyPage` | singleton | Buying page |
| `aboutPage` | singleton | About page content |
| `schoolGuidancePage` | singleton | School guidance content |

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

## URL Redirects

Configured in `next.config.ts`:
- `/buy` → `/buying`
- `/lets-connect` → `/contact`
- `/our-trusted-vendors` → `/client-resources`
- `/local-school-guidance` → `/client-resources`
