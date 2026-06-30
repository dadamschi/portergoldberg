# PorterGoldberg Brand Guidelines

This document defines brand rules and standards for the PorterGoldberg website and marketing materials.

> **SYNC WARNING:** When updating colors or fonts in `styles/globals.css`, update this file to match. These values must stay in sync.

---

## Typography

### Primary Font
- **Quicksand** — Body text, UI elements
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
  - CSS: `font-family: 'Quicksand', Helvetica, Arial, Lucida, sans-serif;`
  - Variable: `--font-body`

### Secondary Fonts
- **Nunito Sans** — Alternative body font
  - Weights: 400, 500, 600, 700
- **Proxima Nova** — Fallback (Adobe Typekit)
- **PP Eiko** — Cursive/display font (local files)
  - Weights: 300 (Thin), 500 (Medium), 700 (Heavy)
  - Files: `/fonts/ppeiko-*.otf`

### Usage
- Headlines: Clean, uppercase for section headers
- Body: Quicksand, readable and professional

---

## Color Palette

### Primary Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Black | `--pg-black` | `#000000` | Primary background |
| Navy | `--pg-navy` | `#000035` | Deep accent |
| Sage | `--pg-sage` | `#79A52C` | Primary green accent |
| Sage Light | `--pg-sage-l` | `#8FB840` | Hover states |
| Teal | `--pg-teal` | `#50B08A` | Secondary accent |

### Legacy Gold (transitioning out)
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Gold | `--pg-gold` | `#A8904E` | Legacy accent |
| Gold Light | `--pg-gold-l` | `#C4A96A` | Legacy hover |

### Neutrals
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Dark | `--pg-dark` | `#000000` | Text, borders |
| Charcoal | `--pg-charcoal` | `#1A1917` | Dark backgrounds |
| Gray | `--pg-gray` | `#32373C` | Secondary text |
| Gray Warm | `--pg-gray-warm` | `#BEBBB6` | Footer background |
| Gray Button | `--pg-gray-btn` | `#383C45` | Button backgrounds |
| Mid | `--pg-mid` | `#7A7670` | Muted text |
| Cream | `--pg-cream` | `#F5F3EE` | Light backgrounds |
| White | `--pg-white` | `#FFFFFF` | Backgrounds, text on dark |

### Border Colors
| Name | Variable | Value |
|------|----------|-------|
| Border (dark bg) | `--pg-border` | `rgba(255, 255, 255, 0.1)` |
| Border (light bg) | `--pg-border-light` | `rgba(26, 25, 23, 0.12)` |

---

## Company Name

- **PorterGoldberg** — Always one word, camelCase. Never "Porter Goldberg" or "Porter-Goldberg"
- Full name: **PorterGoldberg Residential**
- Acceptable variations:
  - PorterGoldberg
  - PorterGoldberg Residential
- Never use:
  - Porter Goldberg (two words)
  - Porter-Goldberg (hyphenated)
  - PG (unless in internal code/CSS class names)

## Team Members

- **Samantha Porter** — Vice President, Sales
- **Lauren Goldberg** — Vice President, Sales

## Affiliations

- **Jameson Sotheby's International Realty** — The brokerage affiliation
- **Halcyon Development Group** — Development partner (separate branding)

## Email & Contact

- Primary email: info@portergoldberg.com
- Individual emails: firstname@portergoldberg.com
- Website: https://www.portergoldberg.com

## Social Media Handles

- Instagram: @portergoldbergchicago
- Facebook: PorterGoldberg Residential
- YouTube: @PorterGoldbergResidential

## Newsletter

- Newsletter name: **Your Weekly Walk-Through**
- Abbreviated as: YWWT (internal only)

## Legal Disclaimer

Standard footer disclaimer for emails:

> © 2026 Sotheby's International Realty® and the Sotheby's International Realty Logo are service marks licensed to Sotheby's International Realty Affiliates LLC and used with permission. Jameson Sotheby's International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby's International Realty Affiliates LLC nor any of its affiliated companies.

## CSS Class Naming

- Prefix all classes with `pg-` (e.g., `pg-newsletter-section`)
- Use BEM-style modifiers (e.g., `pg-section-header--right`)
