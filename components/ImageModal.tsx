'use client'

import { useState } from 'react'
import type { SanityImage } from '@/types'

type ImageModalProps = {
  image: SanityImage
  alt?: string
}

export function ImageModal({ image, alt = 'Event image' }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const src = image.asset.url

  return (
    <>
      <button
        type="button"
        className="pg-image-modal-trigger"
        onClick={() => setIsOpen(true)}
        aria-label={`View ${alt} full size`}
      >
        <img src={src} alt={alt} className="pg-image-modal-thumbnail" />
      </button>

      {isOpen && (
        <div
          className="pg-image-modal-overlay"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            className="pg-image-modal-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
          >
            &times;
          </button>
          <img
            src={src}
            alt={alt}
            className="pg-image-modal-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
