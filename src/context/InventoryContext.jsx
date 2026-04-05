import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'inventory_dashboard_v1'

/** @typedef {'available' | 'in_use' | 'damaged'} ItemStatus */

/**
 * @typedef {{ id: string, quantity: number, status: ItemStatus }} InventoryRow
 */

const InventoryContext = createContext(null)

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (row) =>
        row &&
        typeof row.id === 'string' &&
        typeof row.quantity === 'number' &&
        ['available', 'in_use', 'damaged'].includes(row.status),
    )
  } catch {
    return []
  }
}

function nextId(existing) {
  const nums = existing.map((r) => {
    const m = /^INV-(\d+)$/.exec(r.id)
    return m ? parseInt(m[1], 10) : 0
  })
  const max = nums.length ? Math.max(...nums) : 0
  return `INV-${String(max + 1).padStart(3, '0')}`
}

export function InventoryProvider({ children }) {
  const [items, setItems] = useState(loadItems)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore quota / private mode */
    }
  }, [items])

  const addItem = useCallback((quantity) => {
    const q = Math.floor(Number(quantity))
    if (!Number.isFinite(q) || q < 1) return null
    let created = null
    setItems((prev) => {
      created = {
        id: nextId(prev),
        quantity: q,
        status: 'available',
      }
      return [created, ...prev]
    })
    return created
  }, [])

  const setItemStatus = useCallback((id, status) => {
    if (!['available', 'in_use', 'damaged'].includes(status)) return
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    )
  }, [])

  const totals = useMemo(() => {
    const sum = (predicate) =>
      items.reduce(
        (acc, row) => acc + (predicate(row) ? row.quantity : 0),
        0,
      )
    return {
      all: sum(() => true),
      available: sum((r) => r.status === 'available'),
      inUse: sum((r) => r.status === 'in_use'),
      damaged: sum((r) => r.status === 'damaged'),
    }
  }, [items])

  const value = useMemo(
    () => ({
      items,
      totals,
      addItem,
      setItemStatus,
    }),
    [items, totals, addItem, setItemStatus],
  )

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return ctx
}
