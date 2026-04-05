import { useCallback } from 'react'
import { t } from '../i18n'
import type { Locale } from '../types'

interface Props {
  locale: Locale
}

const ITEMS = [
  { icon: '🍽️', key: 'comply.mapaq', cat: 'MAPAQ' },
  { icon: '🧼', key: 'comply.hygiene', cat: 'Food Safety' },
  { icon: '🍺', key: 'comply.alcohol', cat: 'Alcohol' },
  { icon: '🍺', key: 'comply.display', cat: 'Grocery Permit' },
  { icon: '🎰', key: 'comply.loto', cat: 'Loto-Québec' },
  { icon: '🚬', key: 'comply.tobacco', cat: 'Tobacco / QST' },
]

function generateICS(): string {
  const now = new globalThis.Date()
  const year = now.getFullYear()
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lydias Depanneur OS//Compliance//EN',
    'CALSCALE:GREGORIAN',
  ]
  // Monthly compliance review reminder
  for (let month = 0; month < 12; month++) {
    const d = new globalThis.Date(year, month, 1, 9, 0)
    const dtstart = d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
    const end = new globalThis.Date(year, month, 1, 10, 0)
    const dtend = end.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:Lydia's - Monthly Compliance Review`,
      'DESCRIPTION:Check: MAPAQ permit displayed\\nFood hygiene training current\\nAlcohol permit valid\\nLoto-Quebec thresholds met\\nTobacco QST registration',
      `UID:lydias-comply-${year}-${month}@depanneur-os`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export default function CompliancePanel({ locale }: Props) {
  const handleExportCalendar = useCallback(() => {
    const ics = generateICS()
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lydias-compliance-reminders.ics'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <div>
      <div className="panel-header">
        <h1>{t('comply.title', locale)}</h1>
        <p>Quebec regulatory requirements for dépanneurs</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-secondary" onClick={handleExportCalendar}>
          📅 {t('comply.export.calendar', locale)}
        </button>
      </div>

      <div className="glass-card">
        {ITEMS.map((item, i) => (
          <div key={i} className="comply-item" style={i < ITEMS.length - 1 ? { borderBottom: '1px solid var(--border-glass)' } : undefined}>
            <div className="comply-icon">{item.icon}</div>
            <div className="comply-text">
              <h3>{item.cat}</h3>
              <p>{t(item.key, locale)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
