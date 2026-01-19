import { useMemo } from 'react';
import './SectorBenchmarking.css';
import { getSectorBenchmarks } from '../utils/analyticsUtils';

/**
 * Sector Benchmarking Component
 * CISO-level sector risk comparison
 * Shows "Energy sector has 2x higher critical rate than finance"
 */
function SectorBenchmarking({ incidents, filters }) {
  const benchmarkData = useMemo(() => {
    return getSectorBenchmarks(incidents, filters);
  }, [incidents, filters]);

  if (!benchmarkData.benchmarks || benchmarkData.benchmarks.length === 0) {
    return (
      <div className="sector-benchmarking">
        <div className="section-header">
          <h2>📊 Sector Benchmarking</h2>
          <p className="subtitle">Cross-sector risk comparison</p>
        </div>
        <div className="no-data">
          <p>Insufficient sector data for benchmarking.</p>
        </div>
      </div>
    );
  }

  // Calculate averages for comparison
  const avgCriticalRate = Math.round(
    benchmarkData.benchmarks.reduce((sum, b) => sum + b.criticalRate, 0) / 
    benchmarkData.benchmarks.length
  );
  const avgExploitLedRate = Math.round(
    benchmarkData.benchmarks.reduce((sum, b) => sum + b.exploitLedRate, 0) / 
    benchmarkData.benchmarks.length
  );

  return (
    <div className="sector-benchmarking">
      <div className="section-header">
        <h2>📊 Sector Benchmarking</h2>
        <p className="subtitle">Compare risk levels across sectors</p>
        <div className="metadata">
          <span className="count-badge">
            {benchmarkData.benchmarks.length} sectors analyzed
          </span>
          <span className="population-badge">
            Population: {benchmarkData.population}
          </span>
        </div>
      </div>

      <div className="methodology-note">
        <strong>Methodology:</strong> Sector KPIs calculated from unique incident data (deduplicated). 
        Enables strategic comparisons like "Energy has 2x higher critical rate than Finance."
        <br/><small><em>Count type: unique incidents per sector</em></small>
      </div>

      <div className="benchmark-grid">
        {benchmarkData.benchmarks.map((sector) => {
          const isHighRisk = sector.criticalRate > avgCriticalRate * 1.5;
          const isVeryHighExploit = sector.exploitLedRate > avgExploitLedRate * 1.5;

          return (
            <div 
              key={sector.sector} 
              className={`sector-card ${isHighRisk ? 'high-risk' : ''}`}
            >
              <div className="sector-header">
                <h3>{getSectorIcon(sector.sector)} {capitalizeFirst(sector.sector)}</h3>
                <span className="incident-count">{sector.totalIncidents} incidents</span>
              </div>

              <div className="kpi-grid">
                <div className="kpi-item">
                  <div className="kpi-label">Critical Rate</div>
                  <div className={`kpi-value ${sector.criticalRate > avgCriticalRate ? 'above-avg' : ''}`}>
                    {sector.criticalRate}%
                  </div>
                  <div className="kpi-comparison">
                    {getComparison(sector.criticalRate, avgCriticalRate)} avg
                  </div>
                </div>

                <div className="kpi-item">
                  <div className="kpi-label">Exploit-Led</div>
                  <div className={`kpi-value ${sector.exploitLedRate > avgExploitLedRate ? 'above-avg' : ''}`}>
                    {sector.exploitLedRate}%
                  </div>
                  <div className="kpi-comparison">
                    {getComparison(sector.exploitLedRate, avgExploitLedRate)} avg
                  </div>
                </div>

                <div className="kpi-item">
                  <div className="kpi-label">Attribution</div>
                  <div className="kpi-value">{sector.attributionRate}%</div>
                </div>

                <div className="kpi-item">
                  <div className="kpi-label">Avg Severity</div>
                  <div className="kpi-value">{sector.medianSeverity}/100</div>
                </div>
              </div>

              {(isHighRisk || isVeryHighExploit) && (
                <div className="risk-alert">
                  {isHighRisk && <span className="alert-badge">⚠️ High Critical Rate</span>}
                  {isVeryHighExploit && <span className="alert-badge">🎯 High Exploit Rate</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="insights">
        <h3>🎯 CISO Insights</h3>
        <ul>
          {getTopInsights(benchmarkData.benchmarks, avgCriticalRate)}
        </ul>
      </div>

      <div className="ciso-note">
        <strong>💼 Strategic Value:</strong> Use sector benchmarking to justify security investments, 
        demonstrate relative risk position, and prioritize defense strategies based on sector-specific threats.
      </div>
    </div>
  );
}

function getSectorIcon(sector) {
  const icons = {
    finance: '💰',
    healthcare: '🏥',
    energy: '⚡',
    government: '🏛️',
    education: '🎓',
    retail: '🛒',
    technology: '💻',
    manufacturing: '🏭',
    telecom: '📡',
    transportation: '🚚'
  };
  return icons[sector] || '🏢';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getComparison(value, avg) {
  // Handle invalid or zero averages
  if (!Number.isFinite(value) || !Number.isFinite(avg) || avg === 0) {
    return '—';
  }
  
  const diff = ((value - avg) / avg) * 100;
  if (Math.abs(diff) < 10) return '≈';
  if (diff > 0) return `${Math.round(diff)}% ↑`;
  return `${Math.abs(Math.round(diff))}% ↓`;
}

function getTopInsights(benchmarks, avgCritical) {
  const insights = [];

  // Highest critical rate
  const highestCritical = benchmarks.reduce((max, b) => 
    b.criticalRate > max.criticalRate ? b : max
  );
  
  // Check if all sectors have 0% critical rate
  if (highestCritical.criticalRate === 0 && avgCritical === 0) {
    insights.push(
      <li key="critical">
        No sectors recorded critical incidents in this period.
      </li>
    );
  } else {
    const multiplier = avgCritical > 0 
      ? Math.round(highestCritical.criticalRate / avgCritical * 10) / 10 
      : '—';
    insights.push(
      <li key="critical">
        <strong>{capitalizeFirst(highestCritical.sector)}</strong> has the highest critical incident rate 
        at {highestCritical.criticalRate}% {multiplier !== '—' ? `(${multiplier}x average)` : ''}
      </li>
    );
  }

  // Highest exploit-led rate
  const highestExploit = benchmarks.reduce((max, b) => 
    b.exploitLedRate > max.exploitLedRate ? b : max
  );
  if (highestExploit.sector !== highestCritical.sector) {
    insights.push(
      <li key="exploit">
        <strong>{capitalizeFirst(highestExploit.sector)}</strong> faces the most exploit-led attacks 
        at {highestExploit.exploitLedRate}%
      </li>
    );
  }

  // Best attribution
  const bestAttribution = benchmarks.reduce((max, b) => 
    b.attributionRate > max.attributionRate ? b : max
  );
  insights.push(
    <li key="attribution">
      <strong>{capitalizeFirst(bestAttribution.sector)}</strong> has the best threat actor attribution 
      rate at {bestAttribution.attributionRate}%
    </li>
  );

  return insights;
}

export default SectorBenchmarking;
