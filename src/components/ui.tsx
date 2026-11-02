import { Fragment, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { statusLabels, type ProjectStatus } from '../data'
import { useInView, useMotionAllowed, useMagnetic } from '../lib/hooks'
import { Icon, type IconName } from './Icon'
import styles from './ui.module.css'

/* Links styled as buttons */

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'ghost'
  icon?: IconName
  iconAfter?: IconName
}

export function ButtonLink({ variant = 'ghost', icon, iconAfter, className, children, ...rest }: ButtonLinkProps) {
  const magnetic = useMagnetic()
  return (
    <a className={[styles.button, styles[variant], className].filter(Boolean).join(' ')} {...magnetic} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {iconAfter && <Icon name={iconAfter} size={18} className={styles.after} />}
    </a>
  )
}

/** A link to another site. Opens in a new tab and says so to screen readers. */
export function ExternalLink({ href, children, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}

/* Status */

/** Status dot: filled = completed, half = in progress. */
export function StatusMark({ status }: { status: ProjectStatus }) {
  return (
    <span className={`mono ${styles.status}`} data-status={status}>
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {status === 'completed' && <circle cx="6" cy="6" r="5" fill="currentColor" />}
        {status === 'ongoing' && (
          <>
            <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6 1.4a4.6 4.6 0 0 1 0 9.2Z" fill="currentColor" />
          </>
        )}
      </svg>
      {statusLabels[status]}
    </span>
  )
}

/* Inline list, e.g. a technology stack */

export function InlineList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul className={`mono ${styles.inline}`} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/* Section shell */

interface SectionProps {
  id: string
  /** Section number, shown as a technical label, e.g. '02'. */
  number: string
  /** Short running label beside the number, e.g. 'Selected work'. */
  label: string
  title: ReactNode
  /** One or two sentences under the heading. */
  lead?: ReactNode
  /** Extra classes for the section element. */
  className?: string
  children: ReactNode
}

/** A heading split into words that rise in turn from behind a mask (see .word in ui.module.css). */
function Words({ text }: { text: string }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span className={styles.word}>
        <span className={styles.wordInner} style={{ '--w': i } as CSSProperties}>
          {word}
        </span>
      </span>
    </Fragment>
  ))
}

/** A home-page section: a numbered rule, a large heading, then the content. */
export function Section({ id, number, label, title, lead, className, children }: SectionProps) {
  // The heading rises in once it scrolls into view; for reduced motion it is simply there.
  const animate = useMotionAllowed()
  const [headRef, inView] = useInView<HTMLElement>(0.3)
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={[styles.section, className].filter(Boolean).join(' ')}>
      <div className="container">
        <div className={`mono ${styles.rule}`} aria-hidden="true">
          <span className={styles.ruleNumber}>{number}</span>
          <span>{label}</span>
        </div>
        <header
          ref={headRef}
          className={`grid12 ${styles.head}`}
          data-motion={animate && !inView ? 'waiting' : undefined}
        >
          <h2 id={`${id}-title`} className={styles.title} tabIndex={-1}>
            {typeof title === 'string' ? <Words text={title} /> : title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
