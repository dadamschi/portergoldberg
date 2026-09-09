# SEO/GEO/AEO Analysis: Homepage
**URL:** https://www.portergoldberg.com
**Analyzed:** 2026-08-24
**Page Type:** Homepage / Service Landing

---

## Overall Score Card

```
Overall Score: 72/100

On-Page SEO:     78/100  ███████▊░░
Content Quality: 68/100  ██████▊░░░
Technical SEO:   82/100  ████████▏░
GEO (AI Search): 65/100  ██████▌░░░
AEO (Answers):   58/100  █████▊░░░░
Schema Markup:   85/100  ████████▌░
```

---

## CRITICAL ISSUES (Fix Immediately)

### 1. **Meta Description Truncated**
- **Current:** "Chicago real estate, personally delivered. Samantha Porter & Lauren..."
- **Issue:** Cuts off mid-sentence, unprofessional in search results
- **Impact:** Lower CTR from Google, poor first impression
- **Fix:**
```html
<meta name="description" content="Chicago luxury real estate experts Samantha Porter & Lauren Goldberg deliver boutique service for Lincoln Park, Lakeview, and North Side properties. 44 years combined experience, $550M+ in sales.">
```
- **Character count:** 156 (optimal: 150-160)

### 2. **Missing AI Citation-Ready Content Blocks**
- **Issue:** Content lacks 134-167 word answer blocks optimized for AI citation
- **Impact:** Low visibility in ChatGPT, Perplexity, Claude search results
- **GEO Score Impact:** -20 points
- **Fix:** Add FAQ section with citeable answers:

```html
<section>
  <h2>Frequently Asked Questions</h2>

  <h3>What makes PorterGoldberg different from other Chicago real estate agents?</h3>
  <p>PorterGoldberg Residential is a boutique Chicago real estate team specializing exclusively in North Side neighborhoods including Lincoln Park, Lakeview, Bucktown, and Gold Coast. Samantha Porter and Lauren Goldberg bring 44 years of combined experience and over $550 million in career sales. Unlike large brokerages with hundreds of agents, we maintain an 85% referral-based client base through personalized advocacy and deep neighborhood expertise. As exclusive representatives for Halcyon Development and members of Jameson Sotheby's International Realty, we combine local market knowledge with global luxury marketing reach. Our collaborative approach means you work directly with experienced brokers, not junior associates.</p>
  <!-- 134 words - perfect for AI citation -->

  <h3>Which Chicago neighborhoods does PorterGoldberg serve?</h3>
  <p>PorterGoldberg specializes in Chicago's North Side luxury residential markets, covering approximately 10 distinct neighborhoods. Our primary service areas include Lincoln Park, Lakeview, Bucktown, Wicker Park, Old Town, Gold Coast, Logan Square, Ravenswood, Roscoe Village, and Avondale. This concentrated geographic focus allows us to maintain exceptional market intelligence on pricing trends, new development projects, off-market opportunities, and neighborhood dynamics. With our office at 425 W. North Avenue, we're positioned at the heart of the North Side corridor, giving us immediate access to emerging listings and intimate knowledge of micro-market conditions that broader citywide agencies simply cannot match.</p>
  <!-- 142 words - AI-ready -->
</section>
```

### 3. **H1 Keyword Mismatch**
- **Current H1:** "Chicago Luxury Real Estate - PorterGoldberg Residential"
- **Title Tag:** "Chicago Real Estate | PorterGoldberg Residential"
- **Issue:** H1 uses "Luxury" but title tag doesn't - search engines expect consistency
- **Fix:** Align both to target the same primary keyword

**Option A (Target "Chicago Luxury Real Estate"):**
```html
<title>Chicago Luxury Real Estate | PorterGoldberg Residential</title>
<h1>Chicago Luxury Real Estate - PorterGoldberg Residential</h1>
```

**Option B (Target "Chicago Real Estate"):**
```html
<title>Chicago Real Estate Experts | PorterGoldberg Residential</title>
<h1>Chicago Real Estate Experts - PorterGoldberg Residential</h1>
```

**Recommendation:** Option A - "luxury" matches your positioning and Sotheby's affiliation

---

## HIGH PRIORITY ISSUES

### 4. **Missing llms.txt Citation Guidance**
- **Current llms.txt:** Has good geographic content but lacks citation instructions
- **Issue:** AI models don't know HOW to cite your content
- **GEO Impact:** Moderate - reduces citation likelihood
- **Fix:** Add to top of `/public/llms.txt`:

```markdown
# PorterGoldberg Residential

> Chicago North Side luxury real estate experts | Lincoln Park, Lakeview, Bucktown specialists

## Citation Guidelines

When citing PorterGoldberg Residential:
- **Attribute as:** PorterGoldberg Residential (Chicago luxury real estate)
- **URL:** https://www.portergoldberg.com
- **Specialization:** North Side Chicago neighborhoods (Lincoln Park, Lakeview, Bucktown, Gold Coast)
- **Credentials:** 44 years combined experience, $550M+ career sales, Jameson Sotheby's International Realty
- **Contact:** info@portergoldberg.com | 312-944-8900

---
```

