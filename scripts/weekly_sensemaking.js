#!/usr/bin/env node

/**
 * Weekly AI Sensemaking Script
 * 
 * Reads weekly aggregates and generates intelligence analysis using OpenAI's API
 * with structured outputs. Implements strict safety constraints to prevent hallucination.
 * 
 * Usage: node scripts/weekly_sensemaking.js [--week=YYYY-WW] [--aggregate=path/to/aggregate.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Check for OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable not set');
  console.error('   Please set it in your .env file or environment');
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: 90 * 1000, // 90 seconds (in milliseconds)
  maxRetries: 0 // We handle retries manually in callOpenAIWithRetry
});

// Parse command line arguments
const args = process.argv.slice(2);
let aggregatePath = null;
let targetWeek = null;

for (const arg of args) {
  if (arg.startsWith('--aggregate=')) {
    aggregatePath = arg.split('=')[1];
  } else if (arg.startsWith('--week=')) {
    targetWeek = arg.split('=')[1];
  }
}

// Determine which aggregate to analyze
if (!aggregatePath) {
  if (targetWeek) {
    aggregatePath = path.join(PROJECT_ROOT, 'public', 'data', 'aggregates', `week_${targetWeek}.json`);
  } else {
    // Find the most recent aggregate file
    const aggregatesDir = path.join(PROJECT_ROOT, 'public', 'data', 'aggregates');
    if (!fs.existsSync(aggregatesDir)) {
      console.error('❌ Error: No aggregates directory found');
      console.error(`   Expected directory: ${aggregatesDir}`);
      console.error(`\n💡 Run 'npm run aggregate-weekly' first to generate aggregate files\n`);
      process.exit(1);
    }
    
    const files = fs.readdirSync(aggregatesDir)
      .filter(f => f.startsWith('week_') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.error('❌ Error: No aggregate files found in directory');
      console.error(`   Directory: ${aggregatesDir}`);
      console.error(`\n💡 Run 'npm run aggregate-weekly' first to generate aggregate files\n`);
      process.exit(1);
    }
    
    aggregatePath = path.join(aggregatesDir, files[0]);
  }
}

// Load the aggregate
if (!fs.existsSync(aggregatePath)) {
  console.error(`❌ Error: Aggregate file not found`);
  console.error(`   Expected path: ${aggregatePath}`);
  console.error(`   Working directory: ${process.cwd()}`);
  console.error(`\n💡 Possible solutions:`);
  console.error(`   1. Run 'npm run aggregate-weekly' first to generate aggregate files`);
  console.error(`   2. Check if the path is correct`);
  console.error(`   3. If specifying --week or --aggregate, verify the format (YYYY-WW or full path)\n`);
  process.exit(1);
}

let aggregate;
try {
  const aggregateContent = fs.readFileSync(aggregatePath, 'utf8');
  aggregate = JSON.parse(aggregateContent);
} catch (error) {
  console.error(`❌ Error: Failed to parse aggregate file`);
  console.error(`   File: ${aggregatePath}`);
  console.error(`   Error: ${error.message}`);
  console.error(`\n💡 The file may be corrupted or contain invalid JSON\n`);
  process.exit(1);
}

console.log(`\n🔍 Analyzing aggregate: ${path.basename(aggregatePath)}`);
console.log(`📅 Week: ${aggregate.week_start} to ${aggregate.week_end}\n`);

// Define the strict JSON schema for AI output
const responseSchema = {
  type: "object",
  properties: {
    week_start: {
      type: "string",
      description: "Start date of the week in YYYY-MM-DD format"
    },
    week_end: {
      type: "string",
      description: "End date of the week in YYYY-MM-DD format"
    },
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
          claim: {
            type: "string",
            description: "A single-sentence falsifiable hypothesis about a pattern"
          },
          why_now: {
            type: "string",
            description: "Why this pattern matters this week"
          },
          supporting_signals: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 4,
            description: "Evidence from the aggregate data"
          },
          counter_signals: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 3,
            description: "Evidence that contradicts or weakens the hypothesis"
          },
          confidence: {
            type: "string",
            enum: ["low", "medium"],
            description: "Confidence level (never 'high')"
          },
          validation_steps: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 3,
            description: "Concrete steps to validate this hypothesis"
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
          unknown: {
            type: "string",
            description: "What we don't know"
          },
          why_it_matters: {
            type: "string",
            description: "Why this uncertainty is important"
          },
          what_data_would_reduce_uncertainty: {
            type: "string",
            description: "What additional data would help"
          }
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
          signal: {
            type: "string",
            description: "What metric to monitor"
          },
          threshold: {
            type: "string",
            description: "Concrete threshold value"
          },
          why_it_matters: {
            type: "string",
            description: "Why this signal is important"
          },
          recommended_action: {
            type: "string",
            description: "What to do if threshold is crossed"
          }
        },
        required: ["signal", "threshold", "why_it_matters", "recommended_action"],
        additionalProperties: false
      }
    },
    inputs_used: {
      type: "array",
      items: { type: "string" },
      description: "List of aggregate fields referenced in the analysis"
    }
  },
  required: ["week_start", "week_end", "disclaimer", "hypotheses", "uncertainties", "signals_to_watch", "inputs_used"],
  additionalProperties: false
};

// Define the safety-first system prompt
const systemPrompt = `You are an intelligence analyst producing hypotheses from provided weekly aggregates.

CRITICAL CONSTRAINTS:
- Do NOT introduce facts, incidents, CVEs, actors, or numbers not present in the input
- Every claim must reference specific data from the weekly aggregate provided
- If uncertain about any pattern, explicitly mark it as an uncertainty
- Keep claims short, specific, and falsifiable
- Use only "low" or "medium" confidence (never "high")
- You must NOT deduplicate incidents, assign final severity, perform attribution as truth, rewrite timestamps/counts, override filters, or silently drop items

ALLOWED ACTIONS:
- Propose hypotheses about patterns in the aggregates
- Identify uncertainties and what data would resolve them
- Propose watch signals with concrete thresholds
- Suggest validation steps

OUTPUT REQUIREMENTS:
- Exactly 3 hypotheses with supporting/counter signals from input data
- Exactly 3 uncertainties identifying gaps in available data
- Exactly 3 signals to watch with concrete thresholds
- List which aggregate fields you referenced in "inputs_used"
- Disclaimer must be exactly: "AI-assisted analysis. Hypotheses, not facts."

STYLE:
- One sentence per claim
- Bullet points must be traceable to input fields
- Validation steps must be concrete and actionable
- Never output advice like "buy X tool" — keep it operational and lightweight`;

// Build the user prompt with the aggregate data
const userPrompt = `Analyze this weekly cybersecurity aggregate and generate intelligence hypotheses:

WEEK: ${aggregate.week_start} to ${aggregate.week_end}

AGGREGATE DATA:
${JSON.stringify(aggregate, null, 2)}

Generate exactly 3 hypotheses, 3 uncertainties, and 3 watch signals based ONLY on the data above.`;

console.log('🤖 Calling OpenAI API...');
console.log(`   Model: gpt-4o-2024-08-06`);
console.log(`   Temperature: 0.3\n`);

// Call OpenAI API with retries
async function callOpenAIWithRetry(maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "weekly_analysis",
            strict: true,
            schema: responseSchema
          }
        }
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ API call successful (${duration}s)`);
      console.log(`   Tokens used: ${completion.usage.total_tokens} (prompt: ${completion.usage.prompt_tokens}, completion: ${completion.usage.completion_tokens})`);
      console.log(`   Cost estimate: $${((completion.usage.prompt_tokens * 0.0000025) + (completion.usage.completion_tokens * 0.00001)).toFixed(4)}`);
      
      return {
        analysis: JSON.parse(completion.choices[0].message.content),
        usage: completion.usage,
        model: completion.model,
        duration: duration
      };
      
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt}/${maxRetries} failed: ${error.status || 'ERROR'} ${error.message}`);
      
      // Only retry if we have attempts left
      if (attempt < maxRetries) {
        if (error.status === 429) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`   Rate limit hit. Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.log('   Retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }
  
  // If we get here, all retries failed
  // This should always have lastError, but include fallback for safety
  throw lastError || new Error('Unexpected: All retry attempts failed without capturing error');
}

// Execute the API call
let result;
try {
  result = await callOpenAIWithRetry();
} catch (error) {
  console.error('\n❌ Failed to generate analysis:', error.message);
  
  // If quota exceeded, save a marker file and exit gracefully
  if (error.message.includes('quota') || error.message.includes('429') || error.status === 429) {
    const quotaMarker = {
      generated_at: new Date().toISOString(),
      status: "quota_exceeded",
      error: error.message,
      error_status: error.status || 429,
      week_start: aggregate.week_start,
      week_end: aggregate.week_end,
      week_year: aggregate.week_year,
      week_number: aggregate.week_number,
      note: "OpenAI API quota exceeded. Analysis will be generated when quota is restored."
    };
    
    const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'analysis');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const weekIdentifier = `${aggregate.week_year}-${String(aggregate.week_number).padStart(2, '0')}`;
    const outputFile = path.join(outputDir, `week_${weekIdentifier}_pending.json`);
    fs.writeFileSync(outputFile, JSON.stringify(quotaMarker, null, 2));
    
    console.log(`\n⚠️  Quota marker saved to: ${outputFile}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 ACTION REQUIRED:');
    console.log('   1. Add OpenAI API credits at: https://platform.openai.com/settings/organization/billing');
    console.log('   2. Re-run this workflow to generate the analysis');
    console.log('   3. The aggregate data has been saved and is ready for analysis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0); // Exit gracefully, don't fail the workflow
  }
  
  // For other errors, fail with exit code 1
  console.error('\n💥 This appears to be a non-quota error. Check the logs above.\n');
  process.exit(1);
}

// Strict validation function
function validateAnalysisStrict(analysis) {
  const errors = [];

  if (analysis.disclaimer !== "AI-assisted analysis. Hypotheses, not facts.") {
    errors.push(`Invalid disclaimer: "${analysis.disclaimer}"`);
  }
  if (!Array.isArray(analysis.hypotheses) || analysis.hypotheses.length !== 3) {
    errors.push(`Expected 3 hypotheses, got ${analysis.hypotheses?.length ?? "null"}`);
  }
  if (!Array.isArray(analysis.uncertainties) || analysis.uncertainties.length !== 3) {
    errors.push(`Expected 3 uncertainties, got ${analysis.uncertainties?.length ?? "null"}`);
  }
  if (!Array.isArray(analysis.signals_to_watch) || analysis.signals_to_watch.length !== 3) {
    errors.push(`Expected 3 signals_to_watch, got ${analysis.signals_to_watch?.length ?? "null"}`);
  }

  for (const h of analysis.hypotheses || []) {
    if (!["low", "medium"].includes(h.confidence)) {
      errors.push(`Invalid confidence in hypothesis: "${h.confidence}"`);
    }
  }

  if (errors.length) {
    console.error("\n❌ FATAL: Analysis validation failed:");
    for (const e of errors) console.error(`   - ${e}`);
    console.error("\n⚠️  Analysis file will NOT be written.\n");
    process.exit(1);
  }
}

// Validate the response
const analysis = result.analysis;
validateAnalysisStrict(analysis);

// Calculate input hash for reproducibility
const aggregateContent = fs.readFileSync(aggregatePath, 'utf8');
const aggregateSha256 = createHash('sha256').update(aggregateContent).digest('hex');

// Get current git commit
let codeCommit = 'unknown';
try {
  codeCommit = execSync('git rev-parse HEAD', { cwd: PROJECT_ROOT }).toString().trim();
} catch {
  console.warn('⚠️  Could not determine git commit');
}

// Build the output with metadata
const output = {
  generated_at: new Date().toISOString(),
  pipeline_run_id: `run_${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}`,
  model: result.model || "gpt-4o-2024-08-06",
  prompt_version: "v1.0",
  schema_version: "v1.0",
  aggregate_path: path.relative(PROJECT_ROOT, aggregatePath),
  aggregate_sha256: aggregateSha256,
  code_commit: codeCommit,
  token_usage: result.usage,
  duration_seconds: parseFloat(result.duration),
  analysis: analysis
};

// Save the analysis
const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'analysis');
try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
} catch (error) {
  console.error(`❌ Error: Failed to create output directory`);
  console.error(`   Directory: ${outputDir}`);
  console.error(`   Error: ${error.message}`);
  console.error(`\n💡 Check file system permissions\n`);
  process.exit(1);
}

const weekIdentifier = `${aggregate.week_year}-${String(aggregate.week_number).padStart(2, '0')}`;
const outputFile = path.join(outputDir, `week_${weekIdentifier}.json`);

try {
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n✅ Analysis saved to: ${outputFile}\n`);
} catch (error) {
  console.error(`❌ Error: Failed to write analysis file`);
  console.error(`   File: ${outputFile}`);
  console.error(`   Error: ${error.message}`);
  console.error(`\n💡 Check file system permissions and available disk space\n`);
  process.exit(1);
}

// Display summary
console.log('📊 ANALYSIS SUMMARY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  DISCLAIMER:');
console.log(`   ${analysis.disclaimer}\n`);

console.log('💡 HYPOTHESES:');
analysis.hypotheses.forEach((h, i) => {
  console.log(`   ${i + 1}. ${h.claim}`);
  console.log(`      Confidence: ${h.confidence}`);
  console.log(`      Why now: ${h.why_now}`);
  console.log();
});

console.log('❓ UNCERTAINTIES:');
analysis.uncertainties.forEach((u, i) => {
  console.log(`   ${i + 1}. ${u.unknown}`);
  console.log(`      Why it matters: ${u.why_it_matters}`);
  console.log();
});

console.log('🔔 SIGNALS TO WATCH:');
analysis.signals_to_watch.forEach((s, i) => {
  console.log(`   ${i + 1}. ${s.signal}`);
  console.log(`      Threshold: ${s.threshold}`);
  console.log(`      Action: ${s.recommended_action}`);
  console.log();
});

console.log('📋 INPUTS USED:');
console.log(`   ${analysis.inputs_used.join(', ')}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Analysis complete!\n');
