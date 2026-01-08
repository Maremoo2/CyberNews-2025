#!/usr/bin/env node

/**
 * AI-Powered Article Enrichment Script
 * 
 * This script enriches articles from incidents-2026.json by:
 * 1. Scraping full article content from source URLs
 * 2. Using GitHub Models API (gpt-4o-mini) to analyze content
 * 3. Extracting structured metadata (status, buzzwords, threat actors, etc.)
 * 4. Saving enriched data to incidents-2026-enriched.json
 * 
 * Usage: node scripts/enrich-articles.js [--dry-run] [--limit N]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(PROJECT_ROOT, 'config', 'enrichment-config.json');
const INCIDENTS_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2026.json');
const ENRICHED_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2026-enriched.json');

// Status constants
const STATUS = {
  NEW: 'New',
  ONGOING: 'Ongoing',
  RESOLVED: 'Resolved',
  ESCALATING: 'Escalating',
  UNKNOWN: 'Unknown'
};

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const LIMIT = limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1]) : null;

// Statistics
const stats = {
  total: 0,
  alreadyEnriched: 0,
  scraped: 0,
  analyzed: 0,
  failed: 0,
  errors: []
};

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
 * Load incidents from file
 */
function loadIncidents(filePath) {
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
 * Save enriched incidents to file
 */
function saveEnrichedIncidents(incidents) {
  try {
    const json = JSON.stringify(incidents, null, 2);
    fs.writeFileSync(ENRICHED_FILE, json);
    console.log(`\n✅ Saved ${incidents.length} enriched incidents to ${ENRICHED_FILE}`);
  } catch (error) {
    console.error(`Error saving enriched incidents to ${ENRICHED_FILE}:`, error.message);
    throw error;
  }
}

/**
 * Delay function for rate limiting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrape article content from URL using Readability
 */
async function scrapeArticle(url, config) {
  const maxRetries = config.maxRetries || 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`    Scraping (attempt ${attempt}/${maxRetries})...`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.requestTimeout || 30000);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CyberNews-Bot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();
      
      if (!article) {
        throw new Error('Readability failed to parse article');
      }

      return {
        title: article.title || '',
        content: article.textContent || '',
        excerpt: article.excerpt || ''
      };
    } catch (error) {
      console.log(`    Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delayMs = Math.pow(2, attempt) * 1000;
      console.log(`    Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }
}

/**
 * Truncate text to max length at word boundary
 */
