import type { TranslatedText } from "./i18n";
import type {
  AppState,
  CadenceType,
  HopperParseResult,
  Locale,
  PartLead,
  RequestStatus,
  ShiftProfile,
  SourcingPlan,
  SourcingStep,
  TrackId,
  UserRole,
  VendorSource,
  ViewKey,
  Weekday,
} from "./types";

export interface InventoryCatalogItem {
  id: string;
  title: TranslatedText;
  subtitle: TranslatedText;
  unit: TranslatedText;
}

export interface SpecialRequestCatalogItem {
  id: string;
  title: TranslatedText;
  subtitle: TranslatedText;
}

export interface SupplierCatalogItem {
  id: string;
  title: TranslatedText;
  subtitle: TranslatedText;
  cadenceHint: TranslatedText;
  website: string;
}

export interface ComplianceCatalogItem {
  id: string;
  title: TranslatedText;
  authority: TranslatedText;
  summary: TranslatedText;
  cadence: CadenceType;
  website: string;
}

export const roleLabels: Record<UserRole, TranslatedText> = {
  owner: {
    en: "Defei (Owner)",
    fr: "Defei (propriétaire)",
    "zh-Hans": "Defei（店主）",
    "zh-Hant": "Defei（店主）",
  },
  manager: {
    en: "Wife (Manager)",
    fr: "Épouse (gestionnaire)",
    "zh-Hans": "妻子（经理）",
    "zh-Hant": "妻子（經理）",
  },
  employee: {
    en: "Employee",
    fr: "Employé",
    "zh-Hans": "员工",
    "zh-Hant": "員工",
  },
};

export const roleSummaries: Record<UserRole, TranslatedText> = {
  owner: {
    en: "Unlocks money control, sourcing, compliance, and full clean handoffs.",
    fr: "Déverrouille l'argent, l'approvisionnement, la conformité et les handoffs complets.",
    "zh-Hans": "解锁资金控制、采购、合规和完整交接。",
    "zh-Hant": "解鎖資金控制、採購、合規和完整交接。",
  },
  manager: {
    en: "Sees intake, supplier rhythm, maintenance planning, and inventory without the owner cash view.",
    fr: "Voit l'intake, le rythme fournisseur, la maintenance et l'inventaire sans la caisse propriétaire.",
    "zh-Hans": "可见录入、供货节奏、维修计划和库存，但不显示店主现金面板。",
    "zh-Hant": "可見錄入、供貨節奏、維修計畫和庫存，但不顯示店主現金面板。",
  },
  employee: {
    en: "Gets only the counting board and special customer requests with oversized buttons.",
    fr: "N'obtient que le comptage et les demandes spéciales avec de très gros boutons.",
    "zh-Hans": "只保留盘点板和特殊顾客需求，并使用超大按钮。",
    "zh-Hant": "只保留盤點板和特殊顧客需求，並使用超大按鈕。",
  },
};

export const viewLabels: Record<ViewKey, TranslatedText> = {
  overview: {
    en: "Overview",
    fr: "Vue d'ensemble",
    "zh-Hans": "总览",
    "zh-Hant": "總覽",
  },
  sourcing: {
    en: "Smart sourcing",
    fr: "Approvisionnement intelligent",
    "zh-Hans": "智能采购",
    "zh-Hant": "智慧採購",
  },
  hopper: {
    en: "The hopper",
    fr: "La trémie",
    "zh-Hans": "混沌收纳斗",
    "zh-Hant": "混沌收納斗",
  },
  inventory: {
    en: "Inventory",
    fr: "Inventaire",
    "zh-Hans": "库存",
    "zh-Hant": "庫存",
  },
  compliance: {
    en: "Compliance",
    fr: "Conformité",
    "zh-Hans": "合规",
    "zh-Hant": "合規",
  },
};

export const themeLabels = {
  day: {
    en: "Day mode",
    fr: "Mode jour",
    "zh-Hans": "日间模式",
    "zh-Hant": "日間模式",
  },
  night: {
    en: "Night mode",
    fr: "Mode nuit",
    "zh-Hans": "夜间模式",
    "zh-Hant": "夜間模式",
  },
} as const;

export const requestStatusLabels: Record<RequestStatus, TranslatedText> = {
  watch: {
    en: "Watch",
    fr: "Surveiller",
    "zh-Hans": "观察",
    "zh-Hant": "觀察",
  },
  ordered: {
    en: "Ordered",
    fr: "Commandé",
    "zh-Hans": "已订货",
    "zh-Hant": "已訂貨",
  },
  ready: {
    en: "Ready",
    fr: "Prêt",
    "zh-Hans": "可交付",
    "zh-Hant": "可交付",
  },
  fulfilled: {
    en: "Done",
    fr: "Terminé",
    "zh-Hans": "已完成",
    "zh-Hant": "已完成",
  },
};

