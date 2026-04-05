import { useMemo } from 'react'
import { t } from '../i18n'
import type { Locale, UserProfile, InventoryItem, Delivery, SpecialCustomerRequest, DailySales } from '../types'

interface Props {
  locale: Locale
  user: UserProfile
  items: InventoryItem[]
  deliveries: Delivery[]
  requests: SpecialCustomerRequest[]
  sales: DailySales[]
  onNavigate: (tab: string) => void
}

function fmtCAD(n: number) {
  return `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

const ENCOURAGEMENTS = [
  'overview.encouragement.1',
  'overview.encouragement.2',
  'overview.encouragement.3',
  'overview.encouragement.4',
]

const BUSINESS_TIPS = [
  'tip.1', 'tip.2', 'tip.3', 'tip.4', 'tip.5', 'tip.6',
]

export default function OverviewPanel({ locale, user, items, deliveries, requests, sales, onNavigate }: Props) {
  const hour = new Date().getHours()
  const greetingKey = hour < 12 ? 'overview.greeting.morning' : hour < 18 ? 'overview.greeting.afternoon' : 'overview.greeting.evening'

  const today = new Date().toISOString().slice(0, 10)
  const todayDow = new Date().getDay()

  const lowStock = useMemo(() => items.filter((i) => i.quantity <= i.minStock), [items])
  const todayDeliveries = useMemo(
    () => deliveries.filter((d) => d.expectedDate === today && d.status === 'pending'),
    [deliveries, today],
  )
  const openRequests = useMemo(
    () => requests.filter((r) => r.status === 'open'),
    [requests],
  )
  const todayNet = useMemo(() => {
    const todaySales = sales.filter((s) => s.date === today)
    return todaySales.reduce((sum, s) => sum + s.cashIn + s.cardIn - s.expenses, 0)
  }, [sales, today])

  // Rotate encouragement and tip based on day-of-month (deterministic per day)
  const dayOfMonth = new Date().getDate()
  const encouragementIndex = dayOfMonth % ENCOURAGEMENTS.length
  const encouragement = t(ENCOURAGEMENTS[encouragementIndex], locale)
  const tipIndex = dayOfMonth % BUSINESS_TIPS.length
  const businessTip = t(BUSINESS_TIPS[tipIndex], locale)

  return (
    <div>
      <div className="panel-header">
        <h1>{t(greetingKey, locale)}, {user.name.split(' ')[0]} 👋</h1>
        <p>{t('app.subtitle', locale)}</p>
      </div>

      <div className="encouragement glass-card">{encouragement}</div>

      {user.role === 'owner' && (
        <div className="glass-card" style={{ marginBottom: 16, borderLeft: '3px solid var(--warning)', padding: '14px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--warning)', marginBottom: 4 }}>
            💡 {t('overview.tip.title', locale)}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {businessTip}
          </div>
        </div>
      )}

      <div className="stat-grid">
        {user.role === 'owner' && (
          <button className="glass-card stat-card highlight" onClick={() => onNavigate('money')} style={{ textAlign: 'left', cursor: 'pointer' }}>
            <div className="stat-label">{t('money.net', locale)}</div>
            <div className={`stat-value ${todayNet >= 0 ? 'positive' : 'negative'}`}>
              {fmtCAD(todayNet)}
            </div>
            <div className="stat-sub">{t('common.today', locale)}</div>
          </button>
        )}

        <button className="glass-card stat-card" onClick={() => onNavigate('inventory')} style={{ textAlign: 'left', cursor: 'pointer' }}>
          <div className="stat-label">{t('overview.lowstock', locale)}</div>
          <div className={`stat-value ${lowStock.length > 0 ? 'warning' : ''}`}>
            {lowStock.length}
          </div>
          <div className="stat-sub">{t('common.items', locale)}</div>
        </button>

        <button className="glass-card stat-card" onClick={() => onNavigate('deliveries')} style={{ textAlign: 'left', cursor: 'pointer' }}>
          <div className="stat-label">{t('overview.today.deliveries', locale)}</div>
          <div className="stat-value">{todayDeliveries.length}</div>
          <div className="stat-sub">{t(`day.${todayDow}`, locale)}</div>
        </button>

        <button className="glass-card stat-card" onClick={() => onNavigate('customers')} style={{ textAlign: 'left', cursor: 'pointer' }}>
          <div className="stat-label">{t('overview.pending.requests', locale)}</div>
          <div className="stat-value">{openRequests.length}</div>
          <div className="stat-sub">{t('common.items', locale)}</div>
        </button>
      </div>

      {/* Low stock items */}
      {lowStock.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12, color: 'var(--warning)' }}>
            ⚠️ {t('overview.lowstock', locale)}
          </h3>
          <div className="data-list">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.id} className="data-row low-stock">
                <div className="row-main">
                  <div className="row-name">{item.name}</div>
                  <div className="row-sub">{t(`cat.${item.category}`, locale)}</div>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--warning)' }}>
                  {item.quantity} / {item.minStock}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
