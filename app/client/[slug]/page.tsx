import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { ClientPage } from '@/types'
import { client } from '@/lib/client'
import { CLIENT_PAGE_BY_SLUG_QUERY } from '@/lib/queries'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const revalidate = 3600 // 1 hour

type Props = {
  params: Promise<{ slug: string }>
}

const getClientPage = cache(async (slug: string): Promise<ClientPage | null> => {
  return client.fetch<ClientPage | null>(CLIENT_PAGE_BY_SLUG_QUERY, { slug })
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getClientPage(slug)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const title = page.pageTitle || page.title

  return {
    title,
    robots: page.noIndex ? 'noindex, nofollow' : undefined,
  }
}

export default async function ClientPageRoute({ params }: Props) {
  const { slug } = await params
  const page = await getClientPage(slug)

  if (!page) {
    notFound()
  }

  const title = page.pageTitle || page.title

  return (
    <main className="pg-page">
      <section className="pg-client-page-section">
        <div className="pg-client-page-container">
          {title && <h1 className="pg-client-page-title">{title}</h1>}

          {page.markdownContent && (
            <div className="pg-client-page-content pg-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {page.markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
