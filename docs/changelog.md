# Changelog — decisions & versions

Running log of design decisions, iterations, and open questions. Newest first.

## 2026-06-13

### Block A — setup
- Repo scaffolded: structure, README, MIT license (code only), `.gitignore`.
- Local skill `book-cover-premium-nonfiction` installed verbatim under
  `.claude/skills/` (project-scoped guardrail for taste + brief + review rubric).
- Brief copied to `brief/`.
- `design-principles.md` (invariants) written from brief + skill.
- `design.md` seeded with candidate palettes/fonts (not yet locked).
- Decisions locked with user: SVG-code production · typography-first · 3 directions
  (typographic-only / graph-fractal haze / geometric self-similarity) · several
  palettes · CMYK/print deferred to Block C · public repo on `alinaappleaseeva-sys`.

### Block A — second skill installed
- Reviewed and installed `emil-design-eng` (Emil Kowalski, github.com/emilkowalski/skill)
  as a project-local **secondary** skill — critic/polisher for taste, typographic
  precision, micro-polish, anti-slop. Security review: text-only SKILL.md, no
  scripts/hooks/executables, no `allowed-tools`. Primary author remains
  `book-cover-premium-nonfiction`.

### Open questions (for later, non-blocking)
- _none yet_

### Block A — Checkpoint 0 done (competitor analysis)
- Reviewed 1 strong + 3 weak competitor covers (all for the same book) →
  `concept/competitor-analysis.md`.
- Strong (dark, cinematic, faint dendrite from a head): take the atmosphere, drop the
  literal head/brain.
- Weak K1 (node-graph), K2 (nested frames), K3 (romanesco illustration): all too
  literal → infographic / decorative / art-poster. All read AI-slop.
- **Direction reweight:** typographic-only is now front-runner; graph survives only as
  true *haze* (never visible nodes); geometric must make depth/light, not frames;
  natural fractal demoted to texture-only.
- **Net recipe:** deep monochrome + refined high-contrast serif leading + ultra-subtle
  embedded atmospheric self-similar texture + soft light for depth.

### Block A — contact sheet (v1) rendered
- Fixed type: baked static Fraunces/Inter instances (scripts/build-fonts.py) with unique
  family names → exact optical-size + weight (resvg ignores font-weight on var fonts).
- Title now 3-line stack "Nature / of / Product" in Fraunces Display (opsz144, wght440):
  refined, high-contrast.
- Motif library (src/lib/motifs.mjs): softLight (depth), hazeFractal (atmospheric
  branching field, no nodes), geoDepth (golden subdivision, soft light not frames).
- Contact sheet: 6 variants → explorations/v1-contact-sheet/ + _thumbnails.png montage.

Rubric (premium·hier·thumb·concept·shelf·orig):
- B1 haze warm-dark 5·5·4.5·5·5·4.5  ← front-runner
- B2 haze green-dark 4.5·5·4.5·5·4.5·4.5
- A1 typo warm-dark 5·5·5·3·5·3.5  (safe anchor)
- A2 typo paper 4.5·5·5·2.5·4.5·3
- C1 geo warm-dark 4.5·5·4.5·3·4·3.5
- C2 geo paper 4·5·4.5·2.5·4·3
- Recommend B1 primary, B2 palette sibling, A1 fallback; drop geometric (C).

### Checkpoint 1 — decided
- Primary: **B2 (haze green-dark)**. Mandate: refine primary + keep a polished light
  fallback (A2). Three notes from user: (1) dissolve/geometrize the branching into
  structure, (2) lower the motif so it doesn't fight the title, (3) verify cream-on-green
  thumbnail contrast.

### Block B — overnight refinement (autonomous)
- Motif: added **structured** mode (fixed angle/ratio → self-similar, not a tree) +
  **vertical fade mask** (dense low, gone by 0.60·h) → notes (1) & (2) addressed.
