import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { t } from './i18n'
import type { Locale, UserProfile, DashboardTab } from './types'
import {
  useBootstrap, useToasts, useUsers, useInventory, useSuppliers,
  useDeliveries, useCustomerRequests, useSales, useCompliance,
  useSoundtrack, useInstallPrompt, useLocale,
} from './hooks'

import SplashScreen from './components/SplashScreen'
import UserSelect from './components/UserSelect'
import Onboarding from './components/Onboarding'
import ToastContainer from './components/ToastContainer'

import OverviewPanel from './panels/OverviewPanel'
import InventoryPanel from './panels/InventoryPanel'
import DeliveriesPanel from './panels/DeliveriesPanel'
import CustomersPanel from './panels/CustomersPanel'
import MoneyPanel from './panels/MoneyPanel'
import CompliancePanel from './panels/CompliancePanel'
import SettingsPanel from './panels/SettingsPanel'

type Phase = 'splash' | 'user-select' | 'onboarding' | 'dashboard'
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('lydias-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

// SVG line icons for sidebar nav
function NavIcon({ id }: { id: string }) {
  switch (id) {
    case 'overview': return <svg viewBox="0 0 24 24"><path d="M3 12h4v9H3zM10 3h4v18h-4zM17 8h4v13h-4z"/></svg>
    case 'money': return <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    case 'inventory': return <svg viewBox="0 0 24 24"><path d="M21 8V21H3V8M1 3h22v5H1zM10 12h4"/></svg>
    case 'deliveries': return <svg viewBox="0 0 24 24"><path d="M1 3h15v13H1zM16 8h4l3 4v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
    case 'customers': return <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
    case 'compliance': return <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    case 'settings': return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    default: return null
  }
}

const TAB_CONFIG: { id: DashboardTab; emoji: string; labelKey: string; ownerOnly?: boolean }[] = [
  { id: 'overview', emoji: '📊', labelKey: 'tab.overview' },
  { id: 'money', emoji: '💰', labelKey: 'tab.money', ownerOnly: true },
  { id: 'inventory', emoji: '📦', labelKey: 'tab.inventory' },
  { id: 'deliveries', emoji: '🚚', labelKey: 'tab.deliveries' },
  { id: 'customers', emoji: '🙋', labelKey: 'tab.customers' },
  { id: 'compliance', emoji: '📋', labelKey: 'tab.compliance' },
  { id: 'settings', emoji: '⚙️', labelKey: 'tab.settings' },
]

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('lydias-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const dbReady = useBootstrap()
  const { locale, setLocale } = useLocale()
  const { toasts, push: pushToast } = useToasts()
  const { users, add: addUser, update: updateUser } = useUsers()
  const { items, add: addItem, update: updateItem, remove: removeItem } = useInventory()
  const { suppliers } = useSuppliers()
  const { deliveries, add: addDelivery, update: updateDelivery } = useDeliveries()
  const { requests, add: addRequest, update: updateRequest } = useCustomerRequests()
  const { sales, add: addSale, update: updateSale } = useSales()
  const { items: complianceItems, update: updateCompliance } = useCompliance()
  const soundtrack = useSoundtrack()
  const pwa = useInstallPrompt()

  // Toast helper
  const toast = useCallback(
    (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => pushToast(msg, type),
    [pushToast],
  )

  // Check for delivery alerts when entering dashboard
  useEffect(() => {
    if (phase !== 'dashboard' || !currentUser) return
    const today = new Date().toISOString().slice(0, 10)
    const todayDow = new Date().getDay()
    const pending = suppliers.filter((s) => s.deliveryDays.includes(todayDow))
    if (pending.length > 0) {
      const names = pending.map((s) => s.name).join(', ')
      pushToast(`📦 Expected today: ${names}`, 'info', 5000)
    }
    const missed = deliveries.filter((d) => d.status === 'pending' && d.expectedDate < today)
    if (missed.length > 0) {
      pushToast(`⚠️ ${missed.length} missed delivery(s) need attention`, 'warning', 5000)
    }
  }, [phase, currentUser, suppliers, deliveries, pushToast])

  // User select handler
  function handleSelectUser(u: UserProfile) {
    setCurrentUser(u)
    setLocale(u.locale as Locale)
    if (!u.onboarded) {
      setPhase('onboarding')
    } else {
      setPhase('dashboard')
      setActiveTab(u.role === 'owner' ? 'overview' : 'overview')
    }
  }

  function handleOnboardDone() {
    if (currentUser) {
      updateUser(currentUser.id, { onboarded: true })
      setCurrentUser({ ...currentUser, onboarded: true })
    }
    setPhase('dashboard')
  }

  function handleLogout() {
    setCurrentUser(null)
    setActiveTab('overview')
    setPhase('user-select')
    soundtrack.pause()
  }

  // Visible tabs depend on role
  const visibleTabs = currentUser?.role === 'owner'
    ? TAB_CONFIG
    : TAB_CONFIG.filter((tc) => !tc.ownerOnly)

  // Render active panel
  function renderPanel() {
    if (!currentUser) return null
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPanel
            locale={locale}
            user={currentUser}
            items={items}
            deliveries={deliveries}
            requests={requests}
            sales={sales}
            onNavigate={(tab) => setActiveTab(tab as DashboardTab)}
          />
        )
      case 'inventory':
        return (
          <InventoryPanel
            locale={locale}
            user={currentUser}
            items={items}
            suppliers={suppliers}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onToast={toast}
          />
        )
      case 'deliveries':
        return (
          <DeliveriesPanel
            locale={locale}
            user={currentUser}
            deliveries={deliveries}
            suppliers={suppliers}
            onAdd={addDelivery}
            onUpdate={updateDelivery}
            onToast={toast}
          />
        )
      case 'customers':
        return (
          <CustomersPanel
            locale={locale}
            requests={requests}
            onAdd={addRequest}
            onUpdate={updateRequest}
            onToast={toast}
          />
        )
      case 'money':
        return (
          <MoneyPanel
            locale={locale}
            user={currentUser}
            sales={sales}
            onAdd={addSale}
            onUpdate={updateSale}
            onToast={toast}
          />
        )
      case 'compliance':
        return (
          <CompliancePanel
            locale={locale}
            user={currentUser}
            items={complianceItems}
            onUpdate={updateCompliance}
            onToast={toast}
          />
        )
      case 'settings':
        return (
          <SettingsPanel
            locale={locale}
            user={currentUser}
            setLocale={setLocale}
            soundtrack={soundtrack}
            pwa={pwa}
            theme={theme}
            onToggleTheme={toggleTheme}
            onToast={toast}
            onLogout={handleLogout}
          />
        )
    }
  }

  // ── Phase rendering ──
  if (phase === 'splash') {
    return (
      <>
        <SplashScreen locale={locale} ready={dbReady} onTap={() => soundtrack.play()} onDone={() => setPhase('user-select')} />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  if (phase === 'user-select') {
    return (
      <>
        <UserSelect locale={locale} users={users} onSelect={handleSelectUser} onAdd={addUser} />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  if (phase === 'onboarding') {
    return (
      <>
        <Onboarding
          locale={locale}
          suppliers={suppliers}
          onDone={handleOnboardDone}
          onSkip={handleOnboardDone}
        />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  // ── Dashboard ──
  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-name">LYDIA'S</div>
          <div className="brand-os">DÉPANNEUR OS</div>
          <div className="brand-version">v1.0 — NDG, Montréal</div>
        </div>
        <div className="sidebar-nav">
          {visibleTabs.map((tc) => (
            <button
              key={tc.id}
              className={`nav-item${activeTab === tc.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tc.id)}
            >
              <span className="icon"><NavIcon id={tc.id} /></span>
              {t(tc.labelKey, locale)}
            </button>
          ))}
        </div>
        <div className="sidebar-user">
          <span className="dot" />
          <span>{currentUser?.name}</span>
          <button
            className="btn-icon"
            style={{ marginLeft: 'auto' }}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Contextual help hint */}
        {(() => {
          const helpKey = `help.${activeTab}`
          const helpText = t(helpKey, locale)
          return helpText !== helpKey ? (
            <div className="help-hint glass-card" style={{ marginBottom: 16, padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', borderLeft: '3px solid var(--info)' }}>
              ℹ️ {helpText}
            </div>
          ) : null
        })()}
        {renderPanel()}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="bottom-bar">
        {visibleTabs.slice(0, 5).map((tc) => (
          <button
            key={tc.id}
            className={`bottom-tab${activeTab === tc.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tc.id)}
          >
            <span className="tab-icon">{tc.emoji}</span>
            {t(tc.labelKey, locale)}
          </button>
        ))}
        {visibleTabs.length > 5 && (
          <button
            className={`bottom-tab${['compliance', 'settings'].includes(activeTab) ? ' active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'settings' ? 'compliance' : 'settings')}
          >
            <span className="tab-icon">⋯</span>
            More
          </button>
        )}
      </nav>

      <ToastContainer toasts={toasts} />
    </div>
  )
}
