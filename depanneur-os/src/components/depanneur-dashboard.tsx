"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  Cloud,
  Copy,
  Download,
  FastForward,
  Globe,
  Info,
  LogOut,
  MapPin,
  Moon,
  Music,
  Package,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Terminal,
  TrendingUp,
  Truck,
  Upload,
  Users,
  Volume2,
  VolumeX,
  Wrench,
} from "lucide-react";
import {
  buildHeartbeatCalendar,
  buildShiftProfile,
  getComplianceCatalogItem,
  getInventoryCatalogItem,
  getSpecialRequestCatalogItem,
  getSupplierCatalogItem,
  localeMeta,
  roleAllowsMoney,
  roleLabels,
  roleSummaries,
  roleViewAccess,
  runMockHopper,
  runSourcingAgent,
  t,
  themeLabels,
  uiText,
  viewLabels,
  weekdayLabels,
  type TranslatedText,
} from "@/lib/content";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { hydrateWorkspace, loadWorkspace, saveWorkspace } from "@/lib/local-store";
import { getTrackById, soundtrackTracks } from "@/lib/soundtrack-catalog";
import type {
  AppState,
  HopperParseResult,
  Locale,
  RequestStatus,
  UserRole,
  ViewKey,
} from "@/lib/types";

type Stage = "boot" | "shift" | "board";
type MoneyField = keyof Pick<
  AppState["money"],
  "cashSales" | "cardSales" | "supplierSpend" | "wageSpend"
>;

interface DashboardProps {
  locale?: Locale;
}

interface ToastItem {
  id: string;
  message: string;
}

interface MoneySignal {
  field: MoneyField;
  amount: number;
  note: string;
}

const moneyFieldCopy: Record<MoneyField, TranslatedText> = {
  cashSales: dashboardCopy.cashSales,
  cardSales: dashboardCopy.cardSales,
  supplierSpend: dashboardCopy.supplierSpend,
  wageSpend: dashboardCopy.wageSpend,
};

