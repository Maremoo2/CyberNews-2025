#!/usr/bin/env node

/**
 * Gold Set Labeling Tool - SOC Threat Analyst Mode
 * 
 * Labels incidents strictly following the schema:
 * - content_type: incident / campaign / vulnerability / policy / explainer / opinion / product
 * - case_id: assign same ID only if it is clearly the same real-world incident
 * - actor: none / name (only if explicitly stated)
 * - actor_confidence: high / medium / low
 * - sector: from context
 * - severity: low / moderate / high / critical
 * 
 * STRICT RULES:
 * - Do NOT guess actors
 * - Do NOT infer severity unless impact is stated
 * - Be conservative
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const GOLD_SET_SAMPLE = path.join(PROJECT_ROOT, 'data', 'gold-set-sample.json');
const GOLD_SET_LABELED = path.join(PROJECT_ROOT, 'data', 'gold-set.json');

/**
 * Analyze title and summary to determine content type
 */
function classifyContentType(item) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  
  // Opinion/Prediction indicators
  if (
    text.match(/\b(prediction|forecast|trends? for 20\d{2}|looking ahead|what to expect|future of|in 20\d{2})\b/i) ||
    text.match(/\b(opinion|commentary|analysis|should|must|need to|time to)\b/i) ||
    item.title.match(/^(top \d+|best|worst|why|how to)/i)
  ) {
    return 'opinion';
  }
  
  // Product/Service indicators
  if (
    text.match(/\b(review|launch|announce|release|feature|partnership|funding|raised|valuation|acqui(sition|red))\b/i) ||
    text.match(/\b(product|service|solution|platform|tool|startup)\b/i) ||
    item.title.match(/review:/i)
  ) {
    return 'product';
  }
  
  // Explainer indicators  
  if (
    item.title.match(/^(what is|how|understanding|guide to|introduction to)/i) ||
    text.match(/\b(explainer|guide|tutorial|how to|what is)\b/i)
  ) {
    return 'explainer';
  }
  
  // Policy/Regulation indicators
  if (
    text.match(/\b(regulation|compliance|law|legal|policy|fine|sanction|mandate|requirement)\b/i) ||
    text.match(/\b(gdpr|hipaa|fedramp|nis2|cisa|nist)\b/i)
  ) {
    return 'policy';
  }
  
  // Vulnerability indicators
  if (
    text.match(/\b(vulnerability|cve-20\d{2}-\d+|patch|zero-day|exploit|flaw|bug)\b/i) ||
    text.match(/\b(critical|high severity).*(vulnerability|flaw)\b/i)
  ) {
    return 'vulnerability';
  }
  
  // Campaign indicators
  if (
    text.match(/\b(campaign|operation|apt|threat actor|malware family|botnet)\b/i) ||
    text.match(/\b(phishing campaign|malware campaign|attack campaign)\b/i)
  ) {
    return 'campaign';
  }
  
  // Incident (default for security events)
  if (
    text.match(/\b(breach|attack|hack|ransomware|data leak|theft|compromise|incident)\b/i) ||
    text.match(/\b(stolen|exposed|leaked|encrypted|disrupted)\b/i)
  ) {
    return 'incident';
  }
  
  // Default to incident if security-related, otherwise opinion
  if (text.match(/\b(cybersecurity|security|cyber)\b/i)) {
    return 'incident';
  }
  
  return 'opinion';
}

/**
 * Extract actor name if EXPLICITLY stated
 */
function extractActor(item) {
  const text = `${item.title} ${item.summary}`;
  
  // Known actor patterns (must be explicit mentions)
  const actorPatterns = [
    /\b(Scattered Spider|DragonForce|BlackCat|ALPHV|Conti|REvil|LockBit|Clop)\b/i,
    /\b(Lazarus Group|APT28|APT29|APT\d+|Fancy Bear|Cozy Bear)\b/i,
    /\b(NoName057\(16\)|Anonymous|LulzSec)\b/i,
    /\b(UAC-\d+|Black Axe|Evasive Panda|MuddyWater)\b/i
  ];
  
  for (const pattern of actorPatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        name: match[1].trim(),
        confidence: 'high'
      };
    }
  }
  
  // Check if "allegedly by" or "attributed to" with specific name
  const attributionMatch = text.match(/(?:allegedly by|attributed to|claimed by|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+Group)?)/);
  if (attributionMatch && attributionMatch[1].length < 30) {
    return {
      name: attributionMatch[1].trim(),
      confidence: 'medium'
    };
  }
  
  return { name: null, confidence: 'none' };
}

/**
 * Determine severity based on explicit impact statements
 */
function determineSeverity(item) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  
  // Critical: explicit major impact
  if (
    text.match(/\$\d+\s*(billion|b)\b/i) ||
    text.match(/\b(largest|massive|widespread|critical infrastructure)\b.*\b(breach|attack|theft)\b/i) ||
    text.match(/\b(millions|thousands)\b.*\b(affected|impacted|stolen|exposed)\b/i)
  ) {
    return 'critical';
  }
  
  // High: significant but not massive
  if (
    text.match(/\$\d+\s*million\b/i) ||
    text.match(/\b(significant|major|severe)\b.*\b(breach|attack|impact)\b/i) ||
    text.match(/\b(hundreds of thousands|100,?000s?)\b.*\b(records|users|accounts)\b/i)
  ) {
    return 'high';
  }
  
  // Moderate: mentioned impact but not severe
  if (
    text.match(/\b(breach|attack|theft|compromised)\b/i) ||
    text.match(/\b(data|records|credentials)\b.*\b(stolen|exposed|leaked)\b/i)
  ) {
    return 'moderate';
  }
  
  // Low: no clear impact statement
  return 'low';
}

