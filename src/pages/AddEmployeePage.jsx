import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const initialErrors = {
  username: '',
  password: '',
  role: '',
}

const fieldClass =
  'w-full rounded-xl border border-borderbase bg-primary px-3 py-2.5 text-textbase shadow-sm outline-none ring-transparent transition focus:border-accent focus:ring-4 focus:ring-accent/20 dark:placeholder:text-textmuted'

export default function AddEmployeePage() {
  const { addAccount, user } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [errors, setErrors] = useState(initialErrors)
  const [serverError, setServerError] = useState('')

  if (user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl text-center py-12">
        <h2 className="text-2xl font-bold text-textbase">Access Denied</h2>
        <p className="mt-2 text-textmuted">You must be an administrator to view this page.</p>
      </div>
    )
  }

  function validate() {
    const next = { ...initialErrors }
    if (!username.trim() || username.trim().length < 3) {
      next.username = 'Username must be at least 3 characters.'
    }
    
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      next.password = 'Password must be at least 8 characters and contain letters and numbers.'
    }

    if (!role) {
      next.role = 'Role is required.'
    }
    setErrors(next)
    return !next.username && !next.password && !next.role
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    const result = addAccount(username.trim(), password, '', role)
    if (!result.ok) {
      setServerError(result.error || 'Failed to create account.')
      return
    }

    setUsername('')
    setPassword('')
    setRole('user')
    setErrors(initialErrors)
    navigate('/employees', {
      replace: false,
      state: { toast: 'Employee account created successfully.' },
    })
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
          Add Employee
        </h1>
        <p className="mt-1 text-sm text-textmuted">
          Create a new user account for an employee. (Admin Only)
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-borderbase bg-secondary p-5 shadow-sm sm:p-6"
        noValidate
      >
        {serverError && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {serverError}
          </div>
        )}

        <div>
          <label
            htmlFor="emp-username"
            className="mb-1 block text-sm font-medium text-textbase"
          >
            Username
          </label>
          <input
            id="emp-username"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            className={fieldClass}
            placeholder="e.g. jsmith"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="emp-password"
            className="mb-1 block text-sm font-medium text-textbase"
          >
            Password
          </label>
          <input
            id="emp-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="Min. 8 chars, letters & numbers"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="emp-role"
            className="mb-1 block text-sm font-medium text-textbase"
          >
            Role
          </label>
          <select
            id="emp-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`${fieldClass}`}
          >
            <option value="user">Employee</option>
            <option value="admin">Administrator</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="submit"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-btntext shadow-md hover:opacity-90"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  )
}
