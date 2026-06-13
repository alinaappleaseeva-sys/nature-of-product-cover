// Single source of truth for cover content, fonts, palettes, and canvas sizes.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))

export const palettes = JSON.parse(
  readFileSync(join(__dir, '..', 'palettes.json'), 'utf8')
)

// Exact text from the brief — wording and hierarchy preserved.
export const text = {
  title: 'Nature of Product',
  titleLines: ['Nature', 'of', 'Product'], // commanding 3-line stack (cf. strong ref)
  subtitle: 'How to Build Products So Valuable They Look Like Magic',
  subtitleLines: ['How to Build Products So Valuable', 'They Look Like Magic'],
  author: 'Ivan Zamesin',
}

// Baked static instances (see scripts/build-fonts.py). Unique family names so
// resvg selects them directly (it ignores font-weight on variable fonts).
export const families = {
  titleLight: 'Fraunces Display Light',
  titleBook: 'Fraunces Display Book',
  title: 'Fraunces Display',
  serifText: 'Fraunces Text',
  serifCaps: 'Fraunces Text Medium',
  sansBook: 'Inter Book',
  sansMedium: 'Inter Medium',
}

// Two type pairings (≤2 per round, per the skill). All-serif = one family,
// cohesive/editorial (matches the strong reference). Serif+sans = cleaner/modern.
export const pairings = {
  allSerif: { title: families.title, sub: families.serifText, author: families.serifCaps },
  serifSans: { title: families.title, sub: families.sansBook, author: families.sansMedium },
}

// Front-cover concept / ebook ratio is the priority (1.6:1).
export const canvas = {
  ebook: { w: 1600, h: 2560 },
  print: { w: 1875, h: 2775 },
}
