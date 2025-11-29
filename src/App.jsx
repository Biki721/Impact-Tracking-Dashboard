import React, { useEffect, useMemo, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import SidebarFilters from './components/SidebarFilters.jsx'
import RecordList from './components/RecordList.jsx'
import DetailPane from './components/DetailPane.jsx'
import RecordForm from './components/RecordForm.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { sampleRecords } from './sampleData.js'
import { exportRecordsToCSV, exportRecordsToMarkdown, exportRecordsToPDF, exportRecordToPDF } from './utils_exporters.js'

function computeKpis(records) {
  const totalHoursSaved = records.reduce((sum, r) => sum + (r.hoursSavedPerMonth || 0), 0)
  const totalUsersHelped = records.reduce((sum, r) => sum + (r.usersImpacted || 0), 0)
  const totalAutomations = records.filter((r) => r.category === 'Automation').length
  const totalBugsFixed = records.reduce((sum, r) => sum + (r.bugsFixed || 0), 0)
  return { totalHoursSaved, totalUsersHelped, totalAutomations, totalBugsFixed }
}

function App() {
  const [records, setRecords] = useLocalStorage('impact-records', sampleRecords)
  const [selectedId, setSelectedId] = useState(records[0]?.id || null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Latest')
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    tech: '',
    dateFrom: '',
    dateTo: '',
    minHours: '',
    minUsers: '',
    minSteps: '',
  })
  const [editingRecord, setEditingRecord] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [theme, setTheme] = useLocalStorage('impact-theme', 'dark')

  const isDark = theme === 'dark'

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDark])

  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const selectedRecord = useMemo(
    () => records.find((r) => r.id === selectedId) || null,
    [records, selectedId],
  )

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase()
    return records
      .filter((r) => {
        if (term) {
          const haystack = [
            r.projectName,
            r.category,
            r.status,
            r.problem?.what,
            r.problem?.why,
            r.finalBullet,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          if (!haystack.includes(term)) return false
        }

        if (filters.category && r.category !== filters.category) return false
        if (filters.status && r.status !== filters.status) return false

        if (filters.tech) {
          const techTerm = filters.tech.toLowerCase()
          const techValues = [
            ...(r.tech?.languages || []),
            ...(r.tech?.frameworks || []),
            ...(r.tech?.infrastructure || []),
          ]
            .join(' ')
            .toLowerCase()
          if (!techValues.includes(techTerm)) return false
        }

        if (filters.dateFrom && r.startDate && r.startDate < filters.dateFrom) return false
        if (filters.dateTo && r.endDate && r.endDate > filters.dateTo) return false

        const minHours = Number(filters.minHours || 0)
        if (minHours && (r.hoursSavedPerMonth || 0) < minHours) return false
        const minUsers = Number(filters.minUsers || 0)
        if (minUsers && (r.usersImpacted || 0) < minUsers) return false
        const minSteps = Number(filters.minSteps || 0)
        if (minSteps && (r.manualStepsEliminated || 0) < minSteps) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'Most impact') {
          const score = (r) => (r.hoursSavedPerMonth || 0) * 2 + (r.usersImpacted || 0) + (r.manualStepsEliminated || 0)
          return score(b) - score(a)
        }
        if (sortBy === 'Category') {
          return a.category.localeCompare(b.category)
        }
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
        return dateB - dateA
      })
  }, [records, search, filters, sortBy])

  const kpis = useMemo(() => computeKpis(filteredRecords), [filteredRecords])

  useEffect(() => {
    if (!selectedRecord && filteredRecords.length > 0) {
      setSelectedId(filteredRecords[0].id)
    }
  }, [filteredRecords, selectedRecord])

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        const el = document.querySelector('input[data-search-input="true"]')
        if (el) el.focus()
      }

      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        handleNewRecord()
      }

      if ((e.key === 'e' || e.key === 'E') && selectedRecord && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        handleEditRecord(selectedRecord)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const handleNewRecord = () => {
    setEditingRecord(null)
    setIsFormOpen(true)
  }

  const handleEditRecord = (record) => {
    setEditingRecord(record)
    setIsFormOpen(true)
  }

  const handleDeleteRecord = (record) => {
    if (!window.confirm(`Delete record "${record.projectName}"? This cannot be undone.`)) return
    setRecords(records.filter((r) => r.id !== record.id))
    if (selectedId === record.id) {
      setSelectedId(records[0]?.id || null)
    }
  }

  const handleDuplicateRecord = (record) => {
    const now = new Date().toISOString()
    const copy = {
      ...record,
      id: crypto.randomUUID(),
      projectName: `${record.projectName} (copy)`,
      createdAt: now,
      updatedAt: now,
      starred: false,
    }
    setRecords([copy, ...records])
    setSelectedId(copy.id)
  }

  const handleToggleStar = (id) => {
    setRecords(
      records.map((r) =>
        r.id === id
          ? {
              ...r,
              starred: !r.starred,
            }
          : r,
      ),
    )
  }

  const upsertRecord = (record) => {
    setRecords((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === record.id)
      if (existingIndex === -1) {
        return [record, ...prev]
      }
      const copy = [...prev]
      copy[existingIndex] = { ...prev[existingIndex], ...record }
      return copy
    })
    setSelectedId(record.id)
  }

  const handleSaveRecord = (record) => {
    upsertRecord(record)
    setIsFormOpen(false)
    setEditingRecord(null)
  }

  const handleSaveDraft = (record) => {
    upsertRecord(record)
  }

  const handleCopyBullet = async (record) => {
    const text = record.finalBullet || record.problem?.what || record.projectName
    try {
      await navigator.clipboard.writeText(text)
      window.alert('Copied summary bullet to clipboard')
    } catch (e) {
      console.error('Clipboard error', e)
    }
  }

  const handleGenerateAppraisalSummary = async () => {
    const starred = records.filter((r) => r.starred)
    if (!starred.length) {
      window.alert('Star at least one record first.')
      return
    }
    const bullets = starred.map((r) => r.finalBullet || r.problem?.what || r.projectName).filter(Boolean)
    const text = bullets.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      window.alert(`Copied ${bullets.length} bullets to clipboard`)
    } catch (e) {
      console.error('Clipboard error', e)
    }
  }

  const handleExportCSV = () => exportRecordsToCSV(filteredRecords)
  const handleExportMarkdown = () => exportRecordsToMarkdown(filteredRecords)
  const handleExportPDF = () => exportRecordsToPDF(filteredRecords)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onNew={handleNewRecord}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onExportCSV={handleExportCSV}
        onExportMarkdown={handleExportMarkdown}
        onExportPDF={handleExportPDF}
      />

      <div className="flex flex-1 min-h-0">
        <SidebarFilters
          filters={filters}
          onChange={setFilters}
          kpis={kpis}
          onGenerateSummary={handleGenerateAppraisalSummary}
        />

        <RecordList
          records={filteredRecords}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={handleEditRecord}
          onDuplicate={handleDuplicateRecord}
          onDelete={handleDeleteRecord}
          onToggleStar={handleToggleStar}
          onExportSingle={exportRecordToPDF}
          sortBy={sortBy}
          onChangeSort={() => {
            setSortBy((prev) => (prev === 'Latest' ? 'Most impact' : prev === 'Most impact' ? 'Category' : 'Latest'))
          }}
        />

        <DetailPane
          record={selectedRecord}
          onEdit={handleEditRecord}
          onCopyBullet={handleCopyBullet}
          onExportPDF={exportRecordToPDF}
        />
      </div>

      {isFormOpen && (
        <RecordForm
          initialRecord={editingRecord}
          onClose={() => {
            setIsFormOpen(false)
            setEditingRecord(null)
          }}
          onSave={handleSaveRecord}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </div>
  )
}

export default App
