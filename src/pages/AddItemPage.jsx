import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, useWarehouse } from '../context/WarehouseContext'

export const STATUS_OPTIONS = ['Available', 'In Use', 'Damaged']

const initialErrors = {
  name: '',
  category: '',
  serial: '',
}

const fieldClass = 'w-full rounded-xl border border-borderbase bg-primary px-3 py-2.5 text-textbase shadow-sm outline-none ring-transparent transition focus:border-accent focus:ring-4 focus:ring-accent/20'

export default function AddItemPage() {
  const { addItem, itemTypes } = useWarehouse()
  const navigate = useNavigate()

  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [serial, setSerial] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [imagePreview, setImagePreview] = useState(null)
  
  const [errors, setErrors] = useState(initialErrors)

  const availableTypes = category ? (itemTypes[category] || []) : []

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
    }
  }

  function validate() {
    const next = { ...initialErrors }

    if (!category) next.category = 'Pick a category.'
    if (!name) next.name = 'Please select an item type/name.'
    
    if (!serial.trim()) {
      next.serial = 'Serial Number is required.'
    } else if (serial.length < 3) {
      next.serial = 'Serial number too short.'
    }

    setErrors(next)
    return !next.name && !next.category && !next.serial
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    addItem({
      name,
      category,
      serial,
      description,
      status,
      image: imagePreview
    })

    setCategory('')
    setName('')
    setSerial('')
    setDescription('')
    setStatus(STATUS_OPTIONS[0])
    setImagePreview(null)
    setErrors(initialErrors)
    navigate('/all-items', {
      replace: false,
      state: { toast: 'Asset successfully registered.' },
    })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
          Register Asset
        </h1>
        <p className="mt-1 text-sm text-textmuted">
          Add a distinctly serialized unique asset to the inventory Tracker.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-borderbase bg-secondary p-6 shadow-sm"
        noValidate
      >
        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT — IMAGE UPLOAD */}
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium text-textbase">Asset Photo</label>
            <div
              className="flex-1 min-h-[320px] bg-primary border-2 border-dashed border-borderbase rounded-2xl overflow-hidden flex flex-col justify-center items-center relative group cursor-pointer hover:border-accent transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-6">
                  <svg className="mx-auto h-16 w-16 text-textmuted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-3 text-sm text-textmuted group-hover:text-textbase font-medium">Click to upload photo</p>
                  <p className="mt-1 text-xs text-textmuted">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* RIGHT — FIELDS */}
          <div className="flex flex-col gap-5">

            <div>
              <label htmlFor="item-category" className="mb-1.5 block text-sm font-medium text-textbase">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="item-category"
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setName('')
                }}
                className={`${fieldClass}`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="item-name" className="mb-1.5 block text-sm font-medium text-textbase">
                Item Type <span className="text-red-500">*</span>
              </label>
              <select
                id="item-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${fieldClass}`}
                disabled={!category}
              >
                <option value="">Select an item type...</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="item-serial" className="mb-1.5 block text-sm font-medium text-textbase">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                id="item-serial"
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                className={`${fieldClass} uppercase font-mono tracking-widest`}
                placeholder="E.G.  SN-1234-A"
              />
              {errors.serial && <p className="mt-1 text-sm text-red-500">{errors.serial}</p>}
            </div>

            <div>
              <label htmlFor="item-status" className="mb-1.5 block text-sm font-medium text-textbase">
                Initial Status
              </label>
              <select
                id="item-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${fieldClass}`}
              >
                {STATUS_OPTIONS.map((so) => (
                  <option key={so} value={so}>{so}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="item-desc" className="mb-1.5 block text-sm font-medium text-textbase">
                Description
              </label>
              <textarea
                id="item-desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${fieldClass} resize-none`}
                placeholder="Detailed specifications, notes, or assignment info..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-borderbase">
              <button
                type="button"
                className="rounded-xl border border-borderbase bg-primary px-5 py-2.5 text-sm font-semibold text-textbase hover:bg-hoverbase transition-colors"
                onClick={() => {
                  setCategory('')
                  setName('')
                  setSerial('')
                  setDescription('')
                  setStatus(STATUS_OPTIONS[0])
                  setImagePreview(null)
                  setErrors(initialErrors)
                }}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-btntext shadow-md hover:opacity-90 transition-opacity"
              >
                Register Item
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
