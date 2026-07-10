/**
 * Newsletter email template generator for HubSpot.
 * Generates email-client-safe HTML with inline styles and table layout.
 */

export interface NewsletterSection {
  heading: string // e.g. "FEATURED PROFESSIONAL" - parsed into eyebrow + title
  imageUrl: string
  imageAlt?: string
  body: string
  caption?: string
  linkUrl?: string
  instagram?: string // Instagram handle (with or without @)
  titleLarger?: boolean // Toggle which word is larger in section header
}

// Internal type with layout for rendering
interface NewsletterSectionWithLayout extends NewsletterSection {
  layout: 'image-left' | 'image-right'
}

/**
 * Parse heading into eyebrow (all words except last) and title (last word)
 * Matches website SectionHeader.tsx behavior exactly
 * e.g. "FEATURED PROFESSIONAL" -> { eyebrow: "FEATURED", title: "PROFESSIONAL" }
 * e.g. "CURRENT INVENTORY AVAILABLE" -> { eyebrow: "CURRENT INVENTORY", title: "AVAILABLE" }
 */
function parseHeading(heading: string): { eyebrow: string; title: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length === 1) {
    return { eyebrow: '', title: words[0] }
  }
  // All words except last = eyebrow, last word = title
  return { eyebrow: words.slice(0, -1).join(' '), title: words[words.length - 1] }
}

const INK = '#1a1a1a'
const LINE = '#1a1a1a'
const FONT = 'font-family:Helvetica, Arial, sans-serif;'

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
}

function paragraphsHtml(body: string): string {
  const paragraphs = body.split('\n\n').filter(Boolean)
  return paragraphs
    .map(
      (line, i, arr) =>
        `<p style="margin:0 0 ${i === arr.length - 1 ? 0 : 14}px 0; ${FONT} font-size:16px; font-weight:500; line-height:1.55; color:${INK};">${typographic(line)}</p>`
    )
    .join('')
}

