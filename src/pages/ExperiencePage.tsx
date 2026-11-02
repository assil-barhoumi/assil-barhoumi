import { ExternalLink, InlineList } from '../components/ui'
import { experience, profile, type ExperienceEntry } from '../data'
import { publicUrl } from '../lib/utils'
import { useDocumentMeta } from '../lib/hooks'
import { experienceHref, projectHref, sectionHref, transitionName } from '../lib/router'
import page from './ProjectPage.module.css'
import styles from './ExperiencePage.module.css'

/** Details page for one internship. */
export function ExperiencePage({ entry }: { entry: ExperienceEntry }) {
  useDocumentMeta(`${entry.title} — ${profile.name}`, entry.summary)

  // Pager between internships that have their own details page or a case study.
  const index = experience.indexOf(entry)
  const previous = index > 0 ? experience[index - 1] : null
  const next = index < experience.length - 1 ? experience[index + 1] : null
  const hrefOf = (e: ExperienceEntry) => (e.project ? projectHref(e.project) : experienceHref(e.slug))

  const details: [string, string | undefined][] = [
    ['Type', entry.kind],
    ['Period', entry.period],
    ['Role', entry.role],
    ['Team', entry.department],
    ['Company', entry.organization],
    ['Location', entry.location],
  ]

  return (
    <article className={page.page}>
      <header className="container">
        <div className={`mono ${page.crumbs}`}>
          <a href={sectionHref('experience')} className={`link-draw ${page.back}`}>
            ← Experience
          </a>
          <span aria-hidden="true">/</span>
          <span>{entry.kind}</span>
        </div>

        <div className={`grid12 ${page.head}`}>
          <div className={page.headText}>
            <h1
              id="page-title"
              tabIndex={-1}
              className={page.title}
              style={{ viewTransitionName: transitionName.internshipTitle(entry.slug) }}
            >
              {entry.title}
            </h1>
            <p className={page.standfirst}>{entry.summary}</p>
          </div>

          <aside className={`mono ${page.info}`} aria-label="Internship details">
            <dl>
              {details
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              {entry.tech && entry.tech.length > 0 && (
                <div>
                  <dt>Stack</dt>
                  <dd>
                    <InlineList items={entry.tech} label={`Technologies used in ${entry.title}`} />
                  </dd>
                </div>
              )}
              {entry.repo && (
                <div>
                  <dt>Links</dt>
                  <dd className={page.links}>
                    <ExternalLink href={entry.repo} className="link-draw">
                      Code on GitHub ↗
                    </ExternalLink>
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {entry.highlights && entry.highlights.length > 0 && (
          <section className={styles.section} aria-labelledby="what-i-built">
            <h2 id="what-i-built" className={styles.sectionTitle}>
              What I built
            </h2>
            <ul className={styles.highlights}>
              {entry.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {entry.images && entry.images.length > 0 && (
          <section className={styles.section} aria-labelledby="screens">
            <h2 id="screens" className={styles.sectionTitle}>
              Screens
            </h2>
            <div className={styles.shots}>
              {entry.images.map((image, i) => (
                <figure key={image.src} className={styles.shot}>
                  <a href={publicUrl(image.src)} target="_blank" rel="noopener noreferrer" className={styles.shotLink}>
                    <img
                      src={publicUrl(image.src)}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="visually-hidden"> (full size, opens in a new tab)</span>
                  </a>
                  <figcaption className={`mono ${styles.caption}`}>
                    <span className={styles.figNo}>Fig. {i + 1}</span> {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <nav className={`mono ${page.pager}`} aria-label="Other internships">
          {previous && (
            <a href={hrefOf(previous)} className={page.pagerLink}>
              <span className={page.pagerLabel}>← Previous</span>
              <span className={page.pagerTitle}>{previous.title}</span>
            </a>
          )}
          {next && (
            <a href={hrefOf(next)} className={`${page.pagerLink} ${page.pagerNext}`}>
              <span className={page.pagerLabel}>Next →</span>
              <span className={page.pagerTitle}>{next.title}</span>
            </a>
          )}
        </nav>
      </div>
    </article>
  )
}
