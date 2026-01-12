import { useMemo } from 'react';
import './DetectionGapAnalysis.css';
import { getDetectionGaps, SECURITY_TOOLS } from '../utils/analyticsUtils';

/**
 * Detection Gap Analysis Component
 * Maps MITRE techniques against security tools mentioned
 * Enterprise feature: "T1190 dominates, but WAF mentioned in only 3% of cases"
 */
function DetectionGapAnalysis({ incidents, filters }) {
  const gapData = useMemo(() => {
    return getDetectionGaps(incidents, filters, 15);
  }, [incidents, filters]);

  // Format security tools for display
  const toolsExample = SECURITY_TOOLS.slice(0, 3)
    .map(tool => tool.toUpperCase())
    .join(', ');

  if (!gapData.gaps || gapData.gaps.length === 0) {
    return (
      <div className="detection-gap-analysis">
        <div className="section-header">
          <h2>🛡️ Detection Gap Analysis</h2>
          <p className="subtitle">Control coverage assessment</p>
        </div>
        <div className="no-data">
          <p>Insufficient data for detection gap analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detection-gap-analysis">
      <div className="section-header">
        <h2>🛡️ Detection Gap Analysis</h2>
        <p className="subtitle">Where attack techniques dominate but defenses are rarely mentioned</p>
        <div className="metadata">
          <span className="count-badge">
            {gapData.gaps.length} techniques analyzed
          </span>
          <span className="population-badge">
            Population: {gapData.population}
          </span>
        </div>
      </div>

      <div className="methodology-note">
        <strong>Methodology:</strong> Compares MITRE technique frequency against security tool mentions 
        ({toolsExample}, etc.) to identify control gaps. High incident count + low tool coverage = significant gap.
      </div>

      <div className="gaps-container">
        {gapData.gaps.map((gap, index) => {
          const toolsMentioned = Object.entries(gap.toolsMentioned);
          const isCriticalGap = gap.toolCoverageRate < 10;

          return (
            <div 
              key={index} 
              className={`gap-card ${isCriticalGap ? 'critical-gap' : ''}`}
            >
              <div className="gap-header">
                <div className="gap-rank">#{index + 1}</div>
                <div className="gap-title">
                  <div className="technique-name">{gap.name}</div>
                  <div className="technique-id">{gap.id}</div>
                </div>
                {isCriticalGap && (
                  <span className="critical-badge">⚠️ Critical Gap</span>
                )}
              </div>

              <div className="gap-metrics">
                <div className="metric-row">
                  <div className="metric-item">
                    <div className="metric-label">Incident Count</div>
                    <div className="metric-value">{gap.incidentCount}</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Tool Coverage</div>
                    <div className={`metric-value ${gap.toolCoverageRate < 20 ? 'low' : ''}`}>
                      {gap.toolCoverageRate}%
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Gap Score</div>
                    <div className="metric-value">{Math.round(gap.gapScore)}</div>
                  </div>
                </div>

                <div className="coverage-bar">
                  <div 
                    className="coverage-fill"
                    style={{ width: `${gap.toolCoverageRate}%` }}
                  ></div>
                </div>
              </div>

              {toolsMentioned.length > 0 && (
                <div className="tools-mentioned">
                  <div className="tools-label">Tools Mentioned:</div>
                  <div className="tools-list">
                    {toolsMentioned.map(([tool, count]) => (
                      <span key={tool} className="tool-badge">
                        {tool.toUpperCase()} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {toolsMentioned.length === 0 && (
                <div className="no-tools-warning">
                  ⚠️ No security tools mentioned in {gap.incidentCount} incidents
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="insights">
        <h3>🎯 Security Recommendations</h3>
        <ul>
          {gapData.gaps.slice(0, 3).map((gap, index) => (
            <li key={index}>
              <strong>{gap.name}:</strong> Detected in {gap.incidentCount} incidents 
              but security controls mentioned in only {gap.toolCoverageRate}% of cases. 
              {gap.toolCoverageRate < 10 && ' Consider deploying or enhancing detection capabilities.'}
            </li>
          ))}
        </ul>
      </div>

      <div className="ciso-note">
        <strong>💼 CISO Value:</strong> Detection gap analysis reveals where your security stack 
        may have blind spots. Use this to prioritize control investments and validate defensive coverage 
        against real-world attack patterns.
      </div>
    </div>
  );
}

export default DetectionGapAnalysis;
