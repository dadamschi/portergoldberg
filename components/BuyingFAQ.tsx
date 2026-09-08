/* eslint-disable react/no-unescaped-entities */
/**
 * Buying Page FAQ Section
 * Optimized for SEO, GEO (AI citation), and AEO (Answer Engine Optimization)
 * Provides 134-167 word answers for AI citation + Question schema
 *
 * @param visibleToUsers - Controls whether FAQ is visible to users (always in DOM for SEO)
 */

type BuyingFAQProps = {
  visibleToUsers?: boolean
}

export function BuyingFAQ({ visibleToUsers = false }: BuyingFAQProps) {
  return (
    <section className={`pg-faq${visibleToUsers ? '' : ' pg-hidden-for-users'}`} id="buyer-faq" aria-labelledby="buyer-faq-heading">
      <div className="pg-testimonials-inner">
        <h2 id="buyer-faq-heading" className="pg-section-header">
          Frequently Asked Questions About Buying in Chicago
        </h2>

        <div className="pg-faq-grid">
          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">How much do I need for a down payment when buying a house in Chicago?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  Down payment requirements for Chicago homes typically range from 3% to 20% depending on your loan type and financial situation. First-time buyers often qualify for low down payment programs: FHA loans require just 3.5% down, conventional loans with PMI accept 3-5%, and VA loans (for veterans) offer 0% down. For a $500,000 Lincoln Park condo, that's $15,000 (3%) to $100,000 (20%). Larger down payments (20%+) eliminate private mortgage insurance (PMI), which costs $100-$300 monthly on a $500K loan. Many Chicago buyers in competitive North Side markets put down 10-20% to strengthen their offers and reduce monthly payments. PorterGoldberg can connect you with lenders offering down payment assistance programs for qualified buyers.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">What are closing costs when buying a house in Illinois?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  Buyer closing costs in Illinois typically total 2-5% of the purchase price, covering lender fees, title insurance, attorney fees, and prepaid expenses. On a $500,000 Chicago home, expect $10,000-$25,000 in closing costs. Major expenses include: loan origination fees ($2,000-$3,000), title insurance ($1,500-$2,500), attorney fees ($1,000-$2,000), appraisal ($500-$700), home inspection ($400-$800), and prepaid property taxes and homeowner's insurance (varies by closing date). Unlike some states, Illinois buyers don't pay transfer taxes—sellers cover that cost. First-time buyers may negotiate seller credits to offset closing costs, especially in buyer-favorable markets. Your lender provides a detailed Loan Estimate showing exact closing costs within three days of applying.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">How long does it take to buy a house in Chicago?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  The Chicago home buying timeline typically spans 60-90 days from offer acceptance to closing, though this varies significantly based on financing type, property condition, and market competition. Breaking it down: finding the right property (2-12 weeks depending on market activity), attorney review period (5-7 days), inspection period (7-14 days), appraisal and loan processing (30-45 days), and final closing preparations (1-2 weeks). Cash buyers can close in as little as 14-21 days since they skip mortgage underwriting. New construction purchases take 6-18 months depending on building completion timelines. In competitive North Side Chicago markets like Lincoln Park or Lakeview, PorterGoldberg's off-market network and pre-approval strategies can significantly accelerate your search phase, helping you secure properties before they hit the MLS.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Do I need a buyer's agent to buy a house in Chicago?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  While not legally required, buyer representation is highly recommended in Chicago's competitive real estate market. Buyer's agents provide expertise in neighborhood selection, property valuation, negotiation strategy, inspection coordination, and contract management. Most importantly, buyer's agent services are typically free for homebuyers—the seller pays both the listing agent and buyer's agent commission from the sale proceeds. Without representation, you would still pay the same purchase price but forfeit professional advocacy, market insights, and negotiation power. PorterGoldberg's 44 years of combined Chicago experience means we identify red flags like assessment appeals, special assessments, building issues, and zoning concerns that unrepresented buyers often miss. Our North Side expertise, off-market access, and Sotheby's resources give you significant advantages over unrepresented buyers competing for the same properties.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
