import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, useWarehouse } from '../context/WarehouseContext'

const initialErrors = {
  name: '',
  quantity: '',
  category: '',
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-indigo-500/0 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20'

export default function AddItemPage() {
  const { addItem } = useWarehouse()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState(initialErrors)

  function validate() {
    const next = { ...initialErrors }
    const trimmed = name.trim()
    if (!trimmed) {
      next.name = 'Item name is required.'
    } else if (trimmed.length < 2) {
      next.name = 'Use at least 2 characters.'
    }

    const q = Number(quantity)
    if (quantity === '' || Number.isNaN(q)) {
      next.quantity = 'Enter a valid quantity.'
    } else if (!Number.isInteger(q)) {
      next.quantity = 'Quantity must be a whole number.'
    } else if (q < 1) {
      next.quantity = 'Quantity must be at least 1.'
    }

    if (!category) {
      next.category = 'Pick a category.'
    }

    setErrors(next)
    return !next.name && !next.quantity && !next.category
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    addItem({
      name: name.trim(),
      quantity: Number(quantity),
      category,
    })

    setName('')
    setQuantity('')
    setCategory('')
    setErrors(initialErrors)
    navigate('/dashboard', {
      replace: false,
      state: { toast: 'Item added successfully.' },
    })
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Add item
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Register a new line in inventory. Data stays in memory (mock only).
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
        noValidate
      >
        <div>
          <label
            htmlFor="item-name"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Item name
          </label>
          <input
            id="item-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="e.g. Forklift battery"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'item-name-error' : undefined}
          />
          {errors.name ? (
            <p id="item-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="item-qty"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Quantity
          </label>
          <input
            id="item-qty"
            name="quantity"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
            className={fieldClass}
            placeholder="e.g. 25"
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={
              errors.quantity ? 'item-qty-error' : undefined
            }
          />
          {errors.quantity ? (
            <p id="item-qty-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.quantity}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="item-category"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Category
          </label>
          <select
            id="item-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${fieldClass} bg-white dark:bg-slate-800`}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? 'item-category-error' : undefined
            }
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p
              id="item-category-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.category}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={() => {
              setName('')
              setQuantity('')
              setCategory('')
              setErrors(initialErrors)
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 dark:shadow-indigo-900/40"
          >
            Save item
          </button>
        </div>
      </form>
    </div>
  )
}
