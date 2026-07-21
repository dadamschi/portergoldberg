/**
 * Newsletter email template generator for HubSpot.
 * Uses fluid-hybrid technique for responsive layouts without media queries.
 * - inline-block + max-width for auto-stacking columns
 * - dir="rtl" for image-right sections
 * - MSO conditional comments for Outlook
 * - clamp() for responsive font sizes
 */

export interface NewsletterSection {
  heading: string // e.g. "FEATURED PROFESSIONAL" - parsed into eyebrow + title
  imageUrl: string
  imageAlt?: string
  body: string
  caption?: string
  linkUrl?: string
  instagram?: string // Instagram handle (with or without @)
  facebookHandle?: string
  email?: string
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
const GOLD = '#A8904E'
const FONT = 'font-family:Helvetica,Arial,sans-serif;'
const HEADING_FONT = "font-family:'Century Gothic',Helvetica,Arial,sans-serif;"

// Responsive font sizes using clamp()
const TITLE_SIZE = 'font-size:25px;font-size:clamp(18px,6.2vw,25px);'
const LABEL_SIZE = 'font-size:16px;font-size:clamp(13px,4vw,16px);'
const BODY_SIZE = 'font-size:15px;font-size:clamp(14px,3.9vw,16px);'

// Column width for fluid-hybrid
const COL_WIDTH = 250
const GAP_WIDTH = 18

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

function paragraphsHtml(body: string): string {
  const paragraphs = body.split('\n\n').filter(Boolean)
  return paragraphs
    .map(
      (line, i, arr) =>
        `<p style="margin:0 0 ${i === arr.length - 1 ? 0 : 12}px 0;${FONT}${BODY_SIZE}font-weight:500;line-height:1.55;color:${INK};">${typographic(line)}</p>`
    )
    .join('')
}

/**
 * Renders section heading with eyebrow + title and horizontal line
 * Line position depends on layout: image-left = line on right, image-right = line on left
 */
function sectionHeadHtml(section: NewsletterSectionWithLayout): string {
  const layout = section.layout
  const { eyebrow, title } = parseHeading(section.heading)

  // Use titleLarger if set, otherwise fall back to layout-based alternation
  const isTitleLarger = section.titleLarger !== undefined
    ? section.titleLarger
    : layout === 'image-right'

  // Build text spans - always eyebrow then title order
  const eyebrowStyle = isTitleLarger
    ? `${HEADING_FONT}${LABEL_SIZE}font-weight:400;letter-spacing:0.14em;color:${INK};text-transform:uppercase;`
    : `${HEADING_FONT}${TITLE_SIZE}font-weight:400;letter-spacing:0.10em;color:${INK};text-transform:uppercase;`

  const titleStyle = isTitleLarger
    ? `${HEADING_FONT}${TITLE_SIZE}font-weight:400;letter-spacing:0.06em;color:${INK};text-transform:uppercase;`
    : `${HEADING_FONT}${LABEL_SIZE}font-weight:400;letter-spacing:0.14em;color:${INK};text-transform:uppercase;`

  const eyebrowSpan = eyebrow ? `<span style="${eyebrowStyle}">${esc(eyebrow.toUpperCase())}</span>` : ''
  const titleSpan = `<span style="${titleStyle}">${esc(title.toUpperCase())}</span>`
  const gap = eyebrow ? '<span style="display:inline-block;width:9px;"></span>' : ''

  const textCell = `<td valign="middle" style="white-space:nowrap;vertical-align:middle;">${eyebrowSpan}${gap}${titleSpan}</td>`
  const lineCell = layout === 'image-right'
    ? `<td width="100%" valign="middle" style="width:100%;vertical-align:middle;padding-right:16px;"><div style="border-top:2px solid ${INK};font-size:1px;line-height:1px;">&nbsp;</div></td>`
    : `<td width="100%" valign="middle" style="width:100%;vertical-align:middle;padding-left:16px;"><div style="border-top:2px solid ${INK};font-size:1px;line-height:1px;">&nbsp;</div></td>`

  const cells = layout === 'image-right'
    ? `${lineCell}${textCell}` // Line on left, text on right
    : `${textCell}${lineCell}` // Text on left, line on right

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px 0;">
  <tr>${cells}</tr>
</table>`
}

/**
 * Renders link text below the image (URL or Instagram)
 */
function sectionLinkHtml(linkUrl?: string, instagram?: string, facebookHandle?: string): string {
  const linkStyle = `${FONT}font-size:16px;line-height:1.6;color:${GOLD};font-weight:500;`
  const anchorStyle = `color:${GOLD};text-decoration:none;`
  let linkHtml = ''

  if (instagram) {
    const handle = instagram.replace('@', '')
    linkHtml = `<p style="margin:0px 0 0 0;${linkStyle}"><a href="https://instagram.com/${esc(handle)}" target="_blank" style="${anchorStyle}">IG: @${esc(handle)}</a></p>`
  }

    if (facebookHandle) {
    const handle = facebookHandle.replace('@', '')
    linkHtml += `<p style="margin:0px 0 0 0;${linkStyle}"><a href="https://facebook.com/${esc(facebookHandle)}" target="_blank" style="${anchorStyle}">FB: ${esc(handle)}</a></p>`
  }

  if (linkUrl) {
    if (linkUrl.startsWith('#contact:')) {
      const subject = linkUrl.replace('#contact:', '')
      const mailtoUrl = `mailto:info@portergoldberg.com?subject=${encodeURIComponent(subject)}`
      linkHtml += `<p style="margin:0px 0 0 0;${linkStyle}"><a href="${mailtoUrl}" style="${anchorStyle}">Contact Us &rarr;</a></p>`
    } else {
      // Display URL or "Learn More" for internal links
      let linkText = linkUrl
      if (linkUrl.startsWith('/') || linkUrl.includes('portergoldberg.com')) {
        linkText = 'Learn More &rarr;'
      } else if (linkUrl.length > 40) {
        linkText = 'Learn More'
      }
      linkHtml += `<p style="margin:0px 0 0 0;${linkStyle}"><a href="${esc(linkUrl)}" target="_blank" style="${anchorStyle}">${linkText}</a></p>`
    }
  }

  return linkHtml
}

/**
 * Renders section content using fluid-hybrid technique
 * - inline-block columns auto-stack on narrow screens
 * - dir="rtl" on wrapper flips columns for image-right
 * - MSO comments ensure proper Outlook rendering
 */
function sectionBlockHtml(section: NewsletterSectionWithLayout): string {
  const layout = section.layout
  const alt = section.imageAlt || section.heading
  const isImageRight = layout === 'image-right'
  const anchorStyle = `text-decoration:none;`
  
  const linkHtml = sectionLinkHtml(section.linkUrl, section.instagram, section.facebookHandle)

  // Image column content - width:100% so it fills container (250px on desktop, 100% on mobile)
  let imageHtml = section.imageUrl
    ? `<img src="${esc(section.imageUrl)}" alt="${esc(alt)}" width="100%" style="display:block;width:100%;height:auto;">`
    : `<div style="display:block;width:100%;aspect-ratio:1/1;background-color:#1a1a1a;"></div>`

  const imageContentLink = [section.linkUrl, section.email, section.instagram, section.facebookHandle].find(item => item);

  if (imageContentLink) {
    imageHtml = `<a href="${esc(imageContentLink)}" target="_blank" style="${anchorStyle}">${imageHtml}</a>`
  }

  // Image column - for image-right, margin-left creates gap (matches original template)
  const imageMargin = isImageRight ? `margin:0 0 0 ${GAP_WIDTH}px;` : ''
  const imageCol = `<div${isImageRight ? ' dir="ltr"' : ''} style="display:inline-block;vertical-align:middle;width:${COL_WIDTH}px;max-width:100%;${imageMargin}">
    ${imageHtml}
  </div>`

  // Text column
  let sectionBody = paragraphsHtml(section.body)
  if (imageContentLink) {
    sectionBody = `<a href="${esc(imageContentLink)}" target="_blank" style="${anchorStyle}">${sectionBody}</a>`
  }
  const textCol = `<div${isImageRight ? ' dir="ltr"' : ''} style="display:inline-block;vertical-align:middle;width:${COL_WIDTH}px;max-width:100%;text-align:left;">
    ${sectionBody}
  </div>`

  // Links row - for image-right, use two divs to align links under image
  const rightImageLinksHtml = `<div dir="ltr" style="display:inline-block;vertical-align:top;width:${COL_WIDTH}px;max-width:100%;text-align:left;margin:8px 0 0 ${GAP_WIDTH}px;">${linkHtml}</div><!--
  --><div style="display:inline-block;vertical-align:top;width:${COL_WIDTH}px;max-width:100%;"></div>`
  const leftImageLinksHtml = `<div style="margin:8px 0 0 0;">${linkHtml}</div>`
  const linksRow = isImageRight ? rightImageLinksHtml : leftImageLinksHtml

  // MSO table structure for Outlook
  const msoStart = `<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="${COL_WIDTH}" valign="middle"><![endif]-->`
  const msoMiddle = `<!--[if mso]></td><td width="${GAP_WIDTH}"></td><td width="${COL_WIDTH}" valign="middle"><![endif]-->`
  const msoEnd = `<!--[if mso]></td></tr></table><![endif]-->`

  // Wrapper with optional dir="rtl" for image-right
  // text-align:right for image-right pushes image to right edge (text column has its own text-align:left)
  const dirAttr = isImageRight ? ' dir="rtl"' : ''
  const textAlign = isImageRight ? 'text-align:right;' : 'text-align:left;'

  // Spacer div - creates gap on desktop for image-left sections only (image-right uses margin)
  const spacerCol = isImageRight ? '' : `<div style="display:inline-block;vertical-align:middle;width:${GAP_WIDTH}px;max-width:100%;">&nbsp;</div>`

  return `<div${dirAttr} style="font-size:0;line-height:0;margin:0 0 34px 0;${textAlign}">
  ${msoStart}
  ${imageCol}<!--
  -->${spacerCol}<!--
  -->${msoMiddle}<!--
  -->${textCol}
  ${linksRow}
  ${msoEnd}
</div>`
}

function renderSectionEmail(section: NewsletterSectionWithLayout): string {
  return `${sectionHeadHtml(section)}
${sectionBlockHtml(section)}`
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
 * Note: This is typically static in HubSpot, not dynamically generated
 */
const HEADER_WEEKLY = `<a href="https://www.portergoldberg.com/newsletters" target="_blank" style="text-decoration:none;display:block;">
  <img src="https://46095216.fs1.hubspotusercontent-na1.net/hubfs/46095216/Email%20Header%20Footer%20Content/ywwt-header.png" alt="Your Weekly Walk-Through — PorterGoldberg Residential" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
</a>`

export type NewsletterType = 'weekly' | 'halcyon'

const HEADERS: Record<NewsletterType, string> = {
  weekly: HEADER_WEEKLY,
  halcyon: HEADER_HALCYON,
}

/**
 * Footer HTML using fluid-hybrid technique
 * - Agent cards stack on mobile
 * - Social icons only (no text labels)
 */
const FOOTER_HTML = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#000000;border-collapse:collapse;">

  <!-- Top band: white, PORTERGOLDBERG.COM centered with gold rules -->
  <tr>
    <td style="padding:0;background-color:#ffffff;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#ffffff;border-collapse:collapse;">
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
        <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="285" valign="top"><![endif]-->
        <div style="display:inline-block;vertical-align:top;width:285px;max-width:100%;text-align:left;line-height:1.4;">
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
        --><!--[if mso]></td><td width="285" valign="top"><![endif]-->
        <div style="display:inline-block;vertical-align:top;width:285px;max-width:100%;text-align:left;line-height:1.4;">
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
        &copy; 2026 Sotheby&rsquo;s International Realty&reg; and the Sotheby&rsquo;s International Realty Logo are service marks licensed to Sotheby&rsquo;s International Realty Affiliates LLC and used with permission. Jameson Sotheby&rsquo;s International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby&rsquo;s International Realty Affiliates LLC nor any of its affiliated companies.
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
    .join('\n\n')

  // Wrap in content container
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-collapse:collapse;">
<tr><td align="center" style="padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 18px 8px 18px;background-color:#ffffff;">

${sectionsHtml}

</div>
</td></tr>
</table>`
}

/**
 * Generates a "View on Website" link section
 */
function viewOnWebsiteHtml(slug: string): string {
  const url = `https://www.portergoldberg.com/newsletters/${slug}`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:0 18px;">
    <tr><td style="padding:0 0 16px 0;text-align:center;">
      <a href="${url}" target="_blank" style="${FONT}font-size:14px;color:${INK};text-decoration:none;">View this newsletter on our website</a>
    </td></tr>
  </table>`
}

/**
 * Generates preheader (hidden preview text)
 */
function preheaderHtml(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#e9e7e2;">
  ${typographic(text)}
</div>`
}

/**
 * Generates full newsletter HTML including fixed header and footer.
 * @param sections - Newsletter content sections
 * @param slug - Optional slug for "View on Website" link
 * @param type - Newsletter type: 'weekly' (default) or 'halcyon'
 * @param previewText - Optional preheader/preview text
 */
export function generateNewsletterEmailHtml(
  sections: NewsletterSection[],
  slug?: string,
  type: NewsletterType = 'weekly',
  previewText?: string
): string {
  const header = HEADERS[type]
  const viewOnWebsite = slug ? viewOnWebsiteHtml(slug) : ''
  const preheader = previewText ? preheaderHtml(previewText) : ''

  // Outer wrapper table for email background
  return `${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e9e7e2;border-collapse:collapse;">
<tr><td align="center" style="padding:0;">

${header}
${generateSectionsHtml(sections)}
${viewOnWebsite}
${FOOTER_HTML}

</td></tr>
</table>`
}
