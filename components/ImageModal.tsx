'use client'

import { useState } from 'react'
import type { SanityImage } from '@/types'
import Image from 'next/image'

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
        style={{ position: 'relative', aspectRatio: '4/3' }}
      >
        <Image src={src} alt={alt} className="pg-image-modal-thumbnail" fill sizes="300px" />
      </button>

      {isOpen && (
        <div
          className="pg-image-modal-overlay"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          style={{ position: 'relative' }}
        >
          <button
            type="button"
            className="pg-image-modal-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
          >
            &times;
          </button>
          <Image
            src={src}
            alt={alt}
            className="pg-image-modal-image"
            onClick={(e) => e.stopPropagation()}
            fill
            sizes="100vw"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
    </>
  )
}
