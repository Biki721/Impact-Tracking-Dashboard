import React from 'react'
import { Star, StarOff, Edit2, Copy, Trash2, FileText, ArrowDownUp } from 'lucide-react'

function statusBadgeClass(status) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
    case 'In Progress':
      return 'bg-amber-900/40 text-amber-300 border-amber-700'
    case 'Iteration 2':
      return 'bg-sky-900/40 text-sky-300 border-sky-700'
    case 'Maintenance':
      return 'bg-slate-900/40 text-slate-300 border-slate-700'
    default:
      return 'bg-slate-900/40 text-slate-300 border-slate-700'
  }
}

function RecordList({
  records,
  selectedId,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStar,
  onExportSingle,
  sortBy,
  onChangeSort,
}) {
  return (
    <section className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950/40 min-w-[260px]">
      <header className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-[11px]">
        <div className="text-slate-300 font-medium">Records ({records.length})</div>
        <button
          type="button"
          onClick={onChangeSort}
          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-1.5 py-1 text-[10px] text-slate-300 hover:bg-slate-800"
        >
          <ArrowDownUp className="h-3 w-3" /> {sortBy}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto text-[11px]">
        {records.length === 0 ? (
          <div className="px-3 py-6 text-center text-slate-500 text-xs">
            No records match your filters yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {records.map((r) => {
              const isSelected = r.id === selectedId
              return (
                <li
                  key={r.id}
                  className={`cursor-pointer px-3 py-2.5 flex flex-col gap-1 border-l-2 ${
                    isSelected ? 'bg-slate-900/80 border-primary-500' : 'border-transparent hover:bg-slate-900/40'
                  }`}
                  onClick={() => onSelect(r.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-100 truncate max-w-[150px]">
                          {r.projectName}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${statusBadgeClass(
                            r.status,
                          )}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {r.category} • {r.startDate} → {r.endDate || '—'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(r.id)
                      }}
                      className="text-amber-400 hover:text-amber-300"
                      aria-label={r.starred ? 'Unstar record' : 'Star record'}
                    >
                      {r.starred ? <Star className="h-3.5 w-3.5 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {typeof r.usersImpacted === 'number' && (
                      <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300">
                        {r.usersImpacted} users
                      </span>
                    )}
                    {typeof r.hoursSavedPerMonth === 'number' && (
                      <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-emerald-300">
                        {r.hoursSavedPerMonth} h/mo
                      </span>
                    )}
                    {typeof r.manualStepsEliminated === 'number' && (
                      <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-sky-300">
                        −{r.manualStepsEliminated} steps
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    <p className="flex-1 text-[10px] text-slate-400 line-clamp-2">
                      {r.finalBullet || r.problem?.what}
                    </p>
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(r)
                        }}
                        className="p-1 rounded-md text-slate-300 hover:bg-slate-800"
                        title="Edit (E)"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDuplicate(r)
                        }}
                        className="p-1 rounded-md text-slate-300 hover:bg-slate-800"
                        title="Duplicate"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onExportSingle(r)
                        }}
                        className="p-1 rounded-md text-slate-300 hover:bg-slate-800"
                        title="Export PDF"
                      >
                        <FileText className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(r)
                        }}
                        className="p-1 rounded-md text-red-300/80 hover:bg-red-900/40"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

export default RecordList
