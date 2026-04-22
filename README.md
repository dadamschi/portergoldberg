# Porter Goldberg Residential

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
│   ├── selling/page.tsx
│   ├── testimonials/page.tsx
│   ├── vendors/page.tsx
│   └── api/
│       ├── connect/route.ts        # Contact form submissions
│       ├── revalidate/route.ts     # Sanity webhook revalidation
│       ├── subscribe/route.ts      # Newsletter signup
│       └── vendor-list/route.ts    # Vendor list signup
│
├── components/
│   ├── AgentCard.tsx               # Reusable agent/CTA banner
│   ├── About.tsx                   # About section
│   ├── ConnectForm.tsx             # Flyout contact form
│   ├── Contact.tsx                 # Contact section
│   ├── ContactForm.tsx             # Contact form component
│   ├── ContactPageForm.tsx         # Contact page form
│   ├── Flipbook.tsx                # Interactive flipbook viewer
│   ├── Footer.tsx                  # Site footer
│   ├── Hero.tsx                    # Homepage hero
│   ├── ImageLightbox.tsx           # Image gallery lightbox
│   ├── ImageModal.tsx              # Image modal
│   ├── JsonLd.tsx                  # Schema.org markup
│   ├── ListingCard.tsx             # Property listing card
│   ├── Nav.tsx                     # Main navigation
│   ├── Newsletter.tsx              # Newsletter signup section
│   ├── SocialLinks.tsx             # Social media links
│   ├── Stats.tsx                   # Animated statistics
│   ├── Testimonials.tsx            # Testimonial carousel
│   ├── home/Listings.tsx           # Homepage listings
│   └── index.ts                    # Component exports
│
├── lib/
│   ├── client.ts                   # Sanity client config
│   ├── queries.ts                  # GROQ queries
│   ├── data.ts                     # Navigation & fallback data
│   ├── portableText.tsx            # Portable Text config
│   └── utils/
│       ├── dateTime.tsx            # Date formatting
│       └── numbers.tsx             # Number formatting
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
├── tests/
│   └── screenshots.spec.ts         # Playwright screenshot tests
│
├── types/
│   └── index.ts                    # TypeScript types
│
├── public/                         # Static assets
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
| `aboutPage` | About page content |
| `schoolGuidancePage` | School guidance content |

**Collection Documents** (multiple instances):

| Type | Description |
|------|-------------|
| `listing` | Property listings with address, price, status, images, brochure |
| `testimonial` | Client quotes with optional homepage pin |
| `agent` | Team member profiles with bio |
| `event` | Events with dates, speakers, sessions, replay URLs |
| `newsletter` | Newsletter archives with flipbook images |
| `vendor` | Trusted vendor directory |

### Deploying Studio Changes

```bash
cd studio && npm run deploy
```

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/connect` | POST | Contact form submissions (name, email, message) |
| `/api/revalidate` | POST | Sanity webhook for ISR cache revalidation |
| `/api/subscribe` | POST | Newsletter subscription signup |
| `/api/vendor-list` | POST | Vendor list signup request |

The revalidate endpoint requires a `SANITY_REVALIDATE_SECRET` header for authentication.

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

Screenshot tests capture all major pages and save to `/screenshots/`.

### Sanity Studio (from /studio)

```bash
npm run dev          # Local studio (localhost:3333)
npm run build        # Build studio
npm run deploy       # Deploy to portergoldberg.sanity.studio
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
| API Version | `2026-02-01` |
| Studio URL | https://portergoldberg.sanity.studio/ |

## Code Standards

- **Never use `any` type** - use proper TypeScript types
- **Throw errors early** - no fallbacks in pre-production
- **Break code when refactoring** - no backwards compatibility requirements
