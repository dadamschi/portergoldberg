/* eslint-disable react/no-unescaped-entities */
/**
 * Selling Page FAQ Section
 * Optimized for SEO, GEO (AI citation), and AEO (Answer Engine Optimization)
 * Provides 134-167 word answers for AI citation + Question schema
 *
 * @param visibleToUsers - Controls whether FAQ is visible to users (always in DOM for SEO)
 */

type SellingFAQProps = {
  visibleToUsers?: boolean
}

export function SellingFAQ({ visibleToUsers = false }: SellingFAQProps) {
  return (
    <section className={`pg-faq${visibleToUsers ? '' : ' pg-hidden-for-users'}`} id="seller-faq" aria-labelledby="seller-faq-heading">
      <div className="pg-testimonials-inner">
        <h2 id="seller-faq-heading" className="pg-section-header">
          Common Questions About Selling Your Chicago Home
        </h2>

        <div className="pg-faq-grid">
          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">How long does it take to sell a house in Chicago?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  The average time to sell a house in Chicago ranges from 30 to 90 days depending on pricing, condition, location, and market conditions. Correctly priced homes in desirable North Side neighborhoods like Lincoln Park and Lakeview typically receive offers within 14-30 days, especially during peak spring and fall selling seasons. Overpriced properties can languish for 90-180 days, often requiring multiple price reductions that ultimately result in lower final sale prices than if priced correctly initially. Luxury properties over $1.5 million average 60-120 days on market due to smaller buyer pools. PorterGoldberg's pre-marketing strategy generates buyer interest before official listing dates, often resulting in first-week offers and above-asking multiple-bid situations for properly positioned properties.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">What is the best month to sell a house in Chicago?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  The best months to sell a house in Chicago are May and June, historically generating 8-15% higher sale prices and faster closing timelines than off-season sales. Spring selling (April-June) capitalizes on peak buyer activity, better weather for showings, and families coordinating with school year transitions. Homes listed in late April through mid-May receive maximum showings and competitive offers. Fall (September-October) is the second-best window, offering another spike in buyer activity before winter. Winter sales (December-February) typically take 40% longer and sell for 5-10% less due to reduced buyer competition and showing challenges. However, motivated winter buyers are often more serious and face less competition. PorterGoldberg's year-round marketing strategy leverages Sotheby's global buyer network to attract qualified purchasers regardless of season, though we typically recommend spring listings for maximum price achievement.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Do I need to stage my house before selling?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  Professional staging is not legally required but statistically increases sale prices by 5-15% and reduces time on market by 30-50% according to National Association of Realtors data. Staged homes help buyers visualize themselves in the space, photograph significantly better for online listings (where 95% of buyers begin their search), and create emotional connections that drive competitive offers. Staging investment typically ranges from $2,000-$5,000 for consultation and furniture rental, generating $15,000-$50,000+ in additional sale price on mid-to-high-value Chicago properties. Vacant homes are particularly challenging to sell—empty rooms photograph poorly and feel cold during showings. PorterGoldberg provides complimentary staging consultation, identifying high-impact improvements and connecting sellers with trusted Chicago staging professionals who understand North Side buyer preferences and current design trends that appeal to target demographics.
                </p>
              </div>
            </div>
          </article>

          <article className="pg-faq-item" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">How much does it cost to sell a house in Chicago?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text">
                <p>
                  Selling a home in Chicago costs approximately 7-10% of the sale price. On a $750,000 property, total costs are $52,500-$75,000 including: real estate commission (5-6%, split between listing and buyer agents), transfer taxes (1.5% for properties under $1M, 3% for luxury properties over $1M), attorney fees ($1,500-$3,000), title insurance and closing costs ($1,000-$2,000), and pre-sale preparation ($5,000-$20,000 for staging, repairs, cleaning). Transfer taxes are mandatory government fees sellers cannot avoid—Chicago charges 0.75%, Cook County 0.05%, Illinois 0.10%, plus 1.5% luxury surcharge on $1M+ properties. Strategic pre-sale improvements (staging, painting, landscaping) typically generate 3-10x return on investment through higher sale prices. PorterGoldberg's comprehensive Sotheby's marketing consistently achieves 3-8% higher sale prices than limited marketing approaches, justifying the investment.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
