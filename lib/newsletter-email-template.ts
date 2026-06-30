/**
 * Newsletter email template generator for HubSpot.
 * Generates email-client-safe HTML with inline styles and table layout.
 */

export interface NewsletterSection {
  heading: string // e.g. "FEATURED PROFESSIONAL" - parsed into eyebrow + title
  layout: 'image-left' | 'image-right'
  imageUrl: string
  imageAlt?: string
  body: string
  caption?: string
  linkUrl?: string
}

/**
 * Parse heading into eyebrow (first word) and title (rest)
 * e.g. "FEATURED PROFESSIONAL" -> { eyebrow: "FEATURED", title: "PROFESSIONAL" }
 */
function parseHeading(heading: string): { eyebrow: string; title: string } {
  const parts = heading.trim().split(/\s+/)
  if (parts.length === 1) {
    return { eyebrow: '', title: parts[0] }
  }
  return { eyebrow: parts[0], title: parts.slice(1).join(' ') }
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
        `<p style="margin:0 0 ${i === arr.length - 1 ? 0 : 14}px 0; ${FONT} font-size:15px; line-height:1.55; color:${INK};">${typographic(line)}</p>`
    )
    .join('')
}

function captionHtml(caption: string | undefined): string {
  if (!caption) return ''
  const lines = caption.split('\n').filter(Boolean)
  return `<p style="margin:10px 0 0 0; ${FONT} font-size:13px; line-height:1.4; color:${INK}; text-align:left;">${lines.map(typographic).join('<br>')}</p>`
}

function ruleCell(): string {
  return `<td width="100%" valign="middle" style="width:100%; vertical-align:middle;"><div style="border-top:1px solid ${LINE}; font-size:1px; line-height:1px;">&nbsp;</div></td>`
}

function sectionHeadHtml(section: NewsletterSection): string {
  const layout = section.layout
  const { eyebrow, title } = parseHeading(section.heading)
  const eyebrowTd = eyebrow
    ? `<td valign="middle" style="${FONT} font-size:13px; letter-spacing:2px; color:${INK}; white-space:nowrap; padding:0 12px; vertical-align:middle; text-transform:uppercase;">${esc(eyebrow.toUpperCase())}</td>`
    : ''
  const titleTd = `<td valign="middle" style="${FONT} font-size:26px; letter-spacing:1px; color:${INK}; white-space:nowrap; padding:0 12px; vertical-align:middle; text-transform:uppercase;">${esc(title.toUpperCase())}</td>`

  // Keep word order consistent (eyebrow + title), only move the line
  const cells =
    layout === 'image-right'
      ? `${ruleCell()}${eyebrowTd}${titleTd}`
      : `${eyebrowTd}${titleTd}${ruleCell()}`

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px 0;">
    <tr>${cells}</tr>
  </table>`
}

function wrapInLink(content: string, url?: string): string {
  if (!url) return content
  return `<a href="${esc(url)}" target="_blank" style="color:inherit; text-decoration:none;">${content}</a>`
}

function sectionBlockHtml(section: NewsletterSection): string {
  const layout = section.layout
  const alt = section.imageAlt || section.heading
  const link = section.linkUrl

  const imageContent = `<img src="${esc(section.imageUrl)}" alt="${esc(alt)}" width="280" style="display:block; width:100%; max-width:280px; height:auto;">`

  const imageCell = `
    <td width="48%" valign="top" style="padding:0; width:48%;">
      ${wrapInLink(imageContent, link)}
      ${captionHtml(section.caption)}
    </td>`

  const textCell = `
    <td width="48%" valign="top" style="padding:0; width:48%;">
      ${wrapInLink(paragraphsHtml(section.body), link)}
    </td>`

  const spacerCell = `<td width="4%" style="width:4%; font-size:1px; line-height:1px;">&nbsp;</td>`

  const row =
    layout === 'image-right'
      ? `${textCell}${spacerCell}${imageCell}`
      : `${imageCell}${spacerCell}${textCell}`

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 34px 0;">
    <tr>${row}</tr>
  </table>`
}