function truncateAtWordBoundary(text, maxLength) {
  if (!text) {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If we found a space, cut there; otherwise use the hard limit
  return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
}

/**
 * Call GitHub Models API for AI analysis
 */
async function enrichWithAI(articleContent, title, originalSummary, config, buzzwordsList, maxRetries = 3) {
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  // Truncate content to max length at word boundary
  const truncatedContent = truncateAtWordBoundary(articleContent, config.maxContentLength);

  const systemPrompt = `You are a cybersecurity analyst. Analyze articles and extract structured information in JSON format.`;

  const userPrompt = `Analyze this cybersecurity article and return JSON with the following fields:

- summary (string, max 300 chars): Concise summary
- status (string): One of: "New", "Ongoing", "Resolved", "Escalating"
- buzzwords (array): Cybersecurity terms from this list: ${buzzwordsList}
- threatActors (array): Named threat actor groups (e.g., "Lazarus Group", "LockBit", "APT29")
- malwareFamilies (array): Malware names (e.g., "Emotet", "TrickBot", "Clop")
- companies (array): Affected companies or vendors
- cves (array): CVE identifiers mentioned (e.g., "CVE-2026-1234")
- mitreAttack (array): MITRE ATT&CK technique IDs if mentioned (e.g., "T1566.001")
- impactScore (number 1-5): Severity assessment
- region (string): Primary affected region (e.g., "US", "EU", "Global", "NO")
- country (string): Primary affected country
- trends (array): Emerging trends or patterns (e.g., "AI-powered attacks", "Cloud misconfiguration")

Article Title: ${title}

Original Summary: ${originalSummary}

Article Content:
${truncatedContent}

Return ONLY valid JSON, no markdown formatting.`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`    AI analysis (attempt ${attempt}/${maxRetries})...`);
      
      const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${githubToken}`
        },
        body: JSON.stringify({
          model: config.aiModel,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response format from AI API');
      }

      const content = result.choices[0].message.content;
      
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonText = content.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = JSON.parse(jsonText);
      
      // Validate required fields
      if (!parsed.summary || !parsed.status) {
        throw new Error('AI response missing required fields');
      }

      return parsed;
    } catch (error) {
      console.log(`    Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delayMs = Math.pow(2, attempt) * 1000;
      console.log(`    Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }
}

/**
 * Process a single incident
 */
async function processIncident(incident, config, buzzwordsList) {
  console.log(`\n  Processing: ${incident.id} - ${incident.title.substring(0, 60)}...`);
  
  try {
    // Scrape article content
    const scraped = await scrapeArticle(incident.sourceUrl, config);
    console.log(`    ✓ Scraped ${scraped.content.length} characters`);
    stats.scraped++;
    
    // Add delay before AI call
    await delay(config.delayBetweenRequests);
    
    // Get AI analysis
    const aiAnalysis = await enrichWithAI(
      scraped.content,
      incident.title,
      incident.summary,
      config,
      buzzwordsList,
      config.maxRetries
    );
    console.log(`    ✓ AI analysis complete`);
    stats.analyzed++;
    
    // Merge and return enriched incident
    return {
      ...incident,
      fullContent: scraped.content,
      aiAnalysis: {
        summary: aiAnalysis.summary || incident.summary,
        status: aiAnalysis.status || STATUS.UNKNOWN,
        buzzwords: Array.isArray(aiAnalysis.buzzwords) ? aiAnalysis.buzzwords : [],
        threatActors: Array.isArray(aiAnalysis.threatActors) ? aiAnalysis.threatActors : [],
        malwareFamilies: Array.isArray(aiAnalysis.malwareFamilies) ? aiAnalysis.malwareFamilies : [],
        companies: Array.isArray(aiAnalysis.companies) ? aiAnalysis.companies : [],
        cves: Array.isArray(aiAnalysis.cves) ? aiAnalysis.cves : [],
        mitreAttack: Array.isArray(aiAnalysis.mitreAttack) ? aiAnalysis.mitreAttack : [],
        impactScore: aiAnalysis.impactScore || 3,
        region: aiAnalysis.region || incident.region || 'Global',
        country: aiAnalysis.country || incident.country || 'Global',
        trends: Array.isArray(aiAnalysis.trends) ? aiAnalysis.trends : []
      },
      enrichedAt: new Date().toISOString(),
      enrichmentVersion: '1.0'
    };
  } catch (error) {
    console.log(`    ✗ Failed: ${error.message}`);
    stats.failed++;
    stats.errors.push({
      id: incident.id,
      title: incident.title,
      error: error.message
    });
    
    // Return original incident without enrichment
    return incident;
  }
}

/**
 * Process incidents in batches
 */
async function processBatch(incidents, config, buzzwordsList) {
  const enrichedIncidents = [];
  const progressSaveInterval = config.progressSaveInterval || 5;
  
  for (let i = 0; i < incidents.length; i += config.batchSize) {
    const batch = incidents.slice(i, i + config.batchSize);
    const batchNumber = Math.floor(i / config.batchSize) + 1;
    const totalBatches = Math.ceil(incidents.length / config.batchSize);
    
    console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} incidents)...`);
    
    // Process batch items sequentially to respect rate limits
    for (const incident of batch) {
      const enriched = await processIncident(incident, config, buzzwordsList);
      enrichedIncidents.push(enriched);
      
      // Save progress incrementally based on config
      if (enrichedIncidents.length % progressSaveInterval === 0 && !DRY_RUN) {
        console.log(`\n  💾 Saving progress (${enrichedIncidents.length} incidents)...`);
        const allEnriched = [...enrichedIncidents];
        saveEnrichedIncidents(allEnriched);
      }
    }
    
    // Add delay between batches
    if (i + config.batchSize < incidents.length) {
      console.log(`\n  ⏳ Waiting ${config.delayBetweenRequests}ms before next batch...`);
      await delay(config.delayBetweenRequests);
    }
  }
  
  return enrichedIncidents;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting article enrichment with AI...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be saved\n');
  }
  
  if (LIMIT) {
    console.log(`⚠️  LIMIT MODE - Processing only ${LIMIT} articles\n`);
  }
  
  // Load configuration
  const config = loadConfig();
  console.log(`📋 Loaded configuration (model: ${config.aiModel}, batch size: ${config.batchSize})`);
  
  // Load incidents
  const incidents = loadIncidents(INCIDENTS_FILE);
  console.log(`📚 Loaded ${incidents.length} incidents from ${INCIDENTS_FILE}`);
  
  if (incidents.length === 0) {
    console.log('\n⚠️  No incidents to process');
    process.exit(0);
  }
  
  // Load existing enriched data (if any)
  const existingEnriched = loadIncidents(ENRICHED_FILE);
  const enrichedIds = new Set(
    existingEnriched
      .filter(inc => inc.aiAnalysis && inc.enrichedAt)
      .map(inc => inc.id)
  );
  
  console.log(`📝 Found ${enrichedIds.size} already enriched incidents`);
  
  // Filter to only process new incidents
  let toProcess = incidents.filter(inc => !enrichedIds.has(inc.id));
  stats.alreadyEnriched = incidents.length - toProcess.length;
  
  if (LIMIT && toProcess.length > LIMIT) {
    console.log(`\n⚠️  Limiting to ${LIMIT} incidents (${toProcess.length} available)`);
    toProcess = toProcess.slice(0, LIMIT);
  }
  
  if (toProcess.length === 0) {
    console.log('\n✅ All incidents are already enriched!');
    process.exit(0);
  }
  
  stats.total = toProcess.length;
  console.log(`\n🔄 Processing ${toProcess.length} new incidents...\n`);
  
  // Pre-compute buzzwords list for efficiency
  const buzzwordsList = Object.values(config.buzzwords).flat().join(', ');
  
  // Process incidents
  const enrichedNew = await processBatch(toProcess, config, buzzwordsList);
  
  // Merge with existing enriched data
  const allEnriched = [...enrichedNew, ...existingEnriched];
  
  // Sort by date (newest first)
  allEnriched.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 ENRICHMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total incidents:          ${incidents.length}`);
  console.log(`Already enriched:         ${stats.alreadyEnriched}`);
  console.log(`Processed:                ${stats.total}`);
  console.log(`Successfully scraped:     ${stats.scraped}`);
  console.log(`Successfully analyzed:    ${stats.analyzed}`);
  console.log(`Failed:                   ${stats.failed}`);
  console.log('='.repeat(60));
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    for (const error of stats.errors) {
      console.log(`  - ${error.id}: ${error.title.substring(0, 50)}... - ${error.error}`);
    }
  }
  
  // Save results
  if (!DRY_RUN) {
    saveEnrichedIncidents(allEnriched);
    console.log(`\n✅ Successfully enriched ${stats.analyzed} new articles!`);
  } else {
    console.log('\n📝 DRY RUN: Sample enriched incident:\n');
    if (enrichedNew.length > 0 && enrichedNew[0].aiAnalysis) {
      // Show first 2000 characters with proper truncation
      const sample = JSON.stringify(enrichedNew[0], null, 2);
      const truncated = truncateAtWordBoundary(sample, 2000);
      console.log(truncated);
      if (sample.length > 2000) {
        console.log('...(truncated)');
      }
    }
    console.log('\n⚠️  Not saving changes (dry-run mode)');
  }
  
  console.log('\n🏁 Enrichment complete!\n');
  process.exit(0);
}

// Run main function
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
