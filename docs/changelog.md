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

### Next
- Fix Fraunces weight control (variable-font default renders too heavy) → use lighter,
  higher-contrast title.
- Build 3 directions per reweight → contact sheet (Checkpoint 1, before sleep).
