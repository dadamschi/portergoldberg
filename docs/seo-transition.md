# SEO Advantages: Next.js + Sanity vs WordPress

A technical comparison for Porter Goldberg Residential's website transition.

---

## Performance Advantages

| Factor | WordPress | Next.js + Sanity |
|--------|-----------|------------------|
| Page Generation | Dynamic (PHP on every request) | Static at build time |
| Time to First Byte | 200-800ms typical | <50ms from edge |
| Hosting | Single server | Global CDN (Vercel Edge) |
| Core Web Vitals | Requires optimization plugins | Optimized by default |

### Why This Matters for Real Estate

Google uses Core Web Vitals as a ranking factor. Faster sites:
- Rank higher in local search ("Chicago real estate agent")
- Have lower bounce rates (visitors stay longer)
- Convert better on mobile (where most home searches happen)

---

## Technical SEO Improvements

### Images
- **WordPress**: Relies on plugins for optimization, often serves unoptimized originals
- **Next.js**: Automatic WebP/AVIF conversion, responsive srcset, lazy loading built-in

For a listing-heavy site, image optimization alone can cut page weight by 60-80%.

### Meta Tags & Open Graph
- **WordPress**: Requires Yoast or RankMath plugin, can conflict with themes
- **Next.js**: Type-safe `generateMetadata` API, per-page control, no plugins

### Structured Data (Schema.org)
- **WordPress**: Plugin-dependent, often generic
- **Next.js**: Custom JSON-LD for `RealEstateListing`, `RealEstateAgent`, `LocalBusiness`

Rich snippets in search results: property photos, price, availability status.

### Sitemaps
- **WordPress**: Plugin-generated, can miss pages
- **Next.js**: Automatic generation with `next-sitemap`, always in sync

---

## What WordPress Struggles With

1. **Plugin Bloat** — Each plugin adds CSS/JS, slowing page load
2. **Database Queries** — Every page request hits MySQL
3. **Security Patches** — Constant updates needed for WordPress core, themes, plugins
4. **Caching Complexity** — Requires WP Super Cache, W3 Total Cache, etc. to approach static performance
5. **Mobile Performance** — Themes often ship desktop-first, heavy assets

---

## Sanity CMS Benefits Over WordPress Admin

| Feature | WordPress | Sanity |
|---------|-----------|--------|
| Content Modeling | Fixed post/page types | Custom schemas (Listing, Agent, Testimonial) |
| Image Management | Media library, manual optimization | Built-in CDN, automatic transforms |
| Preview | Theme-dependent | Real-time visual editing |
| Version History | Revisions plugin | Built-in, per-field history |
| Multi-user Editing | Conflicts possible | Real-time collaboration |
| API Access | REST/GraphQL plugins | Native GROQ API |

---

## SEO Features We'll Implement

### 1. Dynamic Metadata Per Listing
```
Title: "2129 N. Damen | $965,000 | Bucktown | Porter Goldberg"
Description: "3BR/2BA in Bucktown. 50% Sold. Contact Samantha Porter..."
```

### 2. JSON-LD Structured Data
```json
{
  "@type": "RealEstateListing",
  "name": "2129 N. Damen",
  "price": "$965,000",
  "address": { "addressLocality": "Chicago", "addressRegion": "IL" },
  "agent": { "@type": "RealEstateAgent", "name": "Samantha Porter" }
}
```

### 3. Automatic XML Sitemap
- All listings, testimonials, pages indexed
- Updates on every Sanity publish
- Submitted to Google Search Console

### 4. Local SEO
- `LocalBusiness` schema for the team
- Google Business Profile integration
- Neighborhood landing pages (Bucktown, Lincoln Park, Logan Square)

---

## Expected Outcomes

- **Faster Load Times**: 3-5x improvement in LCP (Largest Contentful Paint)
- **Better Mobile Experience**: Optimized images, no render-blocking scripts
- **Richer Search Results**: Property cards with images, prices in SERPs
- **Lower Maintenance**: No plugin updates, security patches, or caching configuration
- **Future-Proof**: Headless architecture supports app, email templates, digital brochures from same content

---

## Migration Path

1. **Phase 1**: Launch Next.js site with current static content
2. **Phase 2**: Connect Sanity CMS, migrate listings/testimonials
3. **Phase 3**: Set up visual editing for client self-service
4. **Phase 4**: Add advanced features (saved searches, property alerts)

---

*Prepared for Porter Goldberg Residential website transition discussion.*
