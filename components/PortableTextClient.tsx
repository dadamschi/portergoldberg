'use client'

import { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { openContactForm } from '@/lib/utils/contact'
import { isContactLink, isExternalLink, getContactMessage, getLinkProps } from '@/lib/utils/links'
import type { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'

type ImageValue = {
  asset?: {
    _id?: string
    url?: string
  }
  alt?: string
  linkUrl?: string
}

function LinkedImage({ value }: { value: ImageValue }) {
  if (!value?.asset?.url) return null

  const imageElement = (
    <Image
      src={value.asset.url}
      alt={value.alt || 'Image'}
      width={800}
      height={450}
      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
    />
  )

  const linkUrl = value.linkUrl

  if (!linkUrl) {
    return <div className="pg-portable-image">{imageElement}</div>
  }

  if (isContactLink(linkUrl)) {
    const message = getContactMessage(linkUrl)
    return (
      <div className="pg-portable-image">
        <button
          type="button"
          onClick={() => openContactForm(message)}
          className="pg-portable-image-link"
        >
          {imageElement}
        </button>
      </div>
    )
  }

  const linkProps = getLinkProps(linkUrl, 'content')

  return (
    <div className="pg-portable-image">
      <a {...linkProps} className="pg-portable-image-link">
        {imageElement}
      </a>
    </div>
  )
}

const components: PortableTextComponents = {
  types: {
    image: LinkedImage,
  },
  marks: {
    highlight: ({ children }) => (
      <span className="pg-text-highlight">{children}</span>
    ),
    cursive: ({ children }) => (
      <span className="pg-text-cursive">{children}</span>
    ),
    link: ({ children, value }) => {
      const href = value?.href || ''

      if (isContactLink(href)) {
        const message = getContactMessage(href)
        return (
          <button
            type="button"
            onClick={() => openContactForm(message)}
            className="pg-contact-link"
          >
            {children}
          </button>
        )
      }

      if (isExternalLink(href)) {
        const linkProps = getLinkProps(href, 'content')
        return <a {...linkProps}>{children}</a>
      }

      return <a href={href}>{children}</a>
    },
  },
}

interface PortableTextClientProps {
  value: PortableTextBlock[]
  className?: string
}

export function PortableTextClient({ value, className }: PortableTextClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Fallback: intercept any #contact: links that weren't caught by the component
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#contact:"]')
      if (link) {
        e.preventDefault()
        const href = link.getAttribute('href') || ''
        const message = getContactMessage(href)
        openContactForm(message)
      }
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
