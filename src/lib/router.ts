import { useMemo, useSyncExternalStore, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'

/** Home-page sections, in order. The numbers appear in the navigation and section rules. */
export const navItems = [
  { id: 'about', label: 'About', number: '01' },
  { id: 'work', label: 'Work', number: '02' },
  { id: 'experience', label: 'Experience', number: '03' },
  { id: 'skills', label: 'Skills', number: '04' },
  { id: 'education', label: 'Education', number: '05' },
  { id: 'contact', label: 'Contact', number: '06' },
] as const

export type SectionId = (typeof navItems)[number]['id']

export const sectionNumber = (id: SectionId) => navItems.find((item) => item.id === id)!.number

// Hash router: '#/projects/<slug>', '#/experience/<slug>'; anything else is the
// home page, where '#section' links are plain anchors.
export type Route =
  | { page: 'home'; section: string | null }
  | { page: 'project'; slug: string }
  | { page: 'experience'; slug: string }
  | { page: 'not-found' }

export function parseHash(hash: string): Route {
  let value = hash.replace(/^#/, '')
  try {
    value = decodeURIComponent(value)
  } catch {
    // Keep the raw value if it is not valid percent-encoding.
  }
  if (value === '' || value === '/') return { page: 'home', section: null }

  const project = /^\/projects\/([a-z0-9-]+)\/?$/.exec(value)
  if (project) return { page: 'project', slug: project[1] }

  const experience = /^\/experience\/([a-z0-9-]+)\/?$/.exec(value)
  if (experience) return { page: 'experience', slug: experience[1] }

  if (value.startsWith('/')) return { page: 'not-found' }
  return { page: 'home', section: value }
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getHash = () => window.location.hash

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  return useMemo(() => parseHash(hash), [hash])
}

export const projectHref = (slug: string) => `#/projects/${slug}`
export const experienceHref = (slug: string) => `#/experience/${slug}`
export const sectionHref = (id: string) => `#${id}`
/** Top of the home page. Also scrolls up when already on the home page. */
export const homeHref = '#top'

// Page changes use View Transitions when available: elements with the same
// view-transition-name (see `transitionName`) glide between pages.
export function enablePageTransitions(onLeaveHome: () => void) {
  const onClick = (event: MouseEvent) => {
    const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition
    if (!start || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
    if (!(link instanceof HTMLAnchorElement) || link.target) return
    const href = link.getAttribute('href')!
    const current = parseHash(window.location.hash)
    const next = parseHash(href)
    // Only page changes are animated; anchors within the home page scroll as usual.
    const samePage =
      next.page === current.page && ('slug' in next ? 'slug' in current && next.slug === current.slug : true)
    if (samePage) return

    event.preventDefault()
    if (current.page === 'home') onLeaveHome()
    start.call(document, () => {
      history.pushState(null, '', href)
      // Render the new page synchronously so the browser can capture it.
      flushSync(() => window.dispatchEvent(new HashChangeEvent('hashchange')))
    })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

/** Names shared by an element on two pages, so it morphs between them. */
export const transitionName = {
  projectImage: (slug: string) => `project-image-${slug}`,
  projectTitle: (slug: string) => `project-title-${slug}`,
  internshipTitle: (slug: string) => `internship-title-${slug}`,
  /** A project image: its name plus a class, so the card and banner crops blend (see global.css). */
  imageStyle: (slug: string) =>
    ({ viewTransitionName: `project-image-${slug}`, viewTransitionClass: 'project-image' }) as CSSProperties,
}
