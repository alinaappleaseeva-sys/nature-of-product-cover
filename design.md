# Design — current chosen solution

> **Status:** LEAD LOCKED (Block B, overnight). Pending Checkpoint 2 (morning) to pick
> the final from the finalist set. Invariants live in
> [`design-principles.md`](design-principles.md). Master: [`src/covers/ebook.svg`].

## Direction

**B2 — graph-fractal haze, deep green.** "The strong reference cover, minus the literal
head": deep cinematic ground + refined high-contrast serif leading + an ultra-subtle,
*structured* (self-similar) haze concentrated in the lower third. Chosen at Checkpoint 1
and refined per three notes (dissolve→structure, lower the motif, verify thumbnail).

## Palette (locked: "green chroma")

| Role | Value | Notes |
|------|-------|-------|
| Background | `#13271C` | deep green that keeps its *green* identity at thumbnail (near-black greens go muddy) |
| Title / ink | `#ECE3D1` | warm cream — high contrast on green, holds at 60px |
| Subtitle | `#A6B394` | `lighten(accent, 0.16)` — sage lifted for legibility |
| Accent (rule) | `#8A9B79` | sage hairline under the title |

Light fallback (A2): bg `#EDE7DA`, ink `#211F1B`, accent `#355049`.

## Typography (locked)

One family (Fraunces) → counts as 1; cohesive/editorial.

| Element | Font | Size @1600w | Notes |
|---------|------|-------------|-------|
| Title | **Fraunces Display Book** (opsz144, wght390) | 253px, leading 228 | 3-line stack "Nature / of / Product"; the 330/390/440 test picked 390 as elegance-vs-thumbnail sweet spot |
| Subtitle | Fraunces Text (opsz28, wght400) | 49px, leading 70 | 2 lines |
| Author | Fraunces Text Medium (wght560) | 38px | UPPERCASE, tracking 0.14em |

Fallback pairing uses Inter Book / Inter Medium for subtitle/author.
All instances baked static (`scripts/build-fonts.py`) with unique family names.

## Layout (@1600×2560, scales by width)

- Margin `0.095·w` (152px). Left-aligned. Title top at `0.135·h`.
- Sage hairline (width `0.10·w`) at `titleBottom + 0.42·titleSize`.
- Subtitle below the rule; author baseline at `h − margin`.
- Generous lower field (editorial), motif lives there.

## Motif (locked)

`hazeFractal` **structured** mode (fixed branch angle 0.38, ratio 0.72): self-similar,
reads as structure not nature. opacity 0.12, blur 3.5, depth 9, 15 roots across the
bottom, `reach 0.10`, **vertical fade to 0.60·h** (dense low, gone before the title).
Plus `softLight` pool (lower-center, offset to 0.42·w) for depth. Kept subordinate.

## Finalists for Checkpoint 2

`explorations/v3-finalists/` — F1 (Display 440), F2 (Display Light 330), F3 (minimal
haze), F4 (paper fallback). Lead = F-Book (390), rendered to `src/covers/ebook.svg`.
Open dial for the morning: haze opacity 0.10–0.13 (currently 0.12).
