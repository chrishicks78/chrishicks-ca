import { useState, useMemo } from 'react'
import { t } from '../i18n'
import type { Locale, UserProfile, InventoryItem, InventoryCategory, Supplier } from '../types'

interface Props {
  locale: Locale
  user: UserProfile
  items: InventoryItem[]
  suppliers: Supplier[]
  onAdd: (item: Omit<InventoryItem, 'id'>) => Promise<void>
  onUpdate: (id: number, changes: Partial<InventoryItem>) => Promise<void>
  onRemove: (id: number) => Promise<void>
  onToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const CATEGORIES: InventoryCategory[] = [
  'beer', 'wine', 'cider', 'soft-drinks', 'snacks', 'tobacco',
  'lottery', 'dairy', 'bread', 'frozen', 'household', 'other',
]

const EMPTY_ITEM = {
  name: '', category: 'other' as InventoryCategory, quantity: 0, minStock: 5,
  unit: 'units', cost: 0, price: 0, barcode: '', supplierId: '',
}

export default function InventoryPanel({ locale, user, items, suppliers, onAdd, onUpdate, onRemove, onToast }: Props) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<InventoryCategory | ''>('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY_ITEM)

  const filtered = useMemo(() => {
    let list = items
    if (search) list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    if (catFilter) list = list.filter((i) => i.category === catFilter)
    return list.sort((a, b) => {
      const aLow = a.quantity <= a.minStock ? 0 : 1
      const bLow = b.quantity <= b.minStock ? 0 : 1
      return aLow - bLow || a.name.localeCompare(b.name)
    })
  }, [items, search, catFilter])

  function openAdd() {
    setEditId(null)
    setForm(EMPTY_ITEM)
    setShowModal(true)
  }

  function openEdit(item: InventoryItem) {
    setEditId(item.id ?? null)
    setForm({
      name: item.name, category: item.category, quantity: item.quantity,
      minStock: item.minStock, unit: item.unit, cost: item.cost, price: item.price,
      barcode: item.barcode ?? '', supplierId: item.supplierId ?? '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { onToast('Name is required', 'warning'); return }
    const data = {
      ...form,
      name: form.name.trim(),
      lastUpdated: Date.now(),
      updatedBy: user.id,
    }
    if (editId != null) {
      await onUpdate(editId, data)
      onToast(`${form.name} updated`, 'success')
    } else {
      await onAdd(data)
      onToast(`${form.name} added`, 'success')
    }
    setShowModal(false)
  }

  async function handleTally(item: InventoryItem, delta: number) {
    const newQty = Math.max(0, item.quantity + delta)
    await onUpdate(item.id!, { quantity: newQty, lastUpdated: Date.now(), updatedBy: user.id })
  }

  return (
    <div>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{t('tab.inventory', locale)}</h1>
          <p>{items.length} {t('common.items', locale)}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{t('inv.add', locale)}</button>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <button className="quick-action" onClick={openAdd}>
          <span className="qa-icon">📝</span>
          <span className="qa-label">{t('inv.add', locale)}</span>
        </button>
        <button className="quick-action" onClick={() => onToast('Point camera at barcode', 'info')}>
          <span className="qa-icon">📷</span>
          <span className="qa-label">{t('inv.scan', locale)}</span>
        </button>
        <button className="quick-action" onClick={() => onToast('Take a photo of items', 'info')}>
          <span className="qa-icon">🖼️</span>
          <span className="qa-label">{t('inv.photo', locale)}</span>
        </button>
        <button className="quick-action" onClick={() => {
          if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            onToast('Voice input ready — speak item name', 'info')
          } else {
            onToast('Voice input not supported in this browser', 'warning')
          }
        }}>
          <span className="qa-icon">🎤</span>
          <span className="qa-label">{t('inv.voice', locale)}</span>
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="form-input"
          placeholder={t('inv.search', locale)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category chips */}
      <div className="cat-filters">
        <button
          className={`cat-chip${!catFilter ? ' active' : ''}`}
          onClick={() => setCatFilter('')}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-chip${catFilter === c ? ' active' : ''}`}
            onClick={() => setCatFilter(catFilter === c ? '' : c)}
          >
            {t(`cat.${c}`, locale)}
          </button>
        ))}
      </div>

      {/* Item list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>{t('inv.empty', locale)}</p>
        </div>
      ) : (
        <div className="data-list">
          {filtered.map((item) => {
            const isLow = item.quantity <= item.minStock
            return (
              <div key={item.id} className={`data-row${isLow ? ' low-stock' : ''}`}>
                <div className="row-main" style={{ cursor: 'pointer' }} onClick={() => openEdit(item)}>
                  <div className="row-name">{item.name}</div>
                  <div className="row-sub">
                    {t(`cat.${item.category}`, locale)}
                    {item.price > 0 && ` · $${item.price.toFixed(2)}`}
                    {isLow && ' ⚠️'}
                  </div>
                </div>
                <div className="row-actions">
                  <div className="tally">
                    <button className="tally-btn" onClick={() => handleTally(item, -1)}>−</button>
                    <span className="tally-value" style={{ color: isLow ? 'var(--warning)' : 'inherit' }}>
                      {item.quantity}
                    </span>
                    <button className="tally-btn" onClick={() => handleTally(item, 1)}>+</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editId != null ? t('common.edit', locale) : t('inv.add', locale)}</h2>

            <div className="form-group">
              <label>{t('inv.name', locale)}</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            </div>

            <div className="form-group">
              <label>{t('inv.category', locale)}</label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as InventoryCategory })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{t(`cat.${c}`, locale)}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('inv.quantity', locale)}</label>
                <input className="form-input" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>{t('inv.minstock', locale)}</label>
                <input className="form-input" type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: +e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('inv.cost', locale)}</label>
                <input className="form-input" type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>{t('inv.price', locale)}</label>
                <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>{t('del.supplier', locale)}</label>
              <select className="form-select" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
                <option value="">—</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="modal-actions">
              {editId != null && (
                <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={async () => {
                  await onRemove(editId)
                  onToast(`${form.name} deleted`, 'info')
                  setShowModal(false)
                }}>
                  {t('common.delete', locale)}
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>{t('common.cancel', locale)}</button>
              <button className="btn btn-primary" onClick={handleSave}>{t('common.save', locale)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
