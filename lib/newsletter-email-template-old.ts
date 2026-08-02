/**
 * Newsletter email template generator for HubSpot.
 * Simple stacked layout - image on top, text below.
 * - 100% width sections for consistent desktop and mobile experience
 * - MSO conditional comments for Outlook
 * - fixed px heading size (see TITLE_SIZE)
 */

export interface NewsletterSection {
  heading: string // e.g. "FEATURED PROFESSIONAL" - parsed into eyebrow + title
  imageUrl: string
  imageAlt?: string
  imageHotspot?: { x: number; y: number } // Focal point from Sanity (0-1 range)
  imageCrop?: { top: number; bottom: number; left: number; right: number } // Crop from Sanity (0-1 range)
  imageDimensions?: { width: number; height: number } // Original image dimensions for crop calculation
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

// The heading size is FIXED, not responsive, and that is deliberate.
//
// The previous clamp(19.5px,5.2vw,32px) failed in every real client, for one reason:
// vw does not resolve against the width you expect.
//   - HubSpot preview and Gmail desktop: wide viewport, so vw pinned the size to the
//     32px ceiling.
//   - Gmail on Android: the WebView lays out at a wide virtual viewport and scales
//     the result down, so vw hit the 32px ceiling there too.
// vw never actually produced a small size in a mail client -- only in a browser
// resized by hand, which is what made it look correct in local testing.
//
// The heading no longer sits beside a rule, so its width does not have to be
// predicted and these can be changed freely. A heading too wide for the column simply
// wraps to a second line now; it can no longer push the table past the content edge.
//
// The two words are deliberately DIFFERENT sizes, matching the original Adobe
// artwork: "LOCAL" small beside "EVENTS" large, roughly 2:1. An earlier revision set
// LABEL_SIZE = TITLE_SIZE, which flattened that contrast and is a large part of why
// the emailed version stopped resembling the designed one. Values below are measured
// off the Adobe reference, normalised to a 600px email width.
//
// At these sizes two of the ~50 headings in Sanity ("FEATURED PROFESSIONAL" and
// "FEATURED PROFESSIONALS") exceed 393px and wrap on a narrow phone. That is a
// deliberate trade: shrinking every heading to keep those two on one line would cost
// the contrast on all the others.
const HEADING_LARGE_PX = 30
const HEADING_SMALL_PX = 16
const TITLE_SIZE = `font-size:${HEADING_LARGE_PX}px;`
const LABEL_SIZE = `font-size:${HEADING_SMALL_PX}px;`
const BODY_SIZE = 'font-size:15px;font-size:clamp(14px,3.9vw,16px);'

// Note: Body text should be ~300 characters max for optimal layout

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
 * Renders the section heading: eyebrow + title, alternating left / right / left down
 * the stack (generateSectionsHtml assigns image-left to even indexes, image-right to
 * odd ones).
 *
 * There is deliberately NO rule beside the text. The rule used to share this row,
 * which required one cell to absorb the leftover space -- and Gmail does not honour
 * width:100% on a <td>, so that cell collapsed to a ~1px dot while the text cell
 * swelled to fill the row and inherited the align="center" cascading from the
 * <td align="center"> wrapper in generateSectionsHtml. Headings rendered centred no
 * matter what the cell order was.
 *
 * Working around that meant pinning the text cell to a width estimated from font
 * metrics, which in turn forced a fixed heading size and made every new heading a
 * potential overflow. Dropping the rule removes the entire chain: a single full-width
 * cell has no leftover space to negotiate, alignment cannot collapse, nothing has to
 * be predicted, and a long heading simply wraps instead of shoving the table past the
 * content column.
 */
function sectionHeadHtml(section: NewsletterSectionWithLayout): string {
  const layout = section.layout
  const { eyebrow, title } = parseHeading(section.heading)

  // Use titleLarger if set, otherwise fall back to layout-based alternation
  const isTitleLarger = section.titleLarger !== undefined
    ? section.titleLarger
    : layout === 'image-right'

  // Build text spans - always eyebrow then title order
  // vertical-align:middle ensures text is vertically centered with each other
  const eyebrowStyle = isTitleLarger
    ? `${HEADING_FONT}${LABEL_SIZE}font-weight:400;letter-spacing:0.14em;color:${INK};text-transform:uppercase;vertical-align:middle;`
    : `${HEADING_FONT}${TITLE_SIZE}font-weight:400;letter-spacing:0.10em;color:${INK};text-transform:uppercase;vertical-align:middle;`

  const titleStyle = isTitleLarger
    ? `${HEADING_FONT}${TITLE_SIZE}font-weight:400;letter-spacing:0.06em;color:${INK};text-transform:uppercase;vertical-align:middle;`
    : `${HEADING_FONT}${LABEL_SIZE}font-weight:400;letter-spacing:0.14em;color:${INK};text-transform:uppercase;vertical-align:middle;`

  const eyebrowSpan = eyebrow ? `<span style="${eyebrowStyle}">${esc(eyebrow.toUpperCase())}</span>` : ''
  const titleSpan = `<span style="${titleStyle}">${esc(title.toUpperCase())}</span>`
  const gap = eyebrow ? '<span style="display:inline-block;width:9px;"></span>' : ''

  const textAlign = layout === 'image-right' ? 'right' : 'left'

  // Fully div-based heading - no tables needed
  // word-break:normal prevents HubSpot's injected word-break:break-word from
  // fracturing headings mid-word
  return `<div style="margin:0 0 12px 0;text-align:${textAlign};word-break:normal;">${eyebrowSpan}${gap}${titleSpan}</div><div style="height: 2px; background-color: #000000; font-size: 1px; line-height: 1px;">&nbsp;</div>`
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

// Enforced aspect ratio for default layout: 509x454 (roughly 9:8)
// For email, we scale up to 600px width while maintaining ratio
const EMAIL_WIDTH = 600
const EMAIL_HEIGHT = Math.round(EMAIL_WIDTH * (454 / 509)) // 535

// Enforced aspect ratio for stacked layout: 3:2 landscape (600x400)
// MUST stay in sync with ASPECT.stacked in components/newsletter/SectionImage.tsx
// and .pg-newsletter-section-image--stacked in styles/globals.css
const STACKED_WIDTH = 600
const STACKED_HEIGHT = Math.round(STACKED_WIDTH * (2 / 3)) // 400

/**
 * Optimizes Sanity image URL with enforced aspect ratio, crop, and hotspot
 * - Enforces 509:454 aspect ratio at 600px width (600x535)
 * - q=80: slight quality reduction for smaller file size
 * - auto=format: serves webp where supported
 * - rect=x,y,w,h: applies manual crop from Sanity first
 * - fit=crop: enforces aspect ratio
 * - crop=focalpoint/center: uses hotspot or centers
 */
function optimizeSanityImageUrl(
  url: string,
  hotspot?: { x: number; y: number },
  crop?: { top: number; bottom: number; left: number; right: number },
  dimensions?: { width: number; height: number }
): string {
  if (!url.includes('cdn.sanity.io')) return url

  const params: string[] = [`w=${EMAIL_WIDTH}`, `h=${EMAIL_HEIGHT}`, 'q=80', 'auto=format', 'fit=crop']

  // Apply manual crop first if set (rect is applied before fit=crop)
  if (crop && dimensions) {
    const rectX = Math.round(crop.left * dimensions.width)
    const rectY = Math.round(crop.top * dimensions.height)
    const rectW = Math.round(dimensions.width * (1 - crop.left - crop.right))
    const rectH = Math.round(dimensions.height * (1 - crop.top - crop.bottom))
    params.push(`rect=${rectX},${rectY},${rectW},${rectH}`)
  }

  // Use hotspot as focal point for the aspect ratio crop
  if (hotspot) {
    params.push('crop=focalpoint', `fp-x=${hotspot.x}`, `fp-y=${hotspot.y}`)
  } else {
    params.push('crop=center')
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params.join('&')}`
}

/**
 * Optimizes Sanity image URL for stacked layout with 3:2 aspect ratio
 */
function optimizeSanityImageUrlStacked(
  url: string,
  hotspot?: { x: number; y: number },
  crop?: { top: number; bottom: number; left: number; right: number },
  dimensions?: { width: number; height: number }
): string {
  if (!url.includes('cdn.sanity.io')) return url

  const params: string[] = [`w=${STACKED_WIDTH}`, `h=${STACKED_HEIGHT}`, 'q=80', 'auto=format', 'fit=crop']

  // Apply manual crop first if set (rect is applied before fit=crop)
  if (crop && dimensions) {
    const rectX = Math.round(crop.left * dimensions.width)
    const rectY = Math.round(crop.top * dimensions.height)
    const rectW = Math.round(dimensions.width * (1 - crop.left - crop.right))
    const rectH = Math.round(dimensions.height * (1 - crop.top - crop.bottom))
    params.push(`rect=${rectX},${rectY},${rectW},${rectH}`)
  }

  // Use hotspot as focal point for the aspect ratio crop
  if (hotspot) {
    params.push('crop=focalpoint', `fp-x=${hotspot.x}`, `fp-y=${hotspot.y}`)
  } else {
    params.push('crop=center')
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params.join('&')}`
}

/**
 * Renders section content in a simple stacked layout
 * - Image on top, text below, links at bottom
 * - 100% width for both desktop and mobile
 */
function sectionBlockHtml(section: NewsletterSectionWithLayout): string {
  const alt = section.imageAlt || section.heading
  const anchorStyle = `text-decoration:none;`

  const linkHtml = sectionLinkHtml(section.linkUrl, section.instagram, section.facebookHandle)

  // Image content - optimize Sanity URLs for email (with crop and hotspot if available)
  const optimizedImageUrl = section.imageUrl
    ? optimizeSanityImageUrl(section.imageUrl, section.imageHotspot, section.imageCrop, section.imageDimensions)
    : ''
  let imageHtml = optimizedImageUrl
    ? `<img src="${esc(optimizedImageUrl)}" alt="${esc(alt)}" width="600" style="border:0;display:block;height:auto;width:100%;max-width:600px;">`
    : `<div style="display:block;width:100%;aspect-ratio:1/1;background-color:#1a1a1a;"></div>`

  const imageContentLink = [section.linkUrl, section.email, section.instagram, section.facebookHandle].find(item => item)

  if (imageContentLink) {
    imageHtml = `<a href="${esc(imageContentLink)}" target="_blank" style="${anchorStyle}">${imageHtml}</a>`
  }

  // Text content
  let sectionBody = paragraphsHtml(section.body)
  if (imageContentLink) {
    sectionBody = `<a href="${esc(imageContentLink)}" target="_blank" style="${anchorStyle}">${sectionBody}</a>`
  }

  // Stacked layout: image, then text, then links
  const imageRow = `<div style="width:100%;margin:0 0 12px 0;">${imageHtml}</div>`
  const textRow = `<div style="width:100%;text-align:left;">${sectionBody}</div>`
  const linksRow = `<div style="margin:8px 0 0 0;font-size:16px;line-height:1.6;text-align:left;">${linkHtml}</div>`

  // MSO table for Outlook
  const msoStart = `<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="100%" valign="top"><![endif]-->`
  const msoEnd = `<!--[if mso]></td></tr></table><![endif]-->`

  return `<div style="width:100%;margin:0 0 34px 0;">
  ${msoStart}
  ${imageRow}
  ${textRow}
  ${linksRow}
  ${msoEnd}
</div>`
}

function renderSectionEmail(section: NewsletterSectionWithLayout): string {
  return `${sectionHeadHtml(section)}
${sectionBlockHtml(section)}`
}

/**
 * Renders section in stacked layout: Title → Image → Content → Links
 * - Heading above image (no rule/line beside heading)
 * - Image: 600x400 (3:2 aspect ratio)
 * - Content in centered 550px column
 * - Fully div-based (no tables except MSO conditionals for Outlook)
 */
function renderSectionEmailStacked(section: NewsletterSectionWithLayout): string {
  const alt = section.imageAlt || section.heading
  const anchorStyle = `text-decoration:none;`

  const linkHtml = sectionLinkHtml(section.linkUrl, section.instagram, section.facebookHandle)

  // Image content - uses stacked aspect ratio (600:400)
  const optimizedImageUrl = section.imageUrl
    ? optimizeSanityImageUrlStacked(section.imageUrl, section.imageHotspot, section.imageCrop, section.imageDimensions)
    : ''
  let imageElement = optimizedImageUrl
    ? `<img src="${esc(optimizedImageUrl)}" alt="${esc(alt)}" width="600" style="border:0;display:block;height:auto;width:100%;max-width:600px;">`
    : `<div style="display:block;width:100%;aspect-ratio:1/1;background-color:#1a1a1a;"></div>`

  const imageContentLink = [section.linkUrl, section.email, section.instagram, section.facebookHandle].find(item => item)

  if (imageContentLink) {
    imageElement = `<a href="${esc(imageContentLink)}" target="_blank" style="${anchorStyle}">${imageElement}</a>`
  }

  // Text content
  let sectionBody = paragraphsHtml(section.body)
  if (imageContentLink) {
    sectionBody = `<a href="${esc(imageContentLink)}" target="_blank" style="${anchorStyle}">${sectionBody}</a>`
  }

  // Stacked layout: heading → image → content (all full-width, no tables)
  const headingHtml = section.heading ? sectionHeadHtml(section) : ''
  const imageHtml = `<div style="width:100%;margin:0 0 12px 0;">${imageElement}</div>`

  // Content wrapper: 550px wide, centered with 25px padding on each side
  const contentStyle = `max-width:550px;margin:0 auto;padding:0 25px;`
  const textHtml = `<div style="text-align:left;">${sectionBody}</div>`
  const linksHtml = linkHtml ? `<div style="margin:8px 0 0 0;font-size:16px;line-height:1.6;text-align:left;">${linkHtml}</div>` : ''

  const msoStart = `<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="100%" valign="top"><![endif]-->`
  const msoEnd = `<!--[if mso]></td></tr></table><![endif]-->`

  return `<div style="width:100%;margin:0 0 34px 0;">
  ${msoStart}
  ${headingHtml}
  ${imageHtml}
  <div style="${contentStyle}">
    ${textHtml}
    ${linksHtml}
  </div>
  ${msoEnd}
</div>`
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
export type NewsletterLayout = 'default' | 'stacked'

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
        &copy; 2026 Sotheby&rsquo;s International Realty&reg; and the Sotheby&rsquo;s International Realty Logo are service marks licensed to Sotheby&rsquo;s International Realty Affiliates LLC and used with permission. Jameson Sotheby&rsquo;s International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby&rsquo;s International Realty Affiliates LLC nor any of its affiliated companies.
      </p>
    </td>
  </tr>

</table>`

/**
 * Generates sections HTML for the newsletter.
 * Returns just the sections - header/footer handled separately in HubSpot.
 * @param layout - 'default' (title above image) or 'stacked' (image, then title below)
 */
export function generateSectionsHtml(sections: NewsletterSection[], layout: NewsletterLayout = 'default'): string {
  const sectionsHtml = sections
    .map((section, index) => {
      // Force alternating layout regardless of what's stored in Sanity
      const alternatingSection: NewsletterSectionWithLayout = {
        ...section,
        layout: index % 2 === 0 ? 'image-left' : 'image-right',
      }
      // Use stacked renderer if layout is 'stacked'
      return layout === 'stacked'
        ? renderSectionEmailStacked(alternatingSection)
        : renderSectionEmail(alternatingSection)
    })
    .join('\n\n')

  // Wrap in content container
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-collapse:collapse;">
<tr><td align="center" style="padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 0 8px 0;background-color:#ffffff;">
<div style="max-width:600px;margin-bottom:32px;padding:0px 0 0px 0;text-align:center;background-color:#ffffff;">
  <hr/>
  <p style="margin:18px 19px 22px 20 px;${FONT}font-size:14px;font-style:italic;color:${INK};">Market updates, tips, and insights from Lauren and Samantha</p>
  <hr/>
</div>

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
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
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
 * @param layout - 'default' (title above image) or 'stacked' (image, then title below)
 */
export function generateNewsletterEmailHtml(
  sections: NewsletterSection[],
  slug?: string,
  type: NewsletterType = 'weekly',
  previewText?: string,
  layout: NewsletterLayout = 'default'
): string {
  const header = HEADERS[type]
  const viewOnWebsite = slug ? viewOnWebsiteHtml(slug) : ''
  const preheader = previewText ? preheaderHtml(previewText) : ''

  // Outer wrapper table for email background
  return `${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e9e7e2;border-collapse:collapse;">
<tr><td align="center" style="padding:0;">

${header}
${generateSectionsHtml(sections, layout)}
${viewOnWebsite}
${FOOTER_HTML}

</td></tr>
</table>`
}
