'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type ImageLightboxProps = {
  src: string
  alt: string
  children: React.ReactNode
}

const ZOOM_LEVEL = 4
const LENS_SIZE = 220

export function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setIsZooming(false)
  }, [])

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Clamp lens position to stay within image bounds
    const halfLens = LENS_SIZE / 2
    const clampedX = Math.max(0, Math.min(rect.width - LENS_SIZE, x - halfLens))
    const clampedY = Math.max(0, Math.min(rect.height - LENS_SIZE, y - halfLens))

    setLensPosition({ x: clampedX, y: clampedY })

    // Background position for zoom effect
    const bgX = (x / rect.width) * 100
    const bgY = (y / rect.height) * 100
    setBgPosition({ x: bgX, y: bgY })
  }, [])

  const handleMouseEnter = useCallback(() => setIsZooming(true), [])
  const handleMouseLeave = useCallback(() => setIsZooming(false), [])

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

            <div className="pg-lightbox-image-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="pg-lightbox-image"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />

              {/* Magnifying lens overlay */}
              {isZooming && (
                <div
                  className="pg-lightbox-magnifier"
                  style={{
                    left: lensPosition.x,
                    top: lensPosition.y,
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    backgroundImage: `url(${src})`,
                    backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
                    backgroundSize: `${ZOOM_LEVEL * 100}%`,
                  }}
                />
              )}
            </div>

            <p className="pg-lightbox-zoom-tip">Hover to magnify</p>
          </div>
        </div>
      )}
    </>
  )
}
