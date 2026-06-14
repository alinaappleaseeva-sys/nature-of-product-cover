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

// ---------- lit dendrites (composition + volume) ----------
// A sparse grove of self-similar dendrites with a real light source: each segment is
// shaded by its distance to the light, so one dendrite reads lit and the rest fall
// into shadow → volume, not flat fog. Heights are composed (low / medium / one tall
// focal) to give the picture a centre.
export function litDendrites(uid, {
  w, h, light, dendrites, blur = 2, fadeTopFrac = 0.6,
  branchAngle = 0.46, ratio = 0.72, strokeW = 1.1, jitter = 0.08, gamma = 1.6, extra = 0,
  lightColor = '#EAD9B8', shadow = '#2b3a30', maxOpacity = 0.5, buckets = 7, glowOpacity = 0.2,
}) {
  const seg = Array.from({ length: buckets }, () => [])
  // brightness falls off with distance to the light, raised to gamma for contrast
  const bri = (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - light.x, y - light.y) / light.r), gamma)
  for (const dn of dendrites) {
    const rnd = mulberry32(dn.seed || 1)
    const branch = (x, y, a, len, d) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len
      const b = (bri(x, y) + bri(x2, y2)) / 2
      seg[Math.min(buckets - 1, Math.floor(b * buckets))].push(`M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`)
      if (d <= 0) return
      // two main children + an occasional third for Lichtenberg-like density
      const kids = [-1, 1]
      if (rnd() < extra) kids.push((rnd() - 0.5) * 2)
      for (const s of kids) branch(x2, y2, a + s * branchAngle + (rnd() - 0.5) * jitter, len * ratio, d - 1)
    }
    branch(dn.x * w, (dn.baseY ?? 0.99) * h, -Math.PI / 2 + (dn.lean || 0), dn.reach * h, dn.depth)
  }
  const fid = `ld-${uid}`, mid = `ldm-${uid}`, gid = `ldg-${uid}`
  let defs = `<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${blur}"/></filter>`
  defs += `<linearGradient id="${mid}-g" x1="0" y1="${h}" x2="0" y2="${fadeTopFrac * h}" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#000"/></linearGradient><mask id="${mid}"><rect width="${w}" height="${h}" fill="url(#${mid}-g)"/></mask>`
  defs += `<radialGradient id="${gid}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${lightColor}" stop-opacity="${glowOpacity}"/><stop offset="55%" stop-color="${lightColor}" stop-opacity="${(glowOpacity * 0.25).toFixed(3)}"/><stop offset="100%" stop-color="${lightColor}" stop-opacity="0"/></radialGradient>`
  let body = `<g mask="url(#${mid})"><ellipse cx="${light.x}" cy="${light.y}" rx="${light.r * 0.95}" ry="${light.r * 0.72}" fill="url(#${gid})"/><g filter="url(#${fid})" fill="none" stroke-linecap="round">`
  for (let i = 0; i < buckets; i++) {
    if (!seg[i].length) continue
    const b = (i + 0.5) / buckets
    const col = mix(shadow, lightColor, Math.pow(b, 0.8))
    const op = (0.04 + maxOpacity * Math.pow(b, 1.35)).toFixed(3)
    const sw = (strokeW * (0.8 + 0.6 * b)).toFixed(2)
    body += `<path d="${seg[i].join(' ')}" stroke="${col}" stroke-width="${sw}" opacity="${op}"/>`
  }
  return { defs, body: body + '</g></g>' }
}

