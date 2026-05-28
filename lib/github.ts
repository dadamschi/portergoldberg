const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = 'dadamschi'
const REPO_NAME = 'portergoldberg'

type IssueLabel = 'bug/404' | 'bug/runtime' | 'bug/global-error'

type CreateIssueParams = {
  title: string
  body: string
  labels: IssueLabel[]
}

type GitHubIssue = {
  number: number
  html_url: string
  title: string
}

export async function findExistingIssue(title: string): Promise<GitHubIssue | null> {
  if (!GITHUB_TOKEN) return null

  const searchQuery = encodeURIComponent(`repo:${REPO_OWNER}/${REPO_NAME} is:issue is:open in:title "${title}"`)

  const response = await fetch(
    `https://api.github.com/search/issues?q=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  if (!response.ok) {
    console.error('[GitHub] Search failed:', response.status)
    return null
  }

  const data = await response.json()
  return data.items?.[0] || null
}

export async function createIssue({ title, body, labels }: CreateIssueParams): Promise<GitHubIssue | null> {
  if (!GITHUB_TOKEN) {
    console.warn('[GitHub] GITHUB_TOKEN not configured, skipping issue creation')
    return null
  }

  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body, labels }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('[GitHub] Failed to create issue:', response.status, error)
    return null
  }

  const issue = await response.json()
  console.log(`[GitHub] Created issue #${issue.number}: ${issue.html_url}`)
  return issue
}

export async function addCommentToIssue(issueNumber: number, body: string): Promise<boolean> {
  if (!GITHUB_TOKEN) return false

  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    }
  )

  if (!response.ok) {
    console.error('[GitHub] Failed to add comment:', response.status)
    return false
  }

  return true
}

export function isGitHubConfigured(): boolean {
  return !!GITHUB_TOKEN
}
