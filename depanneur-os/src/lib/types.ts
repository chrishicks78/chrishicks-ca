export const locales = ["en", "fr", "zh-Hans", "zh-Hant"] as const;
export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export const viewKeys = [
  "overview",
  "sourcing",
  "hopper",
  "inventory",
  "compliance",
] as const;
export const roles = ["owner", "manager", "employee"] as const;
export const themes = ["day", "night"] as const;
export const requestStatuses = [
  "watch",
  "ordered",
  "ready",
  "fulfilled",
] as const;
export const maintenanceSeverities = ["watch", "urgent"] as const;
export const maintenanceStatuses = [
  "open",
  "sourcing",
  "scheduled",
  "stable",
] as const;
export const cadenceTypes = ["weekly", "monthly", "quarterly", "annual"] as const;
export const trackIds = ["investigation", "sunset-drive"] as const;

export type Locale = (typeof locales)[number];
export type Weekday = (typeof weekdays)[number];
export type ViewKey = (typeof viewKeys)[number];
export type UserRole = (typeof roles)[number];
export type ThemeMode = (typeof themes)[number];
export type RequestStatus = (typeof requestStatuses)[number];
export type MaintenanceSeverity = (typeof maintenanceSeverities)[number];
export type MaintenanceStatus = (typeof maintenanceStatuses)[number];
export type CadenceType = (typeof cadenceTypes)[number];
export type TrackId = (typeof trackIds)[number];

export interface ShiftProfile {
  role: UserRole;
  label: string;
  startedAt: string;
}

export interface MoneyState {
  cashSales: number;
  cardSales: number;
  supplierSpend: number;
  wageSpend: number;
  repairFund: number;
  savingsTarget: number;
}

export interface InventoryItemState {
  id: string;
  onHand: number;
  parLevel: number;
  unitCost: number;
  shelfPrice: number;
  barcode: string;
  note: string;
  updatedAt?: string;
}

export interface SpecialRequestState {
  id: string;
  customer: string;
  quantity: number;
  status: RequestStatus;
  note: string;
  updatedAt?: string;
}

export interface SupplierRunState {
  id: string;
  weekdays: Weekday[];
  enabled: boolean;
  typicalSpend: number;
  contact: string;
  note: string;
}

export interface ComplianceItemState {
  id: string;
  nextDue: string;
  cadence: CadenceType;
  enabled: boolean;
  lastDoneAt?: string;
  note: string;
}

export interface MaintenanceTicketState {
  id: string;
  issue: string;
  equipment: string;
  severity: MaintenanceSeverity;
  status: MaintenanceStatus;
  note: string;
  openedAt: string;
}

export interface ParsedInventoryLine {
  id: string | null;
  label: string;
  delta: number | null;
  unit: string;
  note: string;
}

export interface ParsedDeliveryLine {
  id: string | null;
  supplier: string;
  quantity: number | null;
  action: string;
  note: string;
}

export interface ParsedMaintenanceLine {
  issue: string;
  equipment: string;
  priority: MaintenanceSeverity;
  note: string;
}

export interface HopperParseResult {
  raw: string;
  inventory: ParsedInventoryLine[];
  delivery: ParsedDeliveryLine[];
  maintenance: ParsedMaintenanceLine[];
  generatedAt: string;
}

export interface VendorSource {
  id: string;
  label: string;
  area: string;
  url: string;
  phone?: string;
  note: string;
}

export interface SourcingStep {
  phase: string;
  title: string;
  detail: string;
}

export interface PartLead {
  name: string;
  why: string;
  urgency: "first-check" | "likely" | "only-if-needed";
}

export interface SourcingPlan {
  issue: string;
  summary: string;
  loop: SourcingStep[];
  likelyParts: PartLead[];
  localSources: VendorSource[];
  onlineSources: VendorSource[];
  revenueMoves: string[];
  escalate: string[];
  generatedAt: string;
}

export interface AudioState {
  trackId: TrackId;
  volume: number;
  playing: boolean;
  currentTime: number;
  loop: boolean;
}

export interface AppState {
  version: 1;
  locale: Locale;
  theme: ThemeMode;
  activeView: ViewKey;
  shift: ShiftProfile | null;
  money: MoneyState;
  inventory: InventoryItemState[];
  requests: SpecialRequestState[];
  suppliers: SupplierRunState[];
  compliance: ComplianceItemState[];
  maintenance: MaintenanceTicketState[];
  hopperInput: string;
  hopperResult: HopperParseResult | null;
  sourcingInput: string;
  sourcingPlan: SourcingPlan | null;
  audio: AudioState;
  lastSavedAt?: string;
  lastTransportNote?: string;
}
