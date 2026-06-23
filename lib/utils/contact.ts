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
