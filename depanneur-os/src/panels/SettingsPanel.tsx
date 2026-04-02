import { t, getLocaleLabel, LOCALES } from '../i18n'
import { db } from '../db'
import type { Locale, UserProfile } from '../types'

interface Props {
  locale: Locale
  user: UserProfile
  setLocale: (l: Locale) => void
  soundtrack: { playing: boolean; volume: number; toggle: () => void; setVolume: (v: number) => void; play: () => void }
  pwa: { canInstall: boolean; installed: boolean; install: () => void }
  onToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  onLogout: () => void
}

export default function SettingsPanel({ locale, user, setLocale, soundtrack, pwa, onToast, onLogout }: Props) {

  async function handleExport() {
    const data = {
      users: await db.users.toArray(),
      inventory: await db.inventory.toArray(),
      deliveries: await db.deliveries.toArray(),
      customers: await db.customers.toArray(),
      sales: await db.sales.toArray(),
      suppliers: await db.suppliers.toArray(),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lydias-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    onToast('Data exported', 'success')
  }

  async function handleReset() {
    if (!confirm('This will delete ALL data. Are you sure?')) return
    await db.delete()
    window.location.reload()
  }

  return (
    <div>
      <div className="panel-header">
        <h1>{t('tab.settings', locale)}</h1>
      </div>

      <div className="glass-card" style={{ marginBottom: 20 }}>
        {/* Language */}
        <div className="setting-row">
          <div>
            <div className="setting-label">{t('settings.language', locale)}</div>
          </div>
          <div className="lang-toggle">
            {LOCALES.map((l) => (
              <button
                key={l}
                className={`lang-btn${locale === l ? ' active' : ''}`}
                onClick={() => setLocale(l)}
              >
                {getLocaleLabel(l)}
              </button>
            ))}
          </div>
        </div>

        {/* Soundtrack */}
        <div className="setting-row">
          <div>
            <div className="setting-label">{t('settings.soundtrack', locale)}</div>
          </div>
          <div className="soundtrack-ctrl">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                if (soundtrack.playing) soundtrack.toggle()
                else soundtrack.play()
              }}
            >
              {soundtrack.playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundtrack.volume}
              onChange={(e) => soundtrack.setVolume(+e.target.value)}
            />
          </div>
        </div>

        {/* PWA Install */}
        {pwa.canInstall && (
          <div className="setting-row">
            <div>
              <div className="setting-label">{t('settings.install', locale)}</div>
              <div className="setting-desc">{t('settings.install.desc', locale)}</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={pwa.install}>
              {t('settings.install', locale)}
            </button>
          </div>
        )}
        {pwa.installed && (
          <div className="setting-row">
            <div className="setting-label">✓ App installed</div>
          </div>
        )}

        {/* Export */}
        <div className="setting-row">
          <div className="setting-label">{t('settings.export', locale)}</div>
          <button className="btn btn-sm btn-secondary" onClick={handleExport}>
            {t('settings.export', locale)}
          </button>
        </div>

        {/* Reset */}
        {user.role === 'owner' && (
          <div className="setting-row">
            <div>
              <div className="setting-label">{t('settings.reset', locale)}</div>
            </div>
            <button className="btn btn-sm btn-danger" onClick={handleReset}>
              {t('settings.reset', locale)}
            </button>
          </div>
        )}

        {/* Switch user */}
        <div className="setting-row">
          <div className="setting-label">Switch User</div>
          <button className="btn btn-sm btn-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 24 }}>
        Lydia's Dépanneur OS v1.0 · 6030 Sherbrooke Ouest, NDG
      </div>
    </div>
  )
}
