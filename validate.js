#!/usr/bin/env node

const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const fs = require('fs');

const ajv = new Ajv({
  strict: true,
  allErrors: true,
  allowUnionTypes: true
});
addFormats(ajv);

// Load schemas
const protocolSchema = JSON.parse(fs.readFileSync('nova.protocol.schema.json', 'utf8'));
const instanceSchema = JSON.parse(fs.readFileSync('nova.instance.schema.json', 'utf8'));
const manifestSchema = JSON.parse(fs.readFileSync('nova.capability.manifest.schema.json', 'utf8'));

// Load data
const instanceData = JSON.parse(fs.readFileSync('nova.instance.chris.json', 'utf8'));
const manifestData = JSON.parse(fs.readFileSync('nova.capability.manifest.json', 'utf8'));

let hasErrors = false;

// Validate instance
console.log('Validating instance...');
ajv.addSchema(protocolSchema);
const validateInstance = ajv.compile(instanceSchema);
if (!validateInstance(instanceData)) {
  console.error('Instance validation failed:');
  console.error(JSON.stringify(validateInstance.errors, null, 2));
  hasErrors = true;
} else {
  console.log('✓ Instance valid');
}

// Validate manifest
console.log('Validating manifest...');
const validateManifest = ajv.compile(manifestSchema);
if (!validateManifest(manifestData)) {
  console.error('Manifest validation failed:');
  console.error(JSON.stringify(validateManifest.errors, null, 2));
  hasErrors = true;
} else {
  console.log('✓ Manifest valid');
}

if (hasErrors) {
  process.exit(1);
}