export const cadenceLabels: Record<CadenceType, TranslatedText> = {
  weekly: {
    en: "Weekly",
    fr: "Hebdomadaire",
    "zh-Hans": "每周",
    "zh-Hant": "每週",
  },
  monthly: {
    en: "Monthly",
    fr: "Mensuel",
    "zh-Hans": "每月",
    "zh-Hant": "每月",
  },
  quarterly: {
    en: "Quarterly",
    fr: "Trimestriel",
    "zh-Hans": "每季度",
    "zh-Hant": "每季度",
  },
  annual: {
    en: "Annual",
    fr: "Annuel",
    "zh-Hans": "每年",
    "zh-Hant": "每年",
  },
};

export const weekdayLabels: Record<Weekday, TranslatedText> = {
  monday: { en: "Mon", fr: "Lun", "zh-Hans": "周一", "zh-Hant": "週一" },
  tuesday: { en: "Tue", fr: "Mar", "zh-Hans": "周二", "zh-Hant": "週二" },
  wednesday: { en: "Wed", fr: "Mer", "zh-Hans": "周三", "zh-Hant": "週三" },
  thursday: { en: "Thu", fr: "Jeu", "zh-Hans": "周四", "zh-Hant": "週四" },
  friday: { en: "Fri", fr: "Ven", "zh-Hans": "周五", "zh-Hant": "週五" },
  saturday: { en: "Sat", fr: "Sam", "zh-Hans": "周六", "zh-Hant": "週六" },
  sunday: { en: "Sun", fr: "Dim", "zh-Hans": "周日", "zh-Hant": "週日" },
};

export const inventoryCatalog: readonly InventoryCatalogItem[] = [
  {
    id: "beer-cooler",
    title: {
      en: "Beer cooler fast movers",
      fr: "Bières rapides du frigo",
      "zh-Hans": "啤酒冷柜快动品",
      "zh-Hant": "啤酒冷櫃快動品",
    },
    subtitle: {
      en: "Molson, Bud, Coors, and weekend reserve cases.",
      fr: "Molson, Bud, Coors et réserves du weekend.",
      "zh-Hans": "Molson、Bud、Coors 和周末预留箱。",
      "zh-Hant": "Molson、Bud、Coors 和週末預留箱。",
    },
    unit: { en: "cases", fr: "caisses", "zh-Hans": "箱", "zh-Hant": "箱" },
  },
  {
    id: "cold-drinks",
    title: {
      en: "Cold drinks front door",
      fr: "Boissons froides porte avant",
      "zh-Hans": "前门冷饮位",
      "zh-Hant": "前門冷飲位",
    },
    subtitle: {
      en: "Pepsi, Coke, water, and energy drink lanes.",
      fr: "Pepsi, Coke, eau et allées énergie.",
      "zh-Hans": "百事、可乐、矿泉水和能量饮料货道。",
      "zh-Hant": "百事、可樂、礦泉水和能量飲料貨道。",
    },
    unit: { en: "cases", fr: "caisses", "zh-Hans": "箱", "zh-Hant": "箱" },
  },
  {
    id: "snack-wall",
    title: {
      en: "Snack wall",
      fr: "Mur de collations",
      "zh-Hans": "零食墙",
      "zh-Hant": "零食牆",
    },
    subtitle: {
      en: "Chips, nuts, and high-velocity impulse lanes.",
      fr: "Croustilles, noix et allées impulsion.",
      "zh-Hans": "薯片、坚果和高频冲动购买货位。",
      "zh-Hant": "薯片、堅果和高頻衝動購買貨位。",
    },
    unit: { en: "lanes", fr: "rangées", "zh-Hans": "条", "zh-Hant": "條" },
  },
  {
    id: "required-food",
    title: {
      en: "Required food floor",
      fr: "Plancher alimentaire requis",
      "zh-Hans": "必要食品底线",
      "zh-Hant": "必要食品底線",
    },
    subtitle: {
      en: "Core food facings supporting grocery alcohol rules.",
      fr: "Façades alimentaires qui soutiennent les règles alcool.",
      "zh-Hans": "支撑杂货酒类规则的核心食品排面。",
      "zh-Hant": "支撐雜貨酒類規則的核心食品排面。",
    },
    unit: { en: "facings", fr: "façades", "zh-Hans": "排面", "zh-Hant": "排面" },
  },
  {
    id: "ice-bags",
    title: {
      en: "Ice and freezer grab",
      fr: "Glace et prise congélo",
      "zh-Hans": "冰袋和冷冻快拿区",
      "zh-Hant": "冰袋和冷凍快拿區",
    },
    subtitle: {
      en: "Bagged ice and small freezer profit items.",
      fr: "Glace en sac et petits profits congélo.",
      "zh-Hans": "袋装冰和小型冷冻利润货。",
      "zh-Hant": "袋裝冰和小型冷凍利潤貨。",
    },
    unit: { en: "bags", fr: "sacs", "zh-Hans": "袋", "zh-Hant": "袋" },
  },
];

