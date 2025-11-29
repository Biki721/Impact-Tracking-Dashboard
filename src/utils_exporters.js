import jsPDF from 'jspdf'

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportRecordsToCSV(records) {
  const headers = [
    'Project Name',
    'Category',
    'Status',
    'Start Date',
    'End Date',
    'Hours Saved / Month',
    'Users Impacted',
    'Manual Steps Eliminated',
    'Bugs Fixed',
    'Final Summary Bullet',
  ]

  const rows = records.map((r) => [
    r.projectName,
    r.category,
    r.status,
    r.startDate || '',
    r.endDate || '',
    r.hoursSavedPerMonth ?? '',
    r.usersImpacted ?? '',
    r.manualStepsEliminated ?? '',
    r.bugsFixed ?? '',
    r.finalBullet || '',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, 'impact-records.csv')
}

export function exportRecordsToMarkdown(records) {
  const lines = []

  records.forEach((r) => {
    lines.push(`# ${r.projectName}`)
    lines.push('')
    lines.push(`**Category:** ${r.category}  `)
    lines.push(`**Status:** ${r.status}  `)
    if (r.startDate || r.endDate) {
      lines.push(`**Dates:** ${r.startDate || ''} → ${r.endDate || ''}`)
    }
    lines.push('')
    if (r.problem?.what) {
      lines.push('## Problem')
      lines.push(r.problem.what)
      lines.push('')
    }
    if (r.contribution?.summary) {
      lines.push('## Contribution')
      lines.push(r.contribution.summary)
      lines.push('')
    }
    if (r.impact && r.impact.length) {
      lines.push('## Quantifiable Impact')
      lines.push('| Metric | Before | After | Improvement |')
      lines.push('| --- | --- | --- | --- |')
      r.impact.forEach((row) => {
        lines.push(`| ${row.metric} | ${row.before} | ${row.after} | ${row.improvement} |`)
      })
      lines.push('')
    }
    if (r.finalBullet) {
      lines.push('## Summary Bullet')
      lines.push(`- ${r.finalBullet}`)
      lines.push('')
    }
    lines.push('---')
    lines.push('')
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' })
  downloadBlob(blob, 'impact-records.md')
}

function renderRecordToPdfPage(doc, record) {
  const lineHeight = 6
  let y = 10

  const addWrappedText = (text, x, maxWidth) => {
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line) => {
      doc.text(line, x, y)
      y += lineHeight
    })
  }

  doc.setFontSize(14)
  doc.text(record.projectName, 10, y)
  y += 8

  doc.setFontSize(10)
  addWrappedText(`Category: ${record.category} | Status: ${record.status}`, 10, 190)
  if (record.startDate || record.endDate) {
    addWrappedText(`Dates: ${record.startDate || ''} → ${record.endDate || ''}`, 10, 190)
  }

  if (record.problem?.what) {
    y += 4
    doc.setFontSize(11)
    doc.text('Problem', 10, y)
    y += 4
    doc.setFontSize(9)
    addWrappedText(record.problem.what, 10, 190)
  }

  if (record.contribution?.summary) {
    y += 4
    doc.setFontSize(11)
    doc.text('Contribution', 10, y)
    y += 4
    doc.setFontSize(9)
    addWrappedText(record.contribution.summary, 10, 190)
  }

  if (record.impact && record.impact.length) {
    y += 4
    doc.setFontSize(11)
    doc.text('Quantifiable Impact', 10, y)
    y += 4
    doc.setFontSize(9)
    record.impact.forEach((row) => {
      addWrappedText(
        `${row.metric}: ${row.before || '-'} → ${row.after || '-'} (${row.improvement || ''})`,
        10,
        190,
      )
    })
  }

  y += 4
  doc.setFontSize(11)
  doc.text('Key Metrics', 10, y)
  y += 4
  doc.setFontSize(9)
  const pieces = []
  if (record.hoursSavedPerMonth != null) pieces.push(`Hours saved/month: ${record.hoursSavedPerMonth}`)
  if (record.usersImpacted != null) pieces.push(`Users impacted: ${record.usersImpacted}`)
  if (record.manualStepsEliminated != null)
    pieces.push(`Manual steps eliminated: ${record.manualStepsEliminated}`)
  if (record.bugsFixed != null) pieces.push(`Bugs fixed: ${record.bugsFixed}`)
  if (pieces.length) {
    addWrappedText(pieces.join(' | '), 10, 190)
  }

  if (record.finalBullet) {
    y += 4
    doc.setFontSize(11)
    doc.text('Summary Bullet', 10, y)
    y += 4
    doc.setFontSize(9)
    addWrappedText(record.finalBullet, 10, 190)
  }
}

export function exportRecordToPDF(record) {
  const doc = new jsPDF()
  renderRecordToPdfPage(doc, record)
  const safeName = (record.projectName || 'impact-record').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  doc.save(`${safeName}.pdf`)
}

export function exportRecordsToPDF(records) {
  if (!records.length) return
  const doc = new jsPDF()
  records.forEach((record, idx) => {
    if (idx > 0) doc.addPage()
    renderRecordToPdfPage(doc, record)
  })
  doc.save('impact-records.pdf')
}
