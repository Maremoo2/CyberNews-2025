#!/usr/bin/env node

/**
 * Inoreader News Fetcher
 * 
 * Fetches cybersecurity news from Inoreader RSS feeds (JSON format) and
 * transforms them into the incidents-2026.json format.
 * 
 * Usage: node scripts/fetch-inoreader.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(PROJECT_ROOT, 'config', 'inoreader-config.json');
const INCIDENTS_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2026.json');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

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
 * Load existing incidents
 */
function loadExistingIncidents() {
  try {
    if (fs.existsSync(INCIDENTS_FILE)) {
      const data = fs.readFileSync(INCIDENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error loading incidents from ${INCIDENTS_FILE}:`, error.message);
    return [];
  }
}

/**
 * Save incidents to file
 */
function saveIncidents(incidents) {
  try {
    const json = JSON.stringify(incidents, null, 2);
    fs.writeFileSync(INCIDENTS_FILE, json);
    console.log(`✅ Saved ${incidents.length} incidents to ${INCIDENTS_FILE}`);
  } catch (error) {
    console.error(`Error saving incidents to ${INCIDENTS_FILE}:`, error.message);
    process.exit(1);
  }
}

/**
 * Fetch data from URL with retry logic
 */
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Fetching... (attempt ${attempt}/${maxRetries})`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CyberNews-Bot/1.0)'
        },
        timeout: 30000
      });

      if (response.status === 429) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`  Rate limited (429). Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`  Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff before retry
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`  Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
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
 * Convert Unix timestamp to YYYY-MM-DD format
 */
function unixToDate(timestamp) {
  const date = new Date(timestamp * 1000);
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
  
  // Extract company/product names (common ones)
  const companies = ['microsoft', 'google', 'aws', 'amazon', 'apple', 'meta', 'facebook', 
                     'twitter', 'oracle', 'ibm', 'cisco', 'fortinet', 'palo alto'];
  for (const company of companies) {
    if (lowerText.includes(company)) {
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
 * Get next available ID
 */
function getNextId(existingIncidents) {
  const year = new Date().getFullYear();
  const prefix = year.toString();
  
  // Find highest ID with current year prefix
  let maxNum = 0;
  for (const incident of existingIncidents) {
    if (incident.id && incident.id.startsWith(prefix)) {
      const num = parseInt(incident.id.substring(prefix.length), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
}

/**
 * Check if URL already exists in incidents
 */
function isDuplicate(url, existingIncidents) {
  return existingIncidents.some(incident => incident.sourceUrl === url);
}

/**
 * Transform Inoreader item to incident format
 */
function transformItem(item, feedConfig, config, existingIncidents) {
  // Extract URL
  const url = item.canonical?.[0]?.href || item.alternate?.[0]?.href || '';
  
  if (!url) {
    console.log(`  ⚠️  Skipping item without URL: ${item.title}`);
    return null;
  }
  
  // Check for duplicate
  if (isDuplicate(url, existingIncidents)) {
    return null; // Will be counted as duplicate
  }
  
  // Extract and clean data
  const title = item.title || 'Untitled';
  const summaryHtml = item.summary?.content || item.content?.content || '';
  const summary = truncate(stripHtml(summaryHtml), 300);
  
  // Convert timestamp to date
  const timestamp = item.published || item.updated || Math.floor(Date.now() / 1000);
  const date = unixToDate(timestamp);
  
  // Generate tags and impact
  const combinedText = `${title} ${summary}`;
  const tags = generateTags(combinedText, config);
  const impact = calculateImpact(combinedText, config);
  
  // Get source name
  const sourceName = item.origin?.title || feedConfig.name || 'Unknown';
  
  // Determine region (can be enhanced with keyword detection)
  let region = feedConfig.defaultRegion;
  let country = feedConfig.defaultCountry;
  
  // Enhance region/country detection for Offentlig/Microsoft feed
  if (feedConfig.name === 'Offentlig/Microsoft') {
    const norwegianKeywords = ['norge', 'norway', 'norsk', 'norwegian', 'oslo'];
    const hasNorwegian = norwegianKeywords.some(kw => 
      combinedText.toLowerCase().includes(kw)
    );
    if (hasNorwegian) {
      region = 'NO';
      country = 'Norway';
    } else {
      // Default to EU for Microsoft content
      region = 'EU';
      country = 'Europe';
    }
  }
  
  // Generate sequential ID
  const id = getNextId(existingIncidents);
  
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
 * Fetch and process a single feed
 */
async function processFeed(feedConfig, config, existingIncidents) {
  console.log(`\n📡 Processing feed: ${feedConfig.name}`);
  console.log(`   URL: ${feedConfig.url}`);
  
  try {
    const data = await fetchWithRetry(feedConfig.url);
    
    if (!data.items || !Array.isArray(data.items)) {
      console.log(`  ⚠️  No items found in feed response`);
      return { newItems: [], duplicates: 0, errors: 0 };
    }
    
    console.log(`  📥 Found ${data.items.length} items in feed`);
    
    const newItems = [];
    let duplicates = 0;
    let errors = 0;
    
    for (const item of data.items) {
      try {
        const transformed = transformItem(item, feedConfig, config, [...existingIncidents, ...newItems]);
        
        if (transformed === null) {
          // Check if it's a duplicate or missing URL
          const url = item.canonical?.[0]?.href || item.alternate?.[0]?.href || '';
          if (url && isDuplicate(url, [...existingIncidents, ...newItems])) {
            duplicates++;
          }
        } else {
          newItems.push(transformed);
        }
      } catch (error) {
        console.error(`  ❌ Error transforming item:`, error.message);
        errors++;
      }
    }
    
    console.log(`  ✅ Processed: ${newItems.length} new, ${duplicates} duplicates, ${errors} errors`);
    
    return { newItems, duplicates, errors };
    
  } catch (error) {
    console.error(`  ❌ Failed to process feed: ${error.message}`);
    return { newItems: [], duplicates: 0, errors: 1 };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Inoreader news fetch...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be saved\n');
  }
  
  // Load configuration
  const config = loadConfig();
  console.log(`📋 Loaded configuration with ${config.feeds.length} feeds`);
  
  // Load existing incidents
  const existingIncidents = loadExistingIncidents();
  console.log(`📚 Loaded ${existingIncidents.length} existing incidents`);
  
  // Process each feed
  let totalNew = 0;
  let totalDuplicates = 0;
  let totalErrors = 0;
  const allNewIncidents = [];
  
  for (const feedConfig of config.feeds) {
    const result = await processFeed(feedConfig, config, [...existingIncidents, ...allNewIncidents]);
    allNewIncidents.push(...result.newItems);
    totalNew += result.newItems.length;
    totalDuplicates += result.duplicates;
    totalErrors += result.errors;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`New articles:       ${totalNew}`);
  console.log(`Duplicates skipped: ${totalDuplicates}`);
  console.log(`Errors:             ${totalErrors}`);
  console.log('='.repeat(60));
  
  // Save if we have new incidents
  if (totalNew > 0) {
    if (DRY_RUN) {
      console.log('\n📝 DRY RUN: Would add the following incidents:\n');
      for (const incident of allNewIncidents) {
        console.log(`  ${incident.id} - ${incident.date} - ${incident.title.substring(0, 60)}...`);
      }
      console.log('\n⚠️  Not saving changes (dry-run mode)');
    } else {
      // Merge with existing incidents and sort by date (newest first)
      const mergedIncidents = [...allNewIncidents, ...existingIncidents];
      mergedIncidents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Descending order
      });
      
      saveIncidents(mergedIncidents);
      console.log(`\n✅ Successfully added ${totalNew} new incidents!`);
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
