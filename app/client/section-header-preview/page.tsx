'use client'

import { useState } from 'react'

// Editable section header HTML - edit this and see changes live
const SECTION_HEADER_HTML = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px 0;">
  <tr>
    <td width="100%" valign="middle" style="width:100%; vertical-align:middle;">
      <div style="border-top:1px solid #1a1a1a; font-size:1px; line-height:1px;">&nbsp;</div>
    </td>
    <td valign="middle" style="font-family:Helvetica, Arial, sans-serif; font-size:13px; letter-spacing:2px; color:#1a1a1a; white-space:nowrap; padding:0 12px; vertical-align:middle; text-transform:uppercase;">BUILDING</td>
    <td valign="middle" style="font-family:Helvetica, Arial, sans-serif; font-size:26px; letter-spacing:1px; color:#1a1a1a; white-space:nowrap; padding:0 12px; vertical-align:middle; text-transform:uppercase;">SOLD</td>
  </tr>
</table>`

export default function SectionHeaderPreviewPage() {
  const [html, setHtml] = useState(SECTION_HEADER_HTML)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">Section Header Preview</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Edit HTML</h2>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="h-[400px] w-full rounded border p-4 font-mono text-xs"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Preview</h2>
            <div className="rounded border bg-white p-4" style={{ maxWidth: 600 }}>
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
            When done, share the HTML and I&apos;ll update <code>lib/newsletter-email-template.ts</code>
          </p>
        </div>
      </div>
    </div>
  )
}
