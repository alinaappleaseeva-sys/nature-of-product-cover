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

### Next
- Checkpoint 0: competitor analysis (1 good + 3 bad) from user → `concept/competitor-analysis.md`.
- Then typographic foundation + 3 directions → contact sheet (Checkpoint 1, before sleep).
