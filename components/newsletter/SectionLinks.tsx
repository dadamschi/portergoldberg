import Link from 'next/link'
import { addUtmParams } from '@/lib/utils/utm'
import { ContactLink } from '@/components/ContactLink'

interface SectionLinksProps {
  linkUrl?: string
  instagram?: string
  email?: string
  facebookHandle?: string
}

export function SectionLinks({ linkUrl, instagram, email, facebookHandle }: SectionLinksProps) {
  console.log('urlLink', linkUrl)
  console.log('instagramLink', instagram)
  console.log('email', email)
  console.log('facebook', facebookHandle)

  if (!linkUrl && !instagram && !email) {
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

  type LinkType = 'none' | 'contact' | 'local' | 'brochure' | 'external'

  function getLinkType(url?: string): LinkType {
    if (!url) return 'none'
    if (url.startsWith('#contact:')) return 'contact'
    if (url.startsWith('/') || url.includes('portergoldberg.com')) return 'local'
    if (url.includes('jamesonps.com')) return 'brochure'
    return 'external'
  }

  const linkType = getLinkType(linkUrl);

  let urlLink: React.ReactNode = null

  if (linkType !== 'none' && linkUrl) {
    if (linkType === 'local') {
      const localPath = linkUrl.startsWith('/')
        ? linkUrl
        : new URL(linkUrl).pathname

      const pathMap: Record<string, string> = {
        '/': '',
        '/about': 'About',
        '/selling': 'Selling',
        '/buying': 'Checkout out the Buying Process',
        '/vendors': 'Checkout our Vendors',
        '/inventory': 'Checkout our current inventory',
        '/testimonials': 'Checkout Testimonials from our valued clients',
      }

      const linkText = pathMap[localPath] ?? 'Learn More'

      urlLink = (
        <Link href={localPath} className="pg-newsletter-url-link">
          {linkText}
        </Link>
      )
    } else if (linkType === 'brochure') {
      // Check if it's a Jameson property brochure
      const isBrochure = linkUrl.includes('jamesonps.com')
      let linkText = isBrochure ? 'Check out the property brochure' : linkUrl
      linkText = (linkUrl.length > 50) ? 'Learn More' : linkText

      urlLink = (
        <a
          href={addUtmParams(linkUrl, { campaign: 'newsletter' })}
          target="_blank"
          rel="noreferrer"
          className="pg-newsletter-url-link"
        >
          {linkText}
        </a>
      )
    } else if (linkType === 'contact') {
      urlLink = (
        <ContactLink message={linkUrl.replace('#contact:', '')} className="pg-newsletter-url-link">
          Contact Us
        </ContactLink>
      )
    } else {
      const linkText = (linkUrl.length > 50) ? 'Learn More' : linkUrl
      urlLink = (
        <Link href={linkUrl} className="pg-newsletter-url-link">
          {linkText}
        </Link>
      )
    }
  }

  return (
    <div className="pg-newsletter-section-links">
      {urlLink}
      {formattedEmailLink}
      {formattedInstagramLink}
      {formattedFacebookLink}
    </div>
  )
}
