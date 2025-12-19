import { useMemo } from 'react'
import './YearStats.css'

const MONTHS_NO = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember"
]

function YearStats({ incidents }) {
  const stats = useMemo(() => {
    // Count by region
    const regions = new Set()
    incidents.forEach(incident => {
      if (incident.region) {
        regions.add(incident.region)
      }
    })

    // Find most common tag
    const tagCounts = {}
    incidents.forEach(incident => {
      if (incident.tags) {
        incident.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })
    const mostCommonTag = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])[0]

    // Find busiest month
    const monthCounts = Array(12).fill(0)
    incidents.forEach(incident => {
      if (incident.date) {
        const month = parseInt(incident.date.substring(5, 7), 10) - 1
        if (month >= 0 && month <= 11) {
          monthCounts[month]++
        }
      }
    })
    const busiestMonthIndex = monthCounts.indexOf(Math.max(...monthCounts))

    return {
      totalIncidents: incidents.length,
      regionsCount: regions.size,
      mostCommonTag: mostCommonTag ? mostCommonTag[0] : 'N/A',
      busiestMonth: MONTHS_NO[busiestMonthIndex] || 'N/A'
    }
  }, [incidents])

  return (
    <div className="year-stats-container">
      <h3 className="year-stats-title">2025 i korte trekk</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{stats.totalIncidents}</div>
          <div className="stat-label">hendelser</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.regionsCount}</div>
          <div className="stat-label">regioner</div>
        </div>
        <div className="stat-item">
          <div className="stat-text">{stats.mostCommonTag}</div>
          <div className="stat-label">mest brukte tema</div>
        </div>
        <div className="stat-item">
          <div className="stat-text">{stats.busiestMonth}</div>
          <div className="stat-label">toppmåned</div>
        </div>
      </div>
    </div>
  )
}

export default YearStats
