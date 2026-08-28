import { ContactForm } from '@/components'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with PorterGoldberg Residential — Chicago real estate experts. Contact Samantha Porter at 312-944-8900 or Lauren Goldberg at 773-576-0053.',
  path: '/contact',
})

export default function ContactPage() {
  return <ContactForm />
}
