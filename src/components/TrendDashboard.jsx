import { useMemo } from 'react'
import BuzzwordCloud from './BuzzwordCloud'
import './TrendDashboard.css'

// Import aggregated news data
import newsData from '../../data/news-aggregated-2026.json'

function TrendDashboard({ selectedYear, selectedMonth, selectedRegion }) {
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

    // Aggregate data across selected months and regions
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

        // Aggregate incidents
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

        // Aggregate stats
        aggregated.stats.totalIncidents += regionData.totalIncidents || 0

        // Track sectors
        if (regionData.mostTargetedSector && regionData.mostTargetedSector !== 'N/A') {
          aggregated.stats.sectors[regionData.mostTargetedSector] = 
            (aggregated.stats.sectors[regionData.mostTargetedSector] || 0) + 1
        }

        // Track attack types
        if (regionData.mostCommonAttackType && regionData.mostCommonAttackType !== 'N/A') {
          aggregated.stats.attackTypes[regionData.mostCommonAttackType] = 
            (aggregated.stats.attackTypes[regionData.mostCommonAttackType] || 0) + 1
        }
      }
    }

    // Deduplicate and count buzzword frequency
    const buzzwordFreq = {}
    aggregated.buzzwords.forEach(word => {
      buzzwordFreq[word] = (buzzwordFreq[word] || 0) + 1
    })
    aggregated.buzzwords = Object.entries(buzzwordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
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
  }, [selectedYear, selectedMonth, selectedRegion])

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
      <h2 className="dashboard-title">Nyhetssammendrag & Trender {selectedYear}</h2>

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
          <h3>📊 Statistikk</h3>
          <div className="stat-item">
            <span className="stat-label">Totale hendelser:</span>
            <span className="stat-value">{dashboardData.stats.totalIncidents}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Unike trusselaktører:</span>
            <span className="stat-value">{dashboardData.threatActors.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Rapporterte hendelser:</span>
            <span className="stat-value">{dashboardData.incidents.length}</span>
          </div>
        </div>

        {/* Threat Actors */}
        <div className="dashboard-card threat-actors-card">
          <h3>🎯 Trusselaktører</h3>
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
            <p className="no-data">Ingen trusselaktører rapportert</p>
          )}
        </div>

        {/* Top Sectors */}
        <div className="dashboard-card sectors-card">
          <h3>🏢 Mest Målrettede Sektorer</h3>
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
            <p className="no-data">Ingen sektordata tilgjengelig</p>
          )}
        </div>

        {/* Attack Types */}
        <div className="dashboard-card attack-types-card">
          <h3>⚔️ Angrepstyper</h3>
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
            <p className="no-data">Ingen angrepstypedata tilgjengelig</p>
          )}
        </div>

        {/* Recent Trends */}
        <div className="dashboard-card trends-card">
          <h3>📈 Nøkkeltrender</h3>
          {dashboardData.trends.length > 0 ? (
            <ul className="trends-list">
              {dashboardData.trends.slice(0, 5).map((trend, index) => (
                <li key={index} className="trend-item">
                  {trend}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Ingen trender rapportert</p>
          )}
        </div>

        {/* Recent Legislation */}
        <div className="dashboard-card legislation-card">
          <h3>📜 Lovgivning & Policy</h3>
          {dashboardData.legislation.length > 0 ? (
            <ul className="legislation-list">
              {dashboardData.legislation.slice(0, 5).map((item, index) => (
                <li key={index} className="legislation-item">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Ingen lovgivningsoppdateringer</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrendDashboard
