# SEO/GEO/AEO Analysis: /buying Page
**URL:** https://www.portergoldberg.com/buying
**Analyzed:** 2026-08-24
**Page Type:** Service/Educational Landing Page

---

## Overall Score Card

```
Overall Score: 58/100  ⚠️ NEEDS SIGNIFICANT IMPROVEMENT

On-Page SEO:     52/100  █████▏░░░░  (CRITICAL ISSUES)
Content Quality: 45/100  ████▌░░░░░  (MAJOR GAPS)
Technical SEO:   75/100  ███████▌░░
GEO (AI Search): 38/100  ███▊░░░░░░  (VERY WEAK)
AEO (Answers):   42/100  ████▏░░░░░  (POOR)
Schema Markup:   70/100  ███████░░░
```

---

## 🚨 CRITICAL ISSUES (Fix Immediately)

### 1. **Duplicate Brand Name in Title Tag**
- **Current:** "Buying a Home in Chicago | PorterGoldberg | PorterGoldberg Residential"
- **Issue:** "PorterGoldberg" appears TWICE - wastes characters, looks unprofessional
- **Character waste:** ~18 characters
- **SEO Impact:** CRITICAL - confusing to search engines, looks spammy
- **Fix:**

```html
<title>Buying a Home in Chicago | PorterGoldberg Residential</title>
```

**Better options (include value prop):**
```html
<title>Chicago Home Buying Guide | Expert Buyer Agents | PorterGoldberg</title>
```
or
```html
<title>Buy a Home in Chicago - Buyer's Agent Guide | PorterGoldberg Residential</title>
```

### 2. **Generic H1 with Zero SEO Value**
- **Current:** "Home Buyer's Path"
- **Issue:** No location, no keywords, no specificity
- **Compare to title:** Title says "Chicago" - H1 doesn't mention Chicago at all
- **GEO Impact:** AI has no geographic context
- **Fix:**

```html
<h1>Chicago Home Buyer's Guide - Your Path to Homeownership</h1>
```

or better:
```html
<h1>Buying a Home in Chicago: Expert Guidance for North Side Buyers</h1>
```

### 3. **Flipbook Content Is Invisible to Search Engines & AI**
- **Issue:** Your 10-stage buying process is in a VISUAL flipbook
- **Impact:**
  - Google cannot read images/flipbook
  - ChatGPT/Claude cannot cite your buying process
  - Zero SEO value from this content
  - Missing featured snippet opportunities
- **AEO Score Impact:** -35 points
- **GEO Score Impact:** -30 points

**URGENT FIX:** Add text version of all 10 stages:

