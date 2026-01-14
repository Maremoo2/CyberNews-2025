# Gold Set Enhancement - Unknown Labels & Confidence Filtering

## Overview

This enhancement addresses the problem of paywall/teaser articles in the gold-set evaluation, which previously led to inaccurate metrics. The solution introduces:

1. **"unknown" as a valid label** for content that cannot be properly classified
2. **Confidence-based evaluation** to separate high-quality labels from uncertain ones
3. **Dual metric reporting** showing both overall and high-confidence subset metrics

## Changes Made

### 1. Schema Updates

#### New Field: `manual_label_confidence`
- **Values**: `high` | `medium` | `low`
- **Purpose**: Indicates the confidence level of the manual labels
- **Usage**:
  - `high`: Clear, complete content with definitive labels
  - `medium`: Some ambiguity or context needed
  - `low`: Paywall, teaser, or insufficient information

#### Updated Fields

**`manual_content_type`**
- Added: `unknown` (for paywall/teaser/insufficient info)
- Full values: `incident` | `campaign` | `vulnerability` | `policy` | `explainer` | `opinion` | `product` | `unknown`

**`manual_severity_bucket`**
- Added: `unknown` (for paywall/teaser/insufficient info)
- Full values: `critical` | `high` | `moderate` | `low` | `unknown`

### 2. Script Updates

#### `scripts/create-gold-set.js`

**Template Generation**
- Added `manual_label_confidence` field to the template
- Updated comments to include "unknown" as valid value

**Validation Logic**
- Filters out items with `manual_label_confidence === "low"` for high-confidence subset
- Excludes `manual_content_type === "unknown"` from accuracy calculations
- Excludes `manual_severity_bucket === "unknown"` from severity accuracy calculations
- Reports metrics for both full dataset and high-confidence subset

**New Output**
```
OVERALL METRICS:
  Content Classification: X%
  Clustering F1 Score: X%
  Actor Precision: X%
  ...

HIGH-CONFIDENCE METRICS:
  Content Classification: X%
  Clustering F1 Score: X%
  Actor Precision: X%
  ...

CONFIDENCE DISTRIBUTION:
  Low confidence items: X/Y (Z%)
  Unknown content type: X/Y
  Unknown severity: X/Y
```

#### `scripts/label-gold-set.js`

**Paywall/Teaser Detection**
- Detects common paywall indicators:
  - "subscribe to read"
  - "continue reading"
  - "sign up to read"
  - "member only"
  - "premium content"
  - etc.
- Identifies articles with insufficient content (< 100 chars without security keywords)

**Automatic Labeling**
- When paywall/teaser detected:
  - `manual_content_type = "unknown"`
  - `manual_severity_bucket = "unknown"`
  - `manual_label_confidence = "low"`
  - `notes = "paywall/teaser - insufficient info"`

**Enhanced Classification**
- Returns structured objects with confidence indicators
- Adjusts confidence based on content clarity

### 3. Data Updates

All existing entries in `data/gold-set.json` have been updated with:
- `manual_label_confidence: "high"` (default for existing labeled entries)
- Automatic detection and re-labeling of 10 paywall/teaser entries

## Usage

### Creating a New Gold Set Sample

```bash
npm run gold-set:create
```

This creates `data/gold-set-sample.json` with:
- All required fields including `manual_label_confidence`
- Null values for manual fields to be filled
- Proper schema with "unknown" options documented

### Validating Against Gold Set

```bash
npm run gold-set:validate
```

This outputs:
1. Overall metrics (all items)
2. High-confidence subset metrics (excludes low-confidence items)
3. Confidence distribution statistics
4. Recommendations based on high-confidence metrics

### Auto-Labeling with Paywall Detection

```bash
node scripts/label-gold-set.js
```

This automatically:
- Detects paywall/teaser articles
- Sets appropriate "unknown" labels
- Assigns confidence levels
- Adds explanatory notes

## SOC Analyst Guidelines

When manually labeling gold-set entries, follow these rules:

### Use "unknown" Labels When:
1. **Paywall/Teaser**: Article requires subscription to view full content
2. **Insufficient Information**: Summary too short or vague to make confident assessment
3. **Behind Authentication**: Content not accessible without sign-in
4. **Broken/Error Pages**: 404, 429, or other error responses

### Set Confidence Levels:
- **high**: Clear incident/campaign/vuln with concrete indicators in RSS content
- **medium**: Some ambiguity but reasonable classification possible
- **low**: Paywall, teaser, or insufficient data to label properly

### Examples

#### High Confidence
```json
{
  "title": "Healthcare Provider Reports Data Breach Affecting 500,000 Patients",
  "summary": "Regional healthcare provider disclosed a ransomware attack that exposed patient records including names, SSNs, and medical histories...",
  "manual_content_type": "incident",
  "manual_severity_bucket": "high",
  "manual_label_confidence": "high"
}
```

#### Low Confidence (Paywall)
```json
{
  "title": "Major Breach Discovered at Tech Firm",
  "summary": "Subscribe to read the full story about this significant data breach...",
  "manual_content_type": "unknown",
  "manual_severity_bucket": "unknown",
  "manual_label_confidence": "low",
  "notes": "paywall/teaser - insufficient info"
}
```

## Benefits

### 1. Honest Evaluation
- Metrics reflect true performance on content that can actually be classified
- No forced labeling of insufficient data
- Clear separation of reliable vs. unreliable labels

### 2. Better ROI Focus
- Shows where RSS-only pipeline performs well
- Identifies where full-text retrieval would help most
- Targets improvements to high-impact areas

### 3. Standard Practice
- Follows data science best practices for handling uncertain labels
- Enables proper train/test split in future ML work
- Provides confidence-weighted evaluation

## Metrics Interpretation

### Overall Metrics
- Include all items in gold-set
- Show baseline performance
- May be artificially lowered by paywall/noise

### High-Confidence Metrics
- Exclude low-confidence items
- Show true capability on clear content
- Better indicator of pipeline quality
- Use these for recommendations and improvements

## Future Enhancements

1. **Confidence Weighting**: Weight metrics by confidence level (high=1.0, medium=0.5, low=0.0)
2. **Source Quality Scoring**: Track which sources provide full vs. paywalled content
3. **Automatic Full-Text Retrieval**: Fetch full text for low-confidence items
4. **ML Confidence Prediction**: Train model to predict label confidence automatically

## References

- Problem statement: See issue description
- Implementation: `scripts/create-gold-set.js`, `scripts/label-gold-set.js`
- Data: `data/gold-set.json`, `data/gold-set-sample.json`
