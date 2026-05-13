'use client'

import Image from 'next/image'
import Link from 'next/link'
import { openContactForm as openForm } from '@/lib/utils/contact'

type NewsletterBannerProps = {
  href?: string
  title?: string
  cta?: string
  image?: string
  imageAlt?: string
  openContactForm?: boolean
  contactMessage?: string
}

export function NewsletterBanner({
  href,
  title = 'Contact Us',
  cta = 'Send Message',
  image = '/PorterGoldberg-Residential.webp',
  imageAlt = 'PorterGoldberg',
  openContactForm = false,
  contactMessage,
}: NewsletterBannerProps) {

  function handleClick(e: React.MouseEvent) {
    if (openContactForm) {
      e.preventDefault()
      openForm(contactMessage)
    }
  }

  const content = (
    <div className="pg-newsletter-banner">
      <div className="pg-newsletter-banner-photo" style={{ position: 'relative' }}>
        <Image
          src={image}
          alt={imageAlt}
          className="pg-newsletter-banner-img"
          fill
          sizes="75vw"
        />
      </div>
      <div className="pg-newsletter-banner-info">
        <span className="pg-newsletter-banner-name">{title}</span>
        <span className="pg-newsletter-banner-cta">
          {cta}
          <svg
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            aria-hidden="true"
            className="pg-newsletter-banner-arrow"
          >
            <path
              d="M1 6h17M13 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  )

  if (openContactForm) {
    return (
      <button className="pg-newsletter-banner-link" onClick={handleClick} type="button">
        {content}
      </button>
    )
  }

  return (
    <Link href={href ?? '/contact'} className="pg-newsletter-banner-link">
      {content}
    </Link>
  )
}
