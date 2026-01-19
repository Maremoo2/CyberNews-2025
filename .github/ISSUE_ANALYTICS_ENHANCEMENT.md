# Analytics & Reporting Enhancement

## Overview
Build a comprehensive analytical layer on top of the existing CyberNews data infrastructure to transform raw incident data into actionable intelligence.

## Problem Statement
Currently, the system collects and stores incident data effectively, but lacks:
- Executive-level synthesis and narrative
- Threat prioritization and severity classification
- Relationship mapping between incidents
- Strategic insights and trend analysis
- Automated report generation

## Proposed Solution
Implement a multi-layer analytical framework consisting of:

### 1. Data Enhancement Layer
- [ ] Severity classification engine (Critical/High/Medium/Low)
- [ ] MITRE ATT&CK technique mapping
- [ ] Threat actor profiling (Cybercriminal/Hacktivist/Nation-State)
- [ ] Impact metrics (financial, scope, recovery time)

### 2. Analytical Processing Layer
- [ ] Trend detection system (time-series, sector-specific, geographic)
- [ ] Correlation engine (related incidents, campaigns, TTPs)
- [ ] Comparative analysis (YoY, MoM, sector benchmarking)
- [ ] Theme extraction (buzzwords → strategic themes)

### 3. Intelligence Generation Layer
- [ ] Executive summary generator
- [ ] Narrative builder
- [ ] Sector-specific reports
- [ ] Threat landscape reports
- [ ] Defensive insights reports

## Implementation Phases

### Phase 1: Data Model Enhancement (2-3 weeks)
**Goal**: Extend incident schema with analytical fields

Tasks:
- [ ] Design extended data model
- [ ] Add severity scoring fields
- [ ] Add MITRE ATT&CK mapping fields
- [ ] Add impact metrics fields
- [ ] Add threat actor taxonomy fields
- [ ] Add theme classification fields
- [ ] Update TypeScript types (if applicable)
- [ ] Create migration script for existing data

**Deliverables**:
- Updated data schema documentation
- Sample enriched incident records
- Migration script

### Phase 2: Core Analytical Scripts (3-4 weeks)
**Goal**: Build foundational analysis tools

Tasks:
- [ ] Create `scripts/classify-severity.js`
  - Implement scoring algorithm
  - Add manual override capability
- [ ] Create `scripts/map-mitre-attack.js`
  - Map incidents to techniques
  - Support multiple tactics per incident
- [ ] Create `scripts/analyze-trends.js`
  - Time-series analysis
  - Sector-specific trends
  - Geographic patterns
- [ ] Create `scripts/correlate-incidents.js`
  - Link related incidents
  - Identify campaigns
  - Track tool/technique reuse
- [ ] Create `scripts/extract-themes.js`
  - Buzzword → theme mapping
  - Topic modeling

**Deliverables**:
- Working analytical scripts
- Unit tests for each script
- Documentation for running scripts

### Phase 3: Report Generators (4-5 weeks)
**Goal**: Automate intelligence report creation

Tasks:
- [ ] Create `scripts/generate-executive-summary.js`
  - Answer 5 key questions
  - Generate narrative text
- [ ] Create `scripts/generate-threat-landscape.js`
  - Attack type distribution
  - New TTPs
  - YoY comparisons
- [ ] Create `scripts/generate-sector-reports.js`
  - Per-sector analysis
  - Targeted attack patterns
  - Sector-specific recommendations
- [ ] Create `scripts/generate-actor-report.js`
  - Actor categorization
  - Motivation analysis
  - Sophistication assessment
- [ ] Create visualization engine
  - Charts and graphs
  - Timeline visualizations
  - Heat maps

**Deliverables**:
- Automated report generation scripts
- Sample reports (PDF, JSON, Markdown)
- Visualization library

### Phase 4: UI Integration (2-3 weeks)
**Goal**: Make analytics accessible through the web interface

Tasks:
- [ ] Dashboard enhancements
  - Severity overview widget
  - Trend charts
  - Top threats widget
- [ ] Interactive visualizations
  - Filterable charts
  - Drill-down capabilities
- [ ] Report viewer component
  - Display generated reports
  - Navigation between sections
- [ ] Export functionality
  - PDF export
  - PowerPoint export
  - CSV data export

**Deliverables**:
- Updated UI with analytics features
- User documentation
- Demo video

## Data Model Changes

