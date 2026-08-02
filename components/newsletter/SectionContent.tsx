import Link from 'next/link'
import { ContactLink } from '@/components'
import { addUtmParams } from '@/lib/utils/utm'

interface SectionContentProps {
  body?: string
  moreInfo?: string
  linkUrl?: string | {
    url?: string
    customText?: string
  }
}

export function SectionContent({ body, moreInfo, linkUrl }: SectionContentProps) {
  if (!body && !moreInfo) {
    return null
  }

  const textBlock = (
    <div>
      {body && <p>{body}</p>}
      {moreInfo && <p className="pg-newsletter-section-more-info">{moreInfo}</p>}
    </div>
  )

  // Handle both old (string) and new (object) formats
  const url = typeof linkUrl === 'string' ? linkUrl : linkUrl?.url

  if (!url) {
    return textBlock
  }

  const linkStyle = { textDecoration: 'none', color: 'inherit' }

  if (url.startsWith('#contact:')) {
    const message = url.replace('#contact:', '')
    return (
      <ContactLink message={message} style={linkStyle}>
        {textBlock}
      </ContactLink>
    )
  }

  if (url.startsWith('/')) {
    return (
      <Link href={url} style={linkStyle}>
        {textBlock}
      </Link>
    )
  }

  return (
    <a
      href={addUtmParams(url, { campaign: 'newsletter' })}
      target="_blank"
      rel="noreferrer"
      style={linkStyle}
    >
      {textBlock}
    </a>
  )
}
