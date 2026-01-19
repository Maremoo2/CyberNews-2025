import { useMemo, useState } from 'react'
import { filterToIncidentsOnly } from '../utils/populationUtils'
import './ThreatIntelligence.css'

// MITRE ATT&CK Tactics and Techniques
const MITRE_TACTICS = {
  'initial-access': {
    name: 'Initial Access',
    icon: '🚪',
    description: 'How attackers first gain access',
    techniques: {
      'T1566': { name: 'Phishing', keywords: ['phishing', 'spear-phishing', 'email', 'credential'] },
      'T1190': { name: 'Exploit Public-Facing Application', keywords: ['vulnerability', 'exploit', 'web', 'zero-day'] },
      'T1078': { name: 'Valid Accounts', keywords: ['credential', 'stolen', 'compromised', 'account-takeover'] },
      'T1195': { name: 'Supply Chain Compromise', keywords: ['supply-chain', 'third-party', 'vendor'] },
      'T1133': { name: 'External Remote Services', keywords: ['vpn', 'remote', 'rdp', 'citrix'] }
    }
  },
  'execution': {
    name: 'Execution',
    icon: '⚡',
    description: 'Techniques to run malicious code',
    techniques: {
      'T1059': { name: 'Command and Scripting', keywords: ['powershell', 'script', 'command', 'bash'] },
      'T1204': { name: 'User Execution', keywords: ['malicious', 'attachment', 'macro', 'click'] },
      'T1047': { name: 'Windows Management Instrumentation', keywords: ['wmi', 'windows'] }
    }
  },
  'persistence': {
    name: 'Persistence',
    icon: '🔒',
    description: 'Maintaining access over time',
    techniques: {
      'T1098': { name: 'Account Manipulation', keywords: ['backdoor', 'persistence', 'account'] },
      'T1136': { name: 'Create Account', keywords: ['new-account', 'backdoor-account'] },
      'T1053': { name: 'Scheduled Task/Job', keywords: ['scheduled', 'cron', 'task'] }
    }
  },
  'privilege-escalation': {
    name: 'Privilege Escalation',
    icon: '⬆️',
    description: 'Gaining higher-level permissions',
    techniques: {
      'T1068': { name: 'Exploitation for Privilege Escalation', keywords: ['privilege', 'escalation', 'exploit'] },
      'T1078': { name: 'Valid Accounts', keywords: ['admin', 'privileged', 'sudo'] }
    }
  },
  'defense-evasion': {
    name: 'Defense Evasion',
    icon: '🎭',
    description: 'Avoiding detection',
    techniques: {
      'T1027': { name: 'Obfuscated Files', keywords: ['obfuscate', 'encode', 'encrypt'] },
      'T1070': { name: 'Indicator Removal', keywords: ['log-deletion', 'cover', 'clean'] },
      'T1562': { name: 'Impair Defenses', keywords: ['disable', 'antivirus', 'defender', 'edr'] }
    }
  },
  'credential-access': {
    name: 'Credential Access',
    icon: '🔑',
    description: 'Stealing credentials',
    techniques: {
      'T1110': { name: 'Brute Force', keywords: ['brute-force', 'password-spray', 'dictionary'] },
      'T1555': { name: 'Credentials from Password Stores', keywords: ['password-manager', 'keychain', 'credential-store'] },
      'T1056': { name: 'Input Capture', keywords: ['keylogger', 'credential-capture'] }
    }
  },
  'discovery': {
    name: 'Discovery',
    icon: '🔍',
    description: 'Reconnaissance and information gathering',
    techniques: {
      'T1083': { name: 'File and Directory Discovery', keywords: ['reconnaissance', 'discovery', 'enumerate'] },
      'T1018': { name: 'Remote System Discovery', keywords: ['network-scan', 'lateral'] },
      'T1087': { name: 'Account Discovery', keywords: ['user-enumeration', 'account-discovery'] }
    }
  },
  'lateral-movement': {
    name: 'Lateral Movement',
    icon: '↔️',
    description: 'Moving through the network',
    techniques: {
      'T1021': { name: 'Remote Services', keywords: ['rdp', 'ssh', 'smb', 'lateral'] },
      'T1570': { name: 'Lateral Tool Transfer', keywords: ['lateral-movement', 'propagation'] },
      'T1091': { name: 'Replication Through Removable Media', keywords: ['usb', 'removable'] }
    }
  },
  'collection': {
    name: 'Collection',
    icon: '📦',
    description: 'Gathering data of interest',
    techniques: {
      'T1005': { name: 'Data from Local System', keywords: ['file-theft', 'data-collection', 'local'] },
      'T1039': { name: 'Data from Network Shared Drive', keywords: ['network-share', 'file-server'] },
      'T1560': { name: 'Archive Collected Data', keywords: ['archive', 'compress', 'rar', 'zip'] }
    }
  },
  'exfiltration': {
    name: 'Exfiltration',
    icon: '📤',
    description: 'Stealing data from the network',
    techniques: {
      'T1041': { name: 'Exfiltration Over C2 Channel', keywords: ['exfiltration', 'data-theft', 'c2', 'command-and-control'] },
      'T1567': { name: 'Exfiltration to Cloud Storage', keywords: ['cloud', 'aws', 'azure', 'gcp', 'dropbox'] },
      'T1048': { name: 'Exfiltration Over Alternative Protocol', keywords: ['dns', 'covert-channel'] }
    }
  },
  'impact': {
    name: 'Impact',
    icon: '💥',
    description: 'Disrupting or destroying systems',
    techniques: {
      'T1486': { name: 'Data Encrypted for Impact', keywords: ['ransomware', 'encryption', 'lockbit', 'blackcat'] },
      'T1498': { name: 'Network Denial of Service', keywords: ['ddos', 'dos', 'denial-of-service'] },
      'T1485': { name: 'Data Destruction', keywords: ['wiper', 'deletion', 'destroy'] }
    }
  }
}

