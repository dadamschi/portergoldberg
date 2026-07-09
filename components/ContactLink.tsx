'use client'

import { openContactForm } from '@/lib/utils/contact'

type ContactLinkProps = {
  message?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function ContactLink({ message, className, style, children }: ContactLinkProps) {
  return (
    <a
      type="button"
      onClick={() => openContactForm(message)}
      className={`pg-contact-link ${className || ''}`}
      style={style}
    >
      {children}
    </a>
  )
}
