# AI Analysis Features

This document describes the AI-powered analysis features for CyberNews.

## Overview

CyberNews uses OpenAI's API to provide three levels of intelligence analysis:

1. **Daily Digest** - Compress today's news into digestible summaries
2. **Weekly Executive Brief** - Actionable intelligence for leadership
3. **Weekly Analysis** - Detailed hypotheses and patterns (existing feature)

## Cost Optimization Strategy

All features use **gpt-4o-mini** for cost efficiency:
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens
- Typical daily digest: $0.001-0.003
- Typical weekly brief: $0.002-0.005

### Why JSON Input?
- ✅ Stable structure, low token count
- ✅ Minimal hallucination risk
- ✅ Predictable costs
- ❌ HTML clips consume 10-50x more tokens

## Features

### 1. Daily Digest

**Purpose**: Compress daily news into a digestible summary.

**Usage**:
```bash
npm run daily-digest [--date=YYYY-MM-DD] [--year=YYYY]
```

**Output**: `public/data/daily/YYYY-MM-DD.json`

**Content**:
- 10-20 line summary of the day's events
- 3-5 novel/new clusters (new vulnerabilities, attacks, incidents)
- 0-3 continuation clusters (ongoing stories)
- Each cluster includes:
  - Theme name
  - 1-2 sentence summary
  - "Why it matters" explanation
  - Item count

**Automated**: Runs daily at 22:00 UTC via GitHub Actions

**Example Output**:
```json
{
  "date": "2026-02-02",
  "summary": "Today saw significant supply chain attacks...",
  "novel_clusters": [
    {
      "theme": "eScan Supply Chain Attack",
      "summary": "Antivirus update servers compromised to deliver malware.",
      "why_matters": "Highlights risks in security software supply chains.",
      "item_count": 3
    }
  ],
  "continuation_clusters": []
}
```

### 2. Weekly Executive Brief

**Purpose**: Provide actionable intelligence for C-level executives and security leaders.

**Usage**:
```bash
npm run executive-brief [--week=YYYY-WW]
```

**Output**: `public/data/briefs/week_YYYY-WW.json`

**Content**:
- **Top 5 Things**: Most important events of the week (cluster-based)
  - Headlines (max 80 chars)
  - Summaries with impact levels (critical/high/medium)
  - Cluster references
- **New Patterns**: Week-over-week changes
  - Uses `deltas_vs_last_week` data
  - Explains significance
- **Top Risks + Affected Sectors**: 
  - Risk descriptions
  - Which sectors are impacted
  - Likelihood assessment
- **3 Watch Signals**: Measurable thresholds to monitor
  - Specific metrics
  - Concrete thresholds
  - Recommended actions
- **Manual Review Items**: What requires human attention
  - Specific clusters to investigate
  - Reasons for review

**Automated**: Runs weekly on Mondays at 00:00 UTC via GitHub Actions

**Example Output**:
```json
{
  "top_5_things": [
    {
      "headline": "eScan Antivirus Supply Chain Compromise",
      "summary": "Update servers compromised to deliver persistent malware.",
      "cluster_reference": "Supply chain attacks cluster",
      "impact_level": "critical"
    }
  ],
  "new_patterns": [
    {
      "pattern": "Phishing activity increased 1.8%",
      "change_indicator": "+1.8% from last week",
      "significance": "Sustained increase suggests active campaigns"
    }
  ],
  "top_risks": [
    {
      "risk": "Supply chain attacks on security tools",
      "affected_sectors": ["technology", "finance", "healthcare"],
      "likelihood": "high"
    }
  ],
  "watch_signals": [
    {
      "metric": "Phishing percentage",
      "threshold": "> 10%",
      "action": "Review anti-phishing controls"
    }
  ],
  "manual_review": [
    {
      "item": "Review supply chain security",
      "reason": "Multiple security tool compromises this week",
      "cluster_ref": "Supply chain attacks"
    }
  ]
}
```

### 3. Weekly Analysis (Existing)

**Purpose**: Detailed intelligence analysis with hypotheses.

**Usage**:
```bash
npm run analyze-weekly [--week=YYYY-WW]
```

