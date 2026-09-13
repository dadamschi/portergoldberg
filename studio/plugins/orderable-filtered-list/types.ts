export interface OrderableDocument {
  _id: string
  _rev: string
  [key: string]: any
}

export interface OrderableFilteredListConfig {
  type: string
  title: string
  filter: string
  orderField: string
  icon?: () => string
  S: any
  context: any
  displayFields?: string[]  // Array of field names to display
  imageField?: string        // Field name for image (e.g., 'image')
}

export interface OrderableListProps {
  type: string
  filter: string
  orderField: string
  title: string
  displayFields?: string[]
  imageField?: string
}
