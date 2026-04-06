import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWarehouse, CATEGORIES } from '../context/WarehouseContext'

export default function AdminCategoriesPage() {
  const { user } = useAuth()
  const { itemTypes, addCategoryType, removeCategoryType, items } = useWarehouse()
  const [newType, setNewType] = useState('')
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0])

  if (user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl text-center py-12">
        <h2 className="text-2xl font-bold text-textbase">Access Denied</h2>
        <p className="mt-2 text-textmuted">You must be an administrator to view this page.</p>
      </div>
    )
  }

  function handleAdd(e, cat) {
    e.preventDefault()
    if (!newType.trim() || selectedCat !== cat) return
    addCategoryType(cat, newType)
    setNewType('')
  }
  
  const getCategoryStats = (cat) => {
    const catItems = items.filter(i => i.category === cat)
    const totalLines = catItems.length
    const totalQty = catItems.reduce((acc, curr) => acc + curr.quantity, 0)
    return { totalLines, totalQty }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
          Manage Dropdowns
        </h1>
        <p className="mt-1 text-sm text-textmuted">
          Add or remove strict item types for categorization.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CATEGORIES.map(cat => {
          const stats = getCategoryStats(cat)
          const types = itemTypes[cat] || []
          
          return (
            <section key={cat} className="rounded-2xl border border-borderbase bg-secondary shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-borderbase bg-primary">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-textbase">{cat} Options</h2>
                  <span className="text-xs font-semibold text-textmuted bg-secondary border border-borderbase px-2 py-1 rounded-full">
                    {stats.totalQty} Units / {stats.totalLines} Types
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 max-h-[400px] overflow-y-auto">
                {types.length === 0 ? (
                  <p className="text-sm text-textmuted text-center py-4">No types defined.</p>
                ) : (
                  <ul className="space-y-2">
                    {types.map(t => (
                      <li key={t} className="flex justify-between items-center p-3 rounded-xl border border-borderbase bg-primary hover:bg-hoverbase transition-colors">
                        <span className="text-sm font-medium text-textbase">{t}</span>
                        <button
                          onClick={() => removeCategoryType(cat, t)}
                          className="text-xs font-semibold text-red-500 hover:text-red-400 p-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="p-5 border-t border-borderbase bg-primary">
                <form onSubmit={(e) => handleAdd(e, cat)} className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCat === cat ? newType : ''}
                    onChange={e => { setSelectedCat(cat); setNewType(e.target.value) }}
                    placeholder={`New ${cat} type`}
                    className="flex-1 rounded-lg border border-borderbase bg-secondary text-textbase px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <button type="submit" disabled={!newType.trim() || selectedCat !== cat} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-btntext hover:opacity-90 disabled:opacity-50">
                    Add
                  </button>
                </form>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
