import { useState } from 'react'
import { t } from '../i18n'
import type { Locale, Supplier } from '../types'

interface Props {
  locale: Locale
  suppliers: Supplier[]
  onDone: () => void
  onSkip: () => void
}

const DAY_KEYS = ['day.0', 'day.1', 'day.2', 'day.3', 'day.4', 'day.5', 'day.6']

export default function Onboarding({ locale, suppliers, onDone, onSkip }: Props) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: t('onboard.step1.title', locale),
      desc: t('onboard.step1.desc', locale),
      content: (
        <div style={{ textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: 12 }}>
            {locale === 'fr'
              ? 'Le système gère automatiquement :'
              : locale.startsWith('zh')
                ? '系统自动管理：'
                : 'The system automatically tracks:'}
          </p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>{t('tab.inventory', locale)} — {t('cat.beer', locale)}, {t('cat.soft-drinks', locale)}, {t('cat.snacks', locale)}...</li>
            <li>{t('tab.deliveries', locale)} — {t('del.expected', locale)}</li>
            <li>{t('tab.money', locale)} — {t('money.cash', locale)}, {t('money.card', locale)}</li>
          </ul>
        </div>
      ),
    },
    {
      title: t('onboard.step2.title', locale),
      desc: t('onboard.step2.desc', locale),
      content: (
        <div className="data-list" style={{ textAlign: 'left' }}>
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
      ),
    },
    {
      title: t('onboard.step3.title', locale),
      desc: t('onboard.step3.desc', locale),
      content: (
        <div style={{ fontSize: 48, margin: '16px 0' }}>🎉</div>
      ),
    },
  ]

  return (
    <div className="onboarding">
      <div className="onboard-card">
        <div className="onboard-steps">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`onboard-step${i === step ? ' active' : i < step ? ' done' : ''}`}
            />
          ))}
        </div>
        <h2>{steps[step].title}</h2>
        <p>{steps[step].desc}</p>
        {steps[step].content}
        <div className="onboard-actions">
          <button className="btn btn-ghost" onClick={onSkip}>
            {t('onboard.skip', locale)}
          </button>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              {t('onboard.next', locale)}
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={onDone}>
              {t('onboard.done', locale)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
