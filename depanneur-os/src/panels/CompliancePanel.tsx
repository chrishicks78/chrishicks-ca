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

export default function CompliancePanel({ locale }: Props) {
  return (
    <div>
      <div className="panel-header">
        <h1>{t('comply.title', locale)}</h1>
        <p>Quebec regulatory requirements for dépanneurs</p>
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
