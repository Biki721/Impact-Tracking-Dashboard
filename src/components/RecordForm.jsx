import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RESPONSIBILITIES, AI_FEATURES, DEFAULT_IMPACT_ROWS, CATEGORIES, STATUS_OPTIONS } from '../constants.js'
import { X, Save, SaveAll, Upload, Link as LinkIcon, Plus, Trash2, Sparkles } from 'lucide-react'

const formSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.string().min(1, 'Status is required'),
  team: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  problemWhat: z.string().min(1, 'Describe the problem'),
  problemWhy: z.string().optional(),
  contributionSummary: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  languages: z.string().optional(),
  frameworks: z.string().optional(),
  infrastructure: z.string().optional(),
  hoursSavedPerMonth: z.string().optional(),
  usersImpacted: z.string().optional(),
  bugsFixed: z.string().optional(),
  manualStepsEliminated: z.string().optional(),
  aiFeatures: z.array(z.string()).optional(),
  aiOutcome: z.string().optional(),
  beforeText: z.string().optional(),
  afterText: z.string().optional(),
  finalBullet: z.string().optional(),
})

function splitCsv(str) {
  return (str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildAutoBullet(values, impactRows) {
  const parts = []
  const tech = splitCsv(values.languages || '')[0] || splitCsv(values.frameworks || '')[0] || 'automation'
  if (values.projectName) {
    parts.push(`Automated ${values.projectName} using ${tech}`)
  }
  const metrics = []
  if (values.hoursSavedPerMonth) metrics.push(`saving ~${values.hoursSavedPerMonth} hours/month`)
  if (values.manualStepsEliminated) metrics.push(`eliminating ${values.manualStepsEliminated} manual steps`)
  if (values.usersImpacted) metrics.push(`helping ${values.usersImpacted} users`)
  if (!metrics.length && impactRows?.length) {
    const row = impactRows.find((r) => r.metric.toLowerCase().includes('error'))
    if (row?.improvement) metrics.push(row.improvement)
  }
  if (metrics.length) parts.push(metrics.join(', '))
  return parts.join(', ') || values.projectName || ''
}

function mapRecordToFormValues(record) {
  if (!record) {
    return {
      projectName: '',
      category: '',
      status: 'Completed',
      team: '',
      startDate: '',
      endDate: '',
      problemWhat: '',
      problemWhy: '',
      contributionSummary: '',
      responsibilities: [],
      languages: '',
      frameworks: '',
      infrastructure: '',
      hoursSavedPerMonth: '',
      usersImpacted: '',
      bugsFixed: '',
      manualStepsEliminated: '',
      aiFeatures: [],
      aiOutcome: '',
      beforeText: '',
      afterText: '',
      finalBullet: '',
    }
  }
  return {
    projectName: record.projectName || '',
    category: record.category || '',
    status: record.status || 'Completed',
    team: (record.team || []).join(', '),
    startDate: record.startDate || '',
    endDate: record.endDate || '',
    problemWhat: record.problem?.what || '',
    problemWhy: record.problem?.why || '',
    contributionSummary: record.contribution?.summary || '',
    responsibilities: record.contribution?.responsibilities || [],
    languages: (record.tech?.languages || []).join(', '),
    frameworks: (record.tech?.frameworks || []).join(', '),
    infrastructure: (record.tech?.infrastructure || []).join(', '),
    hoursSavedPerMonth:
      typeof record.hoursSavedPerMonth === 'number' ? String(record.hoursSavedPerMonth) : '',
    usersImpacted: typeof record.usersImpacted === 'number' ? String(record.usersImpacted) : '',
    bugsFixed: typeof record.bugsFixed === 'number' ? String(record.bugsFixed) : '',
    manualStepsEliminated:
      typeof record.manualStepsEliminated === 'number' ? String(record.manualStepsEliminated) : '',
    aiFeatures: record.aiValueAdd?.features || [],
    aiOutcome: record.aiValueAdd?.outcome || '',
    beforeText: record.beforeText || '',
    afterText: record.afterText || '',
    finalBullet: record.finalBullet || '',
  }
}

function buildRecordFromValues(values, impactRows, evidenceItems, feedbackItems, existing) {
  const now = new Date().toISOString()
  const id = existing?.id || crypto.randomUUID()
  const numeric = (val) => {
    const n = Number(val)
    return Number.isFinite(n) ? n : null
  }

  const record = {
    id,
    projectName: values.projectName.trim(),
    category: values.category,
    team: splitCsv(values.team),
    startDate: values.startDate || '',
    endDate: values.endDate || '',
    status: values.status,
    problem: {
      what: values.problemWhat.trim(),
      why: values.problemWhy || '',
    },
    contribution: {
      summary: values.contributionSummary || '',
      responsibilities: values.responsibilities || [],
    },
    tech: {
      languages: splitCsv(values.languages),
      frameworks: splitCsv(values.frameworks),
      infrastructure: splitCsv(values.infrastructure),
    },
    impact: (impactRows || []).filter((row) => row.metric && row.metric.trim().length > 0),
    hoursSavedPerMonth: numeric(values.hoursSavedPerMonth),
    usersImpacted: numeric(values.usersImpacted),
    bugsFixed: numeric(values.bugsFixed),
    manualStepsEliminated: numeric(values.manualStepsEliminated),
    aiValueAdd: {
      features: values.aiFeatures || [],
      outcome: values.aiOutcome || '',
    },
    beforeText: values.beforeText || '',
    afterText: values.afterText || '',
    evidence: evidenceItems,
    feedback: feedbackItems,
    finalBullet: values.finalBullet || buildAutoBullet(values, impactRows),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    starred: existing?.starred || false,
  }

  return record
}

function RecordForm({ initialRecord, onClose, onSave, onSaveDraft }) {
  const [impactRows, setImpactRows] = useState(
    initialRecord?.impact?.length ? initialRecord.impact : DEFAULT_IMPACT_ROWS,
  )
  const [evidenceItems, setEvidenceItems] = useState(initialRecord?.evidence || [])
  const [feedbackItems, setFeedbackItems] = useState(initialRecord?.feedback || [])
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [fbFrom, setFbFrom] = useState('')
  const [fbDate, setFbDate] = useState('')
  const [fbMessage, setFbMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: mapRecordToFormValues(initialRecord),
  })

  const onSubmit = (values) => {
    const record = buildRecordFromValues(values, impactRows, evidenceItems, feedbackItems, initialRecord)
    onSave(record)
  }

  const handleSaveDraftClick = () => {
    const values = getValues()
    if (!values.projectName && !values.problemWhat) return
    const record = buildRecordFromValues(values, impactRows, evidenceItems, feedbackItems, initialRecord)
    onSaveDraft(record)
  }

  const handleImpactChange = (index, key, value) => {
    setImpactRows((rows) => {
      const copy = [...rows]
      copy[index] = { ...copy[index], [key]: value }
      return copy
    })
  }

  const handleAddImpactRow = () => {
    setImpactRows((rows) => [...rows, { metric: '', before: '', after: '', improvement: '' }])
  }

  const handleRemoveImpactRow = (index) => {
    setImpactRows((rows) => rows.filter((_, i) => i !== index))
  }

  const handleUploadEvidence = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const url = ev.target?.result
        if (!url) return
        setEvidenceItems((prev) => [
          ...prev,
          {
            type: 'upload',
            label: file.name,
            url,
            mimeType: file.type,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddLinkEvidence = () => {
    if (!linkUrl) return
    setEvidenceItems((prev) => [
      ...prev,
      {
        type: 'link',
        label: linkLabel || linkUrl,
        url: linkUrl,
      },
    ])
    setLinkLabel('')
    setLinkUrl('')
  }

  const handleRemoveEvidence = (index) => {
    setEvidenceItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddFeedback = () => {
    if (!fbMessage) return
    setFeedbackItems((prev) => [
      ...prev,
      {
        from: fbFrom,
        date: fbDate,
        message: fbMessage,
      },
    ])
    setFbFrom('')
    setFbDate('')
    setFbMessage('')
  }

  const handleRemoveFeedback = (index) => {
    setFeedbackItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerateBullet = () => {
    const values = getValues()
    const bullet = buildAutoBullet(values, impactRows)
    if (!bullet) return
    const el = document.querySelector('textarea[name="finalBullet"]')
    if (el) {
      el.value = bullet
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-stretch justify-end bg-black/40">
      <section className="relative h-full w-full max-w-xl bg-slate-950 border-l border-slate-800 flex flex-col">
        <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-[11px]">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              {initialRecord ? 'Edit impact record' : 'New impact record'}
            </h2>
            <p className="text-[10px] text-slate-400">
              Matches your markdown template: problem, contribution, impact, evidence, feedback.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:bg-slate-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-[11px]"
        >
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">1️⃣ Basic information</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Project / Task name *</label>
                <input
                  {...register('projectName')}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.projectName && (
                  <p className="mt-0.5 text-[10px] text-red-400">{errors.projectName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">Category *</label>
                  <select
                    {...register('category')}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-0.5 text-[10px] text-red-400">{errors.category.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">Status *</label>
                  <select
                    {...register('status')}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-0.5 text-[10px] text-red-400">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Team / Stakeholders</label>
                <input
                  {...register('team')}
                  placeholder="Comma-separated e.g. Ops, Platform, AI"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">Start date</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">End date</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">2️⃣ Problem statement</h3>
            <div>
              <label className="block text-[11px] text-slate-300 mb-0.5">What issue existed before? *</label>
              <textarea
                {...register('problemWhat')}
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.problemWhat && (
                <p className="mt-0.5 text-[10px] text-red-400">{errors.problemWhat.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-0.5">Why was it important to solve?</label>
              <textarea
                {...register('problemWhy')}
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">3️⃣ Your contribution</h3>
            <div>
              <label className="block text-[11px] text-slate-300 mb-0.5">What exactly did you do?</label>
              <textarea
                {...register('contributionSummary')}
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <p className="text-[11px] text-slate-300 mb-1">Responsibilities (tick all that apply)</p>
              <div className="grid grid-cols-2 gap-1.5">
                {RESPONSIBILITIES.map((resp) => (
                  <label key={resp} className="inline-flex items-center gap-1 text-[10px] text-slate-200">
                    <input
                      type="checkbox"
                      value={resp}
                      {...register('responsibilities')}
                      className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-primary-500 focus:ring-primary-500"
                    />
                    <span>{resp}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">4️⃣ Tech stack</h3>
            <div className="space-y-1.5">
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Languages</label>
                <input
                  {...register('languages')}
                  placeholder="Python, TypeScript, SQL"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Frameworks & tools</label>
                <input
                  {...register('frameworks')}
                  placeholder="Playwright, React, FastAPI"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Infrastructure</label>
                <input
                  {...register('infrastructure')}
                  placeholder="Supabase, GCP, Docker, GitHub Actions"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">5️⃣ Quantifiable impact</h3>
            <div className="rounded-md border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800">
                <p className="text-[10px] text-slate-300">Metric table</p>
                <button
                  type="button"
                  onClick={handleAddImpactRow}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-200 hover:bg-slate-800"
                >
                  <Plus className="h-3 w-3" /> Row
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full text-[10px]">
                  <thead className="bg-slate-900/80 text-slate-300">
                    <tr>
                      <th className="px-2 py-1.5 text-left font-medium">Metric</th>
                      <th className="px-2 py-1.5 text-left font-medium">Before</th>
                      <th className="px-2 py-1.5 text-left font-medium">After</th>
                      <th className="px-2 py-1.5 text-left font-medium">Improvement</th>
                      <th className="px-1 py-1.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {impactRows.map((row, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1.5">
                          <input
                            value={row.metric}
                            onChange={(e) => handleImpactChange(index, 'metric', e.target.value)}
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            value={row.before}
                            onChange={(e) => handleImpactChange(index, 'before', e.target.value)}
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            value={row.after}
                            onChange={(e) => handleImpactChange(index, 'after', e.target.value)}
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            value={row.improvement}
                            onChange={(e) => handleImpactChange(index, 'improvement', e.target.value)}
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-1 py-1.5">
                          <button
                            type="button"
                            onClick={() => handleRemoveImpactRow(index)}
                            className="p-1 rounded-md text-red-300/80 hover:bg-red-900/40"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Hours saved per month</label>
                <input
                  type="number"
                  min={0}
                  {...register('hoursSavedPerMonth')}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Users impacted</label>
                <input
                  type="number"
                  min={0}
                  {...register('usersImpacted')}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Bugs fixed</label>
                <input
                  type="number"
                  min={0}
                  {...register('bugsFixed')}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Manual steps eliminated</label>
                <input
                  type="number"
                  min={0}
                  {...register('manualStepsEliminated')}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">6️⃣ AI / automation value add (optional)</h3>
            <div>
              <p className="text-[11px] text-slate-300 mb-1">AI used for</p>
              <div className="grid grid-cols-2 gap-1.5">
                {AI_FEATURES.map((f) => (
                  <label key={f} className="inline-flex items-center gap-1 text-[10px] text-slate-200">
                    <input
                      type="checkbox"
                      value={f}
                      {...register('aiFeatures')}
                      className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-primary-500 focus:ring-primary-500"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-0.5">Outcome</label>
              <textarea
                {...register('aiOutcome')}
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">7️⃣ Before vs after</h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Before</label>
                <textarea
                  {...register('beforeText')}
                  rows={2}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">After</label>
                <textarea
                  {...register('afterText')}
                  rows={2}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">8️⃣ Evidence / proof</h3>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-800 cursor-pointer">
                <Upload className="h-3 w-3" />
                <span>Upload screenshots</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleUploadEvidence}
                  className="hidden"
                />
              </label>
              <div className="flex items-center gap-1">
                <input
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  placeholder="Label"
                  className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://link"
                  className="w-36 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handleAddLinkEvidence}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-800"
                >
                  <LinkIcon className="h-3 w-3" /> Add link
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {evidenceItems.map((item, index) => {
                if (item.type === 'upload' && item.mimeType?.startsWith('image/')) {
                  return (
                    <div
                      key={index}
                      className="relative w-20 h-16 rounded-md border border-slate-700 bg-slate-900 overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={item.url}
                        alt={item.label || 'Screenshot'}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(index)}
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-[9px]"
                      >
                        ✕
                      </button>
                    </div>
                  )
                }

                if (item.type === 'upload') {
                  return (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200"
                    >
                      <span className="text-[10px] font-mono">FILE</span>
                      <span className="max-w-[100px] truncate">{item.label}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-1 text-primary-300 hover:text-primary-200"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(index)}
                        className="ml-1 text-slate-400 hover:text-slate-200"
                      >
                        ✕
                      </button>
                    </div>
                  )
                }

                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200"
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span className="max-w-[120px] truncate">{item.label || item.url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(index)}
                      className="ml-1 text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">9️⃣ Feedback received</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  value={fbFrom}
                  onChange={(e) => setFbFrom(e.target.value)}
                  placeholder="From (manager, lead, ops...)"
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[10px] placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="date"
                  value={fbDate}
                  onChange={(e) => setFbDate(e.target.value)}
                  className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-start gap-1.5">
                <textarea
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="Paste appreciation / feedback message..."
                  rows={2}
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[10px] placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-800"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              {feedbackItems.map((fb, index) => (
                <div
                  key={index}
                  className="rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1.5 flex items-start gap-1.5"
                >
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-400 mb-0.5">
                      {fb.from && <span className="font-medium text-slate-300">{fb.from}</span>}
                      {fb.date && <span className="ml-1">• {fb.date}</span>}
                    </div>
                    <div className="text-slate-200 whitespace-pre-wrap">{fb.message}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeedback(index)}
                    className="ml-1 text-slate-400 hover:text-slate-200 text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2 mb-20">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300">🔟 Final summary bullet</h3>
              <button
                type="button"
                onClick={handleGenerateBullet}
                className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-800"
              >
                <Sparkles className="h-3 w-3" /> Auto-suggest
              </button>
            </div>
            <textarea
              {...register('finalBullet')}
              name="finalBullet"
              rows={2}
              placeholder="Automated {project} using {tech}, saving ~{H} hours/month, eliminating {S} steps and helping {U} users."
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </section>
        </form>

        <footer className="absolute bottom-0 inset-x-0 border-t border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-between text-[11px]">
          <div className="text-[10px] text-slate-500">Autosaves draft every 30s if you fill project + problem.</div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-200 hover:bg-slate-800"
            >
              <SaveAll className="h-3 w-3" /> Save draft
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-2.5 py-1.5 text-[10px] font-medium text-slate-50 hover:bg-primary-700"
            >
              <Save className="h-3 w-3" /> Save
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default RecordForm
