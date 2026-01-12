import { useMemo } from 'react';
import './TrendAcceleration.css';
import { getTrendAcceleration } from '../utils/analyticsUtils';

/**
 * Trend Acceleration Component
 * Shows accelerating, stable, and declining threat trends
 * Enterprise feature for identifying emerging vs. fading threats
 */
function TrendAcceleration({ incidents, filters }) {
  const trendData = useMemo(() => {
    return getTrendAcceleration(incidents, 'themes', filters);
  }, [incidents, filters]);

  if (!trendData.trends || trendData.note) {
    return (
      <div className="trend-acceleration">
        <div className="section-header">
          <h2>📈 Trend Acceleration Analysis</h2>
          <p className="subtitle">Emerging vs. declining threats</p>
        </div>
        <div className="no-data">
          <p>{trendData.note || 'No trend data available'}</p>
        </div>
      </div>
    );
  }

  const { accelerating, declining, stable } = trendData.trends;

  return (
    <div className="trend-acceleration">
      <div className="section-header">
        <h2>📈 Trend Acceleration Analysis</h2>
        <p className="subtitle">Identify emerging and fading threat patterns</p>
        <div className="metadata">
          <span className="count-badge">
            {accelerating.length + declining.length + stable.length} trends tracked
          </span>
          <span className="period-badge">
            Period: {trendData.analysisWindow}
          </span>
        </div>
      </div>

      <div className="methodology-note">
        <strong>Methodology:</strong> Trend velocity calculated using linear regression over last 3 quarters. 
        Slope {'>'} 20% = accelerating, {'<'} -20% = declining, else stable.
      </div>

      <div className="trends-container">
        {accelerating.length > 0 && (
          <div className="trend-section accelerating">
            <div className="trend-section-header">
              <h3>🚀 Accelerating Threats</h3>
              <span className="trend-count">{accelerating.length}</span>
            </div>
            <div className="trend-list">
              {accelerating.slice(0, 5).map((trend, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-info">
                    <div className="trend-name">{trend.name}</div>
                    <div className="trend-stats">
                      Velocity: <strong>+{trend.slope}%</strong> per quarter
                    </div>
                  </div>
                  <div className="trend-visual">
                    <div className="trend-bars">
                      {trend.recentQuarters.map((q, i) => (
                        <div 
                          key={i} 
                          className="trend-bar"
                          style={{ height: `${Math.min((q.count / trend.avgCount) * 50, 100)}px` }}
                          title={`${q.quarter}: ${q.count} incidents`}
                        ></div>
                      ))}
                    </div>
                    <div className="trend-arrow">↗️</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {declining.length > 0 && (
          <div className="trend-section declining">
            <div className="trend-section-header">
              <h3>📉 Declining Threats</h3>
              <span className="trend-count">{declining.length}</span>
            </div>
            <div className="trend-list">
              {declining.slice(0, 5).map((trend, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-info">
                    <div className="trend-name">{trend.name}</div>
                    <div className="trend-stats">
                      Velocity: <strong>{trend.slope}%</strong> per quarter
                    </div>
                  </div>
                  <div className="trend-visual">
                    <div className="trend-bars">
                      {trend.recentQuarters.map((q, i) => (
                        <div 
                          key={i} 
                          className="trend-bar"
                          style={{ height: `${Math.min((q.count / trend.avgCount) * 50, 100)}px` }}
                          title={`${q.quarter}: ${q.count} incidents`}
                        ></div>
                      ))}
                    </div>
                    <div className="trend-arrow">↘️</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stable.length > 0 && (
          <div className="trend-section stable">
            <div className="trend-section-header">
              <h3>➡️ Stable Threats</h3>
              <span className="trend-count">{stable.length}</span>
            </div>
            <div className="trend-list collapsed">
              {stable.slice(0, 3).map((trend, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-info">
                    <div className="trend-name">{trend.name}</div>
                    <div className="trend-stats">
                      Avg: <strong>{trend.avgCount}</strong> per quarter
                    </div>
                  </div>
                  <div className="trend-visual">
                    <div className="trend-arrow">→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="insights">
        <h3>🎯 Strategic Insights</h3>
        <ul>
          {accelerating.length > 0 && (
            <li>
              <strong>Top Emerging Threat:</strong> {accelerating[0].name} is accelerating 
              at +{accelerating[0].slope}% per quarter - requires immediate attention
            </li>
          )}
          {declining.length > 0 && (
            <li>
              <strong>Declining Pattern:</strong> {declining[0].name} shows {Math.abs(declining[0].slope)}% 
              decrease - may indicate successful defenses or shifting tactics
            </li>
          )}
          <li>
            <strong>Resource Allocation:</strong> Focus defensive investments on accelerating threats 
            while monitoring declining patterns for potential pivots
          </li>
        </ul>
      </div>

      <div className="ciso-note">
        <strong>💼 CISO Value:</strong> Trend acceleration analysis enables proactive threat response. 
        Identify emerging threats before they become crises and validate defensive strategy effectiveness.
      </div>
    </div>
  );
}

export default TrendAcceleration;
