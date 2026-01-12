import { useMemo } from 'react'
import './DefenseAnalysis.css'

function DefenseAnalysis({ incidents, selectedYear }) {
  const analysis = useMemo(() => {
    if (!incidents || incidents.length === 0) return null

    // Analyze what defense mechanisms were mentioned in public reporting
    const defenseKeywords = {
      'detection': {
        keywords: ['detected', 'discovered', 'identified', 'found', 'spotted', 'noticed'],
        count: 0,
        icon: '🔍'
      },
      'prevention': {
        keywords: ['prevented', 'blocked', 'stopped', 'thwarted', 'mitigated'],
        count: 0,
        icon: '🛡️'
      },
      'patched': {
        keywords: ['patched', 'fixed', 'updated', 'remediated', 'secured'],
        count: 0,
        icon: '🔧'
      },
      'response': {
        keywords: ['responded', 'contained', 'isolated', 'recovered', 'restored'],
        count: 0,
        icon: '⚡'
      }
    }

    const failureKeywords = {
      'unpatched': {
        keywords: ['unpatched', 'outdated', 'legacy', 'end-of-life', 'eol', 'unsupported'],
        count: 0,
        icon: '⚠️'
      },
      'misconfiguration': {
        keywords: ['misconfigured', 'misconfiguration', 'exposed', 'unsecured', 'default-credentials'],
        count: 0,
        icon: '🔓'
      },
      'no-mfa': {
        keywords: ['no-mfa', 'weak-password', 'password', 'credential-stuffing', 'brute-force'],
        count: 0,
        icon: '🔑'
      },
      'delayed-response': {
        keywords: ['delayed', 'undetected', 'months', 'years', 'dwell-time'],
        count: 0,
        icon: '⏱️'
      }
    }

    // Tools and technologies mentioned
    const securityTools = {
      'EDR/XDR': ['edr', 'xdr', 'endpoint', 'crowdstrike', 'sentinelone', 'defender'],
      'SIEM': ['siem', 'splunk', 'sentinel', 'elastic'],
      'Firewall': ['firewall', 'waf', 'web-application-firewall'],
      'MDR': ['mdr', 'managed-detection'],
      'SOC': ['soc', 'security-operations']
    }

    const toolMentions = {}
    Object.keys(securityTools).forEach(tool => {
      toolMentions[tool] = 0
    })

    incidents.forEach(incident => {
      const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase()

      // Count defense successes
      Object.values(defenseKeywords).forEach(defense => {
        if (defense.keywords.some(keyword => text.includes(keyword))) {
          defense.count++
        }
      })

      // Count defense failures
      Object.values(failureKeywords).forEach(failure => {
        if (failure.keywords.some(keyword => text.includes(keyword))) {
          failure.count++
        }
      })

      // Count tool mentions
      Object.entries(securityTools).forEach(([tool, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
          toolMentions[tool]++
        }
      })
    })

    const successfulDefenses = Object.entries(defenseKeywords)
      .map(([key, data]) => ({ name: key, ...data }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.count - a.count)

    const commonFailures = Object.entries(failureKeywords)
      .map(([key, data]) => ({ name: key, ...data }))
      .filter(f => f.count > 0)
      .sort((a, b) => b.count - a.count)

    const topTools = Object.entries(toolMentions)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return {
      successfulDefenses,
      commonFailures,
      topTools,
      totalIncidents: incidents.length
    }
  }, [incidents])

  if (!analysis) return null

  return (
    <section className="defense-analysis" aria-label="Defense Analysis">
      <div className="defense-header">
        <h2>🛡️ Defense Effectiveness Analysis</h2>
        <p className="defense-subtitle">
          Most cited defensive successes and failures from {analysis.totalIncidents} incidents
        </p>
        <div className="methodology-disclaimer">
          <strong>⚠️ Important Methodology Note:</strong> This analysis is based on public reporting mentions and does not represent true success rates. 
          Successful defenses that prevent breaches are rarely reported, while failures that lead to incidents are overrepresented in the data.
        </div>
      </div>

      <div className="defense-intro">
        <p>
          Understanding both cited defensive successes and common failure patterns is critical for improving security posture. 
          This analysis examines what public incident reports mention as detection capabilities, prevention successes, and the most common security gaps 
          that led to successful attacks in {selectedYear}.
        </p>
      </div>

      <div className="defense-grid">
        {/* What Worked */}
        <div className="defense-section success-section">
          <h3>✅ Most Cited Defensive Successes</h3>
          <div className="count-note">
            <small>Count type: <strong>tag mentions</strong> (derived from incident reporting)</small>
          </div>
          {analysis.successfulDefenses.length > 0 ? (
            <div className="defense-items">
              {analysis.successfulDefenses.map((defense) => (
                <div key={defense.name} className="defense-item success-item">
                  <span className="defense-icon">{defense.icon}</span>
                  <div className="defense-content">
                    <h4>{formatDefenseName(defense.name)}</h4>
                    <p className="defense-count">{defense.count} incidents</p>
                    <p className="defense-description">{getDefenseDescription(defense.name)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Limited data on successful defenses</p>
          )}
        </div>

        {/* What Failed */}
        <div className="defense-section failure-section">
          <h3>❌ Most Cited Contributing Failures</h3>
          <div className="count-note">
            <small>Count type: <strong>tag mentions</strong> (derived from incident reporting)</small>
          </div>
          {analysis.commonFailures.length > 0 ? (
            <div className="defense-items">
              {analysis.commonFailures.map((failure) => (
                <div key={failure.name} className="defense-item failure-item">
                  <span className="defense-icon">{failure.icon}</span>
                  <div className="defense-content">
                    <h4>{formatFailureName(failure.name)}</h4>
                    <p className="defense-count">{failure.count} incidents</p>
                    <p className="defense-description">{getFailureDescription(failure.name)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Limited data on failure patterns</p>
          )}
        </div>
      </div>

      {/* Security Tools */}
      {analysis.topTools.length > 0 && (
        <div className="tools-section">
          <h3>🔧 Security Technologies Mentioned</h3>
          <div className="tools-grid">
            {analysis.topTools.map(([tool, count]) => (
              <div key={tool} className="tool-card">
                <h4>{tool}</h4>
                <p className="tool-count">Mentioned in {count} incidents</p>
              </div>
            ))}
          </div>
          <p className="tools-note">
            <strong>Note:</strong> Tool mentions don't necessarily indicate effectiveness, 
            but show which technologies are actively deployed in the field.
          </p>
        </div>
      )}

      {/* Key Lessons */}
      <div className="lessons-learned">
        <h3>💡 Key Lessons for {selectedYear + 1}</h3>
        <div className="lessons-grid">
          <div className="lesson-card">
            <h4>🎯 Focus Area #1: Patch Management</h4>
            <p>
              Unpatched vulnerabilities remain a critical entry point. Organizations must prioritize 
              rapid patch deployment, especially for internet-facing systems and critical infrastructure.
            </p>
          </div>
          <div className="lesson-card">
            <h4>🎯 Focus Area #2: Identity Security</h4>
            <p>
              Weak or compromised credentials continue to enable attacks. Universal MFA deployment 
              and passwordless authentication should be priorities.
            </p>
          </div>
          <div className="lesson-card">
            <h4>🎯 Focus Area #3: Detection Speed</h4>
            <p>
              Faster detection directly correlates with reduced impact. Invest in EDR, SIEM, and 
              threat hunting capabilities to reduce dwell time.
            </p>
          </div>
          <div className="lesson-card">
            <h4>🎯 Focus Area #4: Security Culture</h4>
            <p>
              Human factors remain significant. Regular training, phishing simulations, and 
              security awareness programs are not optional.
            </p>
          </div>
        </div>
      </div>

      {/* Defense Maturity Model */}
      <div className="maturity-model">
        <h3>📊 Defense Maturity Recommendations</h3>
        <div className="maturity-levels">
          <div className="maturity-level">
            <h4>Level 1: Basic Hygiene</h4>
            <ul>
              <li>Deploy antivirus and firewalls</li>
              <li>Implement basic patch management</li>
              <li>Enable MFA for critical systems</li>
              <li>Regular backups</li>
            </ul>
          </div>
          <div className="maturity-level">
            <h4>Level 2: Proactive Defense</h4>
            <ul>
              <li>Deploy EDR/XDR solutions</li>
              <li>Implement SIEM for centralized logging</li>
              <li>Vulnerability scanning programs</li>
              <li>Security awareness training</li>
            </ul>
          </div>
          <div className="maturity-level">
            <h4>Level 3: Advanced Detection</h4>
            <ul>
              <li>24/7 SOC or MDR service</li>
              <li>Threat intelligence integration</li>
              <li>Automated incident response</li>
              <li>Red team exercises</li>
            </ul>
          </div>
          <div className="maturity-level">
            <h4>Level 4: Adaptive Security</h4>
            <ul>
              <li>Zero-trust architecture</li>
              <li>AI/ML-powered detection</li>
              <li>Threat hunting program</li>
              <li>Purple team collaboration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatDefenseName(name) {
  const names = {
    'detection': 'Early Detection',
    'prevention': 'Prevention',
    'patched': 'Patching',
    'response': 'Incident Response'
  }
  return names[name] || name
}

function formatFailureName(name) {
  const names = {
    'unpatched': 'Unpatched Systems',
    'misconfiguration': 'Misconfigurations',
    'no-mfa': 'Weak Authentication',
    'delayed-response': 'Delayed Detection'
  }
  return names[name] || name
}

function getDefenseDescription(name) {
  const descriptions = {
    'detection': 'Successful identification of threats before significant damage occurred',
    'prevention': 'Attacks blocked before gaining access or causing impact',
    'patched': 'Vulnerabilities addressed through timely patching',
    'response': 'Effective containment and recovery from incidents'
  }
  return descriptions[name] || ''
}

function getFailureDescription(name) {
  const descriptions = {
    'unpatched': 'Known vulnerabilities exploited due to delayed or missing patches',
    'misconfiguration': 'Security gaps from improper system configurations',
    'no-mfa': 'Compromised credentials due to weak or missing multi-factor authentication',
    'delayed-response': 'Extended dwell time allowing attackers to achieve objectives'
  }
  return descriptions[name] || ''
}

export default DefenseAnalysis
