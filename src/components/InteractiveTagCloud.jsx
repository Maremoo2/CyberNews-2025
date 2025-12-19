import { useMemo } from 'react'
import './InteractiveTagCloud.css'

function InteractiveTagCloud({ incidents, selectedTags, onTagClick }) {
  // Calculate tag frequencies
  const tagFrequencies = useMemo(() => {
    const frequencies = {}
    incidents.forEach(incident => {
      if (incident.tags) {
        incident.tags.forEach(tag => {
          frequencies[tag] = (frequencies[tag] || 0) + 1
        })
      }
    })
    
    // Sort by frequency and take top 15
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tag, count]) => ({ tag, count }))
  }, [incidents])

  // Calculate font size based on frequency (normalized)
  const getTagSize = (count) => {
    const maxCount = Math.max(...tagFrequencies.map(t => t.count))
    const minCount = Math.min(...tagFrequencies.map(t => t.count))
    const range = maxCount - minCount || 1
    const normalized = (count - minCount) / range
    // Size between 0.9rem and 2rem
    return 0.9 + (normalized * 1.1)
  }

  if (tagFrequencies.length === 0) {
    return null
  }

  return (
    <div className="tag-cloud-container">
      <h3 className="tag-cloud-title">Nøkkelord 2025</h3>
      <div className="tag-cloud">
        {tagFrequencies.map(({ tag, count }) => (
          <button
            key={tag}
            className={`cloud-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => onTagClick(tag)}
            style={{ fontSize: `${getTagSize(count)}rem` }}
            title={`${tag} (${count} hendelser)`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default InteractiveTagCloud
