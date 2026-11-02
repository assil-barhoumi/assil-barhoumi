import type { BrandIconName } from '../components/Icon'
import { profile, type Project } from '../data'

/** Resolves a path inside public/ against the deployed base URL. */
export function publicUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export function fileName(path: string) {
  return path.split('/').pop() ?? path
}

const labels = {
  competition: 'Kaggle competition',
  writeup: 'Kaggle write-up',
  notebook: 'Kaggle notebook',
  repo: 'Code',
  docs: 'Documentation',
} as const

/** A project's external links, in display order. */
export function projectLinks(project: Project) {
  return (Object.keys(labels) as (keyof typeof labels)[])
    .filter((key) => project.links?.[key])
    .map((key) => ({ href: project.links![key]!, label: labels[key] }))
}

export const profileLinks: { label: string; icon: BrandIconName; href: string }[] = [
  { label: 'LinkedIn', icon: 'linkedin', href: profile.links.linkedin },
  { label: 'Kaggle', icon: 'kaggle', href: profile.links.kaggle },
  { label: 'GitHub', icon: 'github', href: profile.links.github },
]
