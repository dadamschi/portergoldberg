import type { Metadata } from 'next'
import { ContactForm } from '@/components'
import { FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with PorterGoldberg Residential — Chicago real estate experts. Contact Samantha Porter at 312-944-8900 or Lauren Goldberg at 773-576-0053.',
}

const CONTACT_FAQS = [
  {
    question: 'How can I contact PorterGoldberg Residential?',
    answer: 'You can reach Samantha Porter at 312-944-8900 or samantha@portergoldberg.com, and Lauren Goldberg at 773-576-0053 or lauren@portergoldberg.com. Our office is located at 425 W. North Avenue, Chicago, IL 60610.',
  },
  {
    question: 'What are PorterGoldberg\'s office hours?',
    answer: 'PorterGoldberg Residential is available 7 days a week from 9:00 AM to 6:00 PM. For urgent matters, you can reach the team directly via phone or email.',
  },
  {
    question: 'Where is PorterGoldberg\'s office located?',
    answer: 'PorterGoldberg Residential is located at Jameson Sotheby\'s International Realty, 425 W. North Avenue, Chicago, IL 60610.',
  },
]

export default function ContactPage() {
  return (
    <>
      <FAQJsonLd faqs={CONTACT_FAQS} />
      <ContactForm />
    </>
  )
}
