import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ThemeToggle'
import Sidebar from './Sidebar'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="flex min-h-dvh bg-primary text-textbase transition-colors">
      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] dark:bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      {/* Sidebar: drawer on small screens, static on lg */}
      <aside
        id="app-sidebar"
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-borderbase bg-secondary text-textbase shadow-xl transition-transform duration-200 lg:static lg:max-w-none lg:translate-x-0 lg:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4 dark:border-slate-800">
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-accent">
              Warehouse
            </p>
            <p className="truncate text-sm font-semibold text-textbase">
              Operations
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
              onClick={closeMobile}
              aria-label="Close sidebar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <Sidebar onNavigate={closeMobile} />

        <div className="mt-auto border-t border-borderbase p-3">
          <div className="rounded-xl bg-primary px-3 py-2 text-left text-xs text-textbase">
            <p className="font-medium text-textbase">
              {user?.displayName}
            </p>
            <p className="mt-0.5 capitalize text-textmuted">Role: {user?.role}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-2 w-full rounded-xl border border-borderbase bg-secondary px-3 py-2 text-sm font-medium text-textbase hover:bg-hoverbase transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-borderbase bg-secondary px-4 py-3 text-textbase shadow-sm lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-borderbase bg-secondary p-2 text-textbase shadow-sm hover:bg-hoverbase transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="app-sidebar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="sr-only">Open menu</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-textbase">
              {user?.displayName}
            </p>
            <p className="truncate text-xs capitalize text-textmuted">
              {user?.role}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-borderbase bg-secondary px-4 py-3 text-center">
          <p className="text-xs text-textmuted">
            Made with <span className="text-red-400">♥</span> by{' '}
            <span className="font-semibold text-accent">MosaB</span>
            {' & '}
            <span className="font-semibold text-accent">Abdulqader Firas</span>
          </p>
        </footer>
      </div>
    </div>
  )
}
