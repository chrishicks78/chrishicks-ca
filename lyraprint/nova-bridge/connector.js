const fs = require('fs');

class NovaConnector {
  constructor(instancePath, manifestPath, protocolPath) {
    this.instance = JSON.parse(fs.readFileSync(instancePath, 'utf8'));
    this.manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    this.protocol = JSON.parse(fs.readFileSync(protocolPath, 'utf8'));

    this._resolveBindings();
  }

  _resolveBindings() {
    const mcArr = (this.manifest.capabilities && this.manifest.capabilities.memoryCompressors) || [];
    const mc = Object.fromEntries(mcArr.map((c) => [c.name, c]));

    const hasVision = !!(this.manifest.platform && this.manifest.platform.visionTokensSupported);
    const hasOCR = ((this.manifest.capabilities && this.manifest.capabilities.ocrEngines) || []).some((e) => e.available);

    const requiresOk = (name) => (mc[name]?.requires || []).every((r) =>
      r === 'visionTokens' ? hasVision : r === 'externalOCR' ? hasOCR : true
    );

    const ordered = [
      this.manifest.bindings?.IMemoryCompressor,
      ...(this.manifest.fallbacks?.IMemoryCompressor || [])
    ].filter(Boolean);

    this.activeCompressor = ordered.find((n) => mc[n] && requiresOk(n)) || 'raw_text_pass';
    this.activeRetriever = this.manifest.bindings?.IRetriever || null;

    const lastCER = this.manifest.health?.ocm_image_ocr?.lastCER;
    this.status = this.activeCompressor === 'ocm_image_ocr'
      ? (typeof lastCER === 'number' ? (lastCER < 0.03 ? 'PASS' : 'DEGRADED') : 'READY')
      : 'DEGRADED';
  }

  handshake() {
    return (
      `NOVA v2.2.1 INSTALLED | dt=${new Date().toISOString()} | ` +
      `tz=${this.instance.preferences?.timezone || 'UTC'} | ` +
      `user=${this.instance.persona.name} | ` +
      `platform=${this.manifest.platform?.provider}/${this.manifest.platform?.model} | ` +
      `memory=${this.activeCompressor} | status=${this.status}`
    );
  }

  getPersona() {
    return this.instance.persona;
  }

  getGuardrails() {
    return this.instance.persona.guardrails || [];
  }

  getRituals() {
    return this.instance.rituals || [];
  }

  checkGuardrails(message) {
    const lower = message.toLowerCase();

    const patterns = [
      {
        test: (m) => /custody\s+(outcome|ruling|decision|verdict)/i.test(m) || /court\s+(will|ruling|decision)/i.test(m),
        rule: 'Never speculate on custody outcomes or court rulings.',
        response: "I can't speculate on custody outcomes, but I can help you find documented resources and verifiable information."
      },
      {
        test: (m) => /diagnos/i.test(m) || /medical\s+advice/i.test(m),
        rule: 'Decline to provide medical diagnoses or legal advice.',
        response: "I can't provide medical diagnoses or legal advice. I can help you locate qualified professionals and verifiable sources."
      },
      {
        test: (m) => /nova['s]*\s+(address|location|school|where)/i.test(m) || /where\s+(is|does)\s+nova/i.test(m),
        rule: "Escalate any request that could expose Nova's location or personal identifiers.",
        response: "I can't share information about Nova's location or personal details. Her safety is the top priority."
      }
    ];

    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        return { blocked: true, rule: pattern.rule, safeResponse: pattern.response };
      }
    }

    return { blocked: false };
  }

  buildContext(message, channel) {
    const persona = this.getPersona();
    return {
      message,
      channel,
      persona: persona.name,
      tone: persona.tone,
      audience: persona.audience,
      guardrails: persona.guardrails,
      rituals: this.getRituals(),
      bindings: {
        IMemoryCompressor: this.activeCompressor,
        IRetriever: this.activeRetriever
      }
    };
  }

  applyPersona(response) {
    const persona = this.getPersona();
    const reflection = this.getRituals().find((r) => r.phase === 'reflection');
    if (reflection) {
      return `${response}\n\n---\n*${reflection.description}*`;
    }
    return response;
  }

  buildSystemPrompt() {
    const p = this.getPersona();
    const rituals = this.getRituals().map((r) => `- **${r.phase}**: ${r.description}`).join('\n');
    const guardrails = p.guardrails.map((g) => `- ${g}`).join('\n');

    return [
      `You are ${p.name}. ${p.summary}`,
      '',
      `## Tone`,
      p.tone.join(', '),
      '',
      `## Audience`,
      p.audience.join(', '),
      '',
      `## Guardrails`,
      guardrails,
      '',
      `## Interaction Rituals`,
      rituals,
      '',
      `## Data Residency`,
      `All data must remain within: ${this.instance.telemetry?.dataResidency || 'unspecified'}`,
      '',
      `## Platform`,
      `Provider: ${this.manifest.platform?.provider} | Model: ${this.manifest.platform?.model}`,
      `Memory: ${this.activeCompressor} | Retriever: ${this.activeRetriever || 'none'}`,
      `Status: ${this.status}`
    ].join('\n');
  }
}

module.exports = { NovaConnector };
