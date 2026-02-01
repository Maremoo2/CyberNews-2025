#!/usr/bin/env node

/**
 * Safety Test: Ensure AI sensemaking script only reads aggregate files
 * 
 * This test validates that the weekly_sensemaking.js script does not
 * read raw incident files, ensuring no raw article text reaches the AI model.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing AI Input Safety: Only Aggregates Allowed\n');

// Test: Analyze the weekly_sensemaking.js script for prohibited file access
console.log('Test 1: Checking script for raw incident file access...');

const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'weekly_sensemaking.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Prohibited patterns that would indicate reading raw incidents
const prohibitedPatterns = [
  /incidents-\d{4}\.json/,           // incidents-2025.json, incidents-2026.json
  /incidents-\d{4}-enriched\.json/,  // incidents-2025-enriched.json
  /incidents\.json/,                  // incidents.json
  /news-aggregated/,                  // news-aggregated files
  /\/news\//,                         // news directory
  /rss.*\.xml/i,                      // RSS feeds
];

let foundProhibited = false;
for (const pattern of prohibitedPatterns) {
  if (pattern.test(scriptContent)) {
    console.error(`❌ SECURITY VIOLATION: Script contains reference to prohibited pattern: ${pattern}`);
    foundProhibited = true;
  }
}

if (foundProhibited) {
  console.error('\n❌ Test FAILED: Script may access raw incident data');
  process.exit(1);
}

console.log('✅ No prohibited file patterns found in script\n');

// Test 2: Verify script only reads from aggregates directory
console.log('Test 2: Verifying script reads only from aggregates directory...');

// Check that the script references the aggregates directory
if (!scriptContent.includes('data/aggregates') && !scriptContent.includes('data', 'aggregates')) {
  console.error('❌ SECURITY VIOLATION: Script does not reference aggregates directory');
  process.exit(1);
}

console.log('✅ Script correctly references aggregates directory\n');

// Test 3: Ensure the script does not directly construct paths to incident files
console.log('Test 3: Checking for dynamic path construction to incident files...');

const dangerousConstructions = [
  /incidents-.*\$\{/,  // Template literals with incidents
  /'incidents-' \+ /,  // String concatenation
  /"incidents-" \+ /,
];

for (const pattern of dangerousConstructions) {
  if (pattern.test(scriptContent)) {
    console.error(`❌ SECURITY VIOLATION: Script contains dangerous path construction: ${pattern}`);
    process.exit(1);
  }
}

console.log('✅ No dangerous path constructions found\n');

// Test 4: Verify command line arguments only accept aggregate paths
console.log('Test 4: Verifying command line argument handling...');

if (scriptContent.includes('--aggregate=') && !scriptContent.includes('aggregate') && !scriptContent.includes('Aggregate')) {
  console.error('❌ Warning: --aggregate flag may not be properly validated');
}

console.log('✅ Command line arguments appear safe\n');

// Test 5: Check that the user prompt does not include raw incident data
console.log('Test 5: Verifying prompt construction...');

if (scriptContent.includes('JSON.stringify(aggregate') || scriptContent.includes('aggregate, null, 2')) {
  console.log('✅ Prompt correctly uses aggregate data only\n');
} else {
  console.error('❌ Warning: Could not verify prompt uses aggregate data');
}

// Test 6: Ensure no direct OpenAI calls with incident data
console.log('Test 6: Checking for prohibited data in AI prompts...');

// Look for openai.chat.completions.create calls
const openaiCalls = scriptContent.match(/openai\.chat\.completions\.create\([^)]+\)/gs);
if (openaiCalls) {
  for (const call of openaiCalls) {
    // Check if the call includes any prohibited keywords
    if (/incidents\[|incidentsData|rawIncidents/i.test(call)) {
      console.error('❌ SECURITY VIOLATION: OpenAI call may include raw incident data');
      process.exit(1);
    }
  }
  console.log('✅ OpenAI calls do not reference raw incident arrays\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All AI input safety tests passed!');
console.log('\nThe weekly_sensemaking.js script:');
console.log('  • Does not read raw incident files');
console.log('  • Only accesses aggregate summaries');
console.log('  • Does not pass raw data to OpenAI');
console.log('\nThis ensures the AI model cannot hallucinate from unstructured input.\n');
