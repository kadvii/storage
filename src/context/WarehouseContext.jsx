import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

const WarehouseContext = createContext(null)

let idSeq = 100

function nowIso() {
  return new Date().toISOString()
}

/** Seed inventory for the dashboard */
const INITIAL_ITEMS = [
  {
    id: '1',
    name: 'Steel brackets',
    quantity: 240,
    category: 'Hardware',
    updatedAt: nowIso(),
  },
  {
    id: '2',
    name: 'LCD panels 24"',
    quantity: 18,
    category: 'Hardware',
    updatedAt: nowIso(),
  },
  {
    id: '3',
    name: 'Safety gloves (box)',
    quantity: 8,
    category: 'Hardware',
    updatedAt: nowIso(),
  },
]

/** Mock audit log shown on History */
const INITIAL_HISTORY = [
  {
    id: 'h1',
    action: 'Stock adjustment',
    detail: 'Steel brackets +40 units (cycle count)',
    actor: 'Jordan Manager',
    at: '2026-04-04T14:22:00.000Z',
  },
  {
    id: 'h2',
    action: 'Inbound receipt',
    detail: 'LCD panels 24" — PO #8841',
    actor: 'Alex Operator',
    at: '2026-04-03T09:10:00.000Z',
  },
  {
    id: 'h3',
    action: 'Outbound pick',
    detail: 'Safety gloves — Work order #1204',
    actor: 'Alex Operator',
    at: '2026-04-02T16:45:00.000Z',
  },
  {
    id: 'h4',
    action: 'Category update',
    detail: 'Merged "Fasteners" into Hardware',
    actor: 'Jordan Manager',
    at: '2026-04-01T11:00:00.000Z',
  },
]

export const CATEGORIES = [
  'Hardware',
  'Software',
]

export function WarehouseProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [history, setHistory] = useState(INITIAL_HISTORY)

  const addItem = useCallback(
    ({ name, quantity, category }) => {
      const actor = user?.displayName ?? 'Unknown'
      const id = String(++idSeq)
      const ts = nowIso()
      const record = {
        id,
        name: name.trim(),
        quantity: Number(quantity),
        category,
        updatedAt: ts,
      }
      setItems((prev) => [record, ...prev])
      setHistory((prev) => [
        {
          id: `h${id}`,
          action: 'Item created',
          detail: `${record.name} — ${record.quantity} × ${record.category}`,
          actor,
          at: ts,
        },
        ...prev,
      ])
      return record
    },
    [user],
  )

  const updateItem = useCallback((id, updates) => {
    const actor = user?.displayName ?? 'Unknown'
    const ts = nowIso()
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], ...updates, updatedAt: ts };
      return next;
    });
    setHistory((prev) => [
      {
        id: `h${Date.now()}_u`,
        action: 'Item updated',
        detail: `Updated item ID: ${id}`,
        actor,
        at: ts,
      },
      ...prev,
    ])
  }, [user])

  const deleteItem = useCallback((id) => {
    const actor = user?.displayName ?? 'Unknown'
    const ts = nowIso()
    setItems((prev) => prev.filter((i) => i.id !== id));
    setHistory((prev) => [
      {
        id: `h${Date.now()}_d`,
        action: 'Item deleted',
        detail: `Deleted item ID: ${id}`,
        actor,
        at: ts,
      },
      ...prev,
    ])
  }, [user])

  const dispatchItem = useCallback(({ itemId, quantity, details }) => {
    const actor = user?.displayName ?? 'Unknown'
    const ts = nowIso()
    let dispatchSuccess = false
    let itemName = ''

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === itemId);
      if (idx === -1) return prev;
      
      const currentItem = prev[idx];
      if (currentItem.quantity < quantity) {
        return prev;
      }
      
      dispatchSuccess = true
      itemName = currentItem.name
      const next = [...prev];
      next[idx] = { ...currentItem, quantity: currentItem.quantity - quantity, updatedAt: ts };
      return next;
    });

    if (dispatchSuccess) {
      setHistory((prev) => [
        {
          id: `h${Date.now()}_dispatch`,
          action: 'Outbound dispatch',
          detail: `${itemName} -${quantity} units (${details})`,
          actor,
          at: ts,
        },
        ...prev,
      ])
      return { ok: true }
    } else {
      return { ok: false, error: 'Insufficient quantity or item not found.' }
    }
  }, [user])

  const value = useMemo(
    () => ({
      items,
      history,
      addItem,
      updateItem,
      deleteItem,
      dispatchItem,
    }),
    [items, history, addItem, updateItem, deleteItem, dispatchItem],
  )

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  )
}

export function useWarehouse() {
  const ctx = useContext(WarehouseContext)
  if (!ctx) {
    throw new Error('useWarehouse must be used within WarehouseProvider')
  }
  return ctx
}
