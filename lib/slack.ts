/**
 * Slack webhook notifications
 */

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

export function isSlackConfigured(): boolean {
  return !!SLACK_WEBHOOK_URL
}

type SlackBlock = {
  type: string
  text?: { type: string; text: string }
  fields?: Array<{ type: string; text: string }>
  elements?: Array<{ type: string; text: string }>
}

type SlackMessage = {
  text: string
  blocks?: SlackBlock[]
}

export async function notifySlack(message: SlackMessage): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return

  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
  } catch (err) {
    console.error('[Slack] Failed to send notification:', err)
  }
}

type NotFound404 = {
  pathname: string
  fullUrl: string
  referer: string | null
  userAgent: string
  isRSC: boolean
  isPrefetch: boolean
  vercelId: string
  cacheStatus: string
}

export async function notify404({ pathname, fullUrl, referer, userAgent, isRSC, isPrefetch, vercelId, cacheStatus }: NotFound404): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return

  // Build request type label
  const requestType = isPrefetch ? 'Prefetch' : isRSC ? 'RSC' : 'Direct'

  await notifySlack({
    text: `404: ${pathname}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔴 404 Not Found' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Path:*\n${pathname}` },
          { type: 'mrkdwn', text: `*Type:*\n${requestType} | Cache: ${cacheStatus}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Full URL:*\n${fullUrl}` },
          { type: 'mrkdwn', text: `*Referer:*\n${referer || 'Direct/None'}` },
        ],
      },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `_${vercelId} • ${new Date().toISOString()}_` }],
      },
    ],
  })
}

type ErrorNotification = {
  type: 'error' | 'global-error'
  url: string
  message?: string
  stack?: string
  userAgent?: string
  referer?: string
}

export async function notifyError(error: ErrorNotification): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return

  const emoji = error.type === 'global-error' ? '💥' : '⚠️'
  const title = error.type === 'global-error' ? 'Global Error' : 'Runtime Error'

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${emoji} ${title}` },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*URL:*\n${error.url}` },
        { type: 'mrkdwn', text: `*Referer:*\n${error.referer || 'Direct/None'}` },
      ],
    },
  ]

  if (error.message) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Message:*\n\`\`\`${error.message.slice(0, 500)}\`\`\`` },
    })
  }

  if (error.stack) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Stack:*\n\`\`\`${error.stack.slice(0, 500)}\`\`\`` },
    })
  }

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: `_${new Date().toISOString()}_` }],
  })

  await notifySlack({
    text: `${title}: ${error.message?.slice(0, 50) || 'Unknown error'}`,
    blocks,
  })
}
