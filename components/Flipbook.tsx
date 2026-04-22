'use client'

import { useRef, useState, useCallback, forwardRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import type { FlipbookImage } from '@/types'
import Image from 'next/image'

type FlipbookProps = {
  images: FlipbookImage[]
}

type PageProps = {
  image: FlipbookImage
  pageNumber: number
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ image, pageNumber }, ref) => {
  return (
    <div ref={ref} className="pg-flipbook-page" style={{ position: 'relative' }}>
      <Image
        src={image.asset.url}
        alt={image.alt}
        className="pg-flipbook-image"
        fill
        sizes="(max-width: 768px) 100vw, 550px"
      />
      <div className="pg-flipbook-page-number">{pageNumber}</div>
    </div>
  )
})

Page.displayName = 'Page'

export function Flipbook({ images }: FlipbookProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = images.length

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data)
  }, [])

  const goToPage = useCallback((pageIndex: number) => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flip(pageIndex)
    }
  }, [])

  const goToPrev = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev()
    }
  }, [])

  const goToNext = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext()
    }
  }, [])

  if (images.length === 0) {
    return <div className="pg-flipbook-empty">No images available</div>
  }

  return (
    <div className="pg-flipbook-container">
      {/* Thumbnail Sidebar */}
      <div className="pg-flipbook-sidebar">
        {images.map((image, index) => (
          <button
            key={image.asset._id}
            className={`pg-flipbook-thumbnail ${currentPage === index ? 'pg-flipbook-thumbnail--active' : ''}`}
            onClick={() => goToPage(index)}
            aria-label={`Go to page ${index + 1}`}
          >
            <Image src={image.asset.url} alt={image.alt} width={100} height={133} />
            <span className="pg-flipbook-thumbnail-number">{image.alt}</span>
            {/* <span className="pg-flipbook-thumbnail-overlay">{image.alt}</span> */}
          </button>
        ))}
      </div>

      {/* Main Flipbook Area */}
      <div className="pg-flipbook-main">
        <div className="pg-flipbook-wrapper">
          <HTMLFlipBook
            ref={flipBookRef}
            width={550}
            height={733}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="pg-flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {images.map((image, index) => (
              <Page key={image.asset._id} image={image} pageNumber={index + 1} />
            ))}
          </HTMLFlipBook>
        </div>

        <div className="pg-flipbook-controls">
          <button
            className="pg-flipbook-btn"
            onClick={goToPrev}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <span className="pg-flipbook-pagination">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            className="pg-flipbook-btn"
            onClick={goToNext}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
