#!/usr/bin/env node

/**
 * Filter Cloudflare Access Denied Entries
 * 
 * Removes articles with "Access denied" titles that contain IP addresses
 * to prevent data leakage on the public dashboard.
 * 
 * Usage: node scripts/filter-cloudflare-access-denied.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const DATA_FILES = [
  path.join(PROJECT_ROOT, 'data', 'incidents-2026-enriched.json'),
  path.join(PROJECT_ROOT, 'data', 'incidents-2025-enriched.json'),
  path.join(PROJECT_ROOT, 'data', 'incidents-2026.json'),
  path.join(PROJECT_ROOT, 'data', 'incidents-2025.json')
];

function isAccessDeniedEntry(item) {
  // Check if title is "Access denied" or similar
  if (!item.title || !item.summary) return false;
  
  const title = item.title.toLowerCase();
  const summary = item.summary || '';
  
  // Check for Cloudflare access denied pattern
  if (title.includes('access denied') && 
      (summary.includes('Cloudflare Ray ID') || summary.includes('Your IP:'))) {
    return true;
  }
  
  return false;
}

function filterFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${path.basename(filePath)} (file not found)`);
    return;
  }
  
  console.log(`\n📄 Processing ${path.basename(filePath)}...`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  const originalCount = data.length;
  const filtered = data.filter(item => !isAccessDeniedEntry(item));
  const removedCount = originalCount - filtered.length;
  
  if (removedCount > 0) {
    // Create backup
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, content, 'utf-8');
    console.log(`   📋 Created backup: ${path.basename(backupPath)}`);
    
    // Write filtered data
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
    console.log(`   ✅ Removed ${removedCount} access denied entries`);
    console.log(`   📊 Kept ${filtered.length} of ${originalCount} entries`);
  } else {
    console.log(`   ✅ No access denied entries found`);
  }
}

function main() {
  console.log('🔍 Filtering Cloudflare Access Denied Entries\n');
  console.log('This script removes articles with "Access denied" titles that leak IP addresses.\n');
  
  DATA_FILES.forEach(filterFile);
  
  console.log('\n✅ Filtering complete!');
  console.log('\nBackup files (.backup) have been created for all modified files.');
}

main();
