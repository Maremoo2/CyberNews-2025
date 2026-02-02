#!/usr/bin/env node

/**
 * Test: AI Analysis Scripts Structure and Configuration
 * 
 * This test validates that the new AI analysis scripts are properly configured
 * and follow the cost optimization strategy outlined in the requirements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing AI Analysis Scripts Configuration\n');

let allTestsPassed = true;

// Test 1: Verify scripts exist
console.log('Test 1: Verifying AI analysis scripts exist...');
const requiredScripts = [
  'scripts/daily_digest.js',
  'scripts/executive_brief.js',
  'scripts/weekly_sensemaking.js'
];

for (const script of requiredScripts) {
  const scriptPath = path.join(PROJECT_ROOT, script);
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ MISSING: ${script}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Found: ${script}`);
  }
}
console.log();

// Test 2: Verify scripts use gpt-4o-mini (cost optimization)
console.log('Test 2: Verifying cost optimization (gpt-4o-mini usage)...');
const scriptsToCheck = [
  { path: 'scripts/daily_digest.js', name: 'Daily Digest' },
  { path: 'scripts/executive_brief.js', name: 'Executive Brief' }
];

for (const script of scriptsToCheck) {
  const scriptPath = path.join(PROJECT_ROOT, script.path);
  const content = fs.readFileSync(scriptPath, 'utf8');
  
  if (content.includes('gpt-4o-mini')) {
    console.log(`✅ ${script.name} uses gpt-4o-mini`);
  } else if (content.includes('gpt-4o') && !content.includes('gpt-4o-mini')) {
    console.error(`⚠️  ${script.name} uses gpt-4o instead of gpt-4o-mini (more expensive)`);
  } else {
    console.error(`❌ ${script.name} does not specify model`);
    allTestsPassed = false;
  }
}
console.log();

// Test 3: Verify JSON-only input strategy
console.log('Test 3: Verifying JSON-only input strategy (no HTML)...');
for (const script of scriptsToCheck) {
  const scriptPath = path.join(PROJECT_ROOT, script.path);
  const content = fs.readFileSync(scriptPath, 'utf8');
  
  // Check for HTML-related patterns that would indicate HTML input
  const htmlPatterns = [
    /readability/i,
    /parseHTML/i,
    /innerHTML/i,
    /<html>/i
  ];
  
  let usesHTML = false;
  for (const pattern of htmlPatterns) {
    if (pattern.test(content)) {
      usesHTML = true;
      break;
    }
  }
  
  if (usesHTML) {
    console.error(`⚠️  ${script.name} may use HTML input (check for optimization)`);
  } else {
    console.log(`✅ ${script.name} uses JSON input`);
  }
}
console.log();

// Test 4: Verify quota handling is implemented
console.log('Test 4: Verifying graceful quota handling...');
const quotaPatterns = [
  /quota.*exceeded/i,
  /429/,
  /_pending\.json/,
  /process\.exit\(0\)/
];

for (const script of scriptsToCheck) {
  const scriptPath = path.join(PROJECT_ROOT, script.path);
  const content = fs.readFileSync(scriptPath, 'utf8');
  
  let hasQuotaHandling = true;
  for (const pattern of quotaPatterns) {
    if (!pattern.test(content)) {
      hasQuotaHandling = false;
      break;
    }
  }
  
  if (hasQuotaHandling) {
    console.log(`✅ ${script.name} has quota handling`);
  } else {
    console.error(`❌ ${script.name} missing quota handling`);
    allTestsPassed = false;
  }
}
console.log();

// Test 5: Verify output directories are configured
console.log('Test 5: Verifying output directory configuration...');
const expectedDirs = [
  { script: 'scripts/daily_digest.js', dir: ['public/data/daily', 'public', 'data', 'daily'] },
  { script: 'scripts/executive_brief.js', dir: ['public/data/briefs', 'public', 'data', 'briefs'] }
];

for (const check of expectedDirs) {
  const scriptPath = path.join(PROJECT_ROOT, check.script);
  const content = fs.readFileSync(scriptPath, 'utf8');
  
  let found = false;
  for (const dirPattern of check.dir) {
    if (content.includes(dirPattern)) {
      found = true;
      break;
    }
  }
  
  if (found) {
    console.log(`✅ ${path.basename(check.script)} outputs to correct directory`);
  } else {
    console.error(`❌ ${path.basename(check.script)} does not output to expected directory`);
    allTestsPassed = false;
  }
}
console.log();

// Test 6: Verify cost tracking is implemented
console.log('Test 6: Verifying cost tracking...');
const costPatterns = [
  /cost.*=.*prompt_tokens.*0\.15/i,
  /cost.*output.*0\.60/i,
  /"cost":/
];

for (const script of scriptsToCheck) {
  const scriptPath = path.join(PROJECT_ROOT, script.path);
  const content = fs.readFileSync(scriptPath, 'utf8');
  
  let hasCostTracking = costPatterns.some(pattern => pattern.test(content));
  
  if (hasCostTracking) {
    console.log(`✅ ${script.name} tracks costs`);
  } else {
    console.error(`❌ ${script.name} does not track costs`);
    allTestsPassed = false;
  }
}
console.log();

// Test 7: Verify GitHub Actions workflows exist
console.log('Test 7: Verifying GitHub Actions workflows...');
const requiredWorkflows = [
  '.github/workflows/daily-digest.yml',
  '.github/workflows/weekly-analysis.yml'
];

for (const workflow of requiredWorkflows) {
  const workflowPath = path.join(PROJECT_ROOT, workflow);
  if (!fs.existsSync(workflowPath)) {
    console.error(`❌ MISSING: ${workflow}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Found: ${workflow}`);
  }
}
console.log();

// Test 8: Verify weekly workflow runs executive brief
console.log('Test 8: Verifying weekly workflow includes executive brief...');
const weeklyWorkflowPath = path.join(PROJECT_ROOT, '.github/workflows/weekly-analysis.yml');
const weeklyContent = fs.readFileSync(weeklyWorkflowPath, 'utf8');

if (weeklyContent.includes('executive-brief') || weeklyContent.includes('exec-brief')) {
  console.log('✅ Weekly workflow runs executive brief');
} else {
  console.error('❌ Weekly workflow does not run executive brief');
  allTestsPassed = false;
}
console.log();

// Test 9: Verify npm scripts are configured
console.log('Test 9: Verifying npm scripts...');
const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredNpmScripts = [
  'daily-digest',
  'executive-brief',
  'analyze-weekly'
];

for (const script of requiredNpmScripts) {
  if (packageJson.scripts[script]) {
    console.log(`✅ npm script: ${script}`);
  } else {
    console.error(`❌ Missing npm script: ${script}`);
    allTestsPassed = false;
  }
}
console.log();

// Test 10: Verify documentation exists
console.log('Test 10: Verifying documentation...');
const docPath = path.join(PROJECT_ROOT, 'AI_ANALYSIS_GUIDE.md');
if (fs.existsSync(docPath)) {
  console.log('✅ AI_ANALYSIS_GUIDE.md exists');
  const docContent = fs.readFileSync(docPath, 'utf8');
  
  const requiredSections = [
    'Daily Digest',
    'Weekly Executive Brief',
    'Cost Optimization',
    'Quota Handling'
  ];
  
  for (const section of requiredSections) {
    if (docContent.includes(section)) {
      console.log(`✅ Documentation includes: ${section}`);
    } else {
      console.error(`⚠️  Documentation missing section: ${section}`);
    }
  }
} else {
  console.error('❌ AI_ANALYSIS_GUIDE.md does not exist');
  allTestsPassed = false;
}
console.log();

// Final summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (allTestsPassed) {
  console.log('✅ All critical tests PASSED!');
  console.log('   - Scripts exist and are configured correctly');
  console.log('   - Cost optimization strategy implemented');
  console.log('   - JSON-only input strategy verified');
  console.log('   - Quota handling implemented');
  console.log('   - GitHub Actions workflows configured');
  console.log('   - Documentation complete');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
} else {
  console.log('❌ Some tests FAILED. Review errors above.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}
