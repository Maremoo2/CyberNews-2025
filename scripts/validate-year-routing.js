#!/usr/bin/env node

/**
 * Year Routing Validation Script
 * 
 * Validates that incidents are stored in the correct year files:
 * - No 2025 incidents in incidents-2026.json
 * - No 2026 incidents in incidents-2025.json
 * - All incident IDs match their file's year
 * - All incident dates match their file's year
 * 
 * Usage: node scripts/validate-year-routing.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Load incidents from a file
 */
function loadIncidents(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`${colors.red}Error loading ${filePath}: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Extract year from date string (YYYY-MM-DD format)
 */
function getYearFromDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }
  const match = dateStr.match(/^(\d{4})-\d{2}-\d{2}$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract year from incident ID
 */
function getYearFromId(idStr) {
  if (!idStr || typeof idStr !== 'string') {
    return null;
  }
  // ID format: YYYYXXX (e.g., 2026001)
  const match = idStr.match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Validate incidents in a specific year file
 */
function validateYearFile(year, fileType = 'json') {
  const fileName = fileType === 'enriched' 
    ? `incidents-${year}-enriched.json`
    : `incidents-${year}.json`;
  const filePath = path.join(PROJECT_ROOT, 'data', fileName);
  
  console.log(`\n${colors.blue}Validating ${fileName}...${colors.reset}`);
  
  const incidents = loadIncidents(filePath);
  if (incidents === null) {
    console.log(`  ${colors.yellow}⚠️  File not found or could not be loaded${colors.reset}`);
    return { valid: true, errors: [] }; // Not an error if file doesn't exist
  }
  
  console.log(`  📊 Total incidents: ${incidents.length}`);
  
  const errors = [];
  const wrongYearDates = [];
  const wrongYearIds = [];
  const invalidDates = [];
  const invalidIds = [];
  let legacyIdCount = 0;
  
  for (const incident of incidents) {
    // Validate date
    if (!incident.date) {
      invalidDates.push(incident.id || 'unknown');
    } else {
      const dateYear = getYearFromDate(incident.date);
      if (dateYear === null) {
        invalidDates.push(`${incident.id}: ${incident.date}`);
      } else if (dateYear !== year) {
        wrongYearDates.push({
          id: incident.id,
          date: incident.date,
          expectedYear: year,
          actualYear: dateYear
        });
      }
    }
    
    // Validate ID
    if (!incident.id) {
      invalidIds.push('missing ID');
    } else {
      const idYear = getYearFromId(incident.id);
      if (idYear === null) {
        // Check if it's a legacy ID (numeric ID without year prefix) for 2025
        // Legacy IDs are acceptable for 2025 only
        if (year === 2025 && /^\d{1,3}$/.test(incident.id)) {
          legacyIdCount++;
          // Legacy IDs are acceptable, skip validation
        } else {
          invalidIds.push(incident.id);
        }
      } else if (idYear !== year) {
        wrongYearIds.push({
          id: incident.id,
          expectedYear: year,
          actualYear: idYear,
          title: incident.title?.substring(0, 60) + '...'
        });
      }
    }
  }
  
  // Report legacy IDs if found
  if (legacyIdCount > 0) {
    console.log(`  ${colors.yellow}ℹ️  Found ${legacyIdCount} legacy IDs (acceptable for 2025)${colors.reset}`);
  }
  
  // Report results
  if (wrongYearDates.length === 0 && wrongYearIds.length === 0 && 
      invalidDates.length === 0 && invalidIds.length === 0) {
    console.log(`  ${colors.green}✅ All incidents have correct year (${year})${colors.reset}`);
    return { valid: true, errors: [] };
  }
  
  // Report errors
  if (wrongYearDates.length > 0) {
    console.log(`  ${colors.red}❌ Found ${wrongYearDates.length} incidents with dates from wrong year:${colors.reset}`);
    wrongYearDates.slice(0, 5).forEach(item => {
      console.log(`     - ${item.id}: date=${item.date} (year ${item.actualYear}, expected ${item.expectedYear})`);
    });
    if (wrongYearDates.length > 5) {
      console.log(`     ... and ${wrongYearDates.length - 5} more`);
    }
    errors.push(...wrongYearDates.map(item => `Date mismatch: ${item.id} has date from ${item.actualYear}, file is for ${item.expectedYear}`));
  }
  
  if (wrongYearIds.length > 0) {
    console.log(`  ${colors.red}❌ Found ${wrongYearIds.length} incidents with IDs from wrong year:${colors.reset}`);
    wrongYearIds.slice(0, 5).forEach(item => {
      console.log(`     - ${item.id} (year ${item.actualYear}, expected ${item.expectedYear}): ${item.title}`);
    });
    if (wrongYearIds.length > 5) {
      console.log(`     ... and ${wrongYearIds.length - 5} more`);
    }
    errors.push(...wrongYearIds.map(item => `ID mismatch: ${item.id} has year ${item.actualYear}, file is for ${item.expectedYear}`));
  }
  
  if (invalidDates.length > 0) {
    console.log(`  ${colors.red}❌ Found ${invalidDates.length} incidents with invalid dates:${colors.reset}`);
    invalidDates.slice(0, 5).forEach(item => {
      console.log(`     - ${item}`);
    });
    if (invalidDates.length > 5) {
      console.log(`     ... and ${invalidDates.length - 5} more`);
    }
    errors.push(...invalidDates.map(item => `Invalid date format: ${item}`));
  }
  
  if (invalidIds.length > 0) {
    console.log(`  ${colors.red}❌ Found ${invalidIds.length} incidents with invalid IDs:${colors.reset}`);
    invalidIds.slice(0, 5).forEach(item => {
      console.log(`     - ${item}`);
    });
    if (invalidIds.length > 5) {
      console.log(`     ... and ${invalidIds.length - 5} more`);
    }
    errors.push(...invalidIds.map(item => `Invalid ID format: ${item}`));
  }
  
  return { valid: false, errors };
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Year Routing Validation');
  console.log('='.repeat(60));
  
  const years = [2025, 2026];
  const fileTypes = ['json', 'enriched'];
  
  let allValid = true;
  const allErrors = [];
  
  for (const year of years) {
    for (const fileType of fileTypes) {
      const result = validateYearFile(year, fileType);
      if (!result.valid) {
        allValid = false;
        allErrors.push(...result.errors);
      }
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  if (allValid) {
    console.log(`${colors.green}✅ VALIDATION PASSED${colors.reset}`);
    console.log('All incidents are in the correct year files!');
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ VALIDATION FAILED${colors.reset}`);
    console.log(`Found ${allErrors.length} error(s)`);
    console.log('\nPlease fix these issues before proceeding.');
    process.exit(1);
  }
}

// Run main function
main();
