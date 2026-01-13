import { useMemo } from 'react'
import BuzzwordCloud from './BuzzwordCloud'
import './TrendDashboard.css'

// Import aggregated news data
import newsData from '../../data/news-aggregated-2026.json'

function TrendDashboard({ selectedYear, selectedMonth, selectedRegion, incidents }) {
  // Filter and aggregate data based on selections
  const dashboardData = useMemo(() => {
    // Only show for 2026 when data exists
    if (selectedYear !== 2026 || !newsData[selectedYear]) {
      return null
    }

    const yearData = newsData[selectedYear]
    let aggregated = {
      buzzwords: [],
      threatActors: [],
      incidents: [],
      trends: [],
      legislation: [],
      stats: {
        totalIncidents: 0,
        uniqueThreatActors: 0,
        reportedIncidents: 0,
        sectors: {},
        attackTypes: {}
      }
    }

    // Determine which months to include
    const monthsToInclude = selectedMonth === 'ALL' 
      ? Object.keys(yearData)
      : [getMonthName(selectedMonth)]

    // Determine which regions to include
    const regionsToInclude = selectedRegion === 'ALL'
      ? ['norway', 'eu', 'us', 'asia']
      : [selectedRegion.toLowerCase()]

    // Aggregate data across selected months and regions for narrative content
    for (const month of monthsToInclude) {
      const monthData = yearData[month]
      if (!monthData) continue

      for (const region of regionsToInclude) {
        const regionData = monthData[region]
        if (!regionData) continue

        // Aggregate buzzwords
        if (regionData.buzzwords) {
          aggregated.buzzwords.push(...regionData.buzzwords)
        }

        // Aggregate threat actors
        if (regionData.threatActors) {
          aggregated.threatActors.push(...regionData.threatActors)
        }

        // Aggregate incidents for narrative
        if (regionData.incidents) {
          aggregated.incidents.push(...regionData.incidents)
        }

        // Aggregate trends
        if (regionData.trends) {
          aggregated.trends.push(...regionData.trends)
        }

        // Aggregate legislation
        if (regionData.legislation) {
          aggregated.legislation.push(...regionData.legislation)
        }
      }
    }

    // Calculate statistics from actual incident data
    let filteredIncidents = incidents || []
    
    // Filter by month if not ALL
    if (selectedMonth !== 'ALL') {
      filteredIncidents = filteredIncidents.filter(incident => {
        if (!incident.date) return false
        const month = parseInt(incident.date.substring(5, 7), 10) - 1
        return month === selectedMonth
      })
    }

    // Filter by region if not ALL
    if (selectedRegion !== 'ALL') {
      const regionMap = { 'NORWAY': 'NO', 'EU': 'EU', 'US': 'US', 'ASIA': 'ASIA' }
      const targetRegion = regionMap[selectedRegion.toUpperCase()] || selectedRegion.toUpperCase()
      filteredIncidents = filteredIncidents.filter(incident => 
        incident.region === targetRegion
      )
    }

    // Calculate total incidents
    aggregated.stats.totalIncidents = filteredIncidents.length

    // Calculate unique threat actors
    const threatActorSet = new Set()
    filteredIncidents.forEach(incident => {
      // Check enriched field first (actor_name)
      if (incident.actor_name && incident.actor_name.trim()) {
        threatActorSet.add(incident.actor_name.toLowerCase().trim())
      }
      // Fallback to old aiAnalysis field for backward compatibility
      else if (incident.aiAnalysis?.threatActors) {
        incident.aiAnalysis.threatActors.forEach(actor => {
          if (actor && actor.trim()) {
            threatActorSet.add(actor.toLowerCase().trim())
          }
        })
      }
    })
    aggregated.stats.uniqueThreatActors = threatActorSet.size

    // Calculate sectors from tags
    const sectorKeywords = {
      'Government': ['government', 'offentlig', 'forvaltning', 'municipality', 'federal', 'public-sector', 'defense', 'military', 'gov'],
      'Healthcare': ['healthcare', 'hospital', 'medical', 'health', 'healthcare-data'],
      'Finance': ['banking', 'finance', 'bank', 'financial', 'defi', 'cryptocurrency', 'crypto', 'fintech'],
      'Technology': ['data/it', 'tech', 'software', 'it', 'cloud', 'data', 'enterprise', 'saas', 'cyber', 'microsoft', 'aws', 'google', 'azure', 'offentlig/microsoft'],
      'Education': ['education', 'university', 'school', 'academic', 'academia', 'edu'],
      'Energy': ['energy', 'power', 'utility', 'electric', 'critical-infrastructure', 'oil', 'gas'],
      'Retail': ['retail', 'store', 'commerce', 'e-commerce', 'ecommerce', 'shopping'],
      'Manufacturing': ['manufacturing', 'industrial', 'automotive', 'factory'],
      'Transportation': ['transport', 'airline', 'shipping', 'aviation', 'logistics'],
      'Telecommunications': ['telecom', 'telco', 'network', 'isp', 'connectivity']
    }

    filteredIncidents.forEach(incident => {
      if (incident.tags) {
        const tagsLower = incident.tags.filter(t => typeof t === 'string').map(t => t.toLowerCase())
        const matchedSectors = new Set()
        
        for (const [sector, keywords] of Object.entries(sectorKeywords)) {
          if (keywords.some(keyword => tagsLower.some(tag => tag.includes(keyword)))) {
            matchedSectors.add(sector)
          }
        }
        
        // Check in title as well
        if (matchedSectors.size === 0 && incident.title) {
          const titleLower = incident.title.toLowerCase()
          for (const [sector, keywords] of Object.entries(sectorKeywords)) {
            if (keywords.some(keyword => titleLower.includes(keyword))) {
              matchedSectors.add(sector)
            }
          }
        }
        
        // Count each matched sector once per incident
        matchedSectors.forEach(sector => {
          aggregated.stats.sectors[sector] = (aggregated.stats.sectors[sector] || 0) + 1
        })
      }
    })

    // Calculate attack types from tags
    const attackTypeKeywords = {
      'Data Breach': ['breach', 'data-breach', 'leak', 'exfiltration', 'data-theft', 'data-exposure', 'data-exfiltration', 'exposed', 'stolen'],
      'Malware': ['malware', 'trojan', 'virus', 'botnet', 'worm', 'rat', 'dcrat', 'darkspectre', 'backdoor', 'rootkit'],
      'Ransomware': ['ransomware', 'lockbit', 'blackcat', 'alphv', 'clop', 'ransom', 'encryption'],
      'APT/State-Sponsored': ['apt', 'advanced-persistent', 'nation-state', 'state-sponsored', 'china', 'chinese', 'iranian', 'russian', 'geopolitical', 'espionage'],
      'Vulnerability/Exploit': ['zero-day', '0day', 'vulnerability', 'exploit', 'exploitation', 'cve-', 'patch', 'unpatched'],
      'Phishing': ['phishing', 'spear-phishing', 'social-engineering', 'bec', 'email-spoofing', 'credential'],
      'DDoS': ['ddos', 'denial-of-service', 'dos', 'hacktivist', 'disruption'],
      'Spyware': ['spyware', 'surveillance', 'stalkerware', 'commercial-spyware', 'monitoring'],
      'Cryptomining': ['cryptomining', 'cryptojacking', 'mining', 'crypto'],
      'Disinformation': ['disinformation', 'deepfake', 'ai-abuse', 'misinformation', 'propaganda']
    }

    filteredIncidents.forEach(incident => {
      if (incident.tags) {
        const tagsLower = incident.tags.filter(t => typeof t === 'string').map(t => t.toLowerCase())
        const matchedTypes = new Set()
        
        for (const [attackType, keywords] of Object.entries(attackTypeKeywords)) {
          if (keywords.some(keyword => tagsLower.some(tag => tag.includes(keyword)))) {
            matchedTypes.add(attackType)
          }
        }
        
        // Check in title as well
        if (matchedTypes.size === 0 && incident.title) {
          const titleLower = incident.title.toLowerCase()
          for (const [attackType, keywords] of Object.entries(attackTypeKeywords)) {
            if (keywords.some(keyword => titleLower.includes(keyword))) {
              matchedTypes.add(attackType)
            }
          }
        }
        
        // Count each matched attack type once per incident
        matchedTypes.forEach(attackType => {
          aggregated.stats.attackTypes[attackType] = (aggregated.stats.attackTypes[attackType] || 0) + 1
        })
      }
    })

    // Count reported incidents from the narrative data
    aggregated.stats.reportedIncidents = aggregated.incidents.length

    // Deduplicate and count buzzword frequency
    const buzzwordFreq = {}
    aggregated.buzzwords.forEach(word => {
      buzzwordFreq[word] = (buzzwordFreq[word] || 0) + 1
    })
    aggregated.buzzwords = Object.entries(buzzwordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100) // Show top 100 buzzwords
      .map(([word]) => word)

    // Deduplicate threat actors by name
    const uniqueActors = {}
    aggregated.threatActors.forEach(actor => {
      if (!uniqueActors[actor.name]) {
        uniqueActors[actor.name] = actor
      }
    })
    aggregated.threatActors = Object.values(uniqueActors).slice(0, 10)

    return aggregated
  }, [selectedYear, selectedMonth, selectedRegion, incidents])

  // Helper to convert month index to name
  function getMonthName(monthIndex) {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ]
    return months[monthIndex] || 'january'
  }

  // Don't render if not 2026 or no data
  if (!dashboardData) {
    return null
  }

  return (
    <div className="trend-dashboard">
      <h2 className="dashboard-title">News Summary & Trends {selectedYear}</h2>

      {/* Buzzword Cloud Section */}
      <BuzzwordCloud 
        buzzwords={dashboardData.buzzwords}
        selectedBuzzwords={[]}
        onBuzzwordClick={() => {}}
      />

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Statistics Overview */}
        <div className="dashboard-card stats-card">
          <h3>📊 Statistics</h3>
          <div className="stat-item interactive-stat" title="Total number of incidents recorded in 2026">
            <span className="stat-label">Total incidents:</span>
            <span className="stat-value highlight-number">{dashboardData.stats.totalIncidents.toLocaleString()}</span>
          </div>
          <div className="stat-item interactive-stat" title="Unique threat actors identified">
            <span className="stat-label">Unique threat actors:</span>
            <span className="stat-value highlight-number">{dashboardData.stats.uniqueThreatActors.toLocaleString()}</span>
          </div>
          <div className="stat-item interactive-stat" title="Curated narrative reports">
            <span className="stat-label">Curated reports:</span>
            <span className="stat-value highlight-number">{dashboardData.stats.reportedIncidents.toLocaleString()}</span>
          </div>
        </div>

        {/* Threat Actors */}
        <div className="dashboard-card threat-actors-card">
          <h3>🎯 Threat Actors</h3>
          {dashboardData.threatActors.length > 0 ? (
            <ul className="threat-actor-list">
              {dashboardData.threatActors.map((actor, index) => (
                <li key={index} className="threat-actor-item">
                  <strong>{actor.name}</strong>
                  <span className="threat-actor-date"> ({actor.date || 'Date unknown'})</span>
                  <p>{actor.activity?.substring(0, 150) || 'No activity description available'}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No threat actors reported</p>
          )}
        </div>

        {/* Top Sectors */}
        <div className="dashboard-card sectors-card">
          <h3>🏢 Most Targeted Sectors</h3>
          {Object.keys(dashboardData.stats.sectors).length > 0 ? (
            <ul className="sector-list">
              {Object.entries(dashboardData.stats.sectors)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([sector, count]) => (
                  <li key={sector} className="sector-item" title={`${count} incident${count !== 1 ? 's' : ''} in ${sector}`}>
                    <span className="sector-name">{sector}</span>
                    <span className="sector-count">{count}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="no-data">No sector data available</p>
          )}
        </div>

        {/* Attack Types */}
        <div className="dashboard-card attack-types-card">
          <h3>⚔️ Attack Types</h3>
          {Object.keys(dashboardData.stats.attackTypes).length > 0 ? (
            <ul className="attack-type-list">
              {Object.entries(dashboardData.stats.attackTypes)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([type, count]) => (
                  <li key={type} className="attack-type-item" title={`${count} incident${count !== 1 ? 's' : ''} of ${type}`}>
                    <span className="attack-type-name">{type}</span>
                    <span className="attack-type-count">{count}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="no-data">No attack type data available</p>
          )}
        </div>

        {/* Recent Trends */}
        <div className="dashboard-card trends-card">
          <h3>📈 Key Trends</h3>
          {dashboardData.trends.length > 0 ? (
            <ul className="trends-list">
              {dashboardData.trends.slice(0, 5).map((trend, index) => (
                <li key={index} className="trend-item">
                  {trend}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No trends reported</p>
          )}
        </div>

        {/* Recent Legislation */}
        <div className="dashboard-card legislation-card">
          <h3>📜 Legislation & Policy</h3>
          {dashboardData.legislation.length > 0 ? (
            <ul className="legislation-list">
              {dashboardData.legislation.slice(0, 5).map((item, index) => (
                <li key={index} className="legislation-item">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No legislation updates</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrendDashboard
