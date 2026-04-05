import { useEffect, useState } from 'react'
import { t } from '../i18n'
import type { Locale } from '../types'

interface Props {
  locale: Locale
  ready: boolean
  onTap?: () => void
  onDone: () => void
}

const BOOT_MODULES = [
  'boot.inventory',
  'boot.deliveries',
  'boot.money',
  'boot.compliance',
  'boot.ready',
] as const

export default function SplashScreen({ locale, ready, onTap, onDone }: Props) {
  const [fading, setFading] = useState(false)
  const [tapped, setTapped] = useState(false)
  const [bootStep, setBootStep] = useState(0)

  // Cycle through boot modules after tap
  useEffect(() => {
    if (!tapped) return
    if (bootStep >= BOOT_MODULES.length) return
    const delay = bootStep === BOOT_MODULES.length - 1 ? 400 : 280
    const id = setTimeout(() => setBootStep((s) => s + 1), delay)
    return () => clearTimeout(id)
  }, [tapped, bootStep])

  // Start fade-out when boot is done and DB ready
  useEffect(() => {
    if (!ready || bootStep < BOOT_MODULES.length) return
    const id = setTimeout(() => setFading(true), 300)
    return () => clearTimeout(id)
  }, [ready, bootStep])

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
    <div className={`splash splash-boot${fading ? ' fade-out' : ''}`} onClick={handleTap}>
      {/* CRT scanline overlay */}
      <div className="crt-scanlines" />

      <div className="boot-logo">
        <span className="boot-title">LYDIA'S</span>
        <span className="boot-sub">DÉPANNEUR OS</span>
      </div>

      <div className="boot-version">v1.0 — 6030 Sherbrooke Ouest, NDG</div>

      <div className="splash-bar">
        <div
          className="splash-bar-fill"
          style={{ width: tapped ? `${Math.min((bootStep / BOOT_MODULES.length) * 100, 100)}%` : '0%' }}
        />
      </div>

      <div className="boot-log">
        {tapped ? (
          BOOT_MODULES.slice(0, bootStep + 1).map((key, i) => (
            <div key={key} className={`boot-line${i < bootStep ? ' done' : ' active'}`}>
              {i < bootStep ? '✓' : '›'} {t(key, locale)}
            </div>
          ))
        ) : (
          <div className="boot-line blink">{t('boot.tap', locale)}</div>
        )}
      </div>
    </div>
  )
}