function captionHtml(caption: string | undefined): string {
  if (!caption) return ''
  const lines = caption.split('\n').filter(Boolean)
  return `<p style="margin:10px 0 0 0; ${FONT} font-size:13px; line-height:1.4; color:${INK}; text-align:left;">${lines.map(typographic).join('<br>')}</p>`
}
const headingFont = "font-family:'Century Gothic', Helvetica, Arial, sans-serif;"
function sectionHeadHtml(section: NewsletterSectionWithLayout): string {
  const layout = section.layout
  const { eyebrow, title } = parseHeading(section.heading)
  console.log('layout', layout)
  // Heading font (Quinoa SC with fallbacks)
  
  // Label style (matches .pg-section-header-label)
  const titleStyle = `${headingFont} font-size:22px; font-weight:400; letter-spacing:0.15em; color:${INK}; white-space:nowrap; vertical-align:middle; text-transform:uppercase;`
  // Title style (matches .pg-section-header-title)
  const labelStyle = `${headingFont} font-size:36px; font-weight:400; letter-spacing:0.08em; color:${INK}; white-space:nowrap; vertical-align:middle; text-transform:uppercase;`
  // Line cell (matches .pg-section-header-line - 2px height)
  const lineCell = `<td width="100%" valign="middle" style="width:100%; vertical-align:middle; padding:0 24px;"><div style="border-top:2px solid ${LINE}; font-size:1px; line-height:1px;">&nbsp;</div></td>`

  // Use titleLarger if set, otherwise fall back to layout-based alternation
  const isTitleLarger = section.titleLarger !== undefined
    ? section.titleLarger
    : layout === 'image-right'
  const labelTextStyle = isTitleLarger ? titleStyle : labelStyle
  const titleTextStyle = isTitleLarger ? labelStyle : titleStyle
  // Text spans - order is ALWAYS label then title (never changes)
  const labelSpan = eyebrow ? `<span style="${labelTextStyle}">${esc(eyebrow.toUpperCase())}</span>` : ''
  const titleSpan = `<span style="${titleTextStyle}">${esc(title.toUpperCase())}</span>`
  const gap = eyebrow ? '<span style="display:inline-block; width:12px;"></span>' : ''

  // Text cell always has label then title
  const textCell = `<td valign="middle" style="white-space:nowrap; vertical-align:middle;">${labelSpan}${gap}${titleSpan}</td>`

  // Only the position changes: text on left vs right of line
  const cells = layout === 'image-right'
    ? `${lineCell}${textCell}` // Even sections: line | text
    : `${textCell}${lineCell}` // Odd sections: text | line

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 2px 0;">
    <tr>${cells}</tr>
  </table>`
}

function wrapInLink(content: string, url?: string): string {
  if (!url) return content

  // Convert #contact: links to mailto
  if (url.startsWith('#contact:')) {
    const subject = url.replace('#contact:', '')
    const mailtoUrl = `mailto:info@portergoldberg.com?subject=${encodeURIComponent(subject)}`
    return `<a href="${mailtoUrl}" style="color:inherit; text-decoration:none;">${content}</a>`
  }

  return `<a href="${esc(url)}" target="_blank" style="color:inherit; text-decoration:none;">${content}</a>`
}

/**
 * Renders clickable links for URL and Instagram below the image
 * Matches website pg-newsletter-section-links styling
 */
function sectionLinksHtml(linkUrl?: string, instagram?: string): string {
  const links: string[] = []
  const linkStyle = `${FONT} font-size:14px; font-weight:400; color:${INK}; text-decoration:none;`

  if (linkUrl) {
    if (linkUrl.startsWith('#contact:')) {
      // Convert #contact: links to mailto with subject
      const subject = linkUrl.replace('#contact:', '')
      const mailtoUrl = `mailto:info@portergoldberg.com?subject=${encodeURIComponent(subject)}`
      links.push(`<a href="${mailtoUrl}" style="${linkStyle}">Contact Us</a>`)
    } else if (!linkUrl.startsWith('mailto:')) {
      // Regular URL link
      let linkText = linkUrl
      if (linkUrl.startsWith('/') || linkUrl.includes('portergoldberg.com')) {
        linkText = 'Learn More on PorterGoldberg.com'
      } else if (linkUrl.includes('jamesonps.com')) {
        linkText = 'Check out the property brochure'
      }
      // Truncate long URLs to "Learn More"
      if (linkText.length > 50) {
        linkText = 'Click here to learn more'
      }
      links.push(`<a href="${esc(linkUrl)}" target="_blank" style="${linkStyle}">${esc(linkText)}</a>`)
    }
  }

  // Instagram link
  if (instagram) {
    const handle = instagram.replace('@', '')
    links.push(`IG: <a href="https://instagram.com/${esc(handle)}" target="_blank" style="${linkStyle}">@${esc(handle)}</a>`)
  }

  if (links.length === 0) return ''

  return `<p style="margin:10px 0 0 0; ${FONT} font-size:14px; line-height:1.6; color:${INK};">${links.join('<br>')}</p>`
}

function sectionBlockHtml(section: NewsletterSectionWithLayout): string {
  const layout = section.layout
  const alt = section.imageAlt || section.heading
  const link = section.linkUrl

  // Placeholder for missing images - black box with gold YWWT text
  const placeholderContent = `<div style="font-family:'Century Gothic', Helvetica, Arial, sans-serif; display:block; width:100%; max-width:280px; aspect-ratio:509/454; background-color:#1a1a1a; color:#c9a227; font-size:24px; font-weight:700; letter-spacing:0.1em; text-align:center; line-height:250px;">YWWT</div>`

  const imageContent = section.imageUrl
    ? `<img src="${esc(section.imageUrl)}" alt="${esc(alt)}" width="280" style="display:block; width:100%; max-width:280px; height:auto;">`
    : placeholderContent

  const imageCell = `
    <td width="48%" valign="top" style="padding:0; width:48%;">
      ${wrapInLink(imageContent, link)}
      ${captionHtml(section.caption)}
    </td>`

  const textCell = `
    <td width="48%" valign="middle" style="padding:0; width:48%; vertical-align:middle;">
      ${wrapInLink(paragraphsHtml(section.body), link)}
    </td>`

  const spacerCell = `<td width="4%" style="width:4%; font-size:1px; line-height:1px;">&nbsp;</td>`

  const row =
    layout === 'image-right'
      ? `${textCell}${spacerCell}${imageCell}`
      : `${imageCell}${spacerCell}${textCell}`

  // Links row - positioned under the image cell
  const linksHtml = sectionLinksHtml(section.linkUrl, section.instagram)
  const emptyCell = `<td width="48%" style="width:48%;"></td>`
  const linksCell = `<td width="48%" style="width:48%; padding:8px 0 0 0;">${linksHtml}</td>`
  const linksRow = linksHtml
    ? layout === 'image-right'
      ? `<tr>${emptyCell}${spacerCell}${linksCell}</tr>`
      : `<tr>${linksCell}${spacerCell}${emptyCell}</tr>`
    : ''

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 34px 0;">
    <tr>${row}</tr>
    ${linksRow}
  </table>`
}

