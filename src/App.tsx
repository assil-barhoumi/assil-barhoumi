import { useEffect, useRef, type MouseEvent } from 'react'
import { Footer, Header } from './components/Layout'
import { ButtonLink } from './components/ui'
import { experience, profile, projects } from './data'
import { About, Education, Skills } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { ExperiencePage } from './pages/ExperiencePage'
import { ProjectPage } from './pages/ProjectPage'
import { enablePageTransitions, homeHref, sectionHref, useRoute, type Route } from './lib/router'
import { useTheme } from './lib/theme'
import { useDocumentMeta } from './lib/hooks'

type HomeState = { scrollY?: number } | null

/** Remember where the visitor was on the home page, so Back returns them there. */
function rememberHomeScroll() {
  const state = (history.state ?? {}) as Record<string, unknown>
  history.replaceState({ ...state, scrollY: window.scrollY }, '')
}

function focusWithoutScroll(element: Element | null | undefined) {
  if (element instanceof HTMLElement) element.focus({ preventScroll: true })
}

export default function App() {
  const route = useRoute()
  const { theme, toggle } = useTheme()
  const previous = useRef<Route['page'] | null>(null)

  // Save the scroll position before any in-page link takes the visitor away from the home page.
  useEffect(() => {
    if (route.page !== 'home') return
    const onClick = (event: globalThis.MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (link) rememberHomeScroll()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [route.page])

  // Animated page changes where the browser supports them.
  useEffect(() => enablePageTransitions(rememberHomeScroll), [])

  // Scroll and focus handling when the route changes.
  useEffect(() => {
    const from = previous.current
    previous.current = route.page
    const arrivedFromElsewhere = from !== route.page

    if (route.page !== 'home') {
      if (from !== null || route.page === 'not-found') window.scrollTo({ top: 0, behavior: 'instant' })
      if (from !== null) focusWithoutScroll(document.getElementById('page-title'))
      return
    }

    // Same page: the browser already scrolled to the anchor.
    if (!arrivedFromElsewhere) return

    // Coming back (e.g. with the Back button) to a home-page entry the visitor
    // left from: restore their exact position.
    const saved = (history.state as HomeState)?.scrollY
    if (from !== null && typeof saved === 'number') {
      window.scrollTo({ top: saved, behavior: 'instant' })
      return
    }
    if (route.section) {
      const target = document.getElementById(route.section)
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' })
        if (from !== null) focusWithoutScroll(target.querySelector('h1, h2'))
        return
      }
    }
    if (from !== null) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const main = document.getElementById('main')
    main?.focus()
    main?.scrollIntoView({ block: 'start' })
  }

  const project = route.page === 'project' ? projects.find((p) => p.slug === route.slug) : undefined
  // Entries with a case study have no details page of their own.
  const internship =
    route.page === 'experience' ? experience.find((e) => e.slug === route.slug && !e.project) : undefined

  return (
    <>
      <div className="grid-overlay" aria-hidden="true">
        <div className="container grid-overlay-columns">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
      <a href="#main" className="skip-link" onClick={skipToContent}>
        Skip to content
      </a>
      <Header route={route} theme={theme} onToggleTheme={toggle} />
      <main id="main" tabIndex={-1}>
        {route.page === 'home' && <HomePage />}
        {route.page === 'project' && (project ? <ProjectPage key={project.slug} project={project} /> : <NotFoundPage />)}
        {route.page === 'experience' &&
          (internship ? <ExperiencePage key={internship.slug} entry={internship} /> : <NotFoundPage />)}
        {route.page === 'not-found' && <NotFoundPage />}
      </main>
      <Footer />
    </>
  )
}

function HomePage() {
  useDocumentMeta(`${profile.name} — ${profile.headline}`, profile.description)
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </>
  )
}

function NotFoundPage() {
  useDocumentMeta(`Page not found — ${profile.name}`, profile.description)

  return (
    <div className="container not-found">
      <p className="mono not-found-code">Error 404</p>
      <h1 id="page-title" tabIndex={-1} className="not-found-title">
        Page not found
      </h1>
      <p className="not-found-text">
        This address does not match any page on the site. The project may have been renamed, or the link may be
        incomplete.
      </p>
      <div className="not-found-actions">
        <ButtonLink variant="primary" href={homeHref}>
          Go to the home page
        </ButtonLink>
        <ButtonLink href={sectionHref('work')}>See selected work</ButtonLink>
      </div>
    </div>
  )
}
