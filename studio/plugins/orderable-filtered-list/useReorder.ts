import { useState } from 'react'
import type { SanityClient } from 'sanity'
import type { OrderableDocument } from './types'

interface UseReorderProps {
  client: SanityClient
  orderField: string
}

export function useReorder({ client, orderField }: UseReorderProps) {
  const [reordering, setReordering] = useState(false)

  async function reorder(documents: OrderableDocument[]) {
    setReordering(true)

    try {
      // First, update all published documents
      const publishedMutations = documents.map((doc, index) => ({
        patch: {
          id: doc._id,
          set: { [orderField]: index + 1 }
        }
      }))

      await client.mutate(publishedMutations)

      // Then, try to update drafts individually (ignore errors if draft doesn't exist)
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]
        const orderValue = i + 1
        const draftId = `drafts.${doc._id}`

        try {
          await client.patch(draftId).set({ [orderField]: orderValue }).commit()
        } catch (err) {
          // Draft doesn't exist - that's fine, ignore the error
        }
      }
    } catch (error) {
      console.error('Failed to reorder documents:', error)
      throw error
    } finally {
      setReordering(false)
    }
  }

  return { reorder, reordering }
}
