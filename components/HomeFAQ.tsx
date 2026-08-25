/* eslint-disable react/no-unescaped-entities */
/**
 * Homepage FAQ Section
 * Optimized for SEO, GEO (AI citation), and AEO (Answer Engine Optimization)
 * Short answers visible to users, full 134-167 word answers hidden but available to search engines
 */

export function HomeFAQ() {
  return (
    <section className="pg-home-faq">
      <div className="pg-testimonials-inner">
        <h2 id="faq-heading" className="pg-section-header">
          Frequently Asked Questions
        </h2>

        <div className="pg-faq-grid">
          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">What makes PorterGoldberg different from other Chicago real estate agents?</h3>

            {/* Short answer - visible to users */}
            <p className="pg-faq-short-answer">
              We are a boutique team focused exclusively on Chicago's North Side with 44 years combined experience, $550M+ in sales, and 85% referral-based clients. You work directly with experienced brokers, not junior associates.
            </p>

            {/* Full answer - hidden from users, visible to search engines/AI */}
            <div className="pg-faq-seo-content" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  PorterGoldberg Residential is a boutique Chicago real estate team specializing exclusively in North Side neighborhoods including Lincoln Park, Lakeview, Bucktown, and Gold Coast. Samantha Porter and Lauren Goldberg bring 44 years of combined experience and over $550 million in career sales. Unlike large brokerages with hundreds of agents, we maintain an 85% referral-based client base through personalized advocacy and deep neighborhood expertise. As exclusive representatives for Halcyon Development and members of Jameson Sothebys International Realty, we combine local market knowledge with global luxury marketing reach. Our collaborative approach means you work directly with experienced brokers, not junior associates.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Which Chicago neighborhoods does PorterGoldberg serve?</h3>

            {/* Short answer - visible to users */}
            <p className="pg-faq-short-answer">
              We specialize in Chicago's North Side: Lincoln Park, Lakeview, Bucktown, Wicker Park, Old Town, Gold Coast, Logan Square, Ravenswood, Roscoe Village, and Avondale.
            </p>

            {/* Full answer - hidden from users, visible to search engines/AI */}
            <div className="pg-faq-seo-content" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  PorterGoldberg specializes in Chicago's North Side luxury residential markets, covering approximately 10 distinct neighborhoods. Our primary service areas include Lincoln Park, Lakeview, Bucktown, Wicker Park, Old Town, Gold Coast, Logan Square, Ravenswood, Roscoe Village, and Avondale. This concentrated geographic focus allows us to maintain exceptional market intelligence on pricing trends, new development projects, off-market opportunities, and neighborhood dynamics. With our office at 425 W. North Avenue, were positioned at the heart of the North Side corridor, giving us immediate access to emerging listings and intimate knowledge of micro-market conditions that broader citywide agencies simply cannot match.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">How much does it cost to work with PorterGoldberg as a buyer or seller?</h3>

            {/* Short answer - visible to users */}
            <p className="pg-faq-short-answer">
              Buyers: Free—sellers pay commission. Sellers: Expect 7-10% total costs including commission (5-6%), transfer taxes, attorney fees, and staging/prep expenses.
            </p>

            {/* Full answer - hidden from users, visible to search engines/AI */}
            <div className="pg-faq-seo-content" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  Buyer representation is typically free for homebuyers—the seller pays both the listing agent and buyer's agent commission from the sale proceeds, usually 5-6% total (split between both agents). For sellers, our comprehensive marketing services through Jameson Sothebys International Realty include professional photography, virtual tours, global advertising, exclusive buyer network access, and expert pricing strategy. Chicago sellers can expect total selling costs of 7-10% of the sale price, including real estate commissions (5-6%), transfer taxes (1.5% for properties under $1M), attorney fees ($1,500-$3,000), and pre-sale preparation expenses like staging ($2,000-$5,000). Our strategic marketing consistently achieves sale prices 3-8% above comparable properties with limited marketing, justifying the investment through superior results.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
