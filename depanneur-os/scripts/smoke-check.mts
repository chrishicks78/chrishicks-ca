// @ts-expect-error helper script executed with tsx
const ops = await import("../src/lib/ops-data.ts");
// @ts-expect-error helper script executed with tsx
const store = await import("../src/lib/local-store.ts");

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const base = ops.buildDefaultState("en");
assert(base.theme === "day", "Default theme should be day");
assert(base.audio.trackId === "investigation", "Default soundtrack should lead with investigation");
assert(base.activeView === "overview", "Default active view should be overview");

const hopper = ops.runMockHopper("Sold 40 cash, spent 120 at Costco, need 2 cases Molson, fridge compressor relay");
assert(hopper.raw.length > 0, "Hopper should preserve raw input");
assert(hopper.inventory.length > 0, "Hopper should parse inventory signals");
assert(hopper.delivery.length > 0, "Hopper should parse delivery signals");
assert(hopper.maintenance.length > 0, "Hopper should parse maintenance signals");

const sourcing = ops.runSourcingAgent("Beer fridge compressor broken and cooler light out");
assert(sourcing.issue.length > 0, "Sourcing plan should keep the issue title");
assert(sourcing.loop.length >= 3, "Sourcing plan should include troubleshooting steps");
assert(sourcing.localSources.length > 0, "Sourcing plan should include local sources");
assert(sourcing.revenueMoves.length > 0, "Sourcing plan should include revenue guidance");

const hydrated = store.hydrateWorkspace("fr", {
  locale: "fr",
  money: {
    cashSales: 99,
    cardSales: 0,
    supplierSpend: 0,
    wageSpend: 0,
    repairFund: 0,
    savingsTarget: 0,
  },
  inventory: [
    {
      id: "beer-cooler",
      onHand: 3,
      parLevel: 10,
      unitCost: 22,
      shelfPrice: 32,
      barcode: "beer-test",
      note: "test",
    },
  ],
});

assert(hydrated.locale === "fr", "Hydration should keep the requested locale");
assert(hydrated.theme === "day", "Hydration should fall back to day theme");
assert(hydrated.money.cashSales === 99, "Hydration should merge money state");
assert(hydrated.inventory.some((item) => item.id === "beer-cooler" && item.onHand === 3), "Hydration should merge inventory by id");

const calendar = ops.buildHeartbeatCalendar(base);
assert(calendar.includes("BEGIN:VCALENDAR"), "Calendar export should produce VCALENDAR");
assert(calendar.includes("MAPAQ"), "Calendar export should include compliance items");

console.log("smoke-check: ok");
