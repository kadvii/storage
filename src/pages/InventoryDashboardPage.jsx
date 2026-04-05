import { useCallback, useState } from 'react'
import { useInventory } from '../context/InventoryContext'

const STATUS_LABEL = {
  available: 'Available',
  in_use: 'In Use',
  damaged: 'Damaged',
}

function StatCard({ titleAr, count, icon, gradient, iconBg }) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br p-5 shadow-sm ${gradient} dark:border-white/10`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-right" dir="rtl">
          <h2 className="text-sm font-semibold leading-snug text-slate-700 dark:text-slate-200">
            {titleAr}
          </h2>
          <p
            className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white"
            dir="ltr"
          >
            {count.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400" dir="ltr">
            Total units
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          aria-hidden
        >
          {icon}
        </div>
      </div>
    </article>
  )
}

export default function InventoryDashboardPage() {
  const { items, totals, addItem, setItemStatus } = useInventory()
  const [qtyInput, setQtyInput] = useState('')
  const [formError, setFormError] = useState('')
  const [flashId, setFlashId] = useState(null)

  const handleQtyChange = useCallback((e) => {
    const v = e.target.value
    if (v === '') {
      setQtyInput('')
      return
    }
    if (/^\d+$/.test(v)) {
      setQtyInput(v)
    }
  }, [])

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault()
      setFormError('')
      const n = parseInt(qtyInput, 10)
      if (!qtyInput || Number.isNaN(n) || n < 1) {
        setFormError('Enter a valid quantity (whole number ≥ 1).')
        return
      }
      const row = addItem(n)
      if (row) {
        setQtyInput('')
        setFlashId(row.id)
        window.setTimeout(() => setFlashId(null), 600)
      }
    },
    [addItem, qtyInput],
  )

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Inventory Management
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Front-end only — data is saved in your browser (localStorage).
        </p>
      </header>

      {/* Dashboard cards */}
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Inventory summary"
      >
        <StatCard
          titleAr="عرض جميع الايتمات"
          count={totals.all}
          gradient="from-sky-50 to-white dark:from-sky-950/40 dark:to-slate-900"
          iconBg="bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          titleAr="عرض الاتمات التي يمكن استخدامها"
          count={totals.available}
          gradient="from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900"
          iconBg="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          titleAr="عرض الاتمات التي قيد الاستخدام"
          count={totals.inUse}
          gradient="from-violet-50 to-white dark:from-violet-950/40 dark:to-slate-900"
          iconBg="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          titleAr="عرض الاتيمات المكسورة"
          count={totals.damaged}
          gradient="from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900"
          iconBg="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </section>

      {/* Quantity + Add */}
      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Add inventory line
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          New rows start as <span className="font-medium text-emerald-600 dark:text-emerald-400">Available</span>.
        </p>
        <form
          onSubmit={handleAdd}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="inv-quantity"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Quantity
            </label>
            <input
              id="inv-quantity"
              name="quantity"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 25"
              value={qtyInput}
              onChange={handleQtyChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98] dark:shadow-indigo-900/40"
          >
            Add Item
          </button>
        </form>
        {formError ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {formError}
          </p>
        ) : null}
      </section>

      {/* Table */}
      <section className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Items
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {items.length} line{items.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-3 md:hidden">
          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
              No items yet. Add a quantity above.
            </p>
          ) : (
            items.map((row) => (
              <article
                key={row.id}
                className={[
                  'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900',
                  flashId === row.id ? 'inv-row-enter' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                    {row.id}
                  </span>
                  <span className="tabular-nums text-sm text-slate-600 dark:text-slate-400">
                    Qty: <strong className="text-slate-900 dark:text-white">{row.quantity}</strong>
                  </span>
                </div>
                <label className="mt-3 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Status
                  <select
                    value={row.status}
                    onChange={(e) => setItemStatus(row.id, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="available">{STATUS_LABEL.available}</option>
                    <option value="in_use">{STATUS_LABEL.in_use}</option>
                    <option value="damaged">{STATUS_LABEL.damaged}</option>
                  </select>
                </label>
              </article>
            ))
          )}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:block">
          {items.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              No items yet. Add a quantity above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Item ID</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((row) => (
                    <tr
                      key={row.id}
                      className={[
                        'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                        flashId === row.id ? 'inv-row-enter' : '',
                      ].join(' ')}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-900 dark:text-white">
                        {row.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-700 dark:text-slate-300">
                        {row.quantity}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={row.status}
                          onChange={(e) => setItemStatus(row.id, e.target.value)}
                          className="w-full min-w-[140px] max-w-xs rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                          aria-label={`Status for ${row.id}`}
                        >
                          <option value="available">{STATUS_LABEL.available}</option>
                          <option value="in_use">{STATUS_LABEL.in_use}</option>
                          <option value="damaged">{STATUS_LABEL.damaged}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
