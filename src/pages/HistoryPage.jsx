import { useState } from 'react'
import { useWarehouse } from '../context/WarehouseContext'

export default function HistoryPage() {
  const { history } = useWarehouse()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(history.length / itemsPerPage)
  const currentData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textbase sm:text-3xl">
          History
        </h1>
        <p className="mt-1 text-sm text-textmuted">
          Mock audit log of warehouse actions (newest first).
        </p>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {currentData.map((row) => (
          <article
            key={row.id}
            className="rounded-2xl border border-borderbase bg-secondary p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-textbase">
              {row.action}
            </p>
            <p className="mt-1 text-sm text-textmuted">
              {row.detail}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-textmuted">
              <span>{row.actor}</span>
              <span>{new Date(row.at).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>

      {/* md+: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-borderbase bg-secondary shadow-sm md:block flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary border-b border-borderbase text-xs font-semibold uppercase tracking-wide text-textmuted">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderbase">
              {currentData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-hoverbase transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-textbase">
                    {row.action}
                  </td>
                  <td className="max-w-md px-4 py-3 text-textmuted">
                    {row.detail}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-textmuted">
                    {row.actor}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-textmuted">
                    {new Date(row.at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-borderbase bg-primary px-4 py-3 sm:px-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-borderbase bg-secondary px-3 py-1.5 text-sm font-medium text-textbase transition-colors hover:bg-hoverbase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-textmuted">
              Page <span className="font-medium text-textbase">{currentPage}</span> of <span className="font-medium text-textbase">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-borderbase bg-secondary px-3 py-1.5 text-sm font-medium text-textbase transition-colors hover:bg-hoverbase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Pagination Control */}
      {totalPages > 1 && (
        <div className="md:hidden flex items-center justify-between border border-borderbase rounded-2xl bg-primary p-4 shadow-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-borderbase bg-secondary px-3 py-1.5 text-sm font-medium text-textbase transition-colors hover:bg-hoverbase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-textmuted">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-borderbase bg-secondary px-3 py-1.5 text-sm font-medium text-textbase transition-colors hover:bg-hoverbase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
