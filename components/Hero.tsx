'use client'

import { useEffect, useRef, useState } from 'react'
import { Newsletter } from './Newsletter'

type HeroCard = {
  href: string
  label: string
  image: string
}

const HERO_CARDS: HeroCard[] = [
  { href: '/our-process', label: 'Sell', image: '/Square-Tiles-color-1-1.webp' },
  { href: '/buying', label: 'Buy', image: '/Square-Tiles-color-2-1.webp' },
  { href: '/about', label: 'About Us', image: '/Square-Tiles-color-3-1.webp' },
]

type HeroProps = {
  headline: string
  subheadline: string
  eyebrow?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

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

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

function HeroStat({
  value,
  prefix,
  suffix,
  label,
  description,
  animate,
}: {
  value: number
  prefix?: string
  suffix?: string
  label: string
  description: string
  animate: boolean
}) {
  const count = useCountUp(value, 1200, animate)
  const displayValue = animate ? formatNumber(count) : formatNumber(value)

  return (
    <div className="pg-hero-stat">
      <div className="pg-hero-stat-value">
        {prefix && <span className="pg-hero-stat-symbol">{prefix} </span>}
        {displayValue}
        {suffix && <span className="pg-hero-stat-symbol"> {suffix}</span>}
        {label && <span className="pg-hero-stat-label"> {label}</span>}
      </div>

      <p className="pg-hero-stat-desc">{description}</p>
    </div>
  )
}

export function Hero({
  headline,
  eyebrow = "Jameson Sotheby's International Realty · Chicago",
  primaryCta = { label: 'Our Process', href: '/our-process' },
  secondaryCta = { label: 'Get in Touch', href: '/contact' },
}: HeroProps) {
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

  // Split headline on comma for line break
  const parts = headline.split(',')

  return (
    <section className="pg-hero">
      <video
        className="pg-hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster=""
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="pg-hero-content">

        <div className="pg-hero-stats" ref={statsRef}>
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
        <h2 className="pg-starts-here-title">
          Buying, Selling, Owning, Renting Starts Here
        </h2>
        <div className="pg-starts-here-grid">
          {HERO_CARDS.map((card) => (
            <a key={card.href} href={card.href} className="pg-starts-here-card">
              <img
                src={card.image}
                alt={card.label}
                className="pg-starts-here-img"
              />
              
            </a>
          ))}
        </div>
      </div>

      {/* Bio section */}
      <div className="pg-hero-bio-wrap">
      <div className="pg-hero-bio">
        <div className="pg-hero-bio-text">
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
            Experience the extraordinary with <em><strong>Jameson Sotheby&apos;s International Realty</strong></em>—Anchored
            in the trusted integrity of our iconic global brand, Jameson Sotheby&apos;s International
            Realty offers luxury home sellers a potent combination of peerless client service,
            technology-forward resources, industry-leading marketing exposure, and a powerful
            global referral network that work in concert to deliver the best results.
          </p>
          <div className="pg-hero-bio-links">
            <a
              href="https://www.facebook.com/PorterGoldbergResidential"
              target="_blank"
              rel="noreferrer"
              className="pg-hero-bio-social"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <rect width="24" height="24" rx="4" fill="#1877F2" />
                <path d="M16.5 12.5h-2.5v8h-3v-8H9v-2.5h2v-1.8c0-2 1.2-3.2 3-3.2.9 0 1.7.1 1.7.1v2h-1c-1 0-1.2.5-1.2 1.1v1.8h2.2l-.2 2.5z" fill="#fff" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/portergoldbergresidential/"
              target="_blank"
              rel="noreferrer"
              className="pg-hero-bio-social"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="48" height="48">
                <defs>
                  <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#feda75" />
                    <stop offset="25%" stopColor="#fa7e1e" />
                    <stop offset="50%" stopColor="#d62976" />
                    <stop offset="75%" stopColor="#962fbf" />
                    <stop offset="100%" stopColor="#4f5bd5" />
                  </linearGradient>
                </defs>
                <rect width="24" height="24" rx="4" fill="url(#ig-grad)" />
                <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#fff" strokeWidth="1.5" fill="none" />
                <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.5" fill="none" />
                <circle cx="16.2" cy="7.8" r="1" fill="#fff" />
              </svg>
            </a>
            <a href="/contact" className="pg-hero-bio-btn">LET&apos;S CONNECT</a>
          </div>
        </div>
        <div className="pg-hero-bio-photo">
          <img
            src="/Lauren-and-Samantha-Oval.webp"
            alt="Samantha Porter and Lauren Goldberg"
            className="pg-hero-bio-img"
          />
        </div>
      </div>
      </div>

      <Newsletter />
    </section>
  )
}
