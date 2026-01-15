# NOVA Protocol Implementation

This repository implements the NOVA protocol for AI-assisted personal knowledge management and client discovery. It includes schema validation, capability manifest management, and the **Lyra Nova** AI collaboration protocol.

## Quick Start

```bash
# Validate the protocol implementation
npm run validate

# Or run directly
./ci-validate.sh
```

## Components

### Core NOVA Implementation

- **`nova.protocol.schema.json`** - Defines the NOVA protocol interfaces and compliance rules
- **`nova.capability.manifest.json`** - Declares available capabilities (memory compressors, OCR engines, etc.)
- **`nova.capability.manifest.schema.json`** - Schema for capability manifests
- **`nova.instance.chris.json`** - Personal instance configuration
- **`nova.instance.schema.json`** - Schema for instance configurations
- **`nova.resolver.js`** - Configuration resolver that binds capabilities to instance requirements
- **`resolver-run.js`** - CLI runner for the resolver

### Lyra Nova AI Protocol

The **Lyra Nova Protocol** is a comprehensive framework for working with AI assistants (ChatGPT, Claude, Gemini) that emphasizes:

- **Truth discipline** (anti-hallucination via evidence labeling)
- **High-fidelity memory** (CONTEXT VAULT + semantic compression)
- **High EQ** (emotionally attuned, adaptive tone)
- **Forensics mode** (detailed evidence logging)
- **Agentic coding** (Ralph Loop for reliable iteration)

**Documentation:**

- [`LYRA_NOVA_PROTOCOL.md`](./LYRA_NOVA_PROTOCOL.md) - Master verbose protocol
- [`docs/protocol-variants/`](./docs/protocol-variants/) - Platform-specific variants:
  - `CHATGPT_CUSTOM_INSTRUCTIONS.md` - Copy-paste ready for ChatGPT (1500 char limit)
  - `GEMINI_SAVED_INFO.md` - Saved Info cards for Gemini
  - `CLAUDE_PROJECT.md` - Project instructions for Claude
  - `lyra_nova_protocol.json` - Machine-readable JSON specification
  - `lyra_nova_protocol.py` - Python implementation with sticky memory scaffolding

## Protocol Validation

The CI validation script ensures:

1. JSON schema files are valid
2. Instance and manifest files conform to their schemas
3. The resolver successfully binds capabilities
4. A valid handshake is generated

```bash
./ci-validate.sh
```

## NOVA Handshake

The resolver generates a handshake string that summarizes the active configuration:

```
NOVA v2.2.1 INSTALLED | dt=<timestamp> | tz=America/Toronto |
user=Chris | platform=<provider>/<model> | memory=<compressor> |
cer=<character_error_rate> | status=<PASS|DEGRADED|READY>
```

## File Structure

```
.
├── LYRA_NOVA_PROTOCOL.md          # Master AI protocol
├── README.md                       # This file
├── ci-validate.sh                  # Validation script
├── docs/
│   └── protocol-variants/          # Platform-specific AI instructions
│       ├── CHATGPT_CUSTOM_INSTRUCTIONS.md
│       ├── CLAUDE_PROJECT.md
│       ├── GEMINI_SAVED_INFO.md
│       ├── lyra_nova_protocol.json
│       └── lyra_nova_protocol.py
├── index.html                      # Landing page
├── nova.capability.manifest.json   # Capabilities declaration
├── nova.capability.manifest.schema.json
├── nova.instance.chris.json        # Personal instance config
├── nova.instance.schema.json
├── nova.protocol.schema.json       # Protocol definition
├── nova.resolver.js                # Configuration resolver
├── package.json
└── resolver-run.js                 # Resolver CLI
```

## Recent Changes

### 2026-01-15

- **Bug fix**: Removed unused protocol file parsing in `nova.resolver.js:4` that was causing wasteful file I/O
- **Protocol upgrade**: Added comprehensive Lyra Nova protocol documentation
  - Created master protocol document
  - Added platform-specific variants (ChatGPT, Claude, Gemini)
  - Included JSON and Python machine-readable implementations

## Development

The resolver validates that:

- Required memory compressor capabilities are declared
- Bindings reference declared capabilities
- Platform requirements (vision tokens, external OCR) are met
- Fallback chains are properly configured

## License

Private repository - Chris Hicks © 2026

## Contact

- **Author**: Chris Hicks
- **Location**: Montréal/Toronto, Canada
- **Website**: https://chrishicks.ca
