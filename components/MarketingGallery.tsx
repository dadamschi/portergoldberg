import Image from 'next/image'
import { getLinkProps } from '@/lib/utils/links'

const GALLERY_ITEMS = [
  { src: '/example.brochures.png', title: 'Brochures', href: 'https://presentation.jamesonps.com/brochure-page' },
  { src: '/example.e-blasts.png', title: 'E-Blasts', href: 'https://presentation.jamesonps.com/eblast-off-market' },
  { src: '/example.socials.png', title: 'Social Media', href: 'https://presentation.jamesonps.com/social-media' },
]

export function MarketingGallery() {
  return (
    <div className="pg-marketing-gallery">
      <h3 className="pg-marketing-gallery-tagline">Preview a selection of our marketing materials below:</h3>
      {GALLERY_ITEMS.map((item) => (
        <a key={item.src} {...getLinkProps(item.href, 'marketing')} className="pg-marketing-gallery-item">
          <span className="pg-marketing-gallery-title">{item.title}</span>
          <Image src={item.src} alt={item.title} width={232} height={300} />
        </a>
      ))}
    </div>
  )
}
