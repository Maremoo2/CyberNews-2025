#!/usr/bin/env node

/**
 * Daily Digest Script
 * 
 * Compresses today's articles into a digestible summary using AI:
 * - Identifies novel clusters (3-5)
 * - Identifies repeat/continuation clusters (3)
 * - Creates 1-2 sentence summaries per cluster + "why it matters"
 * - Saves to public/data/daily/YYYY-MM-DD.json
 * 
 * Uses gpt-4o-mini for cost efficiency.
 * 
 * Usage: node scripts/daily_digest.js [--date=YYYY-MM-DD] [--year=YYYY]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
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
let targetDate = null;
let targetYear = new Date().getFullYear();

for (const arg of args) {
  if (arg.startsWith('--date=')) {
    targetDate = arg.split('=')[1]; // Format: YYYY-MM-DD
  } else if (arg.startsWith('--year=')) {
    targetYear = parseInt(arg.split('=')[1], 10);
  }
}

// Determine the date to process
if (!targetDate) {
  targetDate = format(new Date(), 'yyyy-MM-dd');
}

console.log(`\n📰 Daily Digest for ${targetDate}\n`);

// Load enriched incident data for the target year
const incidentFile = path.join(PROJECT_ROOT, 'data', `incidents-${targetYear}-enriched.json`);
if (!fs.existsSync(incidentFile)) {
  console.error(`❌ Error: Incident file not found: ${incidentFile}`);
  process.exit(1);
}

const allIncidents = JSON.parse(fs.readFileSync(incidentFile, 'utf8'));

// Filter incidents for the target date
const todaysIncidents = allIncidents.filter(item => item.date === targetDate);

console.log(`📊 Found ${todaysIncidents.length} items for ${targetDate}`);

if (todaysIncidents.length === 0) {
  console.log('⚠️  No items found for this date. Exiting.');
  process.exit(0);
}

// Prepare simplified data for AI (to minimize tokens)
const simplifiedItems = todaysIncidents.map(item => ({
  title: item.title,
  summary: item.summary?.substring(0, 200) || '', // Limit to 200 chars
  tags: item.tags || [],
  impact: item.impact || 0,
  region: item.region || 'Unknown',
  country: item.country || 'Unknown',
  threats: item.aiAnalysis?.threatActors || [],
  malware: item.aiAnalysis?.malwareFamilies || [],
  cves: item.aiAnalysis?.cves || []
}));

// Define the JSON schema for AI output
const responseSchema = {
  type: "object",
  properties: {
    date: {
      type: "string",
      description: "Date in YYYY-MM-DD format"
    },
    summary: {
      type: "string",
      description: "10-20 line summary of what happened today"
    },
    novel_clusters: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          theme: {
            type: "string",
            description: "Short name for this cluster (e.g., 'eScan Supply Chain Attack')"
          },
          summary: {
            type: "string",
            description: "1-2 sentences describing what happened"
          },
          why_matters: {
            type: "string",
            description: "Why this matters - impact and implications"
          },
          item_count: {
            type: "number",
            description: "Number of related items in this cluster"
          }
        },
        required: ["theme", "summary", "why_matters", "item_count"],
        additionalProperties: false
      }
    },
    continuation_clusters: {
      type: "array",
      minItems: 0,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          theme: {
            type: "string",
            description: "Theme that continues from previous days"
          },
          summary: {
            type: "string",
            description: "What's new today about this continuing story"
          },
          item_count: {
            type: "number",
            description: "Number of related items"
          }
        },
        required: ["theme", "summary", "item_count"],
        additionalProperties: false
      }
    }
  },
  required: ["date", "summary", "novel_clusters", "continuation_clusters"],
  additionalProperties: false
};

// Define the system prompt
const systemPrompt = `You are a cybersecurity news analyst creating a daily digest.

TASK:
- Analyze today's cybersecurity news items
- Identify 3-5 novel/new clusters (new incidents, vulnerabilities, attacks)
- Identify 0-3 continuation clusters (ongoing stories from previous days)
- Create a concise summary (10-20 lines) of what happened today

CLUSTERING GUIDELINES:
- Group items by similar themes, actors, malware, or vulnerabilities
- Novel clusters: New incidents, new vulnerabilities, new attack campaigns
- Continuation clusters: Updates to known incidents, patches released, ongoing investigations

OUTPUT REQUIREMENTS:
- Summary: 10-20 lines covering the day's highlights
- Novel clusters: 3-5 clusters with 1-2 sentence summaries + why it matters
- Continuation clusters: 0-3 clusters if there are ongoing stories
- Keep summaries concise and factual
- Reference specific data from the input (CVEs, threat actors, malware families)

CONSTRAINTS:
- Do NOT invent information not in the input
- Do NOT combine unrelated incidents
- Keep language clear and professional
- Focus on actionable insights`;

// Build the user prompt
const userPrompt = `Analyze today's cybersecurity news and create a daily digest:

DATE: ${targetDate}
TOTAL ITEMS: ${simplifiedItems.length}

NEWS ITEMS:
${JSON.stringify(simplifiedItems, null, 2)}

Create a daily digest with:
1. A 10-20 line summary of today's key events
2. 3-5 novel clusters (new incidents/vulnerabilities)
3. 0-3 continuation clusters (if applicable)

Focus on the most important and impactful items.`;

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
        max_tokens: 2000,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "daily_digest",
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
        digest: JSON.parse(completion.choices[0].message.content),
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
  
  throw lastError || new Error('Failed to generate daily digest after all retry attempts without capturing error details');
}

// Execute the API call
let result;
try {
  result = await callOpenAIWithRetry();
} catch (error) {
  console.error('\n❌ Failed to generate digest:', error.message);
  
  // If quota exceeded, save a marker file and exit gracefully
  if (error.message.includes('quota') || error.message.includes('429') || error.status === 429) {
    const quotaMarker = {
      generated_at: new Date().toISOString(),
      status: "quota_exceeded",
      error: error.message,
      date: targetDate,
      note: "OpenAI API quota exceeded. Digest will be generated when quota is restored."
    };
    
    const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'daily');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, `${targetDate}_pending.json`);
    fs.writeFileSync(outputFile, JSON.stringify(quotaMarker, null, 2));
    
    console.log(`\n⚠️  Quota marker saved to: ${outputFile}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 ACTION REQUIRED:');
    console.log('   1. Add OpenAI API credits at: https://platform.openai.com/settings/organization/billing');
    console.log('   2. Re-run this script to generate the digest');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }
  
  console.error('\n💥 This appears to be a non-quota error. Check the logs above.\n');
  process.exit(1);
}

// Build the output with metadata
const output = {
  generated_at: new Date().toISOString(),
  date: targetDate,
  model: result.model,
  token_usage: result.usage,
  cost: result.cost,
  duration_seconds: parseFloat(result.duration),
  item_count: todaysIncidents.length,
  digest: result.digest
};

// Save the digest
const outputDir = path.join(PROJECT_ROOT, 'public', 'data', 'daily');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, `${targetDate}.json`);
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

console.log(`\n✅ Daily digest saved to: ${outputFile}\n`);

// Display summary
console.log('📊 DAILY DIGEST SUMMARY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 SUMMARY:');
console.log(result.digest.summary);
console.log();

console.log('🆕 NOVEL CLUSTERS:');
result.digest.novel_clusters.forEach((cluster, i) => {
  console.log(`   ${i + 1}. ${cluster.theme} (${cluster.item_count} items)`);
  console.log(`      ${cluster.summary}`);
  console.log(`      💡 ${cluster.why_matters}`);
  console.log();
});

if (result.digest.continuation_clusters.length > 0) {
  console.log('🔄 CONTINUATION CLUSTERS:');
  result.digest.continuation_clusters.forEach((cluster, i) => {
    console.log(`   ${i + 1}. ${cluster.theme} (${cluster.item_count} items)`);
    console.log(`      ${cluster.summary}`);
    console.log();
  });
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Daily digest complete!\n');
