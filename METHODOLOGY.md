# Source of Truth Methodology Implementation

## Overview

This document describes the comprehensive analytical framework implemented to ensure consistent counting, transparent methodology, and high-quality intelligence from cybersecurity incident data.

## Key Principles

### 1. Source of Truth - Counting Rules

**Unique Incidents (Default)**
- `incident_id` is the unique key for all incidents
- All primary statistics use unique incident counts
- Clearly labeled as "Count type: unique incidents"

**Tag Mentions**
- Tags, sectors, themes can have multiple values per incident
- Tag totals may exceed total unique incidents
- Clearly labeled as "Count type: tag mentions"

**Population Filters**
- **All**: All incidents in the dataset
- **Curated**: High-quality incidents with enrichment (is_curated = true)
- **Critical Only**: Severity = critical

Every count throughout the application explicitly shows:
- Count type (unique vs mentions)
- Population (all / curated / filtered)

### 2. Data Model

Each incident includes:

```javascript
{
  // Core identifiers
  id: "20261647",                    // Unique incident ID
  date: "2026-01-12",                // Date reported (ISO format)
  
  // Content
  title: "...",
  summary: "...",
  
  // Classification
  region: "US",                      // US, EU, ASIA, NO
  country: "Global",
  tags: ["vulnerability", "..."],
  
  // Enhanced severity scoring (0-100 points)
  severity_score: 65,                // Calculated score
  severity: "high",                  // critical/high/moderate/low
  severity_drivers: ["..."],         // What drove the score
  
  // MITRE ATT&CK (with confidence)
  mitre_techniques: [{
    id: "T1190",
    name: "Exploit Public-Facing Application",
    confidence: "high"              // high/medium/low
  }],
  mitre_tactics: ["initial-access"],
  
  // Threat actor attribution
  actor_name: "Lazarus Group",       // Specific group (or null)
  actor_category: "nation-state",    // Type of actor
  actor_confidence: "high",          // Attribution confidence
  is_attributed: true,               // Boolean flag
  
  // Strategic themes (max 3)
  themes: [{
    id: "exploit-led",
    name: "Exploit-Led Intrusions",
    confidence: "high"
  }],
  
  // Content classification
  content_type: "incident",          // incident/vulnerability/policy/etc.
  
  // Quality indicators
  is_curated: true,                  // High-quality enrichment
  confidence: 70,                    // Overall confidence (0-100)
  
  // Metadata
  enrichment_version: "2.0",
  enriched_at: "2026-01-12T..."
}
```

## Severity Scoring System

Transparent 0-100 point system:

### Impact Factors (0-40 points)
- Service disruption/outage: +15
- Sensitive data exposure (PII/health/finance): +15
- Critical infrastructure/OT impact: +20
- Large scale (millions affected): +10

### Exploitability (0-30 points)
- Confirmed exploited in the wild: +20
- Zero-day claimed: +15
- Internet-facing vector: +10

### Adversary (0-15 points)
- Nation-state attribution: +15
- Known ransomware group: +10
- Unknown: +0

### Confidence Modifier (-15 to +15)
- Curated multi-source: +10
- Single low-quality source: -10
- Speculation only: -15

### Severity Labels
- **Critical**: ≥ 80 points
- **High**: 60-79 points
- **Moderate**: 25-59 points
- **Low**: < 25 points

## MITRE ATT&CK Mapping

### Two-Signal Rule
Each technique requires multiple signals for confident mapping:

**Example: T1567 (Exfiltration Over Web Service)**
- Signal 1 (weight 1.0): "exfiltrate", "upload", "leak"
- Signal 2 (weight 0.8): Cloud provider mentions (OneDrive, S3, Drive, etc.)
- Total needed: ≥ 1.0 to map

### Confidence Levels
- **High**: Multiple strong signals, clear attack chain
- **Medium**: Technique implied from context
- **Low**: Single keyword match only

### Tactic Derivation
Tactics are automatically derived from technique IDs (not separately parsed).

## Strategic Themes

10 predefined strategic risk themes:

