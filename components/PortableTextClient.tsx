'use client'

import { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { openContactForm } from '@/lib/utils/contact'
import { addUtmParams } from '@/lib/utils/utm'
import type { PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || ''

      // Handle #contact: pattern - open contact slider
      if (href.startsWith('#contact:')) {
        const message = decodeURIComponent(href.replace('#contact:', ''))
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

      const isExternal = href.startsWith('http://') || href.startsWith('https://')

      return isExternal ? (
        <a href={addUtmParams(href, { campaign: 'content' })} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      )
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
        const message = decodeURIComponent(href.replace('#contact:', ''))
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
