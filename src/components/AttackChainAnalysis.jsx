import { useMemo } from 'react';
import './AttackChainAnalysis.css';
import { getAttackChains } from '../utils/analyticsUtils';
import ConfidenceBadge from './ConfidenceBadge';
import { getAttackChainConfidence } from '../utils/confidenceRules';

/**
 * Attack Chain Reconstruction Component
 * Visualizes common multi-stage attack patterns
 * Enterprise feature: Shows Initial Access → Priv Esc → Persistence → Exfiltration
 */
function AttackChainAnalysis({ incidents, filters }) {
  const chainData = useMemo(() => {
    return getAttackChains(incidents, filters, 10);
  }, [incidents, filters]);

  if (!chainData.chains || chainData.chains.length === 0) {
    return (
      <div className="attack-chain-analysis">
        <div className="section-header">
          <h2>🔗 Attack Chain Reconstruction</h2>
          <p className="subtitle">Multi-stage attack patterns</p>
        </div>
        <div className="no-data">
          <p>No multi-stage attack chains detected in current dataset.</p>
          <p className="hint">Attack chains require incidents with 2+ MITRE tactics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attack-chain-analysis">
      <div className="section-header">
        <h2>🔗 Attack Chain Reconstruction</h2>
        <p className="subtitle">Most common attack paths in {new Date().getFullYear()}</p>
        
        {/* Confidence Badge - using centralized rules with raw numbers */}
        {(() => {
          // Rough estimate: unique incidents ≈ total items / average coverage ratio (typically 2-3x)
          const estimatedUniqueIncidents = Math.round(incidents.length / 2.5);
          const coveragePct = ((chainData.totalMultiStagedIncidents / estimatedUniqueIncidents) * 100);
          const confidence = getAttackChainConfidence(
            coveragePct,
            chainData.totalMultiStagedIncidents,
            estimatedUniqueIncidents
          );
          return (
            <div style={{ margin: '1rem 0' }}>
              <ConfidenceBadge 
                level={confidence.level}
                label="Attack chains"
                value={`${coveragePct.toFixed(1)}%`}
                tooltip={confidence.tooltip}
                size="sm"
              />
            </div>
          );
        })()}
        
        <div className="coverage-badge">
          ⚠️ Coverage: {chainData.totalMultiStagedIncidents} items ({((chainData.totalMultiStagedIncidents / incidents.length) * 100).toFixed(1)}% of total)
          <span className="coverage-note">Based on keyword-matched MITRE tactics. Interpret as media signals, not confirmed TTPs.</span>
        </div>
        <div className="explanation-box">
          <p className="explanation-text">
            <strong>What are attack chains?</strong> These are typical attack sequences reconstructed from MITRE ATT&CK tags in reported incidents. 
            They show how attackers progress from initial compromise to their final objective. Only multi-stage attacks are shown (incidents with 2+ different tactics).
          </p>
          <p className="explanation-example">
            <em>Example:</em> An attack might start with "Initial Access" (phishing), move to "Execution" (running malware), 
            establish "Persistence" (creating backdoors), and end with "Exfiltration" (stealing data).
          </p>
        </div>
        <div className="metadata">
          <span className="count-badge">
            {chainData.totalMultiStagedIncidents} multi-stage incidents
          </span>
          <span className="population-badge">
            Population: {chainData.population}
          </span>
        </div>
      </div>

      <div className="methodology-note">
        <strong>Methodology:</strong> Attack chains are reconstructed from incidents with multiple MITRE tactics, 
        ordered by typical attack progression (Initial Access → Execution → Persistence → etc.)
      </div>

      <div className="chains-container">
        {chainData.chains.map((chain, index) => (
          <div key={index} className="chain-card">
            <div className="chain-header">
              <span className="chain-rank">#{index + 1}</span>
              <span className="chain-count">{chain.count} incidents</span>
            </div>
            
            <div className="chain-flow">
              {chain.chain.map((tactic, tacticIndex) => (
                <div key={tacticIndex} className="chain-step">
                  <div className={`tactic-badge tactic-${tactic}`}>
                    {formatTacticName(tactic)}
                  </div>
                  {tacticIndex < chain.chain.length - 1 && (
                    <div className="chain-arrow">→</div>
                  )}
                </div>
              ))}
            </div>

            <div className="chain-examples">
              <details>
                <summary>View {chain.examples.length} example(s)</summary>
                <ul>
                  {chain.examples.map((example, exIndex) => (
                    <li key={exIndex}>
                      <span className="example-date">{example.date}</span>
                      <span className="example-title">{example.title}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        ))}
      </div>

      <div className="insights">
        <h3>📊 Key Insights</h3>
        <ul>
          <li>
            <strong>Top Attack Pattern:</strong> {chainData.chains[0].displayChain} 
            ({chainData.chains[0].count} incidents)
          </li>
          <li>
            <strong>Multi-Stage Rate:</strong> {Math.round((chainData.totalMultiStagedIncidents / incidents.length) * 100)}% 
            of incidents show complex, multi-stage attacks
          </li>
          {chainData.chains.length >= 3 && (
            <li>
              <strong>Pattern Diversity:</strong> {chainData.chains.length} distinct attack chains detected, 
              indicating varied adversary tactics
            </li>
          )}
        </ul>
      </div>

      <div className="ciso-note">
        <strong>🎯 CISO Takeaway:</strong> Multi-stage attacks require defense-in-depth. 
        Focus on early detection at Initial Access and Execution phases to disrupt attack chains.
      </div>
    </div>
  );
}

function formatTacticName(tactic) {
  return tactic.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export default AttackChainAnalysis;
