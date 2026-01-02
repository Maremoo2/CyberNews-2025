#!/usr/bin/env node

/**
 * Markdown News Aggregator
 * 
 * Parses markdown summary files from /news/2026/ directory and generates
 * aggregated JSON data for the Trend Dashboard.
 * 
 * Usage: node scripts/aggregate-news.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NEWS_DIR = path.join(PROJECT_ROOT, 'news', '2026');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'data', 'news-aggregated-2026.json');

// Month name mappings
const MONTH_FOLDERS = {
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

const REGION_FOLDERS = ['norway', 'eu', 'us', 'asia'];

// Stop words to filter out from buzzwords (Norwegian and English)
const STOP_WORDS = new Set([
  'og', 'er', 'i', 'for', 'på', 'til', 'med', 'av', 'som', 'en', 'et', 'det', 'den', 
  'de', 'var', 'har', 'kan', 'ved', 'fra', 'ikke', 'om', 'men', 'også', 'bli', 'ble',
  'and', 'the', 'of', 'to', 'in', 'a', 'is', 'that', 'for', 'it', 'with', 'as', 'was',
  'on', 'are', 'be', 'this', 'by', 'at', 'or', 'from', 'an', 'have', 'has', 'had',
  'their', 'more', 'been', 'other', 'were', 'which', 'they', 'all', 'when', 'there',
  'can', 'will', 'if', 'who', 'what', 'so', 'up', 'out', 'about', 'into', 'than',
  'them', 'may', 'its', 'only', 'over', 'such', 'some', 'could', 'would', 'should'
]);

/**
 * Parse a section from markdown content
 */
