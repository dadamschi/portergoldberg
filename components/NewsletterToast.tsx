'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type NewsletterToastProps = {
  newsletter: {
    _id: string
    title: string
    slug: { current: string }
    publishedAt: string
  }
}

export function NewsletterToast({ newsletter }: NewsletterToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const storageKey = `newsletter-toast-dismissed-${newsletter._id}`

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey)
    if (!dismissed) {
      // Small delay before showing for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [storageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(storageKey, 'true')
  }

  if (!isVisible) return null

  return (
    <div className="pg-toast">
      <div className="pg-toast-content">
        <span className="pg-toast-label">New Newsletter</span>
        <p className="pg-toast-title">{newsletter.title}</p>
        <Link href="/newsletters" className="pg-toast-link" onClick={handleDismiss}>
          View Newsletter Archive
        </Link>
      </div>
      <button
        type="button"
        className="pg-toast-close"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
