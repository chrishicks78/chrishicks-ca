import { useState, useCallback } from 'react'
import { t } from '../i18n'
import type { Locale, ComplianceItem, UserProfile } from '../types'

interface Props {
  locale: Locale
  user: UserProfile
  items: ComplianceItem[]
  onUpdate: (id: string, changes: Partial<ComplianceItem>) => Promise<void>
  onToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

function computeStatus(item: ComplianceItem): ComplianceItem['status'] {
  if (!item.expiryDate) return item.status === 'ok' ? 'ok' : 'unknown'
  const now = Date.now()
  const expiry = new Date(item.expiryDate).getTime()
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  if (expiry < now) return 'expired'
  if (expiry - now < thirtyDays) return 'due-soon'
  return 'ok'
}

const STATUS_COLORS: Record<string, string> = {
  ok: 'var(--success)',
  'due-soon': 'var(--warning)',
  expired: 'var(--error)',
  unknown: 'var(--text-muted)',
}

const STATUS_LABELS: Record<string, string> = {
  ok: '✓ Current',
  'due-soon': '⚠ Due Soon',
  expired: '✗ Expired',
  unknown: '? Not Set',
}

function generateICS(): string {
  const now = new globalThis.Date()
  const year = now.getFullYear()
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lydias Depanneur OS//Compliance//EN',
    'CALSCALE:GREGORIAN',
  ]
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
      'DESCRIPTION:Check all permits and certifications',
      `UID:lydias-comply-${year}-${month}@depanneur-os`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`
  return `${Math.round(diff / 86400000)}d ago`
}

export default function CompliancePanel({ locale, user, items, onUpdate, onToast }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')

  const okCount = items.filter((i) => computeStatus(i) === 'ok').length

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

  const handleMarkChecked = useCallback(async (item: ComplianceItem) => {
    await onUpdate(item.id, {
      lastChecked: performance.timeOrigin + performance.now(),
      checkedBy: user.id,
      status: item.expiryDate ? computeStatus(item) : 'ok',
    })
    onToast(`${item.name}: verified`, 'success')
  }, [onUpdate, user.id, onToast])

  async function handleSetExpiry(id: string) {
    if (!editDate) return
    const item = items.find((i) => i.id === id)
    if (!item) return
    const updated = { ...item, expiryDate: editDate }
    await onUpdate(id, {
      expiryDate: editDate,
      status: computeStatus(updated),
    })
    setEditingId(null)
    setEditDate('')
    onToast('Expiry date set', 'success')
  }

  return (
    <div>
      <div className="panel-header">
        <h1>{t('comply.title', locale)}</h1>
        <p>Quebec regulatory requirements for dépanneurs</p>
      </div>

      {/* Summary bar */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="glass-card stat-card">
          <div className="stat-label">Compliance Status</div>
          <div className="stat-value" style={{ color: okCount === items.length ? 'var(--success)' : 'var(--warning)' }}>
            {okCount}/{items.length}
          </div>
          <div className="stat-sub">{okCount === items.length ? 'All current' : 'Items need attention'}</div>
        </div>
        <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCalendar}>
            📅 {t('comply.export.calendar', locale)}
          </button>
        </div>
      </div>

      {/* Compliance items */}
      <div className="data-list">
        {items.map((item) => {
          const status = computeStatus(item)
          return (
            <div key={item.id} className="glass-card" style={{ marginBottom: 12, borderLeft: `3px solid ${STATUS_COLORS[status]}` }}>
              <div className="comply-item" style={{ padding: 0 }}>
                <div className="comply-icon">{item.icon}</div>
                <div className="comply-text" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                      background: `${STATUS_COLORS[status]}22`, color: STATUS_COLORS[status],
                    }}>
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0' }}>{t(item.descKey, locale)}</p>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                    {item.expiryDate && <span>Expires: {item.expiryDate}</span>}
                    {item.lastChecked && <span>Checked: {timeAgo(item.lastChecked)}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => handleMarkChecked(item)}>
                  ✓ {t('comply.verify', locale)}
                </button>
                {editingId === item.id ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="date" className="form-input" style={{ width: 'auto', padding: '4px 8px', fontSize: 13 }}
                      value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    <button className="btn btn-sm btn-primary" onClick={() => handleSetExpiry(item.id)}>Set</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>✗</button>
                  </div>
                ) : (
                  <button className="btn btn-sm btn-ghost" onClick={() => { setEditingId(item.id); setEditDate(item.expiryDate || '') }}>
                    📅 Set Expiry
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
