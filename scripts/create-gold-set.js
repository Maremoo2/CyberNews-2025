#!/usr/bin/env node

/**
 * Gold Set Creation and Validation Tool
 * 
 * Creates a manually-labeled gold standard dataset for validating:
 * - Content classification accuracy
 * - Clustering quality (precision/recall)
 * - Actor attribution precision (false positive rate)
 * - Sector/country completeness
 * - Severity bucketing accuracy
 * 
 * Usage:
 *   node scripts/create-gold-set.js --create    # Create sample for manual labeling
 *   node scripts/create-gold-set.js --validate  # Validate against gold set
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const GOLD_SET_FILE = path.join(PROJECT_ROOT, 'data', 'gold-set.json');
const GOLD_SET_SAMPLE = path.join(PROJECT_ROOT, 'data', 'gold-set-sample.json');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args[0];

/**
 * Load enriched incidents
 */
function loadEnrichedIncidents(year) {
  const filePath = path.join(PROJECT_ROOT, 'data', `incidents-${year}-enriched.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Create stratified sample for gold set
 * - 100 "incident-like" items
 * - 30 "intel/campaign/vuln" items
 * - 20 "noise/explainers/products" items
 */
function createGoldSetSample() {
  console.log('📋 Creating Gold Set Sample...\n');
  
  const incidents2026 = loadEnrichedIncidents(2026);
  const incidents2025 = loadEnrichedIncidents(2025);
  const allIncidents = [...incidents2026, ...incidents2025];
  
  console.log(`Total incidents available: ${allIncidents.length}`);
  
  // Stratify by content type
  const byType = {
    incident: allIncidents.filter(i => i.content_type === 'incident'),
    campaign: allIncidents.filter(i => i.content_type === 'campaign'),
    vulnerability: allIncidents.filter(i => i.content_type === 'vulnerability'),
    policy: allIncidents.filter(i => i.content_type === 'policy'),
    explainer: allIncidents.filter(i => i.content_type === 'explainer'),
    opinion: allIncidents.filter(i => i.content_type === 'opinion'),
    product: allIncidents.filter(i => i.content_type === 'product')
  };
  
  console.log('\nContent type distribution:');
  Object.entries(byType).forEach(([type, items]) => {
    console.log(`  ${type}: ${items.length}`);
  });
  
  // Sample strategy:
  // - 100 incidents (including some with actor attribution for validation)
  // - 20 campaigns + 10 vulnerabilities
  // - 10 explainers + 5 opinions + 5 products
  
  const sample = [];
  
  // Sample 100 incidents (mix of attributed and non-attributed)
  const incidentsWithActors = byType.incident.filter(i => i.actor_name);
  const incidentsWithoutActors = byType.incident.filter(i => !i.actor_name);
  
  sample.push(...randomSample(incidentsWithActors, Math.min(30, incidentsWithActors.length)));
  sample.push(...randomSample(incidentsWithoutActors, Math.min(70, incidentsWithoutActors.length)));
  
  // Sample 30 intel/campaign/vuln
  sample.push(...randomSample(byType.campaign, Math.min(20, byType.campaign.length)));
  sample.push(...randomSample(byType.vulnerability, Math.min(10, byType.vulnerability.length)));
  
  // Sample 20 noise/explainers/products
  sample.push(...randomSample(byType.explainer, Math.min(10, byType.explainer.length)));
  sample.push(...randomSample(byType.opinion, Math.min(5, byType.opinion.length)));
  sample.push(...randomSample(byType.product, Math.min(5, byType.product.length)));
  
  console.log(`\n✅ Created sample of ${sample.length} items for manual labeling`);
  
  // Format for manual labeling
  const goldSetTemplate = sample.map(item => ({
    // Original data
    id: item.id,
    title: item.title,
    summary: item.summary,
    date: item.date,
    sourceName: item.sourceName,
    
    // System predictions (to be validated)
    predicted_content_type: item.content_type,
    predicted_case_id: item.case_id,
    predicted_actor: item.actor_name,
    predicted_actor_confidence: item.actor_confidence,
    predicted_sector: item.tags?.[0],
    predicted_country: item.country,
    predicted_severity_score: item.severity_score,
    
    // Manual labels (TO BE FILLED)
    manual_content_type: null, // incident|campaign|vulnerability|policy|explainer|opinion|product
    manual_case_id: null, // group ID for cases that should be merged
    manual_actor_present: null, // true|false
    manual_actor_name: null, // canonical actor name if present
    manual_actor_confidence: null, // high|medium|low
    manual_sector: null,
    manual_country: null,
    manual_severity_bucket: null, // critical|high|moderate|low
    
    // Notes field for ambiguous cases
    notes: ""
  }));
  
  // Save sample
  fs.writeFileSync(GOLD_SET_SAMPLE, JSON.stringify(goldSetTemplate, null, 2));
  console.log(`\n💾 Saved sample to: ${GOLD_SET_SAMPLE}`);
  console.log('\n📝 Next steps:');
  console.log('1. Open data/gold-set-sample.json');
  console.log('2. Fill in all manual_* fields');
  console.log('3. Save as data/gold-set.json');
  console.log('4. Run: node scripts/create-gold-set.js --validate');
}

/**
 * Random sample without replacement
 */
function randomSample(array, n) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

/**
 * Validate system predictions against gold set
 */
function validateGoldSet() {
  if (!fs.existsSync(GOLD_SET_FILE)) {
    console.error('❌ Gold set not found. Run with --create first and manually label the data.');
    process.exit(1);
  }
  
  const goldSet = JSON.parse(fs.readFileSync(GOLD_SET_FILE, 'utf8'));
  console.log(`📊 Validating ${goldSet.length} gold set items...\n`);
  
  // 1. Content Classification Accuracy
  console.log('='.repeat(60));
  console.log('1️⃣  CONTENT CLASSIFICATION ACCURACY');
  console.log('='.repeat(60));
  
  const classificationResults = goldSet.filter(item => item.manual_content_type !== null);
  const classificationCorrect = classificationResults.filter(
    item => item.predicted_content_type === item.manual_content_type
  ).length;
  const classificationAccuracy = (classificationCorrect / classificationResults.length) * 100;
  
  console.log(`Accuracy: ${classificationAccuracy.toFixed(1)}% (${classificationCorrect}/${classificationResults.length})`);
  
  // Confusion matrix
  const confusionMatrix = {};
  classificationResults.forEach(item => {
    const key = `${item.predicted_content_type} → ${item.manual_content_type}`;
    confusionMatrix[key] = (confusionMatrix[key] || 0) + 1;
  });
  
  console.log('\nTop misclassifications:');
  Object.entries(confusionMatrix)
    .filter(([key]) => !key.includes(' → ') || key.split(' → ')[0] !== key.split(' → ')[1])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([key, count]) => {
      console.log(`  ${key}: ${count}`);
    });
  
  // 2. Clustering Quality (Pairwise Precision/Recall)
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣  CLUSTERING QUALITY (Pairwise)');
  console.log('='.repeat(60));
  
  const clusteringResults = goldSet.filter(item => item.manual_case_id !== null);
  let tp = 0, fp = 0, fn = 0;
  
  for (let i = 0; i < clusteringResults.length; i++) {
    for (let j = i + 1; j < clusteringResults.length; j++) {
      const item1 = clusteringResults[i];
      const item2 = clusteringResults[j];
      
      const predictedSame = item1.predicted_case_id === item2.predicted_case_id;
      const actuallySame = item1.manual_case_id === item2.manual_case_id;
      
      if (predictedSame && actuallySame) tp++;
      else if (predictedSame && !actuallySame) fp++;
      else if (!predictedSame && actuallySame) fn++;
    }
  }
  
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;
  
  console.log(`Precision: ${(precision * 100).toFixed(1)}% (${tp} true positives, ${fp} false positives)`);
  console.log(`Recall: ${(recall * 100).toFixed(1)}% (${tp} true positives, ${fn} false negatives)`);
  console.log(`F1 Score: ${(f1 * 100).toFixed(1)}%`);
  
  if (fp > 0) {
    console.log(`\n⚠️  ${fp} false positive merges (over-merging)`);
  }
  if (fn > 0) {
    console.log(`⚠️  ${fn} false negative merges (under-merging)`);
  }
  
  // 3. Actor Attribution Precision
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣  ACTOR ATTRIBUTION PRECISION');
  console.log('='.repeat(60));
  
  const actorResults = goldSet.filter(item => item.manual_actor_present !== null);
  const actorTP = actorResults.filter(item => 
    item.predicted_actor && item.manual_actor_present
  ).length;
  const actorFP = actorResults.filter(item => 
    item.predicted_actor && !item.manual_actor_present
  ).length;
  const actorFN = actorResults.filter(item => 
    !item.predicted_actor && item.manual_actor_present
  ).length;
  
  const actorPrecision = actorTP / (actorTP + actorFP) || 0;
  const actorRecall = actorTP / (actorTP + actorFN) || 0;
  
  console.log(`Precision: ${(actorPrecision * 100).toFixed(1)}% (${actorTP} correct, ${actorFP} false positives)`);
  console.log(`Recall: ${(actorRecall * 100).toFixed(1)}% (${actorTP} found, ${actorFN} missed)`);
  console.log(`False Positive Rate: ${(actorFP / (actorFP + actorTP) * 100).toFixed(1)}%`);
  
  if (actorFP > 0) {
    console.log('\n❌ False positive examples:');
    actorResults
      .filter(item => item.predicted_actor && !item.manual_actor_present)
      .slice(0, 3)
      .forEach(item => {
        console.log(`  - "${item.title}"`);
        console.log(`    Predicted: ${item.predicted_actor} (WRONG)`);
      });
  }
  
  // 4. Sector & Country Completeness
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣  SECTOR & COUNTRY COMPLETENESS');
  console.log('='.repeat(60));
  
  const sectorResults = goldSet.filter(item => item.manual_sector !== null);
  const sectorCorrect = sectorResults.filter(item => 
    item.predicted_sector && item.predicted_sector.toLowerCase().includes(item.manual_sector.toLowerCase())
  ).length;
  const sectorAccuracy = (sectorCorrect / sectorResults.length) * 100;
  
  const countryResults = goldSet.filter(item => item.manual_country !== null);
  const countryCorrect = countryResults.filter(item => 
    item.predicted_country === item.manual_country
  ).length;
  const countryAccuracy = (countryCorrect / countryResults.length) * 100;
  
  console.log(`Sector Accuracy: ${sectorAccuracy.toFixed(1)}% (${sectorCorrect}/${sectorResults.length})`);
  console.log(`Country Accuracy: ${countryAccuracy.toFixed(1)}% (${countryCorrect}/${countryResults.length})`);
  
  // 5. Severity Bucketing
  console.log('\n' + '='.repeat(60));
  console.log('5️⃣  SEVERITY BUCKETING ACCURACY');
  console.log('='.repeat(60));
  
  const severityResults = goldSet.filter(item => item.manual_severity_bucket !== null);
  
  // Map severity scores to buckets
  const severityBuckets = {
    critical: (score) => score >= 80,
    high: (score) => score >= 60 && score < 80,
    moderate: (score) => score >= 30 && score < 60,
    low: (score) => score < 30
  };
  
  const severityCorrect = severityResults.filter(item => {
    const predictedBucket = Object.keys(severityBuckets).find(
      bucket => severityBuckets[bucket](item.predicted_severity_score || 0)
    );
    return predictedBucket === item.manual_severity_bucket;
  }).length;
  
  const severityAccuracy = (severityCorrect / severityResults.length) * 100;
  console.log(`Accuracy: ${severityAccuracy.toFixed(1)}% (${severityCorrect}/${severityResults.length})`);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Content Classification: ${classificationAccuracy.toFixed(1)}%`);
  console.log(`Clustering F1 Score: ${(f1 * 100).toFixed(1)}%`);
  console.log(`Actor Precision: ${(actorPrecision * 100).toFixed(1)}%`);
  console.log(`Actor Recall: ${(actorRecall * 100).toFixed(1)}%`);
  console.log(`Sector Accuracy: ${sectorAccuracy.toFixed(1)}%`);
  console.log(`Severity Accuracy: ${severityAccuracy.toFixed(1)}%`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (classificationAccuracy < 85) {
    console.log('  ⚠️  Content classification needs improvement (target: >85%)');
  }
  if (f1 < 0.8) {
    console.log('  ⚠️  Clustering quality needs improvement (target F1: >80%)');
  }
  if (actorFP / (actorTP + actorFP) > 0.2) {
    console.log('  ⚠️  Actor false positive rate too high (target: <20%)');
  }
  if (actorRecall < 0.5) {
    console.log('  ⚠️  Missing too many actor attributions (target recall: >50%)');
  }
}

/**
 * Main
 */
if (mode === '--create') {
  createGoldSetSample();
} else if (mode === '--validate') {
  validateGoldSet();
} else {
  console.log('Usage:');
  console.log('  node scripts/create-gold-set.js --create    # Create sample for manual labeling');
  console.log('  node scripts/create-gold-set.js --validate  # Validate against gold set');
  process.exit(1);
}
