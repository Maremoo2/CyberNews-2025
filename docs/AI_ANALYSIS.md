# AI-Powered Weekly Intelligence Analysis

## Overview

The CyberNews-2025 platform includes an AI-powered weekly intelligence analysis system that generates strategic hypotheses from aggregated cybersecurity incident data. This document explains how the system works, what it can and cannot do, and how to interpret its outputs.

## System Architecture

```
Weekly pipeline → weekly aggregates JSON → OpenAI API → sensemaking JSON → store → UI
```

### Key Design Principles

1. **No Raw Data to AI**: The model sees only weekly aggregates, not individual articles or raw RSS feeds. This prevents "world invention" and hallucination.

2. **Schema-Locked Outputs**: All AI outputs use strict JSON schemas enforced by OpenAI's structured output feature, preventing sloppy formatting and drift.

3. **Audit Trail**: Every analysis is stored with complete metadata including model version, prompt version, timestamp, and token usage.

4. **Clear Labeling**: All AI-generated content is prominently labeled with: *"AI-assisted analysis. Hypotheses, not facts."*

## Components

### 1. Weekly Aggregation Pipeline (`scripts/aggregate_weekly.js`)

**Purpose**: Scans incident data and computes weekly statistics.

**What it does**:
- Counts total items, incident-related items, and cluster count
- Calculates week-over-week deltas (exploit-led %, phishing %, token abuse %, ransomware %)
- Identifies top themes with confidence scores
- Analyzes sector distribution
- Maps attack chain distribution (MITRE ATT&CK tactics)
- Creates top 5 clusters based on incident similarity
- Computes quality metadata (source concentration, language mix, avg confidence)

**Output**: JSON files in `data/aggregates/week_YYYY-WW.json`

**Usage**:
```bash
# Aggregate the most recent completed week
npm run aggregate-weekly

# Aggregate a specific week
node scripts/aggregate_weekly.js --week=2026-05

# Aggregate for a specific year
node scripts/aggregate_weekly.js --year=2026
```

### 2. AI Analysis Agent (`scripts/weekly_sensemaking.js`)

**Purpose**: Generates intelligence hypotheses using OpenAI's API with structured outputs.

**Model**: `gpt-4o-2024-08-06` (supports JSON schema enforcement)

**Temperature**: `0.3` (conservative, reduces creativity to minimize hallucination)

**What it generates**:
- **Exactly 3 hypotheses**: Proposed patterns with supporting/counter evidence
- **Exactly 3 uncertainties**: Known gaps in available data
- **Exactly 3 signals to watch**: Metrics with concrete thresholds

**Safety Constraints**:
- Cannot introduce facts, incidents, CVEs, or actors not in the input
- Every claim must reference specific aggregate data
- Uses only "low" or "medium" confidence (never "high")
- Cannot deduplicate, assign final severity, or perform attribution as truth

**Output**: JSON files in `data/analysis/week_YYYY-WW.json`

**Usage**:
```bash
# Analyze the most recent aggregate
npm run analyze-weekly

# Analyze a specific week
node scripts/weekly_sensemaking.js --week=2026-05

# Analyze a specific aggregate file
node scripts/weekly_sensemaking.js --aggregate=data/aggregates/week_2026-05.json
```

**Environment Setup**:
```bash
# Create .env file with your OpenAI API key
cp .env.example .env

# Edit .env and add your key
OPENAI_API_KEY=sk-your-key-here
```

### 3. GitHub Actions Workflow (`.github/workflows/weekly-analysis.yml`)

**Purpose**: Automates weekly analysis runs.

**Schedule**: Every Monday at 00:00 UTC

**Manual Trigger**: Available via GitHub Actions UI

**What it does**:
1. Checks out repository
2. Installs dependencies
3. Runs weekly aggregation
4. Runs AI analysis (using `OPENAI_API_KEY` from GitHub secrets)
5. Commits results back to repository

**Security**: Uses `secrets.OPENAI_API_KEY` configured in repository settings.

