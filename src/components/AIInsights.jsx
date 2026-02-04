import { useState, useEffect } from 'react';
import { getISOWeek, getISOWeekYear } from 'date-fns';
import './AIInsights.css';

function AIInsights() {
  const [dailyDigest, setDailyDigest] = useState(null);
  const [weeklyBrief, setWeeklyBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        // Load today's daily digest (using UTC date to match server-generated files)
        const today = new Date();
        // Use UTC date components to ensure consistent date across timezones
        const year = today.getUTCFullYear();
        const month = String(today.getUTCMonth() + 1).padStart(2, '0');
        const day = String(today.getUTCDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD
        
        let digestData = null;
        try {
          const digestResponse = await fetch(`/data/daily/${dateStr}.json`);
          if (digestResponse.ok) {
            digestData = await digestResponse.json();
          }
        } catch (err) {
          console.log('Daily digest not available for today:', dateStr);
        }

        // Load latest weekly brief
        let briefData = null;
        const attempts = [];
        
        // Generate potential file names for the last 4 weeks
        for (let i = 0; i < 4; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - (i * 7));
          const year = getISOWeekYear(date);
          const weekNumber = getISOWeek(date);
          
          const weekStr = `${year}-${String(weekNumber).padStart(2, '0')}`;
          attempts.push(`/data/briefs/week_${weekStr}.json`);
        }

        // Try each file in order
        for (const url of attempts) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              briefData = await response.json();
              break;
            }
          } catch {
            // Silently continue to next attempt
          }
        }

        // If we have at least one dataset, show the component
        if (digestData || briefData) {
          setDailyDigest(digestData);
          setWeeklyBrief(briefData);
          setError(null);
        } else {
          setError('No AI-generated insights available yet. Check back after the analysis runs.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading AI insights:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          attemptedDate: dateStr
        });
        setError('Failed to load AI insights. Please check the console for details.');
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="ai-insights">
        <div className="loading">Loading AI insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-insights">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="ai-insights">
      {/* Daily Digest Section */}
      {dailyDigest && dailyDigest.digest && (
        <div className="insights-section daily-digest">
          <div className="section-header">
            <h2>📰 Today's Threat Digest</h2>
            <div className="section-metadata">
              <div className="section-date">{formatDate(dailyDigest.date)}</div>
              {dailyDigest.generated_at && (
                <div className="section-timestamp" title="When this digest was last generated">
                  Last run: {new Date(dailyDigest.generated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="digest-summary">
            {dailyDigest.digest.summary}
          </div>

          {/* Novel Clusters */}
          {dailyDigest.digest.novel_clusters && dailyDigest.digest.novel_clusters.length > 0 && (
            <div className="clusters-section">
              <h3>🆕 Novel Threats Identified</h3>
              <div className="clusters-grid">
                {dailyDigest.digest.novel_clusters.map((cluster, index) => (
                  <div key={index} className="cluster-card novel">
                    <div className="cluster-header">
                      <h4>{cluster.theme}</h4>
                      <span className="item-count">{cluster.item_count} {cluster.item_count === 1 ? 'item' : 'items'}</span>
                    </div>
                    <p className="cluster-summary">{cluster.summary}</p>
                    <div className="why-matters">
                      <span className="icon">💡</span>
                      <strong>Why it matters:</strong> {cluster.why_matters}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Continuation Clusters */}
          {dailyDigest.digest.continuation_clusters && dailyDigest.digest.continuation_clusters.length > 0 && (
            <div className="clusters-section">
              <h3>🔄 Ongoing Threats</h3>
              <div className="clusters-grid">
                {dailyDigest.digest.continuation_clusters.map((cluster, index) => (
                  <div key={index} className="cluster-card continuation">
                    <div className="cluster-header">
                      <h4>{cluster.theme}</h4>
                      <span className="item-count">{cluster.item_count} {cluster.item_count === 1 ? 'item' : 'items'}</span>
                    </div>
                    <p className="cluster-summary">{cluster.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Brief Section */}
      {weeklyBrief && weeklyBrief.brief && (
        <div className="insights-section weekly-brief">
          <div className="section-header">
            <h2>📊 Weekly Intelligence Brief</h2>
            <div className="section-metadata">
              <div className="section-date">
                Week: {formatDate(weeklyBrief.week_start)} - {formatDate(weeklyBrief.week_end)}
              </div>
              {weeklyBrief.generated_at && (
                <div className="section-timestamp" title="When this brief was last generated">
                  Last run: {new Date(weeklyBrief.generated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Top 5 Things */}
          {weeklyBrief.brief.top_5_things && weeklyBrief.brief.top_5_things.length > 0 && (
            <div className="brief-section">
              <h3>🔥 Top 5 This Week</h3>
              <div className="top-things-list">
                {weeklyBrief.brief.top_5_things.map((item, index) => (
                  <div key={index} className="top-thing-card">
                    <div className="top-thing-header">
                      <span className="item-number">{index + 1}</span>
                      <h4>{item.headline}</h4>
                      {(item.impact_level || item.risk_level) && (
                        <span className={`risk-badge risk-${(item.impact_level || item.risk_level).toLowerCase()}`}>
                          {(item.impact_level || item.risk_level).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="top-thing-summary">{item.summary}</p>
                    {item.cluster_reference && (
                      <div className="cluster-ref">Related: {item.cluster_reference}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Patterns */}
          {weeklyBrief.brief.new_patterns && weeklyBrief.brief.new_patterns.length > 0 && (
            <div className="brief-section">
              <h3>📈 New Patterns</h3>
              <div className="patterns-list">
                {weeklyBrief.brief.new_patterns.map((pattern, index) => (
                  <div key={index} className="pattern-card">
                    <div className="pattern-header">
                      <span className="pattern-text">{pattern.pattern}</span>
                      {(pattern.change_indicator || pattern.delta) && (
                        <span className="delta-badge">{pattern.change_indicator || pattern.delta}</span>
                      )}
                    </div>
                    <p className="pattern-significance">
                      {pattern.significance || pattern.why_it_matters}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Risks */}
          {weeklyBrief.brief.top_risks && weeklyBrief.brief.top_risks.length > 0 && (
            <div className="brief-section">
              <h3>⚠️ Top Risks</h3>
              <div className="risks-list">
                {weeklyBrief.brief.top_risks.map((risk, index) => (
                  <div key={index} className="risk-card">
                    <div className="risk-header">
                      {(risk.likelihood || risk.risk_level) && (
                        <span className={`risk-badge risk-${(risk.likelihood || risk.risk_level).toLowerCase()}`}>
                          {(risk.likelihood || risk.risk_level).toUpperCase()}
                        </span>
                      )}
                      <h4>{risk.risk}</h4>
                    </div>
                    {risk.affected_sectors && risk.affected_sectors.length > 0 && (
                      <div className="affected-sectors">
                        <span className="label">Affected sectors:</span>
                        {risk.affected_sectors.map((sector, i) => (
                          <span key={i} className="sector-tag">{sector}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watch Signals */}
          {weeklyBrief.brief.watch_signals && weeklyBrief.brief.watch_signals.length > 0 && (
            <div className="brief-section">
              <h3>🔔 Watch Signals</h3>
              <div className="signals-list">
                {weeklyBrief.brief.watch_signals.map((signal, index) => (
                  <div key={index} className="signal-card">
                    <div className="signal-metric">{signal.metric}</div>
                    <div className="signal-threshold">
                      <span className="label">Threshold:</span>
                      <span className="value">{signal.threshold}</span>
                    </div>
                    <div className="signal-action">
                      <span className="icon">→</span>
                      <span className="text">{signal.action || signal.action_if_triggered}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to format dates consistently
function formatDate(dateStr) {
  if (!dateStr) return '';
  // Parse ISO date string (YYYY-MM-DD) using date-fns to avoid timezone issues
  try {
    // For ISO date strings, create date at noon UTC to avoid timezone edge cases
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  } catch (e) {
    return dateStr;
  }
}

export default AIInsights;
