#!/usr/bin/env node

/**
 * Extract Missing Incidents from global-overview.md
 * 
 * Parses the global overview markdown and extracts incidents that are
 * missing from incidents-2026.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MARKDOWN_FILE = path.join(PROJECT_ROOT, 'news', '2026', '01-january', 'global-overview.md');
const INCIDENTS_FILE = path.join(PROJECT_ROOT, 'data', 'incidents-2026.json');

// Incidents that already exist (based on problem statement and analysis)
const EXISTING_INCIDENTS = [
  'BlackCat/ALPHV Ransomware Prosecutions',
  'Covenant Health Data Breach',
  'ManageMyHealth',
  'Manage My Health',
  'Google Cloud Phishing',
  'Grok AI Deepfake',
  'European Space Agency',
  'Trust Wallet'  // Already exists as "Trust Wallet Chrome Extension Hack"
];

function parseIncidentsFromMarkdown(content) {
  const incidents = [];
  
  // Match incident sections with ### headers - handle both "January 2, 2026" and "January 2026" formats
  const incidentRegex = /### ((?:January|February|March|April|May|June|July|August|September|October|November|December) (?:\d+, )?\d{4}|December \d+, 2025) – ([^\n]+)\s*\n([\s\S]*?)(?=\n### |\n## |$)/g;
  let match;
  
  while ((match = incidentRegex.exec(content)) !== null) {
    const dateStr = match[1].trim();
    const title = match[2].trim();
    const body = match[3].trim();
    
    // Check if this incident already exists
    const shouldSkip = EXISTING_INCIDENTS.some(existing => 
      title.toLowerCase().includes(existing.toLowerCase())
    );
    
    if (shouldSkip) {
      console.log(`Skipping existing incident: ${title}`);
      continue;
    }
    
    // Parse date
    let date = parseDate(dateStr);
    
    // Extract country from title
    let country = extractCountry(title);
    
    // Extract region based on country
    let region = getRegion(country, title);
    
    // Extract attack type
    let attackType = extractField(body, 'Attack Type');
    
    // Extract impact
    let impact = extractField(body, 'Impact');
    
    // Extract details
    let details = extractField(body, 'Details');
    
    // Extract sources
    let sources = extractSources(body);
    
    // Create summary from details
    let summary = createSummary(details, impact);
    
    // Generate tags based on attack type and content
    let tags = generateTags(attackType, title, body);
    
    // Assess impact score
    let impactScore = assessImpactScore(impact, body, title);
    
    incidents.push({
      date,
      title: cleanTitle(title),
      summary,
      region,
      country,
      sourceName: sources.name,
      sourceUrl: sources.url,
      tags,
      impact: impactScore
    });
  }
  
  return incidents;
}

function parseDate(dateStr) {
  // Parse "January 1, 2026", "December 31, 2025", or "January 2026"
  
  // Try exact date format first
  let match = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+),\s+(\d{4})/);
  
  if (match) {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    const month = months[match[1]];
    const day = match[2].padStart(2, '0');
    const year = match[3];
    
    return `${year}-${month}-${day}`;
  }
  
  // Try month-year format (default to day 2 for January 2026 incidents)
  match = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/);
  
  if (match) {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    const month = months[match[1]];
    const year = match[2];
    
    // Default to day 2 for these undated incidents
    return `${year}-${month}-02`;
  }
  
  return '2026-01-02';
}

function cleanTitle(title) {
  // Remove country in parentheses from title
  return title.replace(/\s*\([^)]+\)\s*$/, '').trim();
}

function extractCountry(title) {
  // Extract country from parentheses at end of title
  const match = title.match(/\(([^)]+)\)\s*$/);
  if (match) {
    const location = match[1];
    
    // Handle special cases
    if (location.includes('/')) {
      return location.split('/')[0].trim();
    }
    
    return location;
  }
  
  // If no parentheses, try to extract country from the title itself
  const countryPatterns = [
    { pattern: /\bTaiwan\b/i, country: 'Taiwan' },
    { pattern: /\bSingapore\b/i, country: 'Singapore' },
    { pattern: /\bUK\b|\bU\.K\.\b/i, country: 'United Kingdom' },
    { pattern: /\bChina\b(?!'s)/i, country: 'China' },
    { pattern: /\bHong Kong\b/i, country: 'Hong Kong' },
    { pattern: /\bJapan\b/i, country: 'Japan' },
    { pattern: /\bFrance\b/i, country: 'France' },
    { pattern: /\bGermany\b/i, country: 'Germany' },
    { pattern: /\bIsrael\b/i, country: 'Israel' },
    { pattern: /\bIran\b/i, country: 'Iran' },
    { pattern: /\bRussia\b/i, country: 'Russia' },
    { pattern: /\bIndia\b/i, country: 'India' },
  ];
  
  for (const { pattern, country } of countryPatterns) {
    if (pattern.test(title)) {
      return country;
    }
  }
  
  return 'Global';
}

function getRegion(country, title) {
  const euCountries = ['France', 'Germany', 'Belgium', 'Netherlands', 'Spain', 'Italy', 
                       'Poland', 'Sweden', 'Denmark', 'Finland', 'Austria', 'Ireland',
                       'Portugal', 'Greece', 'Czech Republic', 'Hungary', 'Romania', 
                       'Bulgaria', 'Croatia', 'Slovakia', 'Slovenia', 'Lithuania',
                       'Latvia', 'Estonia', 'Luxembourg', 'Malta', 'Cyprus', 'Europe',
                       'United Kingdom', 'UK'];
  
  const asiaCountries = ['China', 'Hong Kong', 'Taiwan', 'Japan', 'South Korea', 'India',
                        'Singapore', 'Thailand', 'Vietnam', 'Malaysia', 'Indonesia',
                        'Philippines', 'Pakistan', 'Bangladesh', 'Israel', 'New Zealand',
                        'Australia', 'Iran'];
  
  const usCountries = ['United States', 'USA', 'U.S.'];
  
  // Check title and country for Taiwan
  if (country.toLowerCase().includes('taiwan') || title.toLowerCase().includes('taiwan')) {
    return 'ASIA';
  }
  
  if (country === 'Global' || title.toLowerCase().includes('global')) {
    return 'Global';
  }
  
  if (euCountries.includes(country)) {
    return 'EU';
  }
  
  if (asiaCountries.includes(country)) {
    return 'ASIA';
  }
  
  if (usCountries.includes(country) || country === 'United States') {
    return 'US';
  }
  
  // Default to Global for unclear cases
  return 'Global';
}

function extractField(body, fieldName) {
  const regex = new RegExp(`-\\s*\\*\\*${fieldName}:\\*\\*\\s*([^\\n]+)`, 'i');
  const match = body.match(regex);
  return match ? match[1].trim() : '';
}

function extractSources(body) {
  // Try to extract source URL and name
  const sourceMatch = body.match(/-\s*\*\*Sources?:\*\*\s*([^\n]+)/i);
  if (!sourceMatch) {
    return { name: 'Various Sources', url: 'https://thecyberexpress.com/' };
  }
  
  const sourceText = sourceMatch[1];
  
  // Extract URLs
  const urlMatches = sourceText.match(/https?:\/\/[^\s,)]+/g);
  const urls = urlMatches || [];
  
  // Get first URL or default
  const url = urls[0] || 'https://thecyberexpress.com/';
  
  // Extract source name from URL
  let name = 'Various Sources';
  if (urls.length > 0) {
    const hostname = new URL(urls[0]).hostname.replace('www.', '');
    name = hostname.split('.')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Handle known sources
    if (hostname.includes('thecyberexpress')) name = 'The Cyber Express';
    if (hostname.includes('securityaffairs')) name = 'Security Affairs';
    if (hostname.includes('bleepingcomputer')) name = 'BleepingComputer';
    if (hostname.includes('reuters')) name = 'Reuters';
    if (hostname.includes('apnews')) name = 'AP News';
    if (hostname.includes('techcrunch')) name = 'TechCrunch';
    if (hostname.includes('scworld')) name = 'SC World';
    if (hostname.includes('bankinfosecurity')) name = 'Bank Info Security';
    if (hostname.includes('gizmodo')) name = 'Gizmodo';
    if (hostname.includes('digitalforensicsmagazine')) name = 'Digital Forensics Magazine';
    if (hostname.includes('hstoday')) name = 'Homeland Security Today';
    if (hostname.includes('economictimes')) name = 'Economic Times';
    if (hostname.includes('mayerbrown')) name = 'Mayer Brown';
    if (hostname.includes('healthcareitnews')) name = 'Healthcare IT News';
    if (hostname.includes('rnz.co.nz')) name = 'RNZ';
  }
  
  return { name, url };
}

function createSummary(details, impact) {
  if (!details && !impact) {
    return 'Details not available.';
  }
  
  // Use details if available, otherwise use impact
  let text = details || impact;
  
  // Limit to ~200 characters for summary
  if (text.length > 200) {
    text = text.substring(0, 200).trim() + '...';
  }
  
  return text;
}

function generateTags(attackType, title, body) {
  const tags = [];
  const text = (attackType + ' ' + title + ' ' + body).toLowerCase();
  
  // Attack type tags
  if (text.includes('ddos') || text.includes('denial of service') || text.includes('denial-of-service')) {
    tags.push('ddos');
  }
  if (text.includes('ransomware')) {
    tags.push('ransomware');
  }
  if (text.includes('phishing')) {
    tags.push('phishing');
  }
  if (text.includes('malware') && !text.includes('anti-malware')) {
    tags.push('malware');
  }
  if (text.includes('apt') || text.includes('state-sponsored') || text.includes('state-backed')) {
    tags.push('state-sponsored');
  }
  if (text.includes('supply-chain') || text.includes('supply chain') || text.includes('typosquat')) {
    tags.push('supply-chain');
  }
  if (text.includes('data breach') || text.includes('breach') || text.match(/\d+ (?:million|thousand) (?:records|patients|individuals)/)) {
    tags.push('data-breach');
  }
  if (text.includes('vulnerability') || text.includes('cve-') || text.includes('exploit')) {
    tags.push('vulnerability');
  }
  if ((text.includes('deepfake') || text.includes('ai-generated')) && text.includes('abuse')) {
    tags.push('ai-abuse');
  }
  if (text.includes('cryptocurrency') || text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum')) {
    tags.push('cryptocurrency');
  }
  if (text.includes('hacktivist') || text.includes('noname057')) {
    tags.push('hacktivist');
  }
  if (text.includes('terrorist') || text.includes('terrorism')) {
    tags.push('terrorism');
  }
  if (text.includes('disinformation') || text.includes('propaganda')) {
    tags.push('disinformation');
  }
  
  // Target tags
  if (text.includes('healthcare') || text.includes('hospital') || text.includes('patient') || text.includes('medical')) {
    tags.push('healthcare');
  }
  if (text.includes('government') || text.includes('federal') || text.includes('national security')) {
    tags.push('government');
  }
  if (text.includes('critical infrastructure') || text.includes('critical-infrastructure') || text.includes('postal service') || text.includes('energy grid') || text.includes('emergency service')) {
    tags.push('critical-infrastructure');
  }
  if (text.includes('banking') || text.includes('financial') || text.includes('bank') || text.includes('atm')) {
    tags.push('banking');
  }
  if (text.includes('education') || text.includes('university') || text.includes('college')) {
    tags.push('education');
  }
  if (text.includes('aviation') || text.includes('airline')) {
    tags.push('aviation');
  }
  
  // Special tags
  if (text.includes('law enforcement') || text.includes('fbi') || text.includes('takedown') || text.includes('indicted')) {
    tags.push('law-enforcement');
  }
  if (text.includes('gdpr') || text.includes('fine') || text.includes('regulation') || text.includes('compliance')) {
    tags.push('regulation');
  }
  if (text.includes('legislative') || text.includes('policy') || text.includes('ordinance') || text.includes('law amendment')) {
    tags.push('policy');
  }
  if (text.includes('spear-phishing') || text.includes('whatsapp')) {
    tags.push('social-engineering');
  }
  
  // Remove duplicates
  return [...new Set(tags)];
}

function assessImpactScore(impact, body, title) {
  const text = (impact + ' ' + body + ' ' + title).toLowerCase();
  
  // Critical (5): Mass casualties, national security, millions affected, major infrastructure
  if (text.match(/\d+(?:\.\d+)?\s*million/)) {
    // Check if it's about attacks or affected individuals
    if (text.includes('attack') || text.includes('affected') || text.includes('stolen') || text.includes('cyberattack')) {
      return 5;
    }
  }
  if (text.includes('critical infrastructure') || text.includes('national security')) {
    return 5;
  }
  if (text.includes('terrorist') || text.includes('terrorism')) {
    return 5;
  }
  if (text.includes('hundreds of thousands') || text.includes('hundred thousand')) {
    return 5;
  }
  
  // High (4): Significant data breach, major financial loss, critical vulnerability
  if (text.includes('thousands') && (text.includes('affected') || text.includes('breach'))) {
    return 4;
  }
  if (text.includes('critical') && text.includes('vulnerability')) {
    return 4;
  }
  if (text.match(/\$\d+(?:\.\d+)?\s*million/)) {
    return 4;
  }
  if (text.includes('ddos') && (text.includes('knocked') || text.includes('offline') || text.includes('disruption'))) {
    return 4;
  }
  if (text.includes('spear-phishing') || text.includes('apt')) {
    return 4;
  }
  if (text.includes('indicted') && text.includes('members')) {
    return 4;
  }
  
  // Medium (3): Moderate impact, limited scope
  if (text.includes('data breach') || text.includes('breach')) {
    return 3;
  }
  if (text.includes('investigation') || text.includes('fine')) {
    return 3;
  }
  if (text.includes('malicious package') || text.includes('typosquat')) {
    return 3;
  }
  if (text.includes('warning') && text.includes('vulnerability')) {
    return 3;
  }
  
  // Low (2): Policy changes, minor incidents, service launches
  if (text.includes('policy') || text.includes('legislative') || text.includes('ordinance')) {
    return 2;
  }
  if (text.includes('amendment') && text.includes('law')) {
    return 2;
  }
  if (text.includes('launch') && text.includes('service')) {
    return 2;
  }
  
  // Default to 3 (medium)
  return 3;
}

function main() {
  console.log('Extracting missing incidents from global-overview.md...\n');
  
  // Read markdown file
  const markdown = fs.readFileSync(MARKDOWN_FILE, 'utf-8');
  
  // Parse incidents
  const incidents = parseIncidentsFromMarkdown(markdown);
  
  console.log(`\nFound ${incidents.length} missing incidents\n`);
  
  // Read existing incidents
  const existingData = JSON.parse(fs.readFileSync(INCIDENTS_FILE, 'utf-8'));
  
  // Get next ID by finding the highest existing ID
  const maxId = Math.max(...existingData.map(inc => parseInt(inc.id.replace('2026', ''))));
  let nextId = maxId + 1;
  
  // Add IDs to new incidents
  const newIncidents = incidents.map((incident, index) => ({
    id: `2026${(nextId + index).toString().padStart(3, '0')}`,
    ...incident
  }));
  
  // Merge with existing data
  const mergedData = [...existingData, ...newIncidents];
  
  // Sort by date and ID
  mergedData.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.id.localeCompare(b.id);
  });
  
  // Write back to file
  fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(mergedData, null, 2));
  
  console.log('✓ Successfully added incidents to incidents-2026.json\n');
  console.log('New incidents:');
  newIncidents.forEach(incident => {
    console.log(`  ${incident.id}: ${incident.title} (${incident.date})`);
  });
}

main();
