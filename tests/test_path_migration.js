#!/usr/bin/env node

/**
 * Test: Validate that data paths are correctly updated to public/data
 * 
 * This test ensures all scripts and workflows reference the new public/data
 * directory structure for production builds.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing Data Path Migration to public/data\n');

// Test 1: Check weekly_sensemaking.js uses public/data paths
console.log('Test 1: Checking weekly_sensemaking.js paths...');
const sensemakingPath = path.join(PROJECT_ROOT, 'scripts', 'weekly_sensemaking.js');
const sensemakingContent = fs.readFileSync(sensemakingPath, 'utf8');

if (sensemakingContent.includes("'data', 'aggregates'") && 
    !sensemakingContent.includes("'public', 'data', 'aggregates'")) {
  console.error('❌ FAIL: weekly_sensemaking.js still uses old data/aggregates path');
  process.exit(1);
}

if (sensemakingContent.includes("'data', 'analysis'") && 
    !sensemakingContent.includes("'public', 'data', 'analysis'")) {
  console.error('❌ FAIL: weekly_sensemaking.js still uses old data/analysis path');
  process.exit(1);
}

if (!sensemakingContent.includes("'public', 'data', 'aggregates'")) {
  console.error('❌ FAIL: weekly_sensemaking.js does not use public/data/aggregates path');
  process.exit(1);
}

if (!sensemakingContent.includes("'public', 'data', 'analysis'")) {
  console.error('❌ FAIL: weekly_sensemaking.js does not use public/data/analysis path');
  process.exit(1);
}

console.log('✅ weekly_sensemaking.js uses correct paths\n');

// Test 2: Check aggregate_weekly.js uses public/data paths
console.log('Test 2: Checking aggregate_weekly.js paths...');
const aggregatePath = path.join(PROJECT_ROOT, 'scripts', 'aggregate_weekly.js');
const aggregateContent = fs.readFileSync(aggregatePath, 'utf8');

if (!aggregateContent.includes("'public', 'data', 'aggregates'")) {
  console.error('❌ FAIL: aggregate_weekly.js does not use public/data/aggregates path');
  process.exit(1);
}

console.log('✅ aggregate_weekly.js uses correct paths\n');

// Test 3: Check workflow uses public/data paths
console.log('Test 3: Checking GitHub workflow paths...');
const workflowPath = path.join(PROJECT_ROOT, '.github', 'workflows', 'weekly-analysis.yml');
const workflowContent = fs.readFileSync(workflowPath, 'utf8');

if (workflowContent.includes('data/aggregates/week_') && 
    !workflowContent.includes('public/data/aggregates/week_')) {
  console.error('❌ FAIL: workflow still references old data/aggregates path');
  process.exit(1);
}

if (workflowContent.includes('data/analysis/week_') && 
    !workflowContent.includes('public/data/analysis/week_')) {
  console.error('❌ FAIL: workflow still references old data/analysis path');
  process.exit(1);
}

if (!workflowContent.includes('public/data/aggregates/week_')) {
  console.error('❌ FAIL: workflow does not reference public/data/aggregates');
  process.exit(1);
}

if (!workflowContent.includes('public/data/analysis/week_')) {
  console.error('❌ FAIL: workflow does not reference public/data/analysis');
  process.exit(1);
}

console.log('✅ GitHub workflow uses correct paths\n');

// Test 4: Check that public/data directories exist
console.log('Test 4: Checking that public/data directories exist...');
const publicDataPath = path.join(PROJECT_ROOT, 'public', 'data');
const aggregatesPath = path.join(publicDataPath, 'aggregates');
const analysisPath = path.join(publicDataPath, 'analysis');

if (!fs.existsSync(publicDataPath)) {
  console.error('❌ FAIL: public/data directory does not exist');
  process.exit(1);
}

if (!fs.existsSync(aggregatesPath)) {
  console.error('❌ FAIL: public/data/aggregates directory does not exist');
  process.exit(1);
}

if (!fs.existsSync(analysisPath)) {
  console.error('❌ FAIL: public/data/analysis directory does not exist');
  process.exit(1);
}

console.log('✅ public/data directory structure exists\n');

// Test 5: Check that files in public/data get built to dist/data
console.log('Test 5: Checking that build includes data files...');
const distDataPath = path.join(PROJECT_ROOT, 'dist', 'data');

if (!fs.existsSync(distDataPath)) {
  console.warn('⚠️  WARNING: dist/data does not exist (run npm run build to verify)');
} else {
  console.log('✅ dist/data directory exists\n');
  
  const distAggregatesPath = path.join(distDataPath, 'aggregates');
  const distAnalysisPath = path.join(distDataPath, 'analysis');
  
  if (!fs.existsSync(distAggregatesPath)) {
    console.error('❌ FAIL: dist/data/aggregates directory does not exist');
    process.exit(1);
  }
  
  if (!fs.existsSync(distAnalysisPath)) {
    console.error('❌ FAIL: dist/data/analysis directory does not exist');
    process.exit(1);
  }
  
  console.log('✅ dist/data directory structure exists\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All path migration tests passed!');
console.log('\nData files are now:');
console.log('  • Stored in public/data/ directory');
console.log('  • Automatically included in Vite build');
console.log('  • Served at /data/ in production');
console.log('  • Scripts and workflow updated to new paths');
