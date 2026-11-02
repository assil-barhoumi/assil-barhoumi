import type { EducationEntry, ExperienceEntry, Profile, ProjectCategory, ProjectStatus, ToolkitRow } from './types'

export { projects } from './projects'
export type * from './types'

export const profile: Profile = {
  name: 'Assil Barhoumi',
  headline: 'Software Engineer | Data & AI',
  intro:
    'A software engineer interested in AI and data. I like turning ideas into working tools, from machine learning models to LLM systems used in real business workflows.',
  description:
    'Portfolio of Assil Barhoumi, a software engineer working in AI and data. Selected work: LLM-based order and invoice automation in Odoo, road accident risk prediction, NLP, soccer tracking data and mathematical optimization.',
  openTo: ['AI and data roles'],
  links: {
    email: 'assilbarhoumi24@gmail.com',
    github: 'https://github.com/assil-barhoumi',
    linkedin: 'https://www.linkedin.com/in/assil-barhoumi22/',
    kaggle: 'https://www.kaggle.com/assil22',
    cv: 'cv/Assil-Barhoumi-CV.pdf',
  },
  photo: 'images/profile/assil-barhoumi.webp',
}

/** The large statement that opens the About section. */
export const statement =
  'I care about clean data, sound validation, reproducible experiments and honest interpretation of results.'

/** The About section. Each string is one paragraph. */
export const about: string[] = [
  'I am a Software Engineering graduate of the Higher Institute of Computer Science and Multimedia of Gabès (ISIMG), in Tunisia. Engineering taught me to build systems that work end to end. It also drew me towards the questions hidden in the data those systems produce.',
  'Today I focus on data science: finding patterns, building quantitative models, testing assumptions before relying on them, and applying AI to practical problems. My work so far runs from accident-risk prediction and features from soccer tracking data to LLM-based Odoo modules that turn order and invoice emails into ERP records.',
]

