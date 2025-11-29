import React from 'react'
import { Plus, Search, Sun, Moon, Download } from 'lucide-react'

function TopBar({
  search,
  onSearchChange,
  onNew,
  isDark,
  onToggleTheme,
  onExportCSV,
  onExportMarkdown,
  onExportPDF,
}) {
  return (
    <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-semibold">
          IT
        </span>
        <div>
          <h1 className="text-sm font-semibold">Impact Tracking Dashboard</h1>
          <p className="text-[11px] text-slate-400">
            Capture impact, evidence, and appraisal bullets in one place.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-xl flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, problems, bullets... (/ to focus)"
            data-search-input="true"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-7 pr-3 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-2.5 py-1.5 text-xs font-medium shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:ring-offset-slate-950"
        >
          <Plus className="h-3.5 w-3.5" />
          New
          <span className="ml-1 rounded bg-primary-700/70 px-1 text-[10px] text-primary-100">N</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex rounded-lg border border-slate-700 bg-slate-900">
          <button
            type="button"
            onClick={onExportCSV}
            className="p-1.5 text-slate-300 hover:bg-slate-800"
            title="Export filtered as CSV"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onExportMarkdown}
            className="p-1.5 text-slate-300 hover:bg-slate-800 border-l border-slate-700"
            title="Export filtered as Markdown"
          >
            <span className="text-[10px] font-mono">MD</span>
          </button>
          <button
            type="button"
            onClick={onExportPDF}
            className="p-1.5 text-slate-300 hover:bg-slate-800 border-l border-slate-700"
            title="Export filtered as PDF"
          >
            <span className="text-[10px] font-mono">PDF</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="ml-1 inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
      </div>
    </header>
  )
}

export default TopBar