### 4. Frontend Component (`src/components/WeeklyAnalysis.jsx`)

**Purpose**: Displays AI analysis with clear visual hierarchy.

**Features**:
- **Prominent disclaimer banner**: Always visible, cannot be dismissed
- **Metadata display**: Week range, generation date, model version
- **Expandable cards**: For hypotheses, uncertainties, and watch signals
- **Confidence badges**: Visual indicators for "low" vs "medium" confidence
- **Mobile responsive**: Works on all screen sizes
- **Dark mode support**: Adapts to user's color scheme preference

## Understanding the Output

### Hypotheses

**What they are**: Proposed patterns identified in this week's aggregate data.

**Structure**:
- **Claim**: One-sentence falsifiable hypothesis
- **Why Now**: Why this pattern matters this week
- **Supporting Signals**: Evidence from aggregate data (2-4 items)
- **Counter Signals**: Evidence that contradicts the hypothesis (1-3 items)
- **Confidence**: Either "low" or "medium" (never "high")
- **Validation Steps**: Concrete actions to verify the hypothesis (2-3 items)

**How to interpret**:
- ✅ Treat as **starting points for investigation**, not conclusions
- ✅ Check supporting signals against your own data
- ✅ Consider counter signals seriously
- ✅ Follow validation steps before acting

**Example**:
```json
{
  "claim": "Supply chain attacks are accelerating based on 12.3% increase in exploit-led incidents",
  "why_now": "The delta shows significant week-over-week growth",
  "supporting_signals": [
    "Exploit-led incidents increased by 12.3%",
    "Top cluster: npm package hijacking (15 incidents)"
  ],
  "counter_signals": [
    "Sample size is relatively small (100 incidents)"
  ],
  "confidence": "medium",
  "validation_steps": [
    "Monitor next week's exploit-led percentage",
    "Verify npm supply chain incidents independently"
  ]
}
```

### Uncertainties

**What they are**: Known gaps in available data that limit analysis confidence.

**Structure**:
- **Unknown**: What we don't know
- **Why It Matters**: Why this uncertainty is important
- **What Data Would Reduce Uncertainty**: What additional data would help

**How to interpret**:
- ✅ Understand the limitations of the analysis
- ✅ Consider if you have access to the missing data
- ✅ Use these to prioritize data collection efforts

**Example**:
```json
{
  "unknown": "Whether exploit increase is driven by new vulnerabilities or existing CVE exploitation",
  "why_it_matters": "Different root causes require different defensive responses",
  "what_data_would_reduce_uncertainty": "CVE age distribution and patch status data"
}
```

### Signals to Watch

**What they are**: Metrics to monitor with specific thresholds.

**Structure**:
- **Signal**: What metric to monitor
- **Threshold**: Concrete threshold value
- **Why It Matters**: Why this signal is important
- **Recommended Action**: What to do if threshold is crossed

**How to interpret**:
- ✅ Set up monitoring for these metrics
- ✅ Thresholds are suggestions, adjust for your environment
- ✅ Have response plans ready for threshold crossings

**Example**:
```json
{
  "signal": "Exploit-led incident percentage",
  "threshold": ">40% or 2 consecutive weeks >35%",
  "why_it_matters": "Could indicate widespread vulnerability exploitation",
  "recommended_action": "Accelerate patch deployment cycles and review vulnerability management"
}
```

## What the AI Can Do

✅ **Allowed Actions** (from `config/ai_boundaries.json`):
- Propose hypotheses about patterns in aggregates
- Identify uncertainties and required data
- Suggest watch signals with thresholds
- Recommend validation steps

## What the AI Cannot Do

❌ **Prohibited Actions** (from `config/ai_boundaries.json`):
- Merge/deduplicate incidents
- Assign final severity as truth
- Perform attribution as fact
- Rewrite timestamps or counts
- Override CISO filters
- Silently remove items
- Invent new incidents, CVEs, or actors not in aggregates

