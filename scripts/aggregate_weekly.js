#!/usr/bin/env node

/**
 * Weekly News Aggregation Script
 * 
 * Scans existing incident data and computes weekly aggregates including:
 * - Counts (total items, incident-related items, cluster count)
 * - Deltas vs last week (exploit-led %, phishing %, token abuse %, ransomware %)
 * - Top themes with confidence scores
 * - Sector deltas (finance, healthcare, technology, etc.)
 * - Attack chain distribution (initial access, execution, persistence, exfiltration)
 * - Top 5 clusters (titles + cluster size + confidence)
 * - Quality metadata (source concentration, language mix, avg confidence)
 * 
 * Usage: node scripts/aggregate_weekly.js [--week=YYYY-WW] [--year=YYYY]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { startOfWeek, endOfWeek, format, getISOWeek, getISOWeekYear } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Utility to clean and truncate cluster titles
function cleanClusterTitle(title) {
  if (!title) return "Untitled";
  const cleaned = String(title)
    .replace(/\s+/g, " ")  // Collapse whitespace
    .trim();
  if (cleaned.length > 120) {
    return cleaned.slice(0, 120) + "...";
  }
  return cleaned;
}

// Parse command line arguments
const args = process.argv.slice(2);
let targetWeek = null;
let targetYear = new Date().getFullYear();

for (const arg of args) {
  if (arg.startsWith('--week=')) {
    targetWeek = arg.split('=')[1]; // Format: YYYY-WW
  } else if (arg.startsWith('--year=')) {
    targetYear = parseInt(arg.split('=')[1], 10);
  }
}

// Determine the week to aggregate
let weekStart, weekEnd, weekNumber, weekYear;

if (targetWeek) {
  // Parse YYYY-WW format
  const [year, week] = targetWeek.split('-').map(Number);
  if (!year || !week || week < 1 || week > 53) {
    console.error(`Error: Invalid week format "${targetWeek}". Expected format: YYYY-WW`);
    process.exit(1);
  }
  
  // Get the first day of the year
  const jan1 = new Date(year, 0, 1);
  // Get to Monday of week 1
  const daysToMonday = (8 - jan1.getDay()) % 7;
  const firstMonday = new Date(year, 0, 1 + daysToMonday);
  
  // Calculate the start of the target week
  weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
  weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  weekNumber = week;
  weekYear = year;
} else {
  // Use the most recent completed week (last Monday to Sunday)
  const today = new Date();
  const lastMonday = startOfWeek(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });
  weekStart = lastMonday;
  weekEnd = endOfWeek(lastMonday, { weekStartsOn: 1 });
  weekNumber = getISOWeek(weekStart);
  weekYear = getISOWeekYear(weekStart);
}

const weekStartStr = format(weekStart, 'yyyy-MM-dd');
const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

console.log(`\n🔍 Aggregating week ${weekYear}-${String(weekNumber).padStart(2, '0')}`);
console.log(`📅 Date range: ${weekStartStr} to ${weekEndStr}\n`);

// Load incident data for the target year
const incidentFile = path.join(PROJECT_ROOT, 'data', `incidents-${targetYear}-enriched.json`);
if (!fs.existsSync(incidentFile)) {
  console.error(`Error: Incident file not found: ${incidentFile}`);
  process.exit(1);
}

const allIncidents = JSON.parse(fs.readFileSync(incidentFile, 'utf8'));
console.log(`📊 Loaded ${allIncidents.length} total incidents from ${targetYear}`);

// Filter incidents for the current week
const weekIncidents = allIncidents.filter(incident => {
  const incidentDate = incident.date;
  return incidentDate >= weekStartStr && incidentDate <= weekEndStr;
});

console.log(`📌 Found ${weekIncidents.length} incidents in target week`);

// Calculate the previous week for delta comparison
const prevWeekStart = new Date(weekStart);
prevWeekStart.setDate(weekStart.getDate() - 7);
const prevWeekEnd = new Date(weekEnd);
prevWeekEnd.setDate(weekEnd.getDate() - 7);
const prevWeekStartStr = format(prevWeekStart, 'yyyy-MM-dd');
const prevWeekEndStr = format(prevWeekEnd, 'yyyy-MM-dd');

const prevWeekIncidents = allIncidents.filter(incident => {
  const incidentDate = incident.date;
  return incidentDate >= prevWeekStartStr && incidentDate <= prevWeekEndStr;
});

console.log(`📊 Previous week had ${prevWeekIncidents.length} incidents`);

// Helper function to count incident-related items (severity >= 60 or has MITRE ATT&CK)
function isIncidentRelated(incident) {
  return (incident.impact >= 60) || 
         (incident.aiAnalysis?.mitreAttack && incident.aiAnalysis.mitreAttack.length > 0);
}

// Helper function to extract themes from incidents
function extractThemes(incidents) {
  const themeCounts = {};
  
  incidents.forEach(incident => {
    // Use buzzwords, tags, and MITRE techniques as themes
    const themes = [
      ...(incident.aiAnalysis?.buzzwords || []),
      ...(incident.tags || []),
      ...(incident.aiAnalysis?.mitreAttack?.map(t => t.technique) || [])
    ];
    
    themes.forEach(theme => {
      if (theme && typeof theme === 'string') {
        const normalizedTheme = theme.toLowerCase().trim();
        if (!themeCounts[normalizedTheme]) {
          themeCounts[normalizedTheme] = { count: 0, theme: normalizedTheme };
        }
        themeCounts[normalizedTheme].count++;
      }
    });
  });
  
  return Object.values(themeCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(t => ({
      theme: t.theme,
      confidence: Math.min(0.9, 0.5 + (t.count / incidents.length) * 0.4),
      item_count: t.count
    }));
}

// Helper function to calculate attack type percentages
function calculateAttackTypePercentages(incidents) {
  const total = incidents.length;
  if (total === 0) return { exploit_led_pct: 0, phishing_pct: 0, token_abuse_pct: 0, ransomware_pct: 0 };
  
  let exploitCount = 0;
  let phishingCount = 0;
  let tokenAbuseCount = 0;
  let ransomwareCount = 0;
  
  incidents.forEach(incident => {
    const title = (incident.title || '').toLowerCase();
    const summary = (incident.summary || '').toLowerCase();
    const combined = title + ' ' + summary;
    const buzzwords = (incident.aiAnalysis?.buzzwords || []).map(b => b.toLowerCase()).join(' ');
    const fullText = combined + ' ' + buzzwords;
    
    if (fullText.includes('exploit') || fullText.includes('vulnerability') || fullText.includes('cve')) {
      exploitCount++;
    }
    if (fullText.includes('phish') || fullText.includes('email') || fullText.includes('spear')) {
      phishingCount++;
    }
    if (fullText.includes('token') || fullText.includes('oauth') || fullText.includes('credential')) {
      tokenAbuseCount++;
    }
    if (fullText.includes('ransomware') || fullText.includes('ransom')) {
      ransomwareCount++;
    }
  });
  
  return {
    exploit_led_pct: ((exploitCount / total) * 100).toFixed(1),
    phishing_pct: ((phishingCount / total) * 100).toFixed(1),
    token_abuse_pct: ((tokenAbuseCount / total) * 100).toFixed(1),
    ransomware_pct: ((ransomwareCount / total) * 100).toFixed(1)
  };
}

// Helper function to calculate sector distribution
function calculateSectorDistribution(incidents) {
  const sectorCounts = {};
  const sectors = ['finance', 'healthcare', 'technology', 'government', 'education', 'energy', 'retail', 'manufacturing'];
  
  incidents.forEach(incident => {
    const title = (incident.title || '').toLowerCase();
    const summary = (incident.summary || '').toLowerCase();
    const combined = title + ' ' + summary;
    
    sectors.forEach(sector => {
      if (combined.includes(sector) || combined.includes(sector + 's')) {
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      }
    });
  });
  
  return Object.entries(sectorCounts)
    .map(([sector, count]) => ({
      sector,
      count,
      percentage: ((count / incidents.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate attack chain distribution
function calculateAttackChainDistribution(incidents) {
  const chainCounts = {
    initial_access: 0,
    execution: 0,
    persistence: 0,
    privilege_escalation: 0,
    defense_evasion: 0,
    credential_access: 0,
    discovery: 0,
    lateral_movement: 0,
    collection: 0,
    exfiltration: 0,
    command_and_control: 0,
    impact: 0
  };
  
  incidents.forEach(incident => {
    const mitreAttacks = incident.aiAnalysis?.mitreAttack || [];
    mitreAttacks.forEach(attack => {
      const tactic = (attack.tactic || '').toLowerCase().replace(/\s+/g, '_');
      if (Object.prototype.hasOwnProperty.call(chainCounts, tactic)) {
        chainCounts[tactic]++;
      }
    });
  });
  
  return Object.entries(chainCounts)
    .filter(([, count]) => count > 0)
    .map(([tactic, count]) => ({
      tactic,
      count,
      percentage: incidents.length > 0 ? ((count / incidents.length) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to create clusters based on similar titles
function createClusters(incidents) {
  const clusters = {};
  
  incidents.forEach(incident => {
    // Improved clustering by extracting multiple key terms from titles
    const title = incident.title || '';
    const words = title.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4); // Only words longer than 4 chars
    
    // Use first 2-3 significant words as cluster key for better granularity
    const clusterKey = words.slice(0, 3).join('-') || 'uncategorized';
    
    if (!clusters[clusterKey]) {
      clusters[clusterKey] = {
        title: clusterKey,
        incidents: [],
        avgImpact: 0
      };
    }
    
    clusters[clusterKey].incidents.push(incident);
  });
  
  // Calculate cluster statistics
  return Object.values(clusters)
    .map(cluster => ({
      title: cleanClusterTitle(cluster.incidents[0]?.title || cluster.title),
      size: cluster.incidents.length,
      confidence: Math.min(0.95, 0.6 + (cluster.incidents.length / incidents.length) * 0.35)
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);
}

// Helper function to calculate quality metadata
function calculateQualityMetadata(incidents) {
  const sourceCounts = {};
  let totalConfidence = 0;
  let confidenceCount = 0;
  
  incidents.forEach(incident => {
    const source = incident.sourceName || 'Unknown';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    
    // Calculate average confidence from MITRE mappings
    if (incident.aiAnalysis?.mitreAttack) {
      incident.aiAnalysis.mitreAttack.forEach(attack => {
        if (attack.confidence) {
          const confMap = { high: 1.0, medium: 0.5, low: 0.2 };
          totalConfidence += confMap[attack.confidence] || 0.5;
          confidenceCount++;
        }
      });
    }
  });
  
  const sortedSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);
  const topThreeSources = sortedSources.slice(0, 3);
  const topThreeCount = topThreeSources.reduce((sum, [, count]) => sum + count, 0);
  const topThreePct = incidents.length > 0 ? ((topThreeCount / incidents.length) * 100).toFixed(0) : 0;
  
  const avgConfidence = confidenceCount > 0 ? (totalConfidence / confidenceCount).toFixed(2) : 0;
  
  return {
    source_concentration_warning: topThreePct >= 50 ? `${topThreePct}% from top 3 feeds` : null,
    avg_confidence: parseFloat(avgConfidence),
    top_sources: topThreeSources.map(([source, count]) => ({ source, count })),
    total_sources: Object.keys(sourceCounts).length
  };
}

// Build the aggregate
const currentWeekStats = calculateAttackTypePercentages(weekIncidents);
const prevWeekStats = calculateAttackTypePercentages(prevWeekIncidents);

const aggregate = {
  week_start: weekStartStr,
  week_end: weekEndStr,
  week_number: weekNumber,
  week_year: weekYear,
  counts: {
    total_items: weekIncidents.length,
    incident_related: weekIncidents.filter(isIncidentRelated).length,
    cluster_count: createClusters(weekIncidents).length
  },
  deltas_vs_last_week: {
    exploit_led_pct: (parseFloat(currentWeekStats.exploit_led_pct) - parseFloat(prevWeekStats.exploit_led_pct)).toFixed(1),
    phishing_pct: (parseFloat(currentWeekStats.phishing_pct) - parseFloat(prevWeekStats.phishing_pct)).toFixed(1),
    token_abuse_pct: (parseFloat(currentWeekStats.token_abuse_pct) - parseFloat(prevWeekStats.token_abuse_pct)).toFixed(1),
    ransomware_pct: (parseFloat(currentWeekStats.ransomware_pct) - parseFloat(prevWeekStats.ransomware_pct)).toFixed(1)
  },
  attack_type_percentages: currentWeekStats,
  top_themes: extractThemes(weekIncidents),
  sector_distribution: calculateSectorDistribution(weekIncidents),
  attack_chain_distribution: calculateAttackChainDistribution(weekIncidents),
  top_clusters: createClusters(weekIncidents),
  quality_metadata: calculateQualityMetadata(weekIncidents)
};

// Save the aggregate
const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'aggregates');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, `week_${weekYear}-${String(weekNumber).padStart(2, '0')}.json`);
fs.writeFileSync(outputFile, JSON.stringify(aggregate, null, 2));

console.log(`\n✅ Aggregate saved to: ${outputFile}`);
console.log(`\n📊 Summary:`);
console.log(`   - Total items: ${aggregate.counts.total_items}`);
console.log(`   - Incident-related: ${aggregate.counts.incident_related}`);
console.log(`   - Cluster count: ${aggregate.counts.cluster_count}`);
console.log(`   - Top theme: ${aggregate.top_themes[0]?.theme || 'N/A'} (${aggregate.top_themes[0]?.item_count || 0} items)`);
console.log(`\n🔄 Week-over-week changes:`);
console.log(`   - Exploit-led: ${aggregate.deltas_vs_last_week.exploit_led_pct}%`);
console.log(`   - Phishing: ${aggregate.deltas_vs_last_week.phishing_pct}%`);
console.log(`   - Token abuse: ${aggregate.deltas_vs_last_week.token_abuse_pct}%`);
console.log(`   - Ransomware: ${aggregate.deltas_vs_last_week.ransomware_pct}%`);
console.log();
