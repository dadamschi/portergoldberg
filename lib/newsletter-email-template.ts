/**
 * Newsletter email template generator for HubSpot.
 * Modern design with clean typography and agent branding.
 * Based on Claude design template - fully responsive, email-client tested.
 */

import { formatPhoneNumber } from './utils/contact'

export interface NewsletterSection {
  heading: string // e.g. "FEATURED PROFESSIONAL" - parsed into eyebrow + title
  imageUrl: string
  imageAlt?: string
  imageHotspot?: { x: number; y: number }
  imageCrop?: { top: number; bottom: number; left: number; right: number }
  imageDimensions?: { width: number; height: number }
  body: string
  caption?: string
  linkUrl?: string | {
    url?: string
    customText?: string
  }
  instagram?: string
  phone?: string
  facebookHandle?: string
  email?: string
  titleLarger?: boolean
}

export type NewsletterType = 'weekly' | 'halcyon'
export type NewsletterLayout = 'default' | 'stacked'

// Color palette matching Claude design
const INK = '#1A1917'
const GOLD = '#000000'
const DIVIDER_LIGHT = '#dedbd6'

// Typography - responsive with clamp, no explicit color for dark mode
const FONT = "font-family:'Quicksand',Helvetica,Arial,sans-serif;"
const HEADING_LARGE = `font-size:clamp(24px, 6vw, 42px);font-weight:400;letter-spacing:0.02em;`
const HEADING_SMALL = `font-size:clamp(18px, 3vw, 26px);font-weight:400;letter-spacing:0.16em;`
const BODY_TEXT = `font-size:clamp(14px, 2.5vw, 16px);line-height:1.58;`

// Utility functions
function esc(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function typographic(input: string): string {
  return esc(input)
    .replace(/'/g, '&rsquo;')
    .replace(/"([^"]*)"/g, '&ldquo;$1&rdquo;')
    .replace(/--/g, '&mdash;')
}

function parseHeading(heading: string): { eyebrow: string; title: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length === 1) {
    return { eyebrow: '', title: words[0] }
  }
  // Reversed: first word(s) = title, last word = eyebrow
  return { eyebrow: words[words.length - 1], title: words.slice(0, -1).join(' ') }
}

