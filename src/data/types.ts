export type ProjectStatus = 'completed' | 'ongoing'

export type ProjectCategory = 'data-analysis' | 'machine-learning' | 'ai' | 'optimization'

export interface ListItem {
  term?: string
  text: string
}

export interface FlowStep {
  title: string
  text: string
}

/** An image under public/, with its pixel size to avoid layout shift. */
export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export type SectionFigure =
  | ({ kind: 'image'; caption: string } & ProjectImage)
  | {
      kind: 'bars'
      caption: string
      unit: string
      /** [before, after] */
      series: [string, string]
      rows: { label: string; values: [number, number] }[]
    }

export interface ProjectSection {
  id: string
  title: string
  text?: string[]
  list?: ListItem[]
  flow?: FlowStep[]
  figures?: SectionFigure[]
  note?: string
}

export interface ProjectLinks {
  competition?: string
  writeup?: string
  notebook?: string
  repo?: string
  docs?: string
}

export interface Project {
  slug: string
  title: string
  status: ProjectStatus
  categories: ProjectCategory[]
  /** Meta description and link previews. */
  summary: string
  /** Short text on the card in "Selected work". */
  blurb: string
  /** Opening paragraph of the case study. */
  intro: string
  tech?: string[]
  period?: string
  context?: string
  links?: ProjectLinks
  /** Schematic drawn in components/ProjectFigure.tsx. */
  figure: 'pipeline' | 'leaderboard' | 'embedding' | 'agent' | 'tracking' | 'packing'
  /** Card image and case-study banner; `focus` is the banner's object-position. */
  scene?: ProjectImage & { focus?: string }
  sections: ProjectSection[]
}

export interface ToolkitRow {
  label: string
  items: string[]
  quiet?: boolean
}

export interface EducationEntry {
  kind: 'Education' | 'Certificate'
  title: string
  institution: string
  period: string
  note?: string
  url?: string
  credentialId?: string
}

export interface ExperienceEntry {
  slug: string
  kind: string
  title: string
  /** One line for the home page. */
  brief: string
  role?: string
  department?: string
  organization: string
  location: string
  period: string
  summary: string
  highlights?: string[]
  /** Defaults to the linked project's stack. */
  tech?: string[]
  /** Slug of a project with a case study; the entry then links there. */
  project?: string
  repo?: string
  images?: (ProjectImage & { caption: string })[]
}

export interface Profile {
  name: string
  headline: string
  intro: string
  /** Meta description. */
  description: string
  openTo: string[]
  links: {
    email: string
    github: string
    linkedin: string
    kaggle: string
    /** Path inside public/. */
    cv: string
  }
  /** 4:5 portrait inside public/. */
  photo: string
}
