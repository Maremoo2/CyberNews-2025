import { useMemo } from 'react'
import './YearWheel.css'

const MONTHS_NO = [
  "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Des"
]

function YearWheel({ incidents, selectedMonth, onMonthClick }) {
  // Calculate incidents per month
  const monthCounts = useMemo(() => {
    const counts = Array(12).fill(0)
    incidents.forEach(incident => {
      if (incident.date) {
        const month = parseInt(incident.date.substring(5, 7), 10) - 1
        if (month >= 0 && month <= 11) {
          counts[month]++
        }
      }
    })
    return counts
  }, [incidents])

  const maxCount = Math.max(...monthCounts)

  // Calculate the intensity (0-1) for coloring
  const getIntensity = (count) => {
    if (maxCount === 0) return 0
    return count / maxCount
  }

  // Generate SVG path for each month segment
  const generateSegmentPath = (index) => {
    const centerX = 150
    const centerY = 150
    const outerRadius = 130
    const innerRadius = 60
    
    // Each segment is 30 degrees (360/12)
    const startAngle = (index * 30 - 90) * (Math.PI / 180) // -90 to start at top
    const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180)
    
    const x1 = centerX + innerRadius * Math.cos(startAngle)
    const y1 = centerY + innerRadius * Math.sin(startAngle)
    const x2 = centerX + outerRadius * Math.cos(startAngle)
    const y2 = centerY + outerRadius * Math.sin(startAngle)
    const x3 = centerX + outerRadius * Math.cos(endAngle)
    const y3 = centerY + outerRadius * Math.sin(endAngle)
    const x4 = centerX + innerRadius * Math.cos(endAngle)
    const y4 = centerY + innerRadius * Math.sin(endAngle)
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`
  }

  // Calculate position for month label
  const getLabelPosition = (index) => {
    const centerX = 150
    const centerY = 150
    const labelRadius = 95
    
    const angle = (index * 30 - 90 + 15) * (Math.PI / 180) // +15 for center of segment
    const x = centerX + labelRadius * Math.cos(angle)
    const y = centerY + labelRadius * Math.sin(angle)
    
    return { x, y }
  }

  return (
    <div className="year-wheel-container">
      <h3 className="year-wheel-title">Årshjul 2025</h3>
      <p className="year-wheel-subtitle">Klikk på en måned for å filtrere</p>
      
      <svg className="year-wheel-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        {/* Month segments */}
        {MONTHS_NO.map((month, index) => {
          const intensity = getIntensity(monthCounts[index])
          const isSelected = selectedMonth === index
          const count = monthCounts[index]
          
          return (
            <g key={index}>
              <path
                d={generateSegmentPath(index)}
                className={`month-segment ${isSelected ? 'selected' : ''}`}
                style={{
                  fill: isSelected 
                    ? '#667eea' 
                    : `rgba(102, 126, 234, ${0.15 + intensity * 0.7})`,
                  stroke: isSelected ? '#667eea' : '#dee2e6',
                  strokeWidth: isSelected ? 3 : 1
                }}
                onClick={() => onMonthClick(index)}
              >
                <title>{`${month}: ${count} hendelser`}</title>
              </path>
            </g>
          )
        })}
        
        {/* Month labels */}
        {MONTHS_NO.map((month, index) => {
          const pos = getLabelPosition(index)
          const isSelected = selectedMonth === index
          
          return (
            <text
              key={`label-${index}`}
              x={pos.x}
              y={pos.y}
              className={`month-label ${isSelected ? 'selected' : ''}`}
              textAnchor="middle"
              dominantBaseline="middle"
              onClick={() => onMonthClick(index)}
            >
              {month}
            </text>
          )
        })}
        
        {/* Center text */}
        <text
          x="150"
          y="145"
          className="center-text-year"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          2025
        </text>
        <text
          x="150"
          y="165"
          className="center-text-count"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {incidents.length} hendelser
        </text>
      </svg>
      
      {selectedMonth !== 'ALL' && (
        <button className="reset-wheel-btn" onClick={() => onMonthClick('ALL')}>
          Vis alle måneder
        </button>
      )}
    </div>
  )
}

export default YearWheel
