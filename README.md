# Porter Goldberg Residential

Chicago luxury real estate website built with Next.js and Sanity CMS.

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

The project ID is already set. No changes needed for basic setup.

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

## Project Structure

```
portergoldberg/
├── app/                    # Next.js App Router pages
├── components/             # React components (Nav, Hero, Stats, etc.)
├── lib/
│   ├── client.ts          # Sanity client
│   ├── queries.ts         # GROQ queries
│   └── data.ts            # Static content (to be migrated)
├── studio/                # Sanity Studio (standalone)
│   ├── schemas/           # Content type definitions
│   ├── sanity.config.js
│   └── package.json       # Separate dependencies
├── styles/
│   └── globals.css        # Site styling
└── types/                 # TypeScript types
```

## Sanity CMS

### Live Studio
https://portergoldberg.sanity.studio/

### Content Types

| Type | Description |
|------|-------------|
| **Listings** | Property listings with address, price, status, images |
| **Testimonials** | Client quotes for homepage carousel |
| **Agents** | Samantha Porter & Lauren Goldberg profiles |
| **Site Settings** | Hero text, stats, about section |
| **Selling Process** | "Our Process" page content |
| **About Page** | Team bios and company info |

### Deploying Studio Changes

```bash
cd studio && npm run deploy
```

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage |
| `lib/data.ts` | Static content (migrate to Sanity) |
| `lib/client.ts` | Sanity client setup |
| `studio/schemas/` | Content model definitions |

## Commands

```bash
# Next.js
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server

# Studio (from /studio)
npm run dev          # Local studio
npm run deploy       # Deploy to sanity.studio
```

## Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **Sanity v5** - Headless CMS
- **TypeScript** - Type safety

## Sanity Project Details

- **Project ID**: `mw8duas2`
- **Dataset**: `production`
- **Studio URL**: https://portergoldberg.sanity.studio/
