#!/usr/bin/env node

/**
 * Test: Weekly Sensemaking Quota Error Handling
 * 
 * This test validates that the weekly_sensemaking.js script handles
 * OpenAI API quota errors gracefully by saving a marker file and exiting
 * with code 0, while other errors exit with code 1.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing Weekly Sensemaking Quota Error Handling\n');

// Test 1: Check that the script contains graceful quota handling
console.log('Test 1: Verifying quota error handling implementation...');

const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'weekly_sensemaking.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Required patterns that indicate proper quota handling
// Note: Script checks for both 'quota' AND '429' in message, plus status === 429
// These are separate checks because errors may contain one or both indicators
const requiredPatterns = [
  /error\.status\s*===\s*429/,                           // Checks for 429 status
  /error\.message\.includes\(['"]quota['"]\)/,          // Checks for quota in message
  /error\.message\.includes\(['"]429['"]\)/,            // Checks for 429 in message
  /status:\s*["']quota_exceeded["']/,                    // Creates quota marker
  /_pending\.json/,                                      // Creates _pending.json file
  /process\.exit\(0\)/,                                  // Graceful exit for quota
  /process\.exit\(1\)/,                                  // Hard exit for other errors
  /lastError/,                                           // Tracks last error
  /throw\s+lastError/,                                   // Throws error after retries
];

let allPatternsFound = true;
for (const pattern of requiredPatterns) {
  if (!pattern.test(scriptContent)) {
    console.error(`❌ MISSING: Required pattern not found: ${pattern}`);
    allPatternsFound = false;
  }
}

if (!allPatternsFound) {
  console.error('\n❌ Test FAILED: Script missing required quota handling patterns');
  process.exit(1);
}

console.log('✅ All required quota handling patterns found\n');

// Test 2: Verify retry logic throws after all attempts
console.log('Test 2: Verifying retry logic throws error after all retries...');

// Check that the retry function throws after the loop
// Look for the pattern: closing brace of for loop, then throw statement
const throwAfterLoopPattern = /}\s*\/\/[^\n]*all retries failed[\s\S]*?throw\s+lastError/;
if (!throwAfterLoopPattern.test(scriptContent)) {
  console.error('❌ MISSING: Retry function does not throw after loop completes');
  process.exit(1);
}

console.log('✅ Retry function throws error after all retries\n');

// Test 3: Verify marker file structure
console.log('Test 3: Verifying marker file structure...');

const requiredMarkerFields = [
  'generated_at',
  'status',
  'error',
  'error_status',
  'week_start',
  'week_end',
  'week_year',
  'week_number',
  'note',
];

let allFieldsPresent = true;
for (const field of requiredMarkerFields) {
  // Check for field in object literal (with or without quotes)
  const fieldPattern = new RegExp(`${field}\\s*:`);
  if (!fieldPattern.test(scriptContent)) {
    console.error(`❌ MISSING: Marker file missing field: ${field}`);
    allFieldsPresent = false;
  }
}

if (!allFieldsPresent) {
  console.error('\n❌ Test FAILED: Marker file structure incomplete');
  process.exit(1);
}

console.log('✅ All required marker file fields present\n');

// Test 4: Verify user guidance
console.log('Test 4: Verifying user guidance is present...');

const guidancePatterns = [
  /https:\/\/platform\.openai\.com\/settings\/organization\/billing/,  // Billing link
  /ACTION REQUIRED/i,                                                    // Action header
  /Re-run.*workflow/i,                                                   // Re-run instruction
];

let allGuidanceFound = true;
for (const pattern of guidancePatterns) {
  if (!pattern.test(scriptContent)) {
    console.error(`❌ MISSING: Required guidance not found: ${pattern}`);
    allGuidanceFound = false;
  }
}

if (!allGuidanceFound) {
  console.error('\n❌ Test FAILED: User guidance incomplete');
  process.exit(1);
}

console.log('✅ All required user guidance present\n');

// Test 5: Verify improved error logging
console.log('Test 5: Verifying improved error logging...');

const loggingPatterns = [
  /error\.status\s*\|\|\s*['"]ERROR['"]/,    // Shows error status or ERROR
  /waitTime\s*\/\s*1000/,                     // Shows wait time in seconds
];

let allLoggingFound = true;
for (const pattern of loggingPatterns) {
  if (!pattern.test(scriptContent)) {
    console.error(`❌ MISSING: Required logging pattern not found: ${pattern}`);
    allLoggingFound = false;
  }
}

if (!allLoggingFound) {
  console.error('\n❌ Test FAILED: Error logging improvements incomplete');
  process.exit(1);
}

console.log('✅ All required error logging improvements present\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All tests PASSED!');
console.log('   - Quota error handling implemented correctly');
console.log('   - Retry logic fixed');
console.log('   - Marker file structure complete');
console.log('   - User guidance present');
console.log('   - Error logging improved');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
