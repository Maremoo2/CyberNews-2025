#!/usr/bin/env node

/**
 * Weekly Executive Brief Script
 * 
 * Reads weekly aggregates and generates an executive-friendly brief using OpenAI's API.
 * This complements the existing weekly_sensemaking.js with a more actionable format.
 * 
 * Output includes:
 * - Week's 5 most important things (based on clusters)
 * - New patterns (week-over-week deltas)
 * - Top risks + who's affected (sectors)
 * - 3 watch signals (measurable triggers)
 * - What to check manually (links to clusters)
 * 
 * Uses gpt-4o-mini for cost efficiency.
 * 
 * Usage: node scripts/executive_brief.js [--week=YYYY-WW] [--aggregate=path/to/aggregate.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
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
  timeout: 60 * 1000, // 60 seconds (in milliseconds)
  maxRetries: 0 // We handle retries manually
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
  console.error(`   1. Run 'npm run aggregate-weekly' first`);
  console.error(`   2. Check if the path is correct`);
  console.error(`   3. If specifying --week or --aggregate, verify the format\n`);
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

console.log(`\n📊 Generating Executive Brief: ${path.basename(aggregatePath)}`);
console.log(`📅 Week: ${aggregate.week_start} to ${aggregate.week_end}\n`);

// Define the JSON schema for AI output
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
    top_5_things: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          headline: {
            type: "string",
            description: "Short headline (max 80 chars)"
          },
          summary: {
            type: "string",
            description: "1-2 sentences explaining what happened"
          },
          cluster_reference: {
            type: "string",
            description: "Reference to which cluster(s) this relates to"
          },
          impact_level: {
            type: "string",
            enum: ["critical", "high", "medium"],
            description: "Impact level"
          }
        },
        required: ["headline", "summary", "cluster_reference", "impact_level"],
        additionalProperties: false
      }
    },
    new_patterns: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description: "Description of the new pattern"
          },
          change_indicator: {
            type: "string",
            description: "What changed from last week (reference deltas)"
          },
          significance: {
            type: "string",
            description: "Why this pattern matters"
          }
        },
        required: ["pattern", "change_indicator", "significance"],
        additionalProperties: false
      }
    },
    top_risks: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          risk: {
            type: "string",
            description: "Description of the risk"
          },
          affected_sectors: {
            type: "array",
            items: { type: "string" },
            description: "List of sectors most affected"
          },
          likelihood: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Likelihood of occurrence"
          }
        },
        required: ["risk", "affected_sectors", "likelihood"],
        additionalProperties: false
      }
    },
    watch_signals: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          metric: {
            type: "string",
            description: "What to monitor"
          },
          threshold: {
            type: "string",
            description: "Concrete threshold value"
          },
          action: {
            type: "string",
            description: "What to do if threshold is crossed"
          }
        },
        required: ["metric", "threshold", "action"],
        additionalProperties: false
      }
    },
    manual_review: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          item: {
            type: "string",
            description: "What to review"
          },
          reason: {
            type: "string",
            description: "Why manual review is needed"
          },
          cluster_ref: {
            type: "string",
            description: "Which cluster to check"
          }
        },
        required: ["item", "reason", "cluster_ref"],
        additionalProperties: false
      }
    }
  },
  required: ["week_start", "week_end", "top_5_things", "new_patterns", "top_risks", "watch_signals", "manual_review"],
  additionalProperties: false
};

// Define the system prompt
const systemPrompt = `You are an executive security analyst creating a weekly intelligence brief for senior leadership.

TARGET AUDIENCE:
- C-level executives and security leaders
- Need actionable intelligence, not technical details
- Limited time, high-value decisions

YOUR TASK:
Create a concise executive brief with:
1. Top 5 most important things (based on clusters, not individual articles)
2. New patterns (week-over-week changes from deltas_vs_last_week)
3. Top risks and affected sectors (use sector_distribution data)
4. 3 watch signals (measurable thresholds)
5. What requires manual review (specific clusters to investigate)

CRITICAL CONSTRAINTS:
- Use ONLY data from the provided aggregate
- Reference specific clusters from top_clusters
- Use deltas_vs_last_week for pattern changes
- Use sector_distribution for affected sectors
- Keep language clear, concise, and actionable
- Do NOT invent information
- Focus on business impact, not technical details

STYLE:
- Headlines: max 80 characters
- Summaries: 1-2 sentences
- Be specific: reference numbers, percentages, sectors
- Action-oriented: tell them what to do, not just what happened`;

// Build the user prompt
const userPrompt = `Create an executive brief for this week's cybersecurity intelligence:

WEEK: ${aggregate.week_start} to ${aggregate.week_end}

AGGREGATE DATA:
${JSON.stringify(aggregate, null, 2)}

Generate the executive brief focusing on:
1. Top 5 things (from top_clusters and themes)
2. New patterns (using deltas_vs_last_week)
3. Top risks + sectors (using sector_distribution)
4. 3 watch signals
5. Manual review items (specific clusters)`;

console.log('🤖 Calling OpenAI API (gpt-4o-mini)...');

// Call OpenAI API with retry logic
async function callOpenAIWithRetry(maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2500,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "executive_brief",
            strict: true,
            schema: responseSchema
          }
        }
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ API call successful (${duration}s)`);
      console.log(`   Tokens used: ${completion.usage.total_tokens} (prompt: ${completion.usage.prompt_tokens}, completion: ${completion.usage.completion_tokens})`);
      
      // Calculate cost for gpt-4o-mini: $0.15 per 1M input, $0.60 per 1M output
      const cost = (completion.usage.prompt_tokens * 0.15 / 1000000) + (completion.usage.completion_tokens * 0.60 / 1000000);
      console.log(`   Cost estimate: $${cost.toFixed(4)}`);
      
      return {
        brief: JSON.parse(completion.choices[0].message.content),
        usage: completion.usage,
        model: completion.model,
        duration: duration,
        cost: cost
      };
      
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt}/${maxRetries} failed: ${error.status || 'ERROR'} ${error.message}`);
      
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
  
  throw lastError || new Error('Failed to generate executive brief after all retry attempts without capturing error details');
}

// Execute the API call
let result;
try {
  result = await callOpenAIWithRetry();
} catch (error) {
  console.error('\n❌ Failed to generate brief:', error.message);
  
  // If quota exceeded, save a marker file and exit gracefully
  if (error.message.includes('quota') || error.message.includes('429') || error.status === 429) {
    const quotaMarker = {
      generated_at: new Date().toISOString(),
      status: "quota_exceeded",
      error: error.message,
      week_start: aggregate.week_start,
      week_end: aggregate.week_end,
      week_year: aggregate.week_year,
      week_number: aggregate.week_number,
      note: "OpenAI API quota exceeded. Brief will be generated when quota is restored."
    };
    
    const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'briefs');
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
    console.log('   2. Re-run this script to generate the brief');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }
  
  console.error('\n💥 This appears to be a non-quota error. Check the logs above.\n');
  process.exit(1);
}

// Calculate aggregate hash for reproducibility
const aggregateContent = fs.readFileSync(aggregatePath, 'utf8');
const aggregateSha256 = createHash('sha256').update(aggregateContent).digest('hex');

// Build the output with metadata
const output = {
  generated_at: new Date().toISOString(),
  week_start: aggregate.week_start,
  week_end: aggregate.week_end,
  week_year: aggregate.week_year,
  week_number: aggregate.week_number,
  model: result.model,
  token_usage: result.usage,
  cost: result.cost,
  duration_seconds: parseFloat(result.duration),
  aggregate_sha256: aggregateSha256,
  brief: result.brief
};

// Save the brief
const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'briefs');
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
  console.log(`\n✅ Executive brief saved to: ${outputFile}\n`);
} catch (error) {
  console.error(`❌ Error: Failed to write brief file`);
  console.error(`   File: ${outputFile}`);
  console.error(`   Error: ${error.message}`);
  console.error(`\n💡 Check file system permissions and available disk space\n`);
  process.exit(1);
}

// Display summary
console.log('📊 EXECUTIVE BRIEF SUMMARY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔥 TOP 5 THINGS THIS WEEK:');
result.brief.top_5_things.forEach((item, i) => {
  console.log(`   ${i + 1}. [${item.impact_level.toUpperCase()}] ${item.headline}`);
  console.log(`      ${item.summary}`);
  console.log(`      📎 Cluster: ${item.cluster_reference}`);
  console.log();
});

console.log('📈 NEW PATTERNS (Week-over-Week):');
result.brief.new_patterns.forEach((pattern, i) => {
  console.log(`   ${i + 1}. ${pattern.pattern}`);
  console.log(`      Change: ${pattern.change_indicator}`);
  console.log(`      💡 ${pattern.significance}`);
  console.log();
});

console.log('⚠️  TOP RISKS + AFFECTED SECTORS:');
result.brief.top_risks.forEach((risk, i) => {
  console.log(`   ${i + 1}. [${risk.likelihood.toUpperCase()} likelihood] ${risk.risk}`);
  console.log(`      Sectors: ${risk.affected_sectors.join(', ')}`);
  console.log();
});

console.log('🔔 WATCH SIGNALS (Measurable Thresholds):');
result.brief.watch_signals.forEach((signal, i) => {
  console.log(`   ${i + 1}. ${signal.metric}`);
  console.log(`      Threshold: ${signal.threshold}`);
  console.log(`      Action: ${signal.action}`);
  console.log();
});

console.log('🔍 REQUIRES MANUAL REVIEW:');
result.brief.manual_review.forEach((item, i) => {
  console.log(`   ${i + 1}. ${item.item}`);
  console.log(`      Why: ${item.reason}`);
  console.log(`      📎 Check cluster: ${item.cluster_ref}`);
  console.log();
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Executive brief complete!\n');
