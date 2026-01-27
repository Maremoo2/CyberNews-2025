#!/usr/bin/env node

/**
 * Direct RSS Feed Fetcher
 * 
 * Fetches cybersecurity news from RSS feeds directly and transforms them
 * into the incidents format.
 * 
 * Usage: node scripts/fetch-rss-feeds.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(PROJECT_ROOT, 'config', 'rss-feeds-config.json');
const METADATA_FILE = path.join(PROJECT_ROOT, 'data', 'metadata.json');

// Default metadata structure
const DEFAULT_METADATA = {
  lastUpdated: null,
  lastRssFetch: null,
  lastInoreaderFetch: null,
  lastEnrichment: null,
  totalIncidents2025: 0,
  totalIncidents2026: 0,
  totalIncidents: 0
};

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

// Initialize RSS parser
const parser = new Parser({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; CyberNews-Bot/1.0)'
  },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['content:encoded', 'content:encoded'],
      ['description', 'description']
    ]
  }
});

/**
 * Get the incidents file path for a given year
 */
function getIncidentsFilePath(year) {
  return path.join(PROJECT_ROOT, 'data', `incidents-${year}.json`);
}

/**
 * Extract year from date string (YYYY-MM-DD format)
 */
function getYearFromDate(dateStr) {
  const year = dateStr.split('-')[0];
  return parseInt(year, 10);
}

/**
 * Load configuration
 */
function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Error loading config from ${CONFIG_FILE}:`, error.message);
    process.exit(1);
  }
}

/**
 * Load existing incidents from a specific year file
 */
function loadExistingIncidents(year) {
  const filePath = getIncidentsFilePath(year);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error loading incidents from ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Load all existing incidents from both current and previous year files
 */
function loadAllExistingIncidents() {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  const currentYearIncidents = loadExistingIncidents(currentYear);
  const previousYearIncidents = loadExistingIncidents(previousYear);
  
  return {
    [currentYear]: currentYearIncidents,
    [previousYear]: previousYearIncidents,
    all: [...currentYearIncidents, ...previousYearIncidents]
  };
}

/**
 * Save incidents to the appropriate year file
 */
function saveIncidents(incidents, year) {
  const filePath = getIncidentsFilePath(year);
  try {
    const json = JSON.stringify(incidents, null, 2);
    fs.writeFileSync(filePath, json);
    console.log(`✅ Saved ${incidents.length} incidents to ${filePath}`);
  } catch (error) {
    console.error(`Error saving incidents to ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Load metadata
 */
function loadMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return { ...DEFAULT_METADATA };
  } catch (error) {
    console.error(`Error loading metadata from ${METADATA_FILE}:`, error.message);
    return { ...DEFAULT_METADATA };
  }
}

/**
 * Save metadata
 */
function saveMetadata(metadata) {
  try {
    const json = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(METADATA_FILE, json);
    console.log(`✅ Updated metadata in ${METADATA_FILE}`);
  } catch (error) {
    console.error(`Error saving metadata to ${METADATA_FILE}:`, error.message);
  }
}

/**
 * Strip HTML tags and decode entities
 */
function stripHtml(html) {
  if (!html) return '';
  
  const $ = cheerio.load(html);
  return $.text().trim();
}

/**
 * Truncate text to max length
 */
function truncate(text, maxLength = 300) {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength - 3) + '...';
}

/**
 * Convert date to YYYY-MM-DD format
 */
function formatDate(date) {
  if (!date) {
    date = new Date();
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  return date.toISOString().split('T')[0];
}

/**
 * Generate tags from text using keyword matching
 */
function generateTags(text, config) {
  const tags = new Set();
  const lowerText = text.toLowerCase();
  
  // Check tag keywords
  for (const [tag, keywords] of Object.entries(config.tagKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        tags.add(tag);
        break;
      }
    }
  }
  
  // Extract company/product names from config
  const companies = config.companyKeywords || [];
  for (const company of companies) {
    if (lowerText.includes(company.toLowerCase())) {
      tags.add(company);
    }
  }
  
  return Array.from(tags);
}

/**
 * Calculate impact score from text
 */
function calculateImpact(text, config) {
  const lowerText = text.toLowerCase();
  
  // Check impact keywords (highest priority first)
  for (let level = 5; level >= 1; level--) {
    const keywords = config.impactKeywords[level.toString()] || [];
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return level;
      }
    }
  }
  
  // Default to moderate impact
  return 3;
}

/**
 * Transform RSS item to incident format
 */
