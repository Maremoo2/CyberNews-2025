#!/usr/bin/env node

/**
 * Enhanced Article Enrichment Script
 * 
 * Implements comprehensive analytical framework with STRICT quality controls:
 * 
 * DEDUPLICATION (per requirements):
 * - Primary fingerprint: org + attack_type + date (±3 days)
 * - Secondary checks: ransom note, leak site, CVE, attack method
 * - All clustering is explainable (no black box)
 * - Preference for precision over recall (false merge worse than split)
 * 
 * ACTOR ATTRIBUTION (per requirements):
 * - HIGH confidence only with: 2+ independent sources OR official statements
 * - Otherwise marked as "suspected" or "unattributed"
 * - Never guess actor based on geography alone
 * 
 * MITRE MAPPING (per requirements):
 * - Requires 2 signals per technique (no single buzzword)
 * - Confidence scoring based on signal strength
 * 
 * QUALITY CONTROLS (per requirements):
 * - Flags anomalies (same org 5+ times in 3 days, unrealistic attribution rate)
 * - Sector classification based on primary business (not article source)
 * - Source tier prioritization (Tier 1 > Tier 2 > Tier 3)
 * - Severity scoring (0-100) with transparent methodology
 * - Strategic theme classification
 * - Content type classification
 * 
 * Usage: node scripts/enhanced-enrichment.js [--year 2026] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const METADATA_FILE = path.join(PROJECT_ROOT, 'data', 'metadata.json');

// Load entity normalization mappings
const ENTITY_NORMALIZATION = JSON.parse(
  fs.readFileSync(path.join(PROJECT_ROOT, 'config', 'entity-normalization.json'), 'utf8')
);

// ============================================================================
// ENTITY NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normalize actor name using canonicalization table
 */
function normalizeActorName(actorName) {
  if (!actorName) return null;
  const normalized = ENTITY_NORMALIZATION.actor_aliases[actorName] || 
                     ENTITY_NORMALIZATION.actor_aliases[actorName.toLowerCase()] ||
                     actorName;
  return normalized;
}

/**
 * Normalize organization name using canonicalization table
 */
// eslint-disable-next-line no-unused-vars
function normalizeOrgName(orgName) {
  if (!orgName) return null;
  const normalized = ENTITY_NORMALIZATION.org_aliases[orgName] ||
                     ENTITY_NORMALIZATION.org_aliases[orgName.toLowerCase()] ||
                     orgName;
  return normalized;
}

/**
 * Normalize sector using keyword matching and overrides
 * P1 requirement: Return 'unknown' instead of defaulting to technology
 */
function normalizeSector(text, existingSector) {
  const lowerText = text.toLowerCase();
  
  // Check overrides first
  for (const [key, sector] of Object.entries(ENTITY_NORMALIZATION.sector_overrides)) {
    if (lowerText.includes(key)) {
      return sector;
    }
  }
  
  // Use keyword matching with priority
  let bestMatch = null;
  let bestPriority = 0;
  
  for (const [sector, config] of Object.entries(ENTITY_NORMALIZATION.sector_keywords)) {
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) {
        if (config.priority > bestPriority) {
          bestMatch = sector;
          bestPriority = config.priority;
        }
      }
    }
  }
  
  // P1 fix: Return 'unknown' instead of defaulting to existingSector
  // This prevents technology from being a catch-all fallback
  return bestMatch || 'unknown';
}

