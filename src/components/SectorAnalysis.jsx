import { useMemo } from 'react'
import './SectorAnalysis.css'

function SectorAnalysis({ incidents }) {
  const sectorData = useMemo(() => {
    if (!incidents || incidents.length === 0) return null

    // Define sector keywords and their context
    // P1 requirement: technology should only match if it's about tech companies being targeted,
    // not general tech articles. Reduced keywords to be more specific.
    const sectorDefinitions = {
      technology: {
        keywords: ['tech company', 'software company', 'it firm', 'saas provider', 'cloud provider'],
        icon: '💻',
        whyTargeted: 'High value of intellectual property, source code, and customer data. Weak supply chain controls and rapid cloud adoption create attack surfaces.',
        commonAttacks: 'Supply chain compromises, API attacks, cloud misconfigurations',
        impact: 'Cascading effects to customers, loss of competitive advantage',
        requiresTarget: true // Only match if clearly a victim, not just tech-related content
      },
      government: {
        keywords: ['government', 'ministry', 'federal', 'state', 'municipal', 'city hall', 'public sector'],
        icon: '🏛️',
        whyTargeted: 'Access to sensitive citizen data, critical infrastructure control, and geopolitical intelligence value.',
        commonAttacks: 'Spear-phishing, credential theft, APT campaigns',
        impact: 'National security risks, citizen data exposure, service disruption',
        requiresTarget: false
      },
      healthcare: {
        keywords: ['healthcare', 'hospital', 'medical', 'health', 'patient', 'clinic', 'health system'],
        icon: '🏥',
        whyTargeted: 'Valuable personal health information, critical systems that cannot afford downtime, often outdated security.',
        commonAttacks: 'Ransomware, data breaches, medical device exploitation',
        impact: 'Patient safety risks, HIPAA violations, operational paralysis',
        requiresTarget: false
      },
      finance: {
        keywords: ['finance', 'bank', 'financial', 'payment', 'crypto', 'credit union', 'financial institution'],
        icon: '🏦',
        whyTargeted: 'Direct access to funds, high-value transaction data, and regulatory compliance pressure.',
        commonAttacks: 'Wire fraud, BEC, ransomware, account takeovers',
        impact: 'Financial losses, regulatory penalties, customer trust erosion',
        requiresTarget: false
      },
      education: {
        keywords: ['education', 'university', 'school', 'college', 'academic', 'school district'],
        icon: '🎓',
        whyTargeted: 'Rich research data, weak security posture, easy access to personal information of students and staff.',
        commonAttacks: 'Ransomware, credential phishing, research data theft',
        impact: 'Research setbacks, student data exposure, operational disruption',
        requiresTarget: false
      },
      retail: {
        keywords: ['retail', 'store', 'shopping', 'e-commerce', 'retailer', 'merchant'],
        icon: '🛒',
        whyTargeted: 'High volume of payment card data, customer personal information, and seasonal vulnerability during peak sales.',
        commonAttacks: 'POS malware, e-skimming, customer data breaches',
        impact: 'Payment fraud, PCI compliance violations, brand damage',
        requiresTarget: false
      },
      energy: {
        keywords: ['energy', 'power', 'utility', 'oil', 'gas', 'electric', 'power plant'],
        icon: '⚡',
        whyTargeted: 'Critical infrastructure with potential for widespread disruption, geopolitical targets, OT/IT convergence vulnerabilities.',
        commonAttacks: 'ICS targeting, ransomware, state-sponsored attacks',
        impact: 'Service outages, public safety risks, economic disruption',
        requiresTarget: false
      }
    }

    // Count incidents per sector - track both article mentions and unique incidents
    const sectorCounts = {}
    const sectorIncidents = {}
    const sectorUniqueIncidents = {}
    
    Object.keys(sectorDefinitions).forEach(sector => {
      sectorCounts[sector] = 0
      sectorIncidents[sector] = []
      sectorUniqueIncidents[sector] = new Set()
    })

    incidents.forEach(incident => {
      const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase()
      
      // Prefer enriched sector data if available (from enhanced enrichment)
      if (incident.sector && incident.sector !== 'unknown') {
        const sector = incident.sector.toLowerCase();
        if (sectorCounts[sector] !== undefined) {
          sectorCounts[sector]++;
          sectorIncidents[sector].push(incident);
          // Track unique incidents via case_id for deduplication
          if (incident.case_id) {
            sectorUniqueIncidents[sector].add(incident.case_id);
          }
        }
      } else {
        // Fallback to keyword matching
        let matched = false;
        Object.entries(sectorDefinitions).forEach(([sector, definition]) => {
          if (definition.keywords.some(keyword => text.includes(keyword))) {
            // For technology sector, require incident/breach indicators
            if (sector === 'technology' && definition.requiresTarget) {
              const hasIncidentIndicators = /breach|attack|hack|compromise|ransomware|exploit/i.test(text);
              if (!hasIncidentIndicators) {
                return; // Skip tech articles that aren't about tech companies being attacked
              }
            }
            sectorCounts[sector]++;
            sectorIncidents[sector].push(incident);
            // Track unique incidents via case_id for deduplication
            if (incident.case_id) {
              sectorUniqueIncidents[sector].add(incident.case_id);
            }
            matched = true;
          }
        });
        
        // Note: Don't default to 'technology' - let items be uncategorized
        // This addresses P1 requirement to avoid false technology assignments
      }
    })

    // Get top 4 sectors
    const topSectors = Object.entries(sectorCounts)
      .filter(([, count]) => count > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([sector, count]) => ({
        name: sector,
        count,
        uniqueIncidents: sectorUniqueIncidents[sector].size,
        ...sectorDefinitions[sector],
        percentage: ((count / incidents.length) * 100).toFixed(1)
      }))

    return topSectors
  }, [incidents])

  if (!sectorData || sectorData.length === 0) return null

  return (
    <section className="sector-analysis" aria-label="Sector Analysis">
      <div className="sector-header">
        <h2>🎯 Sector Analysis</h2>
        <p className="sector-subtitle">Understanding why specific sectors are targeted</p>
        <p className="counting-label">
          <small>
            <em>📰 Article mentions (includes media coverage) • 🔵 Unique incidents (deduplicated)</em>
          </small>
        </p>
      </div>

      <div className="sector-grid">
        {sectorData.map((sector) => (
          <div key={sector.name} className="sector-card">
            <div className="sector-card-header">
              <span className="sector-icon">{sector.icon}</span>
              <div>
                <h3>{capitalize(sector.name)}</h3>
                <div className="sector-stats">
                  <span className="sector-count">
                    🔵 {sector.uniqueIncidents} unique incidents<br/>
                    📰 {sector.count} article mentions
                  </span>
                  <span className="sector-percentage">{sector.percentage}% of coverage</span>
                </div>
              </div>
            </div>

            <div className="sector-details">
              <div className="detail-section">
                <h4>🎯 Why Targeted</h4>
                <p>{sector.whyTargeted}</p>
              </div>

              <div className="detail-section">
                <h4>⚔️ Common Attacks</h4>
                <p>{sector.commonAttacks}</p>
              </div>

              <div className="detail-section">
                <h4>💥 Impact</h4>
                <p>{sector.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sector-insight">
        <h3>💡 Strategic Insight</h3>
        <p>
          <strong>{capitalize(sectorData[0]?.name)}</strong> dominated with <strong>{sectorData[0]?.uniqueIncidents} unique incidents</strong> (covered in {sectorData[0]?.count} articles, {sectorData[0]?.percentage}% of total coverage). 
          This concentration reflects {getSectorInsight(sectorData[0]?.name)}. 
          Organizations in these sectors must prioritize {getRecommendation(sectorData[0]?.name)}.
        </p>
      </div>
    </section>
  )
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getSectorInsight(sector) {
  const insights = {
    technology: 'the increasing sophistication of supply chain attacks and the high value of intellectual property',
    government: 'nation-state actors seeking geopolitical advantage and access to sensitive citizen data',
    healthcare: 'the critical nature of services that cannot tolerate downtime, making ransomware highly effective',
    finance: 'the direct financial motivation and the regulatory pressure that makes breaches extremely costly',
    education: 'the combination of valuable research data and historically underfunded security programs',
    retail: 'seasonal vulnerabilities during peak shopping periods and high volumes of payment data',
    energy: 'the strategic importance of critical infrastructure and nation-state cyber warfare objectives'
  }
  return insights[sector] || 'the evolving threat landscape and attacker sophistication'
}

function getRecommendation(sector) {
  const recommendations = {
    technology: 'supply chain security, secure development practices, and cloud security posture management',
    government: 'zero-trust architecture, advanced threat detection, and insider threat programs',
    healthcare: 'network segmentation, medical device security, and robust backup strategies',
    finance: 'fraud detection systems, strong authentication, and real-time transaction monitoring',
    education: 'security awareness training, data classification, and research data protection',
    retail: 'PCI DSS compliance, e-commerce security, and payment fraud prevention',
    energy: 'OT/IT security convergence, ICS security, and incident response preparedness'
  }
  return recommendations[sector] || 'comprehensive security programs and incident response capabilities'
}

export default SectorAnalysis
