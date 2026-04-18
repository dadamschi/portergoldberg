# Porter Goldberg - Sanity Studio

Content management for [portergoldberg.com](https://portergoldberg.com)

## Quick Start

```bash
npm install
npm run dev
```

Studio runs at http://localhost:3333

## Deployed Studio

**Live URL**: https://portergoldberg.sanity.studio/

## Project Details

- **Project ID**: `mw8duas2`
- **Dataset**: `production`
- **Framework**: Sanity v5

## Content Types

| Type | Description |
|------|-------------|
| **Listings** | Property listings with address, price, status, images |
| **Testimonials** | Client quotes for homepage carousel |
| **Agents** | Team member profiles (Samantha & Lauren) |
| **Site Settings** | Hero, stats, about section, social links |
| **Selling Process** | "Our Process" page content |
| **About Page** | Team bios and company info |

## Commands

```bash
npm run dev      # Start local studio
npm run build    # Build for production
npm run deploy   # Deploy to sanity.studio
```

## Schema Files

All schemas are in `/schemas/`:
- `listing.js` - Property listings
- `testimonial.js` - Client testimonials
- `agent.js` - Team members
- `siteSettings.js` - Global site config
- `sellingProcess.js` - Selling process page
- `aboutPage.js` - About page content

## Making Schema Changes

1. Edit the schema file in `/schemas/`
2. Run `npm run dev` to test locally
3. Run `npm run deploy` to push changes live

## Related Projects

- **Next.js Frontend**: `../` (parent directory)
- **Production Site**: https://portergoldberg.com

## Support

Contact: [your email or Slack]