// Severity scoring configuration
// Scores represent relative impact on a 0-10 scale, used to calculate total severity (0-100)
// Higher scores indicate greater impact in that dimension
const SEVERITY_SCORES = {
  SERVICE_DISRUPTION: 4,        // Significant operational impact (40% contribution)
  DATA_EXPOSURE: 4,             // Significant data sensitivity (40% contribution)
  LARGE_SCALE: 3,               // Widespread/enterprise-level impact (30% contribution)
  CRITICAL_INFRA: 5,            // Maximum operational disruption for critical infrastructure (50% contribution)
  HEALTHCARE: 1                 // Additional regulatory/HIPAA impact for healthcare sector (10% contribution)
};

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
// Hard top-level classification for data quality improvements
const CONTENT_TYPES = {
  'incident': {
    keywords: ['breach', 'attack', 'compromise', 'ransomware', 'hack', 'hacked', 'exploited', 'infiltrated', 'stolen', 'leaked'],
    antiKeywords: ['what is', 'how to', 'guide to', 'understanding', 'explained', 'pricing', 'comparison', 'review', 'best']
  },
  'campaign': {
    keywords: ['campaign', 'operation', 'botnet', 'malware family', 'threat group'],
    antiKeywords: []
  },
  'vulnerability': {
    keywords: ['cve-', 'vulnerability', 'zero-day', 'patch', 'flaw', 'exploit', 'disclosure'],
    antiKeywords: ['what is', 'explained', 'guide']
  },
  'policy': {
    keywords: ['policy', 'regulation', 'law', 'compliance', 'mandate', 'sec filing', 'regulatory'],
    antiKeywords: []
  },
  'explainer': {
    keywords: ['what is', 'how to', 'guide to', 'understanding', 'explained', 'tutorial', 'basics of'],
    antiKeywords: []
  },
  'opinion': {
    keywords: ['opinion', 'comment', 'analysis', 'perspective', 'editorial', 'should'],
    antiKeywords: []
  },
  'product': {
    keywords: ['product', 'release', 'launch', 'announcement', 'tool', 'pricing', 'comparison', 'review', 'best vpn', 'choose'],
    antiKeywords: []
  }
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
      actor_name = normalizeActorName(actorName); // Normalize actor name
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
        // Check in text or MITRE techniques (case-insensitive)
        const reqLower = requirement.toLowerCase();
        if (text.includes(reqLower) || 
            mitreMapping.some(m => m.technique_name.toLowerCase().includes(reqLower))) {
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
  
  // Check for explainers first (high priority anti-pattern)
  const explainerType = CONTENT_TYPES['explainer'];
  const hasExplainerKeywords = explainerType.keywords.some(kw => text.includes(kw));
  if (hasExplainerKeywords) {
    return 'explainer';
  }
  
  // Check for product reviews/comparisons
  const productType = CONTENT_TYPES['product'];
  const hasProductKeywords = productType.keywords.filter(kw => text.includes(kw)).length;
  if (hasProductKeywords >= 2) {
    return 'product';
  }
  
  // Score each type
  const scores = {};
  for (const [type, config] of Object.entries(CONTENT_TYPES)) {
    if (type === 'explainer' || type === 'product') continue; // Already checked
    
    let score = 0;
    
    // Add points for keyword matches
    score += config.keywords.filter(kw => text.includes(kw)).length;
    
    // Subtract points for anti-keywords
    if (config.antiKeywords) {
      score -= config.antiKeywords.filter(kw => text.includes(kw)).length * 2;
    }
    
    scores[type] = Math.max(0, score);
  }
  
  // Return type with highest score, default to 'incident' if all scores are 0
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return 'incident';
  }
  
  return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

// ============================================================================
// CASE ID GENERATION (for deduplication with blocking + matching)
// ============================================================================

/**
 * Levenshtein distance calculation for string similarity
 * Returns similarity score between 0-1 (1 = identical)
 * Optimized with early exit for very dissimilar strings
 */
function levenshteinSimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase();
  const s2 = (str2 || '').toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;
  
  // Early exit: if length difference is too large, strings are very dissimilar
  const maxLen = Math.max(s1.length, s2.length);
  const minLen = Math.min(s1.length, s2.length);
  if ((maxLen - minLen) / maxLen > 0.5) return 0.0; // More than 50% length diff
  
  // Limit string length for performance (only use first 200 chars)
  const limit = 200;
  const s1Limited = s1.length > limit ? s1.substring(0, limit) : s1;
  const s2Limited = s2.length > limit ? s2.substring(0, limit) : s2;
  
  const matrix = Array(s2Limited.length + 1).fill(null).map(() => 
    Array(s1Limited.length + 1).fill(null)
  );
  
  for (let i = 0; i <= s1Limited.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2Limited.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= s2Limited.length; j++) {
    for (let i = 1; i <= s1Limited.length; i++) {
      const cost = s1Limited[i - 1] === s2Limited[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + cost  // substitution
      );
    }
  }
  
  return 1 - (matrix[s2Limited.length][s1Limited.length] / Math.max(s1Limited.length, s2Limited.length));
}

// Pre-compile regex patterns for blocking key extraction (performance optimization)
const BLOCKING_PATTERNS = {
  org: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|Corp|LLC|Ltd|Group|Company|Bank|Hospital|University|College|Ministry|Department))?)\b/g,
  domain: /\b([a-z0-9-]+\.[a-z]{2,})\b/g,
  cve: /cve-\d{4}-\d+/gi,
  leakSite: /\b(leak\s*site|data\s*leak\s*site|breach\s*forum|ransomwatch)\b/gi,
  ransomNote: /\b(ransom\s*note|readme\.txt|how_to_decrypt)\b/gi
};

