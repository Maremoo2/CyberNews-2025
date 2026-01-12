#!/usr/bin/env node

/**
 * Enhanced Article Enrichment Script
 * 
 * Implements comprehensive analytical framework with:
 * - Severity scoring (0-100) with transparent methodology
 * - MITRE ATT&CK mapping with confidence scores
 * - Threat actor attribution with categories
 * - Strategic theme classification
 * - Content type classification
 * - Proper counting and deduplication
 * 
 * Usage: node scripts/enhanced-enrichment.js [--year 2026] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const yearArg = args.find(arg => arg.startsWith('--year='));
const YEAR = yearArg ? parseInt(yearArg.split('=')[1]) : 2026;

// ============================================================================
// STRATEGIC THEMES (8-12 themes per requirements)
// ============================================================================
const STRATEGIC_THEMES = {
  'cloud-exfiltration': {
    name: 'Cloud Exfiltration & SaaS Abuse',
    keywords: ['cloud', 'saas', 'onedrive', 's3', 'sharepoint', 'drive', 'dropbox', 'exfiltration', 'upload'],
    requires: ['exfiltration', 'cloud_service'],
    description: 'Data theft via cloud storage platforms and SaaS applications'
  },
  'exploit-led': {
    name: 'Exploit-Led Intrusions',
    keywords: ['exploit', 'zero-day', 'vulnerability', 'cve', 'patch', 'unpatched', 'public-facing'],
    requires: ['vulnerability', 'exploit'],
    description: 'Internet-facing application compromises via known or zero-day exploits'
  },
  'identity-abuse': {
    name: 'Identity & Token Abuse',
    keywords: ['credential', 'token', 'mfa', 'bypass', 'account', 'valid-accounts', 'stolen', 'phishing'],
    requires: ['credential', 'account'],
    description: 'Compromised credentials, MFA bypass, and valid account abuse'
  },
  'ransomware-economy': {
    name: 'Ransomware & Extortion Economy',
    keywords: ['ransomware', 'extortion', 'encryption', 'ransom', 'lockbit', 'blackcat', 'double-extortion'],
    requires: ['ransomware'],
    description: 'Ransomware operations and data extortion campaigns'
  },
  'supply-chain': {
    name: 'Supply Chain & Third-Party Compromise',
    keywords: ['supply-chain', 'third-party', 'vendor', 'software-supply', 'dependency', 'npm', 'pypi'],
    requires: ['supply-chain'],
    description: 'Attacks targeting software supply chains and third-party vendors'
  },
  'disinformation': {
    name: 'Disinformation & Deepfakes',
    keywords: ['deepfake', 'disinformation', 'misinformation', 'fake', 'propaganda', 'influence'],
    requires: ['disinformation'],
    description: 'AI-generated content and influence operations'
  },
  'botnet-ddos': {
    name: 'Botnets, DDoS & Commodity Malware',
    keywords: ['botnet', 'ddos', 'mirai', 'denial-of-service', 'malware', 'trojan'],
    requires: ['ddos'],
    description: 'Large-scale DDoS attacks and commodity malware campaigns'
  },
  'mobile-spyware': {
    name: 'Mobile/Android & Spyware Ecosystem',
    keywords: ['mobile', 'android', 'ios', 'spyware', 'pegasus', 'surveillance'],
    requires: ['mobile'],
    description: 'Mobile platform compromises and commercial spyware'
  },
  'ot-critical': {
    name: 'OT/ICS & Critical Infrastructure',
    keywords: ['ot', 'ics', 'scada', 'critical-infrastructure', 'energy', 'utility', 'industrial'],
    requires: ['critical_infrastructure'],
    description: 'Operational technology and critical infrastructure targeting'
  },
  'regulatory-pressure': {
    name: 'Regulatory & Disclosure Pressure',
    keywords: ['regulation', 'compliance', 'gdpr', 'disclosure', 'reporting', 'sec', 'nist'],
    requires: ['regulation'],
    description: 'Impact of regulatory requirements and mandatory disclosure'
  }
};

// ============================================================================
// MITRE ATT&CK MAPPING (Two-Signal Rule)
// ============================================================================
const MITRE_TECHNIQUES = {
  'T1566': {
    name: 'Phishing',
    tactic: 'initial-access',
    signals: [
      { keywords: ['phishing', 'spear-phishing', 'email'], weight: 1 },
      { keywords: ['credential', 'attachment', 'link'], weight: 0.5 }
    ]
  },
  'T1190': {
    name: 'Exploit Public-Facing Application',
    tactic: 'initial-access',
    signals: [
      { keywords: ['exploit', 'vulnerability', 'zero-day'], weight: 1 },
      { keywords: ['web', 'public-facing', 'internet-facing', 'cve'], weight: 0.5 }
    ]
  },
  'T1078': {
    name: 'Valid Accounts',
    tactic: 'initial-access',
    signals: [
      { keywords: ['valid-accounts', 'stolen', 'compromised', 'credential'], weight: 1 },
      { keywords: ['account', 'login', 'authentication'], weight: 0.5 }
    ]
  },
  'T1195': {
    name: 'Supply Chain Compromise',
    tactic: 'initial-access',
    signals: [
      { keywords: ['supply-chain', 'third-party', 'vendor'], weight: 1 },
      { keywords: ['software', 'dependency', 'library'], weight: 0.5 }
    ]
  },
  'T1059': {
    name: 'Command and Scripting Interpreter',
    tactic: 'execution',
    signals: [
      { keywords: ['powershell', 'script', 'command', 'bash'], weight: 1 },
      { keywords: ['execution', 'run', 'execute'], weight: 0.3 }
    ]
  },
  'T1486': {
    name: 'Data Encrypted for Impact',
    tactic: 'impact',
    signals: [
      { keywords: ['ransomware', 'encryption', 'encrypted'], weight: 1 },
      { keywords: ['ransom', 'payment', 'bitcoin'], weight: 0.5 }
    ]
  },
  'T1567': {
    name: 'Exfiltration Over Web Service',
    tactic: 'exfiltration',
    signals: [
      { keywords: ['exfiltration', 'exfiltrate', 'upload', 'leak'], weight: 1 },
      { keywords: ['onedrive', 's3', 'drive', 'dropbox', 'sharepoint', 'cloud'], weight: 0.8 }
    ]
  },
  'T1110': {
    name: 'Brute Force',
    tactic: 'credential-access',
    signals: [
      { keywords: ['brute-force', 'password-spray', 'dictionary'], weight: 1 },
      { keywords: ['credential', 'password', 'login'], weight: 0.5 }
    ]
  },
  'T1562': {
    name: 'Impair Defenses',
    tactic: 'defense-evasion',
    signals: [
      { keywords: ['disable', 'bypass', 'evade'], weight: 1 },
      { keywords: ['antivirus', 'defender', 'edr', 'security'], weight: 0.5 }
    ]
  },
  'T1021': {
    name: 'Remote Services',
    tactic: 'lateral-movement',
    signals: [
      { keywords: ['rdp', 'ssh', 'smb', 'lateral'], weight: 1 },
      { keywords: ['remote', 'movement', 'spread'], weight: 0.4 }
    ]
  }
};

// Tactic lookup from technique
const MITRE_TACTICS = {
  'initial-access': 'Initial Access',
  'execution': 'Execution',
  'persistence': 'Persistence',
  'privilege-escalation': 'Privilege Escalation',
  'defense-evasion': 'Defense Evasion',
  'credential-access': 'Credential Access',
  'discovery': 'Discovery',
  'lateral-movement': 'Lateral Movement',
  'collection': 'Collection',
  'exfiltration': 'Exfiltration',
  'impact': 'Impact',
  'command-and-control': 'Command and Control'
};

// ============================================================================
// THREAT ACTOR CATEGORIES
// ============================================================================
const ACTOR_CATEGORIES = {
  'nation-state': {
    keywords: ['apt', 'nation-state', 'state-sponsored', 'government', 'chinese', 'russian', 'iranian', 'north-korean'],
    confidence: 'medium'
  },
  'cybercriminal': {
    keywords: ['ransomware', 'lockbit', 'blackcat', 'conti', 'cybercriminal', 'criminal', 'financial'],
    confidence: 'high'
  },
  'hacktivist': {
    keywords: ['hacktivist', 'anonymous', 'ddos', 'protest', 'political', 'activist'],
    confidence: 'medium'
  },
  'unknown': {
    keywords: ['unknown', 'unattributed', 'unclear'],
    confidence: 'low'
  }
};

const KNOWN_ACTOR_NAMES = [
  'Lazarus Group', 'APT28', 'APT29', 'APT41', 'Volt Typhoon',
  'LockBit', 'BlackCat', 'ALPHV', 'Conti', 'REvil',
  'Scattered Spider', 'Anonymous', 'KillNet'
];

// ============================================================================
// CONTENT TYPE CLASSIFICATION
// ============================================================================
const CONTENT_TYPES = {
  'incident': ['breach', 'attack', 'compromise', 'ransomware', 'hack', 'exploitation'],
  'vulnerability': ['cve', 'vulnerability', 'zero-day', 'patch', 'flaw', 'exploit'],
  'policy': ['policy', 'regulation', 'law', 'compliance', 'mandate'],
  'opinion': ['opinion', 'comment', 'analysis', 'perspective', 'editorial'],
  'prediction': ['prediction', 'forecast', '2027', '2028', 'trend', 'future'],
  'research': ['research', 'study', 'report', 'whitepaper', 'analysis'],
  'product': ['product', 'release', 'launch', 'announcement', 'tool'],
  'court': ['court', 'lawsuit', 'legal', 'settlement', 'verdict', 'indictment']
};

// ============================================================================
// SEVERITY SCORING ENGINE (0-100)
// ============================================================================
function calculateSeverityScore(incident) {
  let score = 0;
  const drivers = [];
  
  const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase();
  
  // IMPACT FACTORS (0-40 points)
  // Service disruption/outage: +15
  if (/disruption|outage|offline|down|unavailable|service.*impact/.test(text)) {
    score += 15;
    drivers.push('Service disruption');
  }
  
  // Sensitive data exposure: +15
  if (/pii|personal.*data|health.*data|financial.*data|ssn|credit.*card|medical/.test(text)) {
    score += 15;
    drivers.push('Sensitive data exposure');
  }
  
  // Critical infrastructure / OT impact: +20
  if (/critical.*infrastructure|ot|ics|scada|energy|utility|power.*grid/.test(text)) {
    score += 20;
    drivers.push('Critical infrastructure impact');
  }
  
  // Large scale (millions affected): +10
  if (/million|billions?.*affected|massive|widespread|large.*scale/.test(text)) {
    score += 10;
    drivers.push('Large scale impact');
  }
  
  // EXPLOITABILITY FACTORS (0-30 points)
  // Confirmed exploited in the wild: +20
  if (/exploited.*wild|active.*exploitation|under.*attack|weaponized/.test(text)) {
    score += 20;
    drivers.push('Exploited in the wild');
  }
  
  // Zero-day: +15
  if (/zero-day|0-day|unknown.*vulnerability/.test(text)) {
    score += 15;
    drivers.push('Zero-day vulnerability');
  }
  
  // Internet-facing vector: +10
  if (/internet-facing|public-facing|web.*application|remote/.test(text)) {
    score += 10;
    drivers.push('Internet-facing vector');
  }
  
  // ADVERSARY FACTORS (0-15 points)
  // Nation-state attribution: +15
  if (/apt|nation-state|state-sponsored/.test(text)) {
    score += 15;
    drivers.push('Nation-state actor');
  }
  // Known ransomware group: +10
  else if (/lockbit|blackcat|alphv|conti|revil/.test(text)) {
    score += 10;
    drivers.push('Known ransomware group');
  }
  
  return {
    score: Math.min(score, 100), // Cap at 100
    drivers,
    label: getSeverityLabel(score)
  };
}

function getSeverityLabel(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
}

// ============================================================================
// MITRE MAPPING WITH CONFIDENCE
// ============================================================================
function mapMitreAttack(incident) {
  const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase();
  const mappings = [];
  
  for (const [techniqueId, technique] of Object.entries(MITRE_TECHNIQUES)) {
    let totalSignals = 0;
    
    for (const signal of technique.signals) {
      const matches = signal.keywords.some(kw => text.includes(kw));
      if (matches) {
        totalSignals += signal.weight;
      }
    }
    
    // Two-signal rule: need at least 1.0 total weight to map
    if (totalSignals >= 1.0) {
      const confidence = totalSignals >= 1.5 ? 'high' : (totalSignals >= 1.0 ? 'medium' : 'low');
      mappings.push({
        technique_id: techniqueId,
        technique_name: technique.name,
        tactic: technique.tactic,
        tactic_name: MITRE_TACTICS[technique.tactic],
        confidence,
        signal_strength: totalSignals
      });
    }
  }
  
  return mappings;
}

// ============================================================================
// THREAT ACTOR ATTRIBUTION
// ============================================================================
function attributeThreatActor(incident) {
  const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase();
  
  // Look for specific actor names first
  let actor_name = null;
  let actor_confidence = 'none';
  
  for (const actorName of KNOWN_ACTOR_NAMES) {
    if (text.includes(actorName.toLowerCase())) {
      actor_name = actorName;
      actor_confidence = 'high';
      break;
    }
  }
  
  // Determine actor category
  let actor_category = 'unknown';
  let category_confidence = 'low';
  
  for (const [category, config] of Object.entries(ACTOR_CATEGORIES)) {
    const matches = config.keywords.some(kw => text.includes(kw));
    if (matches && category !== 'unknown') {
      actor_category = category;
      category_confidence = config.confidence;
      break;
    }
  }
  
  return {
    actor_name,
    actor_category,
    actor_confidence,
    category_confidence,
    attributed: actor_name !== null
  };
}

// ============================================================================
// STRATEGIC THEME CLASSIFICATION
// ============================================================================
function classifyThemes(incident, mitreMapping) {
  const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase();
  const themeScores = [];
  
  for (const [themeId, theme] of Object.entries(STRATEGIC_THEMES)) {
    let score = 0;
    const matchedRequirements = [];
    
    // Check keyword matches
    const keywordMatches = theme.keywords.filter(kw => text.includes(kw)).length;
    score += keywordMatches;
    
    // Check required signals
    if (theme.requires) {
      for (const requirement of theme.requires) {
        // Check in text or MITRE techniques
        if (text.includes(requirement) || 
            mitreMapping.some(m => m.technique_name.toLowerCase().includes(requirement))) {
          matchedRequirements.push(requirement);
          score += 2; // Higher weight for meeting requirements
        }
      }
    }
    
    if (score > 0) {
      const confidence = matchedRequirements.length >= (theme.requires?.length || 1) ? 'high' : 
                        (score >= 2 ? 'medium' : 'low');
      themeScores.push({
        theme_id: themeId,
        theme_name: theme.name,
        score,
        confidence,
        matched_requirements: matchedRequirements
      });
    }
  }
  
  // Return top 3 themes max, sorted by score
  return themeScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ============================================================================
// CONTENT TYPE CLASSIFICATION
// ============================================================================
function classifyContentType(incident) {
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  
  const scores = {};
  for (const [type, keywords] of Object.entries(CONTENT_TYPES)) {
    scores[type] = keywords.filter(kw => text.includes(kw)).length;
  }
  
  // Return type with highest score, default to 'incident'
  const entries = Object.entries(scores);
  if (entries.length === 0 || Math.max(...Object.values(scores)) === 0) {
    return 'incident';
  }
  
  return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

// ============================================================================
// MAIN ENRICHMENT FUNCTION
// ============================================================================
function enrichIncident(incident) {
  // Calculate severity score
  const severity = calculateSeverityScore(incident);
  
  // Map MITRE ATT&CK techniques
  const mitreMapping = mapMitreAttack(incident);
  
  // Extract unique tactics from techniques
  const mitreTactics = [...new Set(mitreMapping.map(m => m.tactic))];
  
  // Attribute threat actor
  const actorAttribution = attributeThreatActor(incident);
  
  // Classify strategic themes
  const themes = classifyThemes(incident, mitreMapping);
  
  // Classify content type
  const content_type = classifyContentType(incident);
  
  // Determine if curated (has multiple enrichment signals)
  const is_curated = (
    severity.score >= 25 &&
    mitreMapping.length > 0 &&
    themes.length > 0
  );
  
  return {
    ...incident,
    // Enhanced severity scoring
    severity_score: severity.score,
    severity: severity.label,
    severity_drivers: severity.drivers,
    
    // MITRE ATT&CK with confidence
    mitre_techniques: mitreMapping.map(m => ({
      id: m.technique_id,
      name: m.technique_name,
      confidence: m.confidence
    })),
    mitre_tactics: mitreTactics,
    mitre_technique_ids: mitreMapping.map(m => m.technique_id),
    
    // Threat actor attribution
    actor_name: actorAttribution.actor_name,
    actor_category: actorAttribution.actor_category,
    actor_confidence: actorAttribution.actor_confidence,
    is_attributed: actorAttribution.attributed,
    
    // Strategic themes
    themes: themes.map(t => ({
      id: t.theme_id,
      name: t.theme_name,
      confidence: t.confidence
    })),
    
    // Content classification
    content_type,
    
    // Quality indicators
    is_curated,
    confidence: calculateOverallConfidence(severity, mitreMapping, themes),
    
    // Metadata
    enrichment_version: '2.0',
    enriched_at: new Date().toISOString()
  };
}

function calculateOverallConfidence(severity, mitreMapping, themes) {
  let confidence = 50; // Base confidence
  
  // Severity scoring adds confidence
  if (severity.drivers.length >= 3) confidence += 20;
  else if (severity.drivers.length >= 2) confidence += 10;
  
  // MITRE mappings add confidence
  const highConfidenceMitre = mitreMapping.filter(m => m.confidence === 'high').length;
  confidence += Math.min(highConfidenceMitre * 10, 20);
  
  // Themes add confidence
  const highConfidenceThemes = themes.filter(t => t.confidence === 'high').length;
  confidence += Math.min(highConfidenceThemes * 10, 20);
  
  return Math.min(confidence, 100);
}

// ============================================================================
// PROCESS INCIDENTS
// ============================================================================
async function processIncidents() {
  const inputFile = path.join(PROJECT_ROOT, 'data', `incidents-${YEAR}.json`);
  const outputFile = path.join(PROJECT_ROOT, 'data', `incidents-${YEAR}-enriched.json`);
  
  console.log(`\n📊 Enhanced Enrichment for ${YEAR}`);
  console.log('=====================================');
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }
  
  // Read incidents
  const incidents = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  console.log(`📥 Loaded ${incidents.length} incidents from ${inputFile}`);
  
  // Enrich all incidents
  console.log('🔄 Enriching incidents...');
  const enrichedIncidents = incidents.map((incident, index) => {
    if ((index + 1) % 100 === 0) {
      console.log(`   Processed ${index + 1}/${incidents.length} incidents...`);
    }
    return enrichIncident(incident);
  });
  
  // Calculate statistics
  const stats = calculateStats(enrichedIncidents);
  console.log('\n📈 Enrichment Statistics:');
  console.log(`   Total incidents: ${enrichedIncidents.length}`);
  console.log(`   Curated: ${stats.curated} (${stats.curatedPercent}%)`);
  console.log(`   Critical severity: ${stats.critical}`);
  console.log(`   High severity: ${stats.high}`);
  console.log(`   With MITRE mappings: ${stats.withMitre} (${stats.mitrePercent}%)`);
  console.log(`   Attributed: ${stats.attributed} (${stats.attributedPercent}%)`);
  console.log(`   With themes: ${stats.withThemes} (${stats.themesPercent}%)`);
  
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - No files written');
    console.log('\nSample enriched incident:');
    console.log(JSON.stringify(enrichedIncidents[0], null, 2));
  } else {
    fs.writeFileSync(outputFile, JSON.stringify(enrichedIncidents, null, 2));
    console.log(`\n✅ Enriched incidents saved to ${outputFile}`);
  }
}

function calculateStats(incidents) {
  const curated = incidents.filter(i => i.is_curated).length;
  const critical = incidents.filter(i => i.severity === 'critical').length;
  const high = incidents.filter(i => i.severity === 'high').length;
  const withMitre = incidents.filter(i => i.mitre_techniques.length > 0).length;
  const attributed = incidents.filter(i => i.is_attributed).length;
  const withThemes = incidents.filter(i => i.themes.length > 0).length;
  
  return {
    curated,
    curatedPercent: Math.round(curated / incidents.length * 100),
    critical,
    high,
    withMitre,
    mitrePercent: Math.round(withMitre / incidents.length * 100),
    attributed,
    attributedPercent: Math.round(attributed / incidents.length * 100),
    withThemes,
    themesPercent: Math.round(withThemes / incidents.length * 100)
  };
}

// ============================================================================
// RUN
// ============================================================================
processIncidents().catch(console.error);
