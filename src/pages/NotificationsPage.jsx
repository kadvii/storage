import { useWarehouse } from '../context/WarehouseContext'
import { useAuth } from '../context/AuthContext'

export default function NotificationsPage() {
  const { notifications, handleRequest } = useWarehouse()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const displayNotifications = isAdmin 
    ? notifications 
    : notifications.filter(n => n.userId === user?.id || n.userId === user?.username)

  const pendingRequests = displayNotifications.filter(n => n.status === 'PENDING')
  const completedRequests = displayNotifications.filter(n => n.status !== 'PENDING')

  const getStatusColor = (status) => {
    if (status === 'PENDING') return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    if (status === 'APPROVED') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    if (status === 'REJECTED') return 'text-red-500 bg-red-500/10 border-red-500/20'
    return 'text-textbase bg-secondary border-borderbase'
  }

  const getTypeLabel = (type) => {
    if (type === 'RETURN_REQUEST') return { label: 'Return Request', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' }
    if (type === 'DAMAGE_REQUEST') return { label: 'Damage Report', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' }
    return { label: 'Use Request', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' }
  }

  const getRequestDescription = (req) => {
    if (req.type === 'RETURN_REQUEST') {
      return <><span className="font-semibold text-textbase">{req.requestedBy}</span> wants to return:</>
    }
    if (req.type === 'DAMAGE_REQUEST') {
      return <><span className="font-semibold text-textbase">{req.requestedBy}</span> reported as damaged:</>
    }
    return <><span className="font-semibold text-textbase">{req.requestedBy}</span> requested to use:</>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
          Asset Requests
        </h1>
        <p className="text-sm text-textmuted">
          {isAdmin ? 'Manage incoming resource requests from employees.' : 'Track your asset requests and returns.'}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-textbase flex items-center gap-2">
          Pending Approvals
          {pendingRequests.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-primary">
              {pendingRequests.length}
            </span>
          )}
        </h2>
        
        {pendingRequests.length === 0 ? (
          <div className="rounded-xl border border-borderbase bg-secondary p-8 text-center text-sm text-textmuted">
            No pending requests.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(req => {
              const typeInfo = getTypeLabel(req.type)
              const isReturn = req.type === 'RETURN_REQUEST'
              return (
                <div 
                  key={req.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-secondary shadow-sm gap-4 ${
                    isReturn ? 'border-blue-400/30' : 'border-amber-500/30'
                  }`}
                >
                  <div>
                    {/* Request type badge */}
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border mb-2 ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <p className="text-sm text-textmuted mb-1">
                      {getRequestDescription(req)}
                    </p>
                    <p className={`font-bold ${isReturn ? 'text-blue-400' : 'text-accent'}`}>{req.itemName}</p>
                    <p className="text-xs text-textmuted mt-1 font-mono">
                      ID: {req.itemId} • {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleRequest(req.id, 'approve')}
                          className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRequest(req.id, 'reject')}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="space-y-4 pt-4 border-t border-borderbase">
        <h2 className="text-lg font-semibold text-textbase">
          Request History
        </h2>
        
        {completedRequests.length === 0 ? (
          <div className="rounded-xl border border-borderbase bg-secondary p-8 text-center text-sm text-textmuted">
            No past request history.
          </div>
        ) : (
          <div className="grid gap-3 opacity-80">
            {completedRequests.map(req => {
              const typeInfo = getTypeLabel(req.type)
              return (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-borderbase bg-secondary gap-4">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border mb-2 ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <p className="text-sm text-textmuted mb-1">
                      {getRequestDescription(req)}
                    </p>
                    <p className="font-medium text-textbase">{req.itemName}</p>
                    <p className="text-xs text-textmuted mt-1 font-mono">{new Date(req.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