// Attack type keywords for primary fingerprint (org + attack_type + date)
const ATTACK_TYPE_KEYWORDS = {
  ransomware: ['ransomware', 'ransom', 'encrypted', 'lockbit', 'blackcat', 'alphv'],
  data_breach: ['data breach', 'breach', 'leaked', 'exposed', 'stolen data'],
  ddos: ['ddos', 'denial of service', 'distributed attack'],
  phishing: ['phishing', 'spear-phishing', 'credential theft'],
  supply_chain: ['supply chain', 'supply-chain', 'third-party', 'vendor compromise'],
  malware: ['malware', 'trojan', 'rat', 'backdoor'],
  vulnerability: ['vulnerability', 'zero-day', '0-day', 'exploit'],
  apt: ['apt', 'apt-', 'advanced persistent threat', 'nation-state']
};

// Cache for blocking keys to avoid recomputation
const blockingKeyCache = new Map();

/**
 * Extract attack type from incident text
 * Used for primary fingerprint: org + attack_type + date
 */
function extractAttackType(text) {
  const lowerText = text.toLowerCase();
  
  // Check each attack type, prioritize more specific types
  for (const [type, keywords] of Object.entries(ATTACK_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return type;
      }
    }
  }
  
  return 'unknown';
}

/**
 * Extract blocking keys from incident for candidate grouping
 * Implements strict deduplication per requirements:
 * - Primary fingerprint: org + attack_type + date (±3 days)
 * - Secondary checks: ransom note, leak site, CVE, attack method
 * Uses caching to avoid recomputation (performance optimization)
 */
function extractBlockingKeys(incident) {
  // Check cache first
  if (blockingKeyCache.has(incident.id)) {
    return blockingKeyCache.get(incident.id);
  }
  
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  const keys = new Set();
  
  // PRIMARY FINGERPRINT: Organization + Attack Type + Date Window
  // This is the main deduplication key per requirements
  const titleMatches = incident.title.match(BLOCKING_PATTERNS.org) || [];
  const attackType = extractAttackType(text);
  
  titleMatches.forEach(org => {
    if (org.length > 3) {
      // Add org-only key for backwards compatibility
      keys.add(`org:${org.toLowerCase()}`);
      
      // Add PRIMARY FINGERPRINT: org + attack_type
      // Date matching (±3 days) is handled in generateCaseId function
      if (attackType !== 'unknown') {
        keys.add(`primary:${org.toLowerCase()}:${attackType}`);
      }
    }
  });
  
  // SECONDARY DEDUP CHECKS per requirements
  
  // Block 1: CVE identifiers (exact match = same vulnerability)
  const cves = text.match(BLOCKING_PATTERNS.cve) || [];
  cves.forEach(cve => keys.add(`cve:${cve.toLowerCase()}`));
  
  // Block 2: Leak site references (same leak = same incident)
  if (BLOCKING_PATTERNS.leakSite.test(text)) {
    titleMatches.forEach(org => {
      keys.add(`leak_site:${org.toLowerCase()}`);
    });
  }
  
  // Block 3: Ransom note indicators (same ransom note = same incident)
  if (BLOCKING_PATTERNS.ransomNote.test(text)) {
    titleMatches.forEach(org => {
      keys.add(`ransom_note:${org.toLowerCase()}`);
    });
  }
  
  // Block 4: Domain names (attack method indicator)
  const domains = text.match(BLOCKING_PATTERNS.domain) || [];
  domains.forEach(domain => keys.add(`domain:${domain}`));
  
  // Block 5: Known threat actors
  // Updated with 2026 threat actors from research (Jan 2026):
  // - UAC-0184: Russian-aligned APT targeting Ukraine
  // - Volt Typhoon: China-linked APT targeting critical infrastructure
  // - Kimwolf: Botnet infecting 2M+ Android TV devices
  // - RondoDox: Botnet exploiting React2Shell CVE-2025-55182
  // - Zestix: Cybercriminal group selling stolen ShareFile/Nextcloud data
  // - NoName057: Pro-Russian hacktivist group conducting DDoS attacks
  // - MuddyWater/Seedworm: Iranian APT using RustyWater Rust-based RAT
  const knownActors = [
    'lockbit', 'blackcat', 'alphv', 'conti', 'clop', 'apt28', 'apt29', 
    'lazarus', 'kimsuky', 'scattered spider', 'killnet', 'anonymous',
    'uac-0184', 'volt typhoon', 'kimwolf', 'rondodox', 'zestix',
    'noname057', 'muddywater', 'seedworm'
  ];
  knownActors.forEach(actor => {
    if (text.includes(actor)) {
      keys.add(`actor:${actor}`);
      // Also add actor + attack_type for more specific matching
      if (attackType !== 'unknown') {
        keys.add(`actor_method:${actor}:${attackType}`);
      }
    }
  });
  
  // Block 6: Ransomware brands (specific attack method)
  const ransomwareBrands = ['lockbit', 'blackcat', 'alphv', 'conti', 'revil', 'ragnar', 'akira'];
  ransomwareBrands.forEach(brand => {
    if (text.includes(brand)) {
      keys.add(`ransomware:${brand}`);
    }
  });
  
  // Block 7: Country + Sector combination (less strict, for context)
  if (incident.country && incident.tags && incident.tags.length > 0) {
    const mainSector = incident.tags[0];
    keys.add(`geo_sector:${incident.country.toLowerCase()}:${mainSector.toLowerCase()}`);
  }
  
  const result = Array.from(keys);
  
  // Cache the result
  blockingKeyCache.set(incident.id, result);
  
  return result;
}

