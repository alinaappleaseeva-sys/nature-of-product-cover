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
  titleLines: ['Nature of', 'Product'],
  subtitle: 'How to Build Products So Valuable They Look Like Magic',
  subtitleLines: ['How to Build Products So Valuable', 'They Look Like Magic'],
  author: 'Ivan Zamesin',
}

// ≤ 2 families. Serif leads the title; restrained grotesque for subtitle/author.
export const fonts = {
  serif: 'Fraunces',
  sans: 'Inter',
}

// Front-cover concept / ebook ratio is the priority (1.6:1).
// Print (6.25×9.25in @300dpi = 1875×2775) is adapted later in Block C.
export const canvas = {
  ebook: { w: 1600, h: 2560 },
  print: { w: 1875, h: 2775 },
}
