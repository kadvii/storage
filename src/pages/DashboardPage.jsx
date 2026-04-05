import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWarehouse } from '../context/WarehouseContext'

function SummaryCard({ title, value, hint, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-500/10 border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 border-amber-500/50 hover:border-amber-400 hover:bg-amber-500/20',
    red: 'bg-red-500/10 border-red-500/50 hover:border-red-400 hover:bg-red-500/20',
  }
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm transition-colors ${tones[tone]}`}
    >
      <p className="text-sm font-medium text-textmuted">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-textbase">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-textmuted">{hint}</p>
      ) : null}
    </article>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { items, history } = useWarehouse()
  const location = useLocation()
  const navigate = useNavigate()
  const welcome = location.state?.loginWelcome
  const toastMessage = location.state?.toast

  const totalQty = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items],
  )
  const lowStock = useMemo(
    () => items.filter((i) => i.quantity < 10).length,
    [items],
  )

  const recent = history.slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {toastMessage ? (
        <div
          className="flex flex-col gap-2 rounded-2xl border border-emerald-500/30 bg-secondary px-4 py-3 text-sm text-textbase sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <p>{toastMessage}</p>
          <button
            type="button"
            className="self-start rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-textbase ring-1 ring-borderbase hover:bg-hoverbase"
            onClick={() =>
              navigate(location.pathname, { replace: true, state: {} })
            }
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-textmuted">
            Snapshot of inventory and the latest warehouse activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user?.role === 'admin' ? (
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-btntext">
              Admin access
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-textbase border border-borderbase">
              Operator
            </span>
          )}
          {welcome ? (
            <span className="text-xs text-textmuted">
              Signed in as {welcome === 'admin' ? 'administrator' : 'user'}.
            </span>
          ) : null}
        </div>
      </div>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Summary"
      >
        <SummaryCard
          title="All Items"
          value={items.length}
          hint="Distinct items tracked in mock data."
          tone="emerald"
        />
        <SummaryCard
          title="Available Items"
          value={totalQty.toLocaleString()}
          hint="Sum of on-hand quantities."
          tone="amber"
        />
        <SummaryCard
          title="Items In Use"
          value={lowStock}
          hint="Items below 10 units."
          tone="amber"
        />
        <SummaryCard
          title="Damaged Items"
          value={history.length}
          hint="Rows in the activity log."
          tone="red"
        />
      </section>

      {user?.role === 'admin' ? (
        <section className="rounded-2xl border border-borderbase bg-secondary p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-textbase">
            Admin insight
          </h2>
          <p className="mt-1 text-sm text-textmuted">
            You can review the full audit trail on{' '}
            <span className="font-medium text-textbase">History</span> and register new stock
            on <span className="font-medium text-textbase">Add Item</span>. This panel is
            only highlighted for administrators after login.
          </p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-borderbase bg-secondary p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-textbase">
            Recent activity
          </h2>
          <p className="text-xs text-textmuted">
            Latest {recent.length} events
          </p>
        </div>
        <ul className="mt-4 divide-y divide-borderbase">
          {recent.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-textbase">
                  {row.action}
                </p>
                <p className="text-sm text-textmuted">
                  {row.detail}
                </p>
              </div>
              <div className="text-left text-xs text-textmuted sm:text-right">
                <p>{row.actor}</p>
                <p>{new Date(row.at).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
