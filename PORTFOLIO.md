# Web Development Services Portfolio

Based on the PorterGoldberg Residential project.

---

## Full-Stack Development

- **Next.js 15 App Router** with React Server Components
- **TypeScript** strict mode throughout
- **ISR caching** with on-demand revalidation webhooks
- **Custom CSS** with BEM methodology

---

## Headless CMS Integration (Sanity)

- Custom schema design (singletons, collections)
- GROQ query optimization with `defineQuery()`
- Portable Text rich content rendering
- Image optimization with LQIP placeholders
- Studio deployment and management
- On-demand content revalidation via webhooks

---

## CRM Integration (HubSpot)

- Contact management and tier tagging
- Deal tracking and associations
- Custom property creation
- Webhook-driven workflows (review link generation)
- Duplicate detection and data cleanup scripts
- Batch operations with pagination

---

## Interactive UI Components

- **Image lightbox** with 4x magnifying lens and hover tracking
- **Flipbook** with HTML5 page-flipping animation
- **Vendor search** with real-time filtering and category grouping
- **Before/after galleries** with modal comparison
- **Flyout contact form** with URL parameter integration
- **Listing grids** with responsive 3/4 column layouts
- **Newsletter toast** notifications

---

## Forms & Automation

- Math CAPTCHA spam prevention
- JWT token-based secure submission links (HMAC-SHA256)
- Multi-step form validation
- Email notifications (Nodemailer SMTP + Resend)
- Slack error notifications with rich formatting
- HubSpot contact creation on form submit

---

## SEO & Performance

- JSON-LD structured data (LocalBusiness, Events, Organization, FAQPage)
- Dynamic Open Graph metadata generation
- Sitemap validation script with auto-fix on commit
- Security headers (CSP, HSTS, XSS protection, Permissions Policy)
- 24-hour ISR with webhook revalidation
- Image CDN optimization

---

## Real Estate Specific Features

- Listing management (active/coming/sold status filtering)
- Featured listing ordering
- Agent profiles with contact routing
- Newsletter archive with HubSpot subscription management
- Event/webinar system with registration and replay URLs
- Testimonial collection via secure token links
- Vendor network directory with search
- School guidance resources
- Property prep and staging galleries

---

## DevOps & Tooling

- Pre-commit hooks for sitemap validation
- Playwright visual regression testing
- ESLint and TypeScript checks
- HubSpot data management scripts:
  - Contact export and duplicate detection
  - Association management
  - Custom property creation
- WordPress media migration tools
- Sanity schema deployment

---

## Security Implementation

- JWT tokens with 7-day expiration
- HMAC-SHA256 signed review tokens
- Content Security Policy (CSP) with allowlists
- HSTS with preload (63 days)
- X-Frame-Options, X-XSS-Protection headers
- Permissions Policy (camera/microphone/geolocation restrictions)
- Bearer token authentication for webhooks

---

## API Development

- RESTful endpoints for form submissions
- Webhook receivers for CRM integration
- On-demand ISR revalidation endpoint
- Secure testimonial submission with token verification
- Newsletter subscribe/unsubscribe endpoints
- Error notification routing

---

## Key Technical Patterns

| Pattern | Implementation |
|---------|----------------|
| Data fetching | Server Components with Sanity client |
| Image handling | Sanity CDN + Next.js Image + LQIP |
| Forms | Server actions with HubSpot + email |
| Authentication | JWT/HMAC tokens (stateless) |
| Caching | ISR 24h + on-demand revalidation |
| Error handling | Slack notifications + structured logging |
| Type safety | TypeScript + Sanity schema types |

---

## Pages Built

- Homepage with featured listings and testimonials
- Inventory (active, coming soon, sold listings)
- Buying/Selling service pages
- Events with upcoming/past filtering
- Newsletter archive with detail pages
- Press/media coverage
- Contact with agent routing
- Vendor directory with search
- School guidance resources
- Client portal pages (dynamic markdown)
- Testimonial submission (token-protected)

---

## Business Value Delivered

- **Automation**: Review link generation, contact routing, newsletter subscription
- **Data integrity**: CRM synchronization, duplicate detection
- **Performance**: Optimized images, ISR caching, CDN delivery
- **Security**: Headers, CSP, token-based auth, spam prevention
- **Scalability**: Serverless functions, headless CMS, edge caching
- **Maintainability**: TypeScript, automated testing, pre-commit validation