**Output**: `public/data/analysis/week_YYYY-WW.json`

**Content**:
- 3 hypotheses with supporting/counter signals
- 3 uncertainties
- 3 signals to watch
- Validation steps

See existing documentation for details.

## Quota Handling

All scripts implement graceful quota handling:

1. **On quota exceeded (429 error)**:
   - Saves a `_pending.json` marker file
   - Exits with code 0 (success)
   - Provides clear guidance on next steps
   - Workflow continues normally

2. **On other errors**:
   - Exits with code 1 (failure)
   - Workflow fails appropriately

3. **Marker file example**:
```json
{
  "status": "quota_exceeded",
  "date": "2026-02-02",
  "note": "OpenAI API quota exceeded. Digest will be generated when quota is restored."
}
```

## GitHub Actions Workflows

### Daily Digest Workflow
- **File**: `.github/workflows/daily-digest.yml`
- **Schedule**: Daily at 22:00 UTC
- **Trigger**: After news collection
- **Commits**: `public/data/daily/YYYY-MM-DD.json`

### Weekly Analysis Workflow
- **File**: `.github/workflows/weekly-analysis.yml`
- **Schedule**: Weekly on Mondays at 00:00 UTC
- **Runs**:
  1. Weekly aggregation
  2. Weekly analysis (existing)
  3. **NEW**: Executive brief
- **Commits**: 
  - `public/data/aggregates/week_YYYY-WW.json`
  - `public/data/analysis/week_YYYY-WW.json`
  - `public/data/briefs/week_YYYY-WW.json`

## Cost Tracking

All outputs include cost tracking:

```json
{
  "model": "gpt-4o-mini",
  "token_usage": {
    "prompt_tokens": 1234,
    "completion_tokens": 567,
    "total_tokens": 1801
  },
  "cost": 0.00052
}
```

## Manual Runs

All scripts can be run manually:

```bash
# Daily digest for specific date
npm run daily-digest -- --date=2026-02-02

# Executive brief for specific week
npm run executive-brief -- --week=2026-05

# Weekly analysis for specific week
npm run analyze-weekly -- --week=2026-05
```

## Environment Setup

Required environment variable:
```bash
export OPENAI_API_KEY="sk-proj-..."
```

For local development, create a `.env` file (not committed):
```
OPENAI_API_KEY=sk-proj-...
```

## Future Enhancements (Not Implemented)

### Monthly Deep Dive
- Analyze top 20-50 clusters from the month
- Trend analysis, tactic changes, bias detection
- More expensive (consider gpt-4o or specialized models)
- Can be added as `scripts/monthly_deepdive.js`

## Best Practices

1. **Input Data**: Always use JSON aggregates, never HTML clips
2. **Token Limits**: Keep prompts focused and concise
3. **Error Handling**: Check for `_pending.json` files
4. **Cost Monitoring**: Review token usage in output files
5. **Manual Review**: Always verify AI outputs, especially for critical decisions

## Troubleshooting

### Quota Exceeded
1. Check for `_pending.json` files
2. Add credits at: https://platform.openai.com/settings/organization/billing
3. Re-run the script manually

### Script Failures
1. Check GitHub Actions logs
2. Verify OPENAI_API_KEY is set
3. Check input data exists (aggregates, enriched incidents)
4. Review error messages for API issues

### Cost Concerns
- Daily digest: ~$0.001-0.003 per day = ~$1/month
- Weekly brief: ~$0.002-0.005 per week = ~$0.25/month
- Weekly analysis: ~$0.01-0.02 per week = ~$1/month
- **Total estimated**: ~$2-3/month

## Related Files

- `scripts/daily_digest.js` - Daily digest generator
- `scripts/executive_brief.js` - Weekly executive brief generator
- `scripts/weekly_sensemaking.js` - Weekly analysis generator (existing)
- `scripts/aggregate_weekly.js` - Weekly aggregator (existing)
- `.github/workflows/daily-digest.yml` - Daily digest automation
- `.github/workflows/weekly-analysis.yml` - Weekly automation (updated)
