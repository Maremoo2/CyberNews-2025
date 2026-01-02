#!/usr/bin/env node

/**
 * Aggregate News Script
 * 
 * Parses markdown files from /news/2026/ and generates aggregated JSON data
 * for the CyberNews dashboard.
 * 
 * Input: /news/2026/{MM-monthname}/{region}/summary.md
 * Output: /data/news-aggregated-2026.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NEWS_DIR = path.join(PROJECT_ROOT, 'news', '2026');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'data', 'news-aggregated-2026.json');

// Stop words for buzzword filtering (Norwegian and English)
const STOP_WORDS = new Set([
  // Norwegian
  'og', 'er', 'i', 'for', 'av', 'på', 'til', 'med', 'om', 'det', 'en', 'et', 'som', 'ikke', 
  'fra', 'var', 'ved', 'har', 'kan', 'ble', 'vil', 'de', 'den', 'eller', 'men', 'også', 
  'skal', 'disse', 'alle', 'etter', 'være', 'mer', 'blir', 'nå', 'over', 'under', 'når', 
  'mellom', 'før', 'både', 'hvor', 'hvis', 'deg', 'ditt', 'sin', 'sitt', 'sine', 'selv',
  // English
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this',
  'that', 'these', 'those', 'all', 'some', 'any', 'more', 'most', 'about', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'under', 'over', 'each', 'other',
  'kilde', 'kilder', 'url', 'http', 'https', 'www'
]);

const MONTH_MAP = {
  '01-january': 'january',
  '02-february': 'february',
  '03-march': 'march',
  '04-april': 'april',
  '05-may': 'may',
  '06-june': 'june',
  '07-july': 'july',
  '08-august': 'august',
  '09-september': 'september',
  '10-october': 'october',
  '11-november': 'november',
  '12-december': 'december'
};

/**
 * Parse Monthly Statistics section
 */
function parseMonthlyStats(content) {
  const stats = {
    totalIncidents: 0,
    mostTargetedSector: 'N/A',
    mostCommonAttackType: 'N/A',
    severity: { critical: 0, high: 0, medium: 0, low: 0 }
  };

  // Extract Total Incidents
  const totalMatch = content.match(/\*\*Total Incidents:\*\*\s*(\d+)/i);
  if (totalMatch) {
    stats.totalIncidents = parseInt(totalMatch[1], 10);
  }

  // Extract Most Targeted Sector
  const sectorMatch = content.match(/\*\*Most Targeted Sector:\*\*\s*([^\n*]+)/i);
  if (sectorMatch) {
    stats.mostTargetedSector = sectorMatch[1].trim();
  }

  // Extract Most Common Attack Type
  const attackMatch = content.match(/\*\*Most Common Attack Type:\*\*\s*([^\n*]+)/i);
  if (attackMatch) {
    stats.mostCommonAttackType = attackMatch[1].trim();
  }

  // Extract Severity Distribution
  const severityMatch = content.match(/\*\*Severity Distribution:\*\*\s*Critical:\s*(\d+)\s*\|\s*High:\s*(\d+)\s*\|\s*Medium:\s*(\d+)\s*\|\s*Low:\s*(\d+)/i);
  if (severityMatch) {
    stats.severity.critical = parseInt(severityMatch[1], 10);
    stats.severity.high = parseInt(severityMatch[2], 10);
    stats.severity.medium = parseInt(severityMatch[3], 10);
    stats.severity.low = parseInt(severityMatch[4], 10);
  }

  return stats;
}

/**
 * Parse Major Incidents section
 */
