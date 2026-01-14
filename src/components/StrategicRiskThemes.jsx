import { useMemo } from 'react';
import { getTopThemes, calculateKPIs } from '../utils/analyticsUtils';
import { filterToIncidentsOnly } from '../utils/populationUtils';
import './StrategicRiskThemes.css';

// Common sector tags used across the application
const SECTOR_TAGS = ['healthcare', 'finance', 'government', 'technology', 'education', 'retail', 'energy'];

// Theme descriptions and recommendations
const THEME_DETAILS = {
  'cloud-exfiltration': {
    icon: '☁️',
    whatItMeans: 'Attackers increasingly use legitimate cloud services to exfiltrate stolen data, blending with normal business traffic and evading traditional data loss prevention controls.',
    defensivePriorities: [
      'Implement Cloud Access Security Broker (CASB) solutions',
      'Monitor anomalous data uploads to cloud storage services',
      'Enforce data classification and encryption at rest'
    ]
  },
  'exploit-led': {
    icon: '🎯',
    whatItMeans: 'Initial access through exploitation of internet-facing vulnerabilities remains the most common attack vector, with attackers rapidly weaponizing disclosed CVEs.',
    defensivePriorities: [
      'Maintain aggressive patch management for internet-facing systems',
      'Implement virtual patching and web application firewalls',
      'Reduce attack surface by minimizing exposed services'
    ]
  },
  'identity-abuse': {
    icon: '🔑',
    whatItMeans: 'Compromised credentials and valid account abuse allow attackers to operate within normal access patterns, making detection extremely difficult.',
    defensivePriorities: [
      'Deploy phishing-resistant MFA across all critical systems',
      'Implement privileged access management (PAM) solutions',
      'Monitor for impossible travel and anomalous authentication patterns'
    ]
  },
  'ransomware-economy': {
    icon: '💰',
    whatItMeans: 'Ransomware operations have evolved into a sophisticated economy with specialized roles, including initial access brokers, ransomware operators, and data leak sites.',
    defensivePriorities: [
      'Implement immutable backups with offline copies',
      'Deploy endpoint detection and response (EDR) solutions',
      'Conduct ransomware-specific incident response exercises'
    ]
  },
  'supply-chain': {
    icon: '🔗',
    whatItMeans: 'Attackers target less-secured vendors and service providers to gain access to multiple downstream victims, amplifying impact across entire ecosystems.',
    defensivePriorities: [
      'Implement third-party risk management programs',
      'Require security attestations from critical vendors',
      'Monitor supply chain for compromised components'
    ]
  },
  'disinformation': {
    icon: '🎭',
    whatItMeans: 'AI-generated deepfakes and coordinated disinformation campaigns target organizations for reputation damage, stock manipulation, and psychological operations.',
    defensivePriorities: [
      'Establish executive impersonation detection procedures',
      'Train employees on deepfake and social engineering tactics',
      'Implement out-of-band verification for critical communications'
    ]
  },
  'botnet-ddos': {
    icon: '🤖',
    whatItMeans: 'Large-scale botnets enable sustained DDoS attacks and credential stuffing campaigns that can overwhelm even well-defended targets.',
    defensivePriorities: [
      'Deploy DDoS mitigation services with global scrubbing capacity',
      'Implement rate limiting and bot detection',
      'Monitor for credential stuffing patterns'
    ]
  },
  'mobile-spyware': {
    icon: '📱',
    whatItMeans: 'Commercial spyware and mobile malware ecosystems target high-value individuals and organizations through compromised mobile devices.',
    defensivePriorities: [
      'Deploy mobile device management (MDM) and mobile threat defense',
      'Segment corporate networks from BYOD devices',
      'Monitor for mobile-specific indicators of compromise'
    ]
  },
  'ot-critical': {
    icon: '⚙️',
    whatItMeans: 'Operational technology and critical infrastructure face increasing cyber threats with potential for physical damage and public safety impacts.',
    defensivePriorities: [
      'Implement OT-specific security monitoring and segmentation',
      'Maintain air-gapped backups of control system configurations',
      'Conduct OT-focused threat modeling and red team exercises'
    ]
  },
  'regulatory-pressure': {
    icon: '⚖️',
    whatItMeans: 'Increasing regulatory requirements drive mandatory disclosure and reporting, changing how organizations respond to and communicate about incidents.',
    defensivePriorities: [
      'Establish incident response playbooks with regulatory timelines',
      'Implement continuous compliance monitoring',
      'Prepare legal and communications teams for mandatory disclosure'
    ]
  }
};