function transformItem(item, feedConfig, config, nextIdGenerator) {
  // Extract URL
  const url = item.link || item.guid || '';
  
  if (!url) {
    console.log(`  ⚠️  Skipping item without URL: ${item.title}`);
    return null;
  }
  
  // Extract and clean data
  const title = item.title || 'Untitled';
  
  // Try multiple content fields for RSS feeds
  const contentHtml = item['content:encoded'] || item.content || item.description || item.summary || '';
  const summary = truncate(stripHtml(contentHtml), 300);
  
  // Convert date
  let date = formatDate(item.pubDate || item.isoDate || item.published || new Date());
  
  // Adjust future dates instead of skipping
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const incidentDate = new Date(date);
  if (incidentDate > today) {
    const articleYear = incidentDate.getFullYear();
    const currentYear = today.getFullYear();
    
    if (articleYear === currentYear) {
      // Same year: use today's date
      date = today.toISOString().split('T')[0];
      console.log(`  ℹ️  Adjusted future date to today (${date}): ${title.substring(0, 50)}...`);
    } else if (articleYear > currentYear) {
      // Future year: use December 31st of current year
      date = `${currentYear}-12-31`;
      console.log(`  ℹ️  Adjusted future year to end of current year (${date}): ${title.substring(0, 50)}...`);
    }
    // If date is in the past, keep original date
  }
  
  // Generate tags and impact
  const combinedText = `${title} ${summary}`;
  const tags = generateTags(combinedText, config);
  const impact = calculateImpact(combinedText, config);
  
  // Get source name
  const sourceName = feedConfig.name || 'Unknown';
  
  // Get region and country from feed config
  const region = feedConfig.defaultRegion;
  const country = feedConfig.defaultCountry;
  
  // Generate sequential ID
  const id = nextIdGenerator();
  
  return {
    id,
    date,
    title,
    summary,
    region,
    country,
    sourceName,
    sourceUrl: url,
    tags,
    impact
  };
}

/**
 * Fetch and process a single RSS feed
 */
