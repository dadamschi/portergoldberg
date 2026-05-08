#!/usr/bin/env node
/**
 * process-wwt.mjs
 *
 * Remove header and footer from WWT digest images, then split into sections.
 *
 * Header and footer sizes are determined from example images:
 *   - header.png: 270px tall
 *   - footer.png: 381px tall
 *
 * Sections are detected by finding white space gaps between content regions.
 *
 * USAGE
 *   node process-wwt.mjs <input-image-or-directory> [options]
 *
 * OPTIONS
 *   --out <dir>       Output directory (default: ~/Desktop/wwt-extracted)
 *   --header <px>     Override header height (default: 270)
 *   --footer <px>     Override footer height (default: 381)
 *   --gap <px>        Min white gap between sections (default: 40)
 *   --white <0-255>   Brightness threshold for "white" (default: 252)
 *   --minHeight <px>  Min section height to include (default: 100, filters out headings)
 *   --skipTop <px>    Pixels to skip from top of each section (negative adds padding)
 *   --skipBottom <px> Pixels to skip from bottom of each section (negative adds padding)
 *   --debug           Save debug overlay showing detected regions
 *
 * INSTALL
 *   npm install sharp
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

// ---------- arg parsing ----------

function parseArgs(argv) {
  const out = { _: [], opts: {} };
  for (let i = 2; i < argv.length; i++) {
    const tok = argv[i];
    if (tok.startsWith('--')) {
      const key = tok.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        out.opts[key] = next;
        i++;
      } else {
        out.opts[key] = true;
      }
    } else {
      out._.push(tok);
    }
  }
  return out;
}

function num(v, fallback) {
  if (v === undefined || v === true) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// ---------- pixel analysis ----------

async function loadRaw(imagePath) {
  const { data, info } = await sharp(imagePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return {
    data,
    width: info.width,
    height: info.height,
    channels: info.channels,
  };
}

/**
 * Compute average brightness for each row.
 */
function rowBrightness(raw) {
  const { data, width, height, channels } = raw;
  const stride = width * channels;
  const result = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    let sum = 0;
    const base = y * stride;
    for (let x = 0; x < width; x++) {
      const idx = base + x * channels;
      sum += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    }
    result[y] = sum / width;
  }

  return result;
}

/**
 * Find content regions (non-white stretches) separated by white gaps.
 */
function findContentRegions(brightness, yStart, yEnd, whiteThresh, minGap) {
  const regions = [];
  let inContent = false;
  let contentStart = 0;
  let gapStart = yStart;

  for (let y = yStart; y < yEnd; y++) {
    const isWhite = brightness[y] >= whiteThresh;

    if (!isWhite && !inContent) {
      const gapSize = y - gapStart;
      if (regions.length > 0 && gapSize < minGap) {
        regions[regions.length - 1].end = y;
        regions[regions.length - 1].merged = true;
      }
      inContent = true;
      contentStart = y;
    }

    if (isWhite && inContent) {
      if (regions.length === 0 || !regions[regions.length - 1].merged) {
        regions.push({ start: contentStart, end: y });
      } else {
        regions[regions.length - 1].end = y;
        regions[regions.length - 1].merged = false;
      }
      inContent = false;
      gapStart = y;
    }
  }

  if (inContent) {
    if (regions.length > 0 && regions[regions.length - 1].merged) {
      regions[regions.length - 1].end = yEnd;
    } else {
      regions.push({ start: contentStart, end: yEnd });
    }
  }

  return regions.map(r => ({ start: r.start, end: r.end }));
}

// ---------- process single image ----------

