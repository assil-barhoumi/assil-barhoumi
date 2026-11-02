import type { SVGProps } from 'react'

const paths = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </>
  ),
  moon: <path d="M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
} as const

export type IconName = keyof typeof paths

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

/** Line icons for the interface. Decorative: the caller provides the label. */
export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}

// GitHub and Kaggle marks from Simple Icons (CC0); LinkedIn and CV drawn by hand.
const glyphs = {
  linkedin: {
    viewBox: '0 0 24 24',
    body: (
      <path
        fillRule="evenodd"
        d="M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm2.5 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM6 10.5V18h3v-7.5zm5 0V18h3v-4c0-1 .5-1.6 1.4-1.6.8 0 1.2.6 1.2 1.6v4h3v-4.6c0-2.3-1.2-3.1-2.9-3.1-1.2 0-2.1.5-2.7 1.3v-1.1z"
      />
    ),
  },
  kaggle: {
    // Framed tightly so the letter carries the same weight as the other marks.
    viewBox: '-1.715 7.126 7.4 7.4',
    body: <path d="M.1025 7.3475c-.0681 0-.1022.0341-.1022.102v6.752c0 .0681.034.1022.1022.1022h.7049c.068 0 .1022-.034.1022-.1023v-1.481l.4187-.3985 1.5016 1.91c.041.0477.0884.0716.143.0716h.9091c.0476 0 .0748-.0135.0817-.0407.0135-.041.0066-.075-.0206-.1023l-1.9816-2.4618 1.9002-1.8384c.0204-.0205.0237-.051.01-.092-.0137-.0339-.0408-.051-.0816-.051h-.9398c-.0477 0-.0953.024-.143.0716L.9096 11.607V7.4496c0-.0679-.0342-.102-.1022-.102z" />,
  },
  github: {
    // The mark fills its whole 24-unit box; a little margin matches the others' weight.
    viewBox: '-1.6 -1.6 27.2 27.2',
    body: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />,
  },
  cv: {
    viewBox: '0 0 24 24',
    body: (
      <path
        fillRule="evenodd"
        d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 8.5v1.6h5v-1.6zm0 3.4v1.6h8v-1.6zm0 3.4v1.6h8v-1.6z"
      />
    ),
  },
} as const

export type BrandIconName = keyof typeof glyphs

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  name: BrandIconName
  size?: number
}

/** A filled glyph in the current text colour. Decorative: give the row a text label for screen readers. */
export function BrandIcon({ name, size = 20, ...rest }: BrandIconProps) {
  const glyph = glyphs[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox={glyph.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph.body}
    </svg>
  )
}