export const specialRequestCatalog: readonly SpecialRequestCatalogItem[] = [
  {
    id: "weekend-beer-reserve",
    title: {
      en: "Weekend beer reserve",
      fr: "Réserve bière weekend",
      "zh-Hans": "周末啤酒预留",
      "zh-Hant": "週末啤酒預留",
    },
    subtitle: {
      en: "Keep the regulars' cases visible before Friday night.",
      fr: "Garder les caisses des réguliers visibles avant vendredi soir.",
      "zh-Hans": "在周五晚高峰前把熟客的箱数盯住。",
      "zh-Hant": "在週五晚高峰前把熟客的箱數盯住。",
    },
  },
  {
    id: "coke-zero-family-pack",
    title: {
      en: "Coke Zero family pack",
      fr: "Pack familial Coke Zero",
      "zh-Hans": "无糖可乐家庭包",
      "zh-Hant": "無糖可樂家庭包",
    },
    subtitle: {
      en: "Neighbourhood repeat order tied to Pepsi route timing.",
      fr: "Commande répétée liée au rythme Pepsi.",
      "zh-Hans": "和百事路线节奏绑定的邻里重复需求。",
      "zh-Hant": "和百事路線節奏綁定的鄰里重複需求。",
    },
  },
  {
    id: "ice-bag-hold",
    title: {
      en: "Ice bag hold",
      fr: "Réserve sacs de glace",
      "zh-Hans": "冰袋预留",
      "zh-Hant": "冰袋預留",
    },
    subtitle: {
      en: "Fast-turn request that matters on hot days and party weekends.",
      fr: "Demande rapide qui compte les jours chauds et weekends de fête.",
      "zh-Hans": "热天和聚会周末很关键的快周转需求。",
      "zh-Hant": "熱天和聚會週末很關鍵的快週轉需求。",
    },
  },
];

export const supplierCatalog: readonly SupplierCatalogItem[] = [
  {
    id: "costco",
    title: {
      en: "Costco run",
      fr: "Course Costco",
      "zh-Hans": "Costco 进货",
      "zh-Hant": "Costco 進貨",
    },
    subtitle: {
      en: "Bulk pantry, paper, and family-pack recovery.",
      fr: "Vrac, papier et rattrapage de packs familiaux.",
      "zh-Hans": "大包装日用品、纸品和家庭包补货。",
      "zh-Hant": "大包裝日用品、紙品和家庭包補貨。",
    },
    cadenceHint: {
      en: "Usually best before midday.",
      fr: "Idéalement avant midi.",
      "zh-Hans": "通常最好在中午前完成。",
      "zh-Hant": "通常最好在中午前完成。",
    },
    website: "https://www.costco.ca",
  },
  {
    id: "molson",
    title: {
      en: "Molson / beer route",
      fr: "Route Molson / bière",
      "zh-Hans": "Molson / 啤酒路线",
      "zh-Hant": "Molson / 啤酒路線",
    },
    subtitle: {
      en: "Beer reserve pressure and cooler recovery move together here.",
      fr: "La pression de réserve bière et la récupération du frigo bougent ici.",
      "zh-Hans": "啤酒预留压力和冷柜恢复在这里一起变化。",
      "zh-Hant": "啤酒預留壓力和冷櫃恢復在這裡一起變化。",
    },
    cadenceHint: {
      en: "Midweek and end-of-week are the money days.",
      fr: "Milieu et fin de semaine sont les jours argent.",
      "zh-Hans": "周中和周末前是最关键的赚钱日。",
      "zh-Hant": "週中和週末前是最關鍵的賺錢日。",
    },
    website: "https://www.molsoncoors.com",
  },
  {
    id: "pepsico",
    title: {
      en: "PepsiCo / bottler route",
      fr: "Route PepsiCo / embouteilleur",
      "zh-Hans": "百事 / 饮料路线",
      "zh-Hant": "百事 / 飲料路線",
    },
    subtitle: {
      en: "Cold drink recovery and flavour-hold requests depend on this.",
      fr: "La récupération des boissons froides et les réserves saveur en dépendent.",
      "zh-Hans": "冷饮恢复和口味预留都依赖这条线路。",
      "zh-Hant": "冷飲恢復和口味預留都依賴這條線路。",
    },
    cadenceHint: {
      en: "Morning arrival is usually the safe window.",
      fr: "L'arrivée du matin est souvent la fenêtre sûre.",
      "zh-Hans": "上午到货通常最稳。",
      "zh-Hant": "上午到貨通常最穩。",
    },
    website: "https://www.pepsico.ca",
  },
];

