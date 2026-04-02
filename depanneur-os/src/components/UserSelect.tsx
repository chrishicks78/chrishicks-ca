import { useState } from 'react'
import { t } from '../i18n'
import type { Locale, UserProfile } from '../types'

interface Props {
  locale: Locale
  users: UserProfile[]
  onSelect: (u: UserProfile) => void
  onAdd: (u: UserProfile) => void
}

export default function UserSelect({ locale, users, onSelect, onAdd }: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  function handleAdd() {
    if (!newName.trim()) return
    onAdd({
      id: newName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: newName.trim(),
      role: 'employee',
      locale,
      onboarded: false,
      createdAt: Date.now(),
    })
    setNewName('')
    setAdding(false)
  }

  return (
    <div className="user-select">
      <h1>{t('user.select.title', locale)}</h1>
      <div className="user-grid">
        {users.map((u) => (
          <button key={u.id} className="user-card" onClick={() => onSelect(u)}>
            <div className="avatar">{u.name.charAt(0).toUpperCase()}</div>
            <span className="name">{u.name}</span>
            <span className="role">
              {t(u.role === 'owner' ? 'user.select.owner' : 'user.select.employee', locale)}
            </span>
          </button>
        ))}
        <button className="user-card add-new" onClick={() => setAdding(true)}>
          <div className="avatar" style={{ fontSize: 28 }}>+</div>
          <span className="name">{t('user.select.add', locale)}</span>
        </button>
      </div>

      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('user.select.add', locale)}</h2>
            <div className="form-group">
              <label>{t('inv.name', locale)}</label>
              <input
                className="form-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Cedric, Marie, etc."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setAdding(false)}>
                {t('common.cancel', locale)}
              </button>
              <button className="btn btn-primary" onClick={handleAdd}>
                {t('common.save', locale)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
