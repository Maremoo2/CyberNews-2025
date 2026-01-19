import { useMemo } from 'react'
import './YearStats.css'

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function YearStats({ incidents, selectedYear }) {
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
    const tagEntries = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])
    const mostCommonTag = tagEntries.length > 0 ? tagEntries[0][0] : 'N/A'

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
    const maxMonthCount = Math.max(...monthCounts)
    const busiestMonthIndex = maxMonthCount > 0 ? monthCounts.indexOf(maxMonthCount) : -1

    return {
      totalIncidents: incidents.length,
      regionsCount: regions.size,
      mostCommonTag,
      busiestMonth: busiestMonthIndex >= 0 ? MONTHS_EN[busiestMonthIndex] : 'N/A'
    }
  }, [incidents])

  return (
    <div className="year-stats-container">
      <h3 className="year-stats-title">{selectedYear} At a Glance</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{stats.totalIncidents}</div>
          <div className="stat-label">articles/items</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.regionsCount}</div>
          <div className="stat-label">regions</div>
        </div>
        <div className="stat-item">
          <div className="stat-text">{stats.mostCommonTag}</div>
          <div className="stat-label">most used tag</div>
        </div>
        <div className="stat-item">
          <div className="stat-text">{stats.busiestMonth}</div>
          <div className="stat-label">busiest month</div>
        </div>
      </div>
    </div>
  )
}

export default YearStats
