import { useMemo } from 'react'
import BuzzwordCloud from './BuzzwordCloud'
import './TrendDashboard.css'

// Import aggregated news data
import newsData2026 from '../../data/news-aggregated-2026.json'

const MONTH_NAMES = {
  january: 'Januar',
  february: 'Februar',
  march: 'Mars',
  april: 'April',
  may: 'Mai',
  june: 'Juni',
  july: 'Juli',
  august: 'August',
  september: 'September',
  october: 'Oktober',
  november: 'November',
  december: 'Desember'
}

const REGION_NAMES = {
  norway: 'Norge',
  eu: 'EU',
  us: 'USA',
  asia: 'Asia'
}

function TrendDashboard({ selectedYear, selectedMonth, selectedRegion }) {
  // Get data for selected parameters
  const dashboardData = useMemo(() => {
    if (selectedYear !== 2026) {
      return null
    }

    const yearData = newsData2026['2026']
    if (!yearData) return null

    // Get month key from index
    const monthKeys = Object.keys(MONTH_NAMES)
    const monthKey = selectedMonth !== null ? monthKeys[selectedMonth] : null

    // If specific month selected, show that month
    if (monthKey && yearData[monthKey]) {
      const monthData = yearData[monthKey]
      
      // Filter by region if specific region selected
      if (selectedRegion && selectedRegion !== 'ALL') {
        const regionKey = selectedRegion.toLowerCase()
        if (monthData[regionKey]) {
          return {
            month: monthKey,
            regions: { [regionKey]: monthData[regionKey] }
          }
        }
        return null
      }
      
      return {
        month: monthKey,
        regions: monthData
      }
    }

    // Show all months if no specific month selected
    return {
      month: null,
      regions: yearData
    }
  }, [selectedYear, selectedMonth, selectedRegion])

  // Calculate aggregated stats
  const stats = useMemo(() => {
    if (!dashboardData) return null

    let totalIncidents = 0
    let buzzwordMap = {}
    let threatActorMap = {}
    let attackTypeMap = {}
    let regionStats = {}

    const processRegionData = (regionKey, regionData) => {
      if (!regionData) return

      totalIncidents += regionData.totalIncidents || 0
      
      // Aggregate buzzwords
      if (regionData.buzzwords) {
        regionData.buzzwords.forEach(word => {
          buzzwordMap[word] = (buzzwordMap[word] || 0) + 1
        })
      }

      // Aggregate threat actors
      if (regionData.threatActors) {
        regionData.threatActors.forEach(actor => {
          threatActorMap[actor.name] = (threatActorMap[actor.name] || 0) + 1
        })
      }

      // Aggregate attack types from incidents
      if (regionData.incidents) {
        regionData.incidents.forEach(incident => {
          if (incident.attackType) {
            attackTypeMap[incident.attackType] = (attackTypeMap[incident.attackType] || 0) + 1
          }
        })
      }

      // Store region stats
      regionStats[regionKey] = {
        incidents: regionData.totalIncidents || 0,
        sector: regionData.mostTargetedSector || 'N/A',
        attackType: regionData.mostCommonAttackType || 'N/A'
      }
    }

    if (dashboardData.month) {
      // Single month view
      Object.entries(dashboardData.regions).forEach(([regionKey, regionData]) => {
        processRegionData(regionKey, regionData)
      })
    } else {
      // All months view
      Object.entries(dashboardData.regions).forEach(([, monthData]) => {
        Object.entries(monthData).forEach(([regionKey, regionData]) => {
          processRegionData(regionKey, regionData)
        })
      })
    }

    // Sort buzzwords by frequency
    const topBuzzwords = Object.entries(buzzwordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word)

    // Sort threat actors by frequency
    const topThreatActors = Object.entries(threatActorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Sort attack types by frequency
    const topAttackTypes = Object.entries(attackTypeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      totalIncidents,
      topBuzzwords,
      topThreatActors,
      topAttackTypes,
      regionStats
    }
  }, [dashboardData])

  if (selectedYear !== 2026 || !dashboardData || !stats) {
    return (
      <div className="trend-dashboard">
        <div className="dashboard-placeholder">
          <p>📊 Velg 2026 for å se trendanalyse og aggregert data</p>
        </div>
      </div>
    )
  }

  const monthName = dashboardData.month ? MONTH_NAMES[dashboardData.month] : 'Alle måneder'

  return (
    <div className="trend-dashboard">
      <h2 className="dashboard-title">
        📊 Trendanalyse - {monthName} 2026
      </h2>

      {/* Buzzword Cloud */}
      <BuzzwordCloud 
        buzzwords={stats.topBuzzwords}
        selectedBuzzwords={[]}
        onBuzzwordClick={null}
      />

      <div className="dashboard-grid">
        {/* Total Incidents */}
        <div className="dashboard-card">
          <h3 className="card-title">📈 Totalt antall hendelser</h3>
          <div className="card-stat-large">{stats.totalIncidents}</div>
        </div>

        {/* Top Threat Actors */}
        <div className="dashboard-card">
          <h3 className="card-title">🎯 Aktive trusselaktører</h3>
          <div className="threat-actor-list">
            {stats.topThreatActors.length > 0 ? (
              stats.topThreatActors.map(([name, count]) => (
                <div key={name} className="threat-actor-item">
                  <span className="actor-name">{name}</span>
                  <span className="actor-count">{count}</span>
                </div>
              ))
            ) : (
              <p className="no-data">Ingen data tilgjengelig</p>
            )}
          </div>
        </div>

        {/* Top Attack Types */}
        <div className="dashboard-card">
          <h3 className="card-title">⚔️ Mest vanlige angrepstyper</h3>
          <div className="attack-type-list">
            {stats.topAttackTypes.length > 0 ? (
              stats.topAttackTypes.map(([type, count]) => (
                <div key={type} className="attack-type-item">
                  <span className="attack-type-name">{type}</span>
                  <div className="attack-type-bar">
                    <div 
                      className="attack-type-bar-fill" 
                      style={{ 
                        width: `${stats.totalIncidents > 0 ? (count / stats.totalIncidents) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="attack-type-count">{count}</span>
                </div>
              ))
            ) : (
              <p className="no-data">Ingen data tilgjengelig</p>
            )}
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="dashboard-card">
          <h3 className="card-title">🌍 Regional oversikt</h3>
          <div className="region-stats">
            {Object.entries(stats.regionStats).map(([regionKey, data]) => (
              <div key={regionKey} className="region-stat-item">
                <div className="region-header">
                  <span className="region-name">
                    {REGION_NAMES[regionKey] || regionKey.toUpperCase()}
                  </span>
                  <span className="region-count">{data.incidents} hendelser</span>
                </div>
                <div className="region-details">
                  <div className="region-detail">
                    <span className="detail-label">Sektor:</span>
                    <span className="detail-value">{data.sector}</span>
                  </div>
                  <div className="region-detail">
                    <span className="detail-label">Angrepstype:</span>
                    <span className="detail-value">{data.attackType}</span>
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(stats.regionStats).length === 0 && (
              <p className="no-data">Ingen data tilgjengelig</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendDashboard
