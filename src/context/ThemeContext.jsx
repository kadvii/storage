import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'

const STORAGE_KEY = 'warehouse_theme_v1'

const ThemeContext = createContext(null)

function readPreference() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'system'
}

function subscribeSystemTheme(callback) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSystemIsDarkSnapshot() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(() => readPreference())

  const systemIsDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemIsDarkSnapshot,
    () => false,
  )

  const resolvedTheme = useMemo(() => {
    if (preference === 'dark') return 'dark'
    if (preference === 'light') return 'light'
    return systemIsDark ? 'dark' : 'light'
  }, [preference, systemIsDark])

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  const setPreference = useCallback((next) => {
    setPreferenceState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const cyclePreference = useCallback(() => {
    const order = ['system', 'light', 'dark']
    const i = order.indexOf(preference)
    const next = order[(i + 1) % order.length]
    setPreference(next)
  }, [preference, setPreference])

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
      cyclePreference,
    }),
    [preference, resolvedTheme, setPreference, cyclePreference],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
