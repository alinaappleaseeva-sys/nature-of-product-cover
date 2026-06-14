// Two shelf mockups for step-back evaluation:
//   1) our cover among real-reference evocations (Atomic Habits, Thinking Fast & Slow,
//      Innovator's Dilemma, Lean Startup, a Stripe Press title)
//   2) our cover among faithful reconstructions of the 4 competitor covers
// References are stylized evocations (network/copyright); competitors are rebuilt
// from what was shared. All rendered at one height and stood on a shelf.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildLead } from '../src/lib/covers.mjs'

mkdirSync('explorations/shelf', { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const W = 400, H = 600 // recreation canvas (trade ~0.667)
const lines = (arr, x, y, lh, attrs) => arr.map((t, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${esc(t)}</text>`).join('')

// ---------- reference evocations ----------
function atomicHabits() {
  const cols = ['#E8B23A', '#E06C3B', '#C4402F', '#3F7E76', '#34506E']
  const chips = cols.map((c, i) => `<rect x="${64 + i * 30}" y="250" width="22" height="86" rx="2" fill="${c}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F3EFE6"/>
  ${lines(['Atomic', 'Habits'], 60, 150, 92, 'font-family="Inter Black" font-size="78" fill="#1A1A1A"')}
  ${chips}
  <text x="62" y="392" font-family="Inter Medium" font-size="16" fill="#444" letter-spacing="1">TINY CHANGES, REMARKABLE RESULTS</text>
  <text x="62" y="548" font-family="Inter Bold" font-size="26" fill="#1A1A1A">James Clear</text>
  </svg>`
}
function thinkingFastSlow() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FBFAF7"/>
  <g transform="rotate(-32 200 250)"><rect x="150" y="232" width="170" height="20" fill="#F2C141"/><polygon points="320,232 320,252 348,242" fill="#2A2A2A"/><rect x="150" y="232" width="16" height="20" fill="#E8A0A0"/></g>
  ${lines(['Thinking,', 'Fast and', 'Slow'], 58, 360, 64, 'font-family="Inter Bold" font-size="56" fill="#1A1A1A"')}
  <text x="60" y="556" font-family="Inter Medium" font-size="24" fill="#333">Daniel Kahneman</text>
  </svg>`
}
function innovatorsDilemma() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F0EBE1"/>
  <rect x="0" y="120" width="${W}" height="8" fill="#B23A2E"/>
  <text x="58" y="100" font-family="Inter Medium" font-size="17" fill="#B23A2E" letter-spacing="2">THE</text>
  ${lines(['Innovator’s', 'Dilemma'], 56, 250, 66, 'font-family="Fraunces Display" font-size="60" fill="#1E1E1E"')}
  <text x="58" y="388" font-family="Inter Book" font-size="16" fill="#555">When New Technologies Cause</text>
  <text x="58" y="410" font-family="Inter Book" font-size="16" fill="#555">Great Firms to Fail</text>
  <text x="58" y="552" font-family="Inter Bold" font-size="22" fill="#1E1E1E">Clayton M. Christensen</text>
  </svg>`
}
function leanStartup() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FAF8F3"/>
  <rect x="0" y="0" width="14" height="${H}" fill="#2E8B6F"/>
  ${lines(['THE', 'LEAN', 'STARTUP'], 56, 150, 78, 'font-family="Inter Black" font-size="64" fill="#16201C"')}
  <text x="58" y="420" font-family="Inter Book" font-size="15" fill="#555">How Today’s Entrepreneurs Use</text>
  <text x="58" y="440" font-family="Inter Book" font-size="15" fill="#555">Continuous Innovation</text>
  <text x="58" y="552" font-family="Inter Bold" font-size="24" fill="#16201C">Eric Ries</text>
  </svg>`
}
function stripePress() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ECE5D6"/>
  <circle cx="200" cy="170" r="64" fill="none" stroke="#7A6A4F" stroke-width="1.4"/>
  <circle cx="200" cy="170" r="40" fill="none" stroke="#7A6A4F" stroke-width="1.4"/>
  ${lines(['The Dream', 'Machine'], 200, 330, 58, 'text-anchor="middle" font-family="Fraunces Display" font-size="52" fill="#2A2418"')}
  <text x="200" y="556" text-anchor="middle" font-family="Inter Medium" font-size="18" fill="#5A5240" letter-spacing="2">M. MITCHELL WALDROP</text>
  </svg>`
}

// ---------- competitor reconstructions (faithful to what was shared) ----------
function compStrong() {
  // faint dendrite from a head silhouette at bottom
  let br = ''
  function bb(x, y, a, l, d) { const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; br += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; if (d > 0) { bb(x2, y2, a - 0.4, l * 0.72, d - 1); bb(x2, y2, a + 0.4, l * 0.72, d - 1) } }
  bb(200, 470, -Math.PI / 2, 42, 5)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#17130E"/>
  <path d="M120 600 Q200 470 280 600 Z" fill="#231d15"/>
  <g stroke="#9c8a63" stroke-width="0.8" opacity="0.5" fill="none">${br}</g>
  ${lines(['Nature', 'of', 'Product'], 48, 130, 78, 'font-family="Fraunces Display Light" font-size="74" fill="#EAD9B8"')}
  <text x="48" y="392" font-family="Fraunces Text" font-size="20" fill="#C49A57">How to Build Products So Valuable</text>
  <text x="48" y="418" font-family="Fraunces Text" font-size="20" fill="#C49A57">They Look Like Magic</text>
  <text x="48" y="560" font-family="Inter Medium" font-size="16" fill="#C49A57" letter-spacing="3">IVAN ZAMESIN</text>
  </svg>`
}
function compK1() {
  const node = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#2C3656" stroke-width="1.4"/>`
  const edge = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2C3656" stroke-width="1" opacity="0.7"/>`
  let g = edge(200, 96, 130, 150) + edge(200, 96, 200, 150) + edge(200, 96, 270, 150) + node(200, 96, 18) + node(130, 150, 13) + node(200, 150, 13) + node(270, 150, 13)
  const bx = [90, 200, 310]
  for (const x of bx) { g += edge(x, 430, x - 34, 486) + edge(x, 430, x + 34, 486) + node(x, 430, 12) + node(x - 34, 486, 8) + node(x + 34, 486, 8) }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#EFEBE1"/>${g}
  ${lines(['Nature of', 'Product'], 200, 232, 62, 'text-anchor="middle" font-family="Fraunces Display" font-size="54" fill="#2C3656"')}
  <text x="200" y="332" text-anchor="middle" font-family="Inter Book" font-size="14" fill="#4a5168">How to Build Products So Valuable</text>
  <text x="200" y="556" text-anchor="middle" font-family="Inter Medium" font-size="15" fill="#2C3656" letter-spacing="2">IVAN ZAMESIN</text>
  </svg>`
}
function compK2() {
  let f = ''
  for (let i = 0; i < 4; i++) { const m = 40 + i * 44; f += `<rect x="${m}" y="${m + 10}" width="${W - 2 * m}" height="${H - 2 * (m + 10)}" fill="none" stroke="#9B2D2A" stroke-width="1.4"/>` }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#EFEAE0"/>${f}
  ${lines(['Nature of', 'Product'], 200, 286, 60, 'text-anchor="middle" font-family="Fraunces Display" font-size="52" fill="#9B2D2A"')}
  <text x="200" y="372" text-anchor="middle" font-family="Inter Book" font-size="13" fill="#3a3a3a">How to Build Products So Valuable</text>
  <text x="200" y="556" text-anchor="middle" font-family="Inter Medium" font-size="14" fill="#3a3a3a" letter-spacing="2">IVAN ZAMESIN</text>
  </svg>`
}
function compK3() {
  // approximate romanesco: spiral cluster of small cones
  let cones = ''
  for (let i = 0; i < 90; i++) { const a = i * 2.399, r = 8 + i * 1.7, x = 200 + Math.cos(a) * r * 0.5, y = 430 - Math.sin(a) * r * 0.42, s = 16 - i * 0.12; if (s > 3) cones += `<polygon points="${x},${y - s} ${x - s * 0.7},${y + s * 0.6} ${x + s * 0.7},${y + s * 0.6}" fill="none" stroke="#CFC7AE" stroke-width="0.7" opacity="0.8"/>` }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#212a1f"/>${cones}
  ${lines(['Nature of', 'Product'], 200, 120, 60, 'text-anchor="middle" font-family="Fraunces Display" font-size="52" fill="#E7E0CC"')}
  <text x="200" y="210" text-anchor="middle" font-family="Fraunces Text" font-size="14" fill="#B9B79C">How to Build Products So Valuable</text>
  <text x="200" y="560" text-anchor="middle" font-family="Inter Medium" font-size="14" fill="#CFC7AE" letter-spacing="2">IVAN ZAMESIN</text>
  </svg>`
}

// ---------- compose a shelf ----------
function shelf(items, file) {
  const HH = 560
  const tiles = items.map((it) => {
    const isOurs = it.ours
    const ratio = isOurs ? 2560 / 1600 : H / W
    const cw = Math.round(HH / ratio)
    const buf = png(it.svg, isOurs ? cw : Math.round(cw)) // render at target width
    return { ...it, cw, ch: HH, buf }
  })
  const pad = 56, gap = 30
  const totalW = tiles.reduce((s, t) => s + t.cw, 0) + gap * (tiles.length - 1)
  const mW = totalW + pad * 2
  const baseY = 70 + HH
  const mH = baseY + 96
  let x = pad
  let body = ''
  for (const t of tiles) {
    const y = 70
    // soft shadow
    body += `<ellipse cx="${x + t.cw / 2}" cy="${baseY + 14}" rx="${t.cw * 0.46}" ry="12" fill="#000" opacity="0.16"/>`
    body += `<image x="${x}" y="${y}" width="${t.cw}" height="${t.ch}" href="data:image/png;base64,${b64(t.buf)}"/>`
    body += `<rect x="${x}" y="${y}" width="${t.cw}" height="${t.ch}" fill="none" stroke="#00000018" stroke-width="1"/>`
    if (t.ours) {
      body += `<rect x="${x - 5}" y="${y - 5}" width="${t.cw + 10}" height="${t.ch + 10}" fill="none" stroke="#1F6F5B" stroke-width="3"/>`
      body += `<text x="${x + t.cw / 2}" y="${baseY + 56}" text-anchor="middle" font-family="Inter Bold" font-size="20" fill="#1F6F5B">OURS</text>`
    } else {
      body += `<text x="${x + t.cw / 2}" y="${baseY + 52}" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#666">${esc(t.label)}</text>`
    }
    x += t.cw + gap
  }
  const shelfY = baseY + 2
  const bg = `<rect width="${mW}" height="${mH}" fill="#D7D1C6"/><rect x="0" y="${shelfY}" width="${mW}" height="6" fill="#9c948420"/><rect x="0" y="${shelfY}" width="${mW}" height="2" fill="#0000002a"/>`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}" viewBox="0 0 ${mW} ${mH}">${bg}${body}</svg>`
  writeFileSync(`explorations/shelf/${file}`, png(svg, Math.min(mW * 2, 3400)))
  console.log(`wrote explorations/shelf/${file}  (${tiles.length} books)`)
}

const ours = { ours: true, label: 'OURS', svg: buildLead('ebook') }

shelf([
  { label: 'Atomic Habits', svg: atomicHabits() },
  { label: 'Thinking, Fast & Slow', svg: thinkingFastSlow() },
  ours,
  { label: "Innovator's Dilemma", svg: innovatorsDilemma() },
  { label: 'The Lean Startup', svg: leanStartup() },
  { label: 'Stripe Press', svg: stripePress() },
], 'shelf-references.png')

shelf([
  { label: 'Competitor (strong)', svg: compStrong() },
  { label: 'K1 node-graph', svg: compK1() },
  ours,
  { label: 'K2 frames', svg: compK2() },
  { label: 'K3 romanesco', svg: compK3() },
], 'shelf-competitors.png')
