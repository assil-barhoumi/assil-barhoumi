import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

/** 'dark' is the midnight edition (the default); 'light' is the paper edition. */
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DEFAULT_THEME: Theme = 'dark'

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function store(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The toggle
    // still works for this visit.
  }
}

/** The theme set before first paint by the inline script in index.html. */
function initialTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return readStored() ?? DEFAULT_THEME
}

type ViewTransitionStart = (update: () => void) => { ready: Promise<void>; finished: Promise<void> }

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const current = useRef(theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a101c' : '#f3eee3')
  }, [theme])

  /** Switches theme, revealing it in a circle from `origin` when supported. */
  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = current.current === 'dark' ? 'light' : 'dark'
    const apply = () => {
      current.current = next
      document.documentElement.dataset.theme = next
      flushSync(() => setTheme(next))
      store(next)
    }

    const start = (document as Document & { startViewTransition?: ViewTransitionStart }).startViewTransition
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!start || reduced || !origin) {
      apply()
      return
    }

    const root = document.documentElement
    root.classList.add('theme-switching')
    const transition = start.call(document, apply)
    transition.ready
      .then(() => {
        const { x, y } = origin
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
    transition.finished.finally(() => root.classList.remove('theme-switching')).catch(() => {})
  }, [])

  return { theme, toggle }
}