const bootCopy = {
  eyebrow: {
    en: "Neighbourhood counter system",
    fr: "Système comptoir de quartier",
    "zh-Hans": "社区柜台系统",
    "zh-Hant": "社區櫃檯系統",
  },
  title: {
    en: "Clearer shifts. Faster logging. Better money decisions.",
    fr: "Des quarts plus clairs. Une saisie plus rapide. De meilleures décisions sur l'argent.",
    "zh-Hans": "更清晰的交接。更快的录入。更好的资金判断。",
    "zh-Hant": "更清晰的交接。更快的錄入。更好的資金判斷。",
  },
  body: {
    en: "Start the system once, let the soundtrack open, and keep the counter, cooler, suppliers, and compliance visible in one place.",
    fr: "Démarrez le système une fois, laissez la bande-son s'ouvrir, et gardez le comptoir, le frigo, les fournisseurs et la conformité visibles au même endroit.",
    "zh-Hans": "只要启动一次系统，让配乐打开，就能把柜台、冷柜、供货和合规放在同一个地方看清楚。",
    "zh-Hant": "只要啟動一次系統，讓配樂打開，就能把櫃檯、冷櫃、供貨和合規放在同一個地方看清楚。",
  },
  action: {
    en: "Open counter system",
    fr: "Ouvrir le système du comptoir",
    "zh-Hans": "打开柜台系统",
    "zh-Hant": "打開櫃檯系統",
  },
  audioHint: {
    en: "Investigation starts here and stays steady while you work.",
    fr: "Investigation démarre ici et reste stable pendant le travail.",
    "zh-Hans": "Investigation 会从这里启动，并在工作时稳定持续。",
    "zh-Hant": "Investigation 會從這裡啟動，並在工作時穩定持續。",
  },
  shiftAction: {
    en: "Start shift",
    fr: "Commencer le quart",
    "zh-Hans": "开始班次",
    "zh-Hant": "開始班次",
  },
  overviewLead: {
    en: "Use the board that matches the person at the counter. The owner sees money and repair planning. The team sees the fastest path to clean handoffs.",
    fr: "Utilisez le tableau qui correspond à la personne au comptoir. Le propriétaire voit l'argent et la réparation. L'équipe voit le chemin le plus rapide vers des handoffs propres.",
    "zh-Hans": "让柜台前的人使用对应的工作板。店主看资金和维修规划，团队看最快的清晰交接路径。",
    "zh-Hant": "讓櫃檯前的人使用對應的工作板。店主看資金和維修規劃，團隊看最快的清晰交接路徑。",
  },
  ownerBoardBody: {
    en: "Adjust the four money lanes directly, keep the repair fund visible, and move from revenue pressure to repair decisions without losing the current shift context.",
    fr: "Ajustez directement les quatre lignes d'argent, gardez le fonds de réparation visible et passez de la pression revenu aux décisions de réparation sans perdre le contexte du quart.",
    "zh-Hans": "直接调整四条资金线，把维修基金一直放在眼前，让收入压力和维修决策保持在同一个上下文里。",
    "zh-Hant": "直接調整四條資金線，把維修基金一直放在眼前，讓收入壓力和維修決策保持在同一個上下文裡。",
  },
  inventoryBody: {
    en: "Count with large controls, then keep par level, cost, shelf price, and barcode visible in the same row so the next person does not have to guess.",
    fr: "Comptez avec de grands contrôles, puis gardez le niveau cible, le coût, le prix rayon et le code-barres dans la même ligne pour éviter les suppositions.",
    "zh-Hans": "用大按钮盘点，然后把基准、成本、售价和条码留在同一行里，下一位就不必猜。",
    "zh-Hant": "用大按鈕盤點，然後把基準、成本、售價和條碼留在同一行裡，下一位就不必猜。",
  },
  riskBody: {
    en: "Maintenance preserves margin here. The faster the weak branch is isolated, the faster the counter regains dependable revenue.",
    fr: "Ici, la maintenance protège la marge. Plus vite la branche faible est isolée, plus vite le comptoir retrouve un revenu fiable.",
    "zh-Hans": "在这里，维护就是保住利润。越快隔离出薄弱环节，柜台就越快恢复稳定收入。",
    "zh-Hant": "在這裡，維護就是保住利潤。越快隔離出薄弱環節，櫃檯就越快恢復穩定收入。",
  },
  roi: {
    en: "Target return: immediate",
    fr: "Retour visé : immédiat",
    "zh-Hans": "目标回报：立即见效",
    "zh-Hant": "目標回報：立即見效",
  },
  dataPoolTitle: {
    en: "Shared data pool",
    fr: "Pool de données partagé",
    "zh-Hans": "共享数据池",
    "zh-Hant": "共享資料池",
  },
  dataPoolBody: {
    en: "This build is local-first. Use backup files or sync codes to move the same store state between devices without putting business data in a cloud service.",
    fr: "Cette version est local-first. Utilisez les sauvegardes ou les codes de sync pour déplacer le même état du magasin entre appareils sans envoyer les données en nuage.",
    "zh-Hans": "这是本地优先版本。用备份文件或同步代码在设备之间搬运同一份店铺状态，不必把业务数据放上云端。",
    "zh-Hant": "這是本地優先版本。用備份檔或同步代碼在設備之間搬運同一份店鋪狀態，不必把業務資料放上雲端。",
  },
  copySync: {
    en: "Copy sync code",
    fr: "Copier le code sync",
    "zh-Hans": "复制同步代码",
    "zh-Hant": "複製同步代碼",
  },
  importSync: {
    en: "Import sync code",
    fr: "Importer le code sync",
    "zh-Hans": "导入同步代码",
    "zh-Hant": "匯入同步代碼",
  },
  syncPlaceholder: {
    en: "Paste a sync code from another device.",
    fr: "Collez un code sync depuis un autre appareil.",
    "zh-Hans": "粘贴来自另一台设备的同步代码。",
    "zh-Hant": "貼上來自另一台裝置的同步代碼。",
  },
  syncCopied: {
    en: "Sync code copied.",
    fr: "Code sync copié.",
    "zh-Hans": "同步代码已复制。",
    "zh-Hant": "同步代碼已複製。",
  },
  syncImported: {
    en: "Sync code imported and local state updated.",
    fr: "Code sync importé et état local mis à jour.",
    "zh-Hans": "同步代码已导入，本地状态已更新。",
    "zh-Hant": "同步代碼已匯入，本地狀態已更新。",
  },
  invalidSync: {
    en: "That sync code could not be read.",
    fr: "Ce code sync est illisible.",
    "zh-Hans": "这个同步代码无法读取。",
    "zh-Hant": "這個同步代碼無法讀取。",
  },
  recentSave: {
    en: "Last local save",
    fr: "Dernière sauvegarde locale",
    "zh-Hans": "最近一次本地保存",
    "zh-Hant": "最近一次本地保存",
  },
  lowStockTitle: {
    en: "Low stock lanes",
    fr: "Lignes de faible stock",
    "zh-Hans": "低库存货线",
    "zh-Hant": "低庫存貨線",
  },
  supplierToday: {
    en: "Supplier rhythm today",
    fr: "Rythme fournisseur aujourd'hui",
    "zh-Hans": "今天的供货节奏",
    "zh-Hant": "今天的供貨節奏",
  },
  urgentQueue: {
    en: "Urgent maintenance",
    fr: "Maintenance urgente",
    "zh-Hans": "紧急维修",
    "zh-Hant": "緊急維修",
  },
  quickAdd: {
    en: "Quick add",
    fr: "Ajout rapide",
    "zh-Hans": "快速增加",
    "zh-Hant": "快速增加",
  },
  exactValue: {
    en: "Exact value",
    fr: "Valeur exacte",
    "zh-Hans": "精确数值",
    "zh-Hant": "精確數值",
  },
  openInventory: {
    en: "Open inventory board",
    fr: "Ouvrir l'inventaire",
    "zh-Hans": "打开库存板",
    "zh-Hant": "打開庫存板",
  },
  openHopper: {
    en: "Open intake hopper",
    fr: "Ouvrir la trémie",
    "zh-Hans": "打开录入斗",
    "zh-Hant": "打開錄入斗",
  },
  lowStock: {
    en: "Low stock",
    fr: "Stock bas",
    "zh-Hans": "低库存",
    "zh-Hant": "低庫存",
  },
  healthyStock: {
    en: "Healthy",
    fr: "Sain",
    "zh-Hans": "健康",
    "zh-Hant": "健康",
  },
  noSupplierToday: {
    en: "No supplier windows are scheduled today.",
    fr: "Aucune fenêtre fournisseur aujourd'hui.",
    "zh-Hans": "今天没有安排供货窗口。",
    "zh-Hant": "今天沒有安排供貨窗口。",
  },
  noMaintenance: {
    en: "No open urgent tickets.",
    fr: "Aucun ticket urgent ouvert.",
    "zh-Hans": "没有未关闭的紧急工单。",
    "zh-Hant": "沒有未關閉的緊急工單。",
  },
  moneyHidden: {
    en: "Money controls stay in the owner lane. The rest of the board is still live for clean handoffs.",
    fr: "Les contrôles d'argent restent dans la voie propriétaire. Le reste du tableau reste actif pour les handoffs.",
    "zh-Hans": "资金控制只留在店主视图里，其他面板仍然可用来做清晰交接。",
    "zh-Hant": "資金控制只留在店主視圖裡，其他面板仍然可用來做清晰交接。",
  },
  inventoryCounted: {
    en: "Inventory updated.",
    fr: "Inventaire mis à jour.",
    "zh-Hans": "库存已更新。",
    "zh-Hant": "庫存已更新。",
  },
  requestUpdated: {
    en: "Customer request status updated.",
    fr: "Statut de la demande client mis à jour.",
    "zh-Hans": "顾客需求状态已更新。",
    "zh-Hant": "顧客需求狀態已更新。",
  },
  maintenanceAdvanced: {
    en: "Maintenance queue updated.",
    fr: "File maintenance mise à jour.",
    "zh-Hans": "维修队列已更新。",
    "zh-Hant": "維修隊列已更新。",
  },
  sourcingRun: {
    en: "Sourcing plan refreshed.",
    fr: "Plan sourcing actualisé.",
    "zh-Hans": "采购方案已刷新。",
    "zh-Hant": "採購方案已刷新。",
  },
  hopperSignals: {
    en: "Detected money signals",
    fr: "Signaux argent détectés",
    "zh-Hans": "检测到的资金信号",
    "zh-Hant": "檢測到的資金訊號",
  },
  nothingParsed: {
    en: "Add a note first, then parse the hopper.",
    fr: "Ajoutez d'abord une note, puis parsez la trémie.",
    "zh-Hans": "先输入一条记录，再解析录入斗。",
    "zh-Hant": "先輸入一條記錄，再解析錄入斗。",
  },
  hopperReady: {
    en: "The hopper is parsed and ready to apply.",
    fr: "La trémie est parsée et prête à appliquer.",
    "zh-Hans": "录入斗已解析，可以应用。",
    "zh-Hant": "錄入斗已解析，可以套用。",
  },
  hopperApplied: {
    en: "The clean handoff is now on the board.",
    fr: "Le clean handoff est maintenant sur le tableau.",
    "zh-Hans": "清晰交接已经写入面板。",
    "zh-Hant": "清晰交接已經寫入面板。",
  },
  importJson: {
    en: "Import JSON backup",
    fr: "Importer une sauvegarde JSON",
    "zh-Hans": "导入 JSON 备份",
    "zh-Hant": "匯入 JSON 備份",
  },
  supportTitle: {
    en: "Support",
    fr: "Support",
    "zh-Hans": "支持",
    "zh-Hant": "支援",
  },
  supportBody: {
    en: "Questions or store-specific adjustments can be routed to Chris Hicks by email or text.",
    fr: "Les questions ou ajustements spécifiques au magasin peuvent être envoyés à Chris Hicks par courriel ou texto.",
    "zh-Hans": "如果有问题或需要针对店铺调整，可以通过邮件或短信联系 Chris Hicks。",
    "zh-Hant": "如果有問題或需要針對店鋪調整，可以透過郵件或簡訊聯絡 Chris Hicks。",
  },
  statusOpen: {
    en: "Open",
    fr: "Ouvert",
    "zh-Hans": "待处理",
    "zh-Hant": "待處理",
  },
  statusSourcing: {
    en: "Sourcing",
    fr: "Approvisionnement",
    "zh-Hans": "采购中",
    "zh-Hant": "採購中",
  },
  statusScheduled: {
    en: "Scheduled",
    fr: "Planifié",
    "zh-Hans": "已安排",
    "zh-Hant": "已安排",
  },
  statusStable: {
    en: "Stable",
    fr: "Stable",
    "zh-Hans": "稳定",
    "zh-Hant": "穩定",
  },
  cycleStatus: {
    en: "Advance status",
    fr: "Avancer le statut",
    "zh-Hans": "推进状态",
    "zh-Hant": "推進狀態",
  },
  quietCounter: {
    en: "Quiet counter soundtrack",
    fr: "Bande-son calme du comptoir",
    "zh-Hans": "安静柜台配乐",
    "zh-Hant": "安靜櫃檯配樂",
  },
} as const;

