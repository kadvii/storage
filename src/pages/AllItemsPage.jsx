import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWarehouse } from '../context/WarehouseContext'
import { useAuth } from '../context/AuthContext'

export default function AllItemsPage() {
  const { items, updateItem, deleteItem } = useWarehouse()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editQuantity, setEditQuantity] = useState(0)
  const [editCategory, setEditCategory] = useState('')

  function handleEditClick(item) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditQuantity(item.quantity)
    setEditCategory(item.category)
  }

  function handleSaveEdit(item) {
    if (!editName.trim()) {
      alert("Name is required.")
      return
    }
    updateItem(item.id, {
      name: editName,
      quantity: Number(editQuantity) || 0,
      category: editCategory
    })
    setEditingId(null)
  }

  function handleDeleteClick(id) {
    if (window.confirm(`Are you sure you want to delete item ID ${id}?`)) {
      deleteItem(id)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
            All Items
          </h1>
          <p className="text-sm text-textmuted">
            A list of all items currently registered in the warehouse.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/add-item')}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            + Add Item
          </button>
          <button
            onClick={() => navigate('/dispatch-item')}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
          >
            - Dispatch Item
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-borderbase bg-secondary shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-textmuted">
            No items yet. Add a new item from the Add Item page.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-borderbase bg-primary text-xs font-semibold uppercase tracking-wide text-textmuted">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Category</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderbase">
                {items.map((row) => {
                  const isEditing = editingId === row.id
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-hoverbase">
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-textbase">
                        {row.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-textbase">
                        {isEditing && isAdmin ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="rounded border border-borderbase bg-primary text-textbase px-2 py-1 text-sm w-full"
                          />
                        ) : (
                          <span className={
                            row.name.toLowerCase().includes('bracket') ? 'text-accent' : 
                            row.name.toLowerCase().includes('panel') ? 'text-[#F59E0B]' : ''
                          }>
                            {row.name}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-textbase">
                        {isEditing && isAdmin ? (
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="rounded border border-borderbase bg-primary text-textbase px-2 py-1 text-sm w-24"
                          />
                        ) : (
                          <span className={
                            row.quantity > 50 ? 'text-accent font-medium' :
                            row.quantity > 10 ? 'text-[#F59E0B] font-medium' :
                            'text-[#EF4444] font-medium'
                          }>
                            {row.quantity}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-textbase">
                        {isEditing && isAdmin ? (
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="rounded border border-borderbase bg-primary text-textbase px-2 py-1 text-sm"
                          >
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                          </select>
                        ) : (
                          row.category
                        )}
                      </td>
                      {isAdmin && (
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSaveEdit(row)}
                                className="rounded text-accent hover:opacity-80 font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded text-textmuted hover:text-textbase font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleEditClick(row)}
                                className="text-accent hover:opacity-80 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(row.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 hover:dark:text-red-300 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
