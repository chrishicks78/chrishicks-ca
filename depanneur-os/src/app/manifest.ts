import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/en",
    name: "Lydia's Dépanneur OS",
    short_name: "Lydia OS",
    description:
      "A local-first depanneur operating system for Lydia's in NDG, with sourcing, money control, wife mode, and Quebec heartbeat reminders.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#09111c",
    theme_color: "#7bb37a",
    lang: "en",
    categories: ["business", "productivity", "utilities"],
    shortcuts: [
      {
        name: "Money board",
        short_name: "Money",
        description: "Open the owner's revenue-first board.",
        url: "/en#overview",
      },
      {
        name: "Sourcing agent",
        short_name: "Sourcing",
        description: "Open Montreal DIY sourcing and repair planning.",
        url: "/en#sourcing",
      },
      {
        name: "Intake hopper",
        short_name: "Hopper",
        description: "Open the chaotic intake parser and clean handoff board.",
        url: "/en#hopper",
      },
      {
        name: "Compliance",
        short_name: "Heartbeat",
        description: "Open Quebec compliance and supplier rhythm reminders.",
        url: "/en#compliance",
      },
    ],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
