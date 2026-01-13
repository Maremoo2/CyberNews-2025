#!/usr/bin/env node

/**
 * Data Quality Assurance Tests
 * 
 * Lightweight regression tests to prevent data inconsistencies:
 * - Actor count consistency
 * - Sector count consistency  
 * - Clustering integrity
 * - Content type distribution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Load enriched data
function loadData(year) {
  const filePath = path.join(PROJECT_ROOT, 'data', `incidents-${year}-enriched.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Test 1: If actors are named, unique_actor_count > 0
function testActorCountConsistency(incidents, year) {
  const actorsNamed = incidents.filter(i => i.actor_name && i.actor_name.trim()).length;
  const uniqueActors = new Set(
    incidents
      .filter(i => i.actor_name && i.actor_name.trim())
      .map(i => i.actor_name.toLowerCase().trim())
  );
  
  if (actorsNamed > 0 && uniqueActors.size === 0) {
    log(`  ❌ FAIL: ${year} has ${actorsNamed} incidents with actor names but 0 unique actors`, 'red');
    return false;
  }
  
  log(`  ✓ ${year}: ${actorsNamed} incidents with actors → ${uniqueActors.size} unique actors`, 'green');
  return true;
}

// Test 2: Sector count consistency
function testSectorCountConsistency(incidents, year) {
  const incidentsWithSectors = incidents.filter(i => i.tags && i.tags.length > 0).length;
  const uniqueSectors = new Set(
    incidents
      .filter(i => i.tags && i.tags.length > 0)
      .flatMap(i => i.tags)
  );
  
  if (incidentsWithSectors > 0 && uniqueSectors.size === 0) {
    log(`  ❌ FAIL: ${year} has ${incidentsWithSectors} incidents with sectors but 0 unique sectors`, 'red');
    return false;
  }
  
  log(`  ✓ ${year}: ${incidentsWithSectors} incidents with sectors → ${uniqueSectors.size} unique sectors`, 'green');
  return true;
}

// Test 3: Clustering integrity (case_id consistency)
function testClusteringIntegrity(incidents, year) {
  const withCaseId = incidents.filter(i => i.case_id).length;
  const uniqueCaseIds = new Set(incidents.filter(i => i.case_id).map(i => i.case_id));
  
  if (withCaseId !== incidents.length) {
    log(`  ⚠️  WARNING: ${year} has ${withCaseId}/${incidents.length} incidents with case_id`, 'yellow');
  }
  
  // Check if clustering reduced count (some incidents share case_id)
  const clusteringRatio = uniqueCaseIds.size / incidents.length;
  log(`  ✓ ${year}: ${incidents.length} incidents → ${uniqueCaseIds.size} unique cases (${(clusteringRatio * 100).toFixed(1)}% clustering)`, 'green');
  
  return true;
}

// Test 4: Content type distribution sanity
function testContentTypeDistribution(incidents, year) {
  const contentTypes = {};
  incidents.forEach(i => {
    const type = i.content_type || 'unknown';
    contentTypes[type] = (contentTypes[type] || 0) + 1;
  });
  
  const incidentCount = contentTypes.incident || 0;
  const totalCount = incidents.length;
  const incidentPercentage = (incidentCount / totalCount) * 100;
  
  // Sanity check: incidents should be 40-80% of total
  if (incidentPercentage < 40 || incidentPercentage > 80) {
    log(`  ⚠️  WARNING: ${year} has ${incidentPercentage.toFixed(1)}% incidents (expected 40-80%)`, 'yellow');
  }
  
  const typesSummary = Object.entries(contentTypes)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `${type}: ${count} (${((count/totalCount)*100).toFixed(1)}%)`)
    .join(', ');
  
  log(`  ✓ ${year} content types: ${typesSummary}`, 'green');
  return true;
}

// Test 5: Enrichment completeness
function testEnrichmentCompleteness(incidents, year) {
  const withMitre = incidents.filter(i => i.mitre_techniques && i.mitre_techniques.length > 0).length;
  const withThemes = incidents.filter(i => i.themes && i.themes.length > 0).length;
  const withSeverity = incidents.filter(i => i.severity_score > 0).length;
  const curated = incidents.filter(i => i.is_curated).length;
  
  const completeness = {
    mitre: (withMitre / incidents.length) * 100,
    themes: (withThemes / incidents.length) * 100,
    severity: (withSeverity / incidents.length) * 100,
    curated: (curated / incidents.length) * 100
  };
  
  // Warning if completeness is too low
  if (completeness.severity < 50) {
    log(`  ⚠️  WARNING: ${year} has only ${completeness.severity.toFixed(1)}% with severity scores`, 'yellow');
  }
  
  log(`  ✓ ${year} enrichment: MITRE ${completeness.mitre.toFixed(0)}%, Themes ${completeness.themes.toFixed(0)}%, Curated ${completeness.curated.toFixed(0)}%`, 'green');
  return true;
}

// Run all tests
function runTests() {
  log('\n📋 Running Data QA Tests...', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  let allPassed = true;
  const years = [2025, 2026];
  
  for (const year of years) {
    const incidents = loadData(year);
    
    if (!incidents) {
      log(`  ⚠️  SKIP: No enriched data for ${year}`, 'yellow');
      continue;
    }
    
    log(`\n📊 Testing ${year} data (${incidents.length} incidents)`, 'bold');
    
    // Run tests
    const tests = [
      () => testActorCountConsistency(incidents, year),
      () => testSectorCountConsistency(incidents, year),
      () => testClusteringIntegrity(incidents, year),
      () => testContentTypeDistribution(incidents, year),
      () => testEnrichmentCompleteness(incidents, year)
    ];
    
    for (const test of tests) {
      try {
        const passed = test();
        if (!passed) allPassed = false;
      } catch (error) {
        log(`  ❌ ERROR: ${error.message}`, 'red');
        allPassed = false;
      }
    }
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  if (allPassed) {
    log('✅ All data QA tests passed!', 'green');
    process.exit(0);
  } else {
    log('❌ Some data QA tests failed!', 'red');
    process.exit(1);
  }
}

// Run tests
runTests();