// Image optimization for Sanity CDN
function optimizeSanityImageUrl(
  url: string,
  width: number,
  height: number,
  hotspot?: { x: number; y: number },
  crop?: { top: number; bottom: number; left: number; right: number },
  dimensions?: { width: number; height: number }
): string {
  if (!url.includes('cdn.sanity.io')) return url

  const params: string[] = [`w=${width}`, `h=${height}`, 'q=80', 'auto=format', 'fit=crop']

  if (crop && dimensions) {
    const rectX = Math.round(crop.left * dimensions.width)
    const rectY = Math.round(crop.top * dimensions.height)
    const rectW = Math.round(dimensions.width * (1 - crop.left - crop.right))
    const rectH = Math.round(dimensions.height * (1 - crop.top - crop.bottom))
    params.push(`rect=${rectX},${rectY},${rectW},${rectH}`)
  }

  if (hotspot) {
    params.push('crop=focalpoint', `fp-x=${hotspot.x}`, `fp-y=${hotspot.y}`)
  } else {
    params.push('crop=center')
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params.join('&')}`
}

/**
 * Weekly Walk-Through header - agent photos + branding
 * Note: This is typically static in HubSpot, not dynamically generated
 */
const HEADER_WEEKLY = `<a href="https://www.portergoldberg.com/newsletters" target="_blank" style="text-decoration:none;display:block;">
  <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20Footer%20Content/ywwt-header.png" alt="Your Weekly Walk-Through — PorterGoldberg Residential" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
</a>

<div style="max-width:600px;margin:32px 15px;text-align:center">
  <hr>
  <p style="margin:0px 19px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-style:italic;color:#1a1a1a;">Market updates, tips, and insights from Lauren and Samantha</p>
  <hr>
</div>`

/**
 * Halcyon e-blast header - logos only
 */
const HEADER_HALCYON = `<table style="width: 100%; max-width: 600px; background-color: #000000; padding: 30px 20px; border-collapse: collapse; -webkit-font-smoothing: antialiased;">
<tbody>
<tr>
<td style="margin: auto;"><img style="display: block; padding-left: 20px" src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Halcyon%20Logo%20No%20Background.png" alt="Halcyon Development" height="50" /></td>
<td style="vertical-align: middle;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20halcyon-WHITE.png" alt="Halcyon Development Group" height="30" /></td>
<td style="vertical-align: middle; text-align: center; width: 50%; padding-left: 20px;"><img style="display: block; margin: 0 auto;" src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20PGJameson%20logo.png" alt="PorterGoldberg Residential" height="98" /></td>
</tr>
</tbody>
</table>`

const HEADERS: Record<NewsletterType, string> = {
  weekly: HEADER_WEEKLY,
  halcyon: HEADER_HALCYON,
}

/**
 * Section heading with decorative line (alternating left/right alignment)
 * Uses table structure for Outlook compatibility
 */
function generateSectionHeading(heading: string, index: number, titleLarger?: boolean): string {
  const words = heading.trim().split(/\s+/)

  // Match React component convention: label = first word(s), title = last word
  const label = words.slice(0, -1).join(' ')
  const title = words[words.length - 1] || ''

  const isEven = index % 2 === 0

  // Determine which word is larger based on titleLarger
  const isTitleLarger = titleLarger !== undefined ? titleLarger : !isEven

  // When titleLarger is true, title (last word) gets large font
  const titleStyle = isTitleLarger ? HEADING_LARGE : HEADING_SMALL
  const labelStyle = isTitleLarger ? HEADING_SMALL : HEADING_LARGE

  if (isEven) {
    // Left-aligned: label | title | line
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    ${label ? `<td style="width:1%;white-space:nowrap;vertical-align:middle;padding:0;"><span style="${labelStyle}text-transform:uppercase;${FONT}color:${GOLD};">${esc(label.toUpperCase())}</span></td>
    <td style="width:16px;"></td>` : ''}
    <td style="width:1%;white-space:nowrap;vertical-align:middle;padding:0;"><span style="${titleStyle}text-transform:uppercase;${FONT}color:${GOLD};">${esc(title.toUpperCase())}</span></td>
    <td style="width:16px;"></td>
    <td style="vertical-align:middle;padding:0;"><div style="height:1px;border-top:1px solid ${INK};font-size:0;line-height:0;">&nbsp;</div></td>
  </tr>
</table>`
  } else {
    // Right-aligned: line | label | title
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td style="vertical-align:middle;padding:0;"><div style="height:1px;border-top:1px solid ${INK};font-size:0;line-height:0;">&nbsp;</div></td>
    <td style="width:16px;"></td>
    ${label ? `<td style="width:1%;white-space:nowrap;vertical-align:middle;padding:0;"><span style="${labelStyle}text-transform:uppercase;${FONT}color:${GOLD};">${esc(label.toUpperCase())}</span></td>
    <td style="width:16px;"></td>` : ''}
    <td style="width:1%;white-space:nowrap;vertical-align:middle;padding:0;"><span style="${titleStyle}text-transform:uppercase;${FONT}color:${GOLD};">${esc(title.toUpperCase())}</span></td>
  </tr>
</table>`
  }
}

/**
 * Section divider line - uses table for Outlook compatibility
 */
function generateDivider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:40px;">
  <tr><td style="padding:0;"><div style="height:1px;background:${DIVIDER_LIGHT};font-size:0;line-height:0;">&nbsp;</div></td></tr>
</table>`
}

/**
 * Extract domain from URL for display purposes
 */
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Normalize URL to ensure portergoldberg.com links use https://www.portergoldberg.com
 */
function normalizeUrl(url: string): string {
  // Local links (starting with /) should be converted to full URLs
  if (url.startsWith('/')) {
    return `https://www.portergoldberg.com${url}`
  }

  // URLs containing portergoldberg.com should use https://www.portergoldberg.com
  if (url.includes('portergoldberg.com')) {
    try {
      const urlObj = new URL(url)
      // Replace any variation (http/https, www/non-www) with canonical version
      return url.replace(urlObj.origin, 'https://www.portergoldberg.com')
    } catch {
      // If URL parsing fails but it contains portergoldberg.com, try to fix it
      // Handle cases like "portergoldberg.com/path" without protocol
      if (!url.startsWith('http')) {
        return `https://www.portergoldberg.com${url.replace(/^portergoldberg\.com/, '')}`
      }
    }
  }

  return url
}

