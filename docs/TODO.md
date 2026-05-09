# TODO

## Content Migration

### Newsletter Archive Migration to Sanity
- [x] Review the newsletter archive file/content from old WordPress site
- [x] Identify all newsletter entries that need to be migrated
- [x] Create newsletter documents in Sanity for each archived issue (12 created from WWT images)
- [x] Add proper metadata (title, publishedAt, summary, etc.)
- [ ] Upload and link associated images to Sanity assets
- [ ] Verify all newsletters display correctly on /newsletters page
- [ ] Add HubSpot URLs where applicable
- [ ] Review links in newsletter emails - header and footer images don't link to portergoldberg.com

## Backlinks & SEO

### UTM Tracking
- [x] Add UTM parameters to all external links
  - utm_source=pg-chicago
  - utm_medium=website
  - utm_campaign varies by context (event-registration, listing-brochure, vendor-referral, etc.)

### Backlink Monitoring
- [ ] Set up backlink tracking/monitoring
- [ ] Document key referral partnerships

## Pre-Production

### Sanity Webhook
- [ ] Update Sanity webhook URL from Vercel preview to production
  - Current: `https://portergoldberg-8gswvz38b-david-adams-projects-10b3477a.vercel.app/`
  - Change to: `https://portergoldberg.com/api/revalidate`
  - Update at: sanity.io/manage → Project → API → Webhooks
