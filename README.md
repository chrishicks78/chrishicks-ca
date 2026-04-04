# chrishicks-ca

Personal GitHub Pages site hosting a parental-rights advocacy platform, the NOVA Protocol system, and Lydia's Depanneur OS.

## Projects

### Advocacy Site (`index.html`)

Static HTML site for Chris Hicks' advocacy work as a father fighting for his daughter Nova. No build step — served directly via GitHub Pages.

### NOVA Protocol

NOVA — named after Chris's daughter — is a configuration-as-code system that shapes how an AI assistant behaves when advocating on her behalf. It enforces persona guardrails, memory capabilities, and safety constraints through validated JSON schemas.

The system has three layers:

| Layer | Files | Role |
|-------|-------|------|
| **Protocol** | `nova.protocol.schema.json` | Defines interface contracts (`IMemoryCompressor`, `IRetriever`) and reusable types (persona, ritual) |
| **Instance** | `nova.instance.chris.json` + `nova.instance.schema.json` | Concrete persona config: who Chris is, his tone, audience, guardrails, and preferred interface bindings |
| **Manifest** | `nova.capability.manifest.json` + `nova.capability.manifest.schema.json` | Runtime truth: what the platform actually supports, health status, and fallback chains |

The **resolver** (`nova.resolver.js`) reconciles what the instance *wants* with what the platform *can do*, producing a handshake status line.

### Lydia's Depanneur OS (`depanneur-os/`)

Progressive Web App for corner store management in NDG, Montreal. This directory contains pre-built Vite output deployed via GitHub Pages. See [`depanneur-os/README.md`](depanneur-os/README.md) for details.

## Key Concepts

### Bindings

The protocol defines two interfaces that an instance can bind to platform-specific implementations:

- **IMemoryCompressor** — How the AI compresses and stores conversation memory. Two implementations exist:
  - `ocm_image_ocr` — Encodes text as images and reads back via OCR (requires vision tokens + external OCR engine)
  - `raw_text_pass` — Plain text passthrough, no compression (always available as fallback)
- **IRetriever** — How the AI retrieves stored knowledge. Currently: `vector_guardian_v1`

### Resolver Algorithm

1. Load and validate protocol, instance config, and capability manifest
2. Detect platform capabilities: vision token support and OCR engine availability
3. Build an ordered preference list: primary binding first, then each fallback
4. Select the first binding whose requirements are satisfied; default to `raw_text_pass`
5. Compute health status based on CER
6. Emit a handshake string for CI verification

### Status Codes

| Status | Meaning |
|--------|---------|
| **PASS** | `ocm_image_ocr` is active and its last CER is below 0.03 |
| **READY** | `ocm_image_ocr` is active but has not been tested yet (CER is null) |
| **DEGRADED** | A fallback compressor is active, or CER exceeds the threshold |

### CER (Character Error Rate)

Industry-standard OCR accuracy metric — the fraction of characters incorrectly recognized. The threshold of **0.03** means the system requires **97% accuracy** to consider OCR healthy. Tested by encoding one page, decoding via OCR, and comparing.

## File Map

| File | Purpose |
|------|---------|
| `index.html` | Advocacy website homepage |
| `nova.protocol.schema.json` | NOVA Protocol interface specification |
| `nova.instance.schema.json` | Instance configuration schema |
| `nova.instance.chris.json` | Chris Hicks persona instance |
| `nova.capability.manifest.schema.json` | Capability manifest schema |
| `nova.capability.manifest.json` | Runtime platform capabilities |
| `nova.resolver.js` | Reconciles instance config with platform capabilities |
| `resolver-run.js` | Entry point — runs resolver and prints handshake |
| `ci-validate.sh` | Local CI script with graceful fallbacks |
| `.github/workflows/ci.yml` | GitHub Actions workflow |
| `depanneur-os/` | Lydia's Depanneur OS PWA (pre-built) |

## Running Locally

```bash
npm install

npm run validate:instance   # Validate instance config against schema
npm run validate:manifest   # Validate capability manifest against schema
npm run resolve             # Run resolver, print handshake line
npm run ci                  # All of the above in sequence
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request:

1. Installs dependencies (Node 20)
2. Validates both JSON schemas with [ajv](https://ajv.js.org/)
3. Runs the resolver and captures the handshake output
4. Verifies the handshake contains a valid status code (`PASS`, `READY`, or `DEGRADED`)
