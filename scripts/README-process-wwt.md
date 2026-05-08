# process-wwt

Single-file Node.js script that takes one WWT digest image and:

1. Splits it into sections via row-blankness analysis.
2. Saves each section as its own PNG.
3. OCRs the **body** of each section (heading excluded) into a `.txt` file.
4. Writes a `summary.json` describing what it did.

Output goes to `~/Desktop/wwt-extracted/<date>/` by default, where `<date>` is
the input file's basename (e.g. `2:2:26`).

## Install

From the repo root (or wherever you put `process-wwt.mjs`):

```bash
npm install sharp tesseract.js
```

`sharp` is native; `tesseract.js` is pure JS but downloads a ~10 MB language
model on first run (cached after).

## Run (single-file test mode)

```bash
node process-wwt.mjs "/Users/dadamsgs/Dropbox/WWT copy/2:2:26.png" --debug
```

The `--debug` flag also writes a `debug.png` overlay so you can see what the
detector classified as section vs. gap vs. header/footer. Highly recommended
for the first run — that's how we tune the thresholds.

## Tuning knobs

| Flag             | Default | What it does                                                       |
| ---------------- | ------- | ------------------------------------------------------------------ |
| `--out <dir>`    | `~/Desktop/wwt-extracted` | Output root.                                     |
| `--header <px>`  | `0`     | Strip N pixels from top before section detection.                  |
| `--footer <px>`  | `0`     | Strip N pixels from bottom before section detection.               |
| `--gap <px>`     | `30`    | Min run of blank rows that counts as a section break.              |
| `--inner-gap <px>` | `8`   | Min blank run inside a section that splits heading from body.      |
| `--blank <0-255>` | `245`  | Per-row brightness threshold for "blank".                          |
| `--min-section <px>` | `40` | Discard sections shorter than this (filters noise).               |
| `--debug`        | off     | Write `debug.png` overlay.                                         |

## Iteration loop

1. Run with `--debug`.
2. Open `debug.png`. Blue bands = sections, yellow = gaps, red = stripped header/footer.
3. If sections are merging → raise `--gap` or lower `--blank`.
4. If sections are splitting too aggressively → lower `--gap` or raise `--blank`.
5. If header/footer is being read as content → set `--header` and `--footer`.
6. If headings are leaking into the OCR text → raise `--inner-gap`.

Once one image looks right, the same params should work for the rest of the
batch (same publisher = same layout). I'll add a `--batch` mode after we've
locked in good defaults.

## Limitations (v1)

- Assumes a **light background**. Dark mode digests need inversion (TODO).
- Heading detection inside a section uses a blank-row gap, falling back to
  "top 18% of the section is heading" if no inner gap is found. If WWT uses
  tight heading-to-body spacing, we may need to switch to bbox-based detection
  via Tesseract's word boxes.
- Header/footer are stripped by fixed pixel counts you supply. Auto-detection
  via cross-image pixel diff is the obvious next step (and trivial to add
  once we move to batch mode).
