import { Resend } from 'resend'

// Resend is optional - will be null if API key is not configured
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Default from address - update this to your verified domain
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// All notification emails go to these addresses
const isProduction = process.env.VERCEL_ENV === 'production'
export const NOTIFY_EMAILS = isProduction
  ? ['info@portergoldberg.com', 'dadams.chi+portergoldbergcc@gmail.com', 'contact@artplexity.com']
  : ['dadams.chi+portergoldbergcc@gmail.com']