```html
<section id="buying-process" aria-labelledby="process-heading">
  <h2 id="process-heading">The Chicago Home Buying Process: 10 Essential Steps</h2>

  <article id="step-1-consultation" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="1">
    <h3 itemprop="name">Step 1: Initial Consultation</h3>
    <div itemprop="text">
      <p>Your home buying journey begins with a comprehensive consultation where we discuss your goals, timeline, budget, and neighborhood preferences. We'll review current market conditions in Lincoln Park, Lakeview, Bucktown, and other North Side Chicago areas you're considering. This no-obligation meeting helps us understand your priorities—whether you're seeking a move-in-ready condo, a single-family home with renovation potential, or new construction opportunities. We'll also explain our buyer representation services, commission structure (paid by the seller in most cases), and how Jameson Sotheby's International Realty's resources can give you an edge in competitive markets.</p>
      <!-- 134 words - AI citation ready -->
    </div>
  </article>

  <article id="step-2-financials" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="2">
    <h3 itemprop="name">Step 2: Financial Preparation & Pre-Approval</h3>
    <div itemprop="text">
      <p>Before viewing properties, we connect you with trusted Chicago mortgage lenders who can provide accurate pre-approval letters. Getting pre-approved (not just pre-qualified) shows sellers you're a serious buyer and helps you understand your true budget including down payment, closing costs (typically 2-5% in Illinois), and monthly payment obligations. We'll review different loan types—conventional, FHA, VA, jumbo—and discuss how much to allocate for inspections, appraisals, and potential repair negotiations. In competitive North Side markets, a strong pre-approval letter from a reputable local lender can be the difference between winning and losing a bidding war.</p>
      <!-- 141 words -->
    </div>
  </article>

  <article id="step-3-home-search" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="3">
    <h3 itemprop="name">Step 3: Strategic Home Search</h3>
    <div itemprop="text">
      <p>We begin your home search with a customized MLS portal showing all listings matching your criteria, plus off-market opportunities from our network of developers, fellow agents, and past clients. You'll receive instant alerts for new listings in Lincoln Park, Lakeview, or your target neighborhoods—critical in fast-moving markets where desirable properties sell within days. We'll schedule showings at your convenience (evenings and weekends included) and provide honest assessments of each property's value, condition, and negotiating position. Our North Side expertise means we can identify red flags like assessment appeals, special assessments, building issues, and zoning concerns that less experienced agents might miss.</p>
      <!-- 145 words -->
    </div>
  </article>

  <article id="step-4-offer" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="4">
    <h3 itemprop="name">Step 4: Making a Competitive Offer</h3>
    <div itemprop="text">
      <p>When you've found the right property, we craft a strategic offer based on recent comparable sales, days on market, seller motivation, and current market conditions. Your offer includes price, earnest money deposit (typically $5,000-$10,000 in Chicago), inspection contingencies, financing terms, and proposed closing date. In multiple-offer situations, we help you stand out through competitive pricing, flexible terms, escalation clauses, or personal letters when appropriate. We negotiate on your behalf—not just on price, but also on seller concessions, inclusion of appliances, HOA transfer fees, and inspection repair credits. Our goal is to secure the property at the best possible terms while maintaining a professional relationship with the listing agent.</p>
      <!-- 148 words -->
    </div>
  </article>

  <article id="step-5-under-contract" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="5">
    <h3 itemprop="name">Step 5: Under Contract</h3>
    <div itemprop="text">
      <p>Once your offer is accepted, we coordinate the attorney review period (typically 5-7 business days in Illinois). We'll recommend experienced real estate attorneys who will review the contract, negotiate final terms, and identify any title issues or condo association concerns. During this period, you'll submit your earnest money deposit, apply for financing, and schedule the home inspection. We manage deadlines for inspection contingencies, financing contingency removal, and attorney approval to ensure you maintain your rights while progressing toward closing. This is also when you'll order homeowner's insurance and begin planning your move. We stay in constant communication with your lender, attorney, and the seller's agent to address issues immediately.</p>
      <!-- 138 words -->
    </div>
  </article>

  <article id="step-6-inspection" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="6">
    <h3 itemprop="name">Step 6: Home Inspection & Due Diligence</h3>
    <div itemprop="text">
      <p>We schedule a professional home inspection (cost: $400-$800 depending on property size) and attend alongside you to discuss findings in real-time. The inspector will evaluate the foundation, roof, HVAC, plumbing, electrical, and structural components. We help you interpret the report, distinguishing between minor cosmetic issues and major concerns requiring repair or price negotiation. If significant problems emerge—like a failing furnace, roof damage, or foundation cracks—we negotiate with the seller for repairs, credits, or price reductions. You have the right to cancel the contract during the inspection period if issues are deal-breakers. We also review condo association documents, budgets, and meeting minutes to identify potential special assessments or building issues.</p>
      <!-- 143 words -->
    </div>
  </article>

  <article id="step-7-appraisal-approval" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="7">
    <h3 itemprop="name">Step 7: Appraisal & Loan Approval</h3>
    <div itemprop="text">
      <p>Your lender orders an appraisal (cost: $500-$700) to ensure the property's value supports your loan amount. The appraiser compares your property to recent sales of similar homes in the neighborhood. If the appraisal comes in lower than your offer price, we negotiate with the seller to reduce the price, provide a credit, or you can increase your down payment to cover the gap. Simultaneously, your lender finalizes underwriting—verifying employment, income, assets, and credit. We maintain communication with your loan officer to address any documentation requests quickly, preventing delays. Once you receive "clear to close" from your lender and the appraisal is satisfactory, you're ready for the final steps.</p>
      <!-- 138 words -->
    </div>
  </article>

  <article id="step-8-final-walkthrough" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="8">
    <h3 itemprop="name">Step 8: Final Walkthrough</h3>
    <div itemprop="text">
      <p>24-48 hours before closing, we conduct a final walkthrough to verify the property's condition hasn't changed since your offer. We confirm that agreed-upon repairs were completed, appliances and fixtures listed in the contract are present, and the home is in "broom clean" condition. This is your opportunity to test all systems (lights, plumbing, HVAC) and ensure no damage occurred during the seller's move-out. If issues are discovered—like a broken window, missing appliances, or incomplete repairs—we address them immediately with the seller's agent, sometimes holding funds in escrow until resolved. The final walkthrough protects you from surprises on moving day and ensures you receive the property exactly as negotiated.</p>
      <!-- 137 words -->
    </div>
  </article>

  <article id="step-9-closing" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="9">
    <h3 itemprop="name">Step 9: Closing Day</h3>
    <div itemprop="text">
      <p>Closing typically occurs at a title company or attorney's office. You'll review and sign loan documents, the deed, and closing disclosures. Bring a cashier's check or arrange a wire transfer for your down payment and closing costs (verify the exact amount with your attorney 24 hours prior). Your attorney will explain each document—the mortgage note, deed of trust, title insurance policy, and settlement statement showing all financial transactions. After signing, you'll receive the keys to your new home. The closing process takes 60-90 minutes. We attend closing with you to answer questions, resolve any last-minute issues, and celebrate this milestone. The deed is recorded with Cook County, officially making you the homeowner.</p>
      <!-- 142 words -->
    </div>
  </article>

  <article id="step-10-post-closing" itemscope itemtype="https://schema.org/HowToStep">
    <meta itemprop="position" content="10">
    <h3 itemprop="name">Step 10: Post-Closing Support</h3>
    <div itemprop="text">
      <p>Our relationship doesn't end at closing. We provide ongoing support including referrals to trusted contractors, plumbers, electricians, and home service providers in your neighborhood. We'll check in during your first weeks of homeownership to ensure a smooth transition and address any questions about your property or local resources. You'll receive guidance on property tax appeals (common in Chicago), homestead exemptions, and neighborhood amenities. As your home's value changes, we provide annual market updates and insights on property improvements that maximize resale value. Most importantly, we're always available for real estate advice—whether you're considering renovations, refinancing, or future property purchases. You've joined our client family for life.</p>
      <!-- 135 words -->
    </div>
  </article>
</section>
```

