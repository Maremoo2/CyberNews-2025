#!/usr/bin/env node

/**
 * Test script for weekly aggregation
 * Validates the structure and content of generated aggregates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing Weekly Aggregation\n');

// Test 1: Check if sample aggregate exists
console.log('Test 1: Loading sample aggregate...');
const samplePath = path.join(__dirname, 'sample_aggregate.json');
if (!fs.existsSync(samplePath)) {
  console.error('❌ Sample aggregate not found');
  process.exit(1);
}

const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
console.log('✅ Sample aggregate loaded\n');

// Test 2: Validate required fields
console.log('Test 2: Validating required fields...');
const requiredFields = [
  'week_start',
  'week_end',
  'week_number',
  'week_year',
  'counts',
  'deltas_vs_last_week',
  'attack_type_percentages',
  'top_themes',
  'sector_distribution',
  'attack_chain_distribution',
  'top_clusters',
  'quality_metadata'
];

let allFieldsPresent = true;
for (const field of requiredFields) {
  if (!(field in sample)) {
    console.error(`❌ Missing required field: ${field}`);
    allFieldsPresent = false;
  }
}

if (allFieldsPresent) {
  console.log('✅ All required fields present\n');
} else {
  process.exit(1);
}

// Test 3: Validate counts structure
console.log('Test 3: Validating counts structure...');
const countsFields = ['total_items', 'incident_related', 'cluster_count'];
let countsValid = true;

for (const field of countsFields) {
  if (!(field in sample.counts)) {
    console.error(`❌ Missing counts field: ${field}`);
    countsValid = false;
  } else if (typeof sample.counts[field] !== 'number') {
    console.error(`❌ Invalid type for counts.${field}: expected number`);
    countsValid = false;
  }
}

if (countsValid) {
  console.log('✅ Counts structure valid\n');
} else {
  process.exit(1);
}

// Test 4: Validate deltas structure
console.log('Test 4: Validating deltas structure...');
const deltasFields = ['exploit_led_pct', 'phishing_pct', 'token_abuse_pct', 'ransomware_pct'];
let deltasValid = true;

for (const field of deltasFields) {
  if (!(field in sample.deltas_vs_last_week)) {
    console.error(`❌ Missing deltas field: ${field}`);
    deltasValid = false;
  }
}

if (deltasValid) {
  console.log('✅ Deltas structure valid\n');
} else {
  process.exit(1);
}

// Test 5: Validate top themes array
console.log('Test 5: Validating top themes...');
if (!Array.isArray(sample.top_themes)) {
  console.error('❌ top_themes is not an array');
  process.exit(1);
}

if (sample.top_themes.length > 0) {
  const theme = sample.top_themes[0];
  if (!theme.theme || !theme.confidence || !theme.item_count) {
    console.error('❌ Invalid theme structure');
    process.exit(1);
  }
}

console.log('✅ Top themes structure valid\n');

// Test 6: Validate top clusters
console.log('Test 6: Validating top clusters...');
if (!Array.isArray(sample.top_clusters)) {
  console.error('❌ top_clusters is not an array');
  process.exit(1);
}

if (sample.top_clusters.length > 5) {
  console.error('❌ More than 5 clusters returned');
  process.exit(1);
}

if (sample.top_clusters.length > 0) {
  const cluster = sample.top_clusters[0];
  if (!cluster.title || !cluster.size || !cluster.confidence) {
    console.error('❌ Invalid cluster structure');
    process.exit(1);
  }
}

console.log('✅ Top clusters structure valid\n');

// Test 7: Validate quality metadata
console.log('Test 7: Validating quality metadata...');
if (typeof sample.quality_metadata.avg_confidence !== 'number') {
  console.error('❌ avg_confidence should be a number');
  process.exit(1);
}

if (!Array.isArray(sample.quality_metadata.top_sources)) {
  console.error('❌ top_sources should be an array');
  process.exit(1);
}

if (typeof sample.quality_metadata.total_sources !== 'number') {
  console.error('❌ total_sources should be a number');
  process.exit(1);
}

console.log('✅ Quality metadata valid\n');

// Test 8: Check for actual aggregate files
console.log('Test 8: Checking for generated aggregate files...');
const aggregatesDir = path.join(PROJECT_ROOT, 'data', 'aggregates');
if (fs.existsSync(aggregatesDir)) {
  const files = fs.readdirSync(aggregatesDir).filter(f => f.startsWith('week_') && f.endsWith('.json'));
  console.log(`✅ Found ${files.length} aggregate file(s) in data/aggregates/\n`);
  
  if (files.length > 0) {
    console.log('   Latest aggregates:');
    files.slice(-3).forEach(f => console.log(`   - ${f}`));
    console.log();
  }
} else {
  console.log('⚠️  No aggregates directory found (run aggregate_weekly.js to create)\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All aggregation tests passed!\n');
