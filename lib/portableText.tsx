'use client'

import type { PortableTextComponents } from '@portabletext/react'
import { addUtmParams } from '@/lib/utils/utm'
import { openContactForm } from '@/lib/utils/contact'

export const portableTextComponents: PortableTextComponents = {
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

      const isInternal = href.startsWith('/') || href.startsWith('#')

      // Internal links stay in same tab
      if (isInternal) {
        return <a href={href}>{children}</a>
      }

      // External links always open in new tab
      const finalHref = href.startsWith('http') ? href : `https://${href}`
      return (
        <a
          href={addUtmParams(finalHref, { campaign: 'content' })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
  },
}