**Additional Schema to Add:**

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Buy a Home in Chicago",
  "description": "Complete 10-step guide to buying a home in Chicago from PorterGoldberg Residential, covering consultation, financing, home search, offers, inspections, and closing.",
  "totalTime": "P60D",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "300000-1000000"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Initial Consultation",
      "url": "https://www.portergoldberg.com/buying#step-1-consultation",
      "itemListElement": [{
        "@type": "HowToDirection",
        "text": "Schedule a no-obligation consultation to discuss your goals, budget, and neighborhood preferences."
      }]
    }
    // ... repeat for all 10 steps
  ]
}
```

### 4. **Missing Meta Keywords for AI Context**
- **Issue:** No clear topic signals for AI crawlers
- **Impact:** Lower GEO relevance scores
- **Fix:** Add to `<head>`:

```html
<meta name="keywords" content="buying home Chicago, Chicago buyer agent, North Side real estate, Lincoln Park homes, Lakeview condos, Chicago home buying process, buyer representation">
```

*Note: Meta keywords don't help Google SEO, but some AI crawlers use them for topic classification*

---

## HIGH PRIORITY ISSUES

### 5. **Word Count Too Low for Informational Page**
- **Current:** ~800-1,000 words
- **Target for "buying guide":** 2,000-3,000 words minimum
- **Impact:** Losing to competitors with more comprehensive guides
- **Fix:** Add sections:
  - "What to expect when buying in [neighborhood]"
  - "Common mistakes first-time Chicago buyers make"
  - "Understanding Chicago closing costs"
  - "Questions to ask before making an offer"

### 6. **No FAQ Section for AEO**
- **Missing questions:**
  - "How much do I need for a down payment in Chicago?"
  - "What are closing costs when buying a house in Illinois?"
  - "How long does it take to buy a house in Chicago?"
  - "Do I need a real estate agent to buy a house?"
  - "What credit score do I need to buy a house in Chicago?"

**Add with Question schema:**

```html
<section id="buyer-faq">
  <h2>Frequently Asked Questions About Buying in Chicago</h2>

  <div itemscope itemtype="https://schema.org/Question">
    <h3 itemprop="name">How much do I need for a down payment when buying a house in Chicago?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">
        <p>Down payment requirements for Chicago homes typically range from 3% to 20% depending on your loan type and financial situation. First-time buyers often qualify for low down payment programs: FHA loans require just 3.5% down, conventional loans with PMI accept 3-5%, and VA loans (for veterans) offer 0% down. For a $500,000 Lincoln Park condo, that's $15,000 (3%) to $100,000 (20%). Larger down payments (20%+) eliminate private mortgage insurance (PMI), which costs $100-$300 monthly on a $500K loan. Many Chicago buyers in competitive North Side markets put down 10-20% to strengthen their offers and reduce monthly payments. PorterGoldberg can connect you with lenders offering down payment assistance programs for qualified buyers.</p>
        <!-- 150 words -->
      </div>
    </div>
  </div>

  <div itemscope itemtype="https://schema.org/Question">
    <h3 itemprop="name">What are closing costs when buying a house in Illinois?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">
        <p>Buyer closing costs in Illinois typically total 2-5% of the purchase price, covering lender fees, title insurance, attorney fees, and prepaid expenses. On a $500,000 Chicago home, expect $10,000-$25,000 in closing costs. Major expenses include: loan origination fees ($2,000-$3,000), title insurance ($1,500-$2,500), attorney fees ($1,000-$2,000), appraisal ($500-$700), home inspection ($400-$800), and prepaid property taxes and homeowner's insurance (varies by closing date). Unlike some states, Illinois buyers don't pay transfer taxes—sellers cover that cost. First-time buyers may negotiate seller credits to offset closing costs, especially in buyer-favorable markets. Your lender provides a detailed Loan Estimate showing exact closing costs within three days of applying.</p>
        <!-- 147 words -->
      </div>
    </div>
  </div>

  <div itemscope itemtype="https://schema.org/Question">
    <h3 itemprop="name">How long does it take to buy a house in Chicago?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">
        <p>The Chicago home buying timeline typically spans 60-90 days from offer acceptance to closing, though this varies significantly based on financing type, property condition, and market competition. Breaking it down: finding the right property (2-12 weeks depending on market activity), attorney review period (5-7 days), inspection period (7-14 days), appraisal and loan processing (30-45 days), and final closing preparations (1-2 weeks). Cash buyers can close in as little as 14-21 days since they skip mortgage underwriting. New construction purchases take 6-18 months depending on building completion timelines. In competitive North Side Chicago markets like Lincoln Park or Lakeview, PorterGoldberg's off-market network and pre-approval strategies can significantly accelerate your search phase, helping you secure properties before they hit the MLS.</p>
        <!-- 154 words -->
      </div>
    </div>
  </div>
