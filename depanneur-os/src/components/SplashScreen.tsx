import { useEffect, useState } from 'react'
import { t } from '../i18n'
import type { Locale } from '../types'

interface Props {
  locale: Locale
  ready: boolean
  onTap?: () => void
  onDone: () => void
}

export default function SplashScreen({ locale, ready, onTap, onDone }: Props) {
  const [fading, setFading] = useState(false)
  const [tapped, setTapped] = useState(false)

  useEffect(() => {
    if (!ready || !tapped) return
    const id = setTimeout(() => setFading(true), 600)
    return () => clearTimeout(id)
  }, [ready, tapped])

  useEffect(() => {
    if (!fading) return
    const id = setTimeout(onDone, 400)
    return () => clearTimeout(id)
  }, [fading, onDone])

  function handleTap() {
    if (!tapped) {
      setTapped(true)
      onTap?.() // Fire immediately in gesture context for Chrome autoplay
    }
  }

  return (
    <div className={`splash${fading ? ' fade-out' : ''}`} onClick={handleTap}>
      <div className="splash-logo">🏪</div>
      <h1>{t('app.splash.welcome', locale)}</h1>
      <p>6030 Sherbrooke Ouest, NDG</p>
      <div className="splash-bar">
        <div className="splash-bar-fill" />
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
        {tapped ? t('app.splash.loading', locale) : 'Tap to begin'}
      </p>
    </div>
  )
}
