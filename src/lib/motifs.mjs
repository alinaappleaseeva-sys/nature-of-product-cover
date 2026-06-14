// Motif library. Every motif is SUPPORT material: atmospheric, low-contrast,
// typography-safe. Lessons from competitor analysis baked in:
//  - no visible node-graph (K1)  - no outline frames (K2)  - no hero illustration (K3)
//  - no literal head/brain. Self-similarity is FELT, not diagrammed.

// ---------- colour helpers ----------
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)))
const hex2rgb = (h) => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const rgb2hex = (r, g, b) =>
  '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')
export function mix(aHex, bHex, t) {
  const a = hex2rgb(aHex), b = hex2rgb(bHex)
  return rgb2hex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
}
export const lighten = (h, t) => mix(h, '#ffffff', t)
export const darken = (h, t) => mix(h, '#000000', t)

// ---------- seeded PRNG (deterministic renders) ----------
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- soft light pool (depth, not poster) ----------
export function softLight(uid, { w, h, cx, cy, rx, ry, color, opacity }) {
  const id = `lp-${uid}`
  const defs = `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
  </radialGradient>`
  const body = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`
  return { defs, body }
}

// ---------- graph-fractal HAZE ----------
// A self-similar branching field rooted along the bottom edge, growing upward.
// Blurred + very low opacity so it reads as atmosphere, never nodes or a single
// "tree growing from a thing".
//   mode 'organic'    — softly irregular (risk: reads as a literal tree)
//   mode 'structured' — fixed angles/ratios → reads as self-similar STRUCTURE
//   fadeTopFrac       — vertical fade: dense at bottom, gone by this y-fraction
//   reach/depth/roots — control how high it climbs and how dense the field is
export function hazeFractal(uid, {
  w, h, color, opacity = 0.1, blur = 3, seed = 7,
  mode = 'organic', reach = 0.15, depth = 7, roots = 5,
  fadeTopFrac = null, strokeW = 1.4,
  jitter = 0.06, snap = false, links = 0, angle = 0.38,
}) {
  const rnd = mulberry32(seed)
  const segs = []
  const nodes = []
  const ANG = angle // fixed branch half-angle for structured mode
  const RATIO = 0.72
  const SNAP = Math.PI / 12 // 15° grid
  function branch(x, y, ang, len, d) {
    const x2 = x + Math.cos(ang) * len
    const y2 = y + Math.sin(ang) * len
    segs.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`)
    nodes.push({ x: x2, y: y2, d })
    if (d <= 0) return
    if (mode === 'structured') {
      for (const s of [-1, 1]) {
        let na = ang + s * ANG + (rnd() - 0.5) * jitter
        if (snap) na = Math.round(na / SNAP) * SNAP
        branch(x2, y2, na, len * RATIO, d - 1)
      }
    } else {
      const kids = 2 + (rnd() < 0.4 ? 1 : 0)
      for (let i = 0; i < kids; i++) {
        const spread = 0.32 + rnd() * 0.30
        const da = (i - (kids - 1) / 2) * spread + (rnd() - 0.5) * 0.18
        branch(x2, y2, ang + da, len * (0.70 + rnd() * 0.10), d - 1)
      }
    }
  }
  for (let i = 0; i < roots; i++) {
    const jitter = mode === 'structured' ? (rnd() - 0.5) * 0.12 : (rnd() - 0.5) * 0.6
    const rx = w * (0.06 + 0.88 * ((i + (mode === 'structured' ? 0.5 : rnd() * 0.6)) / roots))
    const baseAng = -Math.PI / 2 + (mode === 'structured' ? 0 : jitter)
    branch(rx, h * (0.99 + rnd() * 0.01), baseAng, h * (reach + rnd() * 0.03), depth)
  }
  // graph edges: connect nearby mid-canopy nodes → loops (a tree has none) so the
  // field reads as a NETWORK/GRAPH, not foliage. Kills the biological connotation.
  if (links > 0) {
    const band = nodes.filter((n) => n.d >= 2 && n.d <= 5)
    const thr = w * 0.05
    for (const a of band) {
      if (rnd() > links) continue
      let best = null, bd = thr
      for (const b of band) {
        if (a === b) continue
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (dist > w * 0.012 && dist < bd) { bd = dist; best = b }
      }
      if (best) segs.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${best.x.toFixed(1)} ${best.y.toFixed(1)}`)
    }
  }
  const fid = `hz-${uid}`
  let defs = `<filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blur}"/></filter>`
  let maskAttr = ''
  if (fadeTopFrac != null) {
    const mid = `hzm-${uid}`
    defs += `<linearGradient id="${mid}-g" x1="0" y1="${h}" x2="0" y2="${h * fadeTopFrac}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#000"/></linearGradient>
      <mask id="${mid}"><rect width="${w}" height="${h}" fill="url(#${mid}-g)"/></mask>`
    maskAttr = ` mask="url(#${mid})"`
  }
  const body = `<g${maskAttr}><g filter="url(#${fid})" opacity="${opacity}" stroke="${color}" stroke-width="${strokeW}" fill="none" stroke-linecap="round">
    <path d="${segs.join(' ')}"/>
  </g></g>`
  return { defs, body }
}

// ---------- geometric SELF-SIMILARITY (depth/light, not frames) ----------
// Golden-rectangle subdivision: carve a square off the long side repeatedly.
// Each carved block gets a tiny tonal step → a self-similar field of light,
// asymmetric, soft. No outlines.
export function geoDepth(uid, { w, h, palette, steps = 9, strength = 0.05 }) {
  const toward = palette.dark ? '#ffffff' : '#000000'
  let x = 0, y = 0, rw = w, rh = h
  let side = 'left'
  const rects = []
  for (let i = 0; i < steps; i++) {
    const t = (strength * (i + 1)) / steps
    const fill = mix(palette.bg, toward, t)
    let bx = x, by = y, bw = rw, bh = rh
    if (rw >= rh) {
      const s = rh
      if (side === 'left') { bx = x; bw = s; x += s }
      else { bx = x + rw - s; bw = s }
      rw -= s
      side = side === 'left' ? 'right' : 'left'
    } else {
      const s = rw
      if (side === 'left') { by = y; bh = s; y += s }
      else { by = y + rh - s; bh = s }
      rh -= s
      side = side === 'left' ? 'right' : 'left'
    }
    rects.push(`<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${fill}"/>`)
  }
  const fid = `gd-${uid}`
  const defs = `<filter id="${fid}"><feGaussianBlur stdDeviation="${Math.round(w * 0.012)}"/></filter>`
  // blur the whole field heavily so blocks read as soft light, never as frames
  const body = `<g filter="url(#${fid})" opacity="0.9">${rects.join('')}</g>`
  return { defs, body }
}
