import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Default from address - update this to your verified domain
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// All notification emails go to these addresses
const isProduction = process.env.VERCEL_ENV === 'production'
export const NOTIFY_EMAILS = isProduction
  ? ['info@portergoldberg.com', 'dadams.chi+portergoldbergcc@gmail.com', 'contact@artplexity.com']
  : ['dadams.chi+portergoldbergcc@gmail.com']
