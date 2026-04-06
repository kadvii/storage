import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, useWarehouse } from '../context/WarehouseContext'
import { useAuth } from '../context/AuthContext'
import { STATUS_OPTIONS } from './AddItemPage'

export default function AllItemsPage() {
  const { items, deleteItem, updateItem, requestItemUse, requestItemReturn, requestItemDamage, notifications } = useWarehouse()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const isEmployee = user?.role === 'user' || user?.role === 'employee'

  // View state: 'categories' or specific category name e.g., 'Hardware'
  const [activeCategory, setActiveCategory] = useState(null)
  
  // Tab state: 'All', 'Available', 'In Use', 'Damaged'
  const [activeStatus, setActiveStatus] = useState('All')
  
  const getStatusColor = (status) => {
    if (status === 'Available') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    if (status === 'In Use') return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    if (status === 'Damaged') return 'text-red-500 bg-red-500/10 border-red-500/20'
    return 'text-textbase bg-secondary border-borderbase'
  }

  function handleDeleteClick(id) {
    if (window.confirm(`Are you sure you want to permanently delete asset ID ${id}?`)) {
      deleteItem(id)
    }
  }

  if (!activeCategory) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
              Asset Catalog
            </h1>
            <p className="text-sm text-textmuted">
              {isAdmin ? 'Select a category to manage assets.' : 'Click a category below to view and request assets.'}
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/add-item')}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-btntext shadow-sm hover:opacity-90 transition-opacity"
              >
                + Register Asset
              </button>
            </div>
          )}
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {CATEGORIES.map(cat => {
            const catItems = items.filter(i => i.category === cat)
            const total = catItems.length
            const available = catItems.filter(i => i.status === 'Available').length
            const inUse = catItems.filter(i => i.status === 'In Use').length
            const damaged = catItems.filter(i => i.status === 'Damaged').length

            return (
              <div 
                key={cat} 
                onClick={() => { setActiveCategory(cat); setActiveStatus('All') }}
                className="group cursor-pointer rounded-2xl border border-borderbase bg-secondary pr-8 pl-8 pt-6 pb-6 shadow-sm hover:border-accent hover:shadow-md transition-all duration-300 flex flex-col items-center gap-6"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary p-4 rounded-full border border-borderbase group-hover:scale-110 group-hover:text-accent transition-all duration-300 mb-3">
                    {cat === 'Hardware' ? (
                      <svg className="h-8 w-8 text-textmuted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    ) : (
                      <svg className="h-8 w-8 text-textmuted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-textbase">{cat}</h2>
                  <p className="mt-1 text-sm text-textbase font-semibold">{total} Total Assets</p>
                </div>

                <div className="flex w-full justify-between items-center bg-primary rounded-xl p-4 border border-borderbase/50">
                  <div className={`flex flex-col items-center ${cat === 'Hardware' ? 'w-1/3' : 'w-1/2'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-textmuted mb-1">Available</span>
                    <span className="text-xl font-bold text-emerald-500">{available}</span>
                  </div>
                  <div className="w-px h-10 bg-borderbase"></div>
                  <div className={`flex flex-col items-center ${cat === 'Hardware' ? 'w-1/3' : 'w-1/2'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-textmuted mb-1">In Use</span>
                    <span className="text-xl font-bold text-amber-500">{inUse}</span>
                  </div>
                  {cat === 'Hardware' && (
                    <>
                      <div className="w-px h-10 bg-borderbase"></div>
                      <div className="flex flex-col items-center w-1/3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-textmuted mb-1">Damaged</span>
                        <span className="text-xl font-bold text-red-500">{damaged}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // --- Grid View (Category Selected) ---
  const filteredItems = items.filter(item => 
    item.category === activeCategory && 
    (activeStatus === 'All' || item.status === activeStatus)
  )

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <header className="flex flex-col space-y-4">
        <button 
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-sm font-semibold text-textmuted hover:text-accent w-fit mb-2 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
              {activeCategory} Catalog
            </h1>
            <p className="text-sm text-textmuted">
              {isAdmin ? 'Manage individual assets.' : 'Request available assets or return ones you\'re using.'}
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/add-item')}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-btntext shadow-sm hover:opacity-90 transition-opacity"
              >
                + Add {activeCategory}
              </button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 p-1 bg-secondary border border-borderbase rounded-xl w-full sm:w-fit overflow-x-auto">
          {['All', ...STATUS_OPTIONS].map(statusTab => (
            <button
              key={statusTab}
              onClick={() => setActiveStatus(statusTab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeStatus === statusTab 
                  ? 'bg-primary text-textbase shadow-sm border border-borderbase' 
                  : 'text-textmuted hover:text-textbase hover:bg-hoverbase'
              }`}
            >
              {statusTab}
            </button>
          ))}
        </div>
      </header>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-borderbase bg-secondary p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-textmuted">
            No items found for this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="group flex flex-col rounded-2xl border border-borderbase bg-secondary overflow-hidden shadow-sm hover:border-accent hover:shadow-md transition-all duration-300">
              
              {/* Image Header */}
              <div className="relative aspect-[4/3] bg-primary border-b border-borderbase overflow-hidden flex items-center justify-center p-4">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-textmuted flex flex-col items-center">
                    <svg className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium mt-1">No Image</span>
                  </div>
                )}
                
                {/* ID Badge absolute */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-bold text-textbase rounded shadow-sm border border-borderbase/50">
                  ID: {item.id}
                </div>

                {/* Status Badge absolute */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col relative">
                <p className="text-xs font-semibold text-accent mb-1 tracking-wide uppercase">
                  SN: {item.serial || 'N/A'}
                </p>
                <h3 className="text-base font-bold text-textbase leading-tight mb-2 line-clamp-2">
                  {item.name}
                </h3>
                
                <p className="text-sm text-textmuted line-clamp-3 mb-4 flex-1">
                  {item.description || 'No detailed description provided.'}
                </p>

                {isAdmin ? (
                  /* ADMIN: direct status change + Delete */
                  <div className="mt-auto pt-4 border-t border-borderbase/50 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                      {item.status !== 'In Use' && (
                        <button
                          onClick={() => updateItem(item.id, { status: 'In Use' })}
                          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Mark In Use
                        </button>
                      )}
                      {item.status !== 'Available' && (
                        <button
                          onClick={() => updateItem(item.id, { status: 'Available' })}
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Mark Available
                        </button>
                      )}
                      {item.status !== 'Damaged' && (
                        <button
                          onClick={() => updateItem(item.id, { status: 'Damaged' })}
                          className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          Mark Damaged
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  /* EMPLOYEE: contextual buttons based on status */
                  <div className="mt-auto pt-4 border-t border-borderbase/50 flex flex-wrap justify-end gap-2">

                    {/* Available → Request to use */}
                    {item.status === 'Available' && (
                      notifications.some(n => n.itemId === item.id && n.status === 'PENDING' && n.type === 'USE_REQUEST') ? (
                        <span className="text-xs font-semibold text-amber-500">Pending...</span>
                      ) : (
                        <button
                          onClick={() => { requestItemUse(item); alert('Request sent to admin!') }}
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Request Asset
                        </button>
                      )
                    )}

                    {/* In Use → Return */}
                    {item.status === 'In Use' && (
                      notifications.some(n => n.itemId === item.id && n.status === 'PENDING' && n.type === 'RETURN_REQUEST') ? (
                        <span className="text-xs font-semibold text-amber-500">Return Pending...</span>
                      ) : (
                        <button
                          onClick={() => { requestItemReturn(item); alert('Return request sent to admin!') }}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Return Asset
                        </button>
                      )
                    )}

                    {/* Available or In Use → Report Damaged */}
                    {(item.status === 'Available' || item.status === 'In Use') && (
                      notifications.some(n => n.itemId === item.id && n.status === 'PENDING' && n.type === 'DAMAGE_REQUEST') ? (
                        <span className="text-xs font-semibold text-amber-500">Damage Pending...</span>
                      ) : (
                        <button
                          onClick={() => { requestItemDamage(item); alert('Damage report sent to admin!') }}
                          className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          Report Damaged
                        </button>
                      )
                    )}

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
