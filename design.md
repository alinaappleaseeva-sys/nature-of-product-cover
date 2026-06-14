# Design — final solution (v1.2)

> **Status:** ✅ FINAL. Typography-first; barely-noticeable self-similar **haze field**
> (paper depth), not an object. Invariants: [`design-principles.md`](design-principles.md).
> Master: `src/covers/ebook.svg`.

## Direction

**Typographic-first, near-black, with a paper-depth haze field.** The title is the hero;
the self-similar idea lives as an all-over, barely-noticeable field of tiny self-similar
sprigs (felt as depth/grain, not read as an object). The lower field is alive but quiet —
no centre, no illustration, no diagram.

## Palette (locked: "ink")

| Role | Value | Notes |
|------|-------|-------|
| Background | `#16181A` | warm near-black — most premium/authoritative; matches the audience-favourite dark register |
| Title / ink | `#ECE6DA` | warm off-white, high contrast (holds at 60px) |
| Subtitle / accent | `#9A7B4F` | bronze — quiet secondary voice |
| Haze field | `#A7895C` | bronze-smoky, very low opacity |

## Typography (locked)

One family (Fraunces). Title **2 lines** "Nature of / Product" — a massive block in the
top ~45%, line-length rhythm.

| Element | Font | Notes |
|---------|------|-------|
| Title | Fraunces Display Book (opsz144, wght390), `titleScale 1.06` | 2-line stack, leads decisively |
| Subtitle | Fraunces Text (opsz28, wght400) | 2 lines, bronze, big gap below title (`subGap 0.05·h`) |
| Author | Fraunces Text Medium (wght560) | UPPERCASE, tracked, quiet, bottom |

Composition: left-aligned, optical centre high (`titleTopFrac 0.125`), deliberately
empty lower field (premium). Geometry in `coverLayout()`.

## Motif (locked — haze FIELD)

`hazeField` (src/lib/motifs.mjs): an **all-over field**, not an object.
- Tiny self-similar **sprigs** (micro-fractal branches) → structure on a second look.
- **Jittered-grid** distribution → even coverage, no dead voids, no blob/centre.
- 3 depth layers (far tiny/faint → mid → near larger), bronze `#A7895C`, opacity ≈
  0.03 / 0.05 / 0.075, `density 1.0`, blur 0.85.
- **Density mask**: pattern *frequency* (not just opacity) is reduced around the title /
  subtitle / author boxes → the type sits in genuinely quiet air.

## Journey (what we rejected, and why)

- **v3 graph-haze** (structured + cross-links, green): correct subordination, but as a
  single localized blur in the lower third it read as a *render artifact* — too weak to
  work, too present to ignore; lower half felt dead.
- **v4 lit dendrites**: beautiful lit hero with volume, but it overshot the brief — the
  motif became an *illustration* competing with the title (atmospheric/artistic, not
  editorial; biological read returned). Snapshot: `explorations/v4-lit-dendrites/`.
- **v5 (this)**: motif re-conceived as a *field* (paper depth) + the palette moved to
  neutral near-black for maximum premium/authority, title enlarged to a 2-line hero.
  Explorations: `explorations/v5-fronts/`, `explorations/v5-haze/`.