export const complianceCatalog: readonly ComplianceCatalogItem[] = [
  {
    id: "mapaq-permit",
    title: {
      en: "MAPAQ permit and food-safety binder",
      fr: "Permis MAPAQ et cartable salubrité",
      "zh-Hans": "MAPAQ 许可与食品安全资料夹",
      "zh-Hant": "MAPAQ 許可與食品安全資料夾",
    },
    authority: {
      en: "MAPAQ / Québec",
      fr: "MAPAQ / Québec",
      "zh-Hans": "MAPAQ / 魁北克",
      "zh-Hant": "MAPAQ / 魁北克",
    },
    summary: {
      en: "Keep the retail permit visible and the food-safety register up to date in-store.",
      fr: "Garder le permis visible et le registre salubrité à jour dans le magasin.",
      "zh-Hans": "确保零售许可可见，并把食品安全登记保持最新。",
      "zh-Hant": "確保零售許可可見，並把食品安全登記保持最新。",
    },
    cadence: "monthly",
    website:
      "https://www.quebec.ca/sante/alimentation/salubrite-aliments-prevention-risques/etablissements-alimentaires/hygiene-nettoyage/formation-obligatoire-hygiene-salubrite-alimentaires/types-formation-inscription",
  },
  {
    id: "alcohol-grocery-permit",
    title: {
      en: "RACJ grocery alcohol permit review",
      fr: "Revue du permis d'épicerie RACJ",
      "zh-Hans": "RACJ 杂货酒类许可复核",
      "zh-Hant": "RACJ 雜貨酒類許可複核",
    },
    authority: {
      en: "RACJ",
      fr: "RACJ",
      "zh-Hans": "RACJ",
      "zh-Hant": "RACJ",
    },
    summary: {
      en: "Track annual rights, minimum beer-price updates, and rule changes for the grocery permit.",
      fr: "Suivre les droits annuels, les prix minimums de bière et les changements de règles du permis.",
      "zh-Hans": "跟进年度费用、啤酒最低价更新，以及杂货酒类许可规则变化。",
      "zh-Hant": "跟進年度費用、啤酒最低價更新，以及雜貨酒類許可規則變化。",
    },
    cadence: "annual",
    website:
      "https://www.racj.gouv.qc.ca/alcool/vendre-des-boissons-alcooliques-dans-un-commerce-au-detail/permis-depicerie",
  },
  {
    id: "loto-training",
    title: {
      en: "Loto-Québec training and code review",
      fr: "Formation et code Loto-Québec",
      "zh-Hans": "Loto-Québec 培训与守则复核",
      "zh-Hant": "Loto-Québec 培訓與守則複核",
    },
    authority: {
      en: "Loto-Québec",
      fr: "Loto-Québec",
      "zh-Hans": "Loto-Québec",
      "zh-Hant": "Loto-Québec",
    },
    summary: {
      en: "Make sure lottery sellers complete the mandatory training cycle and the retailer code is reviewed each year.",
      fr: "S'assurer que les vendeurs de loterie complètent la formation obligatoire et que le code détaillant est relu chaque année.",
      "zh-Hans": "确保卖彩票的员工完成强制培训周期，并且每年复核一次零售商守则。",
      "zh-Hant": "確保賣彩票的員工完成強制培訓週期，並且每年複核一次零售商守則。",
    },
    cadence: "annual",
    website:
      "https://societe.lotoquebec.com/dam/jcr%3A8bdb1386-3a29-4ae3-813c-bc7d43af4ec5/retailer-code-of-conduct.pdf",
  },
  {
    id: "tobacco-qst",
    title: {
      en: "Tobacco and QST admin sweep",
      fr: "Balayage admin tabac et TVQ",
      "zh-Hans": "烟草与 QST 行政巡检",
      "zh-Hant": "菸草與 QST 行政巡檢",
    },
    authority: {
      en: "Revenu Québec",
      fr: "Revenu Québec",
      "zh-Hans": "魁北克税务局",
      "zh-Hant": "魁北克稅務局",
    },
    summary: {
      en: "Retail tobacco needs QST registration, valid suppliers, and any tobacco-tax difference remitted by the 15th of the next month.",
      fr: "Le tabac détail exige l'inscription TVQ, des fournisseurs valides et tout écart de taxe remis au plus tard le 15 du mois suivant.",
      "zh-Hans": "零售烟草需要 QST 注册、合规供货商，并在次月 15 日前处理应补交的烟草税差额。",
      "zh-Hant": "零售菸草需要 QST 註冊、合規供貨商，並在次月 15 日前處理應補交的菸草稅差額。",
    },
    cadence: "monthly",
    website:
      "https://www.revenuquebec.ca/en/businesses/consumption-taxes/tobacco-tax/permit/",
  },
  {
    id: "qst-filing",
    title: {
      en: "QST / GST filing frequency check",
      fr: "Vérification de fréquence TPS / TVQ",
      "zh-Hans": "QST / GST 申报频率检查",
      "zh-Hant": "QST / GST 申報頻率檢查",
    },
    authority: {
      en: "Revenu Québec",
      fr: "Revenu Québec",
      "zh-Hans": "魁北克税务局",
      "zh-Hant": "魁北克稅務局",
    },
    summary: {
      en: "Revenu Québec assigns the filing frequency from taxable sales, so review the cadence before quarter-end surprises.",
      fr: "Revenu Québec attribue la fréquence selon les ventes taxables, donc on vérifie avant les surprises de fin de trimestre.",
      "zh-Hans": "申报频率由应税销售额决定，所以要在季度末前确认好节奏。",
      "zh-Hant": "申報頻率由應稅銷售額決定，所以要在季度末前確認好節奏。",
    },
    cadence: "quarterly",
    website:
      "https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/reporting-gsthst-and-qst/filing-frequency/",
  },
];

