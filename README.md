# Nature of Product — Book Cover (contest)

Cover design for **Ivan Zamesin — *Nature of Product*** (*How to Build Products So
Valuable They Look Like Magic*). Premium business nonfiction; the cover should sit
naturally next to *Atomic Habits*, *Thinking, Fast and Slow*, *The Innovator's
Dilemma* and Stripe Press titles: calm, intelligent, premium, restrained.
**Typography leads; the conceptual motif (a barely noticeable fractal / self-similar
structure echoing the book's Job Graph) supports it.**

> **Status:** ✅ v1.2 — final cover delivered (warm near-black, typography-first, with a
> barely-noticeable self-similar haze *field* / paper depth).
> Running log: [`docs/changelog.md`](docs/changelog.md).
>
> ![cover](exports/ebook/nature-of-product-ebook.png)

## Deliverables (final)

| File | What |
|------|------|
| [`exports/ebook/nature-of-product-ebook.png`](exports/ebook/nature-of-product-ebook.png) | Ebook cover — 1600×2560 px, RGB |
| [`exports/print/nature-of-product-print-cmyk.pdf`](exports/print/nature-of-product-print-cmyk.pdf) | Print cover — 6.25×9.25 in (6×9 trim + 0.125 bleed), **CMYK**, vector |
| [`exports/print/nature-of-product-print-rgb.pdf`](exports/print/nature-of-product-print-rgb.pdf) | Print cover — same, RGB (vector) |
| [`exports/print/print-outlined.svg`](exports/print/print-outlined.svg) | Print source — text outlined (vector) |
| [`src/covers/ebook.svg`](src/covers/ebook.svg) | **Editable master** — live text |

`exports/print/_cmyk-proof.png` is a soft-proof of the CMYK conversion (green holds).
Note: CMYK uses Ghostscript's generic DeviceCMYK conversion; the printer can re-profile
to PSOcoated_v3 / their house profile at production.

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
