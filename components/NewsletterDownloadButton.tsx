'use client'

import { useState } from 'react'
import { generateNewsletterEmailHtml, type NewsletterSection, type NewsletterType, type NewsletterLayout } from '@/lib/newsletter-email-template'

interface NewsletterDownloadButtonProps {
  sections: NewsletterSection[]
  slug: string
  filename?: string
  type?: NewsletterType
}

export function NewsletterDownloadButton({ sections, slug, filename = 'newsletter.html', type = 'weekly' }: NewsletterDownloadButtonProps) {
  const [copiedLayout, setCopiedLayout] = useState<NewsletterLayout | null>(null)

  const handleDownload = async (layout: NewsletterLayout) => {
    const html = generateNewsletterEmailHtml(sections, slug, type, undefined, layout)

    // Copy to clipboard
    await navigator.clipboard.writeText(html)
    setCopiedLayout(layout)
    setTimeout(() => setCopiedLayout(null), 3000)

    // Also download the file
    const layoutSuffix = layout === 'stacked' ? '-stacked' : ''
    const downloadFilename = filename.replace('.html', `${layoutSuffix}.html`)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => handleDownload('default')}
        className="pg-newsletter-download-btn"
      >
        {copiedLayout === 'default' ? 'Copied!' : 'Default HTML'}
      </button>
      <button
        onClick={() => handleDownload('stacked')}
        className="pg-newsletter-download-btn"
      >
        {copiedLayout === 'stacked' ? 'Copied!' : 'Stacked HTML'}
      </button>
    </div>
  )
}
