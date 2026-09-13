import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Flex, Text, Box } from '@sanity/ui'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { OrderableDocument } from './types'

interface SortableItemProps {
  id: string
  document: OrderableDocument
  index: number
  orderField: string
  displayFields?: string[]
  imageField?: string
}

export function SortableItem({ id, document, index, orderField, displayFields, imageField }: SortableItemProps) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const builder = createImageUrlBuilder(client)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  // Build display text from specified fields
  const displayText = displayFields && displayFields.length > 0
    ? displayFields.map(field => document[field]).filter(Boolean).join(' • ')
    : (document.title || document._id)

  // Get image URL if imageField is specified
  const imageUrl = imageField && document[imageField]?.asset
    ? builder.image(document[imageField]).width(60).height(60).fit('crop').url()
    : null

  return (
    <IntentLink
      intent="edit"
      params={{ id: document._id, type: document._type }}
      style={{ textDecoration: 'none' }}
    >
      <Card
        ref={setNodeRef}
        style={{
          ...style,
          cursor: isDragging ? 'grab' : 'pointer',
        }}
        padding={3}
        radius={2}
        shadow={1}
        marginBottom={2}
        tone="default"
        {...attributes}
      >
        <Flex align="center" gap={3}>
          {/* Order number */}
          <Text size={1} muted style={{ minWidth: '30px' }}>
            #{document[orderField] ?? index + 1}
          </Text>

          {/* Image thumbnail (if specified) */}
          {imageUrl && (
            <Box style={{ flexShrink: 0 }}>
              <img
                src={imageUrl}
                alt=""
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
            </Box>
          )}

          {/* Document info - shows fields joined with bullets */}
          <div style={{ flex: 1 }}>
            <Text weight="semibold">
              {displayText}
            </Text>
          </div>

          {/* Drag handle */}
          <div {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            <Text size={1} muted>⋮⋮</Text>
          </div>
        </Flex>
      </Card>
    </IntentLink>
  )
}
