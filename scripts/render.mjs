// Canonical build: render the locked lead (and fallback) to master SVG + RGB PNG
// previews. Run from repo root: `npm run render`.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildLead } from '../src/lib/covers.mjs'
import { canvas } from '../src/lib/tokens.mjs'

mkdirSync('src/covers', { recursive: true })
mkdirSync('exports/ebook', { recursive: true })
mkdirSync('exports/thumbnails', { recursive: true })

const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const { w } = canvas.ebook

// Lead — master (live text) + full-res RGB + thumbnail
const lead = buildLead('ebook')
writeFileSync('src/covers/ebook.svg', lead)                              // master, live text
writeFileSync('exports/ebook/nature-of-product-ebook.png', png(lead, w)) // 1600×2560 RGB
writeFileSync('exports/thumbnails/nature-of-product-120.png', png(lead, 120))

console.log('rendered lead (ebook 1600×2560) + thumbnail')