// ---------- haze FIELD (paper-depth / self-similar dust) ----------
// Not an object and not one centre: an all-over field of tiny self-similar sprigs,
// distributed in self-similar clusters, in 2–3 low-contrast depth layers. Frequency
// (not just opacity) is reduced around the text via a density mask, so the type sits
// in genuinely quieter air. Reads as depth/grain you can't quite name.
export function hazeField(uid, {
  w, h, color = '#9A7B4F', avoid = [], density = 1, blur = 0.8, seed = 1,
}) {
  const distRect = (px, py, r) => {
    const dx = Math.max(r.x - px, 0, px - (r.x + r.w))
    const dy = Math.max(r.y - py, 0, py - (r.y + r.h))
    return Math.hypot(dx, dy)
  }
  const inner = w * 0.02, falloff = w * 0.11
  const keep = (px, py, rnd) => {
    let d = Infinity
    for (const r of avoid) d = Math.min(d, distRect(px, py, r))
    const p = Math.max(0, Math.min(1, (d - inner) / falloff))
    return rnd() < p
  }
  // a tiny self-similar sprig (micro fractal) at (x,y)
  const sprig = (x, y, ang, len, d, acc) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len
    acc.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`)
    if (d <= 0) return
    sprig(x2, y2, ang - 0.5, len * 0.68, d - 1, acc)
    sprig(x2, y2, ang + 0.5, len * 0.68, d - 1, acc)
  }
  // jittered grid → even coverage (no dead voids), organic via jitter. Self-similarity
  // lives in the sprig micro-fractals and the multi-scale layers, not in clumping.
  const layerPoints = (n, rnd) => {
    const aspect = h / w
    const cols = Math.max(2, Math.round(Math.sqrt(n / aspect)))
    const rows = Math.max(2, Math.round(cols * aspect))
    const cw = w / cols, chh = h / rows
    const pts = []
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push([(c + 0.12 + 0.76 * rnd()) * cw, (r + 0.12 + 0.76 * rnd()) * chh])
    return pts
  }
  // far (tiny, faint) → mid → near (larger, locally stronger)
  const layers = [
    { n: Math.round(220 * density), len: 7, depth: 3, op: 0.030 * density, sw: 0.7 },
    { n: Math.round(120 * density), len: 12, depth: 3, op: 0.050 * density, sw: 0.8 },
    { n: Math.round(64 * density), len: 19, depth: 4, op: 0.075 * density, sw: 0.9 },
  ]
  const fid = `hf-${uid}`
  const defs = `<filter id="${fid}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter>`
  let body = `<g filter="url(#${fid})" fill="none" stroke="${color}" stroke-linecap="round">`
  let li = 0
  for (const L of layers) {
    const rnd = mulberry32(seed + li * 97)
    const acc = []
    for (const [px, py] of layerPoints(L.n, rnd)) {
      if (px < 0 || px > w || py < 0 || py > h) continue
      if (!keep(px, py, rnd)) continue
      sprig(px, py, rnd() * Math.PI * 2, L.len, L.depth, acc)
    }
    body += `<path d="${acc.join(' ')}" stroke-width="${L.sw}" opacity="${Math.min(0.16, L.op).toFixed(3)}"/>`
    li++
  }
  return { defs, body: body + '</g>' }
}

// ---------- subtle node-graph (fractal branching, subordinate) ----------
// Small cream nodes + thin edges, recursive 4–5 levels, confined to the lower band.
// Kept subliminal (low opacity) so typography always leads (skill: fractal subordinate).
export function nodeGraph(uid, {
  w, h, seed = 1, regionTop = 0.55,
  roots = 3, depth = 5, childMin = 2, childExtra = 0.0, spread = 0.55, ratio = 0.62,
  circleColor = '#EEE4D0', circleOp = 0.09, lineColor = '#EEE4D0', lineOp = 0.06, lineW = 0.5,
  avoid = [],
}) {
  const rnd = mulberry32(seed)
  const yTop = regionTop * h, yBot = 0.99 * h
  const len0 = (yBot - yTop) * 0.17
  const nodes = [], edges = []
  const inAvoid = (x, y) => avoid.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)
  const branch = (x, y, ang, len, d) => {
    nodes.push([x, y, depth - d])
    if (d <= 0) return
    const k = childMin + (rnd() < childExtra ? 1 : 0)
    for (let i = 0; i < k; i++) {
      const da = (i - (k - 1) / 2) * spread + (rnd() - 0.5) * 0.18
      const a = ang + da
      const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len
      edges.push([x, y, nx, ny])
      branch(nx, ny, a, len * ratio, d - 1)
    }
  }
  for (let i = 0; i < roots; i++) {
    const rx = w * ((i + 0.5) / roots) + (rnd() - 0.5) * w * 0.12
    branch(rx, yTop + (rnd() * 0.04) * h, Math.PI / 2 + (rnd() - 0.5) * 0.4, len0, depth)
  }
  const edgeD = edges
    .filter(([x1, y1, x2, y2]) => !inAvoid(x1, y1) && !inAvoid(x2, y2))
    .map(([x1, y1, x2, y2]) => `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`)
    .join(' ')
  const circs = nodes
    .filter(([x, y]) => !inAvoid(x, y))
    .map(([x, y, lvl]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2 - lvl / depth).toFixed(2)}"/>`)
    .join('')
  const body = `<g>
    <path d="${edgeD}" fill="none" stroke="${lineColor}" stroke-width="${lineW}" opacity="${lineOp}"/>
    <g fill="${circleColor}" opacity="${circleOp}">${circs}</g>
  </g>`
  return { defs: '', body }
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
