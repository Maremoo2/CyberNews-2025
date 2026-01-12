import { useState } from 'react';
import './MethodologyAndLimitations.css'

function MethodologyAndLimitations() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="methodology-section" id="methodology" aria-label="Methodology and Limitations">
      <div className="methodology-header">
        <h2>📋 Methodology & Limitations</h2>
        <p className="methodology-subtitle">
          Understanding how this analysis is conducted and its inherent limitations
        </p>
        <button 
          className="methodology-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▼ Hide methodology' : '▶ Show methodology'}
        </button>
      </div>

      {isExpanded && (
      <div className="methodology-content">
        {/* Data Sources */}
        <div className="methodology-card">
          <h3>📊 Data Sources</h3>
          <ul>
            <li><strong>Primary Sources:</strong> Automated aggregation from curated RSS feeds including cybersecurity news outlets, vendor reports, and industry publications</li>
            <li><strong>Coverage:</strong> Focus on publicly disclosed incidents with verifiable sources</li>
            <li><strong>Geographic Scope:</strong> Global coverage with regional classification (US, EU, Asia, Norway)</li>
            <li><strong>Time Period:</strong> Continuous collection since 2025</li>
          </ul>
        </div>

        {/* Counting Rules */}
        <div className="methodology-card">
          <h3>🔢 Counting Rules</h3>
          <div className="counting-explanation">
            <div className="counting-type">
              <h4>Unique Incidents (Default)</h4>
              <p>
                <span className="count-badge unique">Count type: unique incidents</span>
              </p>
              <p className="count-description">
                Each incident is counted once, deduplicated by incident_id. This is the default counting method used in the Executive Summary and for all primary statistics.
              </p>
            </div>
            <div className="counting-type">
              <h4>Tag/Sector Mentions</h4>
              <p>
                <span className="count-badge mentions">Count type: tag mentions</span>
              </p>
              <p className="count-description">
                When analyzing tags, sectors, or themes, counts represent mentions. Since a single incident can have multiple tags, sector totals may exceed the total number of unique incidents. This is explicitly indicated with labels.
              </p>
            </div>
          </div>
          <div className="counting-note">
            <strong>Important:</strong> Counts are always labeled with their type. Look for "unique incidents" vs "tag mentions" indicators throughout the dashboard.
          </div>
        </div>

        {/* Deduplication Strategy */}
        <div className="methodology-card">
          <h3>🔄 Deduplication Strategy</h3>
          <ul>
            <li><strong>Unique Key:</strong> Each incident has a unique incident_id (e.g., 20261647)</li>
            <li><strong>URL Matching:</strong> Articles with identical URLs are considered duplicates</li>
            <li><strong>Same-Day Events:</strong> Multiple reports of the same incident on the same day are consolidated</li>
            <li><strong>Cross-Reference:</strong> Manual verification for high-impact incidents</li>
          </ul>
        </div>

        {/* Severity Scoring */}
        <div className="methodology-card">
          <h3>⚖️ Severity Scoring (0-100 Points)</h3>
          <p className="scoring-intro">
            Transparent, rule-based scoring system with explainable drivers:
          </p>
          <div className="scoring-breakdown">
            <div className="scoring-category">
              <h4>Impact Factors (0-40 points)</h4>
              <ul>
                <li>Service disruption/outage: <strong>+15 points</strong></li>
                <li>Sensitive data exposure (PII/health/finance): <strong>+15 points</strong></li>
                <li>Critical infrastructure/OT impact: <strong>+20 points</strong></li>
                <li>Large scale (millions affected): <strong>+10 points</strong></li>
              </ul>
            </div>
            <div className="scoring-category">
              <h4>Exploitability (0-30 points)</h4>
              <ul>
                <li>Confirmed exploited in the wild: <strong>+20 points</strong></li>
                <li>Zero-day (unclaimed/credible): <strong>+15 points</strong></li>
                <li>Internet-facing vector: <strong>+10 points</strong></li>
              </ul>
            </div>
            <div className="scoring-category">
              <h4>Adversary (0-15 points)</h4>
              <ul>
                <li>Nation-state attribution: <strong>+15 points</strong></li>
                <li>Known ransomware group: <strong>+10 points</strong></li>
                <li>Unknown/opportunistic: <strong>+0 points</strong></li>
              </ul>
            </div>
            <div className="scoring-category">
              <h4>Confidence Modifier (-15 to +15 points)</h4>
              <ul>
                <li>Curated multi-source confirmation: <strong>+10 points</strong></li>
                <li>Single low-quality source: <strong>-10 points</strong></li>
                <li>Speculation only: <strong>-15 points</strong></li>
              </ul>
            </div>
          </div>
          <div className="severity-labels">
            <h4>Severity Labels</h4>
            <ul>
              <li><span className="severity-badge critical">Critical</span> ≥ 80 points</li>
              <li><span className="severity-badge high">High</span> 60-79 points</li>
              <li><span className="severity-badge moderate">Moderate</span> 25-59 points</li>
              <li><span className="severity-badge low">Low</span> &lt; 25 points</li>
            </ul>
          </div>
        </div>

        {/* MITRE ATT&CK Mapping */}
        <div className="methodology-card">
          <h3>🎯 MITRE ATT&CK Mapping</h3>
          <p className="mitre-intro">
            Rule-based keyword and context matching with confidence scoring:
          </p>
          <ul>
            <li><strong>Two-Signal Rule:</strong> Requires multiple keyword matches for technique mapping (e.g., T1567 requires both "exfiltrate/upload" AND a cloud provider mention)</li>
            <li><strong>Confidence Levels:</strong>
              <ul>
                <li><strong>High:</strong> CVE + clear attack chain + technique keywords</li>
                <li><strong>Medium:</strong> Technique implied from context</li>
                <li><strong>Low:</strong> Single buzzword match only</li>
              </ul>
            </li>
            <li><strong>Tactic Derivation:</strong> Tactics are automatically derived from technique IDs (not separately parsed)</li>
            <li><strong>Operational Use:</strong> Filter to "high confidence only" for threat hunting and incident response</li>
          </ul>
          <div className="mitre-note">
            <strong>Note:</strong> MITRE mappings are generated automatically and should be used as directional insight. Always validate through your own threat intelligence and incident analysis.
          </div>
        </div>

        {/* Threat Actor Attribution */}
        <div className="methodology-card">
          <h3>👤 Threat Actor Attribution</h3>
          <ul>
            <li><strong>Actor Categories:</strong> Nation-state, Cybercriminal, Hacktivist, Unknown</li>
            <li><strong>Attribution Confidence:</strong>
              <ul>
                <li><strong>High:</strong> Multiple credible sources name specific actor group</li>
                <li><strong>Medium:</strong> Single source or "suspected" attribution</li>
                <li><strong>Low:</strong> Weak indicators or unattributed</li>
              </ul>
            </li>
            <li><strong>Attribution Rate:</strong> Percentage of incidents with confident actor identification</li>
            <li><strong>Important:</strong> Attribution is based on public reporting and is often uncertain or intentionally misleading</li>
          </ul>
        </div>

        {/* Strategic Themes */}
        <div className="methodology-card">
          <h3>🎨 Strategic Themes</h3>
          <p>
            Incidents are mapped to 8-12 strategic risk themes based on keywords and required signals:
          </p>
          <ul>
            <li>Cloud Exfiltration & SaaS Abuse</li>
            <li>Exploit-Led Intrusions</li>
            <li>Identity & Token Abuse</li>
            <li>Ransomware & Extortion Economy</li>
            <li>Supply Chain & Third-Party Compromise</li>
            <li>Disinformation & Deepfakes</li>
            <li>Botnets, DDoS & Commodity Malware</li>
            <li>Mobile/Android & Spyware Ecosystem</li>
            <li>OT/ICS & Critical Infrastructure</li>
            <li>Regulatory & Disclosure Pressure</li>
          </ul>
          <div className="theme-note">
            <strong>Theme Assignment:</strong> Each incident can have up to 3 themes maximum to maintain analytical focus. Themes include confidence scoring (high/medium/low).
          </div>
        </div>

        {/* Content Classification */}
        <div className="methodology-card">
          <h3>📰 Content Type Classification</h3>
          <p>
            Articles are classified to distinguish signal from noise:
          </p>
          <ul>
            <li><strong>Incident:</strong> Actual security breach, attack, or compromise</li>
            <li><strong>Vulnerability:</strong> CVE disclosures, zero-days, patches</li>
            <li><strong>Policy:</strong> Regulations, laws, compliance requirements</li>
            <li><strong>Opinion:</strong> Editorial content and commentary</li>
            <li><strong>Prediction:</strong> Future forecasts and trend predictions</li>
            <li><strong>Research:</strong> Security research, studies, whitepapers</li>
            <li><strong>Product:</strong> Product announcements and tool releases</li>
            <li><strong>Court/Regulation:</strong> Legal proceedings and settlements</li>
          </ul>
          <div className="content-note">
            <strong>Default View:</strong> Dashboards default to showing "Incident" and "Vulnerability" types for situational awareness. Use filters to include other types.
          </div>
        </div>

        {/* Known Limitations & Biases */}
        <div className="methodology-card limitations-card">
          <h3>⚠️ Known Limitations & Biases</h3>
          <div className="limitations-list">
            <div className="limitation-item">
              <h4>1. Media Bias</h4>
              <p>English-language and Western-centric news sources predominate. Incidents in regions with less English-language reporting may be underrepresented.</p>
            </div>
            <div className="limitation-item">
              <h4>2. Underreporting</h4>
              <p>Many incidents are never publicly disclosed due to legal, contractual, or reputational concerns. Actual incident volumes are significantly higher than reported.</p>
            </div>
            <div className="limitation-item">
              <h4>3. Survivorship Bias</h4>
              <p>Only incidents that are detected and disclosed are included. Undetected breaches and ongoing compromises are invisible in this data.</p>
            </div>
            <div className="limitation-item">
              <h4>4. Disclosure Lag</h4>
              <p>Incidents may be disclosed months or years after occurrence, skewing temporal analysis.</p>
            </div>
            <div className="limitation-item">
              <h4>5. Attribution Uncertainty</h4>
              <p>Threat actor attribution is difficult and often based on incomplete information. Misattribution and false flags are common.</p>
            </div>
            <div className="limitation-item">
              <h4>6. Sector Classification</h4>
              <p>Multi-sector organizations may be classified inconsistently. Supply chain incidents affect multiple sectors simultaneously.</p>
            </div>
            <div className="limitation-item">
              <h4>7. Impact Assessment</h4>
              <p>True impact is often unknown at the time of reporting and may be minimized by affected organizations.</p>
            </div>
          </div>
        </div>

        {/* Data Quality Indicators */}
        <div className="methodology-card">
          <h3>✅ Data Quality Indicators</h3>
          <ul>
            <li><strong>is_curated:</strong> Indicates higher quality incidents with multiple enrichment signals (severity ≥ 25, MITRE mappings, themes)</li>
            <li><strong>confidence:</strong> Overall confidence score (0-100) based on enrichment quality</li>
            <li><strong>Curated Coverage:</strong> Percentage of incidents meeting curation standards</li>
          </ul>
          <div className="quality-note">
            <strong>Recommendation:</strong> For critical decision-making, filter to "Curated Only" incidents or use high-confidence filters for MITRE and attribution data.
          </div>
        </div>

        {/* How to Use This Data */}
        <div className="methodology-card usage-card">
          <h3>💡 How to Use This Data</h3>
          <div className="usage-guidance">
            <div className="usage-do">
              <h4>✅ Do</h4>
              <ul>
                <li>Use as directional intelligence for threat landscape awareness</li>
                <li>Identify emerging trends and attack patterns</li>
                <li>Benchmark your organization against industry threats</li>
                <li>Guide security investment and control prioritization</li>
                <li>Cross-reference with your own threat intelligence</li>
                <li>Filter to "Curated" or "High Confidence" for operational use</li>
              </ul>
            </div>
            <div className="usage-dont">
              <h4>❌ Don't</h4>
              <ul>
                <li>Treat as comprehensive or authoritative incident data</li>
                <li>Use raw counts for precise risk quantification</li>
                <li>Assume attribution is always accurate</li>
                <li>Ignore your organization's specific threat model</li>
                <li>Make critical security decisions based solely on this data</li>
                <li>Compare absolute counts across different time periods without considering reporting bias</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

export default MethodologyAndLimitations;
