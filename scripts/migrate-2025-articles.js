#!/usr/bin/env node

/**
 * Migrate 2025 Articles Script
 * 
 * Moves all articles dated 2025 from incidents-2026.json to incidents-2025-enriched.json
 * and updates their IDs to use the 2025 prefix.
 * 
 * Usage: node scripts/migrate-2025-articles.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const INCIDENTS_2026_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2026.json');
const INCIDENTS_2025_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2025-enriched.json');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Save JSON file
 */
function saveJSON(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json);
    console.log(`✅ Saved ${data.length} incidents to ${filePath}`);
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting migration of 2025 articles...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be saved\n');
  }
  
  // Load both files
  const incidents2026 = loadJSON(INCIDENTS_2026_FILE);
  const incidents2025 = loadJSON(INCIDENTS_2025_FILE);
  
  console.log(`📚 Loaded ${incidents2026.length} incidents from incidents-2026.json`);
  console.log(`📚 Loaded ${incidents2025.length} incidents from incidents-2025-enriched.json\n`);
  
  // Separate 2025 and 2026 articles
  const articles2025 = incidents2026.filter(inc => 
    inc.date && typeof inc.date === 'string' && inc.date.startsWith('2025')
  );
  const articles2026 = incidents2026.filter(inc => 
    inc.date && typeof inc.date === 'string' && inc.date.startsWith('2026')
  );
  
  // Handle articles with missing or invalid dates
  const articlesWithInvalidDates = incidents2026.filter(inc => 
    !inc.date || typeof inc.date !== 'string' || 
    (!inc.date.startsWith('2025') && !inc.date.startsWith('2026'))
  );
  
  if (articlesWithInvalidDates.length > 0) {
    console.log(`⚠️  Warning: Found ${articlesWithInvalidDates.length} articles with missing or invalid dates`);
    console.log(`    These articles will remain in incidents-2026.json`);
    for (const article of articlesWithInvalidDates.slice(0, 5)) {
      console.log(`    - ID ${article.id}: date="${article.date}" - ${article.title?.substring(0, 50)}...`);
    }
    if (articlesWithInvalidDates.length > 5) {
      console.log(`    ... and ${articlesWithInvalidDates.length - 5} more`);
    }
    console.log();
  }
  
  console.log(`📊 Found ${articles2025.length} articles from 2025 in incidents-2026.json`);
  console.log(`📊 Found ${articles2026.length} articles from 2026 in incidents-2026.json\n`);
  
  if (articles2025.length === 0) {
    console.log('✅ No articles to migrate!\n');
    return;
  }
  
  // Find the highest ID in the 2025 file
  let maxId2025 = 0;
  for (const incident of incidents2025) {
    if (incident.id && incident.id.startsWith('2025')) {
      const num = parseInt(incident.id.substring(4), 10);
      if (!isNaN(num) && num > maxId2025) {
        maxId2025 = num;
      }
    }
    // Also check for old ID formats (non-year-prefixed)
    if (incident.id && !incident.id.startsWith('20')) {
      const num = parseInt(incident.id, 10);
      if (!isNaN(num) && num > maxId2025) {
        maxId2025 = num;
      }
    }
  }
  
  console.log(`📌 Current max ID in 2025 file: ${maxId2025}`);
  
  // Re-ID the 2025 articles with proper 2025xxx format
  let nextId = maxId2025 + 1;
  const reIDed2025Articles = articles2025.map(article => {
    const oldId = article.id;
    const newId = `2025${String(nextId).padStart(3, '0')}`;
    nextId++;
    
    if (DRY_RUN) {
      console.log(`  ${oldId} → ${newId} | ${article.date} | ${article.title.substring(0, 50)}...`);
    }
    
    return {
      ...article,
      id: newId
    };
  });
  
  if (DRY_RUN) {
    console.log(`\n📝 DRY RUN: Would migrate ${articles2025.length} articles from 2025`);
    console.log(`📝 DRY RUN: Would keep ${articles2026.length} articles in 2026 file`);
    console.log(`📝 DRY RUN: Total in 2025 file would be ${incidents2025.length + reIDed2025Articles.length}`);
    console.log('\n⚠️  Not saving changes (dry-run mode)\n');
    return;
  }
  
  // Merge the 2025 articles with existing 2025 file (existing first for consistent ordering)
  const merged2025 = [...incidents2025, ...reIDed2025Articles];
  
  // Sort by date (newest first)
  merged2025.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  // Sort 2026 articles by date (newest first), keeping invalid dates at the end
  const valid2026Articles = articles2026.filter(a => a.date && !isNaN(new Date(a.date).getTime()));
  const invalid2026Articles = [...articlesWithInvalidDates, ...articles2026.filter(a => !a.date || isNaN(new Date(a.date).getTime()))];
  
  valid2026Articles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  const final2026Articles = [...valid2026Articles, ...invalid2026Articles];
  
  // Save both files
  console.log('\n💾 Saving files...\n');
  saveJSON(INCIDENTS_2025_FILE, merged2025);
  saveJSON(INCIDENTS_2026_FILE, final2026Articles);
  
  console.log('\n✅ Migration complete!');
  console.log(`   - Moved ${articles2025.length} articles from 2026 to 2025`);
  console.log(`   - incidents-2025-enriched.json now has ${merged2025.length} total articles`);
  console.log(`   - incidents-2026.json now has ${final2026Articles.length} total articles`);
  if (articlesWithInvalidDates.length > 0) {
    console.log(`   - ${articlesWithInvalidDates.length} articles with invalid dates remain in 2026 file`);
  }
  console.log();
}

// Run main function
main();
