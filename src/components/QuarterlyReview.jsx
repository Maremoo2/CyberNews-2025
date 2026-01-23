import { useMemo } from 'react';
import './QuarterlyReview.css';

function QuarterlyReview({ incidents }) {
  const quarterlyData = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Group incidents by quarter
    const quarters = {};
    
    incidents.forEach(incident => {
      if (!incident.date) return;
      
      const date = new Date(incident.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const quarterKey = `${year}-Q${quarter}`;
      
      if (!quarters[quarterKey]) {
        quarters[quarterKey] = {
          quarter: quarterKey,
          year,
          quarterNum: quarter,
          incidents: [],
          count: 0,
          severityCounts: { critical: 0, high: 0, moderate: 0, low: 0 },
          attackTypes: {},
          sectors: {},
          actors: new Set(),
          avgImpact: 0,
          totalImpact: 0
        };
      }
      
      quarters[quarterKey].incidents.push(incident);
      quarters[quarterKey].count++;
      
      // Severity
      const severity = incident.severity || 'low';
      quarters[quarterKey].severityCounts[severity]++;
      
      // Attack types
      if (incident.tags && Array.isArray(incident.tags)) {
        incident.tags.forEach(tag => {
          quarters[quarterKey].attackTypes[tag] = 
            (quarters[quarterKey].attackTypes[tag] || 0) + 1;
        });
      }
      
      // Sectors
      if (incident.sector) {
        quarters[quarterKey].sectors[incident.sector] = 
          (quarters[quarterKey].sectors[incident.sector] || 0) + 1;
      }
      
      // Actors
      if (incident.actor_name) {
        quarters[quarterKey].actors.add(incident.actor_name);
      }
      
      // Impact
      const impact = incident.impact || incident.severity_score || 0;
      quarters[quarterKey].totalImpact += impact;
    });

    // Calculate averages and top items
    const quarterlyArray = Object.values(quarters).map(q => {
      q.avgImpact = q.count > 0 ? (q.totalImpact / q.count).toFixed(1) : 0;
      
      q.topAttacks = Object.entries(q.attackTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type, count]) => ({ type, count }));
      
      q.topSectors = Object.entries(q.sectors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([sector, count]) => ({ sector, count }));
      
      q.actorCount = q.actors.size;
      
      // Detect if quarter is partial (not all 3 months have data)
      const monthsInQuarter = new Set();
      q.incidents.forEach(incident => {
        if (incident.date) {
          const date = new Date(incident.date);
          monthsInQuarter.add(date.getMonth());
        }
      });
      q.isPartial = monthsInQuarter.size < 3;
      q.monthsWithData = Array.from(monthsInQuarter).sort((a, b) => a - b);
      
      return q;
    });

    // Sort by quarter
    return quarterlyArray.sort((a, b) => a.quarter.localeCompare(b.quarter));
  }, [incidents]);

  if (!quarterlyData || quarterlyData.length === 0) {
    return null;
  }

  const getQuarterName = (quarterNum) => {
    return `Q${quarterNum}`;
  };

  const getQuarterMonths = (quarterNum, isPartial, monthsWithData) => {
    const months = {
      1: 'Jan-Mar',
      2: 'Apr-Jun',
      3: 'Jul-Sep',
      4: 'Oct-Dec'
    };
    
    if (isPartial && monthsWithData && monthsWithData.length > 0) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dataMonths = monthsWithData.map(m => monthNames[m]).join(', ');
      return `${dataMonths} (partial)`;
    }
    
    return months[quarterNum] || '';
  };

  return (
    <div className="quarterly-review">
      <div className="quarterly-header">
        <h3>📆 Quarterly Review</h3>
        <p className="quarterly-description">
          Strategic summaries for board presentations and executive reporting
        </p>
      </div>

      <div className="quarters-grid">
        {quarterlyData.map((quarter, index) => {
          const prevQuarter = index > 0 ? quarterlyData[index - 1] : null;
          const qoqChange = prevQuarter && prevQuarter.count > 0
            ? ((quarter.count - prevQuarter.count) / prevQuarter.count * 100).toFixed(1)
            : null;
          
          return (
            <div key={quarter.quarter} className="quarter-card">
              <div className="quarter-card-header">
                <div className="quarter-title">
                  <h4>{quarter.year} {getQuarterName(quarter.quarterNum)}{quarter.isPartial ? ' (YTD)' : ''}</h4>
                  <span className="quarter-period">{getQuarterMonths(quarter.quarterNum, quarter.isPartial, quarter.monthsWithData)}</span>
                </div>
                {qoqChange !== null && (
                  <div className={`qoq-badge ${qoqChange > 0 ? 'increase' : 'decrease'}`}>
                    {qoqChange > 0 ? '↑' : '↓'} {Math.abs(qoqChange)}% QoQ
                  </div>
                )}
              </div>

              <div className="quarter-metrics">
                <div className="quarter-metric-row">
                  <div className="quarter-metric">
                    <span className="metric-value">{quarter.count}</span>
                    <span className="metric-label">Incident-Related Items</span>
                  </div>
                  <div className="quarter-metric">
                    <span className="metric-value">{quarter.avgImpact}</span>
                    <span className="metric-label">Avg Impact</span>
                  </div>
                  <div className="quarter-metric">
                    <span className="metric-value">{quarter.actorCount}</span>
                    <span className="metric-label">Unique Actors</span>
                  </div>
                </div>

                <div className="severity-mini-chart">
                  {Object.entries(quarter.severityCounts).map(([severity, count]) => (
                    count > 0 && (
                      <div key={severity} className="severity-mini-bar" data-severity={severity}>
                        <div 
                          className="severity-mini-fill"
                          style={{ width: `${(count / quarter.count * 100)}%` }}
                          title={`${severity}: ${count}`}
                        ></div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="quarter-highlights">
                <div className="highlight-section">
                  <h5>🎯 Top Attacks</h5>
                  <ul className="highlight-list">
                    {quarter.topAttacks.map((attack, idx) => (
                      <li key={idx}>
                        <span className="highlight-name">{attack.type}</span>
                        <span className="highlight-count">{attack.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="highlight-section">
                  <h5>🏢 Top Sectors</h5>
                  <ul className="highlight-list">
                    {quarter.topSectors.map((sector, idx) => (
                      <li key={idx}>
                        <span className="highlight-name">{sector.sector}</span>
                        <span className="highlight-count">{sector.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="highlight-section">
                  <h5>⚠️ Critical Events</h5>
                  <p className="highlight-stat">
                    {quarter.severityCounts.critical} critical items
                    {quarter.severityCounts.critical > 0 && (
                      <span className="highlight-detail">
                        {' '}({((quarter.severityCounts.critical / quarter.count) * 100).toFixed(0)}% of total)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {index > 0 && (
                <div className="quarter-changes">
                  <h5>📊 Changes from Previous Quarter</h5>
                  <ul className="changes-list">
                    {qoqChange > 10 && (
                      <li className="change-item increase">
                        Significant increase in incident volume (+{qoqChange}%)
                      </li>
                    )}
                    {qoqChange < -10 && (
                      <li className="change-item decrease">
                        Notable decrease in incident volume ({qoqChange}%)
                      </li>
                    )}
                    {quarter.actorCount > prevQuarter.actorCount && (
                      <li className="change-item">
                        {quarter.actorCount - prevQuarter.actorCount} new threat actors observed
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="quarterly-insights">
        <h4>💡 Executive Insights</h4>
        <div className="insights-content">
          <div className="insight-box">
            <span className="insight-icon">📈</span>
            <div>
              <strong>Trend Analysis</strong>
              <p>
                {quarterlyData.length >= 2 && (
                  <>
                    {(() => {
                      const recent = quarterlyData.slice(-2);
                      const trend = recent[1].count > recent[0].count ? 'increasing' : 'decreasing';
                      return `Threat activity is ${trend} - Q${recent[1].quarterNum} ${recent[1].year} recorded ${recent[1].count} incidents compared to ${recent[0].count} in the previous quarter.`;
                    })()}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="insight-box">
            <span className="insight-icon">🎯</span>
            <div>
              <strong>Strategic Focus</strong>
              <p>
                Based on quarterly patterns, prioritize defense against{' '}
                {quarterlyData[quarterlyData.length - 1]?.topAttacks[0]?.type || 'top threats'}{' '}
                and increased monitoring of{' '}
                {quarterlyData[quarterlyData.length - 1]?.topSectors[0]?.sector || 'critical sectors'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="quarterly-footer">
        <p>
          <strong>Use for:</strong> Board meetings • CISO reports • Strategic planning • Budget justification • LinkedIn posts
        </p>
      </div>
    </div>
  );
}

export default QuarterlyReview;
