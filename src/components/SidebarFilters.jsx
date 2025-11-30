import React from 'react'
import { CATEGORIES, STATUS_OPTIONS } from '../constants.js'
import { Sparkles } from 'lucide-react'

function SidebarFilters({ filters, onChange, kpis, onGenerateSummary }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r px-3 py-3 gap-3 border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/60">
      <div>
        <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg border p-2 bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50">
            <div className="text-slate-400">Hours saved</div>
            <div className="text-sm font-semibold">{kpis.totalHoursSaved}</div>
          </div>
          <div className="rounded-lg border p-2 bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50">
            <div className="text-slate-400">Users helped</div>
            <div className="text-sm font-semibold">{kpis.totalUsersHelped}</div>
          </div>
          <div className="rounded-lg border p-2 bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50">
            <div className="text-slate-400">Automations</div>
            <div className="text-sm font-semibold">{kpis.totalAutomations}</div>
          </div>
          <div className="rounded-lg border p-2 bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50">
            <div className="text-slate-400">Bugs fixed</div>
            <div className="text-sm font-semibold">{kpis.totalBugsFixed}</div>
          </div>
        </div>
      </div>

      <div className="mt-1">
        <button
          type="button"
          onClick={onGenerateSummary}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-medium text-emerald-50 shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate appraisal summary
        </button>
        <p className="mt-1 text-[10px] text-slate-500">
          Uses starred records to compile 1-line bullets and copies them to your clipboard.
        </p>
      </div>

      <div className="mt-1 space-y-2 text-[11px]">
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</h3>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</h3>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech tag</h3>
          <input
            value={filters.tech}
            onChange={(e) => handleChange('tech', e.target.value)}
            placeholder="Python, React, Playwright..."
            className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">From</h3>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
              className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">To</h3>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
              className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Min hours/mo</h3>
            <input
              type="number"
              min={0}
              value={filters.minHours || ''}
              onChange={(e) => handleChange('minHours', e.target.value)}
              className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Min users</h3>
            <input
              type="number"
              min={0}
              value={filters.minUsers || ''}
              onChange={(e) => handleChange('minUsers', e.target.value)}
              className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Min steps removed</h3>
          <input
            type="number"
            min={0}
            value={filters.minSteps || ''}
            onChange={(e) => handleChange('minSteps', e.target.value)}
            className="w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white border-slate-300 text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50"
          />
        </div>
      </div>
    </aside>
  )
}

export default SidebarFilters
