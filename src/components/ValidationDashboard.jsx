import { useMemo } from 'react';
import './ValidationDashboard.css';
import ConfidenceBadge from './ConfidenceBadge';

function ValidationDashboard({ incidents, learningLog }) {
  const validationMetrics = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return null;
    }

    // Deduplication accuracy
    const totalIncidents = incidents.length;
    const uniqueUrls = new Set(incidents.map(inc => inc.sourceUrl)).size;
    const dedupeAccuracy = ((uniqueUrls / totalIncidents) * 100).toFixed(1);
    
    // False merge rate (from learning log)
    const falseMerges = learningLog?.falseMerges?.length || 0;
    const falseMergeRate = totalIncidents > 0 
      ? ((falseMerges / totalIncidents) * 100).toFixed(2)
      : '0.00';
    
    // Attribution accuracy
    const attributedIncidents = incidents.filter(inc => 
      inc.actor_name || inc.actor_category
    );
    const attributionRate = ((attributedIncidents.length / totalIncidents) * 100).toFixed(1);
    
    // High confidence attributions
    const highConfidenceAttribution = attributedIncidents.filter(inc => 
      inc.actor_confidence === 'high'
    ).length;
    const highConfidenceRate = attributedIncidents.length > 0
      ? ((highConfidenceAttribution / attributedIncidents.length) * 100).toFixed(1)
      : '0';
    
    // MITRE mapping accuracy
    const mitreIncidents = incidents.filter(inc => 
      inc.mitre_techniques && inc.mitre_techniques.length > 0
    );
    const mitreCoverageRate = ((mitreIncidents.length / totalIncidents) * 100).toFixed(1);
    
    const highConfidenceMitre = mitreIncidents.filter(inc =>
      inc.mitre_techniques.some(t => t.confidence === 'high')
    ).length;
    const mitreConfidenceRate = mitreIncidents.length > 0
      ? ((highConfidenceMitre / mitreIncidents.length) * 100).toFixed(1)
      : '0';
    
    // Curated incidents
    const curatedIncidents = incidents.filter(inc => inc.is_curated);
    const curationRate = ((curatedIncidents.length / totalIncidents) * 100).toFixed(1);
    
    // Enrichment completeness
    const enrichmentScores = incidents.map(inc => {
      let score = 0;
      if (inc.severity || inc.severity_score) score += 20;
      if (inc.mitre_techniques && inc.mitre_techniques.length > 0) score += 20;
      if (inc.actor_name || inc.actor_category) score += 20;
      if (inc.themes && inc.themes.length > 0) score += 20;
      if (inc.tags && inc.tags.length >= 3) score += 20;
      return score;
    });
    const avgEnrichmentScore = (
      enrichmentScores.reduce((sum, s) => sum + s, 0) / totalIncidents
    ).toFixed(1);
    
    // Data quality score (overall)
    const qualityScore = (
      parseFloat(dedupeAccuracy) * 0.2 +
      (100 - parseFloat(falseMergeRate)) * 0.2 +
      parseFloat(attributionRate) * 0.15 +
      parseFloat(mitreCoverageRate) * 0.2 +
      parseFloat(curationRate) * 0.15 +
      parseFloat(avgEnrichmentScore) * 0.1
    ).toFixed(1);
    
    return {
      totalIncidents,
      dedupeAccuracy,
      falseMergeRate,
      falseMerges,
      attributionRate,
      highConfidenceRate,
      mitreCoverageRate,
      mitreConfidenceRate,
      curationRate,
      avgEnrichmentScore,
      qualityScore,
      learningLog: learningLog || { metadata: { total_corrections: 0 } }
    };
  }, [incidents, learningLog]);

  if (!validationMetrics) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#f59e0b';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="validation-dashboard">
      <div className="validation-header">
        <h3>🧪 Validation Dashboard</h3>
        <p className="validation-description">
          Self-audit metrics showing data quality and enrichment accuracy
        </p>
        
        {/* Confidence Badge for overall data quality */}
        <div style={{ marginTop: '0.75rem' }}>
          <ConfidenceBadge 
            level={validationMetrics.qualityScore >= 70 ? 'high' : validationMetrics.qualityScore >= 50 ? 'medium' : 'low'} 
            metric="Data quality"
            percentage={Math.round(validationMetrics.qualityScore)}
            tooltip="Composite score based on deduplication accuracy, false merge rate, attribution quality, MITRE coverage, and enrichment completeness."
          />
        </div>
      </div>

      {/* Overall Quality Score */}
      <div className="quality-score-card">
        <div className="quality-score-content">
          <div className="quality-score-main">
            <div className="quality-score-circle" style={{ borderColor: getScoreColor(validationMetrics.qualityScore) }}>
              <span className="quality-score-value">{validationMetrics.qualityScore}</span>
              <span className="quality-score-max">/100</span>
            </div>
            <div className="quality-score-info">
              <h4>Overall Data Quality Score</h4>
              <p className="quality-score-label" style={{ color: getScoreColor(validationMetrics.qualityScore) }}>
                {getScoreLabel(validationMetrics.qualityScore)}
              </p>
            </div>
          </div>
          <div className="quality-score-note">
            <p>
              Composite score based on deduplication accuracy, false merge rate, 
              attribution quality, MITRE coverage, and enrichment completeness
            </p>
          </div>
        </div>
      </div>

      {/* Validation Metrics Grid */}
      <div className="validation-metrics-grid">
        {/* Deduplication */}
        <div className="validation-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔍</span>
            <h4>Deduplication Accuracy</h4>
          </div>
          <div className="metric-value-display">
            <span className="metric-big-value">{validationMetrics.dedupeAccuracy}%</span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${validationMetrics.dedupeAccuracy}%`,
                background: getScoreColor(validationMetrics.dedupeAccuracy)
              }}
            ></div>
          </div>
          <p className="metric-description">
            Ratio of unique URLs to total incidents
          </p>
        </div>

        {/* False Merge Rate */}
        <div className="validation-metric-card">
          <div className="metric-header">
            <span className="metric-icon">⚠️</span>
            <h4>False Merge Rate</h4>
          </div>
          <div className="metric-value-display">
            <span className="metric-big-value">{validationMetrics.falseMergeRate}%</span>
            <span className="metric-sub-value">({validationMetrics.falseMerges} incidents)</span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${validationMetrics.falseMergeRate}%`,
                background: validationMetrics.falseMergeRate < 5 ? '#16a34a' : '#dc2626'
              }}
            ></div>
          </div>
          <p className="metric-description">
            Incidents incorrectly merged (lower is better)
          </p>
        </div>

        {/* Attribution Accuracy */}
        <div className="validation-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🎯</span>
            <h4>Attribution Coverage</h4>
          </div>
          <div className="metric-value-display">
            <span className="metric-big-value">{validationMetrics.attributionRate}%</span>
            <span className="metric-sub-value">
              {validationMetrics.highConfidenceRate}% high confidence
            </span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${validationMetrics.attributionRate}%`,
                background: getScoreColor(validationMetrics.attributionRate)
              }}
            ></div>
          </div>
          <p className="metric-description">
            Incidents with threat actor attribution
          </p>
        </div>

        {/* MITRE Coverage */}
        <div className="validation-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🛡️</span>
            <h4>MITRE ATT&CK Coverage</h4>
          </div>
          <div className="metric-value-display">
            <span className="metric-big-value">{validationMetrics.mitreCoverageRate}%</span>
            <span className="metric-sub-value">
              {validationMetrics.mitreConfidenceRate}% high confidence
            </span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${validationMetrics.mitreCoverageRate}%`,
                background: getScoreColor(validationMetrics.mitreCoverageRate)
              }}
            ></div>
          </div>
          <p className="metric-description">
            Incidents mapped to MITRE techniques
          </p>
        </div>

        {/* Curation Rate */}
        <div className="validation-metric-card">
          <div className="metric-header">
            <span className="metric-icon">✅</span>
            <h4>Curation Rate</h4>
          </div>
          <div className="metric-value-display">
            <span className="metric-big-value">{validationMetrics.curationRate}%</span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${validationMetrics.curationRate}%`,
                background: getScoreColor(validationMetrics.curationRate)
              }}
            ></div>
          </div>
          <p className="metric-description">
            High-quality curated incidents
          </p>
        </div>

        {/* Enrichment Completeness */}
        <div className="validation-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📊</span>
            <h4>Enrichment Completeness</h4>
          </div>
          <div className="metric-value-display">
            <span className="metric-big-value">{validationMetrics.avgEnrichmentScore}%</span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill"
              style={{ 
                width: `${validationMetrics.avgEnrichmentScore}%`,
                background: getScoreColor(validationMetrics.avgEnrichmentScore)
              }}
            ></div>
          </div>
          <p className="metric-description">
            Average enrichment fields populated
          </p>
        </div>
      </div>

      {/* Learning System Status */}
      <div className="learning-system-status">
        <h4>🧠 Learning System Status</h4>
        <div className="learning-stats">
          <div className="learning-stat">
            <span className="learning-stat-value">
              {validationMetrics.learningLog.metadata?.total_corrections || 0}
            </span>
            <span className="learning-stat-label">Manual Corrections</span>
          </div>
          <div className="learning-stat">
            <span className="learning-stat-value">
              {validationMetrics.learningLog.falseMerges?.length || 0}
            </span>
            <span className="learning-stat-label">Identified False Merges</span>
          </div>
          <div className="learning-stat">
            <span className="learning-stat-value">
              {validationMetrics.learningLog.newTerms?.length || 0}
            </span>
            <span className="learning-stat-label">New Terms Learned</span>
          </div>
        </div>
        <p className="learning-note">
          System learns from corrections and improves over time
        </p>
      </div>

      {/* Transparency Note */}
      <div className="validation-footer">
        <h4>💡 Why Validation Matters</h4>
        <p>
          <strong>We audit our own system.</strong> These metrics are automatically calculated 
          and transparently displayed. They help you understand data quality limitations and 
          guide continuous improvement efforts. Lower false merge rates and higher attribution 
          accuracy mean more reliable intelligence for decision-making.
        </p>
      </div>
    </div>
  );
}

export default ValidationDashboard;
