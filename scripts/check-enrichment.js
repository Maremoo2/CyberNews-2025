#!/usr/bin/env node

/**
 * Pre-build enrichment check
 * 
 * This script ensures enriched data exists before building.
 * It checks if enriched files exist and are recent.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const ENRICHED_FILES = [
  'data/incidents-2025-enriched.json',
  'data/incidents-2026-enriched.json'
];

const RAW_FILES = [
  'data/incidents-2025.json',
  'data/incidents-2026.json'
];

console.log('🔍 Checking enrichment status...\n');

let needsEnrichment = false;

// Check if enriched files exist
for (const file of ENRICHED_FILES) {
  const filePath = path.join(PROJECT_ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Missing: ${file}`);
    needsEnrichment = true;
  } else {
    const stats = fs.statSync(filePath);
    const rawFile = file.replace('-enriched', '');
    const rawPath = path.join(PROJECT_ROOT, rawFile);
    
    if (fs.existsSync(rawPath)) {
      const rawStats = fs.statSync(rawPath);
      
      // Check if raw file is newer than enriched (allow 1 second tolerance for git operations)
      const timeDiff = rawStats.mtime - stats.mtime;
      if (timeDiff > 1000) {
        console.log(`⚠️  Outdated: ${file} (raw data is newer by ${Math.round(timeDiff/1000)}s)`);
        needsEnrichment = true;
      } else {
        console.log(`✅ Up-to-date: ${file}`);
      }
    } else {
      console.log(`✅ Present: ${file}`);
    }
  }
}

console.log('');

if (needsEnrichment) {
  console.log('⚠️  WARNING: Enriched data is missing or outdated!');
  console.log('');
  console.log('The build will proceed, but analytics features will be limited.');
  console.log('');
  console.log('To generate enriched data, run:');
  console.log('  npm run enrich-enhanced');
  console.log('');
  console.log('This will take a few minutes but enables full analytics.');
  console.log('');
  
  // Fail build in CI, warn locally
  if (process.env.CI === 'true') {
    console.error('❌ ERROR: Cannot deploy without enriched data in CI environment!');
    console.error('');
    process.exit(1);
  } else {
    // Warn but don't fail locally
    process.exit(0);
  }
} else {
  console.log('✅ All enriched data files are up-to-date!');
  console.log('');
  process.exit(0);
}
