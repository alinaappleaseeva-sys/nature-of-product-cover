# Nature of Product — Book Cover (contest)

Cover design for **Ivan Zamesin — *Nature of Product*** (*How to Build Products So
Valuable They Look Like Magic*). Premium business nonfiction; the cover should sit
naturally next to *Atomic Habits*, *Thinking, Fast and Slow*, *The Innovator's
Dilemma* and Stripe Press titles: calm, intelligent, premium, restrained.
**Typography leads; the conceptual motif (a barely noticeable fractal / self-similar
structure echoing the book's Job Graph) supports it.**

> **Status:** ✅ v1.0 — final deliverables shipped (warm near-black, typography-first,
> dense-bridge nodegraph motif in lower third).
> Running log: [`docs/changelog.md`](docs/changelog.md).
>
> ![cover](exports/ebook/nature-of-product-ebook.png)

## Deliverables

| File | Spec | Intended use |
|------|------|--------------|
| [`exports/ebook/nature-of-product-ebook.png`](exports/ebook/nature-of-product-ebook.png) | 1600×2560 px · RGB · PNG | Ebook platforms (KDP, Kobo, Apple Books) |
| [`exports/ebook/thumbnail-120px.png`](exports/ebook/thumbnail-120px.png) | 120 px wide · RGB · PNG | Thumbnail legibility check |
| [`exports/print/nature-of-product-print.pdf`](exports/print/nature-of-product-print.pdf) | 6.25×9.25 in · **CMYK** · vector PDF | Print-shop submission (front cover, bleed included) |
| [`exports/print/nature-of-product-print-preview.png`](exports/print/nature-of-product-print-preview.png) | 150 DPI raster from CMYK PDF | Visual proof (note: 150 DPI understates motif fineness vs actual 300 DPI print) |
| [`exports/print/nature-of-product-outlined.svg`](exports/print/nature-of-product-outlined.svg) | 6.25×9.25 in · text → outlines · vector | Print-safe SVG; no font dependency |
| [`exports/source/nature-of-product-live-text.svg`](exports/source/nature-of-product-live-text.svg) | 6.25×9.25 in · live text · vector | Editable master for future revisions |

CMYK conversion uses Ghostscript DeviceCMYK (generic SWOP-like). The printer can
re-profile to PSOcoated_v3 or their house profile at production.
Regenerate all deliverables: `node scripts/build-v1.mjs`

## What we deliver

| Artifact | Spec |
|---|---|
| Front-cover concept (priority) | final design |
| Ebook cover | 1600 × 2560 px (1.6:1), **RGB**, PNG |
| Print front | 6 × 9 in trade paperback, 300 DPI, **CMYK**, 0.125 in bleed → 6.25 × 9.25 in = 1875 × 2775 px, PDF |
| Editable source | master SVG with **live text** + a separate final outlined PDF for print |

Full wrap (front + spine + back) is out of scope until page count & paper are confirmed.

## How it's made

The cover is generated as **editable SVG** (typography + an algorithmic, genuinely
self-similar motif layer), rendered to PNG/PDF. Everything is versioned in git.

```bash
npm install
npm run fonts         # bake static font instances from the variable TTFs (needs: pip install fonttools)
npm run render        # master SVG (live text) + ebook RGB PNG (1600×2560) + thumbnail
npm run test:visual   # thumbnail / grayscale / blur-squint checks
npm run build:print   # outlined vector SVG → RGB PDF → CMYK PDF + soft-proof (needs: ghostscript, librsvg)
```

## Repository layout

```
.claude/skills/book-cover-premium-nonfiction/  Local design skill (taste + brief + review rubric)
brief/                Original contest brief
design-principles.md  Invariants — what must not break (+ agent brief)
design.md             Current chosen solution (colors/fonts/sizes/spacing)
concept/              Competitor analysis, rationale, moodboard, typography notes
src/                  lib/ (generators + layout), covers/ (master SVGs), palettes.json
assets/               fonts/ (OFL) + icc/ (CMYK profile)
scripts/              render.mjs, tests.mjs, export-print.sh (late)
exports/              ebook/ print/ thumbnails/  (curated final outputs)
explorations/         versioned iterations (v1 contact sheet, v2, …)
docs/changelog.md     decision & version log
```

## Design guardrails

This project carries two local Claude Code skills:

- **[`book-cover-premium-nonfiction`](.claude/skills/book-cover-premium-nonfiction/SKILL.md)**
  (primary) — encodes the brief, the taste, the anti-cliché rules, and a strict review
  rubric (6 axes × 1–5; a direction is only a finalist at ≥4 on *premium feel* and
  *thumbnail readability*). It **fixes** the brief and taste so iterations don't drift.
- **[`emil-design-eng`](.claude/skills/emil-design-eng/SKILL.md)** (secondary, by
  [Emil Kowalski](https://emilkowal.ski/skill)) — used as a **critic & polisher** for
  taste, typographic precision, micro-polish and anti-slop thinking. Not the main
  author. Reviewed as open-source before install: text-only, no scripts/hooks.

## License

Pipeline **code** is MIT (see [`LICENSE`](LICENSE)). The **cover design artwork** is a
contest submission — all rights reserved by the author. Fonts are under the SIL Open
Font License (see `assets/fonts/`).
