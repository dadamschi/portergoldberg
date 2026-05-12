'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

type BeforeAfterItem = {
  name?: string
  beforeImage: {
    asset: { url: string }
    alt?: string
  }
  afterImage: {
    asset: { url: string }
    alt?: string
  }
}

type BeforeAfterModalProps = {
  items: BeforeAfterItem[]
}

function Modal({ item, onClose }: { item: BeforeAfterItem; onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="pg-ba-modal-overlay" onClick={onClose}>
      <div className="pg-ba-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pg-ba-modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {item.name && <h3 className="pg-ba-modal-title">{item.name}</h3>}
        <div className="pg-ba-modal-images">
          <div className="pg-ba-modal-image">
            <span className="pg-ba-modal-label">Before</span>
            <Image
              src={item.beforeImage.asset.url}
              alt={item.beforeImage.alt || `${item.name} before`}
              width={600}
              height={400}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          </div>
          <div className="pg-ba-modal-image">
            <span className="pg-ba-modal-label">After</span>
            <Image
              src={item.afterImage.asset.url}
              alt={item.afterImage.alt || `${item.name} after`}
              width={600}
              height={400}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function BeforeAfterGallery({ items }: BeforeAfterModalProps) {
  const [selectedItem, setSelectedItem] = useState<BeforeAfterItem | null>(null)

  const closeModal = () => setSelectedItem(null)

  return (
    <>
      <div className="pg-selling-before-after">
        {items.map((item, index) => (
          <div
            key={index}
            className="pg-selling-before-after-item"
            onClick={() => setSelectedItem(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedItem(item)}
          >
            {item.name && <h4>{item.name}</h4>}
            <div className="pg-selling-before-after-images">
              <div className="pg-selling-before">
                <span className="pg-selling-label">Before</span>
                <Image
                  src={item.beforeImage.asset.url}
                  alt={item.beforeImage.alt || `${item.name} before`}
                  width={400}
                  height={215}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="pg-selling-after">
                <span className="pg-selling-label">After</span>
                <Image
                  src={item.afterImage.asset.url}
                  alt={item.afterImage.alt || `${item.name} after`}
                  width={400}
                  height={215}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && <Modal item={selectedItem} onClose={closeModal} />}
    </>
  )
}
