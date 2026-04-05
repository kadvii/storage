import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EmployeesListPage() {
  const { user, accounts, updateAccount, deleteAccount } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const toastMessage = location.state?.toast
  
  const [editingUsername, setEditingUsername] = useState(null)
  const [editUsername, setEditUsername] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [editRole, setEditRole] = useState('')

  const isAdmin = user?.role === 'admin'

  // Convert accounts object to an array, and sort by role (admin first), then username
  const accountList = Object.entries(accounts || {}).map(([username, data]) => ({
    username,
    ...data
  })).sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return a.username.localeCompare(b.username);
  })

  function handleEditClick(emp) {
    setEditingUsername(emp.username)
    setEditUsername(emp.username)
    setEditPassword(emp.password || '')
    setEditRole(emp.role || 'user')
  }

  function handleSaveEdit(emp) {
    if (!editUsername || editUsername.length < 3) {
      alert("Username must be at least 3 characters long.")
      return
    }
    if (!editPassword || editPassword.length < 8) {
      alert("Password must be at least 8 characters long.")
      return
    }
    const result = updateAccount(emp.username, editUsername, editPassword, editRole)
    if (!result.ok) {
      alert(result.error)
      return
    }
    setEditingUsername(null)
  }

  function handleDeleteClick(username) {
    if (username === user.username) {
      alert("You cannot delete your own account.")
      return
    }
    if (window.confirm(`Are you sure you want to delete the account for "${username}"?`)) {
      deleteAccount(username)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {toastMessage ? (
        <div
          className="flex flex-col gap-2 rounded-2xl border border-emerald-500/30 bg-secondary px-4 py-3 text-sm text-textbase sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <p>{toastMessage}</p>
          <button
            type="button"
            className="self-start rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-textbase ring-1 ring-borderbase hover:bg-hoverbase"
            onClick={() =>
              navigate(location.pathname, { replace: true, state: {} })
            }
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
          Employees
        </h1>
        <p className="text-sm text-textmuted">
          List of all registered employee accounts.
        </p>
      </header>

      <section className="rounded-2xl border border-borderbase bg-secondary shadow-sm overflow-hidden">
        {accountList.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-textmuted">
            No employees found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-borderbase bg-primary text-xs font-semibold uppercase tracking-wide text-textmuted">
                <tr>
                  <th className="px-4 py-3">Username</th>
                  {isAdmin && <th className="px-4 py-3">Password</th>}
                  <th className="px-4 py-3">Role</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderbase">
                {accountList.map((emp) => {
                  const isEditing = editingUsername === emp.username
                  
                  return (
                    <tr key={emp.username} className="transition-colors hover:bg-hoverbase">
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-textbase">
                        {isEditing && isAdmin ? (
                          <input
                            type="text"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                            className="rounded border border-borderbase bg-primary text-textbase px-2 py-1 text-sm"
                          />
                        ) : (
                          emp.username
                        )}
                      </td>
                      
                      {isAdmin && (
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-textbase">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              className="rounded border border-borderbase bg-primary text-textbase px-2 py-1 text-sm"
                            />
                          ) : (
                            emp.password
                          )}
                        </td>
                      )}

                      <td className="whitespace-nowrap px-4 py-3">
                        {isEditing && isAdmin ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="rounded border border-borderbase bg-primary text-textbase px-2 py-1 text-sm"
                          >
                            <option value="user">Employee</option>
                            <option value="admin">Administrator</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            emp.role === 'admin' 
                              ? 'bg-accent text-btntext' 
                              : 'bg-primary text-textbase border border-borderbase'
                          }`}>
                            {emp.role === 'admin' ? 'Administrator' : 'Employee'}
                          </span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSaveEdit(emp)}
                                className="rounded text-accent hover:opacity-80 font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUsername(null)}
                                className="rounded text-textmuted hover:text-textbase font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleEditClick(emp)}
                                className="text-accent hover:opacity-80 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(emp.username)}
                                className="text-red-500 hover:text-red-400 font-medium"
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