function ThreatIntelligence({ incidents }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const mitreAnalysis = useMemo(() => {
    if (!incidents || incidents.length === 0) return null

    // Filter to incidents only for MITRE analysis
    // Excludes policy, opinion, vulnerability content
    const relevantIncidents = filterToIncidentsOnly(incidents);

    const tacticCounts = {}
    const techniqueDetails = {}

    // Initialize counts
    Object.keys(MITRE_TACTICS).forEach(tacticKey => {
      tacticCounts[tacticKey] = 0
      techniqueDetails[tacticKey] = {}
    })

    // Analyze each incident
    relevantIncidents.forEach(incident => {
      const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase()

      // Check each tactic and technique
      Object.entries(MITRE_TACTICS).forEach(([tacticKey, tactic]) => {
        let tacticMatched = false

        Object.entries(tactic.techniques).forEach(([techniqueId, technique]) => {
          if (technique.keywords.some(keyword => text.includes(keyword))) {
            if (!techniqueDetails[tacticKey][techniqueId]) {
              techniqueDetails[tacticKey][techniqueId] = {
                ...technique,
                id: techniqueId,
                count: 0,
                incidents: []
              }
            }
            techniqueDetails[tacticKey][techniqueId].count++
            techniqueDetails[tacticKey][techniqueId].incidents.push(incident.id)
            tacticMatched = true
          }
        })

        if (tacticMatched) {
          tacticCounts[tacticKey]++
        }
      })
    })

    // Get top tactics
    const topTactics = Object.entries(tacticCounts)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tacticKey, count]) => ({
        key: tacticKey,
        ...MITRE_TACTICS[tacticKey],
        count,
        techniques: Object.values(techniqueDetails[tacticKey])
          .filter(t => t.count > 0)
          .sort((a, b) => b.count - a.count)
      }))

    // Get overall top techniques
    const allTechniques = []
    Object.values(techniqueDetails).forEach(tacticTechniques => {
      Object.values(tacticTechniques).forEach(technique => {
        if (technique.count > 0) {
          allTechniques.push(technique)
        }
      })
    })

    const topTechniques = allTechniques
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      topTactics,
      topTechniques,
      totalIncidents: relevantIncidents.length,
      totalAllItems: incidents.length
    }
  }, [incidents])

  if (!mitreAnalysis || mitreAnalysis.topTactics.length === 0) {
    return null
  }

  return (
    <section className="threat-intelligence" id="mitre" aria-label="MITRE ATT&CK Analysis">
      <div className="intel-header">
        <h2>🎯 MITRE ATT&CK Framework Analysis</h2>
        <p className="intel-subtitle">
          Understanding attack patterns through the industry-standard framework for adversary tactics and techniques (analyzing {mitreAnalysis.totalIncidents} incident-related articles)
        </p>
        <button 
          className="collapse-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▼ Collapse details' : '▶ Expand details'}
        </button>
      </div>

      {isExpanded && (
      <>
      <div className="intel-intro">
        <p>
          The MITRE ATT&CK framework provides a comprehensive matrix of tactics (the "why") and techniques (the "how") 
          used by cyber adversaries. This analysis maps the {mitreAnalysis.totalIncidents} incident-related articles to the framework, 
          revealing the most common attack patterns and helping organizations prioritize their defenses.
        </p>
      </div>

      {/* Top Techniques Overview */}
      <div className="top-techniques-overview">
        <h3>Most Common Attack Techniques</h3>
        <div className="techniques-grid">
          {mitreAnalysis.topTechniques.slice(0, 6).map((technique) => (
            <div key={technique.id} className="technique-card">
              <div className="technique-header">
                <span className="technique-id">{technique.id}</span>
                <span className="technique-count">{technique.count}</span>
              </div>
              <h4>{technique.name}</h4>
              <p className="technique-usage">Used in {technique.count} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tactics Breakdown */}
      <div className="tactics-section">
        <h3>Tactics Breakdown - The Attack Lifecycle</h3>
        <div className="tactics-grid">
          {mitreAnalysis.topTactics.map((tactic) => (
            <div key={tactic.key} className="tactic-card">
              <div className="tactic-header">
                <span className="tactic-icon">{tactic.icon}</span>
                <div className="tactic-title">
                  <h4>{tactic.name}</h4>
                  <p className="tactic-count">{tactic.count} articles</p>
                </div>
              </div>
              <p className="tactic-description">{tactic.description}</p>
              
              {tactic.techniques && tactic.techniques.length > 0 && (
                <div className="tactic-techniques">
                  <h5>Key Techniques:</h5>
                  <ul>
                    {tactic.techniques.slice(0, 3).map((technique) => (
                      <li key={technique.id} className="technique-item">
                        <span className="technique-id-inline">{technique.id}</span>
                        <span className="technique-name-inline">{technique.name}</span>
                        <span className="technique-count-inline">({technique.count})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Defensive Recommendations */}
      <div className="defense-recommendations">
        <h3>🛡️ Defensive Priorities Based on MITRE Analysis</h3>
        <div className="recommendations-grid">
          {mitreAnalysis.topTactics.slice(0, 3).map((tactic) => (
            <div key={tactic.key} className="recommendation-card">
              <h4>{tactic.icon} {tactic.name}</h4>
              <p>{getDefenseRecommendation(tactic.key)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mitre-footer">
        <p>
          <strong>Note:</strong> This analysis is based on keyword matching and incident descriptions. 
          For comprehensive threat intelligence, combine this with dedicated threat hunting and incident analysis.
        </p>
        <p>
          <a 
            href="https://attack.mitre.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mitre-link"
          >
            Learn more about MITRE ATT&CK Framework →
          </a>
        </p>
      </div>
      </>
      )}
    </section>
  )
}

// Defensive recommendations based on tactic
function getDefenseRecommendation(tacticKey) {
  const recommendations = {
    'initial-access': 'Strengthen perimeter defenses with email security gateways, web application firewalls, and multi-factor authentication. Regular security awareness training is critical.',
    'execution': 'Implement application whitelisting, disable unnecessary scripting engines, and use endpoint detection and response (EDR) solutions.',
    'persistence': 'Monitor for unauthorized account creation and privilege changes. Implement privileged access management (PAM) and regular access reviews.',
    'privilege-escalation': 'Apply security patches promptly, implement least privilege principles, and monitor for suspicious privilege escalation attempts.',
    'defense-evasion': 'Use behavioral analytics and EDR solutions that detect anomalous activities. Ensure security tools cannot be easily disabled.',
    'credential-access': 'Enforce strong password policies, use credential vaults, implement MFA everywhere, and monitor for credential dumping attempts.',
    'discovery': 'Limit reconnaissance opportunities through network segmentation, disable unnecessary services, and monitor for scanning activities.',
    'lateral-movement': 'Implement micro-segmentation, require MFA for administrative access, and monitor for unusual lateral movement patterns.',
    'collection': 'Use data loss prevention (DLP) tools, monitor file access patterns, and implement data classification.',
    'exfiltration': 'Monitor outbound traffic for anomalies, implement egress filtering, and use DLP solutions to detect data exfiltration.',
    'impact': 'Maintain offline backups, implement network segmentation to limit ransomware spread, and have a tested incident response plan.'
  }
  return recommendations[tacticKey] || 'Implement defense-in-depth strategy with multiple layers of security controls.'
}

export default ThreatIntelligence
