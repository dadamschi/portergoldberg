import type { Metadata } from 'next'
import Image from 'next/image'
import { client } from '@/lib/client'
import { HALCYON_LISTINGS_QUERY } from '@/lib/queries'
import { addUtmParams } from '@/lib/utils/utm'
import type { Listing } from '@/types'
import { ListingCard } from '@/components/ListingCard'

export const metadata: Metadata = {
  title: 'Halcyon Development',
  description: 'As the exclusive representatives for Halcyon Development, Samantha and Lauren partner with one of Chicago\'s most respected and visionary builders.',
}

type HalcyonData = {
  available: Listing[]
  sold: Listing[]
}

async function getHalcyonListings(): Promise<HalcyonData> {
  const data = await client.fetch<HalcyonData>(HALCYON_LISTINGS_QUERY)
  return data
}

export default async function HalcyonDevelopmentPage() {
  const { available, sold } = await getHalcyonListings()

  return (
    <main className="pg-page pg-halcyon-page">
      {/* Hero Section */}
      <section className="pg-page-hero pg-halcyon-hero">
        <Image
          src="/halcyon-header-WHITE.png"
          alt="Halcyon Development"
          width={361}
          height={54}
          className="pg-halcyon-logo"
        />
        {/* <h1>Halcyon Development</h1> */}
        <p>
          As the exclusive representatives for Halcyon Development, Samantha and Lauren partner with one of Chicago&apos;s most respected and visionary builders
        </p>
      </section>

      {/* About Section */}
      <section className="pg-halcyon-about">
        <div className="pg-halcyon-about-inner">
          <div className="pg-halcyon-about-image">
            <Image
              src="/Halcyon-Group-Shot.jpeg"
              alt="About The Developer: Halcyon Development"
              title="Halcyon Group Shot"
              width={900}
              height={1280}
              sizes="(max-width: 480px) 480px, 853px"
              priority
              className="pg-halcyon-group-photo"
            />
          </div>
          <div className="pg-halcyon-about-text">
            <h2>Introducing Halcyon Development</h2>

            <p>
              Inspired by his experience traveling and living in Europe for six years, Chris DeLeeuw founded Halcyon Development and Design Group in Chicago in 2001. His brother, Paul, joined Halcyon in 2009. After two decades working in Europe himself, Paul carries a unique perspective on materials, construction, and building applications.
            </p>

            <p>For Chris and Paul, the definition of Halcyon translates to a complete and compelling living experience:</p>

            <blockquote className="pg-halcyon-quote">
              <p>
                Building a lifestyle, that&apos;s the way we see it. Our business is about creating quality homes for people who enjoy living in a real community, close to where they work and play, in a unique space with an evolved modern design.
              </p>
              <cite>— Chris DeLeeuw</cite>
            </blockquote>

            <p>
              Halcyon is a contemporary residential development company with a true enthusiasm for sophisticated urban life. Halcyon designs are distinguished by their creation of unique interactions between space, structure, light, form, and alternative materials. Halcyon homes feature breathtaking open floor plans with an unparalleled, tranquil use of both natural and energy efficient lighting.
            </p>

            <p>
              Chris and Paul are purposefully engaged in each step of every building from the ground up. Their partnership allows them to combine distinctive designs and finishes with a quality control that is possible only through their hands-on dedication to perfection in every detail. To date, Halcyon has completed over 110 developments in and around the Chicago neighborhoods of Bucktown, Wicker Park, Lakeview, Lincoln Park, and Logan Square. From single-family homes to condominiums, Halcyon&apos;s impression on the local landscape is apparent and growing at a substantial pace.
            </p>

            <p>
              Halcyon is the recipient of the ALA Award of Merit in the years 2011, 2014, 2016, &amp; 2018, <em>&quot;In recognition of superior achievement and professional design excellence.&quot;</em>
            </p>

            <p>
              Halcyon is a member of the United States Green Building Council (USGBC). With building standards inspired by the Leadership in Energy and Environmental Design (LEED) which is an internationally recognized certification system administered by the Green Building Certification Institute (GBCI).
            </p>

            <p>
              To learn more about Halcyon Development, please visit 
              <br />
              <a href={addUtmParams('https://halcyon-development.com/', { campaign: 'halcyon-partnership' })} target="_blank" rel="noopener noreferrer">
                halcyon-development.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Media Row: Birdseye Image + Video */}
      <section className="pg-halcyon-media-row">
        <div className="pg-halcyon-media-image">
          <Image
            src="/halcyon-birdseye.png"
            alt="Halcyon Development Aerial View"
            width={2560}
            height={1708}
            className="pg-halcyon-aerial"
          />
        </div>
        <div className="pg-halcyon-media-video">
          <iframe
            src="https://player.vimeo.com/video/1104110146?dnt=1"
            title="HALCYON 'Give shape to hopes and dreams'"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>


      {available.length > 0 && (
        <section className="pg-halcyon-projects">
          <h2>Available & Coming Soon</h2>
          <div className="pg-halcyon-listings-grid">
            {available.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {sold.length > 0 && (
        <section className="pg-halcyon-projects">
          <h2>Sold Projects</h2>
          <div className="pg-halcyon-listings-grid">
            {sold.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
