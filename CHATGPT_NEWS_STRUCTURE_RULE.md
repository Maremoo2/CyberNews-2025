# ChatGPT News Structure Rule

## Purpose
This document defines the standard markdown structure for cybersecurity news summaries that will be parsed by the automated aggregation system.

## File Location
News summaries should be placed in the following directory structure:
```
/news/[YEAR]/[MONTH-NAME]/[REGION]/summary.md
```

Examples:
- `/news/2026/01-january/norway/summary.md`
- `/news/2026/02-february/eu/summary.md`
- `/news/2026/03-march/us/summary.md`
- `/news/2026/04-april/asia/summary.md`

## Supported Regions
- `norway` - Norwegian cybersecurity news
- `eu` - European Union cybersecurity news
- `us` - United States cybersecurity news
- `asia` - Asian region cybersecurity news

## Required Markdown Structure

### 1. Title
```markdown
# [Month] [Year] - [Region] Summary
```
Example: `# January 2026 - Norway Summary`

### 2. Overview Section
```markdown
## Overview

[Narrative overview of the month's cybersecurity landscape]
```

### 3. Key Trends Section
```markdown
## Key Trends

### [Trend 1 Title]
[Description of trend 1]

### [Trend 2 Title]
[Description of trend 2]
```

This section will be parsed to extract trending topics and themes.

### 4. Major Incidents Section
```markdown
## Major Incidents

### [Date] – [Incident Title]

- **Date:** YYYY-MM-DD
- **Target:** [Organization or system targeted]
- **Attack Type:** [Type of attack]
- **Impact:** [Description of impact]
- **Attribution:** [Known threat actor or group]
- **Status:** [Current status: Ongoing, Resolved, Under Investigation]
- **Source:** [Source URL or publication]

[Additional details about the incident]
```

Each incident should be a subsection with the above metadata format. The parser will extract this structured information.

### 5. Statistics Section
```markdown
## Statistics

### Incident Volume
- Total incidents reported: [number]
- Most targeted sector: [sector name]
- Most common attack type: [attack type]

### Severity Distribution
- Critical: [number]
- High: [number]
- Medium: [number]
- Low: [number]
```

The statistics section should include quantitative data about incidents, sectors, and severity levels.

### 6. Legislation & Policy Updates Section
```markdown
## Legislation & Policy Updates

### [Policy/Legislation Title]
[Description of the policy or legislative change]

### [Another Policy Title]
[Description]
```

Or alternatively:
```markdown
## Government Cybersecurity Initiatives

### [Initiative Title]
[Description]
```

### 7. Threat Actor Activity Section
```markdown
## Threat Actor Activity

### [Threat Actor Name]
[Description of the threat actor's activities this month]

### [Another Threat Actor]
[Description]
```

The parser will extract threat actor names and their activities from this section.

### 8. Looking Ahead / Key Takeaways Section
```markdown
## Looking Ahead

### Key Takeaways
- [Takeaway point 1]
- [Takeaway point 2]
- [Takeaway point 3]
```

Or:
```markdown
## Conclusion

[Summary conclusion with key points]
```

The parser will extract bullet points and key insights from these sections.

## Buzzword Extraction

The aggregation system will automatically extract buzzwords from:
- Key Trends section
- Threat Actor Activity section
- Key Takeaways section

Common stop words (like "and", "the", "or", "og", "er", etc.) are filtered out automatically.

## Example Complete Structure

```markdown
# January 2026 - Norway Summary

## Overview

In January 2026, Norway's cybersecurity landscape was marked by...

## Key Trends

### Increased Focus on Competency Building

Norwegian municipalities are actively working to strengthen...

### Outdated Infrastructure Creates Vulnerabilities

Many Norwegian organizations still rely on legacy systems...

## Major Incidents

### January 1 – Municipal Cyber Exercise

- **Date:** 2026-01-01
- **Target:** Kommuner i Vestland fylke
- **Attack Type:** Øvelse / simulert cyberangrep
- **Impact:** Trening av kommunal kriseledelse
- **Attribution:** (Øvelse)
- **Status:** Fullført
- **Source:** statsforvalteren.no

The exercise simulated a ransomware attack...

## Statistics

### Incident Volume
- Total incidents reported: 1 major exercise, 5 minor probing attempts
- Most targeted sector: Offentlig forvaltning
- Most common attack type: Øvelse (planned), DDoS (actual threats)

### Severity Distribution
- Critical: 0
- High: 0
- Medium: 0
- Low: 1

## Legislation & Policy Updates

### Cybersecurity Certification

NSM is rolling out a new cybersecurity certification program...

## Threat Actor Activity

### Pro-Russian Hacktivist Group

PST identified a data attack on Norwegian public websites...

## Looking Ahead

### Key Takeaways
- Norge styrker cyberkompetansen gjennom øvelser
- Kritisk infrastruktur er sårbar
- Samarbeid er essensielt
```

## Notes for Content Creators

1. **Be Consistent**: Use the exact section headers shown above (case-sensitive)
2. **Use Structured Data**: Always include the metadata fields for incidents
3. **Date Format**: Use YYYY-MM-DD format for dates
4. **Bullet Points**: Use `-` or `*` for bullet points consistently
5. **Subsections**: Use `###` for subsections within main sections (`##`)
6. **Links**: Include source URLs in the Source field for incidents

## Automation

When you push changes to any markdown file in `/news/**/*.md`, the GitHub Actions workflow will:
1. Run the aggregation script (`scripts/aggregate-news.js`)
2. Parse all summary files in `/news/2026/`
3. Generate `/data/news-aggregated-2026.json`
4. Commit and push the updated JSON file

The website will automatically display the aggregated data in the Trend Dashboard component.

## Troubleshooting

If data doesn't appear correctly in the dashboard:
1. Check that your markdown file is in the correct location
2. Verify section headers match exactly (case-sensitive)
3. Ensure incident metadata uses the exact field names shown
4. Run the aggregation script locally: `node scripts/aggregate-news.js`
5. Check the generated JSON file for parsing errors

## Contact

For questions about the structure or parsing issues, create an issue in the repository.
