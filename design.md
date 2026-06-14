# Design — final solution (v1.0)

> **Status:** ✅ FINAL. Decided at Checkpoint 2, print layer delivered. Invariants live
> in [`design-principles.md`](design-principles.md). Master: `src/covers/ebook.svg`.

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

## Motif (locked — v3 graph-haze "lattice")

`hazeFractal` **structured + geometrized into a GRAPH** so it reads as network, not a
tree — and kept **barely-noticeable** so typography leads (brief: fractal must not
dominate). Lives only in the lower field as faint texture.
- branch half-angle **0.46**, ratio 0.72, **angle-snap to 15° grid**, **jitter 0**
- **cross-links 0.36** between mid-canopy nodes → loops (a tree has none = graph read)
- **opacity 0.14** (`HAZE_OPACITY` in covers.mjs; v3 baseline 0.12, +0.02 so it
  survives print where it reads weaker), blur 3.5, depth 9, **13 roots**, `reach 0.09`
- **vertical fade to 0.64·h** (dense low, dissolves before the title)
- `softLight` pool lower-center (offset 0.42·w, cy 0.86·h) for depth

**Rejected exploration — v4 "lit dendrites"** (`litDendrites` in motifs.mjs, snapshot
`explorations/v4-lit-dendrites/`): a sparse grove with directional light/volume and a
lush focal. Beautiful but it overshot the brief — the motif became a *hero
illustration* (spotlit tree) competing with the title, pulling the cover toward
atmospheric/artistic and re-introducing the biological read. Reverted to v3.

## Decided at Checkpoint 2

Green lead (drop paper fallback) · haze 0.12 · all-serif author caps · title Book 390.
Micro-fixes applied: +3.5%·h air between title-rule and subtitle; haze lowered; author
bottom margin = left margin. Master: `src/covers/ebook.svg`.
