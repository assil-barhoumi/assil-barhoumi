import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Id of the section in the middle of the viewport, for the active nav link. */
export function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key, enabled])

  return enabled ? active : null
}

/** Sets the document title and meta description for the current page. */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description
  }, [title, description])
}

/** True once the element has scrolled into view. */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const element = ref.current
    if (!element || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, inView])
  return [ref, inView] as const
}

/** Whether small entrance animations should run: not for reduced motion. */
export function useMotionAllowed() {
  return !usePrefersReducedMotion() && typeof IntersectionObserver !== 'undefined'
}

const finePointer = () =>
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Sets two CSS variables from the mouse position over an element; `x` and `y`
 * run from -0.5 to 0.5 across it. Mouse only, never for reduced motion.
 */
function usePointerVars(names: [string, string], flag: string, compute: (x: number, y: number, box: DOMRect) => string[]) {
  return useMemo(
    () => ({
      onPointerMove(event: PointerEvent<HTMLElement>) {
        if (event.pointerType !== 'mouse' || !finePointer()) return
        const el = event.currentTarget
        const box = el.getBoundingClientRect()
        const x = (event.clientX - box.left) / box.width - 0.5
        const y = (event.clientY - box.top) / box.height - 0.5
        compute(x, y, box).forEach((value, i) => el.style.setProperty(names[i], value))
        el.dataset[flag] = ''
      },
      onPointerLeave(event: PointerEvent<HTMLElement>) {
        const el = event.currentTarget
        names.forEach((name) => el.style.removeProperty(name))
        delete el.dataset[flag]
      },
    }),
    [names, flag, compute],
  )
}

const tiltVars: [string, string] = ['--tilt-x', '--tilt-y']
const tilt = (x: number, y: number) => [`${(-y * 10).toFixed(2)}deg`, `${(x * 10).toFixed(2)}deg`]

const magneticVars: [string, string] = ['--mag-x', '--mag-y']
const pull = (offset: number) => `${Math.max(-9, Math.min(9, offset * 0.28)).toFixed(1)}px`
const magnetic = (x: number, y: number, box: DOMRect) => [pull(x * box.width), pull(y * box.height)]

/** Project images tilt slightly towards the mouse. */
export const useTilt = () => usePointerVars(tiltVars, 'tilting', tilt)

/** Buttons lean slightly towards the mouse. */
export const useMagnetic = () => usePointerVars(magneticVars, 'magnetic', magnetic)
