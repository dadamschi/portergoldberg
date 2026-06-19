'use client'

import Image from 'next/image'
import Link from 'next/link'
import { openContactForm as openForm } from '@/lib/utils/contact'

type ContactBannerProps = {
  href?: string
  title?: string
  cta?: string
  image?: string
  imageAlt?: string
  openContactForm?: boolean
  contactMessage?: string
}

export function ContactBanner({
  href,
  title = 'Contact Us',
  cta = 'Send Message',
  image = '/PorterGoldberg-Residential.webp',
  imageAlt = 'PorterGoldberg',
  openContactForm = false,
  contactMessage,
}: ContactBannerProps) {

  function handleClick(e: React.MouseEvent) {
    if (openContactForm) {
      e.preventDefault()
      openForm(contactMessage)
    }
  }

  const content = (
    <div className="pg-contact-banner">
      <div className="pg-contact-banner-photo" style={{ position: 'relative' }}>
        <Image
          src={image}
          alt={imageAlt}
          className="pg-contact-banner-img"
          fill
          sizes="75vw"
        />
      </div>
      <div className="pg-contact-banner-info">
        <span className="pg-contact-banner-name">{title}</span>
        <span className="pg-contact-banner-cta">
          {cta}
          <svg
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            aria-hidden="true"
            className="pg-contact-banner-arrow"
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
      <button className="pg-contact-banner-link" onClick={handleClick} type="button">
        {content}
      </button>
    )
  }

  return (
    <section className="pg-cta-section">
      <Link href={href ?? '/contact'} className="pg-contact-banner-link">
        {content}
      </Link>
    </section>
  )
}
