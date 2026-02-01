#!/usr/bin/env node

/**
 * Test script for AI analysis schema validation
 * Validates that AI outputs match the expected JSON schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Testing AI Analysis Schema\n');

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true });

// Define the expected schema for the analysis output
const analysisSchema = {
  type: "object",
  properties: {
    week_start: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    week_end: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    disclaimer: { 
      type: "string",
      const: "AI-assisted analysis. Hypotheses, not facts."
    },
    hypotheses: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          why_now: { type: "string" },
          supporting_signals: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 4
          },
          counter_signals: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 3
          },
          confidence: {
            type: "string",
            enum: ["low", "medium"]
          },
          validation_steps: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 3
          }
        },
        required: ["claim", "why_now", "supporting_signals", "counter_signals", "confidence", "validation_steps"],
        additionalProperties: false
      }
    },
    uncertainties: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          unknown: { type: "string" },
          why_it_matters: { type: "string" },
          what_data_would_reduce_uncertainty: { type: "string" }
        },
        required: ["unknown", "why_it_matters", "what_data_would_reduce_uncertainty"],
        additionalProperties: false
      }
    },
    signals_to_watch: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          signal: { type: "string" },
          threshold: { type: "string" },
          why_it_matters: { type: "string" },
          recommended_action: { type: "string" }
        },
        required: ["signal", "threshold", "why_it_matters", "recommended_action"],
        additionalProperties: false
      }
    },
    inputs_used: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["week_start", "week_end", "disclaimer", "hypotheses", "uncertainties", "signals_to_watch", "inputs_used"],
  additionalProperties: false
};

// Create validator
const validate = ajv.compile(analysisSchema);

// Test 1: Validate a mock analysis
console.log('Test 1: Validating mock analysis structure...');
const mockAnalysis = {
  week_start: "2026-01-26",
  week_end: "2026-02-01",
  disclaimer: "AI-assisted analysis. Hypotheses, not facts.",
  hypotheses: [
    {
      claim: "Supply chain attacks are accelerating based on 12.3% increase in exploit-led incidents",
      why_now: "The delta shows significant week-over-week growth",
      supporting_signals: [
        "Exploit-led incidents increased by 12.3%",
        "Top cluster: npm package hijacking (15 incidents)"
      ],
      counter_signals: [
        "Sample size is relatively small (100 incidents)"
      ],
      confidence: "medium",
      validation_steps: [
        "Monitor next week's exploit-led percentage",
        "Verify npm supply chain incidents independently"
      ]
    },
    {
      claim: "Phishing activity may be declining based on -3.1% delta",
      why_now: "Represents a potential shift in attacker tactics",
      supporting_signals: [
        "Phishing percentage decreased by 3.1%",
        "Only 18.2% of incidents are phishing-related"
      ],
      counter_signals: [
        "Week-to-week variance can be noise"
      ],
      confidence: "low",
      validation_steps: [
        "Track phishing trends over next 4 weeks",
        "Compare with industry reports"
      ]
    },
    {
      claim: "Token abuse attacks are emerging as a growing threat vector",
      why_now: "Shows 5.7% increase week-over-week",
      supporting_signals: [
        "Token abuse increased by 5.7%",
        "Now represents 12.3% of all attacks"
      ],
      counter_signals: [
        "May reflect better detection rather than actual increase"
      ],
      confidence: "medium",
      validation_steps: [
        "Review OAuth and token-related incidents",
        "Compare with authentication logs"
      ]
    }
  ],
  uncertainties: [
    {
      unknown: "Whether exploit increase is driven by new vulnerabilities or existing CVE exploitation",
      why_it_matters: "Different root causes require different defensive responses",
      what_data_would_reduce_uncertainty: "CVE age distribution and patch status data"
    },
    {
      unknown: "If source concentration warning (67% from top 3 feeds) creates bias",
      why_it_matters: "Heavy reliance on few sources may miss important incidents",
      what_data_would_reduce_uncertainty: "Comparison with alternate threat intelligence feeds"
    },
    {
      unknown: "Whether sector targeting is intentional or coincidental",
      why_it_matters: "Determines if this represents a coordinated campaign",
      what_data_would_reduce_uncertainty: "Actor attribution data and timing analysis"
    }
  ],
  signals_to_watch: [
    {
      signal: "Exploit-led incident percentage",
      threshold: ">40% or 2 consecutive weeks >35%",
      why_it_matters: "Could indicate widespread vulnerability exploitation",
      recommended_action: "Accelerate patch deployment cycles and review vulnerability management"
    },
    {
      signal: "Token abuse percentage",
      threshold: ">15% for 2 consecutive weeks",
      why_it_matters: "Suggests attackers pivoting to authentication bypass",
      recommended_action: "Review OAuth configurations and implement token rotation policies"
    },
    {
      signal: "Source concentration warning",
      threshold: ">70% from top 3 feeds",
      why_it_matters: "Indicates potential blind spots in threat detection",
      recommended_action: "Diversify intelligence sources and validate with internal telemetry"
    }
  ],
  inputs_used: [
    "deltas_vs_last_week.exploit_led_pct",
    "deltas_vs_last_week.phishing_pct",
    "deltas_vs_last_week.token_abuse_pct",
    "attack_type_percentages",
    "top_clusters",
    "quality_metadata.source_concentration_warning"
  ]
};

const isValid = validate(mockAnalysis);

if (!isValid) {
  console.error('❌ Schema validation failed:');
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}

console.log('✅ Mock analysis schema valid\n');

// Test 2: Check for actual analysis files
console.log('Test 2: Checking for generated analysis files...');
const analysisDir = path.join(PROJECT_ROOT, 'data', 'analysis');
if (fs.existsSync(analysisDir)) {
  const files = fs.readdirSync(analysisDir).filter(f => f.startsWith('week_') && f.endsWith('.json'));
  console.log(`✅ Found ${files.length} analysis file(s) in data/analysis/\n`);
  
  if (files.length > 0) {
    console.log('   Latest analyses:');
    files.slice(-3).forEach(f => console.log(`   - ${f}`));
    console.log();
    
    // Validate the most recent analysis
    console.log('Test 3: Validating most recent analysis file...');
    const latestFile = files[files.length - 1];
    const latestPath = path.join(analysisDir, latestFile);
    const latestData = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
    
    if (!latestData.analysis) {
      console.error('❌ Analysis file missing "analysis" field');
      process.exit(1);
    }
    
    const isLatestValid = validate(latestData.analysis);
    if (!isLatestValid) {
      console.error('❌ Latest analysis schema validation failed:');
      console.error(JSON.stringify(validate.errors, null, 2));
      process.exit(1);
    }
    
    console.log(`✅ ${latestFile} schema valid\n`);
  }
} else {
  console.log('⚠️  No analysis directory found (run weekly_sensemaking.js to create)\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All schema tests passed!\n');
