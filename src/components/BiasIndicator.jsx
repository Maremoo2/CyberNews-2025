import { useMemo } from 'react';
import './BiasIndicator.css';

function BiasIndicator({ incidents }) {
  const biasMetrics = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return null;
    }

    // Source distribution
    const sourceCounts = {};
    const regionCounts = {};
    const languageCounts = { 'English': 0, 'Other': 0 };
    
    incidents.forEach(incident => {
      // Count sources
      const source = incident.sourceName || 'Unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      
      // Count regions
      const region = incident.region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
      
      // Estimate language (simplified - could be enhanced)
      const isEnglish = !incident.title.match(/[æøåÆØÅäöüßñçéè]/);
      if (isEnglish) {
        languageCounts['English']++;
      } else {
        languageCounts['Other']++;
      }
    });

    // Get top sources
    const topSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({
        source,
        count,
        percentage: ((count / incidents.length) * 100).toFixed(1)
      }));

    // Calculate region bias
    const regionPercentages = Object.entries(regionCounts)
      .map(([region, count]) => ({
        region,
        count,
        percentage: ((count / incidents.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);

    // Language distribution
    const languagePercentages = Object.entries(languageCounts)
      .map(([language, count]) => ({
        language,
        count,
        percentage: ((count / incidents.length) * 100).toFixed(1)
      }));

    // Detect biases
    const biases = [];
    
    // Check for US dominance
    const usPercentage = regionPercentages.find(r => r.region === 'US')?.percentage || 0;
    if (usPercentage > 50) {
      biases.push({
        type: 'regional',
        severity: 'high',
        message: `${usPercentage}% of data from US sources - significant Western bias`
      });
    }

    // Check for source concentration
    if (topSources.length > 0 && topSources[0].percentage > 30) {
      biases.push({
        type: 'source',
        severity: 'medium',
        message: `${topSources[0].percentage}% from single source (${topSources[0].source}) - source concentration risk`
      });
    }

    // Check for language bias
    const englishPercentage = languagePercentages.find(l => l.language === 'English')?.percentage || 0;
    if (englishPercentage > 80) {
      biases.push({
        type: 'language',
        severity: 'medium',
        message: `${englishPercentage}% English content - potential language bias`
      });
    }

    return {
      topSources,
      regionPercentages,
      languagePercentages,
      biases,
      totalIncidents: incidents.length
    };
  }, [incidents]);

  if (!biasMetrics) {
    return null;
  }

  const getBiasSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#84cc16';
      default: return '#64748b';
    }
  };

  return (
    <div className="bias-indicator">
      <div className="bias-header">
        <h3>⚖️ Bias Indicator</h3>
        <p className="bias-description">
          Understanding data limitations and potential biases in our threat intelligence
        </p>
      </div>

      {/* Detected Biases */}
      {biasMetrics.biases.length > 0 && (
        <div className="bias-alerts">
          <h4>🔍 Detected Biases</h4>
          <div className="bias-alert-list">
            {biasMetrics.biases.map((bias, index) => (
              <div 
                key={index} 
                className="bias-alert"
                style={{ borderLeftColor: getBiasSeverityColor(bias.severity) }}
              >
                <span className="bias-type-badge" style={{ background: getBiasSeverityColor(bias.severity) }}>
                  {bias.type}
                </span>
                <span className="bias-message">{bias.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bias-metrics-grid">
        {/* Source Distribution */}
        <div className="bias-metric-card">
          <h4>📊 Top Sources</h4>
          <div className="metric-list">
            {biasMetrics.topSources.map((source, index) => (
              <div key={index} className="metric-item">
                <div className="metric-label">
                  <span className="metric-rank">#{index + 1}</span>
                  <span className="metric-name">{source.source}</span>
                </div>
                <div className="metric-value">
                  <span className="metric-percentage">{source.percentage}%</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-bar-fill"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region Distribution */}
        <div className="bias-metric-card">
          <h4>🌍 Regional Distribution</h4>
          <div className="metric-list">
            {biasMetrics.regionPercentages.map((region, index) => (
              <div key={index} className="metric-item">
                <div className="metric-label">
                  <span className="metric-name">{region.region}</span>
                </div>
                <div className="metric-value">
                  <span className="metric-percentage">{region.percentage}%</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-bar-fill"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bias-metric-card">
          <h4>🗣️ Language Distribution</h4>
          <div className="metric-list">
            {biasMetrics.languagePercentages.map((lang, index) => (
              <div key={index} className="metric-item">
                <div className="metric-label">
                  <span className="metric-name">{lang.language}</span>
                </div>
                <div className="metric-value">
                  <span className="metric-percentage">{lang.percentage}%</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-bar-fill"
                      style={{ width: `${lang.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bias-explanation">
        <h4>💡 Why This Matters</h4>
        <div className="explanation-grid">
          <div className="explanation-item">
            <span className="explanation-icon">🌐</span>
            <div>
              <strong>Geographic Bias</strong>
              <p>High concentration from specific regions means incidents from other areas may be underreported</p>
            </div>
          </div>
          <div className="explanation-item">
            <span className="explanation-icon">📰</span>
            <div>
              <strong>Source Concentration</strong>
              <p>Reliance on few sources creates blind spots and editorial bias</p>
            </div>
          </div>
          <div className="explanation-item">
            <span className="explanation-icon">🗣️</span>
            <div>
              <strong>Language Barrier</strong>
              <p>English-dominated sources miss incidents reported in other languages</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bias-footer">
        <p>
          <strong>Transparency Note:</strong> These metrics help you understand the limitations 
          of our data collection. Use this context when interpreting trends and making decisions.
        </p>
      </div>
    </div>
  );
}

export default BiasIndicator;
