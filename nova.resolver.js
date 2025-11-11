const fs = require('fs');

function resolveConfig(protocolPath, instancePath, manifestPath) {
  JSON.parse(fs.readFileSync(protocolPath, 'utf8'));

  const cfg = JSON.parse(fs.readFileSync(instancePath, 'utf8'));
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const mcArr = (m.capabilities && m.capabilities.memoryCompressors) || [];
  const mc = Object.fromEntries(mcArr.map((c) => [c.name, c]));

  const hasVision = !!(m.platform && m.platform.visionTokensSupported);
  const hasOCR = ((m.capabilities && m.capabilities.ocrEngines) || []).some((e) => e.available);

  const requiresOk = (name) => (mc[name]?.requires || []).every((r) =>
    r === 'visionTokens' ? hasVision : r === 'externalOCR' ? hasOCR : true
  );

  const ordered = [m.bindings?.IMemoryCompressor, ...(m.fallbacks?.IMemoryCompressor || [])].filter(Boolean);
  const primary = ordered.find((n) => mc[n] && requiresOk(n)) || 'raw_text_pass';

  if (!mc[primary] && primary !== 'raw_text_pass') {
    throw new Error(`Binding error: ${primary} not declared in capabilities.memoryCompressors`);
  }

  const lastCER = m.health?.ocm_image_ocr?.lastCER;
  const status = primary === 'ocm_image_ocr'
    ? (typeof lastCER === 'number' ? (lastCER < 0.03 ? 'PASS' : 'DEGRADED') : 'READY')
    : 'DEGRADED';

  const active = {
    ...cfg,
    $activeBindings: { IMemoryCompressor: primary, IRetriever: m.bindings?.IRetriever },
    $fallbackChain: m.fallbacks?.IMemoryCompressor || []
  };

  const handshake =
    `NOVA v2.2.1 INSTALLED | dt=${new Date().toISOString()} | tz=America/Toronto | ` +
    `user=Chris | platform=${m.platform?.provider}/${m.platform?.model} | ` +
    `memory=${primary} | cer=${typeof lastCER === 'number' ? lastCER : 'N/A'} | status=${status}`;

  return { config: active, handshake };
}

module.exports = { resolveConfig };
