import Link from 'next/link'
import { addUtmParams } from '@/lib/utils/utm'
import { formatPhoneNumber } from '@/lib/utils/contact'
import { ContactLink } from '@/components/ContactLink'

interface SectionLinksProps {
  linkUrl?: string | {
    url?: string
    customText?: string
  }
  instagram?: string
  email?: string
  facebookHandle?: string
  phone?: string
}

export function SectionLinks({ linkUrl, instagram, email, facebookHandle, phone }: SectionLinksProps) {
  // Handle both old (string) and new (object) formats
  const url = typeof linkUrl === 'string' ? linkUrl : linkUrl?.url
  const customText = typeof linkUrl === 'string' ? undefined : linkUrl?.customText

  if (!url && !instagram && !email && !phone && !facebookHandle) {
    return null
  }

  // Instagram link
  const instagramHandle = instagram?.replace('@', '')
  const formattedInstagramLink = instagramHandle ? (
    <a
      href={addUtmParams(`https://instagram.com/${instagramHandle}`, { campaign: 'newsletter' })}
      target="_blank"
      rel="noreferrer"
      className="pg-newsletter-url-link"
    >
      IG: @{instagramHandle}
    </a>
  ) : null

  const formattedFacebookLink = facebookHandle ? (
    <a
      href={addUtmParams(`https://www.facebook.com/${facebookHandle}`, { campaign: 'newsletter' })}
      target="_blank"
      rel="noreferrer"
      className="pg-newsletter-url-link"
    >
      FB: {facebookHandle}
    </a>
  ) : null

  const formattedEmailLink = email ? (
        <a href={`mailto:${email}?subject=${encodeURIComponent('Information request via PorterGoldberg newsletter')}`} className="pg-newsletter-url-link">
          e: {email}
        </a>
      ) : null

  const phoneNumber = phone ? (
    <a href={`tel:${phone.replace(/\D/g, '')}`} className="pg-newsletter-url-link">
      {formatPhoneNumber(phone)}
    </a>
  ) : null

  type LinkType = 'none' | 'contact' | 'local' | 'brochure' | 'external'

  function getLinkType(url?: string): LinkType {
    if (!url) return 'none'
    if (url.startsWith('#contact:')) return 'contact'
    if (url.startsWith('/') || url.includes('portergoldberg.com')) return 'local'
    if (url.includes('jamesonps.com')) return 'brochure'
    return 'external'
  }

  const linkType = getLinkType(url);

  let urlLink: React.ReactNode = null

  if (linkType !== 'none' && url) {
    if (linkType === 'local') {
      const localPath = url.startsWith('/')
        ? url
        : new URL(url).pathname

      const pathMap: Record<string, string> = {
        '/': '',
        '/about': 'About',
        '/selling': 'Selling',
        '/buying': 'Checkout out the Buying Process',
        '/vendors': 'Checkout our Vendors',
        '/inventory': 'Checkout our current inventory',
        '/testimonials': 'Checkout Testimonials from our valued clients',
      }

      const linkText = customText || pathMap[localPath] || 'Learn More'

      urlLink = (
        <Link href={localPath} className="pg-newsletter-url-link">
          {linkText}
        </Link>
      )
    } else if (linkType === 'brochure') {
      // Check if it's a Jameson property brochure
      const isBrochure = url.includes('jamesonps.com')
      let linkText = customText || (isBrochure ? 'Check out the property brochure' : url)
      linkText = (!customText && url.length > 50) ? 'Learn More' : linkText

      urlLink = (
        <a
          href={addUtmParams(url, { campaign: 'newsletter' })}
          target="_blank"
          rel="noreferrer"
          className="pg-newsletter-url-link"
        >
          {linkText}
        </a>
      )
    } else if (linkType === 'contact') {
      urlLink = (
        <ContactLink message={url.replace('#contact:', '')} className="pg-newsletter-url-link">
          {customText || 'Contact Us'}
        </ContactLink>
      )
    } else {
      const linkText = customText || (url.length > 50 ? 'Learn More' : url)
      urlLink = (
        <Link href={url} 
              target="_blank" 
              className="pg-newsletter-url-link"
              rel="noreferrer">
          {linkText}
        </Link>
      )
    }
  }

  return (
    <div className="pg-newsletter-section-links">
      {urlLink}
      {formattedEmailLink}
      {phoneNumber}
      {formattedInstagramLink}
      {formattedFacebookLink}
    </div>
  )
}
