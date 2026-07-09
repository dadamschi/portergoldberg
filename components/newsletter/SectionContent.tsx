import Link from 'next/link'
import { ContactLink } from '@/components'
import { addUtmParams } from '@/lib/utils/utm'

interface SectionContentProps {
  body?: string
  moreInfo?: string
  linkUrl?: string
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

  if (!linkUrl) {
    return textBlock
  }

  const linkStyle = { textDecoration: 'none', color: 'inherit' }

  if (linkUrl.startsWith('#contact:')) {
    const message = linkUrl.replace('#contact:', '')
    return (
      <ContactLink message={message} style={linkStyle}>
        {textBlock}
      </ContactLink>
    )
  }

  if (linkUrl.startsWith('/')) {
    return (
      <Link href={linkUrl} style={linkStyle}>
        {textBlock}
      </Link>
    )
  }

  return (
    <a
      href={addUtmParams(linkUrl, { campaign: 'newsletter' })}
      target="_blank"
      rel="noreferrer"
      style={linkStyle}
    >
      {textBlock}
    </a>
  )
}
