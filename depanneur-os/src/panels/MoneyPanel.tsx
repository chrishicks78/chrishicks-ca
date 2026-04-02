import { useState, useMemo } from 'react'
import { t } from '../i18n'
import type { Locale, UserProfile, DailySales } from '../types'

interface Props {
  locale: Locale
  user: UserProfile
  sales: DailySales[]
  onAdd: (s: Omit<DailySales, 'id'>) => Promise<void>
  onToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function fmtCAD(n: number) {
  return `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

const SAP_EGGS = [
  'easter.sap.1', 'easter.sap.2', 'easter.sap.3',
  'easter.sap.4', 'easter.sap.5', 'easter.sap.6',
]

export default function MoneyPanel({ locale, user, sales, onAdd, onToast }: Props) {
  const [cashIn, setCashIn] = useState('')
  const [cardIn, setCardIn] = useState('')
  const [expenses, setExpenses] = useState('')
  const [notes, setNotes] = useState('')

  const today = todayStr()

  const todaySales = useMemo(
    () => sales.filter((s) => s.date === today),
    [sales, today],
  )

  const todayNet = useMemo(
    () => todaySales.reduce((sum, s) => sum + s.cashIn + s.cardIn - s.expenses, 0),
    [todaySales],
  )

  const todayCash = todaySales.reduce((s, r) => s + r.cashIn, 0)
  const todayCard = todaySales.reduce((s, r) => s + r.cardIn, 0)
  const todayExp = todaySales.reduce((s, r) => s + r.expenses, 0)

  // Last 7 days
  const weekData = useMemo(() => {
    const days: { date: string; label: string; net: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().slice(0, 10)
      const daySales = sales.filter((s) => s.date === ds)
      const net = daySales.reduce((sum, s) => sum + s.cashIn + s.cardIn - s.expenses, 0)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      days.push({ date: ds, label: dayNames[d.getDay()], net })
    }
    return days
  }, [sales])

  const weekMax = Math.max(1, ...weekData.map((d) => Math.abs(d.net)))
  const weekNet = weekData.reduce((s, d) => s + d.net, 0)

  async function handleRecord() {
    const c = parseFloat(cashIn) || 0
    const cd = parseFloat(cardIn) || 0
    const e = parseFloat(expenses) || 0
    if (c === 0 && cd === 0 && e === 0) {
      onToast('Enter at least one value', 'warning')
      return
    }
    await onAdd({ date: today, cashIn: c, cardIn: cd, expenses: e, notes, recordedBy: user.id })
    setCashIn('')
    setCardIn('')
    setExpenses('')
    setNotes('')
    // SAP easter egg 30% chance for owner
    if (Math.random() < 0.3) {
      const egg = SAP_EGGS[Math.floor(Math.random() * SAP_EGGS.length)]
      onToast(t(egg, locale), 'info')
    } else {
      onToast(t('easter.sap.1', locale).includes('ABAP')
        ? '✓ Sales recorded'
        : '✓ Sales recorded', 'success')
    }
  }

  // Owner-only gate (after all hooks)
  if (user.role !== 'owner') {
    return (
      <div className="locked-panel">
        <div className="lock-icon">🔒</div>
        <p>{t('money.owner.only', locale)}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="panel-header">
        <h1>{t('money.title', locale)}</h1>
      </div>

      {/* Hero: Net Today */}
      <div className="glass-card highlight" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="money-net">
          <div className="net-label">{t('money.net', locale)}</div>
          <div className={`net-value ${todayNet >= 0 ? 'positive' : 'negative'}`} style={{ color: todayNet >= 0 ? 'var(--success)' : 'var(--error)' }}>
            {fmtCAD(todayNet)}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>{t('money.cash', locale)}: {fmtCAD(todayCash)}</span>
          <span>{t('money.card', locale)}: {fmtCAD(todayCard)}</span>
          <span>{t('money.expenses', locale)}: {fmtCAD(todayExp)}</span>
        </div>
      </div>

      {/* Record Sales */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontWeight: 600 }}>{t('money.record', locale)}</h3>
        <div className="money-entry">
          <div className="money-input-group">
            <label>{t('money.cash', locale)}</label>
            <input
              className="form-input"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={cashIn}
              onChange={(e) => setCashIn(e.target.value)}
            />
          </div>
          <div className="money-input-group">
            <label>{t('money.card', locale)}</label>
            <input
              className="form-input"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={cardIn}
              onChange={(e) => setCardIn(e.target.value)}
            />
          </div>
          <div className="money-input-group">
            <label>{t('money.expenses', locale)}</label>
            <input
              className="form-input"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />
          </div>
        </div>
        <input
          className="form-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleRecord}>
          {t('money.record', locale)}
        </button>
      </div>

      {/* Weekly Bar Chart */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600 }}>{t('money.week', locale)}</h3>
          <span style={{ fontWeight: 700, color: weekNet >= 0 ? 'var(--success)' : 'var(--error)' }}>
            {fmtCAD(weekNet)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
          {weekData.map((d) => {
            const pct = weekMax > 0 ? (Math.abs(d.net) / weekMax) * 100 : 0
            const isToday = d.date === today
            return (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {d.net !== 0 ? fmtCAD(d.net) : '—'}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 40,
                    height: `${Math.max(pct, 4)}%`,
                    borderRadius: 4,
                    background: d.net >= 0 ? 'var(--success)' : 'var(--error)',
                    opacity: isToday ? 1 : 0.5,
                    transition: 'height 0.3s ease',
                  }}
                />
                <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {d.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* History */}
      <div className="glass-card">
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>History</h3>
        <div className="money-history">
          {sales.slice(0, 14).map((s) => {
            const net = s.cashIn + s.cardIn - s.expenses
            return (
              <div key={s.id} className="money-history-row">
                <span className="date">{s.date}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {fmtCAD(s.cashIn)} + {fmtCAD(s.cardIn)} − {fmtCAD(s.expenses)}
                </span>
                <span className="amount" style={{ color: net >= 0 ? 'var(--success)' : 'var(--error)' }}>
                  {fmtCAD(net)}
                </span>
              </div>
            )
          })}
          {sales.length === 0 && (
            <div className="empty-state">
              <p>No sales recorded yet. Start by recording today's sales above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
