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

const INITIAL_TYPES = {
  Hardware: ['Laptop', 'Desktop Monitor', 'Network Switch', 'Keyboard', 'Keyboard & Mouse Combo', 'Printer'],
  Software: ['Operating System', 'WMS License', 'Antivirus', 'Utility']
}

/** Seed inventory for the dashboard */
const INITIAL_ITEMS = [
  {
    id: '1',
    name: 'Laptop',
    quantity: 1,
    serial: 'ASUS-ROG-STRIX',
    description: 'ASUS ROG Strix G18 G815LM-S8090 - 18" 144Hz - Intel Core Ultra 9',
    status: 'Available',
    image: 'https://placehold.co/600x400/0F172A/22C55E?text=ASUS+ROG+Strix',
    category: 'Hardware',
    updatedAt: nowIso(),
  },
  {
    id: '2',
    name: 'Desktop Monitor',
    quantity: 1,
    serial: 'LENOVO-AIO-27',
    description: 'Lenovo IdeaCentre AIO 27IRH9 27" 100Hz All-in-One - Core i7',
    status: 'In Use',
    image: 'https://placehold.co/600x400/0F172A/F59E0B?text=Lenovo+AIO',
    category: 'Hardware',
    updatedAt: nowIso(),
  },
  {
    id: '3',
    name: 'WMS License',
    quantity: 1,
    serial: 'LIC-WMS-2026',
    description: 'Enterprise Warehouse Management System License key',
    status: 'Damaged',
    image: null,
    category: 'Software',
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

const INITIAL_NOTIFICATIONS = []

export const CATEGORIES = [
  'Hardware',
  'Software',
]

export function WarehouseProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [itemTypes, setItemTypes] = useState(INITIAL_TYPES)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const addCategoryType = useCallback((category, newType) => {
    const cleanType = newType.trim();
    if (!cleanType) return;
    setItemTypes(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), cleanType]
    }))
    setHistory((prev) => [
      { id: `h${Date.now()}_at`, action: 'Type config', detail: `Added type "${cleanType}" to ${category}`, actor: user?.displayName ?? 'Admin', at: nowIso() },
      ...prev
    ])
  }, [user])

  const removeCategoryType = useCallback((category, typeToRemove) => {
    setItemTypes(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(t => t !== typeToRemove)
    }))
    setHistory((prev) => [
      { id: `h${Date.now()}_rt`, action: 'Type config', detail: `Removed type "${typeToRemove}" from ${category}`, actor: user?.displayName ?? 'Admin', at: nowIso() },
      ...prev
    ])
  }, [user])

  const addItem = useCallback(
    ({ name, category, serial, description, status, image }) => {
      const actor = user?.displayName ?? 'Unknown'
      const ts = nowIso()
      const targetId = String(++idSeq)
      
      const newRecord = { 
        id: targetId, 
        name, 
        quantity: 1, 
        serial,
        description,
        status,
        image,
        category, 
        updatedAt: ts 
      }

      setItems((prev) => [newRecord, ...prev])

      setHistory((prev) => [
        {
          id: `h${Date.now()}_add`,
          action: 'Asset registered',
          detail: `${name} [SN: ${serial}] marked as ${status}`,
          actor,
          at: ts,
        },
        ...prev,
      ])
      return newRecord
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

  const requestItemUse = useCallback((item) => {
    if (!user) return
    const newRequest = {
      id: `req_${Date.now()}`,
      type: 'USE_REQUEST',
      itemId: item.id,
      itemName: item.name,
      requestedBy: user.displayName || user.username || 'Employee',
      userId: user.id || user.username || 'emp',
      status: 'PENDING',
      createdAt: nowIso()
    }
    setNotifications(prev => [newRequest, ...prev])
  }, [user])

  const requestItemReturn = useCallback((item) => {
    if (!user) return
    const newRequest = {
      id: `req_${Date.now()}`,
      type: 'RETURN_REQUEST',
      itemId: item.id,
      itemName: item.name,
      requestedBy: user.displayName || user.username || 'Employee',
      userId: user.id || user.username || 'emp',
      status: 'PENDING',
      createdAt: nowIso()
    }
    setNotifications(prev => [newRequest, ...prev])
  }, [user])

  const requestItemDamage = useCallback((item) => {
    if (!user) return
    const newRequest = {
      id: `req_${Date.now()}`,
      type: 'DAMAGE_REQUEST',
      itemId: item.id,
      itemName: item.name,
      requestedBy: user.displayName || user.username || 'Employee',
      userId: user.id || user.username || 'emp',
      status: 'PENDING',
      createdAt: nowIso()
    }
    setNotifications(prev => [newRequest, ...prev])
  }, [user])

  const handleRequest = useCallback((reqId, action) => {
    const actor = user?.displayName ?? 'Admin'
    const ts = nowIso()


    setNotifications(prev => {
      return prev.map(req => {
        if (req.id === reqId) {
          if (action === 'approve') {
            const isReturn = req.type === 'RETURN_REQUEST'
            const isDamage = req.type === 'DAMAGE_REQUEST'
            const newStatus = isReturn ? 'Available' : isDamage ? 'Damaged' : 'In Use'

            // Update item status
            setItems(itemsList => {
              const idx = itemsList.findIndex(i => i.id === req.itemId)
              if (idx !== -1) {
                const next = [...itemsList]
                next[idx] = { ...next[idx], status: newStatus, updatedAt: ts }
                return next
              }
              return itemsList
            })

            // Add to history
            setHistory(hPrev => [{
              id: `h${Date.now()}_approve`,
              action: isReturn ? 'Asset returned' : isDamage ? 'Asset damaged' : 'Asset assigned',
              detail: isReturn
                ? `${req.requestedBy} returned ${req.itemName} — now Available`
                : isDamage
                  ? `${req.requestedBy} reported ${req.itemName} as Damaged`
                  : `Assigned ${req.itemName} to ${req.requestedBy}`,
              actor,
              at: ts
            }, ...hPrev])

            return { ...req, status: 'APPROVED' }
          } else {
            return { ...req, status: 'REJECTED' }
          }
        }
        return req
      })
    })
  }, [user])

  const value = useMemo(
    () => ({
      items,
      history,
      itemTypes,
      notifications,
      addItem,
      updateItem,
      deleteItem,
      dispatchItem,
      addCategoryType,
      removeCategoryType,
      requestItemUse,
      requestItemReturn,
      requestItemDamage,
      handleRequest
    }),
    [items, history, itemTypes, notifications, addItem, updateItem, deleteItem, dispatchItem, addCategoryType, removeCategoryType, requestItemUse, requestItemReturn, requestItemDamage, handleRequest],
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