function renderSectionEmail(section: NewsletterSection): string {
  return `${sectionHeadHtml(section)}${sectionBlockHtml(section)}`
}

/**
 * Fixed header HTML - logos only, no dynamic content
 */
const HEADER_HTML = `<table style="width: 100%; max-width: 600px; background-color: #000000; padding: 30px 20px; border-collapse: collapse; -webkit-font-smoothing: antialiased;">
<tbody>
<tr>
<td style="margin: auto;"><img style="display: block; padding-left: 20px" src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Halcyon%20Logo%20No%20Background.png" alt="Halcyon Development" height="50" /></td>
<td style="vertical-align: middle;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20halcyon-WHITE.png" alt="Halcyon Development Group" height="30" /></td>
<td style="vertical-align: middle; text-align: center; width: 50%; padding-left: 20px;"><img style="display: block; margin: 0 auto;" src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20PGJameson%20logo.png" alt="PorterGoldberg Residential" height="98" /></td>
</tr>
</tbody>
</table>`

/**
 * Fixed footer HTML - agent cards, social links, legal
 */
const FOOTER_HTML = `<table style="width: 100%; max-width: 600px; background-color: #000000; padding: 20px; font-family: Arial, sans-serif; color: #ffffff; border-collapse: collapse; -webkit-font-smoothing: antialiased;">

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
          <td style="vertical-align: middle; text-align: right; width: 50%;">
            <a href="https://www.instagram.com/portergoldbergchicago" style="text-decoration: none; margin-right: 16px; display: inline-block; vertical-align: middle;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Instagram_Glyph_White.png" alt="Instagram" width="20" height="20" style="display: inline-block; vertical-align: middle; padding: 5px;">
              <span style="color: #ffffff; font-size: 13px; vertical-align: middle; margin-left: 6px;">@portergoldbergchicago</span>
            </a>
            <a href="https://www.facebook.com/PorterGoldbergResidential" style="text-decoration: none; display: inline-block; vertical-align: middle;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Facebook_Logo_Secondary.png" alt="Facebook" width="20" height="20" style="display: inline-block; vertical-align: middle; padding: 5px;">
              <span style="color: #ffffff; font-size: 13px; vertical-align: middle; margin-left: 6px;">PorterGoldberg Residential</span>
            </a>
            <a href="https://www.youtube.com/@PorterGoldbergResidential" style="text-decoration: none; display: inline-block; vertical-align: middle;">
              <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Footer%20YouTube%20Logo.png" alt="YouTube" width="20" height="20" style="display: inline-block; vertical-align: middle; padding: 1px;">
              <span style="color: #ffffff; font-size: 13px; vertical-align: middle; margin-left: 6px;">@PorterGoldbergResidential</span>
            </a>
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
 */
export function generateSectionsHtml(sections: NewsletterSection[]): string {
  const sectionsHtml = sections.map(renderSectionEmail).join('\n')

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
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:0 24px;">
    <tr><td style="padding:24px 0 38px 0; text-align:center;">
      <a href="${url}" target="_blank" style="${FONT} font-size:14px; color:${INK}; text-decoration:underline;">View this newsletter on our website</a>
    </td></tr>
  </table>`
}

/**
 * Generates full newsletter HTML including fixed header and footer.
 */
export function generateNewsletterEmailHtml(sections: NewsletterSection[], slug?: string): string {
  const viewOnWebsite = slug ? viewOnWebsiteHtml(slug) : ''
  return `${HEADER_HTML}
${generateSectionsHtml(sections)}
${viewOnWebsite}
${FOOTER_HTML}`
}

/**
 * Creates a blank section with default values
 */
export function createBlankSection(index: number): NewsletterSection {
  return {
    heading: '',
    layout: index % 2 === 0 ? 'image-left' : 'image-right',
    imageUrl: '',
    imageAlt: '',
    body: '',
    caption: '',
  }
}
