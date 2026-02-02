import { useMemo } from 'react';
import './TrendContinuity.css';

function TrendContinuity({ incidents }) {
  const monthlyTrends = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Group incidents by month
    const monthlyData = {};
    
    incidents.forEach(incident => {
      if (!incident.date) return;
      
      const date = new Date(incident.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          count: 0,
          severityCounts: { critical: 0, high: 0, moderate: 0, low: 0 },
          attackTypes: {},
          avgImpact: 0,
          totalImpact: 0
        };
      }
      
      monthlyData[monthKey].count++;
      
      // Count severity
      const severity = incident.severity || 'low';
      monthlyData[monthKey].severityCounts[severity] = 
        (monthlyData[monthKey].severityCounts[severity] || 0) + 1;
      
      // Count attack types from tags
      if (incident.tags && Array.isArray(incident.tags)) {
        incident.tags.forEach(tag => {
          monthlyData[monthKey].attackTypes[tag] = 
            (monthlyData[monthKey].attackTypes[tag] || 0) + 1;
        });
      }
      
      // Sum impact
      const impact = incident.impact || incident.severity_score || 0;
      monthlyData[monthKey].totalImpact += impact;
    });

    // Calculate average impact
    Object.values(monthlyData).forEach(month => {
      month.avgImpact = month.count > 0 ? (month.totalImpact / month.count).toFixed(1) : 0;
    });

    // Sort by month
    const sortedMonths = Object.values(monthlyData).sort((a, b) => 
      a.month.localeCompare(b.month)
    );

    // Calculate month-over-month changes
    const trendsWithChanges = sortedMonths.map((month, index) => {
      if (index === 0) {
        return { ...month, changes: null };
      }
      
      const prevMonth = sortedMonths[index - 1];
      const countChange = month.count - prevMonth.count;
      const countChangePercent = prevMonth.count > 0 
        ? ((countChange / prevMonth.count) * 100).toFixed(1)
        : null; // Return null instead of 0 when no prior data
      
      const impactChange = month.avgImpact - prevMonth.avgImpact;
      const impactChangePercent = prevMonth.avgImpact > 0
        ? ((impactChange / prevMonth.avgImpact) * 100).toFixed(1)
        : null; // Return null instead of 0 when no prior data

      // Find new attack types
      const prevAttacks = Object.keys(prevMonth.attackTypes);
      const currentAttacks = Object.keys(month.attackTypes);
      const newAttacks = currentAttacks.filter(a => !prevAttacks.includes(a));
      
      // Find trending attacks (significant increase)
      const trendingAttacks = currentAttacks
        .map(attack => {
          const current = month.attackTypes[attack] || 0;
          const previous = prevMonth.attackTypes[attack] || 0;
          const change = current - previous;
          const changePercent = previous > 0 ? ((change / previous) * 100).toFixed(0) : null;
          return { attack, current, previous, change, changePercent };
        })
        .filter(a => a.change > 0 && a.changePercent > 20)
        .sort((a, b) => b.change - a.change)
        .slice(0, 3);

      return {
        ...month,
        changes: {
          count: countChange,
          countPercent: countChangePercent,
          impact: impactChange,
          impactPercent: impactChangePercent,
          newAttacks,
          trendingAttacks
        }
      };
    });

    return trendsWithChanges;
  }, [incidents]);

  if (!monthlyTrends || monthlyTrends.length === 0) {
    return null;
  }

  const formatMonthName = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getChangeIcon = (value) => {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➡️';
  };

  const getChangeColor = (value) => {
    if (value > 20) return '#dc2626';
    if (value > 0) return '#f59e0b';
    if (value < -20) return '#16a34a';
    if (value < 0) return '#84cc16';
    return '#64748b';
  };

  return (
    <div className="trend-continuity">
      <div className="trend-header">
        <h3>📊 Trend Continuity - Month-over-Month Analysis</h3>
        <p className="trend-description">
          Track how threat landscape evolves over time with month-over-month comparisons
        </p>
      </div>

      <div className="trend-timeline">
        {monthlyTrends.map((month) => (
          <div key={month.month} className="trend-month-card">
            <div className="month-header">
              <div className="month-title">
                <h4>{formatMonthName(month.month)}</h4>
                <span className="month-count">{month.count} incident-related items</span>
              </div>
              {month.changes && (
                <div className="month-change-summary">
                  <span 
                    className="change-badge"
                    style={{ color: month.changes.countPercent !== null ? getChangeColor(parseFloat(month.changes.countPercent)) : '#64748b' }}
                  >
                    {month.changes.countPercent !== null ? (
                      <>
                        {getChangeIcon(parseFloat(month.changes.countPercent))}
                        {month.changes.countPercent > 0 ? '+' : ''}
                        {month.changes.countPercent}%
                      </>
                    ) : (
                      'N/A (insufficient history)'
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="month-metrics">
              <div className="metric">
                <span className="metric-label">Avg Impact</span>
                <span className="metric-value">{month.avgImpact}</span>
                {month.changes && month.changes.impactPercent !== null && month.changes.impactPercent !== 0 && (
                  <span 
                    className="metric-change"
                    style={{ color: getChangeColor(parseFloat(month.changes.impactPercent)) }}
                  >
                    {month.changes.impactPercent > 0 ? '+' : ''}
                    {month.changes.impactPercent}%
                  </span>
                )}
              </div>

              <div className="severity-breakdown">
                {Object.entries(month.severityCounts).map(([severity, count]) => (
                  count > 0 && (
                    <div key={severity} className="severity-item">
                      <span className="severity-dot" data-severity={severity}></span>
                      <span className="severity-label">{severity}</span>
                      <span className="severity-count">{count}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {month.changes && (
              <div className="month-changes">
                {month.changes.trendingAttacks.length > 0 && (
                  <div className="trending-section">
                    <h5>📈 Trending Attacks</h5>
                    <div className="trending-list">
                      {month.changes.trendingAttacks.map((attack, idx) => (
                        <div key={idx} className="trending-item">
                          <span className="trending-name">{attack.attack}</span>
                          <span className="trending-change">
                            +{attack.changePercent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {month.changes.newAttacks.length > 0 && (
                  <div className="new-attacks-section">
                    <h5>🆕 New Attack Types</h5>
                    <div className="new-attacks-list">
                      {month.changes.newAttacks.slice(0, 3).map((attack, idx) => (
                        <span key={idx} className="new-attack-badge">
                          {attack}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {month.changes.count !== 0 && (
                  <div className="change-summary">
                    <p>
                      {month.changes.count > 0 ? (
                        <>
                          <strong>{Math.abs(month.changes.count)} more items</strong> than previous month
                        </>
                      ) : (
                        <>
                          <strong>{Math.abs(month.changes.count)} fewer items</strong> than previous month
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="trend-insights">
        <h4>💡 Key Insights</h4>
        <div className="insights-grid">
          {(() => {
            const recentMonths = monthlyTrends.slice(-3);
            // Filter out null percentages and calculate average
            const validPercentages = recentMonths
              .filter(m => m.changes && m.changes.countPercent !== null)
              .map(m => parseFloat(m.changes.countPercent));
            
            const avgGrowth = validPercentages.length > 0
              ? validPercentages.reduce((sum, val) => sum + val, 0) / validPercentages.length
              : 0;
            
            const acceleration = avgGrowth > 10 ? 'accelerating' : 
                               avgGrowth < -10 ? 'declining' : 'stable';
            
            const hasEnoughData = validPercentages.length >= 2;
            
            return (
              <>
                <div className="insight-card">
                  <span className="insight-icon">📈</span>
                  <div>
                    <strong>Overall Trend</strong>
                    <p>
                      {hasEnoughData ? (
                        <>
                          Item volume is <strong>{acceleration}</strong> with {avgGrowth.toFixed(1)}% avg monthly change
                        </>
                      ) : (
                        <>
                          <strong>N/A</strong> (requires ≥2 months of data)
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                {recentMonths.length > 0 && (
                  <div className="insight-card">
                    <span className="insight-icon">📊</span>
                    <div>
                      <strong>Recent Activity</strong>
                      <p>
                        Last 3 months averaged <strong>{Math.round(recentMonths.reduce((sum, m) => sum + m.count, 0) / recentMonths.length)} incidents/month</strong>
                      </p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default TrendContinuity;
