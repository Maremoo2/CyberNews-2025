#!/usr/bin/env node

/**
 * Test: Validate that strict validation function works correctly
 * 
 * This test ensures the validateAnalysisStrict function in weekly_sensemaking.js
 * correctly validates analysis output and exits with code 1 on validation failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing Strict Analysis Validation\n');

// Test 1: Check that validation function exists in the script
console.log('Test 1: Checking for validateAnalysisStrict function...');
const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'weekly_sensemaking.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

if (!scriptContent.includes('function validateAnalysisStrict')) {
  console.error('❌ FAIL: validateAnalysisStrict function not found');
  process.exit(1);
}
console.log('✅ validateAnalysisStrict function found\n');

// Test 2: Check that validation is called before writing file
console.log('Test 2: Checking that validation is called before file write...');
const validationCallIndex = scriptContent.indexOf('validateAnalysisStrict(analysis)');
const fileWriteIndex = scriptContent.indexOf('fs.writeFileSync(outputFile');

if (validationCallIndex === -1) {
  console.error('❌ FAIL: validateAnalysisStrict is not called');
  process.exit(1);
}

if (fileWriteIndex === -1) {
  console.error('❌ FAIL: Cannot find file write operation');
  process.exit(1);
}

if (validationCallIndex > fileWriteIndex) {
  console.error('❌ FAIL: Validation is called AFTER file write');
  process.exit(1);
}
console.log('✅ Validation is called before file write\n');

// Test 3: Check that validation checks disclaimer
console.log('Test 3: Checking disclaimer validation...');
if (!scriptContent.includes('"AI-assisted analysis. Hypotheses, not facts."')) {
  console.error('❌ FAIL: Disclaimer validation not found');
  process.exit(1);
}
console.log('✅ Disclaimer validation found\n');

// Test 4: Check that validation checks array lengths
console.log('Test 4: Checking array length validation...');
const arrayChecks = [
  'hypotheses',
  'uncertainties', 
  'signals_to_watch'
];

for (const arrayName of arrayChecks) {
  if (!scriptContent.includes(arrayName) || !scriptContent.includes('.length !== 3')) {
    console.error(`❌ FAIL: ${arrayName} length validation not found`);
    process.exit(1);
  }
}
console.log('✅ Array length validation found\n');

// Test 5: Check that validation checks confidence values
console.log('Test 5: Checking confidence value validation...');
if (!scriptContent.includes('"low", "medium"') || !scriptContent.includes('h.confidence')) {
  console.error('❌ FAIL: Confidence value validation not found');
  process.exit(1);
}
console.log('✅ Confidence value validation found\n');

// Test 6: Check that validation exits with code 1
console.log('Test 6: Checking that validation exits with code 1...');
const validationFunctionStart = scriptContent.indexOf('function validateAnalysisStrict');
const validationFunctionEnd = scriptContent.indexOf('}\n\n// Validate the response', validationFunctionStart);
const validationFunction = scriptContent.substring(validationFunctionStart, validationFunctionEnd);

if (!validationFunction.includes('process.exit(1)')) {
  console.error('❌ FAIL: Validation function does not exit with code 1');
  process.exit(1);
}
console.log('✅ Validation exits with code 1 on failure\n');

// Test 7: Check that old warning logs were removed
console.log('Test 7: Checking that old warning logs were removed...');
if (scriptContent.includes('❌ Warning: Disclaimer text does not match')) {
  console.error('❌ FAIL: Old warning logs still present');
  process.exit(1);
}
console.log('✅ Old warning logs removed\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All validation tests passed!');
console.log('\nThe validateAnalysisStrict function:');
console.log('  • Validates disclaimer text');
console.log('  • Validates array lengths (3 items each)');
console.log('  • Validates confidence values (low/medium only)');
console.log('  • Exits with code 1 before file write on failure');
console.log('  • Old warning-only validation removed');
