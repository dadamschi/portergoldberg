import { NAV_ITEMS } from '@/lib/data'
import Link from 'next/link'

const SELLING_SECTIONS = NAV_ITEMS.filter(item => item.label.toLowerCase() === 'selling')[0].children?.filter(
  (item): item is typeof item & { href: string } => typeof item.href === 'string'
);

type SellingSectionNavProps = {
  currentSection: 'our process' | 'property preparation' | 'staging services'
}

export function SellingSectionNav({ currentSection }: SellingSectionNavProps) {
  console.log(currentSection)
  console.log(SELLING_SECTIONS)
  const navItemsCount = SELLING_SECTIONS?.length || 0
  const currentIndex = SELLING_SECTIONS?.findIndex(s => s.label?.toLowerCase().includes(currentSection)) || 0
  const prevSection = currentIndex > 0 ? SELLING_SECTIONS?.[currentIndex - 1] : null
  const nextSection = currentIndex < navItemsCount - 1 ? SELLING_SECTIONS?.[currentIndex + 1] : null

  return (
    <nav className="pg-selling-section-nav">
      <div className="pg-selling-section-nav-inner">
        {prevSection ? (
          <Link href={prevSection.href} className="pg-selling-section-nav-link pg-selling-section-nav-prev">
            <span className="pg-selling-section-nav-arrow">&larr;</span>
            <span className="pg-selling-section-nav-text">
              <span className="pg-selling-section-nav-label">Previous</span>
              <span className="pg-selling-section-nav-title">{prevSection.label}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextSection ? (
          <Link href={nextSection.href} className="pg-selling-section-nav-link pg-selling-section-nav-next">
            <span className="pg-selling-section-nav-text">
              <span className="pg-selling-section-nav-label">Next</span>
              <span className="pg-selling-section-nav-title">{nextSection.label}</span>
            </span>
            <span className="pg-selling-section-nav-arrow">&rarr;</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
