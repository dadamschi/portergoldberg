import type { PortableTextBlock } from '@portabletext/types'

export function toPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      return (block.children as Array<{ text?: string }>)
        .map((child) => child.text || '')
        .join('')
    })
    .join(' ')
}
