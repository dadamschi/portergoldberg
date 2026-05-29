import { NextResponse } from 'next/server'
import {
  createIssue,
  findExistingIssue,
  addCommentToIssue,
  isGitHubConfigured
} from '@/lib/github'

type ErrorType = '404' | 'error' | 'global-error'

type ErrorNotifyBody = {
  type: ErrorType
  url: string
  message?: string
  stack?: string
  userAgent?: string
  referer?: string
}

const labelMap: Record<ErrorType, 'bug/404' | 'bug/runtime' | 'bug/global-error'> = {
  '404': 'bug/404',
  'error': 'bug/runtime',
  'global-error': 'bug/global-error',
}

function generateIssueTitle(type: ErrorType, url: string, message?: string): string {
  if (type === '404') {
    return `404: ${url}`
  }
  const shortMessage = message ? message.slice(0, 50) : 'Unknown error'
  return `${type === 'global-error' ? 'Global Error' : 'Error'}: ${shortMessage}`
}

function generateIssueBody(body: ErrorNotifyBody): string {
  const { type, url, message, stack, userAgent, referer } = body
  const timestamp = new Date().toISOString()

  let markdown = `## ${type === '404' ? 'Page Not Found' : 'Error Details'}\n\n`
  markdown += `| Field | Value |\n|-------|-------|\n`
  markdown += `| **Type** | \`${type}\` |\n`
  markdown += `| **URL** | ${url} |\n`
  markdown += `| **Timestamp** | ${timestamp} |\n`
  if (referer) markdown += `| **Referer** | ${referer} |\n`
  if (userAgent) markdown += `| **User Agent** | ${userAgent} |\n`

  if (message) {
    markdown += `\n### Error Message\n\`\`\`\n${message}\n\`\`\`\n`
  }

  if (stack) {
    markdown += `\n### Stack Trace\n\`\`\`\n${stack}\n\`\`\`\n`
  }

  return markdown
}

function generateCommentBody(body: ErrorNotifyBody): string {
  const timestamp = new Date().toISOString()
  let comment = `**Occurred again at ${timestamp}**\n\n`
  comment += `- URL: ${body.url}\n`
  if (body.referer) comment += `- Referer: ${body.referer}\n`
  if (body.userAgent) comment += `- User Agent: ${body.userAgent}\n`
  return comment
}

// Errors to ignore (not actionable)
const IGNORED_ERRORS = [
  /Loading chunk \d+ failed/i,           // Deployment cache invalidation
  /ChunkLoadError/i,                      // Same as above
  /Failed to fetch dynamically imported/, // Dynamic import during deploy
  /Network Error/i,                       // Transient network issues
  /Load failed/i,                         // Generic load failures
]

export async function POST(request: Request) {
  if (!isGitHubConfigured()) {
    console.warn('[ErrorNotify] GitHub not configured, skipping issue creation')
    return NextResponse.json({ success: false, reason: 'github not configured' }, { status: 200 })
  }

  const body: ErrorNotifyBody = await request.json()
  const { type, url, message } = body

  // Skip non-actionable errors
  if (message && IGNORED_ERRORS.some((pattern) => pattern.test(message))) {
    console.log('[ErrorNotify] Ignoring non-actionable error:', message.slice(0, 50))
    return NextResponse.json({ success: false, reason: 'ignored error type' }, { status: 200 })
  }

  const title = generateIssueTitle(type, url, message)

  // Check for existing open issue with same title
  const existingIssue = await findExistingIssue(title)

  if (existingIssue) {
    // Add comment to existing issue instead of creating duplicate
    const commented = await addCommentToIssue(existingIssue.number, generateCommentBody(body))
    return NextResponse.json({
      success: true,
      action: 'commented',
      issue: existingIssue.html_url,
      commented
    })
  }

  // Create new issue
  const issue = await createIssue({
    title,
    body: generateIssueBody(body),
    labels: [labelMap[type]],
  })

  if (!issue) {
    return NextResponse.json({ success: false, reason: 'failed to create issue' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    action: 'created',
    issue: issue.html_url
  })
}
