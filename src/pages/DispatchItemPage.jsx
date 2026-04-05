import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWarehouse } from '../context/WarehouseContext'

const initialForm = {
  itemId: '',
  quantity: '',
  details: '',
}

export default function DispatchItemPage() {
  const navigate = useNavigate()
  const { items, dispatchItem } = useWarehouse()
  
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const availableItems = items.filter(i => i.quantity > 0)

  function validate() {
    const next = {}
    if (!form.itemId) {
      next.itemId = 'Please select an item.'
    }
    const qty = Number(form.quantity)
    if (!form.quantity || isNaN(qty) || qty <= 0) {
      next.quantity = 'Quantity must be a positive number.'
    } else {
      const selectedItem = items.find(i => i.id === form.itemId)
      if (selectedItem && qty > selectedItem.quantity) {
        next.quantity = `Cannot dispatch more than available (${selectedItem.quantity}).`
      }
    }
    if (!form.details.trim() || form.details.trim().length < 3) {
      next.details = 'Please provide details/reason (min 3 chars).'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    const result = dispatchItem({
      itemId: form.itemId,
      quantity: Number(form.quantity),
      details: form.details.trim()
    })

    if (!result.ok) {
      setServerError(result.error || 'Failed to dispatch item.')
      return
    }

    setForm(initialForm)
    setErrors({})
    navigate('/items', {
      state: { toast: 'Item successfully dispatched!' },
    })
  }

  const fieldClass =
    'block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400'

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Dispatch Item
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Check out or dispatch an item from the warehouse.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {serverError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900/50">
            {serverError}
          </div>
        )}

        {availableItems.length === 0 ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400">
            No items available to dispatch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="item-select" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Item
              </label>
              <select
                id="item-select"
                value={form.itemId}
                onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                className={fieldClass}
              >
                <option value="">-- Select an item --</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Available: {item.quantity})
                  </option>
                ))}
              </select>
              {errors.itemId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.itemId}</p>}
            </div>

            <div>
              <label htmlFor="dispatch-quantity" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity to Dispatch
              </label>
              <input
                id="dispatch-quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={fieldClass}
                placeholder="e.g., 5"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>}
            </div>

            <div>
              <label htmlFor="dispatch-details" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Reason / Details
              </label>
              <input
                id="dispatch-details"
                type="text"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className={fieldClass}
                placeholder="e.g., Work Order #1234, Employee John Doe"
              />
              {errors.details && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.details}</p>}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                Dispatch Item
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
