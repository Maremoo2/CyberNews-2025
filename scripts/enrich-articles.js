#!/usr/bin/env node

/**
 * Article Enrichment Script
 * 
 * This script creates enriched versions of articles from incidents-YYYY.json by:
 * 1. Copying all data from the original incidents file
 * 2. Adding basic enrichment metadata (timestamp, version)
 * 3. Setting default values for aiAnalysis fields
 * 
 * This simple version does NOT use AI or web scraping to avoid API dependencies.
 * 
 * Usage: node scripts/enrich-articles.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(PROJECT_ROOT, 'config', 'enrichment-config.json');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

// Process multiple years at once
const YEARS_TO_PROCESS = [2025, 2026];

// Status constants
const STATUS = {
  NEW: 'New',
  ONGOING: 'Ongoing',
  RESOLVED: 'Resolved',
  ESCALATING: 'Escalating',
  UNKNOWN: 'Unknown'
};

/**
 * Load enrichment configuration
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
    console.log(`Config file not found: ${CONFIG_FILE}, using empty config`);
    return { buzzwords: {} };
  } catch (error) {
    console.error(`Error loading config from ${CONFIG_FILE}:`, error.message);
    return { buzzwords: {} };
  }
}

/**
 * Extract cybersecurity buzzwords from tags by matching against known buzzwords
 */
function extractBuzzwords(tags, config) {
  if (!tags || tags.length === 0 || !config.buzzwords) {
    return [];
  }
  
  // Flatten all buzzwords from config into a single list
  const knownBuzzwords = Object.values(config.buzzwords).flat();
  
  // Create variations for common patterns (e.g., "data-breach" matches "data breach")
  const buzzwordVariations = new Map();
  knownBuzzwords.forEach(buzzword => {
    const lower = buzzword.toLowerCase();
    buzzwordVariations.set(lower, buzzword);
    // Add hyphenated version
    buzzwordVariations.set(lower.replace(/\s+/g, '-'), buzzword);
    // Add space version
    buzzwordVariations.set(lower.replace(/-/g, ' '), buzzword);
  });
  
  // Match tags against known buzzwords
  const matchedBuzzwords = new Set();
  tags.forEach(tag => {
    const tagLower = tag.toLowerCase();
    
    // Direct match
    if (buzzwordVariations.has(tagLower)) {
      matchedBuzzwords.add(buzzwordVariations.get(tagLower));
    }
    
    // Partial match - check if tag contains a buzzword or vice versa
    knownBuzzwords.forEach(buzzword => {
      const buzzwordLower = buzzword.toLowerCase();
      if (tagLower.includes(buzzwordLower) || buzzwordLower.includes(tagLower)) {
        matchedBuzzwords.add(buzzword);
      }
    });
  });
  
  return Array.from(matchedBuzzwords);
}

/**
 * Load incidents from file
 */
function loadIncidents(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    console.log(`File not found: ${filePath}`);
    return [];
  } catch (error) {
    console.error(`Error loading incidents from ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Save enriched incidents to file
 */
function saveEnrichedIncidents(incidents, filePath) {
  try {
    const json = JSON.stringify(incidents, null, 2);
    fs.writeFileSync(filePath, json);
    console.log(`✅ Saved ${incidents.length} enriched incidents to ${filePath}`);
  } catch (error) {
    console.error(`Error saving enriched incidents to ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Create basic enriched version of an incident without AI
 */
function enrichIncident(incident, config) {
  // Extract cybersecurity buzzwords by matching tags against known buzzwords
  const buzzwords = extractBuzzwords(incident.tags, config);
  
  // Create default aiAnalysis structure with reasonable defaults
  // Note: Empty values for direct copies, meaningful defaults for computed fields
  const aiAnalysis = {
    summary: incident.summary || '', // Direct copy from original
    status: STATUS.NEW, // Default to "New" for all incidents
    buzzwords: buzzwords, // Filtered cybersecurity buzzwords only
    threatActors: [], // Will be empty without AI analysis
    malwareFamilies: [], // Will be empty without AI analysis
    companies: [], // Will be empty without AI analysis
    cves: [], // Will be empty without AI analysis
    mitreAttack: [], // Will be empty without AI analysis
    impactScore: incident.impact || 3, // Use existing impact or default to moderate
    region: incident.region || 'Global', // Use existing region or default
    country: incident.country || 'Global', // Use existing country or default
    trends: [] // Will be empty without AI analysis
  };

  // Return enriched incident with all original data
  return {
    ...incident,
    aiAnalysis,
    enrichedAt: new Date().toISOString(),
    enrichmentVersion: '1.0'
  };
}

/**
 * Process incidents for a specific year
 */
function processYear(year, config) {
  const incidentsFile = path.join(PROJECT_ROOT, 'data', `incidents-${year}.json`);
  const enrichedFile = path.join(PROJECT_ROOT, 'data', `incidents-${year}-enriched.json`);
  
  console.log(`\n📅 Processing year ${year}...`);
  
  // Load incidents
  const incidents = loadIncidents(incidentsFile);
  
  if (incidents.length === 0) {
    console.log(`⚠️  No incidents found for ${year}`);
    return { year, processed: 0, total: 0 };
  }
  
  console.log(`📚 Loaded ${incidents.length} incidents from ${incidentsFile}`);
  
  // Enrich all incidents
  const enrichedIncidents = incidents.map(incident => enrichIncident(incident, config));
  
  // Sort by date (newest first)
  enrichedIncidents.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  // Save results
  if (!DRY_RUN) {
    saveEnrichedIncidents(enrichedIncidents, enrichedFile);
  } else {
    console.log(`📝 DRY RUN: Would save ${enrichedIncidents.length} incidents to ${enrichedFile}`);
  }
  
  return { year, processed: enrichedIncidents.length, total: incidents.length };
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting article enrichment (basic mode)...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be saved\n');
  }
  
  // Load configuration
  const config = loadConfig();
  console.log('📋 Loaded enrichment configuration');
  
  const results = [];
  
  // Process each year
  for (const year of YEARS_TO_PROCESS) {
    const result = processYear(year, config);
    results.push(result);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 ENRICHMENT SUMMARY');
  console.log('='.repeat(60));
  
  for (const result of results) {
    console.log(`${result.year}: ${result.processed} incidents enriched (${result.total} total)`);
  }
  
  console.log('='.repeat(60));
  
  if (DRY_RUN) {
    console.log('\n⚠️  Not saving changes (dry-run mode)');
  } else {
    console.log(`\n✅ Successfully enriched articles for ${results.length} year(s)!`);
  }
  
  console.log('\n🏁 Enrichment complete!\n');
  process.exit(0);
}

// Run main function
main();
