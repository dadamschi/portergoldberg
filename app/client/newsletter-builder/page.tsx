'use client'

import { useState, useEffect } from 'react'
import {
  generateNewsletterEmailHtml,
  type NewsletterSection,
} from '@/lib/newsletter-email-template'

const BLANK_SECTION: NewsletterSection = {
  heading: '',
  imageUrl: '',
  imageAlt: '',
  body: '',
  caption: '',
  linkUrl: undefined,
  instagram: '',
}

interface SanityNewsletter {
  _id: string
  title: string
  publishedAt: string | null
}

interface SanityNewsletterFull {
  _id: string
  title: string
  imageSections: Array<{
    _key: string
    heading: string | null
    image: { asset: { url: string } } | null
    alt: string | null
    body: string | null
    moreInfo: string | null
    linkUrl: {
      url?: string
      customText?: string
    } | null
    instagram: string | null
  }> | null
}

export default function NewsletterBuilderPage() {
  const [newsletters, setNewsletters] = useState<SanityNewsletter[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<NewsletterSection[]>([
    { ...BLANK_SECTION },
  ])
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // Fetch newsletter list on mount
  useEffect(() => {
    fetch('/api/newsletters/list')
      .then((res) => res.json())
      .then((data) => setNewsletters(data))
      .catch(console.error)
  }, [])

  // Load selected newsletter
  const loadNewsletter = async (id: string) => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/newsletters/${id}`)
      const data: SanityNewsletterFull = await res.json()

      if (data.imageSections && data.imageSections.length > 0) {
        const loadedSections: NewsletterSection[] = data.imageSections.map(
          (s) => ({
            heading: s.heading ?? '',
            imageUrl: s.image?.asset?.url ?? '',
            imageAlt: s.alt ?? '',
            body: s.body ?? '',
            caption: s.moreInfo ?? '',
            linkUrl: s.linkUrl ?? undefined,
            instagram: s.instagram ?? '',
          })
        )
        setSections(loadedSections)
      } else {
        setSections([{ ...BLANK_SECTION }])
      }
    } catch (err) {
      console.error('Failed to load newsletter:', err)
    } finally {
      setLoading(false)
    }
  }

  const addSection = () => {
    setSections([...sections, { ...BLANK_SECTION }])
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const updateSection = <K extends keyof NewsletterSection>(
    index: number,
    field: K,
    value: NewsletterSection[K]
  ) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], [field]: value }
    setSections(updated)
  }

  const generateHtml = () => {
    const html = generateNewsletterEmailHtml(sections)
    setGeneratedHtml(html)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedHtml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Newsletter Builder
        </h1>
        <p className="mb-8 text-gray-600">
          Load from Sanity or build manually, then copy HTML into HubSpot.
        </p>

        {/* Load from Sanity */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Load from Sanity
          </h2>
          <div className="flex gap-4">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a newsletter...</option>
              {newsletters.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.title}
                  {n.publishedAt && ` (${new Date(n.publishedAt).toLocaleDateString()})`}
                </option>
              ))}
            </select>
            <button
              onClick={() => loadNewsletter(selectedId)}
              disabled={!selectedId || loading}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>

        {/* Sections Form */}
        <div className="mb-8 space-y-6">
          {sections.map((section, index) => {
            // Extract linkUrl values with type guards for backwards compatibility
            const linkUrl = section.linkUrl
            const currentLinkUrl = typeof linkUrl === 'string' ? linkUrl : linkUrl?.url || ''
            const currentCustomText = typeof linkUrl === 'string' ? '' : linkUrl?.customText || ''

            return (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Section {index + 1}
                </h2>
                {sections.length > 1 && (
                  <button
                    onClick={() => removeSection(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Heading */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) =>
                      updateSection(index, 'heading', e.target.value)
                    }
                    placeholder="e.g. FEATURED PROFESSIONAL"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={section.imageUrl}
                    onChange={(e) =>
                      updateSection(index, 'imageUrl', e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Image Alt */}
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={section.imageAlt}
                    onChange={(e) =>
                      updateSection(index, 'imageAlt', e.target.value)
                    }
                    placeholder="Description for accessibility"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Body */}
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Body Text
                  </label>
                  <textarea
                    value={section.body}
                    onChange={(e) =>
                      updateSection(index, 'body', e.target.value)
                    }
                    placeholder="Main paragraph text. Use double line breaks for multiple paragraphs."
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Caption */}
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Caption (optional)
                  </label>
                  <textarea
                    value={section.caption}
                    onChange={(e) =>
                      updateSection(index, 'caption', e.target.value)
                    }
                    placeholder="Additional info text (e.g. More Info: ...)"
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Link URL (optional)
                  </label>
                  <input
                    type="text"
                    value={currentLinkUrl}
                    onChange={(e) =>
                      updateSection(index, 'linkUrl', {
                        url: e.target.value,
                        customText: currentCustomText
                      })
                    }
                    placeholder="https://..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Link Custom Text */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Link Custom Text (optional)
                  </label>
                  <input
                    type="text"
                    value={currentCustomText}
                    onChange={(e) =>
                      updateSection(index, 'linkUrl', {
                        url: currentLinkUrl,
                        customText: e.target.value
                      })
                    }
                    placeholder="e.g. Learn More, View Details"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Instagram (optional)
                  </label>
                  <input
                    type="text"
                    value={section.instagram}
                    onChange={(e) =>
                      updateSection(index, 'instagram', e.target.value)
                    }
                    placeholder="@handle"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {/* Add Section Button */}
        <button
          onClick={addSection}
          className="mb-8 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          + Add Section
        </button>

        {/* Generate Button */}
        <div className="mb-8">
          <button
            onClick={generateHtml}
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Generate HTML
          </button>
        </div>

        {/* Generated HTML Output */}
        {generatedHtml && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Generated HTML
              </h2>
              <button
                onClick={copyToClipboard}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <pre className="max-h-96 overflow-auto rounded-md bg-gray-900 p-4 text-xs text-gray-100">
              {generatedHtml}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
