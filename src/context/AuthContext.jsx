import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

/**
 * Mock accounts — no backend; passwords are for demo only.
 * user / user123  → role user
 * admin / admin123 → role admin
 */
const MOCK_ACCOUNTS = {
  user: {
    password: 'user123',
    role: 'user',
    displayName: 'Alex Operator',
  },
  admin: {
    password: 'admin123',
    role: 'admin',
    displayName: 'Jordan Manager',
  },
}

const STORAGE_KEY = 'warehouse_auth_v1'
const STORAGE_KEY_ACCOUNTS = 'warehouse_accounts_v1'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.username || !parsed?.role) return null
    return parsed
  } catch {
    return null
  }
}

function readStoredAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return MOCK_ACCOUNTS
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())
  const [accounts, setAccounts] = useState(() => readStoredAccounts())

  const login = useCallback((username, password) => {
    const key = String(username).trim().toLowerCase()
    const account = accounts[key]
    if (!account || account.password !== password) {
      return { ok: false, error: 'Invalid username or password.' }
    }
    const next = {
      username: key,
      role: account.role,
      displayName: account.displayName,
    }
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return { ok: true, role: account.role }
  }, [accounts])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const addAccount = useCallback((username, password, displayName, role) => {
    const key = String(username).trim().toLowerCase()
    if (accounts[key]) {
      return { ok: false, error: 'Username already exists.' }
    }
    const newAccount = { password, role, displayName }
    const next = { ...accounts, [key]: newAccount }
    setAccounts(next)
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(next))
    return { ok: true }
  }, [accounts])

  const updateAccount = useCallback((oldUsername, newUsername, password, role) => {
    const oldKey = String(oldUsername).trim().toLowerCase()
    const newKey = String(newUsername).trim().toLowerCase()
    
    if (!accounts[oldKey]) return { ok: false, error: 'Account not found.' }
    
    if (oldKey !== newKey && accounts[newKey]) {
      return { ok: false, error: 'New username already exists.' }
    }
    
    const next = { ...accounts }
    const accountData = { ...next[oldKey], password, role }
    
    if (oldKey !== newKey) {
      delete next[oldKey]
    }
    next[newKey] = accountData
    
    setAccounts(next)
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(next))
    return { ok: true }
  }, [accounts])

  const deleteAccount = useCallback((username) => {
    const key = String(username).trim().toLowerCase()
    if (!accounts[key]) return { ok: false, error: 'Account not found.' }
    const next = { ...accounts }
    delete next[key]
    setAccounts(next)
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(next))
    return { ok: true }
  }, [accounts])

  const value = useMemo(
    () => ({
      user,
      accounts,
      isAuthenticated: Boolean(user),
      login,
      logout,
      addAccount,
      updateAccount,
      deleteAccount,
    }),
    [user, accounts, login, logout, addAccount, updateAccount, deleteAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