function renderSectionEmail(section: NewsletterSectionWithLayout): string {
  return `${sectionHeadHtml(section)}${sectionBlockHtml(section)}`
}

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

/**
 * Weekly Walk-Through header - agent photos + branding
 */
const HEADER_WEEKLY = `<a href="https://www.portergoldberg.com/newsletters" target="_blank" style="text-decoration: none;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-collapse: collapse;">
<tr>
  <!-- Lauren photo (left) -->
  <td width="25%" style="vertical-align: bottom; background-color: #f5f5f5;">
    <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Logos%20%2B%20Images/YWWT/ywwt.header.lgoldberg.hires.png" alt="Lauren Goldberg" width="150" style="display: block; width: 100%; height: auto; border: 0;">
  </td>

  <!-- Center content (black background) -->
  <td width="50%" style="background-color: #000000; text-align: center; vertical-align: middle;">
    <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Logos%20%2B%20Images/YWWT/ywwt.header.logo.hires.png" alt="Your Weekly Walk-Through - PorterGoldberg Residential" style="display: block; width: 100%; height: auto; border: 0;">
  </td>

  <!-- Samantha photo (right) -->
  <td width="25%" style="vertical-align: bottom; background-color: #f5f5f5;">
    <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Logos%20%2B%20Images/YWWT/ywwt.header.sporter.hires.png" alt="Samantha Porter" width="150" style="display: block; width: 100%; height: auto; border: 0;">
  </td>
</tr>
</table>
</a>`

export type NewsletterType = 'weekly' | 'halcyon'

const HEADERS: Record<NewsletterType, string> = {
  weekly: HEADER_WEEKLY,
  halcyon: HEADER_HALCYON,
}

/**
 * Fixed footer HTML - agent cards, social links, legal
 */
const FOOTER_HTML = `<table style="width: 100%; max-width: 600px; background-color: #000000; padding: 20px; font-family: Arial, sans-serif; color: #ffffff; border-collapse: collapse; -webkit-font-smoothing: antialiased;">

  <!-- Website URL Row -->
  <tr>
    <td colspan="2" style="padding: 20px 10px 4px 10px; background-color: #ffffff;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: middle;">
            <div style="border-top: 1px solid #A8904E;"></div>
          </td>
          <td style="text-align: center; vertical-align: middle; white-space: nowrap; padding: 0 12px;">
            <a href="https://www.portergoldberg.com" style="text-decoration: none;">
              <span style="font-size: 18px; font-weight: bold; letter-spacing: 3px; color: #A8904E; text-transform: uppercase;">PORTERGOLDBERG.COM</span>
            </a>
          </td>
          <td style="width: 50%; vertical-align: middle;">
            <div style="border-top: 1px solid #A8904E;"></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Agent Row -->
  <tr>
    <td style="padding: 10px; vertical-align: middle; width: 50%; border-top: 1px solid #444444; border-bottom: 1px solid #444444;">
      <table style="border-collapse: collapse;">
        <tr>
          <td style="padding-right: 12px; vertical-align: middle;">
            <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20Headshot%20-%20sporter.png" alt="Samantha Porter" width="60" style="display: block;">
          </td>
          <td style="vertical-align: middle;">
            <p style="margin: 0; font-size: 15px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #ffffff;">Samantha Porter</p>
            <p style="margin: 0; font-size: 13px; color: #ffffff;">Vice President, Sales</p>
            <p style="margin: 0; font-size: 13px;">
              <a href="tel:7739887898" style="color: #ffffff; text-decoration: none;"><span style="color: #ffffff;">773-988-7898</span></a>
            </p>
            <p style="margin: 0; font-size: 13px;">
              <a href="mailto:samantha@portergoldberg.com" style="color: #ffffff; text-decoration: none;"><span style="color: #ffffff;">samantha@portergoldberg.com</span></a>
            </p>
          </td>
        </tr>
      </table>
    </td>
    <td style="padding: 10px; vertical-align: middle; width: 50%; border-top: 1px solid #444444; border-bottom: 1px solid #444444; text-align: right;">
      <table style="border-collapse: collapse; margin-left: auto;">
        <tr>
          <td style="vertical-align: middle; text-align: right; padding-right: 12px;">
            <p style="margin: 0; font-size: 15px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #ffffff;">Lauren Goldberg</p>
            <p style="margin: 0; font-size: 13px; color: #ffffff;">Vice President, Sales</p>
            <p style="margin: 0; font-size: 13px;">
              <a href="tel:7735760053" style="color: #ffffff; text-decoration: none;"><span style="color: #ffffff;">773-576-0053</span></a>
            </p>
            <p style="margin: 0; font-size: 13px;">
              <a href="mailto:lauren@portergoldberg.com" style="color: #ffffff; text-decoration: none;"><span style="color: #ffffff;">lauren@portergoldberg.com</span></a>
            </p>
          </td>
          <td style="vertical-align: middle;">
            <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20Headshot%20-%20lgoldberg.png" alt="Lauren Goldberg" width="60" style="display: block;">
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Logo / Social Row -->
  <tr>
    <td colspan="2" style="padding: 14px 10px; border-bottom: 1px solid #444444;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle; text-align: center; width: 50%;">
            <a href="https://www.portergoldberg.com" style="text-decoration: none; display: inline-block; vertical-align: middle;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20PGJameson%20logo.png" alt="PorterGoldberg Residential" height="124" style="display: block; border: none;">
            </a>
          </td>
          <td style="vertical-align: middle; width: 50%;">
            <table style="border-collapse: collapse; margin-left: auto; margin-right: 15px;">
              <tr>
                <td style="padding: 4px 0;">
                  <a href="https://www.instagram.com/portergoldbergchicago" style="text-decoration: none; display: block;">
                    <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Instagram_Glyph_White.png" alt="Instagram" width="20" height="20" style="display: inline-block; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 13px; vertical-align: middle; margin-left: 8px;">@portergoldbergchicago</span>
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">
                  <a href="https://www.facebook.com/PorterGoldbergResidential" style="text-decoration: none; display: block;">
                    <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Facebook_Logo_Secondary.png" alt="Facebook" width="20" height="20" style="display: inline-block; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 13px; vertical-align: middle; margin-left: 8px;">PorterGoldberg Residential</span>
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">
                  <a href="https://www.youtube.com/@PorterGoldbergResidential" style="text-decoration: none; display: block;">
                    <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20YouTube%20Logo.png" alt="YouTube" width="20" height="20" style="display: inline-block; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 13px; vertical-align: middle; margin-left: 8px;">@PorterGoldbergResidential</span>
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Legal Disclaimer Row -->
  <tr>
    <td colspan="2" style="padding: 12px 10px;">
      <p style="margin: 0; font-size: 10px; color: #ffffff; line-height: 1.4; text-align: center; -webkit-font-smoothing: antialiased;">
        &copy; 2026 Sotheby's International Realty&reg; and the Sotheby's International Realty Logo are service marks licensed to Sotheby's International Realty Affiliates LLC and used with permission. Jameson Sotheby's International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby's International Realty Affiliates LLC nor any of its affiliated companies.
      </p>
    </td>
  </tr>

</table>`