## Security & Safety Features

### 1. No API Keys in Code
All API keys are stored in environment variables or GitHub secrets, never committed to the repository.

### 2. Schema Validation
All AI outputs are validated against strict JSON schemas before being saved. Invalid outputs are rejected.

### 3. Audit Trail
Every analysis includes:
- `generated_at`: ISO timestamp
- `pipeline_run_id`: Unique run identifier
- `model`: Exact model version used
- `prompt_version`: System prompt version
- `aggregate_path`: Source data path
- `token_usage`: OpenAI API token consumption
- `duration_seconds`: Analysis duration

### 4. Rate Limiting
The system includes retry logic with exponential backoff to handle rate limits gracefully.

### 5. Error Handling
Comprehensive error handling ensures failures don't corrupt data or commit partial results.

## Cost Monitoring

Each analysis logs token usage:
```json
"token_usage": {
  "prompt_tokens": 2500,
  "completion_tokens": 1200,
  "total_tokens": 3700
}
```

**Estimated cost per analysis**: $0.02-0.05 (based on gpt-4o-2024-08-06 pricing)

**Monthly cost** (4 analyses): ~$0.10-0.20

## Testing

### Run Aggregation Tests
```bash
node tests/test_aggregation.js
```

### Run Schema Validation Tests
```bash
node tests/test_schema.js
```

### Test with Sample Data
```bash
# Use the sample aggregate for testing
node scripts/weekly_sensemaking.js --aggregate=tests/sample_aggregate.json
```

## Troubleshooting

### "No aggregate files found"
**Solution**: Run `npm run aggregate-weekly` first to generate aggregates.

### "OPENAI_API_KEY not set"
**Solution**: Create a `.env` file with your OpenAI API key (see Setup section).

### "Rate limit hit"
**Solution**: The script includes automatic retry logic. If it persists, wait a few minutes and try again.

### "Schema validation failed"
**Solution**: This indicates the AI output doesn't match the expected format. Check the error details and report if this persists.

## Best Practices

### For Analysts

1. **Always validate hypotheses** with your own data before taking action
2. **Check counter signals** - they're there for a reason
3. **Follow validation steps** - they're designed to verify claims
4. **Consider uncertainties** - understand the limits of the analysis
5. **Adjust thresholds** - signals to watch are starting points, not absolutes

### For Developers

1. **Never commit API keys** - use environment variables
2. **Validate schema changes** - run tests after modifying schemas
3. **Test with sample data** - use `tests/sample_aggregate.json` for development
4. **Monitor token usage** - keep an eye on costs
5. **Version your prompts** - increment `prompt_version` when changing system prompts

## Manual Triggering

### Via GitHub Actions
1. Go to the **Actions** tab in GitHub
2. Select **Weekly Intelligence Analysis** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow** button

### Via Command Line
```bash
# Generate aggregate for current week
npm run aggregate-weekly

# Generate AI analysis
npm run analyze-weekly
```

## Integration with Existing UI

The `WeeklyAnalysis` component can be integrated into the main application by importing it:

```javascript
import WeeklyAnalysis from './components/WeeklyAnalysis'

// Then use in your component
<WeeklyAnalysis />
```

The component will automatically:
- Load the most recent analysis
- Display with appropriate styling
- Show loading/error states
- Work on mobile devices

## Future Enhancements

Potential improvements for future versions:

1. **Historical trending**: Compare hypotheses across multiple weeks
2. **Confidence evolution**: Track how confidence changes over time
3. **Validation tracking**: Record which validation steps were completed
4. **Custom thresholds**: Allow users to set their own signal thresholds
5. **Email notifications**: Alert when watch signal thresholds are crossed
6. **Multi-model comparison**: Run analysis with different models and compare

## Support

For issues or questions:
1. Check this documentation first
2. Review test files for examples
3. Check GitHub Issues for similar problems
4. Open a new issue with details about your problem

## License

This AI analysis system is part of the CyberNews-2025 project and follows the same license.
