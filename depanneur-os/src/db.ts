import Dexie, { type EntityTable } from 'dexie'
import type {
  InventoryItem,
  Delivery,
  SpecialCustomerRequest,
  DailySales,
  UserProfile,
  Supplier,
  ComplianceItem,
} from './types'

const db = new Dexie('LydiasDepanneurOS') as Dexie & {
  users: EntityTable<UserProfile, 'id'>
  inventory: EntityTable<InventoryItem, 'id'>
  deliveries: EntityTable<Delivery, 'id'>
  customers: EntityTable<SpecialCustomerRequest, 'id'>
  sales: EntityTable<DailySales, 'id'>
  suppliers: EntityTable<Supplier, 'id'>
  compliance: EntityTable<ComplianceItem, 'id'>
}

db.version(1).stores({
  users: 'id, role, name',
  inventory: '++id, name, category, barcode, supplierId',
  deliveries: '++id, supplierId, expectedDate, status',
  customers: '++id, customerName, status, dateRequested',
  sales: '++id, date, recordedBy',
  suppliers: 'id, name',
})

// v2: clean up stale seed users, keep only Defei + Jenny
db.version(2).stores({}).upgrade(async (tx) => {
  const users = tx.table('users')
  await users.where('id').anyOf(['chris', 'cedric', 'employee-1']).delete()
})

// v3: add compliance tracking table
db.version(3).stores({
  compliance: 'id, status',
})

// v4: remove Jenny (name unknown — only Defei should be seeded)
db.version(4).stores({}).upgrade(async (tx) => {
  const users = tx.table('users')
  await users.where('id').equals('jenny').delete()
})

// Seed default users on first run
export async function ensureDefaults() {
  const userCount = await db.users.count()
  if (userCount === 0) {
    await db.users.add({
      id: 'defei',
      name: 'Defei Chen',
      role: 'owner',
      locale: 'en',
      onboarded: false,
      createdAt: Date.now(),
    })
  }

  const supplierCount = await db.suppliers.count()
  if (supplierCount === 0) {
    await db.suppliers.bulkAdd([
      {
        id: 'molson',
        name: 'Molson / Brasseurs',
        deliveryDays: [1, 4],
        deliveryTime: '08:00',
        categories: ['beer'],
        notes: 'Beer distributor — call by Sunday for Monday delivery',
      },
      {
        id: 'pepsi',
        name: 'PepsiCo',
        deliveryDays: [2, 5],
        deliveryTime: '09:00',
        categories: ['soft-drinks'],
        notes: 'Soft drinks, chips',
      },
      {
        id: 'costco',
        name: 'Costco Run',
        deliveryDays: [0, 3],
        categories: ['snacks', 'dairy', 'household', 'other'],
        notes: 'Self-pickup — bulk items, paper products, misc',
      },
      {
        id: 'bread',
        name: 'Boulangerie / Bread',
        deliveryDays: [1, 3, 5],
        deliveryTime: '06:30',
        categories: ['bread'],
      },
      {
        id: 'loto',
        name: 'Loto-Québec',
        deliveryDays: [2],
        deliveryTime: '10:00',
        categories: ['lottery'],
        notes: 'Terminal supplies, ticket stock',
      },
    ])
  }
  const complianceCount = await db.compliance.count()
  if (complianceCount === 0) {
    await db.compliance.bulkAdd([
      { id: 'mapaq', name: 'MAPAQ Permit', icon: '🛡️', descKey: 'comply.mapaq', status: 'unknown' },
      { id: 'hygiene', name: 'Hygiene Standards', icon: '🧼', descKey: 'comply.hygiene', status: 'unknown' },
      { id: 'alcohol', name: 'Alcohol Permit (RACJ)', icon: '🍺', descKey: 'comply.alcohol', status: 'unknown' },
      { id: 'grocery', name: 'Grocery Permit', icon: '🏪', descKey: 'comply.grocery', status: 'unknown' },
      { id: 'loto', name: 'Loto-Québec License', icon: '🎰', descKey: 'comply.loto', status: 'unknown' },
      { id: 'tobacco', name: 'Tobacco / QST', icon: '🚬', descKey: 'comply.tobacco', status: 'unknown' },
    ])
  }
}

export { db }
