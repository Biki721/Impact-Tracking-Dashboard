import React from 'react'
import { FileImage, Link as LinkIcon, MessageCircle, Clipboard } from 'lucide-react'

function DetailPane({ record, onEdit, onCopyBullet, onExportPDF }) {
  if (!record) {
    return (
      <section className="hidden md:flex md:flex-1 flex-col bg-slate-50 dark:bg-slate-950/40">
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
          Select a record to see details.
        </div>
      </section>
    )
  }

  const techSummary = [
    ...(record.tech?.languages || []),
    ...(record.tech?.frameworks || []),
    ...(record.tech?.infrastructure || []),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <section className="hidden md:flex md:flex-1 flex-col bg-slate-50 dark:bg-slate-950/40">
      <header className="flex items-center justify-between px-4 py-2 border-b text-[11px] border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{record.projectName}</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {record.category} • {record.status} • {record.startDate} → {record.endDate || '—'}
          </p>
          {techSummary && (
            <p className="text-[10px] text-slate-500 mt-0.5">
              Tech: {techSummary}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onCopyBullet(record)}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Clipboard className="h-3 w-3" /> Copy bullet
          </button>
          <button
            type="button"
            onClick={() => onExportPDF(record)}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-medium text-slate-50 hover:bg-primary-700"
          >
            Edit
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-[11px] space-y-4">
        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Problem</h3>
          <p className="text-slate-800 dark:text-slate-200 mb-1">{record.problem?.what}</p>
          {record.problem?.why && <p className="text-slate-600 dark:text-slate-400">Why: {record.problem.why}</p>}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contribution</h3>
          {record.contribution?.summary && (
            <p className="text-slate-800 dark:text-slate-200 mb-1">{record.contribution.summary}</p>
          )}
          {record.contribution?.responsibilities?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {record.contribution.responsibilities.map((resp) => (
                <span
                  key={resp}
                  className="rounded-full border px-2 py-0.5 text-[10px] bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                >
                  {resp}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantifiable impact</h3>
          {record.impact?.length ? (
            <div className="overflow-x-auto rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/60">
              <table className="min-w-full text-[11px]">
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-medium">Metric</th>
                    <th className="px-2 py-1.5 text-left font-medium">Before</th>
                    <th className="px-2 py-1.5 text-left font-medium">After</th>
                    <th className="px-2 py-1.5 text-left font-medium">Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 dark:divide-slate-800 dark:text-slate-200">
                  {record.impact.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1.5 align-top">{row.metric}</td>
                      <td className="px-2 py-1.5 align-top text-slate-600 dark:text-slate-300">{row.before}</td>
                      <td className="px-2 py-1.5 align-top text-slate-600 dark:text-slate-300">{row.after}</td>
                      <td className="px-2 py-1.5 align-top text-emerald-700 dark:text-emerald-300">{row.improvement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500">No impact metrics captured yet.</p>
          )}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Before vs After</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-md border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Before</div>
              <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap min-h-[60px]">
                {record.beforeText || '—'}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">After</div>
              <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap min-h-[60px]">
                {record.afterText || '—'}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">AI / automation value add</h3>
          {record.aiValueAdd?.features?.length || record.aiValueAdd?.outcome ? (
            <div>
              {record.aiValueAdd.features?.length ? (
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {record.aiValueAdd.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border px-2 py-0.5 text-[10px] bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              ) : null}
              {record.aiValueAdd.outcome && (
                <p className="text-slate-700 dark:text-slate-300">{record.aiValueAdd.outcome}</p>
              )}
            </div>
          ) : (
            <p className="text-slate-500">No AI-specific value add captured.</p>
          )}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Evidence / proof</h3>
          {record.evidence?.length ? (
            <div className="flex flex-wrap gap-2">
              {record.evidence.map((item, idx) => {
                if (item.type === 'upload' && item.mimeType?.startsWith('image/')) {
                  return (
                    <div
                      key={idx}
                      className="w-20 h-16 rounded-md border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center dark:border-slate-700 dark:bg-slate-900"
                    >
                      <img
                        src={item.url}
                        alt={item.label || 'Screenshot'}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )
                }

                if (item.type === 'upload') {
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                    >
                      <span className="text-[10px] font-mono">FILE</span>
                      <span className="max-w-[120px] truncate">{item.label}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-1 text-primary-300 hover:text-primary-200"
                      >
                        Open
                      </a>
                    </div>
                  )
                }

                return (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <LinkIcon className="h-3 w-3" />
                    {item.label || item.url}
                  </a>
                )
              })}
            </div>
          ) : (
            <p className="text-slate-500">No evidence attached yet. Add screenshots or links from the editor.</p>
          )}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Feedback</h3>
          {record.feedback?.length ? (
            <div className="space-y-1.5">
              {record.feedback.map((fb, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1.5 flex items-start gap-1.5 dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                      {fb.from && <span className="font-medium text-slate-700 dark:text-slate-300">{fb.from}</span>}
                      {fb.date && <span className="ml-1">• {fb.date}</span>}
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{fb.message}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No feedback captured yet.</p>
          )}
        </section>
      </div>
    </section>
  )
}

export default DetailPane
