import { buildDefaultState, mergeById, runSourcingAgent } from "./ops-data";
import type { AppState, Locale } from "./types";

const STORAGE_KEY = "lydias-depanneur-os-v1";

function safeParse(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

export function hydrateWorkspace(
  locale: Locale,
  parsed: Partial<AppState> | null | undefined,
) {
  const baseline = buildDefaultState(locale);

  if (!parsed) {
    return baseline;
  }

  return {
    ...baseline,
    ...parsed,
    locale:
      typeof parsed.locale === "string" ? (parsed.locale as Locale) : baseline.locale,
    inventory: mergeById(baseline.inventory, parsed.inventory),
    requests: mergeById(baseline.requests, parsed.requests),
    suppliers: mergeById(baseline.suppliers, parsed.suppliers),
    compliance: mergeById(baseline.compliance, parsed.compliance),
    maintenance: mergeById(baseline.maintenance, parsed.maintenance),
    money: { ...baseline.money, ...(parsed.money ?? {}) },
    audio: { ...baseline.audio, ...(parsed.audio ?? {}) },
    sourcingPlan:
      parsed.sourcingPlan ??
      runSourcingAgent(parsed.sourcingInput ?? baseline.sourcingInput),
    version: 1,
  } satisfies AppState;
}

export function loadWorkspace(locale: Locale) {
  if (typeof window === "undefined") {
    return buildDefaultState(locale);
  }

  return hydrateWorkspace(locale, safeParse(window.localStorage.getItem(STORAGE_KEY)));
}

export function saveWorkspace(workspace: AppState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}