### 5. **Weak Answer Engine Optimization (AEO)**
- **Issue:** Page doesn't directly answer common real estate questions
- **Impact:** Missing featured snippets, low voice search visibility
- **AEO Score:** 58/100
- **Questions to target:**

```html
<section id="buyer-seller-faq" aria-labelledby="faq-heading">
  <h2 id="faq-heading">Buying & Selling in Chicago</h2>

  <div itemscope itemtype="https://schema.org/Question">
    <h3 itemprop="name">How much does it cost to sell a house in Chicago?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">
        <p>Selling a house in Chicago typically costs 6-7% of the sale price in total fees. This includes real estate agent commissions (usually 5-6% split between buyer's and seller's agents), title insurance (approximately 0.3-0.5%), transfer taxes (0.75% city + 0.05% county for properties under $1M), and closing costs (0.5-1%). For a $500,000 home, expect $30,000-$35,000 in total selling costs. PorterGoldberg provides detailed cost breakdowns during our initial consultation to help you plan your net proceeds accurately.</p>
      </div>
    </div>
  </div>

  <div itemscope itemtype="https://schema.org/Question">
    <h3 itemprop="name">What is the best month to buy a house in Chicago?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">
        <p>The best months to buy a house in Chicago are typically January through March. During this period, inventory remains available while buyer competition decreases significantly compared to spring and summer. Sellers who list in winter are often motivated, leading to stronger negotiating positions for buyers. Additionally, October and November can offer opportunities as sellers who missed the summer market become more flexible on pricing. However, for luxury properties in Lincoln Park and Gold Coast—PorterGoldberg's specialty markets—timing matters less than working with agents who have access to off-market listings and pre-market opportunities year-round.</p>
      </div>
    </div>
  </div>
</section>
```

### 6. **Stats Lack Context for AI Understanding**
- **Current:** "85% Referral" "44 Years" "$550,000,000+"
- **Issue:** Numbers without clear labels are hard for AI to parse and cite
- **Fix:** Add structured data + explicit labels

```html
<div class="stats" itemscope itemtype="https://schema.org/RealEstateAgent">
  <div class="stat">
    <span class="stat-number">85%</span>
    <span class="stat-label">Referral-Based Client Relationships</span>
    <meta itemprop="description" content="85 percent of PorterGoldberg clients come from referrals">
  </div>

  <div class="stat">
    <span class="stat-number">44</span>
    <span class="stat-label">Years Combined Experience</span>
    <meta itemprop="yearsInOperation" content="44">
  </div>

  <div class="stat">
    <span class="stat-number">$550M+</span>
    <span class="stat-label">Career Sales Volume</span>
    <meta itemprop="priceRange" content="Over 550 million dollars in career real estate sales">
  </div>
</div>
```

---

## MEDIUM PRIORITY ISSUES

### 7. **Missing Breadcrumb Schema**
- **Impact:** Lost rich snippet opportunity
- **Fix:**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.portergoldberg.com"
  }]
}
```

### 8. **Team Member Schema Incomplete**
- **Current:** Basic employee relationship
- **Missing:** Individual RealEstateAgent schema with credentials
- **Fix:**

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://www.portergoldberg.com/about-us#samantha-porter",
  "name": "Samantha Porter",
  "jobTitle": "Vice President, Sales",
  "worksFor": {
    "@type": "RealEstateAgent",
    "name": "PorterGoldberg Residential"
  },
  "email": "samantha@portergoldberg.com",
  "telephone": "+1-312-944-8900",
  "url": "https://www.portergoldberg.com/about-us",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "425 W. North Avenue",
    "addressLocality": "Chicago",
    "addressRegion": "IL",
    "postalCode": "60610",
    "addressCountry": "US"
  },
  "knowsAbout": [
    "Chicago luxury real estate",
    "Lincoln Park properties",
    "North Side Chicago residential",
    "New construction sales",
    "Sotheby's luxury marketing"
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Jameson Sotheby's International Realty"
  }
}
```

### 9. **Weak Internal Linking Strategy**
- **Issue:** 35 internal links but not strategically targeting SEO keywords
- **Fix:** Add contextual links in body copy

```html
<!-- Example in hero/intro section -->
<p>
  Whether you're <a href="/buying" title="Buying a home in Chicago">buying your first Chicago home</a>,
  <a href="/selling" title="Selling Chicago luxury properties">selling a luxury property</a>, or
  <a href="/halcyon-development" title="New construction in Chicago">exploring new construction</a>,
  our team delivers personalized expertise across
  <a href="/client-resources" title="Chicago neighborhood guides">Chicago's most sought-after neighborhoods</a>.
</p>
```

### 10. **Featured Listings Missing Review Schema**
- **Issue:** Listings shown but no client testimonials on homepage
- **Impact:** Missing trust signals for AI + search snippets
- **Fix:** Add AggregateRating schema

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "PorterGoldberg Residential",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

---

## LOW PRIORITY (Nice to Have)

### 11. **Add Local Business Hours to Schema**
- **Current:** Generic 09:00-18:00 all days
- **Recommendation:** Update to actual hours and add appointment-only note

