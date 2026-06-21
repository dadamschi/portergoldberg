import type { Metadata } from 'next'

  type PageMeta = {
    title: string
    description: string
    path?: string
    openGraph?: Metadata['openGraph']
  }

  export function createMetadata({ title, description, path, openGraph }: PageMeta): Metadata {
    return {
      title: `${title} | PorterGoldberg`,
      description,
      openGraph,
      alternates: {
        canonical: path ? `https://portergoldberg.com${path}` : undefined,
      },
    }
  }