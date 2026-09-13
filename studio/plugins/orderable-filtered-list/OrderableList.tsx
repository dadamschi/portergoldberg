import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { Card, Flex, Spinner, Text, Button } from '@sanity/ui'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'
import { useReorder } from './useReorder'
import type { OrderableDocument } from './types'

export function OrderableList(props: any) {
  // Try multiple ways to access the options
  const options = props.document?.options || props.options || props
  const { filter, orderField, title, displayFields, imageField } = options

  const client = useClient({ apiVersion: '2024-01-01' })
  const [documents, setDocuments] = useState<OrderableDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { reorder, reordering } = useReorder({ client, orderField })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments()
  }, [filter, orderField])

  async function fetchDocuments() {
    try {
      setLoading(true)
      setError(null)

      // Query ONLY published documents (exclude drafts)
      // This ensures we're only reordering live, published content
      const query = `*[${filter} && !(_id in path("drafts.**"))] | order(${orderField} asc)`

      const docs = await client.fetch<OrderableDocument[]>(query)
      setDocuments(docs)
    } catch (err) {
      console.error('❌ Failed to fetch documents:', err)
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  // Handle drag end
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = documents.findIndex(doc => doc._id === active.id)
    const newIndex = documents.findIndex(doc => doc._id === over.id)

    // Optimistically update UI immediately
    const reorderedDocs = arrayMove(documents, oldIndex, newIndex)
    setDocuments(reorderedDocs)

    // Persist changes to Sanity
    try {
      await reorder(reorderedDocs)
      // Refetch to confirm the order was saved correctly
      await fetchDocuments()
    } catch (err) {
      // Revert on error
      setDocuments(documents)
      console.error('Failed to save order:', err)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card padding={4}>
        <Flex align="center" justify="center" padding={5}>
          <Spinner />
        </Flex>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card padding={4} tone="critical">
        <Text>Error: {error}</Text>
        <Button text="Retry" onClick={fetchDocuments} style={{ marginTop: 16 }} />
      </Card>
    )
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <Card padding={4}>
        <Text muted>No documents match the filter: {filter}</Text>
      </Card>
    )
  }

  // Main render
  return (
    <Card padding={4}>
      <Flex justify="space-between" align="center" marginBottom={4}>
        <div>
          <Text size={2} weight="semibold">{title}</Text>
          <Text size={1} muted style={{ marginTop: 4 }}>
            Drag to reorder • {documents.length} items
          </Text>
        </div>
        <Button
          text="Refresh"
          mode="ghost"
          onClick={fetchDocuments}
          disabled={reordering}
        />
      </Flex>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={documents.map(d => d._id)}
          strategy={verticalListSortingStrategy}
        >
          {documents.map((doc, index) => (
              <SortableItem
                key={doc._id}
                id={doc._id}
                document={doc}
                index={index}
                orderField={orderField}
                displayFields={displayFields}
                imageField={imageField}
              />
          ))}
        </SortableContext>
      </DndContext>

      {reordering && (
        <Card padding={2} marginTop={3} tone="primary">
          <Text size={1}>Saving order...</Text>
        </Card>
      )}
    </Card>
  )
}
