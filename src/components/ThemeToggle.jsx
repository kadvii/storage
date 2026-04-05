import { useTheme } from '../context/ThemeContext'

const labels = {
  system: 'Theme: system (follows device). Click to use light mode.',
  light: 'Theme: light. Click to use dark mode.',
  dark: 'Theme: dark. Click to follow system setting.',
}

function SystemIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function SunIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

function MoonIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}

const variants = {
  default:
    'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  /** Glass button on dark marketing / gradient backgrounds */
  hero:
    'border-white/25 bg-white/15 text-white shadow-none backdrop-blur hover:bg-white/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
}

/**
 * Cycles system → light → dark. Shows the *current preference* icon (not the live OS scheme).
 */
export default function ThemeToggle({ className = '', variant = 'default' }) {
  const { preference, cyclePreference } = useTheme()

  const Icon =
    preference === 'light' ? SunIcon : preference === 'dark' ? MoonIcon : SystemIcon

  return (
    <button
      type="button"
      onClick={cyclePreference}
      className={[
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition',
        variants[variant] ?? variants.default,
        className,
      ].join(' ')}
      title={labels[preference]}
      aria-label={labels[preference]}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