function formatMoney(locale: Locale, value: number) {
  return new Intl.NumberFormat(localeMeta[locale].htmlLang, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(locale: Locale, value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function todayWeekdayKey() {
  const mapping = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;

  return mapping[new Date().getDay()];
}

function makeToast(message: string): ToastItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
  };
}

function stepDate(dateText: string, cadence: AppState["compliance"][number]["cadence"]) {
  const date = new Date(`${dateText}T09:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  if (cadence === "weekly") date.setDate(date.getDate() + 7);
  if (cadence === "monthly") date.setMonth(date.getMonth() + 1);
  if (cadence === "quarterly") date.setMonth(date.getMonth() + 3);
  if (cadence === "annual") date.setFullYear(date.getFullYear() + 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function cycleRequestStatus(status: RequestStatus): RequestStatus {
  if (status === "watch") return "ordered";
  if (status === "ordered") return "ready";
  if (status === "ready") return "fulfilled";
  return "watch";
}

function cycleMaintenanceStatus(
  status: AppState["maintenance"][number]["status"],
): AppState["maintenance"][number]["status"] {
  if (status === "open") return "sourcing";
  if (status === "sourcing") return "scheduled";
  if (status === "scheduled") return "stable";
  return "open";
}

function parseNumber(text: string) {
  const match = text.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;
  return Number(match[0].replace(",", "."));
}

function encodeSyncCode(workspace: AppState) {
  const json = JSON.stringify(workspace);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return window.btoa(binary);
}

function decodeSyncCode(raw: string) {
  const trimmed = raw.trim();
  const binary = window.atob(trimmed);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as Partial<AppState>;
}

function downloadFile(filename: string, body: string, mimeType: string) {
  const blob = new Blob([body], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildKeepPayload(locale: Locale, workspace: AppState) {
  const lowStock = workspace.inventory.filter((item) => item.onHand < item.parLevel);
  const urgentMaintenance = workspace.maintenance.filter((item) => item.status !== "stable");
  const dueSuppliers = workspace.suppliers.filter((item) =>
    item.weekdays.includes(todayWeekdayKey()),
  );

  const lines = [
    t(locale, dashboardCopy.ownerCloseout),
    "",
    `${t(locale, dashboardCopy.gross)}: ${formatMoney(
      locale,
      workspace.money.cashSales + workspace.money.cardSales,
    )}`,
    `${t(locale, dashboardCopy.net)}: ${formatMoney(
      locale,
      workspace.money.cashSales +
        workspace.money.cardSales -
        workspace.money.supplierSpend -
        workspace.money.wageSpend,
    )}`,
    "",
    `${t(locale, bootCopy.lowStockTitle)}: ${
      lowStock.length === 0
        ? "None"
        : lowStock
            .map((item) => {
              const catalog = getInventoryCatalogItem(item.id);
              return `${catalog ? t(locale, catalog.title) : item.id} (${item.onHand}/${item.parLevel})`;
            })
            .join(", ")
    }`,
    `${t(locale, bootCopy.supplierToday)}: ${
      dueSuppliers.length === 0
        ? "None"
        : dueSuppliers
            .map((item) => {
              const supplier = getSupplierCatalogItem(item.id);
              return supplier ? t(locale, supplier.title) : item.id;
            })
            .join(", ")
    }`,
    `${t(locale, bootCopy.urgentQueue)}: ${
      urgentMaintenance.length === 0
        ? "None"
        : urgentMaintenance.map((item) => `${item.equipment} - ${item.issue}`).join("; ")
    }`,
  ];

  return lines.join("\n");
}

function parseMoneySignals(rawInput: string): MoneySignal[] {
  const results: MoneySignal[] = [];
  const lines = rawInput
    .split(/\n|[.;]+/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const normalized = line.toLowerCase();
    const amount = parseNumber(normalized);
    if (amount === null) continue;

    if (/(cash|esp[eè]ces)/.test(normalized) && /(sold|made|cash|vente|revenue|sale)/.test(normalized)) {
      results.push({ field: "cashSales", amount: Math.abs(amount), note: line });
      continue;
    }

    if (/(card|credit|debit|visa|mastercard|carte)/.test(normalized)) {
      results.push({ field: "cardSales", amount: Math.abs(amount), note: line });
      continue;
    }

    if (/(wage|payroll|salary|staff|hours|salaire)/.test(normalized)) {
      results.push({ field: "wageSpend", amount: Math.abs(amount), note: line });
      continue;
    }

    if (/(spent|supplier|costco|molson|pepsi|invoice|expense|paid|achat|depense)/.test(normalized)) {
      results.push({ field: "supplierSpend", amount: Math.abs(amount), note: line });
    }
  }

  return results;
}

function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[2rem] border border-white/60 bg-white/72 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_30px_70px_rgba(0,0,0,0.45)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionIntro({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-950">
        {icon}
      </div>
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
      </div>
    </div>
  );
}

function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-emerald-200 bg-white/88 px-4 py-3 text-sm font-medium text-slate-900 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-slate-900/90 dark:text-white"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "good" | "warn" | "quiet";
}) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
      : tone === "warn"
        ? "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300"
        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {label}
    </span>
  );
}

function MoneyInputCard({
  locale,
  label,
  value,
  onChange,
  quickAdds,
}: {
  locale: Locale;
  label: string;
  value: number;
  onChange: (value: number) => void;
  quickAdds: number[];
}) {
  return (
    <Panel className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {formatMoney(locale, value)}
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t(locale, bootCopy.exactValue)}
        </span>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value || 0))}
          className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t(locale, bootCopy.quickAdd)}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickAdds.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onChange(value + amount)}
              className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
            >
              +{formatMoney(locale, amount)}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function DepanneurDashboard({ locale = "en" }: DashboardProps) {
  const router = useRouter();
  const importInputId = useId();
  const importFileRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stage, setStage] = useState<Stage>("boot");
  const [hydrated, setHydrated] = useState(false);
  const [syncPulse, setSyncPulse] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [syncCodeInput, setSyncCodeInput] = useState("");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const deferredSearch = useDeferredValue(searchValue);
  const [workspace, setWorkspace] = useState<AppState>(() => loadWorkspace(locale));
  const currentTrack = getTrackById(workspace.audio.trackId) ?? soundtrackTracks[0];
  const activeRole = workspace.shift?.role ?? null;
  const allowedViews = roleViewAccess(activeRole);
  const moneyVisible = roleAllowsMoney(activeRole);
  const grossToday = workspace.money.cashSales + workspace.money.cardSales;
  const netToday =
    workspace.money.cashSales +
    workspace.money.cardSales -
    workspace.money.supplierSpend -
    workspace.money.wageSpend;
  const repairProgress =
    workspace.money.savingsTarget > 0
      ? Math.min(100, (workspace.money.repairFund / workspace.money.savingsTarget) * 100)
      : 0;
  const todaySuppliers = workspace.suppliers.filter(
    (supplier) => supplier.enabled && supplier.weekdays.includes(todayWeekdayKey()),
  );
  const lowStockItems = workspace.inventory.filter((item) => item.onHand < item.parLevel);
  const openMaintenance = workspace.maintenance.filter((item) => item.status !== "stable");
  const parsedMoneySignals = parseMoneySignals(workspace.hopperInput);
  const filteredInventory = workspace.inventory.filter((item) => {
    const catalog = getInventoryCatalogItem(item.id);
    const text = [
      catalog ? t(locale, catalog.title) : item.id,
      catalog ? t(locale, catalog.subtitle) : "",
      item.barcode,
      item.note,
    ]
      .join(" ")
      .toLowerCase();
    return text.includes(deferredSearch.trim().toLowerCase());
  });

  useEffect(() => {
    setWorkspace(loadWorkspace(locale));
    setHydrated(true);
  }, [locale]);

  useEffect(() => {
    if (!hydrated) return;
    saveWorkspace(workspace);
  }, [hydrated, workspace]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", workspace.theme === "night");
  }, [workspace.theme]);

  useEffect(() => {
    if (!hydrated || stage !== "board") return;
    if (!allowedViews.includes(workspace.activeView)) {
      setWorkspace((current) => ({ ...current, activeView: allowedViews[0] }));
    }
  }, [allowedViews, hydrated, stage, workspace.activeView]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = workspace.audio.volume;
    audio.loop = workspace.audio.loop;

    if (!audio.src.endsWith(currentTrack.relativePath)) {
      audio.src = currentTrack.relativePath;
    }

    if (workspace.audio.playing) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [
    currentTrack.relativePath,
    workspace.audio.loop,
    workspace.audio.playing,
    workspace.audio.volume,
  ]);

  function pushToast(message: string) {
    const toast = makeToast(message);
    setToasts((current) => [...current.slice(-2), toast]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, 2800);
  }

  function pulseSavedState() {
    setSyncPulse(true);
    window.setTimeout(() => setSyncPulse(false), 900);
  }

  function patchWorkspace(
    producer: (current: AppState) => AppState,
    toastMessage?: string,
  ) {
    startTransition(() => {
      setWorkspace((current) => ({
        ...producer(current),
        lastSavedAt: new Date().toISOString(),
      }));
    });
    pulseSavedState();
    if (toastMessage) {
      pushToast(toastMessage);
    }
  }

  async function handleBoot() {
    try {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = workspace.audio.volume;
        audio.src = currentTrack.relativePath;
        await audio.play();
      }
      patchWorkspace(
        (current) => ({
          ...current,
          audio: { ...current.audio, playing: true, currentTime: 0 },
        }),
      );
    } catch {
      patchWorkspace(
        (current) => ({
          ...current,
          audio: { ...current.audio, playing: false, currentTime: 0 },
        }),
      );
    } finally {
      setStage("shift");
    }
  }

  function handleRoleStart(role: UserRole) {
    patchWorkspace((current) => ({
      ...current,
      shift: buildShiftProfile(role),
      activeView: role === "employee" ? "inventory" : "overview",
      locale,
    }));
    setStage("board");
  }

  function handleSwitchShift() {
    setStage("shift");
  }

  function handleViewChange(view: ViewKey) {
    patchWorkspace((current) => ({ ...current, activeView: view }));
  }

  function handleThemeToggle() {
    patchWorkspace((current) => ({
      ...current,
      theme: current.theme === "night" ? "day" : "night",
    }));
  }

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    patchWorkspace((current) => ({ ...current, locale: nextLocale }));
    router.push(`/${nextLocale}`);
  }

  function handleAudioToggle() {
    patchWorkspace((current) => ({
      ...current,
      audio: { ...current.audio, playing: !current.audio.playing },
    }));
  }

  function handleNextTrack() {
    const currentIndex = soundtrackTracks.findIndex((track) => track.id === currentTrack.id);
    const nextTrack = soundtrackTracks[(currentIndex + 1) % soundtrackTracks.length];
    patchWorkspace((current) => ({
      ...current,
      audio: { ...current.audio, trackId: nextTrack.id, currentTime: 0 },
    }));
  }

  function updateMoney(field: MoneyField, value: number) {
    patchWorkspace(
      (current) => ({
        ...current,
        money: {
          ...current.money,
          [field]: Math.max(0, Number.isFinite(value) ? value : 0),
        },
      }),
      t(locale, dashboardCopy.cleanHandoff),
    );
  }

  function sweepNetToRepairFund() {
    if (netToday <= 0) {
      pushToast(t(locale, dashboardCopy.noNegativeSweep));
      return;
    }

    patchWorkspace(
      (current) => ({
        ...current,
        money: {
          ...current.money,
          repairFund: current.money.repairFund + netToday,
        },
      }),
      t(locale, dashboardCopy.rewardSweep),
    );
  }

  function updateInventoryCount(itemId: string, delta: number) {
    patchWorkspace(
      (current) => ({
        ...current,
        inventory: current.inventory.map((item) =>
          item.id === itemId
            ? {
                ...item,
                onHand: Math.max(0, item.onHand + delta),
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      }),
      t(locale, bootCopy.inventoryCounted),
    );
  }

  function updateInventoryField(
    itemId: string,
    field: "parLevel" | "unitCost" | "shelfPrice" | "barcode" | "note",
    value: number | string,
  ) {
    patchWorkspace((current) => ({
      ...current,
      inventory: current.inventory.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                typeof item[field] === "number"
                  ? Math.max(0, Number(value) || 0)
                  : String(value),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    }));
  }

  function cycleRequest(itemId: string) {
    patchWorkspace(
      (current) => ({
        ...current,
        requests: current.requests.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status: cycleRequestStatus(item.status),
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      }),
      t(locale, bootCopy.requestUpdated),
    );
  }

  function advanceMaintenance(itemId: string) {
    patchWorkspace(
      (current) => ({
        ...current,
        maintenance: current.maintenance.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status: cycleMaintenanceStatus(item.status),
              }
            : item,
        ),
      }),
      t(locale, bootCopy.maintenanceAdvanced),
    );
  }

  function markComplianceReviewed(itemId: string) {
    patchWorkspace(
      (current) => ({
        ...current,
        compliance: current.compliance.map((item) =>
          item.id === itemId
            ? {
                ...item,
                lastDoneAt: new Date().toISOString(),
                nextDue: stepDate(item.nextDue, item.cadence),
              }
            : item,
        ),
      }),
      t(locale, dashboardCopy.calendarReady),
    );
  }

  function handleParseHopper() {
    if (!workspace.hopperInput.trim()) {
      pushToast(t(locale, bootCopy.nothingParsed));
      return;
    }

    patchWorkspace(
      (current) => ({
        ...current,
        hopperResult: runMockHopper(current.hopperInput),
      }),
      t(locale, bootCopy.hopperReady),
    );
  }

  function applyHopperResult(result: HopperParseResult | null) {
    if (!result) {
      handleParseHopper();
      return;
    }

    patchWorkspace(
      (current) => {
        const nextInventory = current.inventory.map((item) => {
          const parsed = result.inventory.find((entry) => entry.id === item.id);
          if (!parsed || parsed.delta === null) return item;
          return {
            ...item,
            onHand: Math.max(0, item.onHand + parsed.delta),
            updatedAt: new Date().toISOString(),
          };
        });

        const money = { ...current.money };
        for (const signal of parseMoneySignals(result.raw)) {
          money[signal.field] = Math.max(0, money[signal.field] + signal.amount);
        }

        const maintenance = [
          ...current.maintenance,
          ...result.maintenance.map((entry, index) => ({
            id: `${Date.now()}-${index}`,
            issue: entry.issue,
            equipment: entry.equipment,
            severity: entry.priority,
            status: "open" as const,
            note: entry.note,
            openedAt: new Date().toISOString(),
          })),
        ];

        const touchedSuppliers = result.delivery
          .map((entry) => entry.id)
          .filter((value): value is string => Boolean(value));

        const suppliers = current.suppliers.map((supplier) =>
          touchedSuppliers.includes(supplier.id)
            ? {
                ...supplier,
                note: `${supplier.note} | ${result.generatedAt.slice(0, 10)}: reviewed in hopper.`,
              }
            : supplier,
        );

        return {
          ...current,
          inventory: nextInventory,
          money,
          maintenance,
          suppliers,
          hopperInput: "",
          hopperResult: result,
          lastTransportNote: result.raw,
        };
      },
      t(locale, bootCopy.hopperApplied),
    );
  }

  function handleRunSourcing() {
    patchWorkspace(
      (current) => ({
        ...current,
        sourcingPlan: runSourcingAgent(current.sourcingInput),
      }),
      t(locale, bootCopy.sourcingRun),
    );
  }

  async function handleKeepPush() {
    const payload = buildKeepPayload(locale, workspace);

    try {
      if (navigator.share) {
        await navigator.share({
          title: t(locale, dashboardCopy.cleanHandoffTitle),
          text: payload,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
        window.open("https://keep.google.com/", "_blank", "noopener,noreferrer");
      }

      pushToast(t(locale, dashboardCopy.keepReady));
    } catch {
      pushToast(t(locale, dashboardCopy.keepReady));
    }
  }

  function handleCalendarExport() {
    downloadFile("lydias-heartbeats.ics", buildHeartbeatCalendar(workspace), "text/calendar");
    pushToast(t(locale, dashboardCopy.calendarReady));
  }

  function handleBackupExport() {
    downloadFile(
      "lydias-depanneur-backup.json",
      JSON.stringify(workspace, null, 2),
      "application/json",
    );
    pushToast(t(locale, dashboardCopy.backupReady));
  }

  function handleBackupFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    void file.text().then((raw) => {
      try {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        const next = hydrateWorkspace(locale, parsed);
        patchWorkspace(() => next, t(locale, dashboardCopy.importReady));
      } catch {
        pushToast(t(locale, dashboardCopy.invalidBackup));
      } finally {
        event.target.value = "";
      }
    });
  }

  async function handleCopySync() {
    try {
      const code = encodeSyncCode(workspace);
      await navigator.clipboard.writeText(code);
      pushToast(t(locale, bootCopy.syncCopied));
    } catch {
      pushToast(t(locale, bootCopy.invalidSync));
    }
  }

  function handleImportSync() {
    try {
      const parsed = decodeSyncCode(syncCodeInput);
      const next = hydrateWorkspace(locale, parsed);
      patchWorkspace(() => next, t(locale, bootCopy.syncImported));
      setSyncCodeInput("");
    } catch {
      pushToast(t(locale, bootCopy.invalidSync));
    }
  }

  const currentView = workspace.activeView;
  const heroToneClass =
    workspace.theme === "night"
      ? "bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(190,24,93,0.18),transparent_34%),linear-gradient(160deg,#050816,#0f172a_58%,#111827)]"
      : "bg-[radial-gradient(circle_at_top_left,rgba(252,165,165,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.22),transparent_32%),linear-gradient(160deg,#fff9ef,#f7f4ea_55%,#eef5f3)]";

  return (
    <div
      className={`min-h-screen ${
        workspace.theme === "night"
          ? "bg-[#050816] text-slate-100"
          : "bg-[#f7f4ea] text-slate-900"
      }`}
    >
      <audio ref={audioRef} preload="auto" />
      <ToastStack toasts={toasts} />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-[34rem] w-[34rem] rounded-full bg-rose-400/18 blur-3xl dark:bg-rose-500/12" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[38rem] w-[38rem] rounded-full bg-emerald-400/18 blur-3xl dark:bg-emerald-500/12" />
        <div className="absolute right-[12%] top-[18%] h-[22rem] w-[22rem] rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/10" />
      </div>

      {stage === "boot" && (
        <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <Panel className={`${heroToneClass} border-none px-8 py-10 lg:px-12 lg:py-14`}>
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">
                    {t(locale, bootCopy.eyebrow)}
                  </p>
                  <h1 className="font-display text-5xl font-semibold tracking-tight text-slate-950 dark:text-white lg:text-7xl">
                    {t(locale, uiText.appTitle)}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200">
                    {t(locale, bootCopy.title)}
                  </p>
                  <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    {t(locale, bootCopy.body)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleBoot}
                    className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
                  >
                    <Play className="h-4 w-4" />
                    {t(locale, bootCopy.action)}
                  </button>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:text-slate-200">
                    <MapPin className="h-4 w-4" />
                    <span>6030 Sherbrooke Ouest · NDG</span>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-6">
              <Panel className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    {t(locale, bootCopy.quietCounter)}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                    {currentTrack.title}
                  </h2>
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {t(locale, bootCopy.audioHint)}
                </p>
              </Panel>

              <Panel className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleThemeToggle}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    {workspace.theme === "night" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {t(
                      locale,
                      workspace.theme === "night" ? themeLabels.night : themeLabels.day,
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(localeMeta).map(([key, meta]) => {
                    const localeKey = key as Locale;
                    return (
                      <button
                        key={localeKey}
                        type="button"
                        onClick={() => handleLocaleChange(localeKey)}
                        className={`rounded-2xl border px-3 py-3 text-left text-sm font-medium transition ${
                          locale === localeKey
                            ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-200"
                            : "border-slate-200 bg-white/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                        }`}
                      >
                        <span className="block">{meta.nativeLabel}</span>
                        <span className="mt-1 block text-xs opacity-70">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Panel>
            </div>
          </div>
        </main>
      )}

      {stage === "shift" && (
        <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <Panel className={`${heroToneClass} border-none px-8 py-8 lg:px-10`}>
              <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-slate-300">
                    {t(locale, dashboardCopy.shiftTitle)}
                  </p>
                  <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white lg:text-5xl">
                    {t(locale, dashboardCopy.shiftBody)}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    {t(locale, bootCopy.overviewLead)}
                  </p>
                </div>
                <Panel className="space-y-4 border-white/70 bg-white/80 dark:border-white/10 dark:bg-slate-950/55">
                  <SectionIntro
                    title={t(locale, bootCopy.dataPoolTitle)}
                    body={t(locale, bootCopy.dataPoolBody)}
                    icon={<Cloud className="h-5 w-5" />}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleCopySync}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Copy className="h-4 w-4" />
                      {t(locale, bootCopy.copySync)}
                    </button>
                    <button
                      type="button"
                      onClick={() => importFileRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Upload className="h-4 w-4" />
                      {t(locale, bootCopy.importJson)}
                    </button>
                  </div>
                  <label className="block space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {t(locale, bootCopy.importSync)}
                    </span>
                    <textarea
                      value={syncCodeInput}
                      onChange={(event) => setSyncCodeInput(event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder={t(locale, bootCopy.syncPlaceholder)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleImportSync}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {t(locale, bootCopy.importSync)}
                  </button>
                </Panel>
              </div>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-3">
              {(["owner", "manager", "employee"] as UserRole[]).map((role) => (
                <Panel
                  key={role}
                  className="flex h-full flex-col justify-between gap-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.18)] dark:hover:shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
                >
                  <div className="space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      {role === "owner" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : role === "manager" ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                        {t(locale, roleLabels[role])}
                      </h2>
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {t(locale, roleSummaries[role])}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRoleStart(role)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
                  >
                    <Check className="h-4 w-4" />
                    {t(locale, bootCopy.shiftAction)}
                  </button>
                </Panel>
              ))}
            </div>

            <input
              id={importInputId}
              ref={importFileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleBackupFileChange}
            />
          </div>
        </main>
      )}

      {stage === "board" && (
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <header className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <Panel className={`${heroToneClass} border-none`}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:text-slate-200">
                    <MapPin className="h-3.5 w-3.5" />
                    6030 Sherbrooke Ouest · NDG
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-slate-300">
                      {t(locale, viewLabels[currentView])}
                    </p>
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {t(locale, dashboardCopy.heroTitle)}
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                      {t(locale, dashboardCopy.heroBody)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge
                      label={t(locale, roleLabels[activeRole ?? "employee"])}
                      tone="quiet"
                    />
                    <StatusBadge
                      label={
                        syncPulse
                          ? t(locale, dashboardCopy.working)
                          : t(locale, bootCopy.dataPoolTitle)
                      }
                      tone={syncPulse ? "good" : "quiet"}
                    />
                    <StatusBadge
                      label={`${t(locale, bootCopy.recentSave)}: ${formatDate(
                        locale,
                        workspace.lastSavedAt,
                      )}`}
                      tone="quiet"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleThemeToggle}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    {workspace.theme === "night" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleAudioToggle}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    {workspace.audio.playing ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    {workspace.audio.playing
                      ? t(locale, dashboardCopy.pause)
                      : t(locale, dashboardCopy.play)}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTrack}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    <FastForward className="h-4 w-4" />
                    {currentTrack.title}
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchShift}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    <LogOut className="h-4 w-4" />
                    {t(locale, dashboardCopy.switchShift)}
                  </button>
                </div>
              </div>
            </Panel>

            <Panel className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  {t(locale, dashboardCopy.audioPanel)}
                </p>
                <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  {currentTrack.title}
                </h2>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {currentTrack.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(localeMeta).map(([key, meta]) => {
                  const localeKey = key as Locale;
                  return (
                    <button
                      key={localeKey}
                      type="button"
                      onClick={() => handleLocaleChange(localeKey)}
                      className={`rounded-2xl border px-3 py-3 text-left text-sm font-medium transition ${
                        locale === localeKey
                          ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-200"
                          : "border-slate-200 bg-white/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                      }`}
                    >
                      <span className="block">{meta.nativeLabel}</span>
                      <span className="mt-1 block text-xs opacity-70">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>
          </header>

          <nav className="flex gap-3 overflow-x-auto pb-1">
            {allowedViews.map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => handleViewChange(view)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  currentView === view
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                }`}
              >
                {t(locale, viewLabels[view])}
              </button>
            ))}
          </nav>

          {currentView === "overview" && (
            <div className="grid gap-6">
              <Panel className="space-y-5">
                <SectionIntro
                  title={t(locale, dashboardCopy.moneyQuestion)}
                  body={
                    moneyVisible
                      ? t(locale, bootCopy.ownerBoardBody)
                      : t(locale, bootCopy.moneyHidden)
                  }
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                {moneyVisible ? (
                  <>
                    <div className="grid gap-4 xl:grid-cols-4">
                      <MoneyInputCard
                        locale={locale}
                        label={t(locale, moneyFieldCopy.cashSales)}
                        value={workspace.money.cashSales}
                        onChange={(value) => updateMoney("cashSales", value)}
                        quickAdds={[10, 25, 50]}
                      />
                      <MoneyInputCard
                        locale={locale}
                        label={t(locale, moneyFieldCopy.cardSales)}
                        value={workspace.money.cardSales}
                        onChange={(value) => updateMoney("cardSales", value)}
                        quickAdds={[10, 25, 50]}
                      />
                      <MoneyInputCard
                        locale={locale}
                        label={t(locale, moneyFieldCopy.supplierSpend)}
                        value={workspace.money.supplierSpend}
                        onChange={(value) => updateMoney("supplierSpend", value)}
                        quickAdds={[25, 75, 150]}
                      />
                      <MoneyInputCard
                        locale={locale}
                        label={t(locale, moneyFieldCopy.wageSpend)}
                        value={workspace.money.wageSpend}
                        onChange={(value) => updateMoney("wageSpend", value)}
                        quickAdds={[25, 50, 100]}
                      />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <Panel className="space-y-5 border border-emerald-200 bg-emerald-50/65 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                              {t(locale, dashboardCopy.gross)}
                            </p>
                            <p className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                              {formatMoney(locale, grossToday)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                              {t(locale, dashboardCopy.net)}
                            </p>
                            <p className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                              {formatMoney(locale, netToday)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                              {t(locale, dashboardCopy.repairFund)}
                            </p>
                            <p className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                              {formatMoney(locale, workspace.money.repairFund)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {t(locale, dashboardCopy.savingsTarget)}
                            </p>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                              {formatMoney(locale, workspace.money.savingsTarget)}
                            </p>
                          </div>
                          <div className="h-4 overflow-hidden rounded-full bg-emerald-200/70 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 transition-all"
                              style={{ width: `${repairProgress}%` }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={sweepNetToRepairFund}
                              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
                            >
                              <TrendingUp className="h-4 w-4" />
                              {t(locale, dashboardCopy.sweepFund)}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleViewChange("sourcing")}
                              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-emerald-300"
                            >
                              <Wrench className="h-4 w-4" />
                              {t(locale, dashboardCopy.openSourcing)}
                            </button>
                          </div>
                        </div>
                      </Panel>

                      <Panel className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            {t(locale, dashboardCopy.prophecyTitle)}
                          </p>
                          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {t(locale, dashboardCopy.familyNote)}
                          </p>
                        </div>
                        <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                            {t(locale, bootCopy.riskBody)}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
                            <CheckCircle className="h-4 w-4" />
                            {t(locale, bootCopy.roi)}
                          </div>
                        </div>
                      </Panel>
                    </div>
                  </>
                ) : (
                  <Panel className="border border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {t(locale, bootCopy.moneyHidden)}
                    </p>
                  </Panel>
                )}
              </Panel>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
                <Panel className="space-y-4">
                  <SectionIntro
                    title={t(locale, bootCopy.lowStockTitle)}
                    body={t(locale, bootCopy.inventoryBody)}
                    icon={<Package className="h-5 w-5" />}
                  />
                  <div className="space-y-3">
                    {lowStockItems.length === 0 && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {t(locale, bootCopy.healthyStock)}
                      </p>
                    )}
                    {lowStockItems.slice(0, 4).map((item) => {
                      const catalog = getInventoryCatalogItem(item.id);
                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {catalog ? t(locale, catalog.title) : item.id}
                              </p>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                {item.onHand} / {item.parLevel}
                              </p>
                            </div>
                            <StatusBadge label={t(locale, bootCopy.lowStock)} tone="warn" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewChange("inventory")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {t(locale, bootCopy.openInventory)}
                  </button>
                </Panel>

                <Panel className="space-y-4">
                  <SectionIntro
                    title={t(locale, bootCopy.supplierToday)}
                    body={t(locale, dashboardCopy.supplierRhythm)}
                    icon={<Truck className="h-5 w-5" />}
                  />
                  <div className="space-y-3">
                    {todaySuppliers.length === 0 && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {t(locale, bootCopy.noSupplierToday)}
                      </p>
                    )}
                    {todaySuppliers.map((supplier) => {
                      const catalog = getSupplierCatalogItem(supplier.id);
                      return (
                        <div
                          key={supplier.id}
                          className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {catalog ? t(locale, catalog.title) : supplier.id}
                              </p>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                {formatMoney(locale, supplier.typicalSpend)}
                              </p>
                            </div>
                            <StatusBadge label={t(locale, dashboardCopy.ready)} tone="good" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewChange("compliance")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    <Calendar className="h-4 w-4" />
                    {t(locale, dashboardCopy.exportCalendar)}
                  </button>
                </Panel>

                <Panel className="space-y-4">
                  <SectionIntro
                    title={t(locale, bootCopy.urgentQueue)}
                    body={t(locale, dashboardCopy.maintenanceQueue)}
                    icon={<Wrench className="h-5 w-5" />}
                  />
                  <div className="space-y-3">
                    {openMaintenance.length === 0 && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {t(locale, bootCopy.noMaintenance)}
                      </p>
                    )}
                    {openMaintenance.slice(0, 4).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {ticket.equipment}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              {ticket.issue}
                            </p>
                          </div>
                          <StatusBadge
                            label={
                              ticket.severity === "urgent"
                                ? t(locale, bootCopy.statusOpen)
                                : t(locale, bootCopy.statusSourcing)
                            }
                            tone={ticket.severity === "urgent" ? "warn" : "quiet"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewChange("hopper")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {t(locale, bootCopy.openHopper)}
                  </button>
                </Panel>
              </div>
            </div>
          )}

          {currentView === "sourcing" && (
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <Panel className="space-y-5">
                <SectionIntro
                  title={t(locale, dashboardCopy.sourcingTitle)}
                  body={t(locale, dashboardCopy.sourcingBody)}
                  icon={<Wrench className="h-5 w-5" />}
                />
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    {t(locale, dashboardCopy.issue)}
                  </span>
                  <textarea
                    rows={5}
                    value={workspace.sourcingInput}
                    onChange={(event) =>
                      setWorkspace((current) => ({
                        ...current,
                        sourcingInput: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRunSourcing}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
                >
                  <Wrench className="h-4 w-4" />
                  {t(locale, dashboardCopy.runAgent)}
                </button>
              </Panel>

              <div className="grid gap-6">
                <Panel className="space-y-4">
                  <SectionIntro
                    title={workspace.sourcingPlan?.issue ?? workspace.sourcingInput}
                    body={workspace.sourcingPlan?.summary ?? ""}
                    icon={<Terminal className="h-5 w-5" />}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Panel className="space-y-2 border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                        {t(locale, dashboardCopy.techQuote)}
                      </p>
                      <p className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        {formatMoney(locale, 480)}
                      </p>
                    </Panel>
                    <Panel className="space-y-2 border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                        {t(locale, dashboardCopy.partsCost)}
                      </p>
                      <p className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        {formatMoney(locale, 95)}
                      </p>
                    </Panel>
                    <Panel className="space-y-2 border border-slate-200 bg-white/85 p-4 dark:border-slate-700 dark:bg-slate-900/85">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                        {t(locale, dashboardCopy.savingsFound)}
                      </p>
                      <p className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        {formatMoney(locale, 385)}
                      </p>
                    </Panel>
                  </div>
                </Panel>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Panel className="space-y-4">
                    <SectionIntro
                      title={t(locale, dashboardCopy.likelyParts)}
                      body={t(locale, dashboardCopy.logicLoop)}
                      icon={<CheckCircle className="h-5 w-5" />}
                    />
                    <div className="space-y-3">
                      {workspace.sourcingPlan?.likelyParts.map((part) => (
                        <div
                          key={part.name}
                          className="rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {part.name}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {part.why}
                              </p>
                            </div>
                            <StatusBadge
                              label={part.urgency}
                              tone={part.urgency === "only-if-needed" ? "quiet" : "good"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <Panel className="space-y-4">
                    <SectionIntro
                      title={t(locale, dashboardCopy.localSources)}
                      body={t(locale, dashboardCopy.onlineSources)}
                      icon={<Globe className="h-5 w-5" />}
                    />
                    <div className="space-y-3">
                      {[...(workspace.sourcingPlan?.localSources ?? []), ...(workspace.sourcingPlan?.onlineSources ?? [])].map(
                        (source) => (
                          <div
                            key={source.id}
                            className="rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                          >
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="font-semibold text-slate-950 dark:text-white">
                                  {source.label}
                                </p>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                                >
                                  {t(locale, dashboardCopy.officialLink)}
                                </a>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {source.area}
                                {source.phone ? ` · ${source.phone}` : ""}
                              </p>
                              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {source.note}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        patchWorkspace(
                          (current) => ({
                            ...current,
                            money: {
                              ...current.money,
                              repairFund: current.money.repairFund + 385,
                            },
                          }),
                          t(locale, dashboardCopy.rewardSavings),
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                      <TrendingUp className="h-4 w-4" />
                      {t(locale, dashboardCopy.bookSavings)}
                    </button>
                  </Panel>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Panel className="space-y-4">
                    <SectionIntro
                      title={t(locale, dashboardCopy.revenueMoves)}
                      body={t(locale, dashboardCopy.payback)}
                      icon={<TrendingUp className="h-5 w-5" />}
                    />
                    <ul className="space-y-3">
                      {workspace.sourcingPlan?.revenueMoves.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Panel>

                  <Panel className="space-y-4">
                    <SectionIntro
                      title={t(locale, dashboardCopy.escalate)}
                      body={t(locale, dashboardCopy.prophecyTitle)}
                      icon={<ShieldAlert className="h-5 w-5" />}
                    />
                    <ul className="space-y-3">
                      {workspace.sourcingPlan?.escalate.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>
              </div>
            </div>
          )}

          {currentView === "hopper" && (
            <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
              <Panel className="space-y-5">
                <SectionIntro
                  title={t(locale, dashboardCopy.hopperTitle)}
                  body={t(locale, dashboardCopy.hopperBody)}
                  icon={<Terminal className="h-5 w-5" />}
                />
                <textarea
                  value={workspace.hopperInput}
                  onChange={(event) =>
                    setWorkspace((current) => ({
                      ...current,
                      hopperInput: event.target.value,
                    }))
                  }
                  rows={12}
                  className="w-full rounded-[1.75rem] border border-slate-200 bg-white/92 px-5 py-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder={t(locale, dashboardCopy.hopperPlaceholder)}
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleParseHopper}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
                  >
                    <Search className="h-4 w-4" />
                    {t(locale, dashboardCopy.parseHopper)}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHopperResult(workspace.hopperResult)}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {t(locale, dashboardCopy.applyHopper)}
                  </button>
                </div>
              </Panel>

              <div className="grid gap-6">
                <Panel className="space-y-4">
                  <SectionIntro
                    title={t(locale, dashboardCopy.structuredOutput)}
                    body={workspace.hopperResult?.raw ?? t(locale, bootCopy.nothingParsed)}
                    icon={<Info className="h-5 w-5" />}
                  />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        {t(locale, bootCopy.hopperSignals)}
                      </p>
                      {parsedMoneySignals.length === 0 && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {t(locale, bootCopy.nothingParsed)}
                        </p>
                      )}
                      {parsedMoneySignals.map((signal, index) => (
                        <div
                          key={`${signal.field}-${index}`}
                          className="rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {t(locale, moneyFieldCopy[signal.field])}
                            </p>
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              +{formatMoney(locale, signal.amount)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {signal.note}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        {t(locale, dashboardCopy.ready)}
                      </p>
                      <div className="space-y-3">
                        {workspace.hopperResult?.inventory.map((entry, index) => (
                          <div
                            key={`${entry.label}-${index}`}
                            className="rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70"
                          >
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {entry.label}
                            </p>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">
                              {entry.delta ?? 0} {entry.unit}
                            </p>
                          </div>
                        ))}
                        {workspace.hopperResult?.delivery.map((entry, index) => (
                          <div
                            key={`${entry.supplier}-${index}`}
                            className="rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70"
                          >
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {entry.supplier}
                            </p>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">
                              {entry.action}
                            </p>
                          </div>
                        ))}
                        {workspace.hopperResult?.maintenance.map((entry, index) => (
                          <div
                            key={`${entry.issue}-${index}`}
                            className="rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70"
                          >
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {entry.equipment}
                            </p>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">
                              {entry.issue}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {currentView === "inventory" && (
            <div className="grid gap-6">
              <Panel className="space-y-5">
                <SectionIntro
                  title={t(locale, dashboardCopy.inventoryTitle)}
                  body={t(locale, bootCopy.inventoryBody)}
                  icon={<Package className="h-5 w-5" />}
                />
                <label className="block max-w-md">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    {t(locale, dashboardCopy.search)}
                  </span>
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/92 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                      placeholder={t(locale, dashboardCopy.search)}
                    />
                  </div>
                </label>
                <div className="grid gap-4">
                  {filteredInventory.map((item) => {
                    const catalog = getInventoryCatalogItem(item.id);
                    return (
                      <Panel key={item.id} className="space-y-5 border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {catalog ? t(locale, catalog.title) : item.id}
                              </h3>
                              <StatusBadge
                                label={
                                  item.onHand < item.parLevel
                                    ? t(locale, bootCopy.lowStock)
                                    : t(locale, bootCopy.healthyStock)
                                }
                                tone={item.onHand < item.parLevel ? "warn" : "good"}
                              />
                            </div>
                            <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {catalog ? t(locale, catalog.subtitle) : item.note}
                            </p>
                          </div>

                          <div className="flex w-full items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60 xl:w-auto">
                            <button
                              type="button"
                              onClick={() => updateInventoryCount(item.id, -1)}
                              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-3xl font-semibold text-slate-900 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-rose-500 dark:hover:text-rose-300"
                            >
                              –
                            </button>
                            <div className="min-w-24 text-center">
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                                {t(locale, dashboardCopy.onHand)}
                              </p>
                              <p className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
                                {item.onHand}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => updateInventoryCount(item.id, 1)}
                              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-slate-950"
                            >
                              <Plus className="h-6 w-6" />
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          {[
                            {
                              key: "parLevel" as const,
                              label: t(locale, dashboardCopy.parLevel),
                              value: item.parLevel,
                            },
                            {
                              key: "unitCost" as const,
                              label: t(locale, dashboardCopy.unitCost),
                              value: item.unitCost,
                            },
                            {
                              key: "shelfPrice" as const,
                              label: t(locale, dashboardCopy.shelfPrice),
                              value: item.shelfPrice,
                            },
                            {
                              key: "barcode" as const,
                              label: t(locale, dashboardCopy.barcode),
                              value: item.barcode,
                            },
                          ].map((field) => (
                            <label key={field.key} className="space-y-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                                {field.label}
                              </span>
                              <input
                                value={field.value}
                                onChange={(event) =>
                                  updateInventoryField(item.id, field.key, event.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </label>
                          ))}
                        </div>
                      </Panel>
                    );
                  })}
                </div>
              </Panel>

              <Panel className="space-y-5">
                <SectionIntro
                  title={t(locale, dashboardCopy.requestBoard)}
                  body={t(locale, dashboardCopy.hopperBody)}
                  icon={<Users className="h-5 w-5" />}
                />
                <div className="grid gap-4 lg:grid-cols-3">
                  {workspace.requests.map((request) => {
                    const catalog = getSpecialRequestCatalogItem(request.id);
                    return (
                      <div
                        key={`${request.id}-${request.customer}`}
                        className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-950/70"
                      >
                        <div className="space-y-2">
                          <p className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                            {catalog ? t(locale, catalog.title) : request.customer}
                          </p>
                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {request.customer}
                          </p>
                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {request.note}
                          </p>
                        </div>
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <StatusBadge
                            label={request.status}
                            tone={request.status === "fulfilled" ? "good" : "quiet"}
                          />
                          <button
                            type="button"
                            onClick={() => cycleRequest(request.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                          >
                            <RefreshCw className="h-4 w-4" />
                            {request.quantity}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {currentView === "compliance" && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-6">
                <Panel className="space-y-5">
                  <SectionIntro
                    title={t(locale, dashboardCopy.complianceTitle)}
                    body={t(locale, dashboardCopy.familyNote)}
                    icon={<ShieldCheck className="h-5 w-5" />}
                  />
                  <div className="grid gap-4 lg:grid-cols-2">
                    {workspace.compliance.map((item) => {
                      const template = getComplianceCatalogItem(item.id);
                      if (!template) return null;
                      return (
                        <div
                          key={item.id}
                          className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-950/70"
                        >
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                              {template.authority.en}
                            </p>
                            <h3 className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                              {t(locale, template.title)}
                            </h3>
                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {t(locale, template.summary)}
                            </p>
                          </div>
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <StatusBadge
                              label={`${t(locale, dashboardCopy.nextDue)}: ${formatDate(
                                locale,
                                item.nextDue,
                              )}`}
                              tone="quiet"
                            />
                            <button
                              type="button"
                              onClick={() => markComplianceReviewed(item.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                            >
                              <CheckCircle className="h-4 w-4" />
                              {t(locale, dashboardCopy.markDone)}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>

                <Panel className="space-y-5">
                  <SectionIntro
                    title={t(locale, dashboardCopy.supplierRhythm)}
                    body={t(locale, bootCopy.supplierToday)}
                    icon={<Truck className="h-5 w-5" />}
                  />
                  <div className="space-y-4">
                    {workspace.suppliers.map((supplier) => {
                      const template = getSupplierCatalogItem(supplier.id);
                      if (!template) return null;
                      return (
                        <div
                          key={supplier.id}
                          className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-950/70"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                              <h3 className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                                {t(locale, template.title)}
                              </h3>
                              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {t(locale, template.subtitle)}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {supplier.contact} · {formatMoney(locale, supplier.typicalSpend)}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {supplier.weekdays.map((day) => (
                                <StatusBadge
                                  key={`${supplier.id}-${day}`}
                                  label={t(locale, weekdayLabels[day])}
                                  tone={day === todayWeekdayKey() ? "good" : "quiet"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </div>

              <div className="grid gap-6">
                <Panel className="space-y-5">
                  <SectionIntro
                    title={t(locale, dashboardCopy.maintenanceQueue)}
                    body={t(locale, dashboardCopy.prophecyTitle)}
                    icon={<Wrench className="h-5 w-5" />}
                  />
                  <div className="space-y-4">
                    {workspace.maintenance.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-950/70"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                              {ticket.equipment}
                            </h3>
                            <StatusBadge
                              label={
                                ticket.status === "open"
                                  ? t(locale, bootCopy.statusOpen)
                                  : ticket.status === "sourcing"
                                    ? t(locale, bootCopy.statusSourcing)
                                    : ticket.status === "scheduled"
                                      ? t(locale, bootCopy.statusScheduled)
                                      : t(locale, bootCopy.statusStable)
                              }
                              tone={ticket.status === "stable" ? "good" : "warn"}
                            />
                          </div>
                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {ticket.issue}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {ticket.note}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => advanceMaintenance(ticket.id)}
                          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {t(locale, bootCopy.cycleStatus)}
                        </button>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel className="space-y-4">
                  <SectionIntro
                    title={t(locale, bootCopy.dataPoolTitle)}
                    body={t(locale, bootCopy.dataPoolBody)}
                    icon={<Cloud className="h-5 w-5" />}
                  />
                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={handleCalendarExport}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Calendar className="h-4 w-4" />
                      {t(locale, dashboardCopy.exportCalendar)}
                    </button>
                    <button
                      type="button"
                      onClick={handleKeepPush}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Globe className="h-4 w-4" />
                      {t(locale, dashboardCopy.keepPush)}
                    </button>
                    <button
                      type="button"
                      onClick={handleBackupExport}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Download className="h-4 w-4" />
                      {t(locale, dashboardCopy.exportBackup)}
                    </button>
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default DepanneurDashboard;