### New Fields for Incidents
```javascript
{
  // ... existing fields ...
  
  // Analytical enhancements
  "severity": "Critical|High|Medium|Low",
  "severityScore": 1-10,
  "severityFactors": {
    "scope": "widespread",
    "sensitivity": "high",
    "recoveryTime": "days",
    "financialImpact": "significant"
  },
  "mitreAttack": {
    "tactics": ["Initial Access", "Execution"],
    "techniques": ["T1566.001", "T1190"],
    "detectionDifficulty": "medium"
  },
  "impactMetrics": {
    "estimatedFinancialLoss": "$1M-10M",
    "affectedEntities": 50000,
    "estimatedRecoveryDays": 7,
    "dataVolume": "100GB",
    "reputationalImpact": "high"
  },
  "threatActor": {
    "category": "Cybercriminal",
    "knownGroup": "BlackCat",
    "motivation": "Financial",
    "sophistication": "High",
    "attribution": "medium-confidence"
  },
  "themes": ["Cloud Security", "Ransomware Evolution"],
  "relatedIncidents": ["2026001", "2026045"],
  "campaignId": "campaign-2026-q1-ransomware",
  "analyticsMetadata": {
    "lastAnalyzed": "2026-01-12T10:00:00Z",
    "analysisVersion": "1.0",
    "autoClassified": true
  }
}
```

### New Analysis Output Files
- `data/analysis-{year}.json` - Aggregated yearly analysis
- `data/trends-{year}-{month}.json` - Monthly trend data
- `data/campaigns-{year}.json` - Identified attack campaigns
- `reports/{year}/executive-summary.md` - Executive report
- `reports/{year}/threat-landscape.md` - Detailed threat analysis
- `reports/{year}/sector-reports/*.md` - Per-sector reports

## Success Criteria

### Functional Requirements
- [ ] 90%+ of incidents automatically classified by severity
- [ ] 80%+ of incidents mapped to MITRE ATT&CK techniques
- [ ] Executive summary generated in < 5 minutes
- [ ] Annual report generated in < 1 hour
- [ ] All reports available in multiple formats (MD, PDF, JSON)

### Quality Requirements
- [ ] Classification accuracy > 90% (validated by security experts)
- [ ] Reports are actionable and understandable by non-technical executives
- [ ] Year-over-year trends are clearly visible
- [ ] All analytical code has unit tests (> 80% coverage)

### Performance Requirements
- [ ] Analysis scripts complete within 10 minutes for 1000 incidents
- [ ] Dashboard loads analytics data in < 2 seconds
- [ ] Report generation runs as batch job (can be overnight)

## Resources Needed

### Development
- Backend developer: 3-4 months full-time
- Data analyst: 2 months part-time (algorithm design)
- Security analyst: 1 month (SME consultation, validation)
- UI/UX designer: 2 weeks (dashboard design)

### Infrastructure
- Storage: Additional ~500MB for analysis outputs
- Compute: No significant increase (batch processing)

### External Services (Optional)
- MITRE ATT&CK API (free)
- Threat intelligence feeds (optional, for enrichment)

## Testing Plan

### Unit Tests
- Test severity classification algorithm with sample data
- Test MITRE mapping logic
- Test trend detection algorithms
- Test correlation engine

### Integration Tests
- Test end-to-end report generation
- Test data migration scripts
- Test UI components with mock data

### User Acceptance Testing
- Security analysts review severity classifications
- Executives review generated reports
- Compare automated reports to manually created ones

## Documentation Requirements

- [ ] Analytical algorithms documentation
- [ ] Data model changes documentation
- [ ] Script usage guides
- [ ] API documentation (if exposing analytics via API)
- [ ] User guide for dashboard features
- [ ] Report interpretation guide

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data quality issues | High | Implement validation, add confidence scores |
| Algorithm complexity | Medium | Start simple, iterate based on feedback |
| Subjective assessments | Medium | Use industry standards, allow expert override |
| Performance issues | Low | Batch processing, optimize queries, cache results |

## Related Documentation

- See `ANALYTICS_PROPOSAL.md` for detailed technical proposal
- See `YEAR_ROUTING_FIX.md` for data infrastructure foundation

## Advanced Features (Optional)

Hvis du vil ta det enda et hakk opp (valgfritt) - If you want to take it even a notch higher (optional):

### False positive-rate
- **Hvor ofte cluster-regelen feiler** (How often the cluster rule fails)
- Track and measure clustering accuracy over time
- **Critical requirements**:
  - Store which clusters were incorrect (case_id, incident_ids, error_type)
  - Analyze why they failed:
    - Same organization but different incidents?
    - Same date/timeframe causing false grouping?
    - Same attack type but different actors?
    - Similar keywords but different context?
  - Maintain historical trend data (improvement over time)
  - Track failure patterns by category (org-based, date-based, TTP-based)
