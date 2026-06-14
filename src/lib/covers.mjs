// Canonical cover definitions (the locked solution). One source of truth shared
// by render + print pipelines. See design.md for the rationale behind each value.
import { buildCover, coverLayout } from './layout.mjs'
import { palettes, text, families, canvas } from './tokens.mjs'
import { hazeField } from './motifs.mjs'

// Lead: warm near-black, typography-first, with a barely-noticeable self-similar
// haze FIELD (paper depth), not an object. (v5 — see changelog for the journey.)
export const leadPalette = palettes.ink
const leadType = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }
const comp = { titleScale: 1.06, subGap: 0.05, titleTopFrac: 0.125 } // massive title high, big gap, empty bottom

// haze field, with the text block carved out by reduced pattern frequency
function leadBack(w, h) {
  const m = Math.round(w * 0.095)
  const L = coverLayout({ palette: leadPalette, type: leadType, text, w, h, align: 'left', back: { defs: '', body: '' }, ...comp })
  const avoid = [
    { x: m * 0.5, y: L.title.top - L.title.size, w: w * 0.72, h: (L.title.lines.length - 1) * L.title.leading + L.title.size * 1.15 },
    { x: m * 0.6, y: L.sub.y - L.sub.size, w: w * 0.62, h: (L.sub.lines.length - 1) * L.sub.leading + L.sub.size * 1.5 },
    { x: m * 0.6, y: L.author.y - L.author.size, w: w * 0.34, h: L.author.size * 1.6 },
  ]
  return hazeField('lead', { w, h, color: '#A7895C', avoid, density: 1.0, blur: 0.85, seed: 3 })
}

/** Layout opts for the locked lead (shared by SVG render + outline pipeline). */
export function leadOpts(size = 'ebook') {
  const { w, h } = canvas[size]
  return { palette: leadPalette, type: leadType, text, w, h, align: 'left', ...comp, back: leadBack(w, h) }
}

/** The locked lead cover. size: 'ebook' | 'print' (geometry scales by width). */
export function buildLead(size = 'ebook') {
  return buildCover(leadOpts(size))
}
