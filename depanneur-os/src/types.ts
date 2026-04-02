export type Locale = 'en' | 'fr' | 'zh-Hans' | 'zh-Hant'

export type UserRole = 'owner' | 'employee'

export interface UserProfile {
  id: string
  name: string
  role: UserRole
  locale: Locale
  onboarded: boolean
  createdAt: number
}

export interface InventoryItem {
  id?: number
  name: string
  category: InventoryCategory
  quantity: number
  minStock: number
  unit: string
  cost: number
  price: number
  barcode?: string
  photoUrl?: string
  supplierId?: string
  lastUpdated: number
  updatedBy: string
}

export type InventoryCategory =
  | 'beer'
  | 'wine'
  | 'cider'
  | 'soft-drinks'
  | 'snacks'
  | 'tobacco'
  | 'lottery'
  | 'dairy'
  | 'bread'
  | 'frozen'
  | 'household'
  | 'other'

export interface Supplier {
  id: string
  name: string
  deliveryDays: number[] // 0=Sun..6=Sat
  deliveryTime?: string
  phone?: string
  notes?: string
  categories: InventoryCategory[]
}

export interface Delivery {
  id?: number
  supplierId: string
  supplierName: string
  expectedDate: string
  items: { name: string; expectedQty: number; receivedQty?: number }[]
  status: 'pending' | 'received' | 'partial' | 'missed'
  notes?: string
  receivedAt?: number
  receivedBy?: string
}

export interface SpecialCustomerRequest {
  id?: number
  customerName: string
  request: string
  status: 'open' | 'sourced' | 'delivered' | 'cancelled'
  dateRequested: number
  dateResolved?: number
  notes?: string
}

export interface DailySales {
  id?: number
  date: string
  cashIn: number
  cardIn: number
  expenses: number
  notes?: string
  recordedBy: string
}

export interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

export interface AppState {
  currentUser: UserProfile | null
  locale: Locale
  phase: 'splash' | 'user-select' | 'onboarding' | 'dashboard'
  activeTab: DashboardTab
  soundtrackPlaying: boolean
  soundtrackVolume: number
}

export type DashboardTab =
  | 'overview'
  | 'inventory'
  | 'deliveries'
  | 'customers'
  | 'money'
  | 'settings'
  | 'compliance'

export interface QuebecReminder {
  id: string
  titleKey: string
  descKey: string
  category: 'mapaq' | 'loto' | 'tobacco' | 'alcohol' | 'tax'
  recurring?: string
}