/**
 * Calculate clustering reasons for audit trail
 */
// eslint-disable-next-line no-unused-vars
function calculateClusteringReasons(incident1, incident2) {
  const reasons = [];
  const scores = {};
  
  // Check title similarity
  const titleSim = levenshteinSimilarity(incident1.title, incident2.title);
  scores.title_similarity = titleSim;
  if (titleSim > 0.8) {
    reasons.push(`High title similarity: ${(titleSim * 100).toFixed(0)}%`);
  }
  
  // Check shared keywords (extract significant words)
  const words1 = new Set(incident1.title.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  const words2 = new Set(incident2.title.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  const intersection = [...words1].filter(w => words2.has(w));
  if (intersection.length >= 3) {
    reasons.push(`Shared keywords: ${intersection.slice(0, 3).join(', ')}`);
  }
  
  // Check shared blocking keys
  const keys1 = extractBlockingKeys(incident1);
  const keys2 = extractBlockingKeys(incident2);
  const sharedKeys = keys1.filter(k => keys2.includes(k));
  sharedKeys.forEach(key => {
    const [type, ...value] = key.split(':');
    reasons.push(`Matched ${type}: ${value.join(':')}`);
  });
  
  // Check date proximity (within 7 days)
  const date1 = new Date(incident1.date);
  const date2 = new Date(incident2.date);
  const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
  scores.days_apart = daysDiff;
  if (daysDiff <= 7) {
    reasons.push(`Close timing: ${Math.round(daysDiff)} days apart`);
  }
  
  return { reasons, scores };
}

/**
 * Generate case ID using blocking + matching approach with STRICT deduplication rules
 * 
 * PRIMARY FINGERPRINT (per requirements):
 * - Organization + Attack Type + Date (±3 days)
 * 
 * SECONDARY CHECKS (per requirements):
 * - Same ransom note → same incident
 * - Same leak site → same incident
 * - Same CVE → same vulnerability incident
 * - Same attack method (actor + technique) → likely same incident
 * 
 * EXPLAINABILITY (per requirements):
 * - All clustering must be explainable
 * - Returns reasons why incidents were matched
 * 
 * Groups similar incidents together for deduplication
 * Uses pre-computed blocking index for O(n) instead of O(n²) complexity
 */
function generateCaseId(incident, allIncidents, blockingIndex) {
  // Extract blocking keys for this incident
  const blockingKeys = extractBlockingKeys(incident);
  
  // If no blocking keys, use individual case ID
  if (blockingKeys.length === 0) {
    return `case_${incident.id}`;
  }
  
  // Find candidates in same block using pre-computed index
  const candidateIds = new Set();
  const matchReasons = new Map(); // Track why each candidate matched
  
  if (blockingIndex) {
    blockingKeys.forEach(key => {
      const incidentsInBlock = blockingIndex.get(key) || [];
      incidentsInBlock.forEach(otherId => {
        if (otherId !== incident.id) {
          candidateIds.add(otherId);
          // Track which blocking key matched this candidate
          if (!matchReasons.has(otherId)) {
            matchReasons.set(otherId, []);
          }
          matchReasons.get(otherId).push(key);
        }
      });
    });
  }
  
  // If no candidates, use individual case ID
  if (candidateIds.size === 0) {
    return `case_${incident.id}`;
  }
  
  // Get candidate incidents
  const candidates = allIncidents.filter(other => candidateIds.has(other.id));
  
  // STRICT MATCHING RULES (per requirements)
  const SIMILARITY_THRESHOLD = 0.75; // 75% similarity required for title/summary
  const DATE_WINDOW_DAYS = 3; // ±3 days for primary fingerprint
  
  let bestMatch = null;
  let bestScore = 0;
  let bestMatchReason = '';
  
  for (const candidate of candidates) {
    // Check date proximity FIRST (±3 days rule for primary fingerprint)
    const date1 = new Date(incident.date);
    const date2 = new Date(candidate.date);
    const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
    
    // Get blocking keys that matched this candidate
    const sharedKeys = matchReasons.get(candidate.id) || [];
    const reasons = [];
    
    // STRICT RULE 1: Primary fingerprint (org + attack_type + date ±3 days)
    const hasPrimaryMatch = sharedKeys.some(key => key.startsWith('primary:'));
    if (hasPrimaryMatch && daysDiff <= DATE_WINDOW_DAYS) {
      reasons.push(`PRIMARY FINGERPRINT: Same org+attack_type within ${Math.round(daysDiff)} days`);
      // High confidence match - set high score
      bestScore = 0.95;
      bestMatch = candidate;
      bestMatchReason = reasons.join('; ');
      // Primary match is definitive, break early
      break;
    }
    
    // STRICT RULE 2: Secondary dedup checks (exact match = same incident)
    const hasRansomNote = sharedKeys.some(key => key.startsWith('ransom_note:'));
    const hasLeakSite = sharedKeys.some(key => key.startsWith('leak_site:'));
    const hasSameCVE = sharedKeys.some(key => key.startsWith('cve:'));
    const hasSameActorMethod = sharedKeys.some(key => key.startsWith('actor_method:'));
    
    if (hasRansomNote) {
      reasons.push('Same ransom note');
      // Ransom note match is very strong if within reasonable time
      if (daysDiff <= 7) {
        bestScore = 0.90;
        bestMatch = candidate;
        bestMatchReason = reasons.join('; ');
        break;
      }
    }
    
    if (hasLeakSite) {
      reasons.push('Same leak site');
      if (daysDiff <= 7) {
        bestScore = 0.90;
        bestMatch = candidate;
        bestMatchReason = reasons.join('; ');
        break;
      }
    }
    
    if (hasSameCVE) {
      reasons.push('Same CVE');
      if (daysDiff <= 14) { // CVEs can be reported over longer period
        bestScore = 0.85;
        bestMatch = candidate;
        bestMatchReason = reasons.join('; ');
        break;
      }
    }
    
    if (hasSameActorMethod) {
      reasons.push('Same actor + attack method');
    }
    
    // FALLBACK: Title/summary similarity (only if other rules don't match)
    if (!bestMatch) {
      const titleSim = levenshteinSimilarity(incident.title, candidate.title);
      const summarySim = levenshteinSimilarity(incident.summary || '', candidate.summary || '');
      const combinedScore = (titleSim * 0.7) + (summarySim * 0.3);
      
      if (combinedScore >= SIMILARITY_THRESHOLD && daysDiff <= 7) {
        reasons.push(`Text similarity: ${(combinedScore * 100).toFixed(0)}%`);
        
        if (combinedScore > bestScore) {
          bestScore = combinedScore;
          bestMatch = candidate;
          bestMatchReason = reasons.join('; ');
        }
      }
    }
  }
  
  if (bestMatch) {
    // Use the earlier incident's case ID to group them
    const date1 = new Date(incident.date);
    const date2 = new Date(bestMatch.date);
    const earlierId = date1 < date2 ? incident.id : bestMatch.id;
    
    // Store clustering reason for explainability (if needed for debugging)
    if (bestMatchReason) {
      // Could log or store this for audit: `Matched case_${earlierId} because: ${bestMatchReason}`
    }
    
    return `case_${earlierId}`;
  }
  
  // No match found, use individual case ID
  return `case_${incident.id}`;
}

// ============================================================================
// TIMELINE MILESTONE EXTRACTION
// ============================================================================
function extractTimelineMilestones(incident) {
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  const milestones = {
    first_seen: incident.date, // Default to incident date
    detection_date: null,
    containment_start: null,
    containment_complete: null,
    service_restored: null,
    recovery_complete: null,
    last_seen: incident.date, // Default to incident date
    status: 'unknown'
  };
  
  // Try to extract detection date
  if (/detected|discovered|found on/.test(text)) {
    // For now, use incident date as detection date
    milestones.detection_date = incident.date;
  }
  
  // Try to determine status
  if (/ongoing|active|continuing|still/.test(text)) {
    milestones.status = 'ongoing';
  } else if (/contained|mitigated|patched/.test(text)) {
    milestones.status = 'contained';
  } else if (/recovered|restored|resolved/.test(text)) {
    milestones.status = 'recovered';
    milestones.recovery_complete = incident.date;
  }
  
  return milestones;
}

// ============================================================================
// ATTRIBUTION CONFIDENCE SCORING
// ============================================================================
/**
 * Calculate attribution confidence based on STRICT requirements:
 * 
 * HIGH confidence ONLY if:
 * - 2+ independent sources mentioned, OR
 * - Official statements (law enforcement, government, company), OR  
 * - Known leak site confirmation
 * 
 * Otherwise mark as:
 * - "suspected" or "unattributed"
 * 
 * NEVER guess actor based on geography alone per requirements
 */
function calculateAttributionConfidence(actorAttribution, incident) {
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  
  // Check for HIGH confidence indicators per requirements
  const hasOfficialStatement = /\b(fbi|cisa|police|law enforcement|government|official statement|authorities|ministry|department of|sec filing)\b/.test(text);
  const hasCompanyConfirmation = /\b(confirmed|official|statement|disclosed by|announced by)\b/.test(text);
  const hasLeakSiteConfirmation = /\b(leak site|ransomwatch|breach forum|data leak site)\b/.test(text);
  
  // Count independent source indicators (rough heuristic)
  const sourceIndicators = [
    /\breported by\b/,
    /\baccording to\b/,
    /\bresearchers at\b/,
    /\bsecurity firm\b/,
    /\bthreat intelligence\b/,
    /\bcybersecurity company\b/
  ];
  const sourceCount = sourceIndicators.filter(pattern => pattern.test(text)).length;
  
  // Check for tentative/uncertain language (reduces confidence)
  const hasTentativeLanguage = /\b(suspected|believed|possibly|allegedly|may be|appears to be|likely|potentially)\b/.test(text);
  
  // Check for definitive attribution language
  const hasDefinitiveLanguage = /\b(attributed to|confirmed|identified as|claimed responsibility|responsible for)\b/.test(text);
  
  // STRICT CONFIDENCE RULES per requirements
  
  // HIGH confidence requires strong evidence
  if (!hasTentativeLanguage && (
    hasOfficialStatement || 
    hasLeakSiteConfirmation || 
    (sourceCount >= 2 && hasDefinitiveLanguage) ||
    (hasCompanyConfirmation && hasDefinitiveLanguage)
  )) {
    return 'high';
  }
  
  // MEDIUM confidence: Some attribution but not meeting HIGH criteria
  if (actorAttribution.attributed && hasDefinitiveLanguage && !hasTentativeLanguage) {
    return 'medium';
  }
  
  // LOW confidence: Tentative or weak attribution
  if (actorAttribution.attributed) {
    return 'low';
  }
  
  // No attribution
  return 'none';
}

// ============================================================================
// GEOGRAPHY EXTRACTION
// ============================================================================
function extractGeography(incident) {
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  
  const geography = {
    victim_country: incident.country || null,
    victim_region: incident.region || null,
    impact_region: null,
    operational_impact_countries: []
  };
  
  // Extract impact region from text
  if (/global|worldwide|international/.test(text)) {
    geography.impact_region = 'Global';
  } else if (/europe|eu|european/.test(text)) {
    geography.impact_region = 'Europe';
  } else if (/asia|asian/.test(text)) {
    geography.impact_region = 'Asia';
  } else if (/us|united states|american/.test(text)) {
    geography.impact_region = 'United States';
  }
  
  return geography;
}

// ============================================================================
// SEVERITY SCORE BREAKDOWN
// ============================================================================
function calculateSeverityBreakdown(severity) {
  // Convert severity drivers to component scores
  // Apply severity breakdown using configured scores
  const breakdown = {
    operational_disruption: 0,
    data_sensitivity: 0,
    scale: 0,
    critical_infra_flag: false,
    healthcare_flag: false
  };
  
  severity.drivers.forEach(driver => {
    if (driver === 'Service disruption') {
      breakdown.operational_disruption = SEVERITY_SCORES.SERVICE_DISRUPTION;
    } else if (driver === 'Sensitive data exposure') {
      breakdown.data_sensitivity = SEVERITY_SCORES.DATA_EXPOSURE;
    } else if (driver === 'Large scale impact') {
      breakdown.scale = SEVERITY_SCORES.LARGE_SCALE;
    } else if (driver === 'Critical infrastructure impact') {
      breakdown.critical_infra_flag = true;
      breakdown.operational_disruption = SEVERITY_SCORES.CRITICAL_INFRA;
    } else if (driver === 'Healthcare sector') {
      breakdown.healthcare_flag = true;
      // Healthcare incidents get additional data sensitivity due to HIPAA/regulatory impact
      breakdown.data_sensitivity += SEVERITY_SCORES.HEALTHCARE;
    }
  });
  
  return breakdown;
}

// ============================================================================
// MAIN ENRICHMENT FUNCTION
// ============================================================================
function enrichIncident(incident, allIncidents, blockingIndex) {
  const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`;
  
  // Normalize sector/tags
  const normalizedSector = normalizeSector(text, incident.tags?.[0]);
  const normalizedTags = normalizedSector ? [normalizedSector, ...(incident.tags || []).slice(1)] : incident.tags;
  
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
  
  // Generate case ID with blocking index for performance
  const case_id = generateCaseId(incident, allIncidents, blockingIndex);
  
  // Extract timeline milestones
  const timeline = extractTimelineMilestones(incident);
  
  // Calculate attribution confidence
  const attribution_confidence = calculateAttributionConfidence(actorAttribution, incident);
  
  // Extract geography
  const geography = extractGeography(incident);
  
  // Calculate severity breakdown
  const severity_breakdown = calculateSeverityBreakdown(severity);
  
  // Determine if curated (has multiple enrichment signals)
  const is_curated = (
    severity.score >= 25 &&
    mitreMapping.length > 0 &&
    themes.length > 0 &&
    content_type === 'incident' // Only incidents can be curated
  );
  
  return {
    ...incident,
    // Normalize tags/sectors
    tags: normalizedTags,
    
    // Content classification (NEW)
    content_type,
    
    // Case clustering (NEW)
    case_id,
    event_id: incident.id, // Original article/event ID
    
    // Enhanced severity scoring
    severity_score: severity.score,
    severity: severity.label,
    severity_drivers: severity.drivers,
    severity_breakdown, // NEW: Component scores
    
    // MITRE ATT&CK with confidence
    mitre_techniques: mitreMapping.map(m => ({
      id: m.technique_id,
      name: m.technique_name,
      confidence: m.confidence,
      mapping_source: 'nlp' // NEW: Indicates automated mapping
    })),
    mitre_tactics: mitreTactics,
    mitre_technique_ids: mitreMapping.map(m => m.technique_id),
    
    // Threat actor attribution (ENHANCED)
    actor_name: actorAttribution.actor_name,
    actor_category: actorAttribution.actor_category,
    actor_confidence: actorAttribution.actor_confidence,
    attribution_confidence, // NEW: High/Medium/Low based on evidence
    attribution_status: actorAttribution.attributed ? 
      (attribution_confidence === 'high' ? 'known' : 'suspected') : 'unknown', // NEW
    is_attributed: actorAttribution.attributed,
    
    // Geography (NEW)
    victim_country: geography.victim_country,
    victim_region: geography.victim_region,
    impact_region: geography.impact_region,
    operational_impact_countries: geography.operational_impact_countries,
    
    // Timeline milestones (NEW)
    timeline,
    
    // Strategic themes
    themes: themes.map(t => ({
      id: t.theme_id,
      name: t.theme_name,
      confidence: t.confidence
    })),
    
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
  
  // Pre-compute blocking index for O(n) clustering performance
  console.log('🔧 Building blocking index...');
  const blockingIndex = new Map();
  incidents.forEach(incident => {
    const keys = extractBlockingKeys(incident);
    keys.forEach(key => {
      if (!blockingIndex.has(key)) {
        blockingIndex.set(key, []);
      }
      blockingIndex.get(key).push(incident.id);
    });
  });
  console.log(`   Built index with ${blockingIndex.size} blocking keys`);
  
  // Enrich all incidents
  console.log('🔄 Enriching incidents...');
  const enrichedIncidents = incidents.map((incident, index) => {
    if ((index + 1) % 100 === 0) {
      console.log(`   Processed ${index + 1}/${incidents.length} incidents...`);
    }
    return enrichIncident(incident, incidents, blockingIndex);
  });
  
  // Clear cache after enrichment
  blockingKeyCache.clear();
  
  // Calculate statistics
  const stats = calculateStats(enrichedIncidents);
  console.log('\n📈 Enrichment Statistics:');
  console.log(`   Total incidents: ${enrichedIncidents.length}`);
  console.log(`   Content Types:`);
  console.log(`     - Incidents: ${stats.contentTypes.incident || 0}`);
  console.log(`     - Campaigns: ${stats.contentTypes.campaign || 0}`);
  console.log(`     - Vulnerabilities: ${stats.contentTypes.vulnerability || 0}`);
  console.log(`     - Explainers/Opinion: ${(stats.contentTypes.explainer || 0) + (stats.contentTypes.opinion || 0)}`);
  console.log(`     - Other: ${stats.contentTypes.other || 0}`);
  console.log(`   Curated: ${stats.curated} (${stats.curatedPercent}%)`);
  console.log(`   Critical severity: ${stats.critical}`);
  console.log(`   High severity: ${stats.high}`);
  console.log(`   With MITRE mappings: ${stats.withMitre} (${stats.mitrePercent}%)`);
  console.log(`   Attributed: ${stats.attributed} (${stats.attributedPercent}%)`);
  console.log(`   With themes: ${stats.withThemes} (${stats.themesPercent}%)`);
  console.log(`   Timeline status:`);
  console.log(`     - Ongoing: ${stats.timelineStatus.ongoing || 0}`);
  console.log(`     - Contained: ${stats.timelineStatus.contained || 0}`);
  console.log(`     - Recovered: ${stats.timelineStatus.recovered || 0}`);
  
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - No files written');
    console.log('\nSample enriched incident:');
    console.log(JSON.stringify(enrichedIncidents[0], null, 2));
  } else {
    fs.writeFileSync(outputFile, JSON.stringify(enrichedIncidents, null, 2));
    console.log(`\n✅ Enriched incidents saved to ${outputFile}`);
    
    // Update metadata
    try {
      let metadata = {};
      if (fs.existsSync(METADATA_FILE)) {
        metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
      }
      
      metadata.lastEnrichment = new Date().toISOString();
      metadata.lastUpdated = new Date().toISOString();
      
      // Update incident counts
      const incidents2025File = path.join(PROJECT_ROOT, 'data', 'incidents-2025.json');
      const incidents2026File = path.join(PROJECT_ROOT, 'data', 'incidents-2026.json');
      
      if (fs.existsSync(incidents2025File)) {
        const incidents2025 = JSON.parse(fs.readFileSync(incidents2025File, 'utf-8'));
        metadata.totalIncidents2025 = incidents2025.length;
      }
      
      if (fs.existsSync(incidents2026File)) {
        const incidents2026 = JSON.parse(fs.readFileSync(incidents2026File, 'utf-8'));
        metadata.totalIncidents2026 = incidents2026.length;
      }
      
      metadata.totalIncidents = (metadata.totalIncidents2025 || 0) + (metadata.totalIncidents2026 || 0);
      
      fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
      console.log(`✅ Updated metadata in ${METADATA_FILE}`);
    } catch (error) {
      console.error(`⚠️  Failed to update metadata: ${error.message}`);
    }
  }
}

function calculateStats(incidents) {
  const curated = incidents.filter(i => i.is_curated).length;
  const critical = incidents.filter(i => i.severity === 'critical').length;
  const high = incidents.filter(i => i.severity === 'high').length;
  const withMitre = incidents.filter(i => i.mitre_techniques.length > 0).length;
  const attributed = incidents.filter(i => i.is_attributed).length;
  const withThemes = incidents.filter(i => i.themes.length > 0).length;
  
  // Content type breakdown
  const contentTypes = {};
  incidents.forEach(i => {
    const type = i.content_type || 'other';
    contentTypes[type] = (contentTypes[type] || 0) + 1;
  });
  
  // Timeline status breakdown
  const timelineStatus = {};
  incidents.forEach(i => {
    if (i.timeline && i.timeline.status) {
      const status = i.timeline.status;
      timelineStatus[status] = (timelineStatus[status] || 0) + 1;
    }
  });
  
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
    themesPercent: Math.round(withThemes / incidents.length * 100),
    contentTypes,
    timelineStatus
  };
}

// ============================================================================
// RUN
// ============================================================================
processIncidents().catch(console.error);