/** Toolkit, by area. No proficiency levels: the projects show the level. */
export const toolkit: ToolkitRow[] = [
  {
    label: 'Programming and data',
    items: ['Python', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
  },
  {
    label: 'Statistics and modeling',
    items: [
      'Exploratory data analysis',
      'Data cleaning',
      'Data quality assessment',
      'Feature engineering',
      'Data visualization',
      'Data mining',
    ],
  },
  {
    label: 'Machine learning and AI',
    items: [
      'Scikit-learn',
      'TensorFlow',
      'XGBoost',
      'AutoGluon',
      'Deep learning',
      'Natural language processing',
      'Transformers',
      'LLM integration',
      'RAG',
      'Prompt engineering',
      'LLM evaluation',
      'AI agents',
    ],
  },
  {
    label: 'Tools',
    items: ['Git', 'GitHub', 'Jupyter', 'Google Colab', 'Kaggle', 'MLflow', 'Docker', 'PostgreSQL', 'VS Code'],
  },
  {
    label: 'Software engineering',
    items: ['Odoo', 'Django', 'JavaScript', 'PHP', 'Laravel', 'HTML', 'CSS', 'Scrum'],
    quiet: true,
  },
  {
    label: 'Languages',
    items: ['Arabic (native)', 'French (fluent)', 'English (fluent)'],
    quiet: true,
  },
]

// Most recent first. Consecutive entries with the same organization are grouped.
export const experience: ExperienceEntry[] = [
  {
    kind: 'Final-year internship',
    title: 'AI-Powered Sales Automation in Odoo',
    slug: 'bid-consulting',
    brief: 'Built two Odoo 19 modules that use LLMs to turn order and supplier-invoice emails into quotations and vendor bills.',
    role: 'Software engineering and AI intern',
    organization: 'BID Consulting',
    location: 'Ras Jebel, Bizerte, Tunisia',
    period: 'Feb – Aug 2026',
    summary:
      'Engineering final-year project: two Odoo 19 modules that read order and supplier-invoice emails with large language models, turning orders into draft quotations and invoices into vendor bills once an accountant has validated them.',
    highlights: [
      'Proposed the project after finding the same manual email-to-ERP retyping at most of the clients I looked at.',
      'Built both modules on my own, from mailbox acquisition and LLM extraction to deduplication, access rights and encryption.',
      'Benchmarked three models per task in MLflow on multilingual test sets; the invoice model kept reached 97.1% field accuracy.',
      'In the ROI study, processing time fell from 12 to 1 minute per order and from 15 to 2 minutes per invoice.',
    ],
    project: 'odoo-sales-automation',
    images: [
      {
        src: 'images/projects/odoo-sales-automation/odoo-invoice-cover.webp',
        alt: 'Odoo invoice review screen: an image of a supplier invoice on the left, and the supplier, dates and amounts extracted from it on the right.',
        width: 1328,
        height: 830,
        caption: 'Invoice review in Odoo: the source invoice beside the extracted fields. More screens in the case study.',
      },
    ],
  },
  {
    kind: 'Summer internship',
    title: 'InternTracker',
    slug: 'interntracker',
    brief: 'Built a Django platform for managing internships: offers, applications, interview scheduling and an admin dashboard.',
    department: 'Management Information Systems department',
    organization: 'Compagnie des Phosphates de Gafsa (CPG)',
    location: 'Gafsa, Tunisia',
    period: '1 – 31 Aug 2025',
    summary:
      'An internship management platform: interns browse offers and apply with their CV, and administrators review applications, schedule interviews and select candidates.',
    highlights: [
      'Candidate area: registration, profile, CV upload, and a filtered, paginated list of offers to apply to.',
      'Administration: offers, applications and interviews (Zoom or in person), with validation rules on dates and interview details.',
      'Email notifications when an interview is scheduled or an application is approved or rejected.',
      'Admin dashboard with KPIs and charts: applications and offers per department, interviews over the month.',
      'Strict separation between administrator and intern roles.',
    ],
    tech: ['Python', 'Django 5', 'SQLite', 'JavaScript', 'Bootstrap', 'Chart.js', 'HTML', 'CSS'],
    repo: 'https://github.com/assil-barhoumi/InternTracker',
    images: [
      {
        src: 'images/experience/interntracker-offers.webp',
        alt: 'Available Internship Offers page: a filter panel for search, department and duration, and offer cards with dates, duration, requirements and an Apply Now button.',
        width: 1400,
        height: 628,
        caption: 'Offers page, with filters by department and duration.',
      },
      {
        src: 'images/experience/interntracker-dashboard.webp',
        alt: 'Intern dashboard: counts of total, pending, approved and refused applications, the uploaded CV, and the list of applications with their status.',
        width: 1400,
        height: 1089,
        caption: 'Intern dashboard: application counts, CV and the status of each application. Test account; name hidden.',
      },
    ],
  },
  {
    kind: 'Summer internship',
    title: 'CryptoGalleryX',
    slug: 'cryptogalleryx',
    brief: 'Built a Laravel image gallery that stores every image encrypted, with AES-256 or one of seven classical ciphers.',
    department: 'Management Information Systems department',
    organization: 'Compagnie des Phosphates de Gafsa (CPG)',
    location: 'Gafsa, Tunisia',
    period: '1 – 30 Jun 2024',
    summary:
      'A secure image management system: every uploaded image is stored encrypted with the method the user chooses, and decrypted only for its owner.',
    highlights: [
      'Users choose how each image is encrypted: AES-256-CBC, or one of seven classical ciphers implemented as services (Caesar, Vigenère, Playfair, Rail Fence, Atbash, XOR and reverse).',
      'Images are stored encrypted in MySQL and decrypted on the fly for the owner’s gallery.',
      'Accounts with registration, login and password change; each user sees and deletes only their own images.',
      'Three-tier architecture (Apache, Laravel, MySQL) following the MVC pattern.',
    ],
    tech: ['PHP', 'Laravel 9', 'MySQL', 'Tailwind CSS', 'Alpine.js'],
    repo: 'https://github.com/assil-barhoumi/CryptoGalleryX',
    images: [
      {
        src: 'images/experience/cryptogallery-home.webp',
        alt: 'CryptoGallery home page: "Secure Your Images", a welcome text and illustration, and a three-step "How it works": upload an image, select an encryption method, view it in your gallery.',
        width: 1378,
        height: 1240,
        caption: 'Home page and the three steps: upload, choose a cipher, view in the gallery.',
      },
      {
        src: 'images/experience/cryptogallery-upload.webp',
        alt: 'Upload page: a file picker and buttons to choose the Caesar, Atbash or Vigenère cipher.',
        width: 1400,
        height: 669,
        caption: 'Upload page, with the cipher chosen before upload. Screenshot from the internship report.',
      },
    ],
  },
]

// Degrees first, then certificates; most recent first.
export const education: EducationEntry[] = [
  {
    kind: 'Education',
    title: 'Engineering Cycle in Software Engineering and Information Systems',
    institution: 'Higher Institute of Computing and Multimedia of Gabès (ISIMG)',
    // The engineering cycle follows the preparatory cycle (2021 – 2023); graduated 7 September 2026.
    period: '2023 – 2026',
    note: 'Graduated September 2026',
  },
  {
    kind: 'Education',
    title: 'Integrated Preparatory Cycle',
    institution: 'Higher Institute of Computing and Multimedia of Gabès (ISIMG)',
    period: '2021 – 2023',
  },
  {
    kind: 'Education',
    title: 'Baccalaureate in Mathematics',
    institution: 'Gafsa Pioneer High School',
    period: '2020 – 2021',
  },

  // Certificates, most recent first.
  {
    kind: 'Certificate',
    title: 'Pandas',
    institution: 'Kaggle Learn',
    period: 'Sep 2025',
  },
  {
    kind: 'Certificate',
    title: 'Python 101 for Data Science',
    institution: 'Cognitive Class (IBM)',
    period: 'Oct 2024',
    url: 'https://courses.cognitiveclass.ai/certificates/db8094a819e74db79405c6e80c2d0ce2',
  },
  {
    kind: 'Certificate',
    title: 'Scrum Fundamentals Certified (SFC)',
    institution: 'SCRUMstudy',
    period: 'May 2024',
    credentialId: '1031036',
  },
]

export const statusLabels: Record<ProjectStatus, string> = {
  completed: 'Completed',
  ongoing: 'In progress',
}

export const categoryLabels: Record<ProjectCategory, string> = {
  'data-analysis': 'Data analysis',
  'machine-learning': 'Machine learning',
  ai: 'AI',
  optimization: 'Optimization',
}

/** Order of the project filters. */
export const categoryOrder: ProjectCategory[] = [
  'data-analysis',
  'machine-learning',
  'ai',
  'optimization',
]
