import type { Metadata } from 'next'

  type PageMeta = {
    title: string
    description: string
    path?: string
  }

  export function createMetadata({ title, description, path }: PageMeta): Metadata {
    return {
      title: `${title} | PorterGoldberg`,
      description,
      openGraph: {
        title,
        description,
        url: path ? `https://portergoldberg.com${path}` : undefined,
      },
    }
  }