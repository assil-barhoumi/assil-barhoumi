import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { profile } from '../data'
import { useActiveSection } from '../lib/hooks'
import { navItems, homeHref, sectionHref, type Route } from '../lib/router'
import type { Theme } from '../lib/theme'
import { Icon } from './Icon'
import styles from './Layout.module.css'


const ids = navItems.map((item) => item.id)

/** True once the page has scrolled away from the very top. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 8)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return scrolled
}

interface HeaderProps {
  route: Route
  theme: Theme
  onToggleTheme: (origin?: { x: number; y: number }) => void
}

export function Header({ route, theme, onToggleTheme }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const onHome = route.page === 'home'
  const visible = useActiveSection(ids, onHome)
  const active = onHome ? visible : route.page === 'project' ? 'work' : route.page === 'experience' ? 'experience' : null
  const scrolled = useScrolled()

  // Close the mobile menu on Escape or a click outside it.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panel.current?.contains(target) && !menuButton.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // Close it when the layout grows past the mobile breakpoint.
  useEffect(() => {
    const media = window.matchMedia?.('(min-width: 60rem)')
    if (!media) return
    const onChange = (event: MediaQueryListEvent) => event.matches && setOpen(false)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const nextTheme = theme === 'dark' ? 'paper (light)' : 'midnight (dark)'

  const links = navItems.map((item) => (
    <li key={item.id}>
      <a
        href={sectionHref(item.id)}
        className={styles.link}
        aria-current={active === item.id ? 'location' : undefined}
        onClick={() => setOpen(false)}
      >
        <span className={styles.number} aria-hidden="true">
          {item.number}
        </span>
        {item.label}
      </a>
    </li>
  ))

  return (
    <header className={[styles.header, (scrolled || open) && styles.solid].filter(Boolean).join(' ')}>
      <div className={`container ${styles.bar}`}>
        <a href={homeHref} className={styles.brand} onClick={() => setOpen(false)}>
          <span>{profile.name}</span>
        </a>

        <nav aria-label="Main" className={styles.desktopNav}>
          <ul className={styles.links}>{links}</ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={(event) => {
              // The new edition opens from the button; from its centre when using the keyboard.
              const box = event.currentTarget.getBoundingClientRect()
              const fromPointer = event.detail > 0
              onToggleTheme({
                x: fromPointer ? event.clientX : box.left + box.width / 2,
                y: fromPointer ? event.clientY : box.top + box.height / 2,
              })
            }}
            aria-label={`Switch to the ${nextTheme} edition`}
            title={`Switch to the ${nextTheme} edition`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
          <button
            ref={menuButton}
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
            <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {/* Reading progress: a thin line that grows across the header as the page scrolls. */}
      <span className={styles.progress} aria-hidden="true" />

      <div ref={panel} id="mobile-nav" className={styles.mobilePanel} hidden={!open}>
        <nav aria-label="Main" className="container">
          <ul className={styles.mobileLinks}>{links}</ul>
        </nav>
      </div>
    </header>
  )
}

const year = new Date().getFullYear()

/** On project pages, "Back to top" scrolls that page up rather than going home. */
function backToTop(event: MouseEvent<HTMLAnchorElement>) {
  if (!window.location.hash.startsWith('#/')) return
  event.preventDefault()
  window.scrollTo({ top: 0 })
  document.getElementById('page-title')?.focus({ preventScroll: true })
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container mono ${styles.footerInner}`}>
        <p className={styles.footerBrand}>
          <span>
            © {year} {profile.name}
          </span>
        </p>
        <a href="#top" className={`link-draw ${styles.footerTop}`} onClick={backToTop}>
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