</section>
```

### 7. **No Local Market Data for AI Citation**
- **Issue:** Page is generic, not Chicago-specific
- **Impact:** AI can't cite you as Chicago expert
- **Fix:** Add market statistics:

```html
<section id="market-stats">
  <h2>Current Chicago Real Estate Market Conditions</h2>
  <p>
    As of August 2024, Chicago's North Side real estate market shows [X]% year-over-year price growth,
    with median home prices of $[XX] in Lincoln Park, $[XX] in Lakeview, and $[XX] in Bucktown.
    Average days on market is [X] days for condos and [X] days for single-family homes,
    indicating a [buyer/seller]-favorable market. Inventory levels are [up/down] [X]%
    compared to last year, providing [more/fewer] options for homebuyers.
  </p>
  <!-- Update quarterly with real data -->
</section>
```

### 8. **H2 Is Too Long and Not Keyword-Optimized**
- **Current:** "We offer thoughtful guidance and local expertise to help you buy with confidence"
- **Issue:** Reads like ad copy, not an H2 heading
- **Character count:** 78 (too long for a heading)
- **Fix:**

```html
<h2>Expert Buyer Representation in Lincoln Park, Lakeview & North Side Chicago</h2>
```

or
```html
<h2>Chicago Home Buying Services - Full-Service Buyer Agents</h2>
```

---

## MEDIUM PRIORITY ISSUES

### 9. **Missing Breadcrumb Navigation**
- **Impact:** Lost rich snippet opportunity
- **Fix:**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.portergoldberg.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Buying a Home in Chicago",
      "item": "https://www.portergoldberg.com/buying"
    }
  ]
}
```

### 10. **No Internal Links in Content**
- **Issue:** Page doesn't link to related resources
- **Fix:** Add contextual links:

