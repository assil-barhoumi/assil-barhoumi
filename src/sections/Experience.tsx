import { ExternalLink, Section } from '../components/ui'
import { experience, projects, type ExperienceEntry } from '../data'
import { sectionNumber, experienceHref, projectHref, transitionName } from '../lib/router'
import styles from './Experience.module.css'

type Field = 'role' | 'department' | 'location'

/** Internships at the same organisation, in a row in experience.ts, are shown together. */
function groupByOrganization(entries: ExperienceEntry[]) {
  const groups: ExperienceEntry[][] = []
  for (const entry of entries) {
    const last = groups[groups.length - 1]
    if (last && last[0].organization === entry.organization) last.push(entry)
    else groups.push([entry])
  }
  return groups
}

/** A field shown once for the whole group when every internship in it shares the value. */
const shared = (group: ExperienceEntry[], field: Field) =>
  group.every((e) => e[field] === group[0][field]) ? group[0][field] : undefined

const NUMBERS = ['', 'One', 'Two', 'Three', 'Four', 'Five']

/** 'Summer internship' ×2 → 'Two summer internships'. */
function groupKind(group: ExperienceEntry[]) {
  if (group.length === 1) return group[0].kind
  const same = group.every((e) => e.kind === group[0].kind)
  const kind = same ? group[0].kind.toLowerCase() : 'internship'
  return `${NUMBERS[group.length] ?? group.length} ${kind}s`
}

/** The span of years across a group, e.g. '1 – 30 Jun 2024' and '1 – 31 Aug 2025' → '2024 – 2025'. */
function groupPeriod(group: ExperienceEntry[]) {
  if (group.length === 1) return group[0].period
  const years = group.flatMap((e) => e.period.match(/\d{4}/g) ?? []).map(Number)
  const [first, last] = [Math.min(...years), Math.max(...years)]
  return first === last ? String(first) : `${first} – ${last}`
}

/** Meta line joined by dots. */
function Meta({ parts }: { parts: (string | undefined)[] }) {
  const shown = parts.filter(Boolean)
  if (shown.length === 0) return null
  return (
    <p className={`mono ${styles.meta}`}>
      {shown.map((value) => (
        <span key={value} className={styles.metaPart}>
          {value}
        </span>
      ))}
    </p>
  )
}

/** Internships grouped by company. */
export function Experience() {
  return (
    <Section
      id="experience"
      number={sectionNumber('experience')}
      label="Experience"
      title="Experience"
    >
      <ol className={styles.list}>
        {groupByOrganization(experience).map((group) => {
          const several = group.length > 1
          const period = groupPeriod(group)
          // Fields every internship in the group shares go under the company name;
          // the rest go with each internship.
          const groupFields = (['role', 'department', 'location'] as const).filter((f) => shared(group, f) !== undefined)
          return (
            <li key={group[0].slug} className={`grid12 ${styles.entry} reveal`}>
              <div className={`mono ${styles.when}`}>
                <span className={styles.kind}>{groupKind(group)}</span>
                <span className={styles.period}>{period}</span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.company}>{group[0].organization}</h3>
                <Meta parts={groupFields.map((f) => shared(group, f))} />

                <ol className={styles.roles} data-several={several || undefined}>
                  {group.map((entry) => {
                    const project = entry.project ? projects.find((p) => p.slug === entry.project) : undefined
                    const href = project ? projectHref(project.slug) : experienceHref(entry.slug)
                    const ownFields = (['role', 'department', 'location'] as const).filter((f) => !groupFields.includes(f))
                    return (
                      <li key={entry.slug} className={styles.role}>
                        {several && (
                          <p className={`mono ${styles.rolePeriod}`}>{entry.period}</p>
                        )}
                        <h4 className={styles.title}>
                          <a
                            href={href}
                            className={styles.titleLink}
                            style={project ? undefined : { viewTransitionName: transitionName.internshipTitle(entry.slug) }}
                          >
                            {entry.title}
                          </a>
                        </h4>
                        <Meta parts={ownFields.map((f) => entry[f])} />
                        <p className={styles.brief}>{entry.brief}</p>
                        <p className={`mono ${styles.links}`}>
                          <a href={href} className="link-draw">
                            {project ? 'Read the case study' : 'Details'} →
                            <span className="visually-hidden">: {entry.title}</span>
                          </a>
                          {entry.repo && (
                            <ExternalLink href={entry.repo} className="link-draw">
                              Code on GitHub ↗
                            </ExternalLink>
                          )}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
