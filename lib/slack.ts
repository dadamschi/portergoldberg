/**
 * Slack webhook notifications
 */

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

export function isSlackConfigured(): boolean {
  return !!SLACK_WEBHOOK_URL
}

type SlackMessage = {
  text: string
  blocks?: Array<{
    type: string
    text?: { type: string; text: string }
    fields?: Array<{ type: string; text: string }>
  }>
}

export async function notifySlack(message: SlackMessage): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
    console.log('[Slack] Notification sent, status:', response.status)
  } catch (err) {
    console.error('[Slack] Failed to send notification:', err)
  }
}

export async function notify404(pathname: string, referer: string | null): Promise<void> {
  console.log('[Slack] notify404 called, webhook configured:', !!SLACK_WEBHOOK_URL)
  if (!SLACK_WEBHOOK_URL) return

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
          { type: 'mrkdwn', text: `*URL:*\n${pathname}` },
          { type: 'mrkdwn', text: `*Referer:*\n${referer || 'Direct/None'}` },
        ],
      },
      {
        type: 'context',
        text: { type: 'mrkdwn', text: `_${new Date().toLocaleString()}_` },
      },
    ],
  })
}