- Calculate precision, recall, and F1 scores for clustering algorithm
- Generate reports showing:
  - Incidents incorrectly merged together (false positives)
  - Incidents that should have been merged but weren't (false negatives)
  - Root causes of clustering failures with examples
  - Weekly/monthly trend showing algorithm improvement
- Implement continuous monitoring and alerting when false positive rate exceeds threshold

### Manual override
- **Flagg "split incident" / "merge incident"** (Flag "split incident" / "merge incident")
- Allow security analysts to manually override automatic clustering decisions
- **Critical requirements**:
  - Access control: Define who can perform overrides (role-based permissions)
  - Complete audit trail: Log all changes with before/after state
  - Permanent overrides: Manual decisions persist across re-runs
  - Version tracking: Maintain history of all override changes
  - Prevent automatic override: System respects manual decisions permanently
- Provide UI/API for marking incidents that should be split or merged
- Track all manual overrides with:
  - Reviewer name and timestamp
  - Justification for override (required field)
  - Link to related incidents
  - Before/after cluster state (case_ids, incident_ids)
  - Override type (split/merge/reassign)
- Use manual overrides to:
  - Improve clustering algorithm
  - Train ML models
  - Create gold-set examples
- See `config/manual-clustering-overrides.json` for implementation details

### Actor correlation
- **Hvilke clusters deler TTPs** (Which clusters share TTPs)
- Analyze which incident clusters share Tactics, Techniques, and Procedures
- **Critical requirements**:
  - Match beyond just group names - use multi-factor correlation:
    - MITRE ATT&CK techniques (primary matching)
    - Timing patterns (coordinated activity windows)
    - Target sector alignment (same industries)
    - Infrastructure overlap (domains, IPs, malware families)
    - Tool and technique fingerprints
  - Confidence scoring for correlations (avoid false campaigns)
  - Weighted matching: TTP + timing + sector = high confidence
- Identify threat actor patterns across multiple campaigns
- Generate correlation matrices showing:
  - Shared MITRE ATT&CK techniques between clusters
  - Common infrastructure (IPs, domains, tools, malware families)
  - Timeline overlaps suggesting coordinated activity
  - Target sector patterns
  - Attribution confidence levels (low/medium/high)
- Enable pivot analysis: "Show me all clusters using technique T1566.001"
- Support threat hunting workflows by highlighting TTP relationships
- Prevent false correlations through multi-factor validation

### Heatmap
- **Mediedekning vs faktisk impact** (Media coverage vs actual impact)
- Visualize the relationship between media attention and real-world impact
- **Critical requirements**:
  - Objective impact measurement (not sentiment-based):
    - Downtime duration (hours/days)
    - Data volume lost/stolen (GB/TB)
    - Affected sector criticality (healthcare > retail)
    - Regulatory consequences (fines, mandates)
    - Affected entity count (users, organizations)
    - Financial losses (estimated ranges)
  - Separate "perceived severity" (article language) from actual impact
  - Multi-factor impact scoring independent of media tone
- Create interactive heatmaps showing:
  - X-axis: Media coverage (number of articles, source prominence)
  - Y-axis: Actual impact (objective metrics, not article sentiment)
  - Color intensity: Discrepancy between coverage and impact
- Identify:
  - Over-hyped incidents (high media coverage, low actual impact)
  - Under-reported incidents (low media coverage, high actual impact)
  - Aligned incidents (proportional coverage to impact)
- Use cases:
  - Prioritize incident response based on actual impact, not hype
  - Identify media bias and sensationalism
  - Guide communication and PR strategies
  - Optimize resource allocation

## Enterprise-Tier Features (Next Level)

Hvis du vil bli next level - For enterprise-grade intelligence capabilities:

### Incident confidence drift
- **Track confidence score evolution over time**
- Monitor how incident confidence changes throughout its lifecycle:
  - Initial state: Low confidence (rumors, unverified reports)
  - Investigation: Medium confidence (multiple sources, partial verification)
  - Confirmation: High confidence (official statements, verified evidence)
- Visualizations:
  - Timeline showing confidence progression per incident
  - Heatmap of incidents by initial vs. final confidence
  - Average time-to-high-confidence by sector/region
- Use cases:
  - Understand real incident timelines (not just publication date)
  - Identify fast-confirming vs. slow-confirming incident types
  - Train models on confidence evolution patterns
  - Improve early detection and triage

### Time-to-confirm
- **Measure days from rumor to confirmation**
- Track the incident confirmation timeline:
  - Day 0: First rumor or unverified report
  - Day X: Official disclosure or verified confirmation
  - Calculate: Time-to-confirm = X - 0
