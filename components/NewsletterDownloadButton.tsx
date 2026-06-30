'use client'

import { useState } from 'react'
import { generateNewsletterEmailHtml, type NewsletterSection } from '@/lib/newsletter-email-template'

interface NewsletterDownloadButtonProps {
  sections: NewsletterSection[]
  slug: string
  filename?: string
}

export function NewsletterDownloadButton({ sections, slug, filename = 'newsletter.html' }: NewsletterDownloadButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    const html = generateNewsletterEmailHtml(sections, slug)

    // Copy to clipboard
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)

    // Also download the file
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="pg-newsletter-download-btn"
    >
      {copied ? 'Copied to Clipboard!' : 'Copy & Download HTML'}
    </button>
  )
}
