const CENTRAL_TIME = 'America/Chicago'

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: CENTRAL_TIME,
  })
}

/**
 * Format a date-only string (YYYY-MM-DD) without timezone shift.
 * Use this for Sanity `date` fields (not `datetime`).
 */
export function formatDateOnly(dateStr: string): string {
  // Parse as local date to avoid UTC timezone shift
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: CENTRAL_TIME,
    timeZoneName: 'short',
  })
}