1. **Cloud Exfiltration & SaaS Abuse**
2. **Exploit-Led Intrusions**
3. **Identity & Token Abuse**
4. **Ransomware & Extortion Economy**
5. **Supply Chain & Third-Party Compromise**
6. **Disinformation & Deepfakes**
7. **Botnets, DDoS & Commodity Malware**
8. **Mobile/Android & Spyware Ecosystem**
9. **OT/ICS & Critical Infrastructure**
10. **Regulatory & Disclosure Pressure**

### Theme Assignment
- Each incident: max 3 themes
- Confidence scoring per theme (high/medium/low)
- Requires keyword matches + contextual signals

## Key Performance Indicators (KPIs)

Automatically calculated for all dashboards:

- **Critical Rate**: % of incidents rated critical
- **Exploit-Led Rate**: % using T1190 or exploited in wild
- **Cloud Exfil Rate**: % with cloud exfiltration theme
- **Attribution Rate**: % with confident actor identification
- **Curated Coverage**: % meeting quality standards
- **Mean Confidence**: Average confidence score

## Content Type Classification

Signal vs noise filtering:

- **incident**: Actual breach/attack/compromise
- **vulnerability**: CVE, zero-day, patches
- **policy**: Regulations, compliance
- **opinion**: Editorial content
- **prediction**: Future forecasts
- **research**: Studies, whitepapers
- **product**: Tool releases
- **court**: Legal proceedings

Default view: incident + vulnerability

## Usage

### Enrichment

Run enhanced enrichment pipeline:

```bash
# Enrich both years
npm run enrich-enhanced

# Or individually
node scripts/enhanced-enrichment.js --year=2026
node scripts/enhanced-enrichment.js --year=2025

# Dry run to preview
node scripts/enhanced-enrichment.js --year=2026 --dry-run
```

### Analytics Utilities

Import and use consistent counting:

```javascript
import { 
  countUniqueIncidents, 
  countMentions,
  getSeverityDistribution,
  getAttributionRate,
  calculateKPIs,
  getTopThemes
} from '../utils/analyticsUtils';

// Count unique incidents
const uniqueCount = countUniqueIncidents(incidents, { 
  population: 'curated',
  region: 'US'
});

// Count tag mentions
const tagCounts = countMentions(incidents, 'tags', { 
  population: 'all' 
});

// Get KPIs
const kpis = calculateKPIs(incidents, { population: 'curated' });
```

## UI Components

### New Components

1. **StrategicRiskThemes**: Top 5 themes with defensive priorities
2. **MethodologyAndLimitations**: Complete methodology documentation
3. Enhanced **ExecutiveSummary**: KPIs, attribution rate, curated count
4. Enhanced **DefenseAnalysis**: Proper disclaimers

### Curated Filter

Toggle in main interface:
- ✅ Curated only (high-quality enrichment)
- Shows count type and population labels
- Filters to `is_curated = true`

### Count Labels

All dashboards show:
```
Count type: unique incidents | Population: curated
```

## Known Limitations

Documented in UI:

1. **Media Bias**: English/Western-centric sources
2. **Underreporting**: Many incidents never disclosed
3. **Survivorship Bias**: Only detected incidents visible
4. **Disclosure Lag**: Months/years delay
5. **Attribution Uncertainty**: Often incomplete/misleading
6. **Sector Classification**: Inconsistent for multi-sector orgs
7. **Impact Assessment**: Often unknown or minimized

## Validation & QA

Automatic checks in analytics utilities:

- Sum consistency validation
- Count type verification
- Population filter validation
- No mysterious count increases

## Future Enhancements

Potential improvements:

1. Machine learning for attribution
2. Automated CVE correlation
3. Real-time enrichment pipeline
4. Historical trend analysis
5. Sector-specific risk scoring

## References

- MITRE ATT&CK: https://attack.mitre.org/
- Severity methodology based on CVSS and industry standards
- Strategic themes derived from CISA, ENISA, and industry threat reports

---

Last Updated: January 2026
Version: 2.0
