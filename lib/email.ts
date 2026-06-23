import nodemailer from 'nodemailer'
import { EMAIL_NOTIFICATION_RECIPIENTS } from './constants'

function getTransporter() {
  if (!process.env.SMTP_HOST) {
    throw new Error('Missing SMTP_HOST environment variable')
  }
  if (!process.env.SMTP_USER) {
    throw new Error('Missing SMTP_USER environment variable')
  }
  if (!process.env.SMTP_PASS) {
    throw new Error('Missing SMTP_PASS environment variable')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_PORT === '587' ? false : true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''

// All notification emails go to these addresses
export const NOTIFY_EMAILS = EMAIL_NOTIFICATION_RECIPIENTS

type SendEmailOptions = {
  from?: string
  to: string | string[]
  cc?: string | string[]
  replyTo?: string
  subject: string
  html: string
}

type SendEmailResult = {
  error: Error | null
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { from = FROM_EMAIL, to, cc, replyTo, subject, html } = options

  try {
    const transporter = getTransporter()
    await transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      replyTo,
      subject,
      html,
    })
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}
