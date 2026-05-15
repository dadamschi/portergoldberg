import { NAV_ITEMS } from '@/lib/data'
import Link from 'next/link'

const SELLING_SECTIONS = NAV_ITEMS.filter(item => item.label.toLowerCase() === 'selling')[0].children?.filter(
  (item): item is typeof item & { href: string } => typeof item.href === 'string'
);

type SellingSectionNavProps = {
  currentSection: 'our process' | 'property preparation' | 'staging services'
}

export function SellingSectionNav({ currentSection }: SellingSectionNavProps) {
  return (
    <nav className="pg-selling-section-nav">
      <div className="pg-selling-section-nav-inner">
        {SELLING_SECTIONS?.map((section) => {
          const isActive = section.label?.toLowerCase().includes(currentSection)
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`pg-selling-section-nav-link ${isActive ? 'is-active' : ''}`}
            >
              {section.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
