'use client'

import { useEffect, useRef, useState } from 'react'
import { Newsletter } from './Newsletter'
import { formatNumber } from '@/lib/utils/numbers'
import { addUtmParams } from '@/lib/utils/utm'
import { openContactForm } from '@/lib/utils/contact'
import { FacebookIcon, InstagramIcon, YouTubeIcon, SOCIAL_URLS } from './SocialLinks'
import Image from 'next/image'
import type { PortableTextBlock } from '@portabletext/types'
import { PortableTextClient } from './PortableTextClient'

type HeroCard = {
  href: string
  label: string
  image: string
}

const HERO_CARDS: HeroCard[] = [
  { href: '/selling/our-process', label: 'Sell', image: '/home-sell.jpg' },
  { href: '/buying', label: 'Buying', image: '/home-buy.jpg' },
  { href: '/about-us', label: 'About Us', image: '/home-about.jpg' },
]

function useCountUp(target: number, duration = 1200, trigger = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setCount(Math.round(start))
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, trigger])

  return count
}

function HeroStat({
  value,
  prefix,
  suffix,
  label,
  description,
  animate,
}: {
  value?: number
  prefix?: string
  suffix?: string
  label: string
  description: string
  animate: boolean
}) {
  const count = useCountUp(value ?? 0, 1200, animate)
  const displayValue = value !== undefined ? (animate ? formatNumber(count) : formatNumber(value)) : null

  return (
    <div className="pg-hero-stat" itemScope itemType="https://schema.org/QuantitativeValue">
      <div className="pg-hero-stat-value">
        {prefix && <span className="pg-hero-stat-symbol">{prefix}</span>}
        <span itemProp="value">{displayValue}</span>
        {suffix && <span className="pg-hero-stat-symbol">{suffix}</span>}
        {label && <span className="pg-hero-stat-label"> {label}</span>}
      </div>

      <p className="pg-hero-stat-desc" itemProp="description">{description}</p>
    </div>
  )
}

type HeroProps = {
  heroBio?: PortableTextBlock[]
}

export function Hero({ heroBio }: HeroProps) {
  const statsRef = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="pg-hero">
      <h1 className="sr-only">Chicago Luxury Real Estate - PorterGoldberg Residential</h1>
      <div className="pg-hero-video-wrap">
        <video
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="pg-hero-video"
        />
      </div>
      <div className="pg-hero-content">

        <div
          className="pg-hero-stats"
          ref={statsRef}
          itemScope
          itemType="https://schema.org/ProfessionalService"
          itemProp="about"
        >
          <meta itemProp="name" content="PorterGoldberg Residential" />
          <HeroStat
            value={85}
            suffix="%"
            label="Referral"
            description="Client base that confidently recommends our personal service and advocacy"
            animate={animate}
          />
          <HeroStat
            value={44}
            label="Years"
            description="Combined expertise and experience in residential brokerage services"
            animate={animate}
          />
          <HeroStat
            value={550000000}
            prefix="$"
            suffix="+"
            label=""
            description="Career sales of existing homes, new construction, and land acquisitions"
            animate={animate}
          />
        </div>
      </div>

      {/* Starts Here cards */}
      <div className="pg-starts-here">
        <h2 className="pg-starts-here-title" style={{ fontWeight: 600, lineHeight: 1.2 }}>
          Buying, Selling, Owning, Renting Starts Here
        </h2>
        <div className="pg-starts-here-grid" style={{ fontWeight: 600 }}>
          {HERO_CARDS.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="pg-starts-here-card"
              aria-label={`${card.label} - Learn more about our ${card.label.toLowerCase()} services`}
            >
              <Image
                src={card.image}
                alt={card.label}
                className="pg-starts-here-img"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Bio section */}
      <div className="pg-hero-bio-wrap">
      <div className="pg-hero-bio">
        <div className="pg-hero-bio-text">
          {heroBio ? (
            <PortableTextClient value={heroBio} />
          ) : (
            <>
              <p>
                <em><strong>Real estate is personal</strong></em>—and so is our approach. We don&apos;t simply advise; we
                collaborate, advocate, and help shape the lifestyle you&apos;re building. The process—buying,
                selling, or creating something new—should feel seamless and smart.
              </p>
              <p>
                With complementary perspectives and a deep understanding of Chicago real estate,{' '}
                <em><strong>Samantha Porter and Lauren Goldberg</strong></em> anticipate challenges, identify opportunities,
                and connect you to the resources that matter.
              </p>
              <p>
                Experience the extraordinary with <em><strong>Jameson Sotheby&apos;s International Realty</strong></em>. Our
                global brand delivers peerless client service, cutting-edge technology, world-class
                marketing, and an international referral network—all working together to achieve the
                best results.
              </p>
            </>
          )}
          <div className="pg-hero-bio-links">
            <a
              href={addUtmParams(SOCIAL_URLS.facebook, { campaign: 'social' })}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-hero-bio-social"
              aria-label="Facebook"
            >
              <FacebookIcon size={48} />
            </a>
            <a
              href={addUtmParams(SOCIAL_URLS.instagram, { campaign: 'social' })}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-hero-bio-social"
              aria-label="Instagram"
            >
              <InstagramIcon size={48} />
            </a>
            <a
              href={addUtmParams(SOCIAL_URLS.youtube, { campaign: 'social' })}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-hero-bio-social"
              aria-label="YouTube"
            >
              <YouTubeIcon size={48} />
            </a>
            <button onClick={() => openContactForm()} className="pg-hero-bio-btn" type="button">LET&apos;S CONNECT</button>
          </div>
        </div>
        <div className="pg-hero-bio-photo">
          <Image
            src="/Lauren-and-Samantha-Oval.webp"
            alt="Samantha Porter and Lauren Goldberg"
            className="pg-hero-bio-img"
            fill
            sizes="(max-width: 768px) 280px, 420px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      </div>

      <Newsletter />
    </section>
  )
}
