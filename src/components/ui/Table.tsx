import React from 'react'

export default function Table({
  columns,
  rows,
  empty,
}: {
  columns: { key: string; header: string; className?: string }[]
  rows: { id: string; cells: Record<string, React.ReactNode> }[]
  empty?: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="bg-surface-50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={['px-4 py-3 text-left font-semibold text-slate-700', c.className ?? ''].join(' ')}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  {columns.map((c) => (
                    <td key={c.key} className={['px-4 py-3 text-slate-900', c.className ?? ''].join(' ')}>
                      {r.cells[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10">
                  {empty ?? <div className="text-center text-slate-600">No data available.</div>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