/**
 * Generate links section (contact/social links)
 */
function generateLinks(linkUrl?: string | { url?: string; customText?: string }, instagram?: string, facebookHandle?: string, email?: string, phone?: string): string {
  // Handle both old (string) and new (object) formats
  const rawUrl = typeof linkUrl === 'string' ? linkUrl : linkUrl?.url
  const customText = typeof linkUrl === 'string' ? undefined : linkUrl?.customText

  if (!rawUrl && !instagram && !facebookHandle && !email && !phone) return ''

  const links: string[] = []
  const paragraphStyle = `style="margin:0 0 4px 0;font-size:15px;letter-spacing:0.03em;font-weight:700;${FONT}color:${INK};"`;
  const anchorStyle = `style="color:${INK};text-decoration:underline;"`;

  if (email) {
    links.push(`<p ${paragraphStyle}>Connect via email: <a href="mailto:${esc(email)}" ${anchorStyle}>${esc(email)} &gt;</a></p>`)
  }

  if (phone) {
    const formattedPhone = formatPhoneNumber(phone)
    // Use raw digits for tel: link, formatted version for display
    const telLink = phone.replace(/\D/g, '')
    links.push(`<p ${paragraphStyle}>Call or text: <a href="tel:${telLink}" ${anchorStyle}>${esc(formattedPhone)}</a></p>`)
  }

  if (rawUrl) {
    // Normalize URL once at the beginning
    const url = normalizeUrl(rawUrl)
    const isPorterGoldbergUrl = rawUrl.startsWith('/') || rawUrl.includes('portergoldberg.com')

    if (isPorterGoldbergUrl) {
      const linkText = customText || 'Check it out on portergoldberg.com'
      links.push(`<p ${paragraphStyle}><a href="${esc(url)}" ${anchorStyle}>${esc(linkText)} &gt;</a></p>`)
    } else {
      // If no custom text and URL is long, show just the domain
      let displayText = customText || rawUrl
      if (!customText && rawUrl.length > 50) {
        displayText = getDomain(rawUrl)
      }
      links.push(`<p ${paragraphStyle}><a href="${esc(url)}" target="_blank" ${anchorStyle}>${esc(displayText)} &gt;</a></p>`)
    }
  }

  if (instagram) {
    const handle = instagram.replace('@', '')
    const instagramUrl = `https://www.instagram.com/${handle}`
    links.push(`<p ${paragraphStyle}><a href="${esc(instagramUrl)}" target="_blank" ${anchorStyle}>IG: @${esc(handle)} &gt;</a></p>`)
  }

  if (facebookHandle) {
    const fbHandle = facebookHandle.replace('@', '')
    const facebookUrl = `https://www.facebook.com/${fbHandle}`
    links.push(`<p ${paragraphStyle}><a href="${esc(facebookUrl)}" target="_blank" ${anchorStyle}>FB: ${fbHandle} &gt;</a></p>`)
  }

  return `<div style="padding-top:14px;">
  ${links.join('\n  ')}
</div>`
}

/**
 * Render a single newsletter section
 * Uses table structure for better Outlook compatibility
 */
