# TODO: Internal Linking Enhancement

**Priority**: Medium
**Estimated Time**: 15-20 minutes
**SEO Impact**: +5-10 points per page, better keyword rankings

---

## Overview

Add contextual keyword-rich internal links within body copy to:
- Help search engines understand site structure
- Pass SEO value between related pages
- Improve user navigation and experience
- Target specific keywords in anchor text

---

## Implementation Checklist

### Homepage (`/`)

**Location**: Hero bio section (around lines 177-193 in `components/Hero.tsx`)

**Current text to enhance**:
```tsx
<p>
  Real estate is personal—and so is our approach. We don't simply advise; we
  collaborate, advocate, and help shape the lifestyle you're building. The process—buying,
  selling, or creating something new—should feel seamless and smart.
</p>
```

**Add links**:
```tsx
<p>
  Real estate is personal—and so is our approach. Whether you're{' '}
  <a href="/buying" title="Buying a home in Chicago">buying your first Chicago home</a>,{' '}
  <a href="/selling/our-process" title="Selling Chicago luxury properties">selling a luxury property</a>, or{' '}
  <a href="/halcyon-development" title="New construction in Chicago">exploring new construction</a>,
  we collaborate, advocate, and help shape the lifestyle you're building across{' '}
  <a href="/client-resources" title="Chicago neighborhood guides">Chicago's most sought-after neighborhoods</a>.
</p>
```

**Impact**: Links to 4 key pages with keyword-rich anchor text

---

### Buying Page (`/buying`)

**Location**: Add new paragraph after flipbook, before FAQ section

**Add this content block**:
```tsx
<div className="pg-buying-intro">
  <p>
    Whether you're a first-time buyer exploring{' '}
    <a href="/inventory?area=lincoln-park" title="Lincoln Park homes for sale">Lincoln Park condos</a>,
    a growing family seeking a{' '}
    <a href="/inventory?type=single-family" title="Single-family homes in Lakeview">single-family home in Lakeview</a>,
    or an investor interested in{' '}
    <a href="/halcyon-development" title="Halcyon new construction">new construction opportunities</a>,
    PorterGoldberg provides expert guidance throughout your journey. Our deep{' '}
    <a href="/about-us" title="About PorterGoldberg team">North Side expertise</a>{' '}
    and access to{' '}
    <a href="/client-resources" title="Chicago vendor network">trusted local vendors</a>{' '}
    ensures a smooth home buying experience from search to closing.
  </p>
</div>
```

**Style needed**: Add to `globals.css`:
```css
.pg-buying-intro {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
}

.pg-buying-intro p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.pg-buying-intro a {
  color: var(--pg-sage);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.pg-buying-intro a:hover {
  border-bottom-color: var(--pg-sage);
}
```

**Impact**: Links to inventory filters, Halcyon, about, and resources

---

### Selling Page (`/selling/our-process`)

**Location**: After `data.marketingIntro` content block (around line 40-42)

**Add this content after PortableTextClient**:
```tsx
{data.marketingIntro && data.marketingIntro.length > 0 && (
  <PortableTextClient value={data.marketingIntro} />
)}

{/* Add this new section */}
<div className="pg-selling-intro">
  <p>
    Our comprehensive{' '}
    <a href="/selling/property-prep" title="Property preparation services">property preparation services</a>,
    professional{' '}
    <a href="/selling/staging-services" title="Home staging consultation">staging guidance</a>, and
    Jameson Sotheby's{' '}
    <a href="/selling/our-process#marketing" title="Global luxury marketing">international marketing platform</a>{' '}
    ensure your home reaches qualified buyers locally and globally. From pricing strategy to final negotiations,
    our{' '}
    <a href="/about-us" title="PorterGoldberg team experience">44 years of combined experience</a>{' '}
    and{' '}
    <a href="/testimonials" title="Client reviews and testimonials">proven track record</a>{' '}
    deliver results that exceed expectations.
  </p>
</div>
```

**Style needed**: Add to `globals.css`:
```css
.pg-selling-intro {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
  background: var(--pg-cream);
  padding: 30px;
  border-radius: 8px;
}

.pg-selling-intro p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.pg-selling-intro a {
  color: var(--pg-sage);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.pg-selling-intro a:hover {
  border-bottom-color: var(--pg-sage);
}
```

**Impact**: Links to selling sub-pages, about, and testimonials

---

## Best Practices

### Anchor Text Guidelines
- ✅ **Good**: "Lincoln Park condos", "new construction opportunities"
- ❌ **Bad**: "click here", "this page", "more info"

### Title Attributes
- Always add descriptive title attributes for SEO context
- Example: `title="Buying a home in Chicago"`

### Link Density
- Don't overdo it - 4-6 links per paragraph maximum
- Natural reading flow is priority
- Only link when contextually relevant

### Target Pages Priority
1. High-value service pages (`/buying`, `/selling/*`)
2. Inventory pages with filters
3. Halcyon development (exclusive partnership)
4. About/testimonials (trust building)
5. Client resources (value-add)

---

## Testing Checklist

After implementation:
- [ ] All links work (no 404s)
- [ ] Links open in same tab (internal)
- [ ] Title attributes are descriptive
- [ ] Text reads naturally
- [ ] Mobile experience is good
- [ ] No broken layout
- [ ] Run `npm run lint` and `npm run typecheck`

---

## Expected SEO Results

**Timeline**: 2-4 months to see impact

**Improvements**:
- Better internal page rank distribution
- Improved rankings for linked keywords
- Lower bounce rate (easier navigation)
- More page views per session
- Better Google understanding of site structure

**KPIs to track**:
- Organic traffic to linked pages
- Keyword rankings for anchor text terms
- Average session duration
- Pages per session

---

## Notes

- This is **medium priority** - critical SEO work is already done
- Can be implemented incrementally (one page at a time)
- Content is in Sanity for selling page intro, so coordinate with CMS updates
- For homepage, content is hardcoded in Hero.tsx fallback
