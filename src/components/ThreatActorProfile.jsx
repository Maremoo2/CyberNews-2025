import { useMemo, useState } from 'react'
import { filterToIncidentsOnly } from '../utils/populationUtils'
import './ThreatActorProfile.css'

// Threat actor categorization
const ACTOR_CATEGORIES = {
  'cybercriminal': {
    name: 'Cybercriminals',
    icon: '💰',
    color: '#e74c3c',
    motive: 'Financial gain through ransomware, data theft, fraud, and extortion',
    keywords: ['ransomware', 'lockbit', 'blackcat', 'alphv', 'clop', 'conti', 'revil', 'maze', 
               'ransom', 'extortion', 'criminal', 'gang', 'fraud', 'scam', 'financial']
  },
  'hacktivist': {
    name: 'Hacktivists',
    icon: '✊',
    color: '#f39c12',
    motive: 'Political or ideological goals through disruption, defacement, and data leaks',
    keywords: ['hacktivist', 'anonymous', 'ddos', 'defacement', 'protest', 'activism', 
               'killnet', 'noname', 'political', 'ideology']
  },
  'nation-state': {
    name: 'Nation-State Actors',
    icon: '🎖️',
    color: '#9b59b6',
    motive: 'Espionage, sabotage, and strategic advantage for geopolitical objectives',
    keywords: ['apt', 'advanced-persistent', 'china', 'chinese', 'russia', 'russian', 'iran', 'iranian',
               'north-korea', 'lazarus', 'fancy-bear', 'cozy-bear', 'apt28', 'apt29', 'apt41',
               'state-sponsored', 'nation-state', 'espionage', 'geopolitical', 'intelligence']
  }
}

// Known threat actor groups
const KNOWN_ACTORS = {
  // Cybercriminals
  'lockbit': { category: 'cybercriminal', name: 'LockBit', description: 'Ransomware-as-a-Service operation' },
  'blackcat': { category: 'cybercriminal', name: 'BlackCat/ALPHV', description: 'Sophisticated ransomware group' },
  'clop': { category: 'cybercriminal', name: 'Clop', description: 'Ransomware exploiting supply chain vulnerabilities' },
  'conti': { category: 'cybercriminal', name: 'Conti', description: 'Prolific ransomware syndicate' },
  
  // Hacktivists
  'killnet': { category: 'hacktivist', name: 'KillNet', description: 'Pro-Russian hacktivist group' },
  'anonymous': { category: 'hacktivist', name: 'Anonymous', description: 'Decentralized hacktivist collective' },
  'noname': { category: 'hacktivist', name: 'NoName057(16)', description: 'Pro-Russian DDoS activists' },
  
  // Nation-State
  'apt28': { category: 'nation-state', name: 'APT28/Fancy Bear', description: 'Russian military intelligence' },
  'apt29': { category: 'nation-state', name: 'APT29/Cozy Bear', description: 'Russian intelligence service' },
  'apt41': { category: 'nation-state', name: 'APT41', description: 'Chinese state-sponsored group' },
  'lazarus': { category: 'nation-state', name: 'Lazarus Group', description: 'North Korean state actors' }
}