function renderSection(section: NewsletterSection, index: number): string {
  const headingHtml = section.heading ? generateSectionHeading(section.heading, index, section.titleLarger) : ''

  // Priority: linkUrl → instagram → facebook
  let wrapUrl: string | undefined
  const linkUrlValue = typeof section.linkUrl === 'string' ? section.linkUrl : section.linkUrl?.url

  if (linkUrlValue) {
    wrapUrl = normalizeUrl(linkUrlValue)
  } else if (section.instagram) {
    wrapUrl = `https://www.instagram.com/${section.instagram.replace('@', '')}`
  } else if (section.facebookHandle) {
    wrapUrl = `https://www.facebook.com/${section.facebookHandle.replace('@', '')}`
  }

  const optimizedImageUrl = section.imageUrl
    ? optimizeSanityImageUrl(section.imageUrl, 600, 400, section.imageHotspot, section.imageCrop, section.imageDimensions)
    : ''

  // Wrap image in link if we have a URL
  const imageElement = optimizedImageUrl
    ? `<img src="${esc(optimizedImageUrl)}" alt="${esc(section.imageAlt || section.heading)}" width="600" style="width:100%;max-width:600px;height:auto;display:block;border:0;">`
    : ''

  const imageHtml = imageElement && wrapUrl
    ? `<a href="${esc(wrapUrl)}" target="_blank" style="display:block;text-decoration:none;">${imageElement}</a>`
    : imageElement

  // Wrap body text in link if we have a URL
  const bodyElement = `<p style="margin:0;${BODY_TEXT}${FONT}color:${INK};">${typographic(section.body)}</p>`

  const bodyHtml = wrapUrl
    ? `<a href="${esc(wrapUrl)}" target="_blank" style="text-decoration:none;color:inherit;">${bodyElement}</a>`
    : bodyElement

  const linksHtml = generateLinks(section.linkUrl, section.instagram, section.facebookHandle, section.email, section.phone)

  const topPadding = index === 0 ? '0px' : '10px'

  // Use table for Outlook compatibility
  return `<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;">
<tr><td style="padding:${topPadding} 0 0 0;">
<![endif]-->
<div style="padding:${topPadding} 0 16px 0;">
  ${headingHtml}
  <div>
    ${imageHtml}
  </div>
  <div style="padding-top:22px;">
    ${bodyHtml}
  </div>
  ${linksHtml}
</div>
<!--[if mso]>
</td></tr>
</table>
<![endif]-->`
}

/**
 * Generates a "View on Website" link section
 */
