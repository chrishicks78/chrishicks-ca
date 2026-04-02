import { useState, useCallback } from 'react'
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

export default function CustomersPanel({ locale, requests, onAdd, onUpdate, onToast }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [request, setRequest] = useState('')

  async function handleAdd() {
    if (!name.trim() || !request.trim()) { onToast('Fill in both fields', 'warning'); return }
    await onAdd({ customerName: name.trim(), request: request.trim(), status: 'open', dateRequested: Date.now() })
    setName('')
    setRequest('')
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

  const open = requests.filter((r) => r.status === 'open' || r.status === 'sourced')
  const closed = requests.filter((r) => r.status === 'delivered' || r.status === 'cancelled')

  return (
    <div>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1>{t('cust.title', locale)}</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>{t('cust.add', locale)}</button>
      </div>

      {open.length === 0 && closed.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🙋</div>
          <p>No special requests yet.</p>
        </div>
      )}

      {open.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Active</h3>
          <div className="data-list">
            {open.map((r) => (
              <div key={r.id} className="data-row">
                <div className="row-main">
                  <div className="row-name">{r.customerName}</div>
                  <div className="row-sub">{r.request}</div>
                </div>
                <span className={`badge badge-${r.status}`}>{r.status}</span>
                <div style={{ display: 'flex', gap: 4 }}>
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