function ThreatActorProfile({ incidents }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const actorAnalysis = useMemo(() => {
    if (!incidents || incidents.length === 0) return null

    // Filter to incidents only for actor analysis
    const relevantIncidents = filterToIncidentsOnly(incidents);

    const categoryCounts = {
      'cybercriminal': { count: 0, incidents: [], actors: new Set() },
      'hacktivist': { count: 0, incidents: [], actors: new Set() },
      'nation-state': { count: 0, incidents: [], actors: new Set() }
    }

    const actorMentions = {}

    // Analyze incidents - only use enriched actor_confidence if available
    relevantIncidents.forEach(incident => {
      // Skip if actor_confidence is explicitly low (when enriched data is available)
      if (incident.actor_confidence && incident.actor_confidence === 'low') {
        return;
      }

      const text = `${incident.title} ${incident.summary} ${incident.tags?.join(' ')}`.toLowerCase()
      let categorized = false

      // Prefer enriched actor data if available
      if (incident.actor_name && incident.actor_confidence && 
          (incident.actor_confidence === 'high' || incident.actor_confidence === 'medium')) {
        const actorName = incident.actor_name;
        const actorCategory = incident.actor_category || 'unknown';
        const actorConfidence = incident.actor_confidence;
        
        if (categoryCounts[actorCategory]) {
          categoryCounts[actorCategory].count++;
          categoryCounts[actorCategory].incidents.push(incident);
          categoryCounts[actorCategory].actors.add(actorName);
        }
        
        if (!actorMentions[actorName]) {
          actorMentions[actorName] = { 
            name: actorName,
            category: actorCategory,
            confidence: actorConfidence,
            count: 0, 
            incidents: [] 
          };
        }
        actorMentions[actorName].count++;
        actorMentions[actorName].incidents.push(incident.id);
        categorized = true;
      } else {
        // Fallback to keyword matching for non-enriched data
        // Check for known actors first
        Object.entries(KNOWN_ACTORS).forEach(([key, actor]) => {
          if (text.includes(key.toLowerCase())) {
            categoryCounts[actor.category].count++;
            categoryCounts[actor.category].incidents.push(incident);
            categoryCounts[actor.category].actors.add(actor.name);
            
            if (!actorMentions[actor.name]) {
              actorMentions[actor.name] = { ...actor, count: 0, incidents: [] };
            }
            actorMentions[actor.name].count++;
            actorMentions[actor.name].incidents.push(incident.id);
            categorized = true;
          }
        });

        // If not categorized, check keywords
        if (!categorized) {
          Object.entries(ACTOR_CATEGORIES).forEach(([category, info]) => {
            if (info.keywords.some(keyword => text.includes(keyword))) {
              categoryCounts[category].count++;
              categoryCounts[category].incidents.push(incident);
              categorized = true;
            }
          });
        }
      }
    })

    // Get top actors
    const topActors = Object.values(actorMentions)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Get category distribution
    const categoryDistribution = Object.entries(categoryCounts)
      .map(([category, data]) => ({
        category,
        ...ACTOR_CATEGORIES[category],
        count: data.count,
        uniqueActors: data.actors.size,
        percentage: ((data.count / relevantIncidents.length) * 100).toFixed(1)
      }))
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count)

    return {
      categoryDistribution,
      topActors,
      totalIncidents: relevantIncidents.length,
      totalAllItems: incidents.length,
      categorizedIncidents: Object.values(categoryCounts).reduce((sum, c) => sum + c.count, 0)
    }
  }, [incidents])

  if (!actorAnalysis || actorAnalysis.categoryDistribution.length === 0) {
    return null
  }

  return (
    <section className="threat-actor-profile" id="actors" aria-label="Threat Actor Analysis">
      <div className="actor-header">
        <h2>👥 Threat Actor Landscape</h2>
        <p className="actor-subtitle">
          Understanding who is behind the attacks - their motives, methods, and targets
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
      <div className="actor-intro">
        <p>
          Not all cyber attacks are created equal. Understanding the adversary - whether they're financially motivated 
          criminals, politically driven hacktivists, or state-sponsored intelligence operations - is crucial for 
          effective defense. Different actor types have different capabilities, targets, and persistence levels.
        </p>
      </div>

      {/* Category Distribution */}
      <div className="category-overview">
        <h3>Actor Categories Distribution</h3>
        <div className="category-grid">
          {actorAnalysis.categoryDistribution.map((category) => (
            <div 
              key={category.category} 
              className="category-card"
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <div>
                  <h4>{category.name}</h4>
                  <div className="category-stats">
                    <span className="category-count">{category.count} incidents</span>
                    <span className="category-percentage">{category.percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="category-details">
                <div className="detail-row">
                  <span className="detail-label">🎯 Motive:</span>
                  <p className="detail-value">{category.motive}</p>
                </div>
                {category.uniqueActors > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">👤 Identified Actors:</span>
                    <span className="detail-value">{category.uniqueActors}</span>
                  </div>
                )}
              </div>

              <div className="category-bar-container">
                <div 
                  className="category-bar" 
                  style={{ 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Threat Actors */}
      {actorAnalysis.topActors.length > 0 && (
        <div className="top-actors-section">
          <h3>Most Active Threat Actors</h3>
          <div className="actors-grid">
            {actorAnalysis.topActors.map((actor) => (
              <div 
                key={actor.name} 
                className="actor-card"
                style={{ borderTopColor: ACTOR_CATEGORIES[actor.category]?.color }}
              >
                <div className="actor-card-header">
                  <span className="actor-category-badge" style={{ 
                    backgroundColor: ACTOR_CATEGORIES[actor.category]?.color 
                  }}>
                    {ACTOR_CATEGORIES[actor.category]?.icon} {ACTOR_CATEGORIES[actor.category]?.name}
                  </span>
                  <span className="actor-count-badge">{actor.count} incidents</span>
                </div>
                <div className="actor-name-row">
                  <h4>{actor.name}</h4>
                  {actor.confidence && (
                    <span 
                      className={`confidence-badge confidence-${actor.confidence}`}
                      title={`Attribution confidence: ${actor.confidence}`}
                    >
                      {actor.confidence === 'high' ? '🟢' : actor.confidence === 'medium' ? '🟡' : '⚪'} {actor.confidence}
                    </span>
                  )}
                </div>
                <p className="actor-description">{actor.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Insights */}
      <div className="actor-insights">
        <h3>💡 Strategic Implications</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🎯 Primary Threat</h4>
            <p>
              <strong>{actorAnalysis.categoryDistribution[0]?.name}</strong> dominate with{' '}
              <strong>{actorAnalysis.categoryDistribution[0]?.count} incidents</strong> (
              {actorAnalysis.categoryDistribution[0]?.percentage}%). This indicates that{' '}
              {getImplicationText(actorAnalysis.categoryDistribution[0]?.category)}.
            </p>
          </div>

          <div className="insight-card">
            <h4>🛡️ Defense Priorities</h4>
            <p>{getDefensePriority(actorAnalysis.categoryDistribution[0]?.category)}</p>
          </div>

          <div className="insight-card">
            <h4>📊 Threat Diversity</h4>
            <p>
              With {actorAnalysis.categoryDistribution.length} active actor categories and{' '}
              {actorAnalysis.topActors.length} identified groups, organizations face a{' '}
              {actorAnalysis.categoryDistribution.length >= 3 ? 'diverse' : 'focused'} threat landscape 
              requiring {actorAnalysis.categoryDistribution.length >= 3 ? 'comprehensive' : 'targeted'} security strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Attribution Challenges */}
      <div className="attribution-note">
        <h4>⚠️ Attribution Challenges</h4>
        <p>
          Attributing cyber attacks to specific actors is complex and often uncertain. This analysis is based on 
          public reporting and may not reflect the full picture. Many attacks remain unattributed, and false flag 
          operations can deliberately mislead attribution efforts. {actorAnalysis.totalIncidents - actorAnalysis.categorizedIncidents} 
          incidents ({((1 - actorAnalysis.categorizedIncidents / actorAnalysis.totalIncidents) * 100).toFixed(1)}%) 
          could not be clearly attributed to a specific actor category.
        </p>
      </div>
      </>
      )}
    </section>
  )
}

function getImplicationText(category) {
  const implications = {
    'cybercriminal': 'financial motivation remains the primary driver of cyber attacks. Organizations should prioritize protection of high-value assets and payment systems',
    'hacktivist': 'geopolitical tensions are driving cyber activism. Organizations in affected regions should prepare for DDoS and defacement attacks',
    'nation-state': 'strategic espionage and geopolitical objectives are major concerns. Organizations with sensitive data should assume they are targets'
  }
  return implications[category] || 'diverse threat actors require comprehensive security strategies'
}

function getDefensePriority(category) {
  const priorities = {
    'cybercriminal': 'Focus on ransomware prevention, robust backups, email security, and employee training. Payment fraud detection and incident response plans are critical.',
    'hacktivist': 'Strengthen DDoS protection, web application security, and monitoring. Prepare communications plans for potential defacement or data leak scenarios.',
    'nation-state': 'Implement advanced threat detection, zero-trust architecture, and assume breach mentality. Protect intellectual property and sensitive data with encryption and DLP.'
  }
  return priorities[category] || 'Implement defense-in-depth with multiple security layers.'
}

export default ThreatActorProfile
