import { useState } from 'react';
import './RegulationImpact.css'

function RegulationImpact({ selectedYear }) {
  const [isExpanded, setIsExpanded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const currentYear = new Date().getFullYear();
  
  // Key regulations and their impact
  const regulations = [
    {
      name: 'NIS2 Directive',
      icon: '🇪🇺',
      status: selectedYear >= 2024 ? 'In Effect' : 'Pending',
      region: 'European Union',
      impact: 'Expanded scope covering more critical sectors and supply chains. Increased penalties for non-compliance.',
      keyRequirements: [
        'Mandatory incident reporting within 24 hours',
        'Supply chain security requirements',
        'Board-level accountability for cybersecurity',
        'Regular security audits and risk assessments'
      ],
      realWorldImpact: selectedYear >= 2024 
        ? 'Organizations scrambled to comply, leading to increased security investments and faster incident disclosure.'
        : 'Organizations are preparing for stricter requirements and expanded coverage.',
      color: '#3498db'
    },
    {
      name: 'GDPR',
      icon: '🔒',
      status: 'Established',
      region: 'European Union & Global',
      impact: 'Continued enforcement with record fines for data breaches and privacy violations.',
      keyRequirements: [
        'Data breach notification within 72 hours',
        'Privacy by design and by default',
        'Right to erasure and data portability',
        'Mandatory DPO for certain organizations'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Enforcement intensified with multi-million euro fines. Organizations faced increased scrutiny on data handling practices.'
        : 'Mature enforcement with predictable penalty frameworks.',
      color: '#2ecc71'
    },
    {
      name: 'Digital Services Act (DSA)',
      icon: '⚖️',
      status: selectedYear >= 2024 ? 'In Effect' : 'Rolling Out',
      region: 'European Union',
      impact: 'New obligations for online platforms to combat illegal content and disinformation.',
      keyRequirements: [
        'Transparency in content moderation',
        'Risk assessments for systemic risks',
        'Crisis response mechanisms',
        'Independent audits of algorithmic systems'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Major platforms implemented transparency reports and content moderation changes. Increased focus on combating deepfakes and AI-generated disinformation.'
        : 'Platforms are adapting policies in preparation for full enforcement.',
      color: '#9b59b6'
    },
    {
      name: 'SEC Cyber Disclosure Rules',
      icon: '🇺🇸',
      status: selectedYear >= 2023 ? 'In Effect' : 'Pending',
      region: 'United States',
      impact: 'Public companies must disclose material cybersecurity incidents within 4 business days.',
      keyRequirements: [
        '8-K filing within 4 days of material incident',
        'Annual disclosure of cyber risk management',
        'Board oversight description required',
        'CISO or equivalent role disclosure'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Increased transparency led to faster public disclosure of breaches. Boards demanded better cyber risk reporting.'
        : 'Organizations are establishing materiality assessment frameworks.',
      color: '#e74c3c'
    },
    {
      name: 'China Cybersecurity Law',
      icon: '🇨🇳',
      status: 'In Effect',
      region: 'China',
      impact: 'Strict data localization and cybersecurity review requirements for critical infrastructure.',
      keyRequirements: [
        'Data localization for critical data',
        'Security reviews for data transfers abroad',
        'Critical infrastructure designation requirements',
        'Mandatory security certification'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Foreign companies faced challenges with data residency requirements. Increased government scrutiny of technology supply chains.'
        : 'Continued enforcement with selective penalties for non-compliance.',
      color: '#f39c12'
    }
  ]

  return (
    <section className="regulation-impact" id="regulation" aria-label="Regulation Impact">
      <div className="regulation-header">
        <h2>📜 Regulatory Landscape & Compliance Impact</h2>
        <p className="regulation-subtitle">
          How cybersecurity regulations shaped the threat landscape and organizational responses in {selectedYear}
        </p>
      </div>

      <div className="regulation-intro">
        <p>
          Cybersecurity regulations increasingly drive organizational security strategies. In {selectedYear}, 
          multiple frameworks matured globally, creating a complex compliance landscape that directly influenced 
          how organizations detected, responded to, and disclosed cyber incidents.
        </p>
        <button 
          className="show-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▼ Show less' : '▶ Show more details'}
        </button>
      </div>

      {isExpanded && (
      <>

      {/* Regulation Cards */}
      <div className="regulations-grid">
        {regulations.map((reg) => (
          <div 
            key={reg.name} 
            className="regulation-card"
            style={{ borderTopColor: reg.color }}
          >
            <div className="regulation-card-header">
              <div className="reg-title-row">
                <span className="regulation-icon">{reg.icon}</span>
                <div>
                  <h3>{reg.name}</h3>
                  <p className="reg-region">{reg.region}</p>
                </div>
              </div>
              <span 
                className={`reg-status ${reg.status.toLowerCase().replace(' ', '-')}`}
                style={{ backgroundColor: reg.color }}
              >
                {reg.status}
              </span>
            </div>

            <div className="regulation-content">
              <div className="reg-section">
                <h4>📋 Impact</h4>
                <p>{reg.impact}</p>
              </div>

              <div className="reg-section">
                <h4>✓ Key Requirements</h4>
                <ul>
                  {reg.keyRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="reg-section real-world">
                <h4>🌍 Real-World Impact in {selectedYear}</h4>
                <p>{reg.realWorldImpact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Trends */}
      <div className="compliance-trends">
        <h3>📈 Key Compliance Trends in {selectedYear}</h3>
        <div className="trends-grid">
          <div className="trend-card">
            <h4>🚀 Accelerated Disclosure</h4>
            <p>
              Regulations like SEC rules and NIS2 compressed disclosure timelines to 24-72 hours. 
              Organizations invested heavily in incident classification and materiality assessment 
              frameworks to meet these aggressive deadlines.
            </p>
          </div>
          <div className="trend-card">
            <h4>👔 Board-Level Accountability</h4>
            <p>
              Cyber risk became a board-level issue. Directors faced personal liability for inadequate 
              oversight, driving demand for better reporting, third-party audits, and cyber insurance.
            </p>
          </div>
          <div className="trend-card">
            <h4>🔗 Supply Chain Focus</h4>
            <p>
              NIS2 and other frameworks extended requirements to supply chains. Organizations began 
              auditing vendors, requiring security certifications, and building supply chain risk 
              management programs.
            </p>
          </div>
          <div className="trend-card">
            <h4>💰 Rising Penalties</h4>
            <p>
              Enforcement intensified across all frameworks. Multi-million dollar fines for GDPR violations, 
              SEC investigations for inadequate disclosure, and NIS2 penalties up to €10M or 2% of revenue 
              created strong financial incentives for compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Global Compliance Challenges */}
      <div className="compliance-challenges">
        <h3>⚠️ Cross-Border Compliance Challenges</h3>
        <div className="challenges-content">
          <p>
            Operating globally means navigating conflicting requirements:
          </p>
          <ul>
            <li>
              <strong>Data Localization:</strong> China and Russia require local storage, conflicting 
              with cloud-first strategies
            </li>
            <li>
              <strong>Disclosure Timing:</strong> Different timelines (24h for NIS2, 72h for GDPR, 4 days for SEC) 
              create operational complexity
            </li>
            <li>
              <strong>Extraterritorial Reach:</strong> GDPR applies globally to EU data subjects, creating 
              compliance obligations far beyond Europe
            </li>
            <li>
              <strong>Technology Transfer Restrictions:</strong> US export controls and Chinese cybersecurity 
              reviews limit cross-border technology sharing
            </li>
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="compliance-recommendations">
        <h3>💡 Strategic Compliance Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-item">
            <h4>1. Build Compliance-Aware Incident Response</h4>
            <p>
              Integrate regulatory timelines into IR playbooks. Automate incident classification 
              for materiality assessments. Maintain pre-drafted disclosure templates.
            </p>
          </div>
          <div className="recommendation-item">
            <h4>2. Establish Board Reporting Cadence</h4>
            <p>
              Quarterly cyber risk reports with KPIs, threat intelligence summaries, and compliance 
              status. Train board members on cyber fundamentals.
            </p>
          </div>
          <div className="recommendation-item">
            <h4>3. Implement Supply Chain Risk Management</h4>
            <p>
              Vendor security questionnaires, contractual security requirements, continuous monitoring 
              of third-party risks, and incident response coordination with suppliers.
            </p>
          </div>
          <div className="recommendation-item">
            <h4>4. Engage Legal and Compliance Early</h4>
            <p>
              Cyber incidents have legal implications. Build cross-functional incident response teams 
              including legal, compliance, communications, and technical staff.
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </section>
  )
}

export default RegulationImpact
