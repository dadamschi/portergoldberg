'use client'

import { useState } from 'react'
import Image from 'next/image'
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
        <a href="/" className="pg-logo">
          <Image
            src={logoSrc}
            alt="PorterGoldberg Residential"
            width={200}
            height={32}
            style={{ width: 'auto', height: '28px' }}
            priority
          />
        </a>

        <ul className="pg-nav-links">
          {items.slice(0, 6).map((item) => (
            <li
              key={item.label}
              className="pg-nav-item"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <a href={item.href ?? '#'} className="pg-nav-link">
                {item.label}
                {item.children && <span className="pg-nav-arrow">▾</span>}
              </a>

              {item.children && hoveredItem === item.label && (
                <div className="pg-dropdown">
                  {item.children.map((child) => (
                    <a key={child.label} href={child.href} className="pg-dropdown-link">
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="pg-nav-right">
          <a href="/contact" className="pg-nav-cta">
            Let's Connect
          </a>
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
            <a
              key={item.label}
              href={item.href ?? '#'}
              className="pg-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/contact"
            className="pg-mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Let's Connect
          </a>
        </div>
      )}
    </>
  )
}
