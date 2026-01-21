import { useMemo } from 'react';
import './YearComparison.css';

function YearComparison({ incidents2025, incidents2026 }) {
  const comparison = useMemo(() => {
    if (!incidents2025 || !incidents2026) {
      return null;
    }

    const analyzeYear = (incidents, year) => {
      const totalIncidents = incidents.length;
      
      // Severity distribution
      const severityCounts = { critical: 0, high: 0, moderate: 0, low: 0 };
      incidents.forEach(inc => {
        const severity = inc.severity || 'low';
        severityCounts[severity] = (severityCounts[severity] || 0) + 1;
      });
      
      // Attack types
      const attackTypes = {};
      incidents.forEach(inc => {
        if (inc.tags && Array.isArray(inc.tags)) {
          inc.tags.forEach(tag => {
            attackTypes[tag] = (attackTypes[tag] || 0) + 1;
          });
        }
      });
      
      const topAttacks = Object.entries(attackTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count]) => ({
          type,
          count,
          percentage: ((count / totalIncidents) * 100).toFixed(1)
        }));
      
      // Sectors
      const sectors = {};
      incidents.forEach(inc => {
        const sector = inc.sector || 'Unknown';
        sectors[sector] = (sectors[sector] || 0) + 1;
      });
      
      const topSectors = Object.entries(sectors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([sector, count]) => ({
          sector,
          count,
          percentage: ((count / totalIncidents) * 100).toFixed(1)
        }));
      
      // Actor types
      const actorTypes = {};
      incidents.forEach(inc => {
        const actor = inc.actor_category || inc.actorType || 'unknown';
        actorTypes[actor] = (actorTypes[actor] || 0) + 1;
      });
      
      // Average impact
      const avgImpact = incidents.reduce((sum, inc) => {
        return sum + (inc.impact || inc.severity_score || 0);
      }, 0) / totalIncidents;
      
      return {
        year,
        totalIncidents,
        severityCounts,
        topAttacks,
        topSectors,
        actorTypes,
        avgImpact: avgImpact.toFixed(1)
      };
    };

    const data2025 = analyzeYear(incidents2025, 2025);
    const data2026 = analyzeYear(incidents2026, 2026);
    
    // Calculate changes
    const changes = {
      totalIncidents: {
        value: data2026.totalIncidents - data2025.totalIncidents,
        percent: ((data2026.totalIncidents - data2025.totalIncidents) / data2025.totalIncidents * 100).toFixed(1)
      },
      avgImpact: {
        value: (data2026.avgImpact - data2025.avgImpact).toFixed(1),
        percent: ((data2026.avgImpact - data2025.avgImpact) / data2025.avgImpact * 100).toFixed(1)
      },
      critical: {
        value: data2026.severityCounts.critical - data2025.severityCounts.critical,
        percent: data2025.severityCounts.critical > 0 
          ? ((data2026.severityCounts.critical - data2025.severityCounts.critical) / data2025.severityCounts.critical * 100).toFixed(1)
          : 'N/A'
      }
    };

    return { data2025, data2026, changes };
  }, [incidents2025, incidents2026]);

  if (!comparison) {
    return null;
  }

  const { data2025, data2026, changes } = comparison;

  const getChangeColor = (value) => {
    if (value > 0) return '#dc2626';
    if (value < 0) return '#16a34a';
    return '#64748b';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  };

  return (
    <div className="year-comparison">
      <div className="comparison-header">
        <h3>📊 Year-over-Year Comparison: 2025 vs 2026</h3>
        <p className="comparison-description">
          Compare threat landscape evolution between years
        </p>
      </div>

      {/* Key Metrics Comparison */}
      <div className="key-metrics-comparison">
        <div className="metric-comparison-card">
          <div className="metric-label">Total Incidents</div>
          <div className="metric-values">
            <div className="year-value">
              <span className="year-label">2025</span>
              <span className="value">{data2025.totalIncidents}</span>
            </div>
            <div className="change-indicator" style={{ color: getChangeColor(changes.totalIncidents.value) }}>
              {getChangeIcon(changes.totalIncidents.value)}
              {Math.abs(changes.totalIncidents.value)}
              <span className="change-percent">({changes.totalIncidents.percent > 0 ? '+' : ''}{changes.totalIncidents.percent}%)</span>
            </div>
            <div className="year-value">
              <span className="year-label">2026</span>
              <span className="value">{data2026.totalIncidents}</span>
            </div>
          </div>
        </div>

        <div className="metric-comparison-card">
          <div className="metric-label">Average Impact</div>
          <div className="metric-values">
            <div className="year-value">
              <span className="year-label">2025</span>
              <span className="value">{data2025.avgImpact}</span>
            </div>
            <div className="change-indicator" style={{ color: getChangeColor(changes.avgImpact.value) }}>
              {getChangeIcon(changes.avgImpact.value)}
              {Math.abs(changes.avgImpact.value)}
              <span className="change-percent">({changes.avgImpact.percent > 0 ? '+' : ''}{changes.avgImpact.percent}%)</span>
            </div>
            <div className="year-value">
              <span className="year-label">2026</span>
              <span className="value">{data2026.avgImpact}</span>
            </div>
          </div>
        </div>

        <div className="metric-comparison-card">
          <div className="metric-label">Critical Incidents</div>
          <div className="metric-values">
            <div className="year-value">
              <span className="year-label">2025</span>
              <span className="value">{data2025.severityCounts.critical}</span>
            </div>
            <div className="change-indicator" style={{ color: getChangeColor(changes.critical.value) }}>
              {getChangeIcon(changes.critical.value)}
              {Math.abs(changes.critical.value)}
              {changes.critical.percent !== 'N/A' && (
                <span className="change-percent">({changes.critical.percent > 0 ? '+' : ''}{changes.critical.percent}%)</span>
              )}
            </div>
            <div className="year-value">
              <span className="year-label">2026</span>
              <span className="value">{data2026.severityCounts.critical}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="side-by-side-comparison">
        {/* Top Attack Types */}
        <div className="comparison-section">
          <h4>🎯 Top Attack Types</h4>
          <div className="comparison-columns">
            <div className="year-column">
              <div className="year-header">2025</div>
              <div className="comparison-list">
                {data2025.topAttacks.map((attack, index) => (
                  <div key={index} className="comparison-item">
                    <span className="item-rank">#{index + 1}</span>
                    <span className="item-name">{attack.type}</span>
                    <span className="item-count">{attack.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="year-column">
              <div className="year-header">2026</div>
              <div className="comparison-list">
                {data2026.topAttacks.map((attack, index) => (
                  <div key={index} className="comparison-item">
                    <span className="item-rank">#{index + 1}</span>
                    <span className="item-name">{attack.type}</span>
                    <span className="item-count">{attack.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Sectors */}
        <div className="comparison-section">
          <h4>🏢 Top Targeted Sectors</h4>
          <div className="comparison-columns">
            <div className="year-column">
              <div className="year-header">2025</div>
              <div className="comparison-list">
                {data2025.topSectors.map((sector, index) => (
                  <div key={index} className="comparison-item">
                    <span className="item-rank">#{index + 1}</span>
                    <span className="item-name">{sector.sector}</span>
                    <span className="item-count">{sector.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="year-column">
              <div className="year-header">2026</div>
              <div className="comparison-list">
                {data2026.topSectors.map((sector, index) => (
                  <div key={index} className="comparison-item">
                    <span className="item-rank">#{index + 1}</span>
                    <span className="item-name">{sector.sector}</span>
                    <span className="item-count">{sector.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="comparison-section">
          <h4>⚠️ Severity Distribution</h4>
          <div className="comparison-columns">
            <div className="year-column">
              <div className="year-header">2025</div>
              <div className="severity-chart">
                {Object.entries(data2025.severityCounts).map(([severity, count]) => (
                  <div key={severity} className="severity-bar-item">
                    <span className="severity-label">{severity}</span>
                    <div className="severity-bar">
                      <div 
                        className="severity-bar-fill"
                        data-severity={severity}
                        style={{ width: `${(count / data2025.totalIncidents * 100)}%` }}
                      ></div>
                    </div>
                    <span className="severity-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="year-column">
              <div className="year-header">2026</div>
              <div className="severity-chart">
                {Object.entries(data2026.severityCounts).map(([severity, count]) => (
                  <div key={severity} className="severity-bar-item">
                    <span className="severity-label">{severity}</span>
                    <div className="severity-bar">
                      <div 
                        className="severity-bar-fill"
                        data-severity={severity}
                        style={{ width: `${(count / data2026.totalIncidents * 100)}%` }}
                      ></div>
                    </div>
                    <span className="severity-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="comparison-insights">
        <h4>💡 Key Takeaways</h4>
        <div className="insights-list">
          {changes.totalIncidents.value !== 0 && (
            <div className="insight-item">
              <span className="insight-icon">
                {changes.totalIncidents.value > 0 ? '📈' : '📉'}
              </span>
              <p>
                Incident volume {changes.totalIncidents.value > 0 ? 'increased' : 'decreased'} by{' '}
                <strong>{Math.abs(changes.totalIncidents.percent)}%</strong> from 2025 to 2026
              </p>
            </div>
          )}
          {changes.avgImpact.value !== 0 && (
            <div className="insight-item">
              <span className="insight-icon">⚠️</span>
              <p>
                Average impact {changes.avgImpact.value > 0 ? 'increased' : 'decreased'} by{' '}
                <strong>{Math.abs(changes.avgImpact.percent)}%</strong>, indicating{' '}
                {changes.avgImpact.value > 0 ? 'more severe' : 'less severe'} incidents
              </p>
            </div>
          )}
          <div className="insight-item">
            <span className="insight-icon">🎯</span>
            <p>
              Top attack type in 2026: <strong>{data2026.topAttacks[0]?.type}</strong> with{' '}
              {data2026.topAttacks[0]?.count} incidents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YearComparison;
