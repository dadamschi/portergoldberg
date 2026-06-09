'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { NavItem } from '@/types'

type NavProps = {
  items: NavItem[]
  logoSrc?: string
}

// Helper to detect external links
const isExternal = (href: string) => href.startsWith('http')

// NavLink component that handles internal vs external links
function NavLink({ href, className, children, onClick }: {
  href: string
  className: string
  children: React.ReactNode
  onClick?: () => void
}) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

export function Nav({ items, logoSrc = '/PorterGoldberg-Residential.webp' }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([])

  return (
    <>
      <nav className="pg-nav">
        <Link href="/" className="pg-logo">
          <Image
            src={logoSrc}
            alt="PorterGoldberg Residential"
            width={340}
            height={48}
            className="pg-logo-img"
            priority
            quality={95}
          />
        </Link>

        <ul className="pg-nav-links">
          {items.map((item) => (
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
                    <NavLink key={child.label} href={child.href ?? '#'} className="pg-dropdown-link">
                      {child.label}
                    </NavLink>
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
          {items.map((item) => {
            const isExpanded = expandedMobileItems.includes(item.label)

            if (item.children) {
              return (
                <div key={item.label} className="pg-mobile-item">
                  <button
                    className="pg-mobile-link pg-mobile-expandable"
                    onClick={() => {
                      setExpandedMobileItems((prev) =>
                        isExpanded
                          ? prev.filter((i) => i !== item.label)
                          : [...prev, item.label]
                      )
                    }}
                    aria-expanded={isExpanded}
                  >
                    {item.label}
                    <span className={`pg-mobile-arrow ${isExpanded ? 'pg-mobile-arrow-expanded' : ''}`}>▾</span>
                  </button>
                  {isExpanded && (
                    <div className="pg-mobile-subnav">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.label}
                          href={child.href ?? '#'}
                          className="pg-mobile-sublink"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href ?? '#'}
                className="pg-mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
