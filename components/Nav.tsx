'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { NavItem } from '@/types'

type NavProps = {
  items: NavItem[]
  logoSrc?: string
}

export function Nav({ items, logoSrc = '/PorterGoldberg-Residential.webp' }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <>
      <nav className="pg-nav">
        <Link href="/" className="pg-logo">
          <Image
            src={logoSrc}
            alt="PorterGoldberg Residential"
            width={340}
            height={48}
            style={{ width: 'auto', height: '48px' }}
            priority
          />
        </Link>

        <ul className="pg-nav-links">
          {items.slice(0, 6).map((item) => (
            <li
              key={item.label}
              className="pg-nav-item"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href={item.href ?? '#'} className="pg-nav-link">
                {item.label}
                {item.children && <span className="pg-nav-arrow">▾</span>}
              </Link>

              {item.children && hoveredItem === item.label && (
                <div className="pg-dropdown">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href ?? '#'} className="pg-dropdown-link">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="pg-nav-right">
          <button
            className="pg-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="pg-mobile-menu" role="navigation" aria-label="Mobile navigation">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? '#'}
              className="pg-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
