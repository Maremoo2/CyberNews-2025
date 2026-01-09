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
      if (incident.aiAnalysis?.threatActors) {
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
      'Healthcare': ['healthcare', 'hospital', 'medical', 'health'],
      'Government': ['government', 'offentlig', 'forvaltning', 'municipality', 'federal'],
      'Finance': ['banking', 'finance', 'bank', 'financial'],
      'Education': ['education', 'university', 'school', 'academic'],
      'Energy': ['energy', 'power', 'utility', 'electric'],
      'Technology': ['tech', 'software', 'it', 'cloud', 'data'],
      'Retail': ['retail', 'store', 'commerce'],
      'Manufacturing': ['manufacturing', 'industrial'],
      'Transportation': ['transport', 'airline', 'shipping'],
      'Telecommunications': ['telecom', 'telco', 'network']
    }

    filteredIncidents.forEach(incident => {
      if (incident.tags) {
        const tagsLower = incident.tags.map(t => t.toLowerCase())
        let sectorFound = false
        
        for (const [sector, keywords] of Object.entries(sectorKeywords)) {
          if (keywords.some(keyword => tagsLower.some(tag => tag.includes(keyword)))) {
            aggregated.stats.sectors[sector] = (aggregated.stats.sectors[sector] || 0) + 1
            sectorFound = true
            break // Only count once per incident
          }
        }
        
        // Check in title and summary as well
        if (!sectorFound && incident.title) {
          const titleLower = incident.title.toLowerCase()
          for (const [sector, keywords] of Object.entries(sectorKeywords)) {
            if (keywords.some(keyword => titleLower.includes(keyword))) {
              aggregated.stats.sectors[sector] = (aggregated.stats.sectors[sector] || 0) + 1
              break
            }
          }
        }
      }
    })

    // Calculate attack types from tags
    const attackTypeKeywords = {
      'Ransomware': ['ransomware', 'lockbit', 'blackcat', 'alphv'],
      'DDoS': ['ddos', 'denial-of-service', 'dos'],
      'Malware': ['malware', 'trojan', 'virus', 'botnet', 'worm'],
      'Phishing': ['phishing', 'spear-phishing', 'social-engineering'],
      'Data Breach': ['breach', 'data-breach', 'leak', 'exfiltration'],
      'APT': ['apt', 'advanced-persistent', 'nation-state', 'state-sponsored'],
      'Supply Chain': ['supply-chain', 'third-party', 'vendor'],
      'Zero-Day': ['zero-day', '0day', 'vulnerability', 'exploit'],
      'Cryptomining': ['cryptomining', 'cryptojacking', 'mining'],
      'Spyware': ['spyware', 'surveillance', 'stalkerware']
    }

    filteredIncidents.forEach(incident => {
      if (incident.tags) {
        const tagsLower = incident.tags.map(t => t.toLowerCase())
        let typeFound = false
        
        for (const [attackType, keywords] of Object.entries(attackTypeKeywords)) {
          if (keywords.some(keyword => tagsLower.some(tag => tag.includes(keyword)))) {
            aggregated.stats.attackTypes[attackType] = (aggregated.stats.attackTypes[attackType] || 0) + 1
            typeFound = true
            break // Only count once per incident
          }
        }
        
        // Check in title as well
        if (!typeFound && incident.title) {
          const titleLower = incident.title.toLowerCase()
          for (const [attackType, keywords] of Object.entries(attackTypeKeywords)) {
            if (keywords.some(keyword => titleLower.includes(keyword))) {
              aggregated.stats.attackTypes[attackType] = (aggregated.stats.attackTypes[attackType] || 0) + 1
              break
            }
          }
        }
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
          <div className="stat-item">
            <span className="stat-label">Total incidents:</span>
            <span className="stat-value">{dashboardData.stats.totalIncidents}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Unique threat actors:</span>
            <span className="stat-value">{dashboardData.stats.uniqueThreatActors}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Curated reports:</span>
            <span className="stat-value">{dashboardData.stats.reportedIncidents}</span>
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
                .slice(0, 5)
                .map(([sector, count]) => (
                  <li key={sector} className="sector-item">
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
                .slice(0, 5)
                .map(([type, count]) => (
                  <li key={type} className="attack-type-item">
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