async function processFeed(feedConfig, config, existingIncidentsByYear) {
  console.log(`\n📡 Processing feed: ${feedConfig.name}`);
  console.log(`   URL: ${feedConfig.url}`);
  
  try {
    const feed = await parser.parseURL(feedConfig.url);
    
    if (!feed.items || !Array.isArray(feed.items)) {
      console.log(`  ⚠️  No items found in feed`);
      return { newItemsByYear: {}, duplicates: 0, errors: 0, totalItems: 0 };
    }
    
    const totalItems = feed.items.length;
    console.log(`  📥 Received ${totalItems} items from feed`);
    
    const newItemsByYear = {};
    const seenUrls = new Set(existingIncidentsByYear.all.map(inc => inc.sourceUrl));
    let duplicates = 0;
    let errors = 0;
    let firstDuplicateIndex = -1;
    
    // Create ID generators for each year
    const idGenerators = {};
    const getIdGenerator = (year) => {
      if (!idGenerators[year]) {
        // Find max ID for this year
        let currentMaxId = 0;
        const prefix = year.toString();
        const yearIncidents = existingIncidentsByYear[year] || [];
        
        for (const incident of yearIncidents) {
          if (incident.id && incident.id.startsWith(prefix)) {
            const num = parseInt(incident.id.substring(prefix.length), 10);
            if (!isNaN(num) && num > currentMaxId) {
              currentMaxId = num;
            }
          }
        }
        
        // Also check already-processed items for this year
        const processedItems = newItemsByYear[year] || [];
        for (const incident of processedItems) {
          if (incident.id && incident.id.startsWith(prefix)) {
            const num = parseInt(incident.id.substring(prefix.length), 10);
            if (!isNaN(num) && num > currentMaxId) {
              currentMaxId = num;
            }
          }
        }
        
        idGenerators[year] = () => {
          currentMaxId++;
          return `${prefix}${String(currentMaxId).padStart(3, '0')}`;
        };
      }
      return idGenerators[year];
    };
    
    // Limit items per feed
    const maxItems = config.maxItemsPerFeed || 50;
    const itemsToProcess = feed.items.slice(0, maxItems);
    
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      try {
        // Check URL first
        const url = item.link || item.guid || '';
        if (url && seenUrls.has(url)) {
          duplicates++;
          // Track the first duplicate we encounter
          if (firstDuplicateIndex === -1) {
            firstDuplicateIndex = i;
            console.log(`  🔄 Encountered first duplicate at position ${i + 1}/${itemsToProcess.length}`);
          }
          continue;
        }
        
        // Extract date to determine year
        const articleDate = formatDate(item.pubDate || item.isoDate || item.published);
        const articleYear = getYearFromDate(articleDate);
        const yearGenerator = getIdGenerator(articleYear);
        
        const transformed = transformItem(item, feedConfig, config, yearGenerator);
        
        if (transformed !== null) {
          if (!newItemsByYear[articleYear]) {
            newItemsByYear[articleYear] = [];
          }
          newItemsByYear[articleYear].push(transformed);
          seenUrls.add(transformed.sourceUrl);
        }
      } catch (error) {
        console.error(`  ❌ Error transforming item:`, error.message);
        errors++;
      }
    }
    
    const totalNewItems = Object.values(newItemsByYear).reduce((sum, items) => sum + items.length, 0);
    console.log(`  ✅ Results: ${totalNewItems} new, ${duplicates} duplicates, ${errors} errors`);
    if (firstDuplicateIndex !== -1) {
      console.log(`  📊 All new items were in positions 1-${firstDuplicateIndex}, remaining ${itemsToProcess.length - firstDuplicateIndex} were duplicates`);
    }
    
    // Log year distribution
    for (const [year, items] of Object.entries(newItemsByYear)) {
      console.log(`  📅 Year ${year}: ${items.length} new items`);
    }
    
    return { newItemsByYear, duplicates, errors, totalItems };
    
  } catch (error) {
    console.error(`  ❌ Failed to process feed: ${error.message}`);
    return { newItemsByYear: {}, duplicates: 0, errors: 1, totalItems: 0 };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting RSS feed fetch...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be saved\n');
  }
  
  // Load configuration
  const config = loadConfig();
  console.log(`📋 Loaded configuration with ${config.feeds.length} feeds`);
  
  // Load existing incidents from both current and previous year
  const existingIncidentsByYear = loadAllExistingIncidents();
  console.log(`📚 Loaded ${existingIncidentsByYear.all.length} existing incidents`);
  
  // Process each feed
  let totalNew = 0;
  let totalDuplicates = 0;
  let totalErrors = 0;
  let totalItemsFetched = 0;
  const allNewIncidentsByYear = {};
  
  for (const feedConfig of config.feeds) {
    const result = await processFeed(feedConfig, config, existingIncidentsByYear);
    
    // Merge results by year
    for (const [year, items] of Object.entries(result.newItemsByYear)) {
      if (!allNewIncidentsByYear[year]) {
        allNewIncidentsByYear[year] = [];
      }
      allNewIncidentsByYear[year].push(...items);
      
      // Also add to the existingIncidentsByYear for next feed's duplicate checking
      const yearNum = parseInt(year, 10);
      if (!existingIncidentsByYear[yearNum]) {
        existingIncidentsByYear[yearNum] = [];
      }
      existingIncidentsByYear[yearNum].push(...items);
      existingIncidentsByYear.all.push(...items);
    }
    
    const newItemsCount = Object.values(result.newItemsByYear).reduce((sum, items) => sum + items.length, 0);
    totalNew += newItemsCount;
    totalDuplicates += result.duplicates;
    totalErrors += result.errors;
    totalItemsFetched += result.totalItems;
    
    // Small delay between feeds to be nice to servers
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total items fetched:  ${totalItemsFetched}`);
  console.log(`New articles:         ${totalNew}`);
  console.log(`Duplicates skipped:   ${totalDuplicates}`);
  console.log(`Errors:               ${totalErrors}`);
  
  // Show year distribution
  for (const [year, items] of Object.entries(allNewIncidentsByYear)) {
    console.log(`  Year ${year}:        ${items.length} new articles`);
  }
  console.log('='.repeat(60));
  
  // Save if we have new incidents
  if (totalNew > 0) {
    if (DRY_RUN) {
      console.log('\n📝 DRY RUN: Would add the following incidents:\n');
      for (const [year, incidents] of Object.entries(allNewIncidentsByYear)) {
        console.log(`\n  Year ${year}:`);
        for (const incident of incidents.slice(0, 5)) { // Show first 5 only
          console.log(`    ${incident.id} - ${incident.date} - ${incident.title.substring(0, 60)}...`);
        }
        if (incidents.length > 5) {
          console.log(`    ... and ${incidents.length - 5} more`);
        }
      }
      console.log('\n⚠️  Not saving changes (dry-run mode)');
    } else {
      // Save each year's incidents to its respective file
      for (const [year, newIncidents] of Object.entries(allNewIncidentsByYear)) {
        const yearNum = parseInt(year, 10);
        const existingForYear = loadExistingIncidents(yearNum);
        
        // Merge with existing incidents and sort by date (newest first)
        const mergedIncidents = [...newIncidents, ...existingForYear];
        mergedIncidents.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA; // Descending order
        });
        
        saveIncidents(mergedIncidents, yearNum);
      }
      console.log(`\n✅ Successfully added ${totalNew} new incidents!`);
      
      // Update metadata
      const metadata = loadMetadata();
      metadata.lastRssFetch = new Date().toISOString();
      metadata.lastUpdated = new Date().toISOString();
      
      // Update incident counts
      const incidents2025 = loadExistingIncidents(2025);
      const incidents2026 = loadExistingIncidents(2026);
      metadata.totalIncidents2025 = incidents2025.length;
      metadata.totalIncidents2026 = incidents2026.length;
      metadata.totalIncidents = incidents2025.length + incidents2026.length;
      
      saveMetadata(metadata);
    }
  } else {
    console.log('\n✅ No new articles to add');
  }
  
  console.log('\n🏁 Fetch complete!\n');
  process.exit(0);
}

// Run main function
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
