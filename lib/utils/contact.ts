/**
 * Open the contact form with a prepopulated message.
 * Use this for in-app triggers (buttons, links with onClick).
 *
 * @example
 * <button onClick={() => openContactForm("I'm interested in 123 Main St")}>
 *   Contact about this listing
 * </button>
 */
export function openContactForm(message?: string, address?: string) {
  window.dispatchEvent(
    new CustomEvent('open-connect-form', {
      detail: { message, address },
    })
  )
}

/**
 * Get a URL that will open the contact form with a prepopulated message.
 * Use this for links that need to work across pages or from external sources.
 *
 * @example
 * <Link href={getContactUrl("I'd like to learn more about your services")}>
 *   Contact Us
 * </Link>
 *
 * // Or for newsletter links:
 * const url = getContactUrl("I saw this in the February newsletter")
 * // Returns: "/?contact=I%20saw%20this%20in%20the%20February%20newsletter"
 */
export function getContactUrl(message: string, basePath = '/'): string {
  const params = new URLSearchParams({ contact: message })
  return `${basePath}?${params.toString()}`
}

/**
 * Format phone number for display
 * Formats as (XXX) XXX-XXXX for 10-digit numbers
 *
 * @example
 * formatPhoneNumber('3125551234') // Returns: "(312) 555-1234"
 * formatPhoneNumber('13125551234') // Returns: "+1 (312) 555-1234"
 * formatPhoneNumber('(312) 555-1234') // Returns: "(312) 555-1234"
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '')

  // Format 10-digit US numbers as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  // Format 11-digit numbers (with country code) as +X (XXX) XXX-XXXX
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  // Return as-is if not a standard format
  return phone
}
