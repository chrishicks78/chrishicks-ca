import { useState, useCallback, useMemo } from 'react'
import { t } from '../i18n'
import type { Locale, SpecialCustomerRequest } from '../types'

interface Props {
  locale: Locale
  requests: SpecialCustomerRequest[]
  onAdd: (r: Omit<SpecialCustomerRequest, 'id'>) => Promise<void>
  onUpdate: (id: number, changes: Partial<SpecialCustomerRequest>) => Promise<void>
  onToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const STATUS_FLOW: SpecialCustomerRequest['status'][] = ['open', 'sourced', 'delivered', 'cancelled']
function daysAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

export default function CustomersPanel({ locale, requests, onAdd, onUpdate, onToast }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [request, setRequest] = useState('')
  const [cost, setCost] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'low'>('normal')
  const [search, setSearch] = useState('')

  const open = useMemo(() =>
    requests.filter((r) => (r.status === 'open' || r.status === 'sourced') &&
      (!search || r.customerName.toLowerCase().includes(search.toLowerCase()) || r.request.toLowerCase().includes(search.toLowerCase()))),
    [requests, search],
  )
  const closed = requests.filter((r) => r.status === 'delivered' || r.status === 'cancelled')
  const fulfilledThisMonth = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    return closed.filter((r) => r.status === 'delivered' && r.dateResolved && r.dateResolved >= monthStart).length
  }, [closed])

  async function handleAdd() {
    if (!name.trim() || !request.trim()) { onToast('Fill in both fields', 'warning'); return }
    await onAdd({
      customerName: name.trim(),
      request: request.trim(),
      status: 'open',
      dateRequested: Date.now(),
      estimatedCost: cost ? parseFloat(cost) : undefined,
      priority,
    })
    setName(''); setRequest(''); setCost(''); setPriority('normal')
    setShowAdd(false)
    onToast('Request added', 'success')
  }

  const handleStatus = useCallback(async (r: SpecialCustomerRequest, status: SpecialCustomerRequest['status']) => {
    const changes: Partial<SpecialCustomerRequest> = { status }
    if (status === 'delivered' || status === 'cancelled') {
      changes.dateResolved = globalThis.Date.now()
    }
    await onUpdate(r.id!, changes)
    onToast(`${r.customerName}: ${status}`, 'success')
  }, [onUpdate, onToast])

  return (
    <div>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1>{t('cust.title', locale)}</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>{t('cust.add', locale)}</button>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="glass-card stat-card">
          <div className="stat-label">{t('cust.active', locale)}</div>
          <div className="stat-value">{open.length}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">{t('cust.fulfilled', locale)}</div>
          <div className="stat-value positive">{fulfilledThisMonth}</div>
          <div className="stat-sub">this month</div>
        </div>
      </div>

      {/* Search */}
      {requests.length > 0 && (
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input className="form-input" placeholder={t('inv.search', locale)}
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {open.length === 0 && closed.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🙋</div>
          <p>{t('cust.empty', locale)}</p>
        </div>
      )}

      {open.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Active</h3>
          <div className="data-list">
            {open.map((r) => (
              <div key={r.id} className="data-row"
                style={r.priority === 'urgent' ? { borderLeft: '3px solid var(--error)' } : undefined}>
                <div className="row-main">
                  <div className="row-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.customerName}
                    {r.priority === 'urgent' && <span style={{ fontSize: 10, color: 'var(--error)', fontWeight: 700 }}>URGENT</span>}
                  </div>
                  <div className="row-sub">{r.request}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 12 }}>
                    <span>{daysAgo(r.dateRequested)}</span>
                    {r.estimatedCost != null && <span>Est: ${r.estimatedCost.toFixed(2)}</span>}
                  </div>
                </div>
                <span className={`badge badge-${r.status}`}>{r.status}</span>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {STATUS_FLOW.filter((s) => s !== r.status).map((s) => (
                    <button key={s} className="btn btn-sm btn-ghost" onClick={() => handleStatus(r, s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {closed.length > 0 && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Resolved</h3>
          <div className="data-list">
            {closed.slice(0, 10).map((r) => (
              <div key={r.id} className="data-row" style={{ opacity: 0.6 }}>
                <div className="row-main">
                  <div className="row-name">{r.customerName}</div>
                  <div className="row-sub">{r.request}</div>
                  {r.dateResolved && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{daysAgo(r.dateResolved)}</div>}
                </div>
                <span className={`badge badge-${r.status}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('cust.add', locale)}</h2>
            <div className="form-group">
              <label>{t('cust.name', locale)}</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label>{t('cust.request', locale)}</label>
              <textarea className="form-input" rows={3} value={request} onChange={(e) => setRequest(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Estimated Cost ($)</label>
                <input className="form-input" type="number" step="0.01" min="0" placeholder="0.00"
                  value={cost} onChange={(e) => setCost(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent' | 'low')}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>{t('common.cancel', locale)}</button>
              <button className="btn btn-primary" onClick={handleAdd}>{t('common.save', locale)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
