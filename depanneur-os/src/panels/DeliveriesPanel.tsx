import { useState, useMemo, useCallback } from 'react'
import { t } from '../i18n'
import type { Locale, UserProfile, Delivery, Supplier } from '../types'

interface Props {
  locale: Locale
  user: UserProfile
  deliveries: Delivery[]
  suppliers: Supplier[]
  onAdd: (d: Omit<Delivery, 'id'>) => Promise<void>
  onUpdate: (id: number, changes: Partial<Delivery>) => Promise<void>
  onToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const DAY_KEYS = ['day.0', 'day.1', 'day.2', 'day.3', 'day.4', 'day.5', 'day.6']

export default function DeliveriesPanel({ locale, user, deliveries, suppliers, onAdd, onUpdate, onToast }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [receivingId, setReceivingId] = useState<number | null>(null)
  const [receivedQtys, setReceivedQtys] = useState<Record<number, number>>({})
  const [newSupplier, setNewSupplier] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10))
  const [newItems, setNewItems] = useState([{ name: '', expectedQty: 1 }])

  const today = new Date().toISOString().slice(0, 10)
  const todayDow = new Date().getDay()

  const todaySuppliers = useMemo(
    () => suppliers.filter((s) => s.deliveryDays.includes(todayDow)),
    [suppliers, todayDow],
  )

  const pending = useMemo(
    () => deliveries.filter((d) => d.status === 'pending'),
    [deliveries],
  )

  const past = useMemo(
    () => deliveries.filter((d) => d.status !== 'pending').slice(0, 10),
    [deliveries],
  )

  async function handleCreateFromSupplier(s: Supplier) {
    await onAdd({
      supplierId: s.id,
      supplierName: s.name,
      expectedDate: today,
      items: s.categories.map((c) => ({ name: t(`cat.${c}`, locale), expectedQty: 0 })),
      status: 'pending',
    })
    onToast(`Delivery from ${s.name} scheduled`, 'success')
  }

  const handleReceive = useCallback(async (d: Delivery) => {
    const updatedItems = d.items.map((item, i) => ({
      ...item,
      receivedQty: receivedQtys[i] ?? item.expectedQty,
    }))
    const allMatch = updatedItems.every((it) => it.receivedQty === it.expectedQty)
    await onUpdate(d.id!, {
      items: updatedItems,
      status: allMatch ? 'received' : 'partial',
      receivedAt: globalThis.Date.now(),
      receivedBy: user.id,
    })
    setReceivingId(null)
    setReceivedQtys({})
    onToast(`Delivery from ${d.supplierName} received`, 'success')
  }, [receivedQtys, onUpdate, user.id, onToast])

  async function handleAddDelivery() {
    if (!newSupplier) { onToast('Select a supplier', 'warning'); return }
    const sup = suppliers.find((s) => s.id === newSupplier)
    await onAdd({
      supplierId: newSupplier,
      supplierName: sup?.name ?? newSupplier,
      expectedDate: newDate,
      items: newItems.filter((i) => i.name.trim()),
      status: 'pending',
    })
    setShowAdd(false)
    setNewItems([{ name: '', expectedQty: 1 }])
    onToast('Delivery scheduled', 'success')
  }

  return (
    <div>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1>{t('tab.deliveries', locale)}</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>{t('del.add', locale)}</button>
      </div>

      {/* Today's expected suppliers */}
      {todaySuppliers.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>
            📦 {t('overview.today.deliveries', locale)}
          </h3>
          <div className="data-list">
            {todaySuppliers.map((s) => (
              <div key={s.id} className="data-row">
                <div className="row-main">
                  <div className="row-name">{s.name}</div>
                  <div className="row-sub">{s.deliveryTime ?? '—'} · {s.notes ?? ''}</div>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => handleCreateFromSupplier(s)}>
                  + Track
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplier schedule reference */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Supplier Schedule</h3>
        <div className="data-list">
          {suppliers.map((s) => (
            <div key={s.id} className="data-row">
              <div className="row-main">
                <div className="row-name">{s.name}</div>
                <div className="row-sub">
                  {s.deliveryDays.map((d) => t(DAY_KEYS[d], locale)).join(', ')}
                  {s.deliveryTime ? ` · ${s.deliveryTime}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending deliveries */}
      {pending.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{t('del.upcoming', locale)}</h3>
          <div className="data-list">
            {pending.map((d) => (
              <div key={d.id} className="data-row">
                <div className="row-main">
                  <div className="row-name">{d.supplierName}</div>
                  <div className="row-sub">{t('del.expected', locale)}: {d.expectedDate}</div>
                </div>
                <span className={`badge badge-${d.status}`}>{t(`del.status.${d.status}`, locale)}</span>
                <button className="btn btn-sm btn-primary" onClick={() => {
                  setReceivingId(d.id!)
                  setReceivedQtys({})
                }}>
                  {t('del.receive', locale)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past deliveries */}
      {past.length > 0 && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Recent</h3>
          <div className="data-list">
            {past.map((d) => (
              <div key={d.id} className="data-row">
                <div className="row-main">
                  <div className="row-name">{d.supplierName}</div>
                  <div className="row-sub">{d.expectedDate}</div>
                </div>
                <span className={`badge badge-${d.status}`}>{t(`del.status.${d.status}`, locale)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receive modal */}
      {receivingId != null && (() => {
        const d = deliveries.find((del) => del.id === receivingId)
        if (!d) return null
        return (
          <div className="modal-overlay" onClick={() => setReceivingId(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{t('del.receive', locale)} — {d.supplierName}</h2>
              <div className="data-list">
                {d.items.map((item, i) => (
                  <div key={i} className="data-row">
                    <div className="row-main">
                      <div className="row-name">{item.name}</div>
                      <div className="row-sub">Expected: {item.expectedQty}</div>
                    </div>
                    <div className="tally">
                      <button className="tally-btn" onClick={() => setReceivedQtys({ ...receivedQtys, [i]: Math.max(0, (receivedQtys[i] ?? item.expectedQty) - 1) })}>−</button>
                      <span className="tally-value">{receivedQtys[i] ?? item.expectedQty}</span>
                      <button className="tally-btn" onClick={() => setReceivedQtys({ ...receivedQtys, [i]: (receivedQtys[i] ?? item.expectedQty) + 1 })}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setReceivingId(null)}>{t('common.cancel', locale)}</button>
                <button className="btn btn-primary" onClick={() => handleReceive(d)}>{t('common.confirm', locale)}</button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Add delivery modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('del.add', locale)}</h2>
            <div className="form-group">
              <label>{t('del.supplier', locale)}</label>
              <select className="form-select" value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)}>
                <option value="">—</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('del.expected', locale)}</label>
              <input className="form-input" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Items</label>
              {newItems.map((item, i) => (
                <div key={i} className="form-row" style={{ marginBottom: 8 }}>
                  <input className="form-input" placeholder="Item name" value={item.name} onChange={(e) => {
                    const arr = [...newItems]; arr[i] = { ...arr[i], name: e.target.value }; setNewItems(arr)
                  }} />
                  <input className="form-input" type="number" min="1" placeholder="Qty" value={item.expectedQty} onChange={(e) => {
                    const arr = [...newItems]; arr[i] = { ...arr[i], expectedQty: +e.target.value }; setNewItems(arr)
                  }} />
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => setNewItems([...newItems, { name: '', expectedQty: 1 }])}>+ Add item</button>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>{t('common.cancel', locale)}</button>
              <button className="btn btn-primary" onClick={handleAddDelivery}>{t('common.save', locale)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
