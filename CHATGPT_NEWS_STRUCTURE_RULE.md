# 📋 ChatGPT News Structure Rule

This document defines the **mandatory structure** for all cybersecurity news markdown files in the `/news` directory. This structure enables automated parsing and aggregation of data.

## File Location Pattern

```
/news/{YEAR}/{MM-monthname}/{region}/summary.md
```

Examples:
- `/news/2026/01-january/norway/summary.md`
- `/news/2026/02-february/eu/summary.md`
- `/news/2026/03-march/us/summary.md`
- `/news/2026/04-april/asia/summary.md`

## Supported Regions

- `norway` - Norway-specific cybersecurity news
- `eu` - European Union cybersecurity news
- `us` - United States cybersecurity news
- `asia` - Asia-Pacific cybersecurity news

## Required Markdown Structure

All `summary.md` files **MUST** follow this exact structure:

```markdown
# [Month] [Year] - [Region] Cybersecurity Summary

## 📊 Monthly Statistics

**Total Incidents:** [number]
**Most Targeted Sector:** [sector name]
**Most Common Attack Type:** [attack type]
**Severity Distribution:** Critical: [X] | High: [Y] | Medium: [Z] | Low: [W]

## 🔴 Major Incidents

### Incident 1
**Date:** YYYY-MM-DD
**Target:** [target organization/entity]
**Attack Type:** [type of attack]
**Impact:** [description of impact]
**Attribution:** [threat actor or "Unknown"]
**Status:** [status: Active/Resolved/Under Investigation/etc.]
**Source:** [source name] - [URL]

### Incident 2
**Date:** YYYY-MM-DD
**Target:** [target organization/entity]
**Attack Type:** [type of attack]
**Impact:** [description of impact]
**Attribution:** [threat actor or "Unknown"]
**Status:** [status]
**Source:** [source name] - [URL]

[... additional incidents ...]

## 📈 Trends & Analysis

- [Trend 1]: [Description with context]. Kilde: [URL]

- [Trend 2]: [Description with context]. Kilde: [URL]

- [Trend 3]: [Description with context]. Kilde: [URL]

[... additional trends ...]

## 🏛️ Legislation & Policy Updates

- [Policy/Law name]: [Description]. Kilde: [URL]

- [Policy/Law name]: [Description]. Kilde: [URL]

[... additional policy updates ...]

## 🔍 Threat Actor Activity

### [Threat Actor Name]
[Description of activity]. Kilde: [URL]

### [Threat Actor Name]
[Description of activity]. Kilde: [URL]

[... additional threat actors ...]

## 💡 Key Takeaways

- [Takeaway 1]: [Description]. Kilde: [URL]

- [Takeaway 2]: [Description]. Kilde: [URL]

- [Takeaway 3]: [Description]. Kilde: [URL]

[... additional takeaways ...]

---

**Report compiled:** YYYY-MM-DD
**Sources verified:** Yes/No
```

## Parsing Rules

### 1. Monthly Statistics
- **Total Incidents:** Extract number
- **Most Targeted Sector:** Extract sector name
- **Most Common Attack Type:** Extract attack type
- **Severity Distribution:** Parse pattern `Critical: X | High: Y | Medium: Z | Low: W`

### 2. Major Incidents
Each incident must have:
- **Date:** ISO format (YYYY-MM-DD)
- **Target:** Free text
- **Attack Type:** Free text
- **Impact:** Free text description
- **Attribution:** Free text (use "(Unknown)" if not known)
- **Status:** Free text
- **Source:** Source name followed by URL

### 3. Trends & Analysis
- Bullet points starting with `-`
- Each trend should include source link: `Kilde: [URL]`
- Extract main keywords for buzzword analysis

### 4. Legislation & Policy Updates
- Bullet points starting with `-`
- Format: `Policy name: Description. Kilde: [URL]`
- Extract policy names and descriptions

### 5. Threat Actor Activity
- Subsection headers (`###`) for each actor
- Actor name in header
- Description paragraph with source: `Kilde: [URL]`

### 6. Key Takeaways
- Bullet points starting with `-`
- Format: `Main point: Description. Kilde: [URL]`
- Extract for buzzword analysis

## Buzzword Extraction Guidelines

The aggregation script extracts buzzwords from:
- Trends & Analysis section
- Threat Actor Activity section
- Key Takeaways section

**Stop words to filter out (Norwegian):**
`og, er, i, for, av, på, til, med, om, det, en, et, som, ikke, fra, var, ved, har, kan, ble, vil, de, den, eller, men, også, skal, disse, disse, alle, etter, være, mer, blir, nå, over, under, når, mellom, før`

**Stop words to filter out (English):**
`the, a, an, and, or, but, in, on, at, to, for, of, with, by, from, as, is, are, was, were, be, been, being, have, has, had, do, does, did, will, would, should, could, may, might, can, this, that, these, those, all, some, any, more, most, about, into, through, during, before, after, above, below, between, under, over`

**Minimum word length:** 4 characters  
**Top buzzwords returned:** 10-15 most frequent

## Validation

Before committing a new summary file:

1. ✅ Check that all required sections are present
2. ✅ Verify date formats are ISO (YYYY-MM-DD)
3. ✅ Ensure all sources include URLs
4. ✅ Confirm severity distribution adds up correctly
5. ✅ Validate that incident count matches "Total Incidents"

## Example

See `/news/2026/01-january/norway/summary.md` for a complete working example.

## Automated Processing

The aggregation script (`scripts/aggregate-news.js`) reads these files and generates:
- `/data/news-aggregated-2026.json` - Structured JSON for web application
- Aggregated statistics across regions and months
- Buzzword frequency analysis
- Trend insights

This structure enables the **TrendDashboard** component to display:
- Monthly incident counts
- Regional comparisons
- Attack type distributions
- Buzzword clouds
- Threat actor tracking
- Legislative timeline

---

**Last Updated:** 2026-01-02  
**Version:** 1.0
