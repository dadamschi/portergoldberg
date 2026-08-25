import { Resend } from 'resend'
import { EMAIL_NOTIFICATION_RECIPIENTS } from './constants'

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY environment variable')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export const FROM_EMAIL = 'PorterGoldberg Website <noreply@portergoldberg.com>'

// All notification emails go to these addresses
export const NOTIFY_EMAILS = EMAIL_NOTIFICATION_RECIPIENTS

type SendEmailOptions = {
  from?: string
  to?: string | string[]
  cc?: string | string[]
  replyTo?: string
  subject: string
  html: string
}

type SendEmailResult = {
  error: Error | null
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { from = FROM_EMAIL, to = NOTIFY_EMAILS, replyTo, subject, html } = options

  try {
    const resend = getResend()
    const { error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      replyTo,
      subject,
      html,
    })

    if (error) {
      return { error: new Error(error.message) }
    }
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}
