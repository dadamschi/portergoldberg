import type { Metadata } from 'next'
import { ContactForm } from '@/components'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with PorterGoldberg Residential — Chicago real estate experts. Contact Samantha Porter at 312-944-8900 or Lauren Goldberg at 773-576-0053.',
}

export default function ContactPage() {
  return <ContactForm />
}