/**
 * Generates sections HTML for the newsletter.
 * Returns just the sections - header/footer handled separately in HubSpot.
 * Forces alternating layouts: even index = image-left, odd index = image-right
 */
export function generateSectionsHtml(sections: NewsletterSection[]): string {
  const sectionsHtml = sections
    .map((section, index) => {
      // Force alternating layout regardless of what's stored in Sanity
      const alternatingSection: NewsletterSectionWithLayout = {
        ...section,
        layout: index % 2 === 0 ? 'image-left' : 'image-right',
      }
      return renderSectionEmail(alternatingSection)
    })
    .join('\n')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:0 24px;">
    <tr><td style="padding-top:38px;">
${sectionsHtml}
    </td></tr>
  </table>`
}

/**
 * Generates a "View on Website" link section
 */
function viewOnWebsiteHtml(slug: string): string {
  const url = `https://www.portergoldberg.com/newsletters/${slug}`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:0 12px;">
    <tr><td style="padding:0px 0 4px 0; text-align:center;">
      <a href="${url}" target="_blank" style="${FONT} font-size:14px; color:${INK}; text-decoration:none;">View this newsletter on our website</a>
    </td></tr>
  </table>`
}

/**
 * Generates full newsletter HTML including fixed header and footer.
 * @param sections - Newsletter content sections
 * @param slug - Optional slug for "View on Website" link
 * @param type - Newsletter type: 'weekly' (default) or 'halcyon'
 */
export function generateNewsletterEmailHtml(
  sections: NewsletterSection[],
  slug?: string,
  type: NewsletterType = 'weekly'
): string {
  const header = HEADERS[type]
  const viewOnWebsite = slug ? viewOnWebsiteHtml(slug) : ''
  return `${header}
${generateSectionsHtml(sections)}
${viewOnWebsite}
${FOOTER_HTML}`
}

