/**
 * Token constants exported for TypeScript / JavaScript consumers who want
 * programmatic access to brand values (e.g. computing inline styles in code
 * paths that can't reference CSS variables, or generating images at build
 * time).
 *
 * These mirror the values in src/styles/tokens.css. If you change a token
 * value in CSS, update it here. The CSS file is the source of truth at
 * runtime; this TS file is provided for compile-time consumers.
 *
 * Reference: docs/spec/01-design-system.md §1
 */

export const colors = {
  // Neutrals
  bg: '#F7F3EE',
  surface: '#FFFBF3',
  surfaceHover: '#F0E9DA',
  surfaceSunken: '#EFE7D6',
  line: '#C9BEAA',
  lineStrong: '#9C907A',
  text: '#2A1F18',
  textSoft: '#5A4F44',
  textFaint: '#7A6E5C',
  // Maroon
  maroon900: '#3A1F1C',
  maroon800: '#5D2F2A',
  maroon700: '#7A2E2E',
  maroon500: '#8B463F',
  maroon300: '#B07A75',
  maroon50: '#F3E5E3',
  // Gold (restricted)
  gold500: '#D4AF37',
  gold700: '#8A6F1D',
  // Cream / dark theme
  cream50: '#FFFBF3',
  cream100: '#F8F1E0',
  cream300: '#E5DBC6',
  // Semantic
  success: '#2D7A4A',
  successBg: '#E3F1E8',
  warning: '#B06B00',
  warningBg: '#FBF1DC',
  error: '#B3261E',
  errorBg: '#FBE5E3',
  info: '#0F5BA8',
  infoBg: '#E3EDF8',
} as const;

export const programTones = {
  preschool: {
    bg: '#F0E7FB',
    border: '#9A7AD0',
    text: '#4A2E7A',
    dot: '#9A7AD0',
    prefix: 'PS',
    label: 'Preschool',
  },
  beginners: {
    bg: '#E2EFEF',
    border: '#5D9A8E',
    text: '#1F4A42',
    dot: '#5D9A8E',
    prefix: 'BG',
    label: 'Beginners',
  },
  competitive: {
    bg: '#FBE6E2',
    border: '#C97565',
    text: '#7A2E29',
    dot: '#C97565',
    prefix: 'CM',
    label: 'Competitive',
  },
  flexibility: {
    bg: '#FBE9B3',
    border: '#A87B1F',
    text: '#5A4310',
    dot: '#A87B1F',
    prefix: 'FL',
    label: 'Flexibility',
  },
  ballet: {
    bg: '#D5E3F7',
    border: '#3F63AB',
    text: '#14274A',
    dot: '#3F63AB',
    prefix: 'BA',
    label: 'Ballet',
  },
  fallback: {
    bg: '#FFF1E3',
    border: '#8A6F4D',
    text: '#3E342C',
    dot: '#8A6F4D',
    prefix: '—',
    label: 'Other',
  },
} as const;

export type ProgramId = keyof typeof programTones;

export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  pill: '9999px',
} as const;

export const motion = {
  duration: {
    instant: '0ms',
    fast: '120ms',
    normal: '200ms',
    slow: '320ms',
    celebration: '800ms',
  },
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    linear: 'linear',
  },
} as const;
