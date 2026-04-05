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

const TAB_CONFIG: { id: DashboardTab; icon: string; labelKey: string; ownerOnly?: boolean }[] = [
  { id: 'overview', icon: '📊', labelKey: 'tab.overview' },
  { id: 'money', icon: '💰', labelKey: 'tab.money', ownerOnly: true },
  { id: 'inventory', icon: '📦', labelKey: 'tab.inventory' },
  { id: 'deliveries', icon: '🚚', labelKey: 'tab.deliveries' },
  { id: 'customers', icon: '🙋', labelKey: 'tab.customers' },
  { id: 'compliance', icon: '📋', labelKey: 'tab.compliance' },
  { id: 'settings', icon: '⚙️', labelKey: 'tab.settings' },
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
          <h2>🏪 Lydia's</h2>
          <small>{t('app.subtitle', locale)}</small>
        </div>
        <div className="sidebar-nav">
          {visibleTabs.map((tc) => (
            <button
              key={tc.id}
              className={`nav-item${activeTab === tc.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tc.id)}
            >
              <span className="icon">{tc.icon}</span>
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
            <span className="tab-icon">{tc.icon}</span>
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
