import type { PortableTextBlock } from '@portabletext/types'
import { nanoid } from 'nanoid'

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

// Convert plain text to Portable Text blocks
export function textToPortableText(text: string) {
  // Split by double newlines to create separate paragraphs
  const paragraphs = text.split(/\n\n+/).filter(Boolean)

  return paragraphs.map((paragraph) => ({
    _type: 'block',
    _key: nanoid(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: nanoid(),
        text: paragraph,
        marks: [],
      },
    ],
  }))
}

export function textToMoney(text = '00000', locale = 'en-US', currency = 'USD') {
  // Check if there's a plus sign at the end
  if(!text) return null
  const hasPlus = text.trim().endsWith('+');

  // Remove everything except numbers
  const cleanedText = text.replace(/[^\d]/g, '');
  const amount = parseInt(cleanedText);

  if (isNaN(amount)) {
    return null; // Handle invalid inputs
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).toString();

  return hasPlus ? `${formatted}+` : formatted;
}
