# LyraPrint + OpenClaw Integration — Feasibility Plan

**Date:** 2026-04-03
**Author:** Engineering (Claude Code Session)
**Status:** FEASIBLE — Recommended for Implementation
**Owner:** Chris Hicks

---

## 1. Executive Summary

LyraPrint is the proposed unified print/design management system that extends
the existing chrishicks-ca platform. This feasibility study evaluates
integrating **OpenClaw** (formerly Clawd/Clawdbot) — the open-source personal
AI assistant with 247K+ GitHub stars — as the conversational interface and
automation backbone for LyraPrint.

**Verdict: FEASIBLE.** OpenClaw's MIT license, Skills marketplace, multi-platform
messaging support, and local-first architecture align with LyraPrint's needs.
The NOVA Guardian protocol already provides the persona and safety layer; OpenClaw
provides the execution and channel reach.

---

## 2. What is OpenClaw?

| Attribute | Detail |
|-----------|--------|
| **Name** | OpenClaw (formerly Clawdbot, then Moltbot) |
| **Creator** | Peter Steinberger (@steipete) |
| **License** | MIT — fully free, no vendor lock-in |
| **GitHub Stars** | 247,000+ |
| **Architecture** | Local-first, Gateway API on localhost:18789 |
| **LLM Support** | Claude (Anthropic), GPT (OpenAI), DeepSeek, any OpenRouter model |
| **Messaging** | WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams, IRC, Matrix, Google Chat, LINE, Feishu, Mattermost |
| **Extension Model** | Skills (SKILL.md), Plugins (TS/JS), Webhooks |
| **Marketplace** | Claw Hub — 3,286+ verified skills |

---

## 3. What is LyraPrint?

LyraPrint is the new standard platform combining:

- **Print Order Management** — intake, quoting, production tracking, delivery
- **Design Asset Pipeline** — file upload, proofing, approval workflows
- **Customer Communication** — multi-channel (WhatsApp, Telegram, Discord, email)
- **NOVA Guardian Integration** — persona-driven interactions with safety guardrails
- **Depanneur OS Bridge** — shared inventory/financial tracking where applicable

---

## 4. Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CUSTOMER CHANNELS                 │
│  WhatsApp · Telegram · Discord · Slack · Web Chat   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│              OPENCLAW GATEWAY (localhost:18789)       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ LyraPrint   │  │ NOVA Bridge  │  │ Depanneur  │  │
│  │ Skill       │  │ Skill        │  │ Skill      │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                │                 │         │
│         ▼                ▼                 ▼         │
│  ┌─────────────────────────────────────────────────┐ │
│  │            SKILL ROUTER / ORCHESTRATOR          │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────┘
                       │
         ┌─────────────┼──────────────┐
         ▼             ▼              ▼
┌──────────────┐ ┌───────────┐ ┌────────────────┐
│ LyraPrint    │ │ NOVA      │ │ Anthropic      │
│ Order DB     │ │ Protocol  │ │ Claude API     │
│ (SQLite/PG)  │ │ Resolver  │ │ (LLM Backend)  │
└──────────────┘ └───────────┘ └────────────────┘
```

---

## 5. Feasibility Assessment

### 5.1 Technical Feasibility — HIGH

| Factor | Assessment | Risk |
|--------|-----------|------|
| OpenClaw runs locally | Matches CA-only data residency requirement | LOW |
| MIT license | No legal barriers, full modification rights | NONE |
| Skills API is SKILL.md (natural language) | Easy to author, no compiled SDK needed | LOW |
| Claude as LLM backend | Already declared in capability manifest | NONE |
| Multi-channel messaging | 12+ platforms out of the box | LOW |
| Webhook support | Can receive order events from external systems | LOW |
| Gateway REST API | Standard HTTP, Bearer auth | LOW |

### 5.2 Operational Feasibility — HIGH

| Factor | Assessment | Risk |
|--------|-----------|------|
| Self-hosted (no cloud dependency) | Full control, CA data residency | LOW |
| Claw Hub marketplace | Pre-built skills for CRM, file handling, web automation | LOW |
| NOVA persona compatibility | OpenClaw passes prompts to LLM; NOVA system prompt layers on top | LOW |
| Offline capability | Gateway runs locally; PWA (Depanneur) already offline-first | MEDIUM |

### 5.3 Cost Feasibility — HIGH

| Item | Cost |
|------|------|
| OpenClaw software | $0 (MIT license) |
| Claude API usage | Pay-per-token (Anthropic pricing) |
| Hosting (Gateway) | $0 (runs on existing machine) |
| Development effort | ~40-60 hours for MVP |
| Maintenance | Low — skills are text files, not compiled code |

### 5.4 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OpenClaw API breaking changes | Medium | Medium | Pin to stable release; test in CI |
| Claw Hub skill supply chain attack (ClawHavoc precedent) | Low | High | Only use verified skills; audit SKILL.md files |
| LLM hallucination in order processing | Medium | High | NOVA guardrails + confirmation flows |
| WhatsApp Business API compliance | Medium | Medium | Use official WhatsApp Business channel |

---

## 6. Scope Plan — MVP (Phase 1)

### Deliverables

1. **LyraPrint OpenClaw Skill** (`SKILL.md`)
   - Order intake via natural language
   - Quote generation
   - Status inquiries
   - Design file upload handling

2. **NOVA Bridge Skill** (`SKILL.md`)
   - Connects OpenClaw to NOVA Guardian persona
   - Applies guardrails to all LyraPrint interactions
   - Runs intake/analysis/reflection rituals

3. **Gateway Configuration** (`gateway.config.json`)
   - Channel routing (WhatsApp, Telegram, Discord)
   - Authentication setup
   - LLM backend configuration (Claude)

4. **Order Schema** (`order.schema.json`)
   - Structured order data model
   - Status tracking states
   - Customer information (redaction-safe)

### Phase 2 (Future)
- Google Drive integration for document retrieval (Lyra Brain / Legal folders)
- Automated proofing workflow with image OCR
- Depanneur OS inventory cross-reference
- Financial reporting dashboard

---

## 7. Google Drive Integration Note

**Current Status:** No Google Drive API access exists in the codebase.

**Recommendation for Lyra Brain + Legal folder access:**
1. Set up Google Drive API OAuth2 credentials (Google Cloud Console)
2. Create an OpenClaw Skill that wraps the Drive API for document retrieval
3. Pipe retrieved documents through NOVA's IMemoryCompressor (OCR) and IRetriever (vector search)
4. This enables the "Lyra Brain" folder to become the knowledge base and the "Legal" folder to feed the advocacy documentation pipeline

**This is Phase 2 work** — requires Google Cloud project setup and OAuth consent screen approval.

---

## 8. Decision

**RECOMMENDED: Proceed with implementation.**

The integration is technically sound, operationally viable, cost-effective, and
strategically aligned with the existing NOVA protocol architecture. OpenClaw
provides the missing execution layer — multi-channel messaging, automation,
and a skills ecosystem — that turns the NOVA Guardian persona from a schema
into a live, interactive system.

---

*Generated by Claude Code Engineering Session — 2026-04-03*