- Greener ground `#13271C` (near-black greens lose green identity at thumbnail);
  subtitle lifted to `lighten(accent,0.16)` for legibility → note (3) addressed.
- Title weight test 330/390/440 at 150/88/60px + blur → **390 (Display Book)** is the
  elegance-vs-thumbnail sweet spot. Baked new instance.
- Perceptual checks: 120/96/64px, grayscale, blur/squint — title holds, premium in gray.
- Finalists rendered → `explorations/v3-finalists/` (F1/F2/F3/F4 + _compare/_perceptual/_weight).
- Lead locked → `src/covers/ebook.svg` (master, live text); RGB draft →
  `exports/ebook/nature-of-product-ebook.png` (1600×2560). `design.md` updated.
- Canonical build refactor: `src/lib/covers.mjs` (buildLead/buildFallback) shared by render.

### For the morning (Checkpoint 2)
- Review `explorations/v3-finalists/_compare.png` + lead `exports/ebook/nature-of-product-ebook.png`.
- Decide: lead green vs paper fallback; haze opacity 0.10–0.13; any title-weight tweak.
- Then Block C: print/CMYK layer (6.25×9.25 @300dpi, bleed), outlined PDF, package, v1.0.

### Open questions (non-blocking, for morning)
- Haze visibility: currently "discoverable" (opacity 0.12). Dial to 0.10 if you want it
  more subliminal.
- Author line: keep all-serif caps, or switch to Inter caps for a touch more contrast?

## 2026-06-14 (later)

### Motif: explored v4, reverted to v3 (art-direction)
- Tried v4 "lit dendrites" (directional light/volume, lush focal, staged heights) per
  request to add volume + composition. Result overshot the brief: motif became a
  spotlit *hero illustration* competing with the title (atmospheric/artistic, not
  editorial; biological read returned). Snapshot kept in explorations/v4-lit-dendrites/.
- **Reverted to v3 graph-haze** as the final; bumped haze opacity 0.12 → **0.14** (a
  touch more presence, survives print). litDendrites kept in the motif library, unused.
- Regenerated ALL deliverables (ebook PNG, print CMYK/RGB PDFs, outlined SVG) + shelf
  mocks from the restored master. Verified 60/120px + grayscale + blur.

### Checkpoint 2 — decided + master locked
- Green lead (paper fallback dropped) · haze 0.12 · all-serif author caps · title Book 390.
- Motif geometrized into a GRAPH (angle-snap 15° + cross-links 0.36 → loops, not a tree)
  to remove the biological/Nature-mag connotation. G2 "lattice" locked; G1/G3 as dials.
- Micro-fixes: +3.5%·h air under the title-rule; haze fade 0.60→0.64 (more breathing);
  author bottom margin = left margin.
- Verified: 120px & 60px legible, grayscale hierarchy holds, dominant under blur
  (exports/thumbnails/_test-sheet.png). Master: src/covers/ebook.svg.

### Block C — print layer + delivery (v1.0)
- Layout refactor: `coverLayout()` shares geometry between live-text render and the
  outline pipeline (no divergence).
- Outline: `scripts/outline.mjs` (opentype.js) → `exports/print/print-outlined.svg`
  (fully vector, text→paths; master stays live text).
- Print export: `scripts/export-print.sh` → RGB PDF (rsvg-convert) → **CMYK PDF**
  (ghostscript DeviceCMYK) + soft-proof. Verified MediaBox 450×666pt = 6.25×9.25in,
  DeviceCMYK present.
- **Green soft-proof:** `#13271C` survives CMYK conversion well (no saturation
  collapse) — brightness lift not needed. Printer can re-profile to PSOcoated_v3.
- Cleanup: dropped paper fallback + stale foundation renders.
- Deliverables: ebook PNG (1600×2560 RGB), print CMYK+RGB PDFs (vector, bleed),
  outlined SVG, editable master SVG. README/design.md finalized. Tagged **v1.0**.