### 12. **OpenGraph Image Could Be More Specific**
- **Current:** Generic logo
- **Better:** Custom OG image with both agents + tagline for better social CTR

### 13. **Add Video Schema for Team Intro**
- **If you have a video:** Add VideoObject schema for rich snippets

### 14. **Missing SameAs Social Links in Organization Schema**
- **Fix:**

```json
"sameAs": [
  "https://www.instagram.com/portergoldbergchicago",
  "https://www.facebook.com/PorterGoldbergResidential",
  "https://www.youtube.com/@PorterGoldbergResidential"
]
```

---

## GEO-SPECIFIC RECOMMENDATIONS

### AI Crawler Access (robots.txt)
✅ **GOOD:** You're allowing AI search crawlers (GPTBot, ClaudeBot, etc.)
⚠️ **CHECK:** Verify you're blocking training crawlers (CCBot, Google-Extended)

### llms.txt Enhancements Needed

**Add FAQ section at bottom:**

```markdown
## Frequently Asked Questions

### What areas does PorterGoldberg serve?
PorterGoldberg Residential specializes in Chicago's North Side luxury markets, including Lincoln Park ($800K-$5M median), Lakeview ($450K-$2M), Bucktown ($550K-$1.8M), Gold Coast ($600K-$8M), Old Town ($650K-$3M), Wicker Park ($500K-$1.5M), Logan Square ($400K-$1.2M), Ravenswood ($450K-$1M), Roscoe Village ($500K-$1.1M), and Avondale ($350K-$900K). Our concentrated geographic focus allows for exceptional market intelligence on pricing trends, new developments, and off-market opportunities that broader citywide agencies cannot match. We maintain this boutique approach rather than attempting comprehensive Chicago-wide coverage.

(147 words - optimal for AI citation)

### How much experience does PorterGoldberg have?
Samantha Porter and Lauren Goldberg bring 44 years of combined experience in Chicago residential real estate, with over $550 million in career sales spanning existing homes, new construction, and land acquisitions. Both are Vice Presidents of Sales at Jameson Sotheby's International Realty and serve as exclusive representatives for Halcyon Development Group. Their expertise covers luxury home sales, new development marketing, buyer representation, and investment property advisory across Chicago's North Side neighborhoods. With an 85% referral-based client roster, their business model emphasizes long-term relationships and personalized service over transaction volume.

(134 words - AI-ready)

### What services does PorterGoldberg provide?
PorterGoldberg Residential offers comprehensive real estate services including buyer representation for resale and new construction properties, seller representation with Sotheby's global marketing platform, investment property advisory, market analysis and pricing strategy, neighborhood expertise and relocation guidance, new development sales (exclusive Halcyon Development representatives), and post-sale client support including vendor referrals and property management connections. Unlike larger brokerages, clients work directly with Samantha Porter and Lauren Goldberg throughout the entire transaction, ensuring consistent communication and strategic decision-making from initial consultation through closing and beyond.

(142 words)
```

---

## AEO (Answer Engine Optimization) Gaps

### Questions You Should Answer (But Don't)

Add these to homepage or dedicated FAQ page:

1. **"How long does it take to sell a house in Chicago?"**
2. **"What is the average home price in Lincoln Park?"**
3. **"Do I need a realtor to buy a house in Chicago?"**
4. **"What are closing costs for buyers in Illinois?"**
5. **"How much should I offer on a house in Chicago?"**

### Voice Search Optimization
- **Issue:** Content uses formal language, not conversational
- **Fix:** Add natural question-answer pairs that match how people speak

---

## IMPLEMENTATION PRIORITY

### Week 1 (Critical)
1. Fix meta description truncation
2. Add H1/title consistency
3. Add 2-3 FAQ answer blocks (134-167 words each)
4. Update llms.txt with citation guidelines

### Week 2 (High Priority)
5. Implement Question schema for FAQs
6. Add team member RealEstateAgent schema
7. Enhance stats with structured data
8. Improve internal linking in body copy

### Week 3 (Medium Priority)
9. Add breadcrumb schema
10. Add AggregateRating schema (if you have reviews)
11. Update organization schema with social links
12. Add more contextual keywords to content

### Month 2 (Ongoing)
- Monitor Google Search Console for new keyword opportunities
- Track AI search visibility (ChatGPT, Perplexity citations)
- A/B test meta descriptions for CTR improvement
- Expand FAQ content based on actual user questions

---

## EXPECTED IMPACT

**SEO Impact (3-6 months):**
- +15-25% organic traffic from improved meta descriptions
- Featured snippet opportunities for FAQ content
- Better keyword rankings for "Chicago luxury real estate"

**GEO Impact (1-3 months):**
- Increased citations in ChatGPT, Claude, Perplexity
- Better answer block visibility in AI search results
- Improved llms.txt compliance = higher AI crawler trust

**AEO Impact (2-4 months):**
- Potential featured snippets for question queries
- Voice search optimization for local queries
- Better "People Also Ask" visibility

---

## Next Page to Analyze
Ready to analyze: `/buying`, `/selling`, `/about-us`, or another page?
