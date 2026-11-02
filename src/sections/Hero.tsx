import type { CSSProperties } from 'react'
import { BrandIcon } from '../components/Icon'
import { DataField } from '../components/DataField'
import { ButtonLink, ExternalLink } from '../components/ui'
import { profile } from '../data'
import { publicUrl, profileLinks } from '../lib/utils'
import { sectionHref } from '../lib/router'
import styles from './Hero.module.css'

const year = new Date().getFullYear()

/** Letters that rise one after another; `from` continues the count across lines. */
function Letters({ text, from }: { text: string; from: number }) {
  return [...text].map((ch, i) => (
    <span key={i} className={styles.char} style={{ '--c': from + i } as CSSProperties}>
      {ch === ' ' ? '\u00a0' : ch}
    </span>
  ))
}

export function Hero() {
  const [first, ...rest] = profile.name.split(' ')

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <DataField />
      <div className={`container ${styles.content}`}>
        <div className={`mono ${styles.masthead}`} data-field-avoid>
          <span>Portfolio, {year}</span>
          <span>Software engineering graduate</span>
        </div>

        <div className={`grid12 ${styles.stage}`}>
          <div className={styles.text}>
            {/* The label keeps the name whole for screen readers; the letters are for show. */}
            <h1 id="hero-title" className={styles.name} aria-label={profile.name} data-field-avoid>
              <span className={styles.line}>
                <span>
                  <Letters text={first} from={0} />
                </span>
              </span>{' '}
              <span className={styles.line}>
                <span>
                  <Letters text={rest.join(' ')} from={first.length + 2} />
                </span>
              </span>
            </h1>
            <p className={`mono ${styles.headline}`} data-field-avoid>
              {profile.headline}
            </p>
            <p className={styles.intro} data-field-avoid>
              {profile.intro}
            </p>
            <div className={styles.actions} data-field-avoid>
              <ButtonLink variant="primary" href={sectionHref('work')} iconAfter="arrowDown">
                Explore my work
              </ButtonLink>
              <ButtonLink href={sectionHref('contact')} iconAfter="arrowRight">
                Get in touch
              </ButtonLink>
            </div>
          </div>

          <aside className={styles.panel} aria-label="At a glance" data-field-avoid>
            <img
              className={styles.photo}
              src={publicUrl(profile.photo)}
              alt={`Portrait of ${profile.name}`}
              width={720}
              height={900}
              decoding="async"
            />

            <dl className={styles.facts}>
              <div>
                <dt className="mono">Open to</dt>
                <dd>{profile.openTo.join(', ')}</dd>
              </div>
              <div>
                <dt className="mono">Education</dt>
                <dd>Software Engineering, ISIMG (Gabès, Tunisia)</dd>
              </div>
              <div>
                <dt className="mono">Profiles</dt>
                <dd className={styles.profiles}>
                  {profileLinks.map((p) => (
                    <ExternalLink key={p.label} href={p.href} className={styles.profile} title={p.label}>
                      <BrandIcon name={p.icon} size={22} />
                      <span className="visually-hidden">{p.label}</span>
                    </ExternalLink>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}
