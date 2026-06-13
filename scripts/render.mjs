// SVG → PNG previews (RGB). Run from repo root: `npm run render`.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { palettes, text, fonts, canvas } from '../src/lib/tokens.mjs'

mkdirSync('exports/ebook', { recursive: true })
mkdirSync('exports/thumbnails', { recursive: true })

const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: fonts.serif }
const { w, h } = canvas.ebook

function png(svg, width) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
}

for (const key of Object.keys(palettes)) {
  const svg = buildCover({ palette: palettes[key], fonts, text, w, h, align: 'left' })
  writeFileSync(`exports/ebook/foundation-${key}.svg`, svg)
  writeFileSync(`exports/ebook/foundation-${key}.png`, png(svg, w))
  writeFileSync(`exports/thumbnails/foundation-${key}-120.png`, png(svg, 120))
  console.log(`rendered foundation-${key} (${palettes[key].name})`)
}
