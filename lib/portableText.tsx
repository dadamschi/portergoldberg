import type { PortableTextComponents } from '@portabletext/react'
import { addUtmParams } from '@/lib/utils/utm'

export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || ''
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