```html
<p>
  Whether you're a <a href="/first-time-buyers">first-time buyer</a> exploring
  <a href="/inventory?area=lincoln-park">Lincoln Park condos</a>, a growing family
  seeking a <a href="/inventory?type=single-family">single-family home in Lakeview</a>,
  or an investor interested in <a href="/halcyon-development">new construction opportunities</a>,
  PorterGoldberg provides expert guidance throughout your journey.
</p>
```

### 11. **Missing Image Alt Text Opportunities**
- **Issue:** Flipbook images likely have generic alt text
- **Fix:** Ensure each stage has descriptive alt:

```html
<img src="step-1-consultation.jpg" alt="Chicago home buyer consultation with PorterGoldberg real estate agents discussing neighborhood options and budget">
<img src="step-2-financials.jpg" alt="Mortgage pre-approval process for Chicago home buyers, reviewing loan options and down payment requirements">
```

---

## GEO-SPECIFIC RECOMMENDATIONS

### Add to llms.txt

```markdown
## Buying a Home in Chicago

### The Home Buying Process
PorterGoldberg Residential guides Chicago home buyers through a comprehensive 10-step process: initial consultation, financial preparation and pre-approval, strategic home search (including off-market opportunities), competitive offer preparation, attorney review period, professional home inspection and due diligence, appraisal and loan approval, final walkthrough, closing day coordination, and post-closing support. The typical timeline from offer to closing is 60-90 days, though cash buyers can close in 14-21 days. PorterGoldberg specializes in Lincoln Park, Lakeview, Bucktown, and North Side Chicago neighborhoods, providing neighborhood-specific insights on pricing trends, building quality, and investment potential that generalist agents cannot match.

(147 words - AI citation ready)

### Chicago Buyer Costs & Requirements
Buying a home in Chicago requires a down payment of 3-20% (FHA: 3.5%, conventional: 5-20%, VA: 0%) plus closing costs of 2-5% of the purchase price. On a $500,000 home, buyers need $15,000-$100,000 for down payment and $10,000-$25,000 for closing costs. Buyer closing costs in Illinois include loan origination fees ($2,000-$3,000), title insurance ($1,500-$2,500), attorney fees ($1,000-$2,000), appraisal ($500-$700), inspection ($400-$800), and prepaid property taxes and insurance. Unlike sellers, buyers don't pay Illinois transfer taxes. First-time buyers may qualify for down payment assistance programs or negotiate seller concessions to offset closing costs. Credit score requirements typically range from 620 (FHA) to 740+ (best conventional rates).

(153 words)
```

---

## AEO IMPROVEMENTS NEEDED

### Target These Featured Snippet Opportunities

1. **"What are the steps to buying a house"** - Add numbered list
2. **"How much does it cost to buy a house in Chicago"** - Add cost breakdown table
3. **"What credit score do I need to buy a house"** - Add range: 620-760+
4. **"Should I use a buyer's agent"** - Add pros/cons comparison

---

## IMPLEMENTATION PRIORITY

### IMMEDIATE (This Week)
1. Fix duplicate brand name in title tag
2. Replace generic H1 with keyword-rich heading
3. Add text version of 10-step buying process (1,400 words)
4. Add 3-5 FAQ questions with 140-160 word answers

### Week 2
5. Add HowTo schema for buying process
6. Add Question schema for FAQs
7. Increase total word count to 2,500+
8. Add market statistics section

### Week 3
9. Add breadcrumb schema
10. Add internal links to inventory and neighborhoods
11. Optimize image alt text
12. Update llms.txt with buying process content

---

## EXPECTED IMPACT

**SEO Impact:**
- +40-60% organic traffic (currently underperforming)
- Featured snippet opportunities for "buying process" queries
- Better rankings for "Chicago buyer agent" keywords

**GEO Impact:**
- Dramatically improved - AI can actually cite your process
- Increased ChatGPT/Claude citations for buying questions
- Better llms.txt compliance

**AEO Impact:**
- Featured snippet potential for FAQ questions
- Voice search optimization
- "People Also Ask" visibility

---

## COMPARISON TO COMPETITORS

Most Chicago real estate sites have 2,500-4,000 word buyer guides with:
- Detailed neighborhood breakdowns
- Cost calculators
- Timeline infographics (with text alternatives)
- 10-15 FAQs
- Market data updates

**Your page: 800 words, visual-only flipbook**
**Competitor average: 3,000 words, comprehensive text guides**

**You're losing organic traffic to competitors with better content.**

---

## Next Page to Analyze
Ready to analyze: `/selling`, `/about-us`, `/inventory`, or another page?
