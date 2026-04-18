import { Nav, Hero, Stats, About, Listings, Testimonials, Contact, Footer } from '@/components'
import { NAV_ITEMS, HERO, STATS, ABOUT, LISTINGS, TESTIMONIALS, AGENTS } from '@/lib/data'

export default function HomePage() {
  return (
    <>
      <Nav items={NAV_ITEMS} />

      <main>
        <Hero
          headline={HERO.headline}
          subheadline={HERO.subheadline}
        />
        {/* <About
          sectionLabel={ABOUT.sectionLabel}
          headline={ABOUT.headline}
          paragraphs={ABOUT.intro}
          tagline={ABOUT.tagline}
        /> */}
        <Listings listings={LISTINGS} />
        <Testimonials testimonials={TESTIMONIALS} />
      </main>

      <Footer />
    </>
  )
}
