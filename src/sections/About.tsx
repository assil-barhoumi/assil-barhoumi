import type { CSSProperties } from 'react'
import { ExternalLink, Section } from '../components/ui'
import { about, education, statement, toolkit, type EducationEntry } from '../data'
import { useInView, useMotionAllowed } from '../lib/hooks'
import { sectionNumber } from '../lib/router'
import styles from './About.module.css'

export function About() {
  return (
    <Section id="about" number={sectionNumber('about')} label="About" title="A software engineer with a data-focused mindset.">
      <div className="grid12">
        <div className={`${styles.aside} reveal`}>
          <blockquote className={styles.statement}>
            <p>{statement}</p>
          </blockquote>
        </div>

        <div className={`${styles.main} reveal`}>
          <div className="prose">
            {about.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Skills() {
  const animate = useMotionAllowed()
  const [ref, inView] = useInView<HTMLDListElement>(0.2)
  return (
    <Section
      id="skills"
      number={sectionNumber('skills')}
      label="Skills"
      title="Toolkit"
    >
      {/* The rows appear one after another when the table scrolls into view. */}
      <dl className={styles.table} ref={ref} data-motion={animate && !inView ? 'waiting' : undefined}>
        {toolkit.map((row, i) => (
          <div
            key={row.label}
            className={row.quiet ? `${styles.row} ${styles.quiet}` : styles.row}
            style={{ '--i': i } as CSSProperties}
          >
            <dt className="mono">{row.label}</dt>
            <dd>{row.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

/** Two groups, as on the CV: education first, then certificates. */
const groups = [
  { id: 'education-studies', title: 'Education', entries: education.filter((e) => e.kind === 'Education') },
  { id: 'education-certificates', title: 'Certificates', entries: education.filter((e) => e.kind === 'Certificate') },
].filter((group) => group.entries.length > 0)

export function Education() {
  return (
    <Section id="education" number={sectionNumber('education')} label="Education" title="Education and certificates">
      {groups.map((group) => (
        <div key={group.id} className={styles.group}>
          <h3 id={group.id} className={`mono ${styles.groupTitle}`}>
            {group.title}
          </h3>
          <ol className={styles.list} aria-labelledby={group.id}>
            {group.entries.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </ol>
        </div>
      ))}
    </Section>
  )
}

function Entry({ entry }: { entry: EducationEntry }) {
  const certificate = entry.kind === 'Certificate'
  return (
    <li className={`grid12 ${styles.entry} ${certificate ? styles.certificate : ''} reveal`}>
      <p className={`mono ${styles.when}`}>{entry.period}</p>
      <div className={styles.body}>
        <h4 className={styles.title}>{entry.title}</h4>
        <p className={styles.institution}>{entry.institution}</p>
        {entry.note && <p className={`mono ${styles.note}`}>{entry.note}</p>}
        {entry.credentialId && <p className={`mono ${styles.meta}`}>Certificate ID {entry.credentialId}</p>}
        {entry.url && (
          <ExternalLink href={entry.url} className={`mono link-draw ${styles.link}`}>
            {certificate ? 'View credential ↗' : 'View diploma ↗'}
          </ExternalLink>
        )}
      </div>
    </li>
  )
}
