import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const linkBase =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors'
const linkIdle =
  'text-textmuted hover:bg-hoverbase hover:text-textbase transition-colors'
const linkActive = 'bg-accent text-btntext font-semibold shadow-sm shadow-accent/25 transition-colors'

function NavItem({ to, icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkIdle}`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth()
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
      <NavItem
        to="/dashboard"
        onNavigate={onNavigate}
        label="Dashboard"
        icon={
          <svg
            className="h-5 w-5 shrink-0 opacity-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        }
      />
      <NavItem
        to="/all-items"
        onNavigate={onNavigate}
        label="All Items"
        icon={
          <svg
            className="h-5 w-5 shrink-0 opacity-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        }
      />
      <NavItem
        to="/history"
        onNavigate={onNavigate}
        label="History"
        icon={
          <svg
            className="h-5 w-5 shrink-0 opacity-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
      <NavItem
        to="/add-item"
        onNavigate={onNavigate}
        label="Add Item"
        icon={
          <svg
            className="h-5 w-5 shrink-0 opacity-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        }
      />

      <NavItem
        to="/dispatch-item"
        onNavigate={onNavigate}
        label="Dispatch Item"
        icon={
          <svg className="h-5 w-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      <NavItem
        to="/employees"
        onNavigate={onNavigate}
        label="Employees List"
        icon={
          <svg className="h-5 w-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />

      {user?.role === 'admin' && (
        <NavItem
          to="/add-employee"
          onNavigate={onNavigate}
          label="Add Employee"
          icon={
            <svg className="h-5 w-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
      )}

    </nav>
  )
}