export const soundtrackDefaults = {
  defaultTrackId: "investigation" as TrackId,
  defaultVolume: 0.42,
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isoDateFrom(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return isoDateFrom(date);
}

function addMonths(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return isoDateFrom(date);
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildDefaultState(locale: Locale = "en"): AppState {
  const now = new Date().toISOString();

  return {
    version: 1,
    locale,
    theme: "day",
    activeView: "overview",
    shift: null,
    money: {
      cashSales: 685,
      cardSales: 1040,
      supplierSpend: 390,
      wageSpend: 260,
      repairFund: 980,
      savingsTarget: 2400,
    },
    inventory: [
      {
        id: "beer-cooler",
        onHand: 11,
        parLevel: 18,
        unitCost: 29,
        shelfPrice: 42,
        barcode: "LD-BEER-001",
        note: "Weekend reserve pressure lives here.",
      },
      {
        id: "cold-drinks",
        onHand: 14,
        parLevel: 22,
        unitCost: 16,
        shelfPrice: 28,
        barcode: "LD-DRINK-002",
        note: "Front cooler and top-door recovery.",
      },
      {
        id: "snack-wall",
        onHand: 8,
        parLevel: 12,
        unitCost: 10,
        shelfPrice: 19,
        barcode: "LD-SNACK-003",
        note: "Impulse wall that pays the hydro bill.",
      },
      {
        id: "required-food",
        onHand: 9,
        parLevel: 12,
        unitCost: 7,
        shelfPrice: 13,
        barcode: "LD-FOOD-004",
        note: "Keep this visible for the grocery alcohol floor.",
      },
      {
        id: "ice-bags",
        onHand: 10,
        parLevel: 14,
        unitCost: 2,
        shelfPrice: 4,
        barcode: "LD-ICE-005",
        note: "Low drama, high margin on hot days.",
      },
    ],
    requests: [
      {
        id: "weekend-beer-reserve",
        customer: "Marc / Friday pickup",
        quantity: 3,
        status: "ordered",
        note: "24 Molson Ex until Friday evening.",
      },
      {
        id: "coke-zero-family-pack",
        customer: "Hampton family pack",
        quantity: 2,
        status: "watch",
        note: "Tie to the next PepsiCo run.",
      },
      {
        id: "ice-bag-hold",
        customer: "Construction crew",
        quantity: 4,
        status: "ready",
        note: "Saturday noon pickup.",
      },
    ],
    suppliers: [
      {
        id: "costco",
        weekdays: ["tuesday", "saturday"],
        enabled: true,
        typicalSpend: 360,
        contact: "Costco run sheet",
        note: "Use this to protect pantry basics and paper goods.",
      },
      {
        id: "molson",
        weekdays: ["wednesday", "friday"],
        enabled: true,
        typicalSpend: 540,
        contact: "Molson route rep",
        note: "Beer reserve pressure shows up here first.",
      },
      {
        id: "pepsico",
        weekdays: ["monday", "thursday"],
        enabled: true,
        typicalSpend: 280,
        contact: "Pepsi bottler route",
        note: "Morning window is safest for cooler reset.",
      },
    ],
    compliance: [
      {
        id: "mapaq-permit",
        nextDue: addDays(14),
        cadence: "monthly",
        enabled: true,
        note: "Check the permit wall, sanitizer log, and food-safety register.",
      },
      {
        id: "alcohol-grocery-permit",
        nextDue: addMonths(3),
        cadence: "annual",
        enabled: true,
        note: "Review beer floor, annual rights, and any April pricing update.",
      },
      {
        id: "loto-training",
        nextDue: addMonths(5),
        cadence: "annual",
        enabled: true,
        note: "Confirm every lottery seller finished the annual training cycle.",
      },
      {
        id: "tobacco-qst",
        nextDue: addDays(12),
        cadence: "monthly",
        enabled: true,
        note: "Validate supplier legitimacy and tobacco-tax difference handling.",
      },
      {
        id: "qst-filing",
        nextDue: addDays(24),
        cadence: "quarterly",
        enabled: true,
        note: "Check assigned GST / QST cadence before the quarter-end crush.",
      },
    ],
    maintenance: [
      {
        id: uid("maint"),
        issue: "Beer fridge compressor is weak and the cabinet is warming up.",
        equipment: "Beer cooler",
        severity: "urgent",
        status: "sourcing",
        note: "Revenue leak. This is the money-saving priority.",
        openedAt: now,
      },
      {
        id: uid("maint"),
        issue: "Front cooler lights flicker after opening rush.",
        equipment: "Front drink cooler lighting",
        severity: "watch",
        status: "open",
        note: "Likely bulb, ballast, LED driver, or loose connector.",
        openedAt: now,
      },
    ],
    hopperInput: "",
    hopperResult: null,
    sourcingInput: "Beer fridge compressor broken",
    sourcingPlan: runSourcingAgent("Beer fridge compressor broken"),
    audio: {
      trackId: soundtrackDefaults.defaultTrackId,
      volume: soundtrackDefaults.defaultVolume,
      playing: false,
      currentTime: 0,
      loop: true,
    },
    lastTransportNote: "Initial clean handoff seeded by Chris.",
  };
}

export function buildShiftProfile(role: UserRole): ShiftProfile {
  return {
    role,
    label:
      role === "owner"
        ? "Defei Chen"
        : role === "manager"
          ? "Lydia manager"
          : "Employee station",
    startedAt: new Date().toISOString(),
  };
}

export function roleAllowsMoney(role: UserRole | null | undefined) {
  return role === "owner";
}

export function roleViewAccess(role: UserRole | null | undefined) {
  if (role === "employee") return ["inventory"] as ViewKey[];
  if (role === "manager") return ["overview", "hopper", "inventory", "compliance", "sourcing"] as ViewKey[];
  return ["overview", "sourcing", "hopper", "inventory", "compliance"] as ViewKey[];
}

export function getInventoryCatalogItem(id: string) {
  return inventoryCatalog.find((item) => item.id === id) ?? null;
}

export function getSpecialRequestCatalogItem(id: string) {
  return specialRequestCatalog.find((item) => item.id === id) ?? null;
}

export function getSupplierCatalogItem(id: string) {
  return supplierCatalog.find((item) => item.id === id) ?? null;
}

export function getComplianceCatalogItem(id: string) {
  return complianceCatalog.find((item) => item.id === id) ?? null;
}

function extractQuantity(text: string) {
  const direct = text.match(/(\d+(?:\.\d+)?)/);
  if (direct) return Number(direct[1]);

  const words: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  for (const [word, value] of Object.entries(words)) {
    if (text.includes(word)) return value;
  }

  return null;
}

function findInventoryId(text: string) {
  if (/(molson|bud|coors|beer)/.test(text)) return "beer-cooler";
  if (/(coke|pepsi|drink|sprite|water|monster|red bull)/.test(text)) return "cold-drinks";
  if (/(chip|snack|chocolate|nuts)/.test(text)) return "snack-wall";
  if (/(food|sandwich|bread|milk|egg|grocery)/.test(text)) return "required-food";
  if (/ice/.test(text)) return "ice-bags";
  return null;
}

function findSupplierId(text: string) {
  if (/costco/.test(text)) return "costco";
  if (/(molson|beer delivery|coors route|labatt)/.test(text)) return "molson";
  if (/(pepsi|coke route|bottler|soft drink)/.test(text)) return "pepsico";
  return null;
}

export function runMockHopper(rawInput: string): HopperParseResult {
  const raw = rawInput.trim();
  const generatedAt = new Date().toISOString();
  if (!raw) return { raw: "", inventory: [], delivery: [], maintenance: [], generatedAt };

  const parts = raw
    .split(/\n|[.;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const inventory: HopperParseResult["inventory"] = [];
  const delivery: HopperParseResult["delivery"] = [];
  const maintenance: HopperParseResult["maintenance"] = [];

  for (const part of parts) {
    const normalized = part.toLowerCase();
    const quantity = extractQuantity(normalized);
    const inventoryId = findInventoryId(normalized);
    const supplierId = findSupplierId(normalized);
    const isMaintenance =
      /(compressor|relay|light|lighting|ballast|flicker|fan|thermostat|breaker|leak|cooler warm|fridge)/.test(normalized);

    if (inventoryId) {
      const catalog = getInventoryCatalogItem(inventoryId);
      const delta =
        /(short|missing|down|sold|low|only)/.test(normalized) && quantity
          ? -Math.abs(quantity)
          : /(received|restock|add|arrived|got)/.test(normalized) && quantity
            ? Math.abs(quantity)
            : quantity;

      inventory.push({
        id: inventoryId,
        label: catalog?.title.en ?? inventoryId,
        delta,
        unit: catalog?.unit.en ?? "units",
        note: part,
      });
    }

    if (supplierId || /(delivery|order|route|supplier|call rep|invoice)/.test(normalized)) {
      const catalog = supplierId ? getSupplierCatalogItem(supplierId) : null;
      delivery.push({
        id: supplierId,
        supplier: catalog?.title.en ?? "Manual supplier follow-up",
        quantity,
        action: /(received|arrived|dropped)/.test(normalized)
          ? "Confirm received"
          : /(need|order|call|follow)/.test(normalized)
            ? "Prepare or follow up order"
            : "Review supplier rhythm",
        note: part,
      });
    }

    if (isMaintenance) {
      maintenance.push({
        issue: /(compressor|relay)/.test(normalized)
          ? "Cooling system is not starting cleanly."
          : /(light|lighting|ballast|flicker)/.test(normalized)
            ? "Lighting chain is unstable."
            : "Store equipment needs inspection.",
        equipment: /(beer|fridge|cooler)/.test(normalized)
          ? "Beer cooler"
          : /(light|lighting|ballast)/.test(normalized)
            ? "Store lighting"
            : "General store equipment",
        priority: /(compressor|relay|fan|warm)/.test(normalized) ? "urgent" : "watch",
        note: part,
      });
    }
  }

  return { raw, inventory, delivery, maintenance, generatedAt };
}

function compressorLoop(): SourcingStep[] {
  return [
    {
      phase: "RESET",
      title: "Reset the loop cleanly",
      detail:
        "Kill power for five minutes, then restart. If the compressor tries and trips again, do not keep hammering the start cycle.",
    },
    {
      phase: "CHECK PRE-REQS",
      title: "Confirm the boring prerequisites first",
      detail:
        "Thermostat cold enough, breaker stable, condenser coil not choked with dust, condenser fan actually spinning, and the cabinet vents breathing.",
    },
    {
      phase: "ISOLATE CONFIG",
      title: "Separate control failure from sealed-system failure",
      detail:
        "If the fan runs but the compressor hums, clicks, or overheats, suspect the start relay / overload / capacitor chain before assuming the compressor is dead.",
    },
    {
      phase: "PART TRIAGE",
      title: "Swap the cheap suspects before the expensive heart",
      detail:
        "Model number in hand, compare the relay, overload, and capacitor against OEM diagrams. Those are cheaper than a full compressor quote and often fail first.",
    },
    {
      phase: "CALL THRESHOLD",
      title: "Know when to stop the DIY loop",
      detail:
        "If the compressor shell is scorching hot, trips again with a known-good start kit, or you suspect refrigerant loss, escalate to a refrigeration tech.",
    },
  ];
}

function lightingLoop(): SourcingStep[] {
  return [
    {
      phase: "RESET",
      title: "Power-cycle the lighting section",
      detail:
        "Shut the circuit off, let the driver or ballast fully reset, then bring it back one zone at a time.",
    },
    {
      phase: "CHECK PRE-REQS",
      title: "Look for the cheap obvious failure",
      detail:
        "Loose connector, bad bulb, damaged tombstone, or one weak LED strip segment can make the whole lane flicker.",
    },
    {
      phase: "ISOLATE CONFIG",
      title: "Split fixture failure from feed failure",
      detail:
        "If multiple fixtures flicker together, suspect feed, switch, or ballast / driver. If one fixture flickers, start inside the fixture first.",
    },
    {
      phase: "PART TRIAGE",
      title: "Source bulbs or drivers before booking labour",
      detail:
        "Take the exact bulb, ballast, or driver model number and buy the replacement first. A short swap is cheaper than a blind electrician call.",
    },
    {
      phase: "CALL THRESHOLD",
      title: "Escalate when it smells like building wiring",
      detail:
        "If the breaker trips, wires run hot, or the switch leg behaves unpredictably, stop and bring in licensed help.",
    },
  ];
}

const localRefrigerationSources: readonly VendorSource[] = [
  {
    id: "master-group",
    label: "The Master Group - Montreal",
    area: "220 Rue Bridge, Montreal",
    phone: "514-527-6811",
    url: "https://www.master.ca",
    note:
      "Good local counter option for HVAC and refrigeration parts, especially relays, capacitors, fan motors, and controls.",
  },
  {
    id: "reliable-parts",
    label: "Reliable Parts - Montreal",
    area: "St-Leonard / Montreal",
    phone: "1-800-941-9217",
    url: "https://www.reliableparts.ca/locations/QC/Montreal",
    note:
      "Useful when you have the fridge model number and want a practical Montreal pickup or same-day shipping path.",
  },
  {
    id: "g-paquette",
    label: "Ateliers G. Paquette",
    area: "Greater Montreal coverage",
    phone: "514-381-7288",
    url: "https://www.ateliersgpaquette.com/en/appliance-parts",
    note:
      "Good fallback for thermostat, bulb, control-system, connector, and fridge-adjacent appliance parts.",
  },
];

const onlineRefrigerationSources: readonly VendorSource[] = [
  {
    id: "parts-town-canada",
    label: "Parts Town Canada",
    area: "Online / Canada",
    url: "https://www.partstown.ca/refrigeration-parts",
    note:
      "Best online path when you know the exact commercial model and want OEM refrigeration parts fast.",
  },
  {
    id: "partsfe-canada",
    label: "PartsFe Canada",
    area: "Online / Canada",
    url: "https://partsfe.ca/",
    note:
      "Useful for commercial kitchen and restaurant equipment parts across Canada when the issue spills beyond the merchandiser fridge itself.",
  },
];

function buildPartLeads(type: "compressor" | "lighting"): PartLead[] {
  if (type === "lighting") {
    return [
      {
        name: "Lamp / LED strip",
        why: "Cheap and fast to rule out. One weak lamp can create misleading flicker symptoms.",
        urgency: "first-check",
      },
      {
        name: "Ballast or LED driver",
        why: "Classic cause when one fixture or a small bank flickers but power is present.",
        urgency: "likely",
      },
      {
        name: "Socket / connector",
        why: "Loose plastic or heat-damaged contacts create intermittent behaviour.",
        urgency: "likely",
      },
      {
        name: "Switch or branch feed hardware",
        why: "Only chase this after the fixture-side parts fail to explain the problem.",
        urgency: "only-if-needed",
      },
    ];
  }

  return [
    {
      name: "Start relay + overload",
      why: "These are the cheapest high-probability failures when a compressor hums, clicks, or struggles to start.",
      urgency: "first-check",
    },
    {
      name: "Start capacitor",
      why: "If equipped, a weak capacitor can stop startup and mimic a dying compressor.",
      urgency: "likely",
    },
    {
      name: "Condenser fan motor",
      why: "A dead fan drives heat up fast and can trigger protective shutdowns.",
      urgency: "likely",
    },
    {
      name: "Thermostat / controller",
      why: "Worth checking when the compressor never gets a clean call for cooling.",
      urgency: "only-if-needed",
    },
  ];
}

export function runSourcingAgent(issueInput: string): SourcingPlan {
  const issue = issueInput.trim() || "Beer fridge compressor broken";
  const normalized = issue.toLowerCase();
  const isLighting = /(light|lighting|flicker|ballast|led)/.test(normalized);
  const isCompressor =
    /(compressor|relay|fan|warm|fridge|cooler|beer fridge|beer cooler)/.test(normalized) &&
    !isLighting;

  return {
    issue,
    summary: isLighting
      ? "This looks like a lighting-chain problem first, not a building-wide catastrophe. Buy the cheap fixture-side parts before paying for labour."
      : isCompressor
        ? "Treat this like an ABAP incident loop: reset, prove the prerequisites, isolate the start circuit, then source the low-cost parts before assuming the compressor is finished."
        : "Start with the cheapest reversible checks, then move outward only when the evidence narrows. The app keeps the logic loop calm and explicit.",
    loop: isLighting ? lightingLoop() : compressorLoop(),
    likelyParts: buildPartLeads(isLighting ? "lighting" : "compressor"),
    localSources: [...localRefrigerationSources],
    onlineSources: [...onlineRefrigerationSources],
    revenueMoves: isLighting
      ? [
          "Move the highest-margin cold drinks into the brightest working lane first.",
          "Use shelf tags to prevent customers missing product because one lane is dark.",
          "Bundle the lighting fix with the next supplier window instead of waiting for a random service visit.",
        ]
      : [
          "Move top-selling beer into the healthiest cold lane immediately.",
          "Reduce dead-stock risk by trimming over-ordering until the cooler breathes again.",
          "Use the parts counter first so cash goes to relay / capacitor money, not straight to a full compressor quote.",
        ],
    escalate: isLighting
      ? [
          "Escalate if a breaker trips, wires smell hot, or multiple unrelated fixtures fail together.",
          "Escalate if the switch leg or feed is unstable after a known-good bulb / driver swap.",
        ]
      : [
          "Escalate if the compressor shell is too hot to touch after reset.",
          "Escalate if a good relay / capacitor does not restore a clean start.",
          "Escalate if you suspect refrigerant loss, oil residue, or sealed-system work.",
        ],
    generatedAt: new Date().toISOString(),
  };
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsStamp(dateText: string) {
  const date = new Date(`${dateText}T09:00:00`);
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function cadenceRule(cadence: CadenceType) {
  switch (cadence) {
    case "weekly":
      return "FREQ=WEEKLY";
    case "monthly":
      return "FREQ=MONTHLY";
    case "quarterly":
      return "FREQ=MONTHLY;INTERVAL=3";
    case "annual":
      return "FREQ=YEARLY";
    default:
      return "FREQ=MONTHLY";
  }
}

function weekdayToIcs(day: Weekday) {
  return {
    monday: "MO",
    tuesday: "TU",
    wednesday: "WE",
    thursday: "TH",
    friday: "FR",
    saturday: "SA",
    sunday: "SU",
  }[day];
}

export function buildHeartbeatCalendar(state: AppState) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lydias Depanneur OS//Heartbeat Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const item of state.compliance) {
    if (!item.enabled) continue;
    const template = getComplianceCatalogItem(item.id);
    if (!template) continue;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${item.id}@lydias-depanneur-os`,
      `DTSTAMP:${toIcsStamp(isoDateFrom(new Date()))}`,
      `DTSTART:${toIcsStamp(item.nextDue)}`,
      `RRULE:${cadenceRule(item.cadence)}`,
      `SUMMARY:${escapeIcs(template.title.en)}`,
      `DESCRIPTION:${escapeIcs(`${template.summary.en}\nAuthority: ${template.authority.en}\nLink: ${template.website}\nStore note: ${item.note}`)}`,
      `URL:${template.website}`,
      "END:VEVENT",
    );
  }

  for (const supplier of state.suppliers) {
    if (!supplier.enabled || supplier.weekdays.length === 0) continue;
    const template = getSupplierCatalogItem(supplier.id);
    if (!template) continue;

    lines.push(
      "BEGIN:VEVENT",
      `UID:supplier-${supplier.id}@lydias-depanneur-os`,
      `DTSTAMP:${toIcsStamp(isoDateFrom(new Date()))}`,
      `DTSTART:${toIcsStamp(isoDateFrom(new Date()))}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${supplier.weekdays.map(weekdayToIcs).join(",")}`,
      `SUMMARY:${escapeIcs(`${template.title.en} heartbeat`)}`,
      `DESCRIPTION:${escapeIcs(`${template.subtitle.en}\nTypical spend: $${supplier.typicalSpend}\nContact: ${supplier.contact}\nNote: ${supplier.note}\nLink: ${template.website}`)}`,
      `URL:${template.website}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function mergeById<T extends { id: string }>(baseline: readonly T[], incoming: unknown) {
  const incomingItems = Array.isArray(incoming)
    ? incoming.filter(
        (item): item is T => Boolean(item) && typeof item === "object" && "id" in item,
      )
    : [];
  const byId = new Map(incomingItems.map((item) => [item.id, item]));
  const seen = new Set(baseline.map((item) => item.id));

  return [
    ...baseline.map((item) => ({ ...item, ...(byId.get(item.id) ?? {}) })),
    ...incomingItems.filter((item) => !seen.has(item.id)),
  ];
}