- Metrics by category:
  - Average time-to-confirm by sector (healthcare, finance, government)
  - By region (US, EU, Asia, Norway)
  - By incident type (ransomware, breach, DDoS)
  - By disclosure method (voluntary, regulatory, media)
- Use cases:
  - **SOC**: Set realistic confirmation timelines
  - **Crisis management**: Plan response windows
  - **Leadership**: Set expectations for incident verification
  - Identify sectors with good/poor disclosure practices
- Advanced analysis:
  - Compare detection speed by organization maturity
  - Regulatory impact on disclosure speed (GDPR, NIS2)

### Detection vs disclosure gap
- **Three critical timestamps for every incident**
- Track the complete incident timeline:
  - **T1**: When the attack actually occurred (breach date)
  - **T2**: When it was detected internally (detection date)
  - **T3**: When it became publicly known (disclosure date)
- Calculate key gaps:
  - **Dwell time**: T2 - T1 (attacker undetected in environment)
  - **Disclosure lag**: T3 - T2 (delay from detection to public)
  - **Total gap**: T3 - T1 (breach to public knowledge)
- Analysis dimensions:
  - Compare gaps by sector (which industries detect faster?)
  - By region (regulatory pressure effects)
  - By incident type (ransomware detected faster than espionage)
  - Trend over time (are organizations improving?)
- Reveals:
  - **Security maturity**: Short T2-T1 = good detection
  - **Regulatory pressure**: Short T3-T2 = strong disclosure laws
  - **Attacker sophistication**: Long T2-T1 = stealthy attacks
- Use cases:
  - Benchmark detection capabilities
  - Measure regulatory effectiveness
  - Identify detection blind spots

### Source bias analysis
- **Analyze media source reporting patterns**
- Track which media sources:
  - **Over-report**: Disproportionate coverage vs. actual impact
  - **Under-report**: Miss critical incidents in their coverage area
  - **Publish first**: Consistent early reporting (speed leaders)
  - **Most accurate**: High correlation between initial report and final facts
- Metrics per source:
  - Coverage volume vs. incident severity correlation
  - First-to-publish rate
  - Accuracy score (initial vs. final facts alignment)
  - Sector/region focus bias
  - Sensationalism score (language analysis)
- Visualizations:
  - Source reliability matrix (accuracy vs. speed)
  - Coverage heatmap by source and incident type
  - Bias vector analysis (which topics over/under covered)
- Use cases:
  - **OSINT quality improvement**: Prioritize reliable sources
  - Weight sources in automated collection (credibility scoring)
  - Identify coverage gaps (what's being missed?)
  - Media relationship management (who to brief first)
- Advanced features:
  - Source clustering (similar reporting patterns)
  - Bias drift over time (source quality changes)
  - Recommendation engine: "Best sources for ransomware incidents"

### Incident lifecycle states
- **Beyond binary open/closed status**
- Track incidents through realistic states:
  - **Emerging**: Initial rumors, unverified reports, low confidence
  - **Active**: Confirmed ongoing attack, live incident response
  - **Contained**: Attack stopped, but investigation/remediation ongoing
  - **Resolved**: Incident closed, root cause known, fixes deployed
  - **Dormant**: No recent activity, but could reactivate (APT campaigns)
  - **Escalated**: Incident severity increased, broader impact discovered
  - **De-escalated**: Initial severity overestimated, actual impact lower
- State transitions:
  - Track state change history with timestamps
  - Calculate average time in each state
  - Identify stuck incidents (long time in "active" or "contained")
- Metrics:
  - Time-to-containment by incident type
  - Containment-to-resolution duration
  - Reactivation rate (resolved → active again)
  - Escalation frequency by sector
- Visualizations:
  - Sankey diagram of state flows
  - Current state distribution dashboard
  - Time-in-state histograms
  - State transition heatmap (which transitions are common?)
- Use cases:
  - **Better situational awareness**: Know what's actually happening now
  - **Resource planning**: How many incidents in active response?
  - **Trend analysis**: Are we getting faster at containment?
  - **Realistic reporting**: More nuanced than "open/closed"
  - **Forecasting**: Predict resource needs based on lifecycle patterns

## Questions to Resolve

1. Should severity classification be automated or require manual approval?
2. What level of MITRE ATT&CK detail is needed (technique vs sub-technique)?
3. Which report formats are priority (PDF, PPT, HTML)?
4. Should analytics run automatically on new incidents or on-demand?
5. What's the target audience for each report type?

---

**Priority**: High  
**Estimated Effort**: 3-4 months  
**Dependencies**: Year routing fix (completed)  
**Labels**: enhancement, analytics, reporting, intelligence
