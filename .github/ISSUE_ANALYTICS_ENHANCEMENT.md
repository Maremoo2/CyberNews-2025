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
- Identify patterns in misclassified incidents
- Calculate precision, recall, and F1 scores for clustering algorithm
- Generate reports showing:
  - Incidents incorrectly merged together
  - Incidents that should have been merged but weren't
  - Root causes of clustering failures
- Implement continuous monitoring and alerting when false positive rate exceeds threshold

### Manual override
- **Flagg "split incident" / "merge incident"** (Flag "split incident" / "merge incident")
- Allow security analysts to manually override automatic clustering decisions
- Provide UI/API for marking incidents that should be split or merged
- Track all manual overrides with:
  - Reviewer name and timestamp
  - Justification for override
  - Link to related incidents
- Use manual overrides to:
  - Improve clustering algorithm
  - Train ML models
  - Create gold-set examples
- See `config/manual-clustering-overrides.json` for implementation details

### Actor correlation
- **Hvilke clusters deler TTPs** (Which clusters share TTPs)
- Analyze which incident clusters share Tactics, Techniques, and Procedures
- Identify threat actor patterns across multiple campaigns
- Generate correlation matrices showing:
  - Shared MITRE ATT&CK techniques between clusters
  - Common infrastructure (IPs, domains, tools)
  - Timeline overlaps suggesting coordinated activity
  - Attribution confidence levels
- Enable pivot analysis: "Show me all clusters using technique T1566.001"
- Support threat hunting workflows by highlighting TTP relationships

### Heatmap
- **Mediedekning vs faktisk impact** (Media coverage vs actual impact)
- Visualize the relationship between media attention and real-world impact
- Create interactive heatmaps showing:
  - X-axis: Media coverage (number of articles, source prominence)
  - Y-axis: Actual impact (affected entities, financial loss, severity)
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
