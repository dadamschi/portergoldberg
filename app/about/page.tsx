import type { Metadata } from 'next'
import { Nav, Footer } from '@/components'
import { NAV_ITEMS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet Samantha Porter and Lauren Goldberg — Chicago real estate experts at Jameson Sotheby\'s International Realty.',
}

export default function AboutPage() {
  return (
    <>
      <main className="pg-about-page">
        {/* Samantha Porter */}
        <section className="pg-agent-section">
          <div className="pg-agent-photo">
            <div className="pg-agent-photo-placeholder" style={{ backgroundColor: '#2C3E35' }}>
              <span className="pg-agent-initials">SP</span>
            </div>
          </div>
          <div className="pg-agent-bio">
            <span className="pg-agent-name" style={{ fontWeight: '800' }}>Samantha Porter</span>
            <p>
              Samantha Porter is a seasoned, relationship-based broker with Jameson
              Sotheby&apos;s International Realty, starting her career in 1999 in Chicago.
              Growing up on the South Side (even if it really was the southwest suburbs),
              she attended the University of Nebraska &ndash; Lincoln and the University of
              Eastern Illinois, graduating with a degree in Business Marketing. Her travels
              through Europe, Asia, and the South Pacific enriched her character and outlook
              on life.
            </p>
            <p>
              Real estate allows Samantha to indulge in her passions for marketing, space
              planning, designing, and transformations. Partnering with Lauren to create
              PorterGoldberg was a career game-changer, committing to innovation and quality
              in both business and life.
            </p>
            <p>
              Samantha married the same year she entered real estate. Her husband David, a
              trained carpenter in his home country, England, is owner and operator of
               <a href="https://www.homescapeconstructioninc.com/" target="_blank" rel="noreferrer">
                Homescape Construction
              </a> delivering high quality residential new homes,
              restorations and additions. Samantha and David have two children they are
              raising in Logan Square. They are active in the children&apos;s school and
              sports, love to try new restaurants, go to shows, do the occasional run and
              support a range of local and national charities and causes.
            </p>
          </div>
        </section>

        {/* Partnership highlight */}
        <section className="pg-partnership">
          <blockquote className="pg-partnership-quote">
            Samantha and Lauren are Chicago natives, moms with two young children, and have
            husbands in construction. With kids in public and private schools, involvement
            in community, and a great knowledge of the real estate culture&hellip; they are
            a distinguishable resource.
          </blockquote>
        </section>

        {/* Lauren Goldberg */}
        <section className="pg-agent-section pg-agent-section--reversed">
          <div className="pg-agent-bio">
            <span className="pg-agent-name" style={{ fontWeight: '800' }}>Lauren Goldberg</span>
            <p>
              Lauren Goldberg is a broker at Jameson Sotheby&apos;s International Realty.
              With a background in Design and Fine Arts, Lauren brings an artistic eye to
              the table for her clients. After graduating from DePaul University with a BA,
              she began a career in outside sales for a distribution company where she was a
              Regional Manager for 4 states in the Midwest that required weekly travel.
              After 5 years of representing a variety of professional appliance lines,
              cabinetry, and several other home materials, she had learned deeply what
              resources go into a home. Given the professional training by an array of home
              manufacturing lines, working industry kitchen and bath trade shows around the
              U.S, she elevated herself as an expert in her field. As a result, Lauren has
              an extensive education in appliance brands, finishes and materials, and
              recognizes what it takes to create crucial parts of a home. This has been a
              vital skillset she has been able to provide her clients in the real-estate
              industry.
            </p>
            <p>
              As a seasoned agent since 2008, Lauren continues to deliver her clients a
              superior level of service. Lauren&apos;s design edge allows her to identify
              what is important or a &lsquo;red flag&rsquo; in a property, a critical part
              of the real-estate process. Lauren can assist with many aspects of
              real-estate, but specializes in luxury new construction, investment rehabs,
              and guiding buyers and sellers where to make improvements to increase their
              maximum value.
            </p>
            <p>
              Lauren has been married to her husband, Brian, of LG Group since 2006 often
              sharing expertise and resources in the business. They have two kids, two dogs,
              and reside in Lincoln Park. Lauren loves being a part of the LP community and
              being involved in her children&apos;s school and activities. Her friends and
              family often think of her as their go-to from offering her knowledge of the
              Chicago Public School System to what light fixture to select for their primary
              bedroom.
            </p>
            <p>
              Joining Samantha Porter and forming PorterGoldberg in 2018 was a true
              achievement. &ldquo;I couldn&apos;t feel luckier to have such a talented,
              intelligent partner that I have complete confidence in. We have built an
              upstanding business together and with our combined set of resources and
              different backgrounds, we stand apart from our peers. This allows us to
              proudly offer the most comprehensive services to our clientele.&rdquo;
            </p>
            <p>
              An animal lover, restaurant enthusiast, and passionate traveler, Lauren is a
              supporter of{' '}
              <a href="https://www.pawschicago.org/" target="_blank" rel="noreferrer">
                PAWS Chicago
              </a>
              ,{' '}
              <a href="https://www.campoutforkids.com/" target="_blank" rel="noreferrer">
                Camp Out For Kids
              </a>
              , &amp;{' '}
              <a href="https://www.ilholocaustmuseum.org/" target="_blank" rel="noreferrer">
                The Illinois Holocaust Museum &amp; Education Center
              </a>
              . Lauren is a member of the NAR, National Association of Realtors,
              CAR&mdash;Chicago Association of Realtors, and has been consistently awarded a
              Chicago Top Producer since 2011.
            </p>
          </div>
          <div className="pg-agent-photo">
            <div className="pg-agent-photo-placeholder" style={{ backgroundColor: '#28303C' }}>
              <span className="pg-agent-initials">LG</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