async function processImage(inputPath, outRoot, opts) {
  const { headerPx, footerPx, minGap, whiteThresh, minHeight, skipTop, skipBottom, debug } = opts;

  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outDir = path.join(outRoot, baseName);
  await fs.mkdir(outDir, { recursive: true });

  console.log(`\n=== ${baseName} ===`);
  console.log(`Input:    ${inputPath}`);
  console.log(`Output:   ${outDir}`);

  // Load image
  const raw = await loadRaw(inputPath);
  const { width, height } = raw;
  console.log(`Image:    ${width} x ${height}px`);

  // Content region (between header and footer)
  const contentTop = headerPx;
  const contentBottom = height - footerPx;
  const contentHeight = contentBottom - contentTop;

  if (contentHeight <= 0) {
    console.error(`  Error: Header + footer >= image height. Skipping.`);
    return { baseName, sections: 0, error: 'content too small' };
  }

  console.log(`Content:  y=${contentTop} to ${contentBottom} (${contentHeight}px)`);

  // Compute row brightness
  const brightness = rowBrightness(raw);

  // Find content regions
  let regions = findContentRegions(brightness, contentTop, contentBottom, whiteThresh, minGap);
  console.log(`Found:    ${regions.length} initial content region(s)`);

  // Filter out small regions (section headings)
  regions = regions.filter(r => (r.end - r.start) >= minHeight);
  console.log(`Sections: ${regions.length} after filtering out headings (< ${minHeight}px)`);

  if (regions.length === 0) {
    console.warn('  No sections detected. Saving content as single file.');
    const outputPath = path.join(outDir, `${baseName}-content.png`);
    await sharp(inputPath)
      .extract({ left: 0, top: contentTop, width, height: contentHeight })
      .png()
      .toFile(outputPath);
    return { baseName, sections: 1 };
  }

  // Save each section (with optional top/bottom adjustments)
  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    const idx = String(i + 1).padStart(2, '0');

    // Adjust top and bottom (negative values add padding, positive values crop)
    let extractTop = region.start + skipTop;
    let extractEnd = region.end - skipBottom;

    // Clamp to image bounds
    extractTop = Math.max(0, extractTop);
    extractEnd = Math.min(height, extractEnd);

    const extractHeight = extractEnd - extractTop;

    // Only save if there's content left
    if (extractHeight <= 0) {
      console.log(`  section-${idx}.png: SKIPPED (too small after adjustments)`);
      continue;
    }

    const outputPath = path.join(outDir, `section-${idx}.png`);

    await sharp(inputPath)
      .extract({ left: 0, top: extractTop, width, height: extractHeight })
      .png()
      .toFile(outputPath);

    console.log(`  section-${idx}.png: y=[${extractTop}, ${extractEnd}] (${extractHeight}px)`);
  }

  // Debug overlay
  if (debug) {
    const overlay = Buffer.alloc(width * height * 4, 0);

    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 0;

      if (y < contentTop || y >= contentBottom) {
        r = 255; g = 0; b = 0; a = 80;
      } else {
        const inSection = regions.some(reg => y >= reg.start && y < reg.end);
        if (inSection) {
          r = 0; g = 100; b = 255; a = 60;
        } else {
          r = 255; g = 220; b = 0; a = 60;
        }
      }

      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        overlay[i] = r;
        overlay[i + 1] = g;
        overlay[i + 2] = b;
        overlay[i + 3] = a;
      }
    }

    const overlayPng = await sharp(overlay, {
      raw: { width, height, channels: 4 },
    }).png().toBuffer();

    await sharp(inputPath)
      .composite([{ input: overlayPng, blend: 'over' }])
      .png()
      .toFile(path.join(outDir, 'debug.png'));

    console.log(`  Debug: debug.png`);
  }

  return { baseName, sections: regions.length };
}

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv);
  if (args._.length < 1) {
    console.error('Usage: node process-wwt.mjs <input-image-or-directory> [options]');
    process.exit(1);
  }

  const inputPath = path.resolve(args._[0]);
  const stat = await fs.stat(inputPath);

  const outRoot = args.opts.out
    ? path.resolve(String(args.opts.out))
    : path.join(os.homedir(), 'Desktop', 'wwt-extracted');

  const opts = {
    headerPx: num(args.opts.header, 270),
    footerPx: num(args.opts.footer, 381),
    minGap: num(args.opts.gap, 40),
    whiteThresh: num(args.opts.white, 252),
    minHeight: num(args.opts.minHeight, 100),
    skipTop: num(args.opts.skipTop, -5),
    skipBottom: num(args.opts.skipBottom, -5),
    debug: !!args.opts.debug,
  };

  console.log(`Output root: ${outRoot}`);
  console.log(`Params: header=${opts.headerPx}px footer=${opts.footerPx}px gap=${opts.minGap}px white=${opts.whiteThresh} minHeight=${opts.minHeight}px skipTop=${opts.skipTop}px skipBottom=${opts.skipBottom}px`);

  await fs.mkdir(outRoot, { recursive: true });

  // Build list of images to process
  let images = [];

  if (stat.isDirectory()) {
    const entries = await fs.readdir(inputPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/\.(png|jpe?g)$/i.test(entry.name)) continue;
      // Skip our own header/footer reference images
      if (entry.name === 'header.png' || entry.name === 'footer.png') continue;
      images.push(path.join(inputPath, entry.name));
    }
    images.sort();
    console.log(`\nFound ${images.length} image(s) in directory.`);
  } else {
    images.push(inputPath);
  }

  if (images.length === 0) {
    console.error('No images found to process.');
    process.exit(1);
  }

  // Process each image
  const results = [];
  for (const img of images) {
    try {
      const result = await processImage(img, outRoot, opts);
      results.push(result);
    } catch (err) {
      console.error(`  Error processing ${img}: ${err.message}`);
      results.push({ baseName: path.basename(img), sections: 0, error: err.message });
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Processed: ${results.length} image(s)`);
  const successful = results.filter(r => !r.error);
  const totalSections = successful.reduce((sum, r) => sum + r.sections, 0);
  console.log(`Total sections extracted: ${totalSections}`);

  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    for (const e of errors) {
      console.log(`  - ${e.baseName}: ${e.error}`);
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
