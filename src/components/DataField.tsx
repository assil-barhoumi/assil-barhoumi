import { useEffect, useRef } from 'react'

/**
 * Hero background: points settle into clusters around moving centroids
 * (k-means style) and link to the mouse when it is near. Centroids avoid
 * elements marked `data-field-avoid`. Static frame for reduced motion.
 */
export function DataField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    return still ? drawStill(canvas, host, ctx) : animate(canvas, host, ctx)
  }, [])

  return <canvas ref={canvasRef} className="data-field" aria-hidden="true" />
}

/* Model */

interface Point {
  x: number
  y: number
  /** Cluster index, or -1 for noise (points that belong to no cluster). */
  k: number
  /** Offset from the cluster centre (members) or home position in 0–1 (noise). */
  ox: number
  oy: number
  delay: number
  speed: number
  phase: number
  f1: number
  f2: number
}

interface Cluster {
  x: number
  y: number
  tx: number
  ty: number
}

type RGB = [number, number, number]
type Rect = { left: number; top: number; right: number; bottom: number }

/** Areas to keep centroids out of: the marked elements, relative to the host, with a margin. */
function avoidRects(host: HTMLElement): Rect[] {
  const base = host.getBoundingClientRect()
  const margin = 44
  return [...host.querySelectorAll('[data-field-avoid]')].map((el) => {
    const r = el.getBoundingClientRect()
    return {
      left: r.left - base.left - margin,
      top: r.top - base.top - margin,
      right: r.right - base.left + margin,
      bottom: r.bottom - base.top + margin,
    }
  })
}

const TAU = Math.PI * 2
const POINTER_RADIUS = 150
const NEIGHBOURS = 6
const RESHUFFLE_EVERY = 9 // seconds

function gauss() {
  let u = 0
  let v = 0
  while (!u) u = Math.random()
  while (!v) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v)
}

const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