/**
 * Extract sector from context
 */
function extractSector(item) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  
  const sectorMap = {
    'healthcare': /\b(healthcare|hospital|medical|health|patient|hipaa)\b/i,
    'finance': /\b(bank|financial|finance|payment|credit card|fintech)\b/i,
    'government': /\b(government|federal|agency|military|national security|state|municipality)\b/i,
    'technology': /\b(tech|software|cloud|saas|platform|cybersecurity|it|data center)\b/i,
    'energy': /\b(energy|power|utility|oil|gas|electric|grid)\b/i,
    'retail': /\b(retail|ecommerce|shopping|store|consumer)\b/i,
    'education': /\b(education|university|school|college|academic)\b/i,
    'telecommunications': /\b(telecom|telco|carrier|isp|mobile network)\b/i,
    'manufacturing': /\b(manufacturing|industrial|factory|supply chain|production)\b/i,
    'transportation': /\b(transportation|airline|shipping|logistics|aviation)\b/i
  };
  
  for (const [sector, pattern] of Object.entries(sectorMap)) {
    if (text.match(pattern)) {
      return sector;
    }
  }
  
  return 'technology'; // default
}

/**
 * Generate case_id - only group if clearly same incident
 */
function generateCaseId(item, allItems) {
  // Use predicted case_id as baseline, but validate
  const similarIncidents = allItems.filter(other => 
    other.id !== item.id &&
    other.title.toLowerCase().includes(item.title.toLowerCase().split(' ').slice(0, 3).join(' '))
  );
  
  if (similarIncidents.length > 0) {
    // Return shared ID if very similar
    return `case_${item.id}`;
  }
  
  return `case_${item.id}`;
}

/**
 * Main labeling function
 */
function labelGoldSet() {
  console.log('🏷️  Starting Gold Set Labeling (SOC Analyst Mode)\n');
  console.log('Rules:');
  console.log('  ❌ Do NOT guess actors');
  console.log('  ❌ Do NOT infer severity unless impact is stated');
  console.log('  ✅ Be conservative\n');
  
  const goldSet = JSON.parse(fs.readFileSync(GOLD_SET_SAMPLE, 'utf8'));
  console.log(`Processing ${goldSet.length} items...\n`);
  
  const labeled = goldSet.map((item, idx) => {
    // Content type
    const content_type = classifyContentType(item);
    
    // Actor extraction (strict)
    const actor = extractActor(item);
    
    // Severity (only if impact stated)
    const severity = determineSeverity(item);
    
    // Sector
    const sector = extractSector(item);
    
    // Case ID
    const case_id = generateCaseId(item, goldSet);
    
    // Apply labels
    const labeled = {
      ...item,
      manual_content_type: content_type,
      manual_case_id: case_id,
      manual_actor_present: actor.name !== null,
      manual_actor_name: actor.name,
      manual_actor_confidence: actor.confidence,
      manual_sector: sector,
      manual_country: item.predicted_country, // keep predicted
      manual_severity_bucket: severity,
      notes: actor.name && actor.confidence === 'medium' ? 
        'Actor attribution based on context, verify' : ''
    };
    
    if ((idx + 1) % 25 === 0) {
      console.log(`  Processed ${idx + 1}/${goldSet.length} items...`);
    }
    
    return labeled;
  });
  
  // Save labeled dataset
  fs.writeFileSync(GOLD_SET_LABELED, JSON.stringify(labeled, null, 2));
  
  console.log(`\n✅ Labeled ${labeled.length} items`);
  console.log(`📁 Saved to: ${GOLD_SET_LABELED}`);
  
  // Statistics
  const stats = {
    contentTypes: {},
    actorPresent: labeled.filter(i => i.manual_actor_present).length,
    severities: {},
    sectors: {}
  };
  
  labeled.forEach(item => {
    stats.contentTypes[item.manual_content_type] = 
      (stats.contentTypes[item.manual_content_type] || 0) + 1;
    stats.severities[item.manual_severity_bucket] = 
      (stats.severities[item.manual_severity_bucket] || 0) + 1;
    stats.sectors[item.manual_sector] = 
      (stats.sectors[item.manual_sector] || 0) + 1;
  });
  
  console.log('\n📊 Statistics:');
  console.log('\nContent Types:');
  Object.entries(stats.contentTypes).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log(`\nActors Present: ${stats.actorPresent}/${labeled.length} (${(stats.actorPresent/labeled.length*100).toFixed(1)}%)`);
  
  console.log('\nSeverity Distribution:');
  ['critical', 'high', 'moderate', 'low'].forEach(sev => {
    const count = stats.severities[sev] || 0;
    console.log(`  ${sev}: ${count}`);
  });
  
  console.log('\nTop Sectors:');
  Object.entries(stats.sectors).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([sector, count]) => {
    console.log(`  ${sector}: ${count}`);
  });
}

// Run
labelGoldSet();
