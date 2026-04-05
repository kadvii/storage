import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

/**
 * Demo credentials (shown on screen for convenience):
 * User:  user / user123
 * Admin: admin / admin123
 */
export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(username, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const target =
      from && from !== '/login' ? from : '/dashboard'
    // Role-based redirect: both roles use the same hub, but navigation state
    // drives tailored messaging on the dashboard (and admins see extra panels).
    navigate(target, {
      replace: true,
      state: {
        loginWelcome: result.role === 'admin' ? 'admin' : 'user',
      },
    })
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle variant="hero" />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/40 sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Warehouse OS
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Use mock accounts below — no server required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-left text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-indigo-500/0 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
              placeholder="user or admin"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-left text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-indigo-500/0 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
              placeholder="•••••••"
            />
          </div>

          {error ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:shadow-indigo-900/40"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Demo accounts
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <span className="font-medium">User:</span> user / user123
            </li>
            <li>
              <span className="font-medium">Admin:</span> admin / admin123
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
