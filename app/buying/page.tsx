import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { BUY_PAGE_QUERY } from '@/lib/queries'
import { Flipbook } from '@/components/Flipbook'
import { FAQJsonLd } from '@/components/JsonLd'
import type { BuyPageData } from '@/types'

export const metadata: Metadata = {
  title: 'Buying a Home in Chicago',
  description: 'Expert guide to buying a home in Chicago. PorterGoldberg Residential provides full-service buyer representation in Lincoln Park, Lakeview, Bucktown, and Chicago\'s North Side.',
}

const BUYING_FAQS = [
  {
    question: 'How long does it take to buy a home in Chicago?',
    answer: 'The typical home buying process in Chicago takes 30-60 days from accepted offer to closing. However, finding the right home can take anywhere from a few weeks to several months depending on your criteria and market conditions. PorterGoldberg guides you through each step efficiently.',
  },
  {
    question: 'What neighborhoods does PorterGoldberg specialize in for buyers?',
    answer: 'PorterGoldberg specializes in Chicago\'s North Side neighborhoods including Lincoln Park, Lakeview, Bucktown, Wicker Park, Old Town, Gold Coast, North Center, Roscoe Village, Logan Square, and Ravenswood. We have deep knowledge of each area\'s character, schools, and market trends.',
  },
  {
    question: 'Do I need a buyer\'s agent when purchasing a home in Chicago?',
    answer: 'Yes, having a dedicated buyer\'s agent is highly recommended. Your agent represents your interests exclusively, helps you navigate negotiations, identifies potential issues, and ensures you get the best possible terms. In most cases, the seller pays the buyer\'s agent commission.',
  },
  {
    question: 'What should I expect when making an offer on a Chicago home?',
    answer: 'When making an offer, PorterGoldberg prepares a competitive strategy based on comparable sales, current market conditions, and the property\'s time on market. We handle all negotiations, counteroffers, and contract terms to secure the best price and conditions for your purchase.',
  },
  {
    question: 'How do I get started with PorterGoldberg as a buyer?',
    answer: 'Contact Samantha Porter at 312-944-8900 or Lauren Goldberg at 773-576-0053 for an initial consultation. We\'ll discuss your goals, timeline, budget, and preferred neighborhoods to create a personalized home search strategy.',
  },
]

async function getBuyPageData(): Promise<BuyPageData | null> {
  const data = await client.fetch<BuyPageData>(BUY_PAGE_QUERY)
  return data
}

export default async function BuyPage() {
  const data = await getBuyPageData()
  console.log('BuyPage data:', data)

  if (!data) {
    return (
      <main className="pg-page pg-buy-page">
        <section className="pg-page-hero">
          <h1>Buying</h1>
          <p>Content coming soon. Please add a Buy Page document in Sanity.</p>
        </section>
      </main>
    )
  }

  return (
    <>
      <FAQJsonLd faqs={BUYING_FAQS} />
      <main className="pg-page pg-buy-page">
        <section className="pg-page-hero">
          <h1>{data.title}</h1>
          {data.headline && <p>{data.headline}</p>}
        </section>

        <section className="pg-buy-flipbook">
          <Flipbook images={data.flipbookImages} />
        </section>
      </main>
    </>
  )
}
