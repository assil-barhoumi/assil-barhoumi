import { useEffect, useState, type CSSProperties } from 'react'
import type { SectionFigure as Figure } from '../data'
import { publicUrl } from '../lib/utils'
import { useInView, useMotionAllowed } from '../lib/hooks'
import { ExternalLink } from './ui'
import styles from './SectionFigure.module.css'

/** A numbered case-study figure: a screenshot or paired bars. */
export function SectionFigure({ figure, number }: { figure: Figure; number: number }) {
  return (
    <figure className={styles.figure}>
      {figure.kind === 'image' && (
        <div className={styles.shot}>
          <img
            src={publicUrl(figure.src)}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      {figure.kind === 'bars' && (
        <div className={styles.panel}>
          <PairedBars figure={figure} />
        </div>
      )}
      <figcaption className={`mono ${styles.caption}`}>
        <span className={styles.figNo}>Fig. {number}</span> {figure.caption}
        {figure.kind === 'image' && (
          <>
            {' '}
            <ExternalLink href={publicUrl(figure.src)} className={`link-draw ${styles.full}`}>
              Full size ↗
            </ExternalLink>
          </>
        )}
      </figcaption>
    </figure>
  )
}

type Bars = Extract<Figure, { kind: 'bars' }>

function PairedBars({ figure }: { figure: Bars }) {
  const max = Math.max(...figure.rows.flatMap((r) => r.values))
  const animate = useMotionAllowed()
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const waiting = animate && !inView
  return (
    <div className={styles.bars} ref={ref} data-motion={waiting ? 'waiting' : undefined}>
      <ul className={`mono ${styles.legend}`} aria-hidden="true">
        <li>
          <span className={styles.swatchBase} />
          {figure.series[0]}
        </li>
        <li>
          <span className={styles.swatchAccent} />
          {figure.series[1]}
        </li>
      </ul>
      <dl className={styles.groups}>
        {figure.rows.map((row, r) => {
          const [before, after] = row.values
          const change = Math.round((1 - after / before) * 100)
          return (
            <div key={row.label} className={styles.group}>
              <dt className={styles.groupLabel}>
                {row.label}
                <span className={`mono ${styles.change}`}>
                  <CountUp value={change} format={(v) => `−${Math.round(v)}%`} animate={animate} run={inView} delay={500 + r * 200} />
                </span>
              </dt>
              {row.values.map((value, i) => (
                <dd key={figure.series[i]} className={styles.barRow} style={{ '--step': r * 2 + i } as CSSProperties}>
                  <span className="visually-hidden">{figure.series[i]}: </span>
                  <span className={styles.barTrack}>
                    <span
                      className={i === 0 ? styles.barBase : styles.barAccent}
                      style={{ width: `${(value / max) * 100}%` }}
                      aria-hidden="true"
                    />
                    <span className={`mono ${styles.barValue}`} style={{ left: `${(value / max) * 100}%` }}>
                      <CountUp value={value} format={(v) => `${Math.round(v)} ${figure.unit}`} animate={animate} run={inView} delay={(r * 2 + i) * 120} />
                    </span>
                  </span>
                </dd>
              ))}
            </div>
          )
        })}
      </dl>
    </div>
  )
}

/** Counts up to `value` once `run` is true; screen readers get the final value. */
function CountUp({
  value,
  format,
  animate,
  run,
  delay = 0,
  duration = 900,
}: {
  value: number
  format: (v: number) => string
  animate: boolean
  run: boolean
  delay?: number
  duration?: number
}) {
  // null means "show the final value".
  const [shown, setShown] = useState<number | null>(animate ? 0 : null)

  useEffect(() => {
    if (!animate || !run) return
    let frame = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(t >= 1 ? null : value * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [animate, run, value, delay, duration])

  if (!animate || shown === null) return <>{format(value)}</>
  return (
    <>
      <span className="visually-hidden">{format(value)}</span>
      <span aria-hidden="true">{format(shown)}</span>
    </>
  )
}
