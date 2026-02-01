import { useMemo } from 'react';
import './DeduplicationStats.css';
import { enhanceIncidents } from '../utils/deduplicationUtils';
import ConfidenceBadge from './ConfidenceBadge';
import { getDedupeConfidence } from '../utils/confidenceRules';

/**
 * Deduplication Statistics Component
 * Shows estimated unique incidents vs total articles
 * Now includes PASS/FAIL reconciliation checks
 */
function DeduplicationStats({ incidents }) {
  const stats = useMemo(() => {
    if (!incidents || incidents.length === 0) return null;
    
    const result = enhanceIncidents(incidents);
    return result.stats;
  }, [incidents]);

  // Compute reconciliation checks (PASS/FAIL)
  const reconciliationChecks = useMemo(() => {
    if (!stats) return null;
    
    const checks = [];
    
    // Check 1: Items count matches dataset length
    const itemsCountMatch = stats.totalArticles === incidents.length;
    checks.push({
      name: 'Items count validation',
      expected: incidents.length,
      actual: stats.totalArticles,
      passed: itemsCountMatch,
      message: itemsCountMatch 
        ? `Items count matches dataset (${stats.totalArticles})` 
        : `Items count mismatch: expected ${incidents.length}, got ${stats.totalArticles}`
    });
    
    // Check 2: Cluster count is reasonable (not zero, not more than items)
    const clusterCountValid = stats.estimatedUniqueIncidents > 0 && 
                               stats.estimatedUniqueIncidents <= stats.totalArticles;
    checks.push({
      name: 'Cluster count validation',
      expected: `1 to ${stats.totalArticles}`,
      actual: stats.estimatedUniqueIncidents,
      passed: clusterCountValid,
      message: clusterCountValid
        ? `Cluster count valid (${stats.estimatedUniqueIncidents})`
        : `Cluster count invalid: ${stats.estimatedUniqueIncidents} (should be 1-${stats.totalArticles})`
    });
    
    // Check 3: Coverage ratio is computed correctly
    const expectedRatio = (stats.totalArticles / stats.estimatedUniqueIncidents).toFixed(1);
    const ratioValid = Math.abs(parseFloat(expectedRatio) - parseFloat(stats.deduplicationRatio)) < 0.2;
    checks.push({
      name: 'Coverage ratio validation',
      expected: expectedRatio + 'x',
      actual: stats.deduplicationRatio + 'x',
      passed: ratioValid,
      message: ratioValid
        ? `Coverage ratio correct (${stats.deduplicationRatio}x)`
        : `Coverage ratio mismatch: expected ${expectedRatio}x, got ${stats.deduplicationRatio}x`
    });
    
    const allPassed = checks.every(check => check.passed);
    
    return {
      checks,
      allPassed,
      passedCount: checks.filter(c => c.passed).length,
      totalCount: checks.length
    };
  }, [stats, incidents]);

  if (!stats || stats.totalArticles === 0) return null;

  return (
    <div className="deduplication-stats">
      <div className="stats-header">
        <h3>📊 Data Volume Analysis</h3>
        <p className="subtitle">Estimated unique incidents vs incident-related items coverage</p>
        
        {/* Confidence Badge - using centralized rules */}
        {(() => {
          const confidence = getDedupeConfidence(null, false);
          return (
            <div style={{ marginTop: '0.75rem' }}>
              <ConfidenceBadge 
                level={confidence.level}
                label="Deduplication"
                value="heuristic"
                tooltip={confidence.tooltip}
                size="sm"
              />
            </div>
          );
        })()}
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
            <div className="stat-label">
              Estimated Unique Incidents (Clustered)
              <span className="info-tooltip" title="How calculated: Articles are grouped using heuristics (title similarity + source + date window ±48h). This is a clustering estimate — not confirmed incident count. Fingerprint method: org + attack type + date window.">ℹ️</span>
            </div>
            <div className="stat-description">Heuristic deduplication</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.deduplicationRatio}x</div>
            <div className="stat-label">
              Coverage Ratio
              <span className="info-tooltip" title="How calculated: Total items ÷ Estimated unique incidents. A ratio of 3.0x means each incident is covered by an average of 3 news articles. Higher ratios indicate major incidents with extensive media coverage.">ℹ️</span>
            </div>
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
      
      <div className={`reconciliation-note ${reconciliationChecks && !reconciliationChecks.allPassed ? 'has-warnings' : ''}`} style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: reconciliationChecks && !reconciliationChecks.allPassed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
        borderLeft: `3px solid ${reconciliationChecks && !reconciliationChecks.allPassed ? '#ef4444' : '#3b82f6'}`,
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong>📊 Reconciliation Checks:</strong>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 600,
            color: reconciliationChecks && reconciliationChecks.allPassed ? '#10b981' : '#ef4444'
          }}>
            {reconciliationChecks && reconciliationChecks.passedCount}/{reconciliationChecks && reconciliationChecks.totalCount} PASSED
          </span>
        </div>
        
        {reconciliationChecks && reconciliationChecks.checks.map((check, idx) => (
          <div key={idx} style={{ 
            margin: '0.5rem 0',
            padding: '0.5rem',
            background: check.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem' }}>
                {check.passed ? '✅' : '❌'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {check.name}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>
                  {check.message}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {reconciliationChecks && !reconciliationChecks.allPassed && (
          <div style={{ 
            marginTop: '0.75rem', 
            padding: '0.5rem', 
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '4px',
            fontSize: '0.8125rem',
            color: '#dc2626',
            fontWeight: 600
          }}>
            ⚠️ Warning: Data consistency checks failed. Please review the issues above.
          </div>
        )}
        
        <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: '#6b7280' }}>
          <em>Note: Individual metrics may show different counts based on their specific filters (e.g., severity only shows incident-related items, sectors may use different deduplication scopes)</em>
        </div>
      </div>
    </div>
  );
}

export default DeduplicationStats;
