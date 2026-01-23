import { useMemo, useState } from 'react'
import './ExecutiveSummary.css'
import { getSeverityDistribution, getTopThemes, getAttributionRate, calculateKPIs } from '../utils/analyticsUtils'
import { isDataEnriched, getEnrichmentQualityMessage, filterToIncidentsOnly } from '../utils/populationUtils'
import ConfidenceBadge from './ConfidenceBadge'
import { getSeverityConfidence } from '../utils/confidenceRules'

function ExecutiveSummary({ incidents, selectedYear }) {
  // Default to incident-only analysis (P0 requirement)
  const [populationMode, setPopulationMode] = useState('incidents');
  
  const analysis = useMemo(() => {
    if (!incidents || incidents.length === 0) return null

    // Filter to incidents-only by default (exclude opinions, policies, vulnerabilities)
    // Use consistent filtering across all components
    const filteredIncidents = populationMode === 'incidents' 
      ? filterToIncidentsOnly(incidents)
      : incidents;

    // Check if data is enriched
    const dataEnriched = isDataEnriched(filteredIncidents);
    const enrichmentMessage = getEnrichmentQualityMessage(filteredIncidents);

    // Use new analytics utilities for consistent counting
    const severityData = getSeverityDistribution(filteredIncidents, {});
    const topThemes = getTopThemes(filteredIncidents, {}, 5);
    const attributionRate = getAttributionRate(filteredIncidents, {});
    const kpis = calculateKPIs(filteredIncidents, {});

    // Get top threat types from tags (mentions)
    const tagCounts = {}
    filteredIncidents.forEach(incident => {
      incident.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    const topThreats = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    // Identify most targeted sectors (mentions)
    const sectorCounts = {}
    filteredIncidents.forEach(incident => {
      incident.tags?.forEach(tag => {
        const sectorTags = ['healthcare', 'finance', 'government', 'technology', 'education', 'retail', 'energy']
        if (sectorTags.includes(tag.toLowerCase())) {
          sectorCounts[tag] = (sectorCounts[tag] || 0) + 1
        }
      })
    })
    const topSectors = Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    // Get top attack vectors using enhanced MITRE data
    const vectorCounts = {}
    filteredIncidents.forEach(incident => {
      if (incident.mitre_techniques) {
        incident.mitre_techniques.forEach(tech => {
          const name = tech.name || tech;
          vectorCounts[name] = (vectorCounts[name] || 0) + 1;
        });
      }
    });
    const topVectors = Object.entries(vectorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Generate narrative based on data
    const narrative = generateNarrative(selectedYear, severityData.distribution, topThemes, attributionRate, kpis, dataEnriched)
    
    const curatedCount = filteredIncidents.filter(i => i.is_curated).length;
    const curatedPercentage = filteredIncidents.length > 0 
      ? Math.round((curatedCount / filteredIncidents.length) * 100)
      : 0;

    return {
      severityDistribution: severityData.distribution,
      topThreats,
      topSectors,
      topVectors,
      topThemes: topThemes.themes,
      narrative,
      totalIncidents: filteredIncidents.length,
      totalAllItems: incidents.length,
      curatedCount,
      curatedPercentage,
      attributionRate: attributionRate.rate,
      criticalRate: kpis.criticalRate,
      exploitLedRate: kpis.exploitLedRate,
      dataEnriched,
      enrichmentMessage
    }
  }, [incidents, selectedYear, populationMode])

  if (!analysis) return null

  return (
    <section className="executive-summary" aria-label="Executive Summary">
      <div className="summary-header">
        <h2>📊 Executive Summary</h2>
        <div className="population-toggle">
          <button 
            className={populationMode === 'incidents' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setPopulationMode('incidents')}
            aria-pressed={populationMode === 'incidents'}
          >
            INCIDENT-RELATED ITEMS ({analysis.totalIncidents})
          </button>
          <button 
            className={populationMode === 'all' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setPopulationMode('all')}
            aria-pressed={populationMode === 'all'}
          >
            ALL ITEMS ({analysis.totalAllItems})
          </button>
        </div>
        <p className="summary-subtitle">
          {populationMode === 'incidents' 
            ? `Key insights from ${analysis.totalIncidents} incident-related items published in ${selectedYear}` 
            : `Coverage of ${analysis.totalAllItems} items (includes explainers, products, and opinions)`}
        </p>
        <div className="counting-note">
          <span className="count-badge">
            {populationMode === 'incidents' 
              ? 'Incident-related items only (recommended for executive view)' 
              : 'All content types'}
          </span>
          <span className="quality-note">{analysis.curatedCount} curated ({analysis.curatedPercentage}%)</span>
          <div className="methodology-hint">
            ℹ️ Multiple articles may cover the same underlying incident
          </div>
        </div>
      </div>

      {/* Show enrichment warning if data is not enriched */}
      {!analysis.dataEnriched && (
        <div className="enrichment-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <strong>Limited Data Enrichment</strong>
            <p>{analysis.enrichmentMessage}</p>
            <p className="warning-hint">
              Some analysis features (severity distribution, themes, MITRE mapping) require enriched data.
              Run <code>npm run enrich-enhanced</code> to enable full analysis.
            </p>
          </div>
        </div>
      )}

      <div className="summary-narrative">
        <div className="narrative-card">
          <h3>The Story of {selectedYear}</h3>
          <p className="narrative-text">{analysis.narrative}</p>
          <p className="narrative-clarification">
            <small><em>
              Based on {analysis.totalIncidents} incident-related articles. 
              Note: Multiple news articles may report on the same underlying event.
            </em></small>
          </p>
        </div>
      </div>

      <div className="summary-grid">
        {/* Severity Overview */}
        <div className="summary-card severity-card">
          <h3>🎯 Severity Distribution</h3>
          <div className="count-type-label">
            <small>Count type: unique incidents</small>
          </div>
          
          {/* Confidence Badge for severity data - using centralized rules */}
          {analysis.dataEnriched && (() => {
            const confidence = getSeverityConfidence(analysis.curatedPercentage, 100);
            return (
              <div style={{ marginBottom: '0.75rem' }}>
                <ConfidenceBadge 
                  level={confidence.level}
                  label="Severity model"
                  value={`${analysis.curatedPercentage}% curated`}
                  tooltip={confidence.tooltip}
                  size="sm"
                />
              </div>
            );
          })()}
          
          {!analysis.dataEnriched ? (
            <div className="no-enrichment-message">
              <p>⚠️ Severity data not available</p>
              <p className="message-hint">Run enrichment to enable severity analysis</p>
            </div>
          ) : (
            <>
              <div className="severity-breakdown">
                <div className="severity-item critical">
                  <span className="severity-label">Critical</span>
                  <span className="severity-count">{analysis.severityDistribution.critical}</span>
                  <span className="severity-bar" style={{width: `${(analysis.severityDistribution.critical / analysis.totalIncidents * 100)}%`}}></span>
                </div>
                <div className="severity-item high">
                  <span className="severity-label">High</span>
                  <span className="severity-count">{analysis.severityDistribution.high}</span>
                  <span className="severity-bar" style={{width: `${(analysis.severityDistribution.high / analysis.totalIncidents * 100)}%`}}></span>
                </div>
                <div className="severity-item moderate">
                  <span className="severity-label">Moderate</span>
                  <span className="severity-count">{analysis.severityDistribution.moderate}</span>
                  <span className="severity-bar" style={{width: `${(analysis.severityDistribution.moderate / analysis.totalIncidents * 100)}%`}}></span>
                </div>
                <div className="severity-item low">
                  <span className="severity-label">Low</span>
                  <span className="severity-count">{analysis.severityDistribution.low}</span>
                  <span className="severity-bar" style={{width: `${(analysis.severityDistribution.low / analysis.totalIncidents * 100)}%`}}></span>
                </div>
              </div>
              <p className="insight-text">
                <strong>{analysis.severityDistribution.critical + analysis.severityDistribution.high}</strong> high-severity items 
                ({analysis.severityDistribution.critical} critical, {analysis.severityDistribution.high} high severity)
              </p>
              {selectedYear >= 2026 && (
                <div className="severity-disclaimer" style={{marginTop: '12px', padding: '10px', background: 'rgba(241, 196, 15, 0.1)', borderLeft: '3px solid #f1c40f', borderRadius: '4px'}}>
                  <p style={{margin: 0, fontSize: '0.85rem', color: '#000000'}}>
                    ⚠️ <strong>Severity Model Conservative:</strong> High/critical severity requires confirmed impact, not just disclosure. 
                    Early in {selectedYear}, many incidents are still under investigation. Current model coverage is limited (curation ~2-3%).
                    {(analysis.severityDistribution.critical + analysis.severityDistribution.high) === 0 && (
                      <span> Low counts reflect pending enrichment, not absence of threats.</span>
                    )}
                  </p>
                </div>
              )}
              {/* Show severity model status when curated rate is low */}
              {analysis.curatedPercentage < 10 && (
                <div className="severity-model-badge" style={{marginTop: '12px', padding: '8px', background: 'rgba(155, 89, 182, 0.15)', borderLeft: '3px solid #9b59b6', borderRadius: '4px'}}>
                  <p style={{margin: 0, fontSize: '0.8rem', color: '#ecf0f1'}}>
                    📊 <strong>Severity model conservative / pending enrichment</strong> — Curated rate: {analysis.curatedPercentage}%
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Top Attack Vectors */}
        <div className="summary-card vectors-card">
          <h3>⚔️ Top Attack Vectors</h3>
          <div className="count-type-label">
            <small>Count type: MITRE technique mentions</small>
          </div>
          {!analysis.dataEnriched || analysis.topVectors.length === 0 ? (
            <div className="no-enrichment-message">
              <p>⚠️ MITRE technique data not available</p>
              <p className="message-hint">Run enrichment to enable attack vector analysis</p>
            </div>
          ) : (
            <>
              <div className="vector-list">
                {analysis.topVectors.map(([vector, count], index) => (
                  <div key={vector} className="vector-item">
                    <span className="vector-rank">#{index + 1}</span>
                    <span className="vector-name">{formatVectorName(vector)}</span>
                    <span className="vector-count">{count}</span>
                  </div>
                ))}
              </div>
              {analysis.topVectors.length > 0 && (
                <p className="insight-text">
                  Most common: <strong>{formatVectorName(analysis.topVectors[0]?.[0])}</strong> with {analysis.topVectors[0]?.[1]} mentions
                </p>
              )}
            </>
          )}
        </div>

        {/* Most Targeted Sectors */}
        <div className="summary-card sectors-card">
          <h3>🎯 Most Targeted Sectors</h3>
          <div className="count-type-label">
            <small>Count type: tag mentions</small>
          </div>
          <div className="sector-list">
            {analysis.topSectors.length > 0 ? (
              analysis.topSectors.map(([sector, count], index) => (
                <div key={sector} className="sector-item">
                  <span className="sector-rank">#{index + 1}</span>
                  <span className="sector-name">{capitalize(sector)}</span>
                  <span className="sector-count">{count}</span>
                </div>
              ))
            ) : (
              <p className="no-data">Sector data not available</p>
            )}
          </div>
          {analysis.topSectors.length > 0 && (
            <p className="insight-text">
              <strong>{capitalize(analysis.topSectors[0]?.[0])}</strong> sector mentioned most with {analysis.topSectors[0]?.[1]} articles
            </p>
          )}
        </div>
      </div>

      {/* Key Questions Section */}
      <div className="key-questions">
        <h3>5 Key Questions</h3>
        <div className="questions-grid">
          <div className="question-card">
            <div className="question-icon">🔴</div>
            <div className="question-content">
              <h4>What was the biggest threat?</h4>
              <p>{getTopThreatDescription(analysis.topVectors[0]?.[0])}</p>
            </div>
          </div>
          <div className="question-card">
            <div className="question-icon">⚡</div>
            <div className="question-content">
              <h4>What surprised us most?</h4>
              <p>{getSurpriseDescription(selectedYear)}</p>
            </div>
          </div>
          <div className="question-card">
            <div className="question-icon">🎯</div>
            <div className="question-content">
              <h4>Who was hit hardest?</h4>
              <p>{getHardestHitDescription(analysis.topSectors)}</p>
            </div>
          </div>
          <div className="question-card">
            <div className="question-icon">🔄</div>
            <div className="question-content">
              <h4>What did attackers do differently?</h4>
              <p>{getAttackerEvolutionDescription(selectedYear)}</p>
            </div>
          </div>
          <div className="question-card">
            <div className="question-icon">🛡️</div>
            <div className="question-content">
              <h4>What must organizations do differently?</h4>
              <p>{getRecommendationDescription()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper functions
function generateNarrative(year, severity, topThemes, attributionRate, kpis, dataEnriched) {
  const criticalCount = severity.critical;
  const highCount = severity.high;
  const topTheme = topThemes?.themes?.[0]?.name || 'various strategic threats';
  const attributionPct = attributionRate.rate;
  
  // If data is not enriched, provide a generic narrative
  if (!dataEnriched) {
    return `${year} data is being collected and analyzed. ${criticalCount > 0 ? `${criticalCount} critical incidents have been identified.` : ''} Full analysis including severity distribution, themes, and MITRE mapping will be available once enrichment is complete. Run the enrichment script to enable comprehensive analysis.`;
  }
  
  // Calculate high-severity articles (critical + high severity)
  const highSeverityCount = criticalCount + highCount;
  
  // Note: High/critical severity is underrepresented early in the year because severity is only assigned when impact is confirmed
  if (year === 2026) {
    if (highSeverityCount === 0) {
      return `${year} incident tracking is underway. High/critical severity classifications are underrepresented early-year because severity is only set when impact is confirmed; many incidents remain 'moderate/low' until investigations conclude. "${topTheme}" is emerging as a key strategic risk. ${kpis.exploitLedRate}% of incident-related articles are exploit-led. <strong>Confirmed attribution rate (incident-level): ${attributionPct}%</strong> — Note: Actor listings include article-level mentions and suspected associations.`
    }
    return `${year} saw ${highSeverityCount} high-severity articles (${criticalCount} critical, ${highCount} high severity), with "${topTheme}" emerging as the dominant strategic risk. ${kpis.exploitLedRate}% of incident-related articles were exploit-led, demonstrating attackers' continued focus on internet-facing vulnerabilities. <strong>Confirmed attribution rate (incident-level): ${attributionPct}%</strong> — Note: Actor listings include article-level mentions and suspected associations. The landscape continues to shift toward more sophisticated, strategic campaigns leveraging cloud infrastructure and identity-based attacks.`
  } else if (year === 2025) {
    return `${year} was marked by ${highSeverityCount} high-severity articles (${criticalCount} critical, ${highCount} high severity). ${topTheme} dominated the threat landscape, with attackers exploiting trust relationships and weak identity management. <strong>Confirmed attribution rate (incident-level): ${attributionPct}%</strong> — Actor listings include article-level mentions. Cloud infrastructure and supply chains became prime targets.`
  }
  return `${year} presented significant cybersecurity challenges with ${highSeverityCount} high-severity articles (${criticalCount} critical, ${highCount} high) and a confirmed attribution rate (incident-level) of ${attributionPct}%.`
}

function formatVectorName(vector) {
  if (!vector) return 'Unknown'
  const names = {
    'phishing': 'Phishing',
    'ransomware': 'Ransomware',
    'data-breach': 'Data Breaches',
    'supply-chain': 'Supply Chain Attacks',
    'zero-day': 'Zero-Day Exploits',
    'ddos': 'DDoS Attacks'
  }
  return names[vector] || capitalize(vector)
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getTopThreatDescription(topVector) {
  const descriptions = {
    'ransomware': 'Ransomware continued to dominate, evolving from mass campaigns to highly targeted operations against critical infrastructure and high-value targets.',
    'phishing': 'Phishing remained the primary initial access vector, with attackers using increasingly sophisticated social engineering and AI-generated content.',
    'data-breach': 'Data breaches reached unprecedented scale, with billions of records exposed through cloud misconfigurations and compromised credentials.',
    'supply-chain': 'Supply chain attacks proved devastatingly effective, with attackers compromising trusted vendors to gain access to multiple downstream targets.',
    'zero-day': 'Zero-day exploits were weaponized rapidly, with state-sponsored groups leading the development and deployment of novel attack techniques.'
  }
  return descriptions[topVector] || 'Multiple threat vectors were active throughout the year, requiring defense in depth strategies.'
}

function getSurpriseDescription(year) {
  if (year === 2026) {
    return 'The rapid adoption of AI both in attacks and defenses created an arms race, with attackers using AI for more convincing phishing and automated vulnerability discovery.'
  }
  return 'The speed at which attackers adapted to new defenses and the sophistication of social engineering campaigns.'
}

function getHardestHitDescription(sectors) {
  if (sectors.length === 0) {
    return 'Organizations across all sectors faced significant cyber threats.'
  }
  return `${capitalize(sectors[0]?.[0])} sector bore the brunt with ${sectors[0]?.[1]} incident-related articles, due to high-value data and critical infrastructure dependencies.`
}

function getAttackerEvolutionDescription(year) {
  if (year === 2026) {
    return 'Shift from opportunistic attacks to strategic, intelligence-driven campaigns. Greater use of living-off-the-land techniques and legitimate tools to evade detection.'
  }
  return 'Increased sophistication in exploiting cloud services, identity systems, and supply chain relationships. More targeted reconnaissance and longer dwell times.'
}

function getRecommendationDescription() {
  return 'Implement zero-trust architecture, strengthen identity and access management, enhance cloud security posture, and establish robust supply chain risk management programs. Focus on detection and response, not just prevention.'
}

export default ExecutiveSummary
