/**
 * Download WordPress media from export XML
 *
 * Usage: npx tsx scripts/download-wp-media.ts
 */

import { readFileSync, mkdirSync, existsSync, createWriteStream } from 'fs'
import { parse } from 'path'
import https from 'https'
import http from 'http'

const XML_FILE = 'scripts/portergoldbergresidential.WordPress.2026-05-09.xml'
const OUTPUT_DIR = 'scripts/wordpress-media'

// Extract attachment URLs from WordPress XML
function extractMediaUrls(xmlContent: string): string[] {
  const urls: string[] = []

  // Match <wp:attachment_url><![CDATA[...]]></wp:attachment_url>
  const regex = /<wp:attachment_url><!\[CDATA\[(.*?)\]\]><\/wp:attachment_url>/g
  let match

  while ((match = regex.exec(xmlContent)) !== null) {
    urls.push(match[1])
  }

  return urls
}

// Download a file
function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject)
          return
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
        return
      }

      const file = createWriteStream(destPath)
      response.pipe(file)

      file.on('finish', () => {
        file.close()
        resolve()
      })

      file.on('error', (err) => {
        reject(err)
      })
    })

    request.on('error', reject)
    request.setTimeout(30000, () => {
      request.destroy()
      reject(new Error(`Timeout downloading ${url}`))
    })
  })
}

async function main() {
  console.log('Reading WordPress export XML...')
  const xmlContent = readFileSync(XML_FILE, 'utf-8')

  console.log('Extracting media URLs...')
  const urls = extractMediaUrls(xmlContent)
  console.log(`Found ${urls.length} media files`)

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Download files
  let downloaded = 0
  let failed = 0

  for (const url of urls) {
    const filename = parse(new URL(url).pathname).base
    const destPath = `${OUTPUT_DIR}/${filename}`

    // Skip if already exists
    if (existsSync(destPath)) {
      console.log(`[SKIP] ${filename} (already exists)`)
      downloaded++
      continue
    }

    try {
      process.stdout.write(`[${downloaded + failed + 1}/${urls.length}] Downloading ${filename}...`)
      await downloadFile(url, destPath)
      console.log(' OK')
      downloaded++
    } catch (err) {
      console.log(` FAILED: ${err instanceof Error ? err.message : err}`)
      failed++
    }

    // Small delay to be nice to the server
    await new Promise(r => setTimeout(r, 100))
  }

  console.log('\n--- Summary ---')
  console.log(`Downloaded: ${downloaded}`)
  console.log(`Failed: ${failed}`)
  console.log(`Output directory: ${OUTPUT_DIR}`)
}

main().catch(console.error)