function parseIncidents(content) {
  const incidents = [];
  const incidentSection = content.match(/## 🔴 Major Incidents\s*([\s\S]*?)(?=\n## |$)/i);
  
  if (!incidentSection) return incidents;

  // Match each incident block - looking for ### Incident followed by fields
  const incidentBlocks = incidentSection[1].matchAll(/###\s+Incident \d+\s*\n([\s\S]*?)(?=###|##|$)/g);
  
  for (const block of incidentBlocks) {
    const incidentText = block[1];
    const incident = {};

    // Extract Date
    const dateMatch = incidentText.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/i);
    if (dateMatch) incident.date = dateMatch[1];

    // Extract Target
    const targetMatch = incidentText.match(/\*\*Target:\*\*\s*([^\n*]+)/i);
    if (targetMatch) incident.target = targetMatch[1].trim();

    // Extract Attack Type
    const attackMatch = incidentText.match(/\*\*Attack Type:\*\*\s*([^\n*]+)/i);
    if (attackMatch) incident.attackType = attackMatch[1].trim();

    // Extract Impact
    const impactMatch = incidentText.match(/\*\*Impact:\*\*\s*([^\n*]+)/i);
    if (impactMatch) incident.impact = impactMatch[1].trim();

    // Extract Attribution
    const attrMatch = incidentText.match(/\*\*Attribution:\*\*\s*([^\n*]+)/i);
    if (attrMatch) incident.attribution = attrMatch[1].trim();

    // Extract Status
    const statusMatch = incidentText.match(/\*\*Status:\*\*\s*([^\n*]+)/i);
    if (statusMatch) incident.status = statusMatch[1].trim();

    // Extract Source
    const sourceMatch = incidentText.match(/\*\*Source:\*\*\s*([^\n]+)/i);
    if (sourceMatch) incident.source = sourceMatch[1].trim();

    // Only add if we have at least a date or target
    if (incident.date || incident.target) {
      incidents.push(incident);
    }
  }

  return incidents;
}

/**
 * Parse bullet point sections (Trends, Legislation, Key Takeaways)
 */
function parseBulletSection(content, sectionTitle) {
  const items = [];
  const sectionMatch = content.match(new RegExp(`## ${sectionTitle}\\s*([\\s\\S]*?)(?=\\n## |$)`, 'i'));
  
  if (!sectionMatch) return items;

  const bulletPoints = sectionMatch[1].matchAll(/^-\s*(.+?)(?=\n-|\n##|$)/gms);
  
  for (const match of bulletPoints) {
    const item = match[1].trim().replace(/\n/g, ' ');
    // Skip separators like "---" or "--"
    if (item && !item.match(/^-+$/)) {
      items.push(item);
    }
  }

  return items;
}

/**
 * Parse Threat Actor Activity section
 */
function parseThreatActors(content) {
  const actors = [];
  const actorSection = content.match(/## 🔍 Threat Actor Activity\s*([\s\S]*?)(?=\n## |$)/i);
  
  if (!actorSection) return actors;

  // Match each threat actor subsection
  const actorBlocks = actorSection[1].matchAll(/### ([^\n]+)\s*\n([\s\S]*?)(?=###|##|$)/g);
  
  for (const block of actorBlocks) {
    const name = block[1].trim();
    const activity = block[2].trim().replace(/\n+/g, ' ');
    
    // Only add if both name and activity are non-empty
    if (name && activity) {
      actors.push({ name, activity });
    }
  }

  return actors;
}

/**
 * Extract buzzwords from text
 */
function extractBuzzwords(texts) {
  const wordCounts = {};
  
  // Combine all texts
  const combinedText = texts.join(' ');
  
  // Extract words (alphanumeric, including Norwegian characters)
  const words = combinedText.toLowerCase()
    .match(/[a-zæøåäöé]+/gi) || [];
  
  // Count word frequencies
  for (const word of words) {
    // Filter: minimum length 4, not a stop word
    if (word.length >= 4 && !STOP_WORDS.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }
  
  // Sort by frequency and take top 15
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

/**
 * Parse a single summary.md file
 */
function parseSummaryFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const data = {
      ...parseMonthlyStats(content),
      incidents: parseIncidents(content),
      trends: parseBulletSection(content, '📈 Trends & Analysis'),
      legislation: parseBulletSection(content, '🏛️ Legislation & Policy Updates'),
      threatActors: parseThreatActors(content),
      keyTakeaways: parseBulletSection(content, '💡 Key Takeaways')
    };
    
    // Extract buzzwords from trends, threat actors, and key takeaways
    const buzzwordTexts = [
      ...data.trends,
      ...data.threatActors.map(a => a.activity),
      ...data.keyTakeaways
    ];
    data.buzzwords = extractBuzzwords(buzzwordTexts);
    
    return data;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Scan news directory and aggregate data
 */
function aggregateNews() {
  const aggregated = { 2026: {} };
  
  // Check if news directory exists
  if (!fs.existsSync(NEWS_DIR)) {
    console.log(`News directory not found: ${NEWS_DIR}`);
    return aggregated;
  }
  
  // Read all month directories
  const monthDirs = fs.readdirSync(NEWS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
  
  console.log(`Found ${monthDirs.length} month directories`);
  
  for (const monthDir of monthDirs) {
    const monthKey = MONTH_MAP[monthDir];
    if (!monthKey) {
      console.warn(`Skipping unknown month directory: ${monthDir}`);
      continue;
    }
    
    aggregated[2026][monthKey] = {};
    const monthPath = path.join(NEWS_DIR, monthDir);
    
    // Read all region directories
    const regionDirs = fs.readdirSync(monthPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const region of regionDirs) {
      const summaryPath = path.join(monthPath, region, 'summary.md');
      
      if (fs.existsSync(summaryPath)) {
        console.log(`Parsing: ${monthDir}/${region}/summary.md`);
        const data = parseSummaryFile(summaryPath);
        
        if (data) {
          aggregated[2026][monthKey][region] = data;
        }
      }
    }
  }
  
  return aggregated;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting news aggregation...');
  console.log(`News directory: ${NEWS_DIR}`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  console.log('');
  
  // Aggregate the news
  const aggregated = aggregateNews();
  
  // Ensure data directory exists
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write output file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(aggregated, null, 2), 'utf-8');
  
  console.log('');
  console.log('✅ Aggregation complete!');
  console.log(`Output written to: ${OUTPUT_FILE}`);
  
  // Print summary
  const months = Object.keys(aggregated[2026] || {});
  console.log(`\nProcessed ${months.length} month(s):`);
  for (const month of months) {
    const regions = Object.keys(aggregated[2026][month]);
    console.log(`  - ${month}: ${regions.join(', ')}`);
  }
}

// Run the script
main();
