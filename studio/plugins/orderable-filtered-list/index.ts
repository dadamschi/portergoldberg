import type { OrderableFilteredListConfig } from './types'
import { OrderableList } from './OrderableList'

/**
 * Helper function to create an orderable filtered list item for Sanity desk structure
 *
 * @example
 * ```javascript
 * orderableFilteredListItem({
 *   type: 'product',
 *   title: 'Featured Products',
 *   filter: '_type == "product" && featured == true',
 *   orderField: 'featuredOrder',
 *   icon: () => "⭐",
 *   S,
 *   context,
 * })
 * ```
 */
export function orderableFilteredListItem(config: OrderableFilteredListConfig) {
  const { type, title, filter, orderField, icon, displayFields, imageField, S } = config

  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.component()
        .title(title)
        .component(OrderableList)
        .options({
          type,
          filter,
          orderField,
          title,
          displayFields,
          imageField,
        })
    )
}

// Export types for TypeScript users
export type { OrderableFilteredListConfig, OrderableListProps, OrderableDocument } from './types'
