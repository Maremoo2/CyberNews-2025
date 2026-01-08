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
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CyberNews-Bot/1.0)'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

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
 * Transform Inoreader item to incident format
 */
function transformItem(item, feedConfig, config, nextIdGenerator) {
  // Extract URL - Try JSON Feed format first, then fall back to old format
  const url = item.url || item.canonical?.[0]?.href || item.alternate?.[0]?.href || '';
  
  if (!url) {
    console.log(`  ⚠️  Skipping item without URL: ${item.title}`);
    return null;
  }
  
  // Check for duplicate (will be checked by caller)
  // This function just transforms, duplicate checking is done outside
  
  // Extract and clean data
  const title = item.title || 'Untitled';
  const summaryHtml = item.content_html || item.summary?.content || item.content?.content || '';
  const summary = truncate(stripHtml(summaryHtml), 300);
  
  // Convert timestamp to date - Handle both ISO 8601 and Unix timestamps
  let date;
  if (item.date_published) {
    // JSON Feed format: ISO 8601 string
    const parsedDate = new Date(item.date_published);
    // Validate the date is valid
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate.toISOString().split('T')[0];
    } else {
      // If invalid, log error and fall back to Unix timestamp path
      console.error(`  ❌ Invalid date_published: ${item.date_published}, falling back to Unix timestamp`);
      const timestamp = item.published || item.updated || Math.floor(Date.now() / 1000);
      date = unixToDate(timestamp);
    }
  } else {
    // Old format: Unix timestamp
    const timestamp = item.published || item.updated || Math.floor(Date.now() / 1000);
    date = unixToDate(timestamp);
  }
  
  // Generate tags and impact
  const combinedText = `${title} ${summary}`;
  const tags = generateTags(combinedText, config);
  // Add Inoreader's own tags if available
  if (item.tags && Array.isArray(item.tags)) {
    const existingTags = new Set(tags);
    tags.push(...item.tags.filter(tag => !existingTags.has(tag)));
  }
  const impact = calculateImpact(combinedText, config);
  
  // Get source name
  const sourceName = item.origin?.title || feedConfig.name || 'Unknown';
  
  // Determine region (can be enhanced with keyword detection)
  let region = feedConfig.defaultRegion;
  let country = feedConfig.defaultCountry;
  
  // Enhance region/country detection for Offentlig/Microsoft feed
  if (feedConfig.name === 'Offentlig/Microsoft') {
    const norwegianKeywords = config.norwegianKeywords || [];
    const hasNorwegian = norwegianKeywords.some(kw => 
      combinedText.toLowerCase().includes(kw.toLowerCase())
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
    const seenUrls = new Set(existingIncidents.map(inc => inc.sourceUrl));
    let duplicates = 0;
    let errors = 0;
    
    // Create ID generator for sequential IDs
    let currentMaxId = 0;
    const year = new Date().getFullYear();
    const prefix = year.toString();
    for (const incident of existingIncidents) {
      if (incident.id && incident.id.startsWith(prefix)) {
        const num = parseInt(incident.id.substring(prefix.length), 10);
        if (!isNaN(num) && num > currentMaxId) {
          currentMaxId = num;
        }
      }
    }
    
    const nextIdGenerator = () => {
      currentMaxId++;
      return `${prefix}${String(currentMaxId).padStart(3, '0')}`;
    };
    
    for (const item of data.items) {
      try {
        // Check URL first - Try JSON Feed format first, then fall back to old format
        const url = item.url || item.canonical?.[0]?.href || item.alternate?.[0]?.href || '';
        if (url && (seenUrls.has(url) || newItems.some(ni => ni.sourceUrl === url))) {
          duplicates++;
          continue;
        }
        
        const transformed = transformItem(item, feedConfig, config, nextIdGenerator);
        
        if (transformed !== null) {
          newItems.push(transformed);
          seenUrls.add(transformed.sourceUrl);
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
  
  // Collect all existing and new URLs for efficient duplicate checking
  const allIncidents = [...existingIncidents];
  
  for (const feedConfig of config.feeds) {
    const result = await processFeed(feedConfig, config, allIncidents);
    allNewIncidents.push(...result.newItems);
    allIncidents.push(...result.newItems); // Add to running list for next feed
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
