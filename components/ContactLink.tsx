'use client'

import { openContactForm } from '@/lib/utils/contact'

type ContactLinkProps = {
  message?: string
  className?: string
  children: React.ReactNode
}

export function ContactLink({ message, className, children }: ContactLinkProps) {
  return (
    <button
      type="button"
      onClick={() => openContactForm(message)}
      className={`pg-contact-link ${className || ''}`}
    >
      {children}
    </button>
  )
}