function parseSection(content, sectionTitle) {
  const sectionRegex = new RegExp(`## ${sectionTitle}\\s*([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const match = content.match(sectionRegex);
  return match ? match[1].trim() : '';
}

/**
 * Parse statistics from markdown
 */
function parseStatistics(content) {
  const statsSection = parseSection(content, 'Statistics');
  
  const stats = {
    totalIncidents: 0,
    mostTargetedSector: 'N/A',
    mostCommonAttackType: 'N/A',
    severity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  };
  
  if (!statsSection) return stats;
  
  // Try to extract total incidents
  const incidentMatch = statsSection.match(/(\d+)\s+(?:serious\s+)?(?:cyber\s+)?incidents?/i);
  if (incidentMatch) {
    stats.totalIncidents = parseInt(incidentMatch[1], 10);
  }
  
  // Try to extract most targeted sector
  const sectorMatch = statsSection.match(/(?:most|top)\s+(?:targeted|affected)\s+(?:sector|industry)[:\s]+([^\n,]+)/i);
  if (sectorMatch) {
    stats.mostTargetedSector = sectorMatch[1].trim();
  } else {
    // Try numbered list format
    const sectorListMatch = statsSection.match(/1\.\s+\*\*([^*]+)\*\*/);
    if (sectorListMatch) {
      stats.mostTargetedSector = sectorListMatch[1].trim();
    }
  }
  
  // Try to extract most common attack type
  const attackMatch = statsSection.match(/(?:most|primary)\s+(?:common|frequent)\s+(?:attack|threat)[:\s]+([^\n,]+)/i);
  if (attackMatch) {
    stats.mostCommonAttackType = attackMatch[1].trim();
  }
  
  // Parse severity distribution
  const criticalMatch = statsSection.match(/critical[:\s]+(\d+)/i);
  const highMatch = statsSection.match(/(?:high|alvorlig)[:\s]+(\d+)/i);
  const mediumMatch = statsSection.match(/(?:medium|moderat)[:\s]+(\d+)/i);
  const lowMatch = statsSection.match(/low[:\s]+(\d+)/i);
  
  if (criticalMatch) stats.severity.critical = parseInt(criticalMatch[1], 10);
  if (highMatch) stats.severity.high = parseInt(highMatch[1], 10);
  if (mediumMatch) stats.severity.medium = parseInt(mediumMatch[1], 10);
  if (lowMatch) stats.severity.low = parseInt(lowMatch[1], 10);
  
  return stats;
}

/**
 * Parse major incidents from markdown
 */
function parseIncidents(content) {
  const incidents = [];
  
  // Look for Major Incidents section or individual incident blocks
  const majorIncidentsSection = parseSection(content, 'Major Incidents');
  if (!majorIncidentsSection) return incidents;
  
  // Match incident blocks with ### headers
  const incidentRegex = /### ([^\n]+)\s*\n([\s\S]*?)(?=\n### |\n## |$)/g;
  let match;
  
  while ((match = incidentRegex.exec(majorIncidentsSection)) !== null) {
    const title = match[1].trim();
    const body = match[2].trim();
    
    const incident = {
      date: 'N/A',
      target: 'N/A',
      attackType: 'N/A',
      impact: 'N/A',
      attribution: 'N/A',
      status: 'N/A',
      source: 'N/A'
    };
    
    // Extract date
    const dateMatch = body.match(/[-*]\s*\*\*Date:\*\*\s*([^\n]+)/i) || 
                      title.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      incident.date = dateMatch[1].trim();
    }
    
    // Extract target
    const targetMatch = body.match(/[-*]\s*\*\*Target:\*\*\s*([^\n]+)/i);
    if (targetMatch) {
      incident.target = targetMatch[1].trim();
    } else {
      // Use title if no explicit target
      incident.target = title;
    }
    
    // Extract attack type
    const attackMatch = body.match(/[-*]\s*\*\*Attack\s+Type:\*\*\s*([^\n]+)/i);
    if (attackMatch) {
      incident.attackType = attackMatch[1].trim();
    }
    
    // Extract impact
    const impactMatch = body.match(/[-*]\s*\*\*Impact:\*\*\s*([^\n]+)/i);
    if (impactMatch) {
      incident.impact = impactMatch[1].trim();
    }
    
    // Extract attribution
    const attrMatch = body.match(/[-*]\s*\*\*Attribution:\*\*\s*([^\n]+)/i);
    if (attrMatch) {
      incident.attribution = attrMatch[1].trim();
    }
    
    // Extract status
    const statusMatch = body.match(/[-*]\s*\*\*Status:\*\*\s*([^\n]+)/i);
    if (statusMatch) {
      incident.status = statusMatch[1].trim();
    }
    
    // Extract source
    const sourceMatch = body.match(/[-*]\s*\*\*Source:\*\*\s*([^\n]+)/i);
    if (sourceMatch) {
      incident.source = sourceMatch[1].trim();
    }
    
    incidents.push(incident);
  }
  
  return incidents;
}

/**
 * Parse trends and analysis
 */
function parseTrends(content) {
  const trendsSection = parseSection(content, 'Key Trends');
  if (!trendsSection) return [];
  
  const trends = [];
  
  // Match subsections with ### headers
  const subsectionRegex = /### ([^\n]+)\s*\n([\s\S]*?)(?=\n### |\n## |$)/g;
  let match;
  
  while ((match = subsectionRegex.exec(trendsSection)) !== null) {
    const title = match[1].trim();
    const body = match[2].trim();
    // Take first paragraph or first 200 chars
    const preview = body.split('\n\n')[0].substring(0, 200);
    trends.push(`${title}: ${preview}...`);
  }
  
  return trends;
}

/**
 * Parse legislation and policy updates
 */
function parseLegislation(content) {
  const legislationSection = parseSection(content, 'Legislation & Policy Updates') ||
                            parseSection(content, 'Government Cybersecurity Initiatives');
  if (!legislationSection) return [];
  
  const legislation = [];
  
  // Match subsections with ### headers
  const subsectionRegex = /### ([^\n]+)\s*\n([\s\S]*?)(?=\n### |\n## |$)/g;
  let match;
  
  while ((match = subsectionRegex.exec(legislationSection)) !== null) {
    const title = match[1].trim();
    const body = match[2].trim();
    // Take first paragraph or first 200 chars
    const preview = body.split('\n\n')[0].substring(0, 200);
    legislation.push(`${title}: ${preview}...`);
  }
  
  return legislation;
}

/**
 * Parse threat actor activity
 */
function parseThreatActors(content) {
  const threatActors = [];
  
  // Look for threat actor section specifically
  const threatActorSection = parseSection(content, 'Threat Actor Activity');
  
  if (threatActorSection) {
    // Match subsections with ### headers
    const subsectionRegex = /### ([^\n]+)\s*\n([\s\S]*?)(?=\n### |\n## |$)/g;
    let match;
    
    while ((match = subsectionRegex.exec(threatActorSection)) !== null) {
      const name = match[1].trim();
      const activity = match[2].trim().substring(0, 200);
      
      // Filter out section-like headers
      if (!name.includes('\n') && name.length < 100) {
        threatActors.push({ name, activity });
      }
    }
  }
  
  // If no dedicated section, look for common threat actor patterns
  if (threatActors.length === 0) {
    const actorKeywords = ['APT', 'threat actor', 'hacktivist', 'ransomware group', 'cyber criminal'];
    for (const keyword of actorKeywords) {
      const regex = new RegExp(`(?:${keyword})[^.]+?([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){0,3})`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        for (const match of matches.slice(0, 5)) {
          threatActors.push({ name: match.substring(0, 50), activity: 'Activity detected in threat landscape' });
        }
      }
    }
  }
  
  return threatActors.slice(0, 10); // Limit to top 10
}

/**
 * Parse key takeaways
 */
function parseKeyTakeaways(content) {
  const takeawaysSection = parseSection(content, 'Looking Ahead') ||
                          parseSection(content, 'Conclusion') ||
                          parseSection(content, 'Impact Assessment');
  
  if (!takeawaysSection) return [];
  
  const takeaways = [];
  
  // Match bullet points
  const bulletRegex = /[-*]\s+(?:\*\*)?([^\n]+?)(?:\*\*)?\s*$/gm;
  let match;
  
  while ((match = bulletRegex.exec(takeawaysSection)) !== null) {
    const text = match[1].trim();
    if (text.length > 20 && text.length < 300) {
      takeaways.push(text);
    }
  }
  
  return takeaways.slice(0, 10); // Limit to top 10
}

/**
 * Extract buzzwords from text content
 */
function extractBuzzwords(texts) {
  const wordFreq = {};
  
  // Combine all texts
  const combinedText = texts.join(' ').toLowerCase();
  
  // Extract words (alphanumeric sequences of 3+ chars)
  const words = combinedText.match(/\b[a-zæøå]{3,}\b/gi) || [];
  
  for (const word of words) {
    const cleaned = word.toLowerCase();
    
    // Skip stop words and very common words
    if (STOP_WORDS.has(cleaned)) continue;
    if (cleaned.length < 4) continue;
    
    wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
  }
  
  // Sort by frequency and return top 15
  const sorted = Object.entries(wordFreq)
    .filter(([, count]) => count >= 2) // Must appear at least twice
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
  
  return sorted;
}

/**
 * Parse a single markdown file
 */
function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const stats = parseStatistics(content);
    const incidents = parseIncidents(content);
    const trends = parseTrends(content);
    const legislation = parseLegislation(content);
    const threatActors = parseThreatActors(content);
    const keyTakeaways = parseKeyTakeaways(content);
    
    // Extract buzzwords from trends, threat actors, and key takeaways
    const buzzwordTexts = [
      ...trends,
      ...threatActors.map(a => a.activity),
      ...keyTakeaways
    ];
    const buzzwords = extractBuzzwords(buzzwordTexts);
    
    return {
      ...stats,
      incidents,
      trends,
      legislation,
      threatActors,
      keyTakeaways,
      buzzwords
    };
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main aggregation function
 */
function aggregateNews() {
  console.log('Starting news aggregation...');
  
  // Check if 2026 directory exists
  if (!fs.existsSync(NEWS_DIR)) {
    console.log(`News directory ${NEWS_DIR} does not exist. Creating empty aggregated file.`);
    const emptyData = { "2026": {} };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(emptyData, null, 2));
    console.log(`Created empty aggregated file: ${OUTPUT_FILE}`);
    return;
  }
  
  const aggregatedData = { "2026": {} };
  
  // Read month folders
  const monthFolders = fs.readdirSync(NEWS_DIR).filter(f => {
    const fullPath = path.join(NEWS_DIR, f);
    return fs.statSync(fullPath).isDirectory() && MONTH_FOLDERS[f];
  });
  
  console.log(`Found ${monthFolders.length} month folders`);
  
  for (const monthFolder of monthFolders) {
    const monthName = MONTH_FOLDERS[monthFolder];
    aggregatedData["2026"][monthName] = {};
    
    console.log(`Processing ${monthName}...`);
    
    // Read region folders
    for (const region of REGION_FOLDERS) {
      const summaryPath = path.join(NEWS_DIR, monthFolder, region, 'summary.md');
      
      if (fs.existsSync(summaryPath)) {
        console.log(`  Parsing ${region}/summary.md`);
        const regionData = parseMarkdownFile(summaryPath);
        
        if (regionData) {
          aggregatedData["2026"][monthName][region] = regionData;
        }
      } else {
        console.log(`  Skipping ${region} (no summary.md found)`);
      }
    }
  }
  
  // Write output file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(aggregatedData, null, 2));
  console.log(`\nAggregation complete! Output written to: ${OUTPUT_FILE}`);
  
  // Print summary
  let totalMonths = 0;
  let totalRegions = 0;
  let totalIncidents = 0;
  
  for (const monthData of Object.values(aggregatedData["2026"])) {
    totalMonths++;
    for (const regionData of Object.values(monthData)) {
      totalRegions++;
      totalIncidents += regionData.incidents ? regionData.incidents.length : 0;
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`  - Months processed: ${totalMonths}`);
  console.log(`  - Regions processed: ${totalRegions}`);
  console.log(`  - Total incidents: ${totalIncidents}`);
}

// Run the aggregation
aggregateNews();