function StrategicRiskThemes({ incidents, selectedYear, filters }) {
  const analysis = useMemo(() => {
    if (!incidents || incidents.length === 0) return null;

    // Strategic risk analysis should focus on incidents only
    const incidentsOnly = filterToIncidentsOnly(incidents);

    // Get top 5 themes
    const topThemes = getTopThemes(incidentsOnly, filters, 5);
    
    // Calculate KPIs
    const kpis = calculateKPIs(incidentsOnly, filters);

    // For each theme, gather detailed analytics
    const themeDetails = topThemes.themes.map(theme => {
      const themeIncidents = incidentsOnly.filter(i => 
        i.themes?.some(t => t.id === theme.id)
      );

      // Most affected sectors for this theme
      const sectorCounts = {};
      themeIncidents.forEach(incident => {
        incident.tags?.forEach(tag => {
          if (SECTOR_TAGS.includes(tag.toLowerCase())) {
            sectorCounts[tag] = (sectorCounts[tag] || 0) + 1;
          }
        });
      });
      const topSectors = Object.entries(sectorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([sector]) => sector);

      // Common initial access for this theme
      const initialAccessTechniques = {};
      themeIncidents.forEach(incident => {
        if (incident.mitre_techniques && incident.mitre_tactics?.includes('initial-access')) {
          incident.mitre_techniques.forEach(t => {
            const name = t.name;
            initialAccessTechniques[name] = (initialAccessTechniques[name] || 0) + 1;
          });
        }
      });
      const commonInitialAccess = Object.entries(initialAccessTechniques)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name);

      // Common impacts
      const impactTypes = {
        'service-disruption': themeIncidents.filter(i => i.severity_drivers?.some(d => d.includes('Service disruption'))).length,
        'data-exposure': themeIncidents.filter(i => i.severity_drivers?.some(d => d.includes('data exposure'))).length,
        'critical-infra': themeIncidents.filter(i => i.severity_drivers?.some(d => d.includes('Critical infrastructure'))).length
      };
      const commonImpact = Object.entries(impactTypes)
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 1)
        .map(([type]) => type.replace('-', ' '))[0] || 'Various impacts';

      // Calculate year-over-year if we have 2025 data
      let yoyChange = null;
      // YoY calculation would require comparing with previous year's data
      // Removed placeholder random value - should be calculated from actual historical data
      if (selectedYear === 2026) {
        // TODO: Calculate actual YoY when historical comparison is implemented
        yoyChange = null;
      }

      return {
        ...theme,
        ...THEME_DETAILS[theme.id],
        themeIncidents: themeIncidents.length,
        topSectors,
        commonInitialAccess,
        commonImpact,
        yoyChange
      };
    });

    return {
      themes: themeDetails,
      kpis,
      totalIncidents: incidentsOnly.length
    };
  }, [incidents, selectedYear, filters]);

  if (!analysis) return null;

  return (
    <section className="strategic-themes-section" aria-label="Strategic Risk Themes">
      <div className="themes-header">
        <h2>🎯 Strategic Risk Themes {selectedYear}</h2>
        <p className="themes-subtitle">
          Top 5 strategic risks based on {analysis.totalIncidents} incidents
        </p>
        <div className="themes-note">
          <strong>Count type: unique incidents</strong> - Each incident mapped to up to 3 themes with confidence scoring
        </div>
      </div>

      <div className="themes-grid">
        {analysis.themes.map((theme, index) => (
          <div key={theme.id} className="theme-card" data-rank={index + 1}>
            <div className="theme-header">
              <div className="theme-rank">#{index + 1}</div>
              <div className="theme-icon">{theme.icon}</div>
              <h3 className="theme-name">{theme.name}</h3>
            </div>

            <div className="theme-stats">
              <div className="theme-stat">
                <span className="stat-value">{theme.uniqueIncidents}</span>
                <span className="stat-label">incidents</span>
              </div>
              {theme.yoyChange && (
                <div className="theme-stat trend-up">
                  <span className="stat-value">+{theme.yoyChange}%</span>
                  <span className="stat-label">YoY</span>
                </div>
              )}
              <div className="theme-stat">
                <span className="stat-value">{theme.mentions}</span>
                <span className="stat-label">mentions</span>
              </div>
            </div>

            <div className="theme-details">
              <div className="theme-section">
                <h4>📊 Most Affected Sectors</h4>
                <div className="theme-tags">
                  {theme.topSectors.length > 0 ? (
                    theme.topSectors.map(sector => (
                      <span key={sector} className="theme-tag sector-tag">
                        {sector}
                      </span>
                    ))
                  ) : (
                    <span className="theme-tag">Various sectors</span>
                  )}
                </div>
              </div>

              <div className="theme-section">
                <h4>🚪 Common Initial Access</h4>
                <div className="theme-tags">
                  {theme.commonInitialAccess.length > 0 ? (
                    theme.commonInitialAccess.map(technique => (
                      <span key={technique} className="theme-tag technique-tag">
                        {technique}
                      </span>
                    ))
                  ) : (
                    <span className="theme-tag">Various techniques</span>
                  )}
                </div>
              </div>

              <div className="theme-section">
                <h4>💥 Common Impact</h4>
                <p className="theme-impact">{theme.commonImpact}</p>
              </div>

              <div className="theme-section what-it-means">
                <h4>💡 What It Means</h4>
                <p>{theme.whatItMeans}</p>
              </div>

              <div className="theme-section defensive-priorities">
                <h4>🛡️ Defensive Priorities</h4>
                <ol className="priorities-list">
                  {theme.defensivePriorities.map((priority, idx) => (
                    <li key={idx}>{priority}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="themes-footer">
        <div className="kpi-summary">
          <h3>Key Risk Indicators</h3>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-value">{analysis.kpis.criticalRate}%</span>
              <span className="kpi-label">Critical Rate</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-value">{analysis.kpis.exploitLedRate}%</span>
              <span className="kpi-label">Exploit-Led</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-value">{analysis.kpis.attributionRate}%</span>
              <span className="kpi-label">Attribution Rate</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-value">{analysis.kpis.curatedCoverage}%</span>
              <span className="kpi-label">Curated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StrategicRiskThemes;
