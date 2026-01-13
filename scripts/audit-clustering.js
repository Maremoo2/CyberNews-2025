#!/usr/bin/env node

/**
 * Clustering Quality Audit Tool
 * 
 * Analyzes clustering quality to identify:
 * - Potential duplicates (high similarity but different case_id) - UNDER-MERGING
 * - Suspicious merges (one case_id with mixed orgs/countries/sectors) - OVER-MERGING
 * - Merge/split candidates for manual review
 * 
 * Usage: node scripts/audit-clustering.js [--year=2026]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const yearArg = args.find(arg => arg.startsWith('--year='));
const YEAR = yearArg ? parseInt(yearArg.split('=')[1]) : 2026;

/**
 * Load enriched incidents
 */
function loadIncidents() {
  const filePath = path.join(PROJECT_ROOT, 'data', `incidents-${YEAR}-enriched.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Simple Levenshtein distance for title similarity
 */
function levenshteinSimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase().substring(0, 200);
  const s2 = (str2 || '').toLowerCase().substring(0, 200);
  
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;
  
  const matrix = Array(s2.length + 1).fill(null).map(() => 
    Array(s1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return 1 - (matrix[s2.length][s1.length] / Math.max(s1.length, s2.length));
}

/**
 * Find potential under-merging (high similarity but different case_id)
 * Optimized: Sample random pairs instead of checking all O(n²)
 */
function findPotentialDuplicates(incidents) {
  console.log('\n🔍 Analyzing potential under-merging (missed duplicates)...\n');
  
  const potentialDuplicates = [];
  const SAMPLE_SIZE = 10000; // Check 10K random pairs for performance
  const totalPairs = (incidents.length * (incidents.length - 1)) / 2;
  const samplingRatio = Math.min(1, SAMPLE_SIZE / totalPairs);
  
  console.log(`Total possible pairs: ${totalPairs.toLocaleString()}`);
  console.log(`Sampling ~${Math.floor(totalPairs * samplingRatio).toLocaleString()} pairs (${(samplingRatio * 100).toFixed(1)}%)\n`);
  
  // Sample pairs randomly
  let pairsChecked = 0;
  for (let i = 0; i < incidents.length && pairsChecked < SAMPLE_SIZE; i++) {
    for (let j = i + 1; j < incidents.length && pairsChecked < SAMPLE_SIZE; j++) {
      // Sample with probability = samplingRatio
      if (samplingRatio < 1 && Math.random() > samplingRatio) continue;
      
      const inc1 = incidents[i];
      const inc2 = incidents[j];
      
      // Skip if same case
      if (inc1.case_id === inc2.case_id) continue;
      
      // Quick pre-filter: skip if dates are very far apart (>90 days)
      const daysDiff = Math.abs(new Date(inc1.date) - new Date(inc2.date)) / (1000 * 60 * 60 * 24);
      if (daysDiff > 90) continue;
      
      // Calculate similarity
      const titleSim = levenshteinSimilarity(inc1.title, inc2.title);
      
      // Only compute summary if title is similar enough
      if (titleSim < 0.5) continue;
      
      const summarySim = levenshteinSimilarity(inc1.summary || '', inc2.summary || '');
      const combinedSim = titleSim * 0.7 + summarySim * 0.3;
      
      pairsChecked++;
      
      // Flag if high similarity but different case_id
      if (combinedSim >= 0.65) { // Lower than merge threshold (0.75) to catch near-misses
        potentialDuplicates.push({
          id1: inc1.id,
          id2: inc2.id,
          case_id1: inc1.case_id,
          case_id2: inc2.case_id,
          title1: inc1.title.substring(0, 80),
          title2: inc2.title.substring(0, 80),
          similarity: combinedSim,
          titleSim,
          summarySim,
          date1: inc1.date,
          date2: inc2.date,
          org1: inc1.tags?.[0] || 'unknown',
          org2: inc2.tags?.[0] || 'unknown'
        });
      }
      
      // Progress indicator
      if (pairsChecked % 1000 === 0) {
        process.stdout.write(`\r   Checked ${pairsChecked.toLocaleString()} pairs...`);
      }
    }
  }
  process.stdout.write('\r' + ' '.repeat(50) + '\r');
  
  // Sort by similarity descending
  potentialDuplicates.sort((a, b) => b.similarity - a.similarity);
  
  console.log(`Found ${potentialDuplicates.length} potential under-merged pairs (from ${pairsChecked.toLocaleString()} pairs checked)\n`);
  
  if (potentialDuplicates.length > 0) {
    console.log('Top 10 candidates for merging:');
    console.log('─'.repeat(120));
    potentialDuplicates.slice(0, 10).forEach((pair, idx) => {
      console.log(`${idx + 1}. Similarity: ${(pair.similarity * 100).toFixed(1)}% (title: ${(pair.titleSim * 100).toFixed(0)}%, summary: ${(pair.summarySim * 100).toFixed(0)}%)`);
      console.log(`   Case ${pair.case_id1}: "${pair.title1}"`);
      console.log(`   Case ${pair.case_id2}: "${pair.title2}"`);
      console.log(`   Dates: ${pair.date1} vs ${pair.date2} | Orgs: ${pair.org1} vs ${pair.org2}`);
      console.log('');
    });
  }
  
  return potentialDuplicates;
}

/**
 * Find potential over-merging (one case_id with inconsistent metadata)
 */
function findSuspiciousMerges(incidents) {
  console.log('\n🔍 Analyzing potential over-merging (suspicious clusters)...\n');
  
  // Group by case_id
  const caseGroups = {};
  incidents.forEach(inc => {
    if (!caseGroups[inc.case_id]) {
      caseGroups[inc.case_id] = [];
    }
    caseGroups[inc.case_id].push(inc);
  });
  
  const suspiciousMerges = [];
  
  // Analyze each case cluster
  Object.entries(caseGroups).forEach(([caseId, items]) => {
    if (items.length < 2) return; // Skip single-item cases
    
    // Check for inconsistencies
    const orgs = new Set(items.map(i => i.tags?.[0]).filter(Boolean));
    const countries = new Set(items.map(i => i.country).filter(Boolean));
    const actors = new Set(items.map(i => i.actor_name).filter(Boolean));
    const contentTypes = new Set(items.map(i => i.content_type).filter(Boolean));
    
    // Flag suspicious patterns
    const flags = [];
    if (orgs.size > 1) flags.push(`${orgs.size} different orgs`);
    if (countries.size > 2) flags.push(`${countries.size} different countries`);
    if (actors.size > 1) flags.push(`${actors.size} different actors`);
    if (contentTypes.size > 1) flags.push(`mixed content types: ${Array.from(contentTypes).join(', ')}`);
    
    // Check date spread
    const dates = items.map(i => new Date(i.date)).sort((a, b) => a - b);
    const daySpread = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24);
    if (daySpread > 30) flags.push(`${Math.round(daySpread)} days apart`);
    
    if (flags.length > 0) {
      suspiciousMerges.push({
        case_id: caseId,
        count: items.length,
        flags,
        items: items.map(i => ({
          id: i.id,
          title: i.title.substring(0, 80),
          date: i.date,
          org: i.tags?.[0] || 'unknown',
          country: i.country,
          actor: i.actor_name,
          content_type: i.content_type
        }))
      });
    }
  });
  
  // Sort by suspicion level (more flags = more suspicious)
  suspiciousMerges.sort((a, b) => b.flags.length - a.flags.length);
  
  console.log(`Found ${suspiciousMerges.length} potentially over-merged cases\n`);
  
  if (suspiciousMerges.length > 0) {
    console.log('Top 10 suspicious merges:');
    console.log('─'.repeat(120));
    suspiciousMerges.slice(0, 10).forEach((merge, idx) => {
      console.log(`${idx + 1}. Case ${merge.case_id} (${merge.count} items) - Flags: ${merge.flags.join(', ')}`);
      merge.items.forEach(item => {
        console.log(`   - [${item.date}] "${item.title}"`);
        console.log(`     ${item.org} | ${item.country} | ${item.actor || 'no actor'} | ${item.content_type}`);
      });
      console.log('');
    });
  }
  
  return suspiciousMerges;
}

/**
 * Generate clustering quality metrics
 */
function calculateClusteringMetrics(incidents) {
  console.log('\n📊 Clustering Quality Metrics\n');
  console.log('═'.repeat(60));
  
  const totalItems = incidents.length;
  const uniqueCases = new Set(incidents.map(i => i.case_id)).size;
  const clusteredItems = incidents.filter(i => {
    const caseSiblings = incidents.filter(other => other.case_id === i.case_id);
    return caseSiblings.length > 1;
  }).length;
  
  const clusteringRatio = uniqueCases / totalItems;
  const clusterRate = (1 - clusteringRatio) * 100;
  
  console.log(`Total Items: ${totalItems}`);
  console.log(`Unique Cases: ${uniqueCases}`);
  console.log(`Clustering Ratio: ${(clusteringRatio * 100).toFixed(1)}%`);
  console.log(`Cluster Rate: ${clusterRate.toFixed(1)}% reduction`);
  console.log(`Items in Clusters: ${clusteredItems} (${(clusteredItems / totalItems * 100).toFixed(1)}%)`);
  
  // Case size distribution
  const caseGroups = {};
  incidents.forEach(inc => {
    caseGroups[inc.case_id] = (caseGroups[inc.case_id] || 0) + 1;
  });
  
  const caseSizes = Object.values(caseGroups);
  const singletons = caseSizes.filter(size => size === 1).length;
  const pairs = caseSizes.filter(size => size === 2).length;
  const triples = caseSizes.filter(size => size === 3).length;
  const large = caseSizes.filter(size => size > 3).length;
  const maxSize = Math.max(...caseSizes);
  
  console.log('\nCase Size Distribution:');
  console.log(`  Singletons (1 item): ${singletons} (${(singletons / uniqueCases * 100).toFixed(1)}%)`);
  console.log(`  Pairs (2 items): ${pairs} (${(pairs / uniqueCases * 100).toFixed(1)}%)`);
  console.log(`  Triples (3 items): ${triples} (${(triples / uniqueCases * 100).toFixed(1)}%)`);
  console.log(`  Large (>3 items): ${large} (${(large / uniqueCases * 100).toFixed(1)}%)`);
  console.log(`  Largest cluster: ${maxSize} items`);
  
  console.log('\n' + '═'.repeat(60));
}

/**
 * Main audit
 */
function auditClustering() {
  console.log(`\n🔬 Clustering Quality Audit for ${YEAR}\n`);
  console.log('═'.repeat(60));
  
  const incidents = loadIncidents();
  console.log(`Loaded ${incidents.length} incidents`);
  
  // Calculate metrics
  calculateClusteringMetrics(incidents);
  
  // Find issues
  const potentialDuplicates = findPotentialDuplicates(incidents);
  const suspiciousMerges = findSuspiciousMerges(incidents);
  
  // Save results
  const auditResults = {
    timestamp: new Date().toISOString(),
    year: YEAR,
    total_incidents: incidents.length,
    unique_cases: new Set(incidents.map(i => i.case_id)).size,
    potential_under_merging: potentialDuplicates.length,
    potential_over_merging: suspiciousMerges.length,
    under_merge_candidates: potentialDuplicates.slice(0, 50),
    over_merge_candidates: suspiciousMerges.slice(0, 50)
  };
  
  const outputFile = path.join(PROJECT_ROOT, 'data', `clustering-audit-${YEAR}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(auditResults, null, 2));
  console.log(`\n💾 Full audit results saved to: ${outputFile}`);
  
  // Summary
  console.log('\n📈 SUMMARY\n');
  console.log('═'.repeat(60));
  if (potentialDuplicates.length > 0) {
    console.log(`⚠️  ${potentialDuplicates.length} potential under-merges (missed duplicates)`);
    console.log('   → Review top candidates and add to manual_merges.json');
  }
  if (suspiciousMerges.length > 0) {
    console.log(`⚠️  ${suspiciousMerges.length} suspicious over-merges`);
    console.log('   → Review flagged cases and add splits to manual_splits.json');
  }
  if (potentialDuplicates.length === 0 && suspiciousMerges.length === 0) {
    console.log('✅ No major clustering issues detected');
  }
  console.log('═'.repeat(60));
}

// Run audit
auditClustering();
