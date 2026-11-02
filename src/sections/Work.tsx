import { useState } from 'react'
import { ProjectFigure } from '../components/ProjectFigure'
import { ExternalLink, Section, StatusMark } from '../components/ui'
import { categoryLabels, categoryOrder, projects, type Project, type ProjectCategory } from '../data'
import { publicUrl, projectLinks } from '../lib/utils'
import { projectHref, transitionName, sectionNumber } from '../lib/router'
import { useTilt, useMagnetic } from '../lib/hooks'
import styles from './Work.module.css'

type Filter = 'all' | ProjectCategory

const filters: { value: Filter; label: string; count: number }[] = [
  { value: 'all', label: 'All', count: projects.length },
  ...categoryOrder
    .map((category) => ({
      value: category,
      label: categoryLabels[category],
      count: projects.filter((p) => p.categories.includes(category)).length,
    }))
    // A filter with nothing behind it would only lead to an empty list.
    .filter((f) => f.count > 0),
]

export function Work() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))
  const activeLabel = filters.find((f) => f.value === filter)?.label ?? 'All'

  return (
    <Section
      id="work"
      className={styles.section}
      number={sectionNumber('work')}
      label="Selected work"
      title="Selected work"
      lead="Each project is labelled with its real status. Results appear here only once they have been verified."
    >
      <div className={`mono ${styles.filters}`} role="group" aria-label="Filter projects by category">
        <span className={styles.filterLabel} aria-hidden="true">
          Filter
        </span>
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={styles.filter}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            <sup className={styles.count} aria-hidden="true">
              {f.count}
            </sup>
            <span className="visually-hidden">
              , {f.count} {f.count === 1 ? 'project' : 'projects'}
            </span>
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {filter === 'all'
          ? `Showing all ${visible.length} projects`
          : `Showing ${visible.length} ${visible.length === 1 ? 'project' : 'projects'} in ${activeLabel}`}
      </p>

      {visible.length > 0 ? (
        <ol className={styles.list}>
          {visible.map((project) => (
            <Spread key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>No projects in this category yet.</p>
      )}

    </Section>
  )
}

function Spread({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, '0')
  const href = projectHref(project.slug)
  const tilt = useTilt()
  const magnetic = useMagnetic()

  return (
    <li className={`${styles.spread} reveal`} data-side={index % 2 === 0 ? 'left' : 'right'}>
      <figure className={styles.figure}>
        <a href={href} className={styles.figureLink} tabIndex={-1} aria-hidden="true" {...tilt}>
          {project.scene ? (
            // The frame crops the image: it opens as the card scrolls in, and the image drifts inside it.
            <span className={styles.frame} style={transitionName.imageStyle(project.slug)}>
              <img
                className={styles.cover}
                src={publicUrl(project.scene.src)}
                alt=""
                width={project.scene.width}
                height={project.scene.height}
                loading="lazy"
                decoding="async"
              />
            </span>
          ) : (
            <ProjectFigure kind={project.figure} />
          )}
        </a>
      </figure>

      <div className={styles.body}>
        <div className={`mono ${styles.meta}`}>
          <span className={styles.number}>{number}</span>
          <StatusMark status={project.status} />
          {project.context && <span className={styles.context}>{project.context}</span>}
        </div>

        <h3 className={styles.title}>
          <a href={href} className={styles.titleLink} style={{ viewTransitionName: transitionName.projectTitle(project.slug) }}>
            {project.title}
          </a>
        </h3>

        <p className={styles.blurb}>{project.blurb}</p>

        <div className={`mono ${styles.links}`}>
          <a href={href} className={styles.cta} {...magnetic}>
            Read the case study
            <span className="visually-hidden">: {project.title}</span>
            <span aria-hidden="true" className={styles.arrow}>
              →
            </span>
          </a>
          {projectLinks(project).map((link) => (
            <ExternalLink key={link.href} href={link.href} className="link-draw">
              {link.label} ↗
            </ExternalLink>
          ))}
        </div>
      </div>
    </li>
  )
}

