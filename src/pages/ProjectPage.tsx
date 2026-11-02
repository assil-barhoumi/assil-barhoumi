import { ProjectFigure, figureCaption } from '../components/ProjectFigure'
import { SectionFigure } from '../components/SectionFigure'
import { ExternalLink, InlineList, StatusMark } from '../components/ui'
import { categoryLabels, projects, profile, type FlowStep, type ListItem, type Project, type ProjectSection } from '../data'
import { publicUrl, projectLinks } from '../lib/utils'
import { useDocumentMeta } from '../lib/hooks'
import { projectHref, sectionHref, transitionName } from '../lib/router'
import styles from './ProjectPage.module.css'

export function ProjectPage({ project }: { project: Project }) {
  useDocumentMeta(`${project.title} — ${profile.name}`, project.summary)

  const index = projects.indexOf(project)
  const previous = index > 0 ? projects[index - 1] : null
  const next = index < projects.length - 1 ? projects[index + 1] : null

  const shown = project.sections
  // Figures are numbered across the page; Fig. 1 is the schematic at the top.
  const firstFigure = shown.map((_, i) => 2 + shown.slice(0, i).reduce((n, s) => n + (s.figures?.length ?? 0), 0))

  const links = projectLinks(project)

  const scrollTo = (id: string) => {
    const target = document.getElementById(`section-${id}`)
    if (!target) return
    target.scrollIntoView({ block: 'start' })
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
  }

  return (
    <article className={styles.page}>
      <header className="container">
        <div className={`mono ${styles.crumbs}`}>
          <a href={sectionHref('work')} className={`link-draw ${styles.back}`}>
            ← Selected work
          </a>
          <span aria-hidden="true">/</span>
          <span>Case study {String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className={`grid12 ${styles.head}`}>
          <div className={styles.headText}>
            <h1
              id="page-title"
              tabIndex={-1}
              className={styles.title}
              style={{ viewTransitionName: transitionName.projectTitle(project.slug) }}
            >
              {project.title}
            </h1>
            <p className={styles.standfirst}>{project.intro}</p>
          </div>

          <aside className={`mono ${styles.info}`} aria-label="Project details">
            <dl>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusMark status={project.status} />
                </dd>
              </div>
              {project.context && (
                <div>
                  <dt>Context</dt>
                  <dd>{project.context}</dd>
                </div>
              )}
              {project.period && (
                <div>
                  <dt>Period</dt>
                  <dd>{project.period}</dd>
                </div>
              )}
              <div>
                <dt>Area</dt>
                <dd>{project.categories.map((c) => categoryLabels[c]).join(', ')}</dd>
              </div>
              {project.tech && (
                <div>
                  <dt>Stack</dt>
                  <dd>
                    <InlineList items={project.tech} label={`Technologies used in ${project.title}`} />
                  </dd>
                </div>
              )}
              {links.length > 0 && (
                <div>
                  <dt>Links</dt>
                  <dd className={styles.links}>
                    {links.map((link) => (
                      <ExternalLink key={link.href} href={link.href} className="link-draw">
                        {link.label} ↗
                      </ExternalLink>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>

        {project.scene && (
          <figure className={styles.banner}>
            <img
              src={publicUrl(project.scene.src)}
              alt={project.scene.alt}
              width={project.scene.width}
              height={project.scene.height}
              decoding="async"
              style={{ ...transitionName.imageStyle(project.slug), objectPosition: project.scene.focus }}
            />
          </figure>
        )}

        <figure className={styles.figure}>
          <div className={styles.figureBox}>
            <ProjectFigure kind={project.figure} />
          </div>
          <figcaption className={`mono ${styles.caption}`}>
            <span className={styles.figNo}>Fig. 1</span> {figureCaption[project.figure]}
          </figcaption>
        </figure>

      </header>

      <div className={`container grid12 ${styles.layout}`}>
        {shown.length > 2 && (
          <nav className={`mono ${styles.toc}`} aria-label="On this page">
            <p className={styles.tocTitle}>Contents</p>
            <ol>
              {shown.map((s, i) => (
                <li key={s.id}>
                  <button type="button" onClick={() => scrollTo(s.id)}>
                    <span className={styles.tocNo}>{i + 1}</span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className={styles.content}>
          {shown.map((section, i) => (
            <SectionView key={section.id} section={section} number={i + 1} firstFigure={firstFigure[i]} />
          ))}
        </div>
      </div>

      {(previous || next) && (
        <nav className={`container ${styles.pager}`} aria-label="More projects">
          {previous ? (
            <a href={projectHref(previous.slug)} className={styles.pagerLink}>
              <span className={`mono ${styles.pagerLabel}`}>← Previous</span>
              <span className={styles.pagerTitle}>{previous.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={projectHref(next.slug)} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              <span className={`mono ${styles.pagerLabel}`}>Next →</span>
              <span className={styles.pagerTitle}>{next.title}</span>
            </a>
          )}
        </nav>
      )}
    </article>
  )
}

function SectionView({ section, number, firstFigure }: { section: ProjectSection; number: number; firstFigure: number }) {
  return (
    <section id={`section-${section.id}`} className={styles.section} aria-labelledby={`h-${section.id}`}>
      <h2 id={`h-${section.id}`} tabIndex={-1} className={styles.sectionTitle}>
        <span className={`mono ${styles.sectionNo}`}>{number}</span>
        {section.title}
      </h2>
      {section.text && (
        <div className="prose">
          {section.text.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      )}
      {section.flow && <Flow steps={section.flow} />}
      {section.list && <Items items={section.list} />}
      {section.figures?.map((figure, i) => (
        <SectionFigure key={i} figure={figure} number={firstFigure + i} />
      ))}
      {section.note && <p className={`mono ${styles.note}`}>{section.note}</p>}
    </section>
  )
}

/** A numbered pipeline. */
function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className={styles.flow}>
      {steps.map((step, i) => (
        <li key={step.title} className={styles.step}>
          <span className={`mono ${styles.marker}`} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Items({ items }: { items: ListItem[] }) {
  return (
    <ul className={styles.items}>
      {items.map((item) => (
        <li key={item.term ?? item.text} className={styles.item}>
          {item.term && <h3 className={styles.itemTerm}>{item.term}</h3>}
          <p className={styles.itemText}>{item.text}</p>
        </li>
      ))}
    </ul>
  )
}
