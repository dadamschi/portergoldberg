'use client'

import { useState, useEffect } from 'react'

// Editable footer HTML - edit this and see changes live
const FOOTER_HTML = `<table style="width: 100%; max-width: 600px; background-color: #000000; padding: 20px; font-family: Arial, sans-serif; color: #ffffff; border-collapse: collapse; -webkit-font-smoothing: antialiased;">

  <!-- Website URL Row -->
  <tr>
    <td colspan="2" style="padding: 20px 10px 4px 10px; background-color: #ffffff;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 33.33%; vertical-align: middle;">
            <div style="border-top: 1px solid #A8904E;"></div>
          </td>
          <td style="width: 33.33%; text-align: center; vertical-align: middle;">
            <a href="https://www.portergoldberg.com" style="text-decoration: none;">
              <span style="font-size: 18px; font-weight: bold; letter-spacing: 3px; color: #A8904E; text-transform: uppercase;">PORTERGOLDBERG.COM</span>
            </a>
          </td>
          <td style="width: 33.33%; vertical-align: middle;">
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

export default function NewsletterPreviewPage() {
  const [html, setHtml] = useState(FOOTER_HTML)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">Newsletter Footer Preview</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Edit HTML</h2>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="h-[700px] w-full rounded border p-4 font-mono text-xs"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Preview</h2>
            <div className="rounded border bg-white p-4">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigator.clipboard.writeText(html)}
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Copy HTML
          </button>
          <p className="mt-2 text-sm text-gray-600">
            When done, copy the HTML and update <code>lib/newsletter-email-template.ts</code>
          </p>
        </div>
      </div>
    </div>
  )
}
