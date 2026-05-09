import type { Metadata } from 'next'
import { ContactForm } from '@/components'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Porter Goldberg Residential — Chicago real estate experts.',
}

export default function ContactPage() {
  return <ContactForm />
}
