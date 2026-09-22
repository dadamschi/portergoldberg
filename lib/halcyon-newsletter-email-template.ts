/**
 * Halcyon Seasonal Newsletter email template generator for HubSpot.
 * Stacked layout with maintenance checklist and care tips.
 */

import type { HalcyonNewsletter } from '../types'
import { FOOTER_HTML } from './utils/newsletter'

// Color palette
const INK = '#1A1917'
const GOLD = '#000000'
const SAGE = '#79A52C'

// Typography
const FONT = "font-family:'Quicksand',Helvetica,Arial,sans-serif;"
const HEADING_LARGE = `font-size:clamp(24px, 6vw, 36px);font-weight:600;letter-spacing:0.02em;`
const HEADING_MEDIUM = `font-size:clamp(18px, 3vw, 24px);font-weight:600;letter-spacing:0.02em;`
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

/**
 * Halcyon email header - logos only
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
 * Preheader (hidden preview text)
 */
function generatePreheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">
  ${typographic(text)}
</div>`
}

/**
 * Season emoji mapping
 */
const SEASON_EMOJI: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  fall: '🍂',
  winter: '❄️',
}

/**
 * Introduction section
 */
function generateIntroduction(intro: string, season: string): string {
  const emoji = SEASON_EMOJI[season] || '🏠'
  return `<div style="padding:32px 0 24px 0;text-align:center;">
  <p style="margin:0 0 16px 0;${HEADING_LARGE}${FONT}color:${GOLD};">${emoji} Seasonal Home Care</p>
  <p style="margin:0;${BODY_TEXT}${FONT}color:${INK};">${typographic(intro)}</p>
</div>`
}

/**
 * Maintenance checklist section
 */
function generateChecklist(items: Array<{ emoji: string; title: string; description: string }>): string {
  const checklistItems = items
    .map(
      (item) => `<div style="padding:16px 0;border-bottom:1px solid #dedbd6;">
  <p style="margin:0 0 8px 0;${HEADING_MEDIUM}${FONT}color:${GOLD};"><span style="font-size:24px;margin-right:8px;">${item.emoji}</span>${esc(item.title)}</p>
  <p style="margin:0;${BODY_TEXT}${FONT}color:${INK};">${typographic(item.description)}</p>
</div>`
    )
    .join('\n')

  return `<div style="padding:24px 0;">
  <p style="margin:0 0 16px 0;${HEADING_LARGE}${FONT}color:${GOLD};text-align:center;">Maintenance Checklist</p>
  ${checklistItems}
</div>`
}

/**
 * Content section (homeTip, didYouKnow, luxurySpotlight, etc.)
 */
function generateContentSection(title: string, content: string, icon?: string): string {
  const iconDisplay = icon ? `<span style="font-size:24px;margin-right:8px;">${icon}</span>` : ''
  return `<div style="padding:32px 0;border-top:2px solid ${SAGE};">
  <p style="margin:0 0 12px 0;${HEADING_MEDIUM}${FONT}color:${GOLD};">${iconDisplay}${esc(title)}</p>
  <p style="margin:0;${BODY_TEXT}${FONT}color:${INK};">${typographic(content)}</p>
</div>`
}

/**
 * Looking ahead section
 */
function generateLookingAhead(text: string): string {
  return `<div style="padding:24px 0;text-align:center;border-top:1px solid #dedbd6;">
  <p style="margin:0 0 8px 0;${HEADING_MEDIUM}${FONT}color:${GOLD};">Looking Ahead</p>
  <p style="margin:0;${BODY_TEXT}${FONT}color:${INK};font-style:italic;">${typographic(text)}</p>
</div>`
}

/**
 * View on website link
 */
function viewOnWebsiteHtml(slug: string): string {
  const url = `https://www.portergoldberg.com/halcyon-development/newsletters/${slug}`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:32px auto;">
    <tr><td style="padding:0;text-align:center;">
      <a href="${url}" target="_blank" style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1a;text-decoration:none;">View this newsletter on our website</a>
    </td></tr>
  </table>`
}

/**
 * Main Halcyon newsletter HTML generator
 * Generates ONLY the content body - headers/footers should be added in HubSpot
 */
export function generateHalcyonNewsletterEmailHtml(newsletter: HalcyonNewsletter, includeWrapper = false): string {
  let contentHtml = generateIntroduction(newsletter.introduction, newsletter.season)
  contentHtml += generateChecklist(newsletter.maintenanceChecklist)

  if (newsletter.homeTip) {
    contentHtml += generateContentSection(newsletter.homeTip.title, newsletter.homeTip.content, '💡')
  }

  if (newsletter.didYouKnow) {
    contentHtml += generateContentSection(newsletter.didYouKnow.title, newsletter.didYouKnow.content, '🤔')
  }

  if (newsletter.luxurySpotlight) {
    contentHtml += generateContentSection(newsletter.luxurySpotlight.title, newsletter.luxurySpotlight.content, '✨')
  }

  if (newsletter.additionalSection) {
    contentHtml += generateContentSection(newsletter.additionalSection.title, newsletter.additionalSection.content)
  }

  if (newsletter.lookingAhead) {
    contentHtml += generateLookingAhead(newsletter.lookingAhead)
  }

  // Wrap content in container
  const wrappedContent = `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 auto;">
<tr><td style="padding:0 20px;">

${contentHtml}

</td></tr>
</table>`

  // If includeWrapper is true, wrap with full email structure (for preview)
  if (includeWrapper) {
    const preheader = newsletter.previewText ? generatePreheader(newsletter.previewText) : ''
    const slug = newsletter.slug.current
    const viewOnWebsite = viewOnWebsiteHtml(slug)

    return `${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0;padding:0;">
<tr><td align="center" style="padding:32px 0;">

${HEADER_HALCYON}
${wrappedContent}
${viewOnWebsite}
${FOOTER_HTML}

</td></tr>
</table>`
  }

  // Default: return header + content body + footer for pasting into HubSpot
  return `${HEADER_HALCYON}

${wrappedContent}

${FOOTER_HTML}`
}