function readColour(name: string, fallback: RGB): RGB {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const hex = /^#([0-9a-f]{6})$/i.exec(value)
  if (!hex) return fallback
  const n = parseInt(hex[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`

/** Builds a field for a canvas of the given size (CSS pixels). */
function createField(width: number, height: number, avoid: () => Rect[]) {
  const wide = width >= 960
  const count = Math.round(Math.min(260, Math.max(70, (width * height) / 5200)))
  const k = wide ? 4 : 3
  const short = Math.min(width, height)

  // Centres go where there is no text, spaced apart; if the free space runs
  // out (a small screen), the spacing and then the text rule are relaxed.
  const centres = () => {
    const rects = avoid()
    const clear = (x: number, y: number) =>
      rects.every((r) => x * width < r.left || x * width > r.right || y * height < r.top || y * height > r.bottom)
    const out: { x: number; y: number }[] = []
    for (let tries = 0; out.length < k && tries < 1500; tries++) {
      const spacing = short * (tries < 600 ? 0.24 : tries < 1100 ? 0.16 : 0.1)
      const c = wide
        ? { x: 0.4 + Math.random() * 0.56, y: 0.14 + Math.random() * 0.78 }
        : { x: 0.1 + Math.random() * 0.8, y: 0.12 + Math.random() * 0.8 }
      if ((tries < 1300 && !clear(c.x, c.y)) || !out.every((o) => Math.hypot((o.x - c.x) * width, (o.y - c.y) * height) > spacing)) continue
      out.push(c)
    }
    while (out.length < k) out.push({ x: Math.random(), y: Math.random() })
    return out
  }

  const clusters: Cluster[] = centres().map((c) => ({ x: c.x, y: c.y, tx: c.x, ty: c.y }))
  const spreads = clusters.map(() => short * (0.04 + Math.random() * 0.035))

  const points: Point[] = Array.from({ length: count }, (_, i) => {
    const noise = Math.random() < 0.14
    const cluster = i % k
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      k: noise ? -1 : cluster,
      ox: noise ? Math.random() : gauss() * spreads[cluster] * 1.25,
      oy: noise ? Math.random() : gauss() * spreads[cluster],
      delay: 0.15 + Math.random() * 1.3,
      speed: 1.3 + Math.random() * 1.3,
      phase: Math.random() * TAU,
      f1: 0.35 + Math.random() * 0.5,
      f2: 0.35 + Math.random() * 0.5,
    }
  })

  /** Where a point wants to be at `time`, before the pointer pushes it. */
  const target = (p: Point, time: number) => {
    const wobbleX = Math.sin(time * p.f1 + p.phase) * 2.5
    const wobbleY = Math.cos(time * p.f2 + p.phase) * 2.5
    if (p.k < 0) return [p.ox * width + wobbleX, p.oy * height + wobbleY]
    const c = clusters[p.k]
    return [c.x * width + p.ox + wobbleX, c.y * height + p.oy + wobbleY]
  }

  return { width, height, points, clusters, centres, target }
}

type Field = ReturnType<typeof createField>

/* Drawing */

function draw(
  ctx: CanvasRenderingContext2D,
  field: Field,
  ink: RGB,
  accent: RGB,
  settled: number,
  pointer: { x: number; y: number } | null,
) {
  const { width, height, points, clusters } = field
  ctx.clearRect(0, 0, width, height)

  // Spokes from each centroid to its members, faint, once the clusters form.
  if (settled > 0) {
    ctx.lineWidth = 1
    ctx.strokeStyle = rgba(ink, 0.06 * settled)
    ctx.beginPath()
    for (const p of points) {
      if (p.k < 0) continue
      const c = clusters[p.k]
      ctx.moveTo(c.x * width, c.y * height)
      ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  }

  // Points: members brighter than noise; those near the pointer drawn later in mint.
  const near: { p: Point; d: number }[] = []
  for (const [alpha, members] of [
    [0.42, true],
    [0.2, false],
  ] as const) {
    ctx.fillStyle = rgba(ink, alpha)
    ctx.beginPath()
    for (const p of points) {
      if (p.k >= 0 !== members) continue
      if (pointer) {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y)
        if (d < POINTER_RADIUS) {
          near.push({ p, d })
          continue
        }
      }
      ctx.moveTo(p.x + 1.6, p.y)
      ctx.arc(p.x, p.y, 1.6, 0, TAU)
    }
    ctx.fill()
  }

  // Centroids: a soft glow, a ring and a small cross.
  if (settled > 0) {
    for (const c of clusters) {
      const x = c.x * width
      const y = c.y * height
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 34)
      glow.addColorStop(0, rgba(accent, 0.18 * settled))
      glow.addColorStop(1, rgba(accent, 0))
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, 34, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = rgba(accent, 0.85 * settled)
      ctx.lineWidth = 1.25
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, TAU)
      ctx.moveTo(x - 11, y)
      ctx.lineTo(x - 8, y)
      ctx.moveTo(x + 8, y)
      ctx.lineTo(x + 11, y)
      ctx.moveTo(x, y - 11)
      ctx.lineTo(x, y - 8)
      ctx.moveTo(x, y + 8)
      ctx.lineTo(x, y + 11)
      ctx.stroke()
    }
  }

  // The pointer's nearest neighbours: linked to it in mint.
  if (pointer && near.length) {
    near.sort((a, b) => a.d - b.d)
    ctx.lineWidth = 1
    for (const { p, d } of near.slice(0, NEIGHBOURS)) {
      ctx.strokeStyle = rgba(accent, 0.65 * (1 - d / POINTER_RADIUS))
      ctx.beginPath()
      ctx.moveTo(pointer.x, pointer.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    for (const { p, d } of near) {
      ctx.fillStyle = rgba(accent, 0.35 + 0.6 * (1 - d / POINTER_RADIUS))
      ctx.beginPath()
      ctx.arc(p.x, p.y, 2.2, 0, TAU)
      ctx.fill()
    }
  }
}

/** Sizes the canvas to its host, sharp on high-density screens. */
function fit(canvas: HTMLCanvasElement, host: HTMLElement, ctx: CanvasRenderingContext2D) {
  const { width, height } = host.getBoundingClientRect()
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.max(1, Math.round(width * dpr))
  canvas.height = Math.max(1, Math.round(height * dpr))
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { width, height }
}

const colours = () => ({
  ink: readColour('--ink', [238, 231, 215]),
  accent: readColour('--accent', [124, 240, 197]),
})

/** Watches the theme attribute so the field follows the edition. */
function onThemeChange(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

/* Reduced motion: one settled frame */

function drawStill(canvas: HTMLCanvasElement, host: HTMLElement, ctx: CanvasRenderingContext2D) {
  let field: Field | null = null
  let palette = colours()
  const render = () => {
    const { width, height } = fit(canvas, host, ctx)
    if (!field || Math.abs(field.width - width) > 40) field = createField(width, height, () => avoidRects(host))
    for (const p of field.points) [p.x, p.y] = field.target(p, 0)
    draw(ctx, field, palette.ink, palette.accent, 1, null)
  }
  render()
  const resize = new ResizeObserver(render)
  resize.observe(host)
  const stopTheme = onThemeChange(() => {
    palette = colours()
    render()
  })
  return () => {
    resize.disconnect()
    stopTheme()
  }
}

/* Animated field */

function animate(canvas: HTMLCanvasElement, host: HTMLElement, ctx: CanvasRenderingContext2D) {
  let { width, height } = fit(canvas, host, ctx)
  let field = createField(width, height, () => avoidRects(host))
  let palette = colours()
  let pointer: { x: number; y: number } | null = null
  let frame = 0
  let last = 0
  let time = 0
  let nextShuffle = RESHUFFLE_EVERY
  let visible = true

  const step = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
    last = now
    time += dt

    if (time > nextShuffle) {
      field.centres().forEach((c, i) => {
        field.clusters[i].tx = c.x
        field.clusters[i].ty = c.y
      })
      nextShuffle = time + RESHUFFLE_EVERY
    }
    const follow = 1 - Math.exp(-dt * 0.8)
    for (const c of field.clusters) {
      c.x += (c.tx - c.x) * follow
      c.y += (c.ty - c.y) * follow
    }

    for (const p of field.points) {
      if (time < p.delay) continue
      let [tx, ty] = field.target(p, time)
      if (pointer) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const d = Math.hypot(dx, dy)
        if (d > 0.01 && d < POINTER_RADIUS) {
          const push = (1 - d / POINTER_RADIUS) ** 2 * 22
          tx += (dx / d) * push
          ty += (dy / d) * push
        }
      }
      const k = 1 - Math.exp(-dt * p.speed)
      p.x += (tx - p.x) * k
      p.y += (ty - p.y) * k
    }

    draw(ctx, field, palette.ink, palette.accent, smoothstep(1.4, 3.4, time), pointer)
    frame = requestAnimationFrame(step)
  }

  const start = () => {
    if (frame || !visible || document.hidden) return
    last = 0
    frame = requestAnimationFrame(step)
  }
  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }

  // Only the mouse moves the field; touch scrolling should not.
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const box = canvas.getBoundingClientRect()
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top }
  }
  const onLeave = () => {
    pointer = null
  }
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)

  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  const seen = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  })
  seen.observe(host)

  // A new layout (rotation, resizing the window) gets a fresh field.
  const resize = new ResizeObserver(() => {
    const size = fit(canvas, host, ctx)
    if (Math.abs(size.width - width) > 40 || Math.abs(size.height - height) > 120) {
      ;({ width, height } = size)
      field = createField(width, height, () => avoidRects(host))
      time = 0
      nextShuffle = RESHUFFLE_EVERY
    }
  })
  resize.observe(host)

  const stopTheme = onThemeChange(() => {
    palette = colours()
  })

  start()
  return () => {
    stop()
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    seen.disconnect()
    resize.disconnect()
    stopTheme()
  }
}
