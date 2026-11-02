import { useEffect, useState } from 'react'
import { BrandIcon } from '../components/Icon'
import { ExternalLink, Section } from '../components/ui'
import { profile } from '../data'
import { fileName, publicUrl, profileLinks } from '../lib/utils'
import { sectionNumber } from '../lib/router'
import styles from './Contact.module.css'

export function Contact() {
  const { email, cv } = profile.links

  return (
    <Section
      id="contact"
      number={sectionNumber('contact')}
      label="Contact"
      title="Get in touch"
      lead="Open to junior roles in data science, data analysis and applied AI, and to conversations about any of the work above."
    >
      <div className={styles.contact}>
        {/* The email first and largest, with a Copy link beside it. */}
        <div className={styles.email}>
          <a href={`mailto:${email}`} className={`link-draw ${styles.address}`}>
            {email}
          </a>
          <CopyButton text={email} />
        </div>

        {/* Profiles as logos, spaced apart like the hero's, then the CV button. */}
        <ul className={styles.links}>
          {profileLinks.map((p) => (
            <li key={p.label}>
              <ExternalLink href={p.href} className={styles.link} title={p.label}>
                <BrandIcon name={p.icon} size={26} />
                <span className="visually-hidden">{p.label}</span>
              </ExternalLink>
            </li>
          ))}
          <li className={styles.cvItem}>
            <a href={publicUrl(cv)} download={fileName(cv)} className={`mono ${styles.cv}`}>
              <BrandIcon name="cv" size={16} />
              Download CV
            </a>
          </li>
        </ul>
      </div>
    </Section>
  )
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState('idle'), 2500)
    return () => window.clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <>
      <button type="button" className={`mono ${styles.copy}`} onClick={copy}>
        {state === 'copied' ? 'Copied' : 'Copy'}
        <span className="visually-hidden"> email address</span>
      </button>
      <span className="visually-hidden" aria-live="polite">
        {state === 'copied' && 'Email address copied.'}
        {state === 'failed' && 'Could not copy. Select the address and copy it manually.'}
      </span>
      {state === 'failed' && <span className={`mono ${styles.copyError}`}>Copy failed. Select the address instead.</span>}
    </>
  )
}
