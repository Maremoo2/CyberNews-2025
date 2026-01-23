import { useMemo } from 'react';
import './DeduplicationStats.css';
import { enhanceIncidents } from '../utils/deduplicationUtils';

/**
 * Deduplication Statistics Component
 * Shows estimated unique incidents vs total articles
 */
function DeduplicationStats({ incidents }) {
  const stats = useMemo(() => {
    if (!incidents || incidents.length === 0) return null;
    
    const result = enhanceIncidents(incidents);
    return result.stats;
  }, [incidents]);

  if (!stats || stats.totalArticles === 0) return null;

  return (
    <div className="deduplication-stats">
      <div className="stats-header">
        <h3>📊 Data Volume Analysis</h3>
        <p className="subtitle">Estimated unique incidents vs incident-related items coverage</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalArticles.toLocaleString()}</div>
            <div className="stat-label">Incident-Related Items</div>
            <div className="stat-description">News articles published</div>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.estimatedUniqueIncidents.toLocaleString()}</div>
            <div className="stat-label">Estimated Unique Incidents</div>
            <div className="stat-description">Deduplicated events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.deduplicationRatio}x</div>
            <div className="stat-label">Coverage Ratio</div>
            <div className="stat-description">Items per incident</div>
          </div>
        </div>
      </div>

      <div className="confidence-distribution">
        <h4>Confidence Score Distribution</h4>
        <div className="confidence-bars">
          <div className="confidence-bar high">
            <div className="bar-label">
              <span className="confidence-icon">🟢</span>
              <span>High Confidence</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill high" 
                style={{width: `${(stats.confidenceDistribution.high / stats.estimatedUniqueIncidents * 100)}%`}}
              ></div>
              <span className="bar-value">{stats.confidenceDistribution.high}</span>
            </div>
            <div className="bar-description">Confirmed breaches</div>
          </div>

          <div className="confidence-bar medium">
            <div className="bar-label">
              <span className="confidence-icon">🟡</span>
              <span>Medium Confidence</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill medium" 
                style={{width: `${(stats.confidenceDistribution.medium / stats.estimatedUniqueIncidents * 100)}%`}}
              ></div>
              <span className="bar-value">{stats.confidenceDistribution.medium}</span>
            </div>
            <div className="bar-description">Credible reporting</div>
          </div>

          <div className="confidence-bar low">
            <div className="bar-label">
              <span className="confidence-icon">🔴</span>
              <span>Low Confidence</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill low" 
                style={{width: `${(stats.confidenceDistribution.low / stats.estimatedUniqueIncidents * 100)}%`}}
              ></div>
              <span className="bar-value">{stats.confidenceDistribution.low}</span>
            </div>
            <div className="bar-description">Speculation/opinion</div>
          </div>
        </div>
      </div>

      <div className="methodology-note">
        <strong>Deduplication Methodology:</strong> Incidents are clustered using a fingerprint based on 
        organization name + attack type + date (±3 day window). Confidence scores are derived from source 
        credibility, enrichment data, and content analysis.
      </div>
    </div>
  );
}

export default DeduplicationStats;