function viewOnWebsiteHtml(slug: string): string {
  const url = `https://www.portergoldberg.com/newsletters/${slug}`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:32px auto;">
    <tr><td style="padding:0;text-align:center;">
      <a href="${url}" target="_blank" style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1a;text-decoration:none;">View this newsletter on our website</a>
    </td></tr>
  </table>`
}

/**
 * Footer HTML using fluid-hybrid technique
 * - Agent cards stack on mobile
 * - Social icons only (no text labels)
 */
const FOOTER_HTML = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#000000;border-collapse:collapse;">

  <!-- Top band: white, PORTERGOLDBERG.COM centered with gold rules -->
  <tr>
    <td style="padding:0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:20px 18px;">
          <a href="https://www.portergoldberg.com" target="_blank" style="text-decoration:none;display:block;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;"><div style="height:1px;background-color:#A8904E;font-size:0;line-height:0;">&nbsp;</div></td>
                <td style="width:1%;white-space:nowrap;padding:0 16px;text-align:center;vertical-align:middle;"><span style="font-size:16px;font-weight:bold;letter-spacing:3px;color:#A8904E;text-transform:uppercase;">PORTERGOLDBERG.COM</span></td>
                <td style="vertical-align:middle;"><div style="height:1px;background-color:#A8904E;font-size:0;line-height:0;">&nbsp;</div></td>
              </tr>
            </table>
          </a>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Agents: fluid-hybrid two cards -->
  <tr>
    <td style="padding:16px 10px;background-color:#000000;border-top:1px solid #444444;border-bottom:1px solid #444444;">
      <div style="font-size:0;line-height:0;text-align:center;">
        <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="270" valign="top"><![endif]-->
        <div style="display:inline-block;vertical-align:top;width:270px;max-width:100%;text-align:left;line-height:1.4;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:middle;"><img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20Headshot%20-%20sporter.png" alt="Samantha Porter" width="58" style="display:block;border:0;"></td>
              <td style="vertical-align:middle;font-family:Helvetica,Arial,sans-serif;">
                <p style="margin:0;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Samantha Porter</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#ffffff;">Vice President, Sales</p>
                <p style="margin:0;font-size:12px;"><a href="tel:7739887898" style="color:#ffffff;text-decoration:none;">773-988-7898</a></p>
                <p style="margin:0;font-size:12px;"><a href="mailto:samantha@portergoldberg.com" style="color:#ffffff;text-decoration:none;">samantha@portergoldberg.com</a></p>
              </td>
            </tr>
          </table>
        </div><!--
        --><!--[if mso]></td><td width="270" valign="top"><![endif]-->
        <div style="display:inline-block;vertical-align:top;width:270px;max-width:100%;text-align:left;line-height:1.4;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:middle;"><img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20Headshot%20-%20lgoldberg.png" alt="Lauren Goldberg" width="58" style="display:block;border:0;"></td>
              <td style="vertical-align:middle;font-family:Helvetica,Arial,sans-serif;">
                <p style="margin:0;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Lauren Goldberg</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#ffffff;">Vice President, Sales</p>
                <p style="margin:0;font-size:12px;"><a href="tel:7735760053" style="color:#ffffff;text-decoration:none;">773-576-0053</a></p>
                <p style="margin:0;font-size:12px;"><a href="mailto:lauren@portergoldberg.com" style="color:#ffffff;text-decoration:none;">lauren@portergoldberg.com</a></p>
              </td>
            </tr>
          </table>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
      </div>
    </td>
  </tr>

  <!-- Logo, linked -->
  <tr>
    <td style="padding:16px 10px;text-align:center;background-color:#000000;">
      <a href="https://www.portergoldberg.com" target="_blank" style="text-decoration:none;display:inline-block;">
        <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20PGJameson%20logo.png" alt="PorterGoldberg Residential" height="110" style="display:block;border:0;">
      </a>
    </td>
  </tr>

  <!-- Social: icon images only -->
  <tr>
    <td style="padding:12px 10px 14px 10px;background-color:#000000;">
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 12px;">
            <a href="https://www.instagram.com/portergoldbergchicago" target="_blank" style="text-decoration:none;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Instagram_Glyph_White.png" alt="Instagram" width="26" height="26" style="display:block;border:0;">
            </a>
          </td>
          <td style="padding:0 12px;">
            <a href="https://www.facebook.com/PorterGoldbergResidential" target="_blank" style="text-decoration:none;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Facebook_Logo_Secondary.png" alt="Facebook" width="26" height="26" style="display:block;border:0;">
            </a>
          </td>
          <td style="padding:0 12px;">
            <a href="https://www.youtube.com/@PorterGoldbergResidential" target="_blank" style="text-decoration:none;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20YouTube%20Logo.png" alt="YouTube" width="26" height="26" style="display:block;border:0;">
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Legal disclaimer -->
  <tr>
    <td style="padding:10px 14px 16px 14px;background-color:#000000;">
      <p style="margin:0;font-size:10px;color:#ffffff;line-height:1.4;text-align:center;font-family:Arial,sans-serif;">
        &copy; ${new Date().getFullYear()} Sotheby&rsquo;s International Realty&reg; and the Sotheby&rsquo;s International Realty Logo are service marks licensed to Sotheby&rsquo;s International Realty Affiliates LLC and used with permission. Jameson Sotheby&rsquo;s International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby&rsquo;s International Realty Affiliates LLC nor any of its affiliated companies.
      </p>
    </td>
  </tr>

</table>`

/**
 * Preheader (hidden preview text)
 */
function generatePreheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">
  ${typographic(text)}
</div>`
}

/**
 * Main newsletter HTML generator
 * Note: Email newsletters always use stacked layout
 * Designed for HubSpot - no <html>, <head>, or <body> tags, no media queries
 */
export function generateNewsletterEmailHtml(
  sections: NewsletterSection[],
  slug?: string,
  type: NewsletterType = 'weekly',
  previewText?: string
): string {
  const preheader = previewText ? generatePreheader(previewText) : ''
  const header = HEADERS[type]
  const viewOnWebsite = slug ? viewOnWebsiteHtml(slug) : ''

  // Email content - pure inline styles, no CSS
  return `${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0;padding:0;">
<tr><td align="center" style="padding:32px 0;">

${header}
${generateSectionsHtml(sections)}
${viewOnWebsite}
${FOOTER_HTML}

</td></tr>
</table>`
}

/**
 * Generate sections HTML wrapped in content container
 */
export function generateSectionsHtml(sections: NewsletterSection[]): string {
  const sectionsHtml = sections.map((section, index) => renderSection(section, index)).join('\n\n')

  // Wrap in content container - use width attribute for Outlook, max-width for responsive
  return `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 auto;">
<tr><td style="padding:0;">

${sectionsHtml}

</td></tr>
</table>`
}
