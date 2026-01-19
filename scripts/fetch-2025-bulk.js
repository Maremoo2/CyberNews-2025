#!/usr/bin/env node

/**
 * Bulk 2025 Articles Fetcher
 * 
 * Fetches historical cybersecurity articles from 2025 using pagination.
 * This script is designed to fetch large volumes of historical data
 * by using Inoreader's continuation tokens to paginate through older articles.
 * 
 * Target: 40-50k articles from 2025
 * 
 * Usage: node scripts/fetch-2025-bulk.js [--dry-run] [--max-iterations=N]
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
const METADATA_FILE = path.join(PROJECT_ROOT, 'data', 'metadata.json');
const INCIDENTS_2025_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2025.json');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const maxIterationsArg = args.find(arg => arg.startsWith('--max-iterations='));
const MAX_ITERATIONS = maxIterationsArg ? parseInt(maxIterationsArg.split('=')[1], 10) : 100;

// Target for 2025 articles
const TARGET_ARTICLES = 45000; // Middle of 40-50k range

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
 * Load existing 2025 incidents
 */
function loadExisting2025Incidents() {
  try {
    if (fs.existsSync(INCIDENTS_2025_FILE)) {
      const data = fs.readFileSync(INCIDENTS_2025_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error loading incidents from ${INCIDENTS_2025_FILE}:`, error.message);
    return [];
  }
}

/**
 * Save incidents to file
 */
function saveIncidents(incidents) {
  try {
    const json = JSON.stringify(incidents, null, 2);
    fs.writeFileSync(INCIDENTS_2025_FILE, json);
    console.log(`✅ Saved ${incidents.length} incidents to ${INCIDENTS_2025_FILE}`);
  } catch (error) {
    console.error(`Error saving incidents:`, error.message);
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
        const delay = Math.pow(2, attempt) * 1000;
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
 * Get timestamp fallback for missing date
 */
function getTimestampFallback(item) {
  return item.published || item.updated || Math.floor(Date.now() / 1000);
}

/**
 * Generate tags from text using keyword matching
 */
function generateTags(text, config) {
  const tags = new Set();
  const lowerText = text.toLowerCase();
  
  for (const [tag, keywords] of Object.entries(config.tagKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        tags.add(tag);
        break;
      }
    }
  }
  
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
  
  for (let level = 5; level >= 1; level--) {
    const keywords = config.impactKeywords[level.toString()] || [];
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return level;
      }
    }
  }
  
  return 3;
}

/**
 * Transform Inoreader item to incident format
 */
function transformItem(item, feedConfig, config, nextId) {
  const url = item.url || item.canonical?.[0]?.href || item.alternate?.[0]?.href || '';
  
  if (!url) {
    return null;
  }
  
  const title = item.title || 'Untitled';
  const summaryHtml = item.content_html || item.summary?.content || item.content?.content || '';
  const summary = truncate(stripHtml(summaryHtml), 300);
  
  let date;
  if (item.date_published) {
    const parsedDate = new Date(item.date_published);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate.toISOString().split('T')[0];
    } else {
      const timestamp = getTimestampFallback(item);
      date = unixToDate(timestamp);
    }
  } else {
    const timestamp = getTimestampFallback(item);
    date = unixToDate(timestamp);
  }
  
  // Only include articles from 2025
  if (!date.startsWith('2025')) {
    return null;
  }
  
  const combinedText = `${title} ${summary}`;
  const tags = generateTags(combinedText, config);
  const impact = calculateImpact(combinedText, config);
  
  const sourceName = feedConfig.name || 'Unknown';
  const region = feedConfig.defaultRegion;
  const country = feedConfig.defaultCountry;
  
  return {
    id: nextId(),
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
 * Fetch articles from a feed with pagination
 */
async function fetchFeedWithPagination(feedConfig, config, existingUrls) {
  console.log(`\n📡 Processing feed with pagination: ${feedConfig.name}`);
  
  const allNewArticles = [];
  let continuationToken = null;
  let olderThanTimestamp = null; // Unix timestamp for time-based pagination
  let iteration = 0;
  let consecutiveEmptyResponses = 0;
  let totalFetched = 0;
  let oldestArticleDate = null;
  
  const itemsPerRequest = 1000; // Request maximum items per page
  const target2025Start = new Date('2025-01-01T00:00:00Z').getTime() / 1000; // 2025-01-01 in Unix timestamp
  
  while (iteration < MAX_ITERATIONS) {
    iteration++;
    
    // Build URL with continuation token or older-than timestamp
    const separator = feedConfig.url.includes('?') ? '&' : '?';
    let fetchUrl = `${feedConfig.url}${separator}n=${itemsPerRequest}`;
    
    // Use continuation token if available, otherwise use ot (older than) parameter
    if (continuationToken) {
      fetchUrl += `&c=${continuationToken}`;
    } else if (olderThanTimestamp) {
      fetchUrl += `&ot=${olderThanTimestamp}`;
    }
    
    console.log(`\n  📄 Page ${iteration}/${MAX_ITERATIONS}`);
    if (continuationToken) {
      console.log(`     Continuation: ${continuationToken}`);
    } else if (olderThanTimestamp) {
      const otDate = new Date(olderThanTimestamp * 1000).toISOString().split('T')[0];
      console.log(`     Older than: ${otDate} (timestamp: ${olderThanTimestamp})`);
    } else {
      console.log(`     Starting from most recent articles`);
    }
    
    try {
      const data = await fetchWithRetry(fetchUrl);
      
      if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        console.log(`  ⚠️  No items in response`);
        consecutiveEmptyResponses++;
        
        if (consecutiveEmptyResponses >= 3) {
          console.log(`  🛑 Stopping: 3 consecutive empty responses`);
          break;
        }
        
        // Check if there's a continuation token despite no items
        if (data.continuation) {
          continuationToken = data.continuation;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        } else {
          console.log(`  🏁 No more pages available`);
          break;
        }
      }
      
      consecutiveEmptyResponses = 0;
      totalFetched += data.items.length;
      console.log(`  📥 Received ${data.items.length} items (total fetched: ${totalFetched})`);
      
      let newIn2025 = 0;
      let duplicates = 0;
      let outsideYear = 0;
      let oldestTimestampInPage = null; // Track oldest Unix timestamp in this page
      
      for (const item of data.items) {
        try {
          const url = item.url || item.canonical?.[0]?.href || item.alternate?.[0]?.href || '';
          
          // Skip if duplicate
          if (url && existingUrls.has(url)) {
            duplicates++;
            continue;
          }
          
          // Extract date and timestamp to check if it's from 2025
          let articleDate;
          let articleTimestamp;
          if (item.date_published) {
            const parsedDate = new Date(item.date_published);
            if (!isNaN(parsedDate.getTime())) {
              articleDate = parsedDate.toISOString().split('T')[0];
              articleTimestamp = Math.floor(parsedDate.getTime() / 1000);
            } else {
              articleTimestamp = getTimestampFallback(item);
              articleDate = unixToDate(articleTimestamp);
            }
          } else {
            articleTimestamp = getTimestampFallback(item);
            articleDate = unixToDate(articleTimestamp);
          }
          
          // Track oldest article date and timestamp in this page
          if (!oldestArticleDate || articleDate < oldestArticleDate) {
            oldestArticleDate = articleDate;
          }
          if (!oldestTimestampInPage || articleTimestamp < oldestTimestampInPage) {
            oldestTimestampInPage = articleTimestamp;
          }
          
          // Skip if not from 2025
          if (!articleDate.startsWith('2025')) {
            outsideYear++;
            continue;
          }
          
          const transformed = transformItem(item, feedConfig, config, () => {
            // Placeholder ID, will be assigned later
            return 'TEMP';
          });
          
          if (transformed && url) {
            allNewArticles.push(transformed);
            existingUrls.add(url);
            newIn2025++;
          }
        } catch (error) {
          console.error(`  ❌ Error transforming item:`, error.message);
        }
      }
      
      console.log(`  ✅ Page results: ${newIn2025} new 2025 articles, ${duplicates} duplicates, ${outsideYear} outside 2025`);
      console.log(`  📅 Oldest article in this page: ${oldestArticleDate}`);
      
      // Check if we've gone past 2025 (into 2024 or earlier)
      if (oldestArticleDate && oldestArticleDate < '2025-01-01') {
        console.log(`  🛑 Reached articles before 2025, stopping pagination`);
        break;
      }
      
      // Check if oldest timestamp is before our target (2025-01-01)
      if (oldestTimestampInPage && oldestTimestampInPage < target2025Start) {
        console.log(`  🛑 Reached articles before 2025 (timestamp check), stopping pagination`);
        break;
      }
      
      // Determine pagination strategy for next request
      // Priority: continuation token > time-based pagination with ot parameter
      if (data.continuation) {
        continuationToken = data.continuation;
        olderThanTimestamp = null; // Clear ot when we have continuation
        console.log(`  ➡️  Has continuation token, will fetch next page`);
        
        // Respectful delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else if (oldestTimestampInPage && oldestTimestampInPage > target2025Start) {
        // No continuation token, but we haven't reached 2025 yet
        // Use time-based pagination with the oldest timestamp from this page
        olderThanTimestamp = oldestTimestampInPage;
        continuationToken = null;
        const otDate = new Date(olderThanTimestamp * 1000).toISOString().split('T')[0];
        console.log(`  ➡️  No continuation token, using time-based pagination (ot=${otDate})`);
        
        // Respectful delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`  🏁 No continuation token and reached target date range, end of feed`);
        break;
      }
      
    } catch (error) {
      console.error(`  ❌ Failed to fetch page:`, error.message);
      break;
    }
  }
  
  console.log(`\n  📊 Feed summary:`);
  console.log(`     Total pages fetched: ${iteration}`);
  console.log(`     Total items fetched: ${totalFetched}`);
  console.log(`     New 2025 articles: ${allNewArticles.length}`);
  
  return allNewArticles;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting bulk 2025 articles fetch...\n');
  console.log(`📊 Target: ${TARGET_ARTICLES} articles from 2025`);
  console.log(`⚙️  Max iterations per feed: ${MAX_ITERATIONS}`);
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be saved\n');
  }
  
  // Load configuration
  const config = loadConfig();
  console.log(`📋 Loaded configuration with ${config.feeds.length} Inoreader feeds`);
  
  // Load existing 2025 incidents
  const existing2025 = loadExisting2025Incidents();
  console.log(`📚 Currently have ${existing2025.length} articles from 2025`);
  
  const remainingTarget = TARGET_ARTICLES - existing2025.length;
  if (remainingTarget <= 0) {
    console.log(`✅ Already have ${existing2025.length} articles, which meets or exceeds target!`);
    return;
  }
  
  console.log(`🎯 Need ${remainingTarget} more articles to reach target`);
  
  // Build set of existing URLs for deduplication
  const existingUrls = new Set(existing2025.map(inc => inc.sourceUrl));
  
  // Fetch from all feeds with pagination
  const allNewArticles = [];
  
  for (const feedConfig of config.feeds) {
    console.log('\n' + '='.repeat(70));
    const newArticles = await fetchFeedWithPagination(feedConfig, config, existingUrls);
    allNewArticles.push(...newArticles);
    
    console.log(`\n📈 Progress: ${existing2025.length + allNewArticles.length} / ${TARGET_ARTICLES} articles`);
    
    // Check if we've reached target
    if (existing2025.length + allNewArticles.length >= TARGET_ARTICLES) {
      console.log(`🎉 Reached target of ${TARGET_ARTICLES} articles!`);
      break;
    }
    
    // Delay between feeds
    console.log(`\n⏳ Waiting 5 seconds before next feed...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`Previous 2025 articles: ${existing2025.length}`);
  console.log(`New 2025 articles:      ${allNewArticles.length}`);
  console.log(`Total:                  ${existing2025.length + allNewArticles.length}`);
  console.log(`Target:                 ${TARGET_ARTICLES}`);
  console.log('='.repeat(70));
  
  if (allNewArticles.length > 0) {
    if (DRY_RUN) {
      console.log('\n📝 DRY RUN: Would add these articles (showing first 10):');
      for (const article of allNewArticles.slice(0, 10)) {
        console.log(`  ${article.date} - ${article.title.substring(0, 60)}...`);
      }
      if (allNewArticles.length > 10) {
        console.log(`  ... and ${allNewArticles.length - 10} more`);
      }
      console.log('\n⚠️  Not saving changes (dry-run mode)');
    } else {
      // Assign proper sequential IDs (use 5 digits to support up to 99,999 articles)
      let maxId = 0;
      for (const incident of existing2025) {
        if (incident.id && incident.id.startsWith('2025')) {
          const num = parseInt(incident.id.substring(4), 10);
          if (!isNaN(num) && num > maxId) {
            maxId = num;
          }
        }
      }
      
      for (const article of allNewArticles) {
        maxId++;
        article.id = `2025${String(maxId).padStart(5, '0')}`; // 5 digits: supports up to 99,999 articles
      }
      
      // Merge with existing and sort by date (newest first)
      const merged = [...allNewArticles, ...existing2025];
      merged.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      
      saveIncidents(merged);
      console.log(`\n✅ Successfully added ${allNewArticles.length} new 2025 articles!`);
    }
  } else {
    console.log('\n✅ No new articles to add');
  }
  
  console.log('\n🏁 Bulk fetch complete!\n');
}

// Run main function
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
