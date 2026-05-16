'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type ImageLightboxProps = {
  src: string
  alt: string
  children: React.ReactNode
}

export function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, close])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="pg-lightbox-trigger"
        aria-label={`View ${alt}`}
      >
        {children}
      </button>

      {isOpen && (
        <div className="pg-lightbox-overlay" onClick={close}>
          <div className="pg-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="pg-lightbox-close"
              onClick={close}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              className="pg-lightbox-image"
              width={1200}
              height={800}
            />
          </div>
        </div>
      )}
    </>
  )
}
