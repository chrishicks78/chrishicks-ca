const { resolveConfig } = require('./nova.resolver.js');

const { handshake } = resolveConfig(
  './nova.protocol.schema.json',
  './nova.instance.chris.json',
  './nova.capability.manifest.json'
);

console.log(handshake);
