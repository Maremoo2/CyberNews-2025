import { useState, useEffect, useMemo } from 'react'
import './App.css'
import incidentsData from '../data/incidents.json'

// Month helpers
const MONTHS_NO = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember"
];

function getMonthIndex(dateStr) {
  // dateStr: "YYYY-MM-DD"
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d.getMonth(); // 0-11
}

function App() {
  const [selectedRegion, setSelectedRegion] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('ALL') // "ALL" | 0..11

  // Get region counts (filtered by month if selected)
  const regionCounts = useMemo(() => {
    let dataToCount = incidentsData
    
    // Filter by month first if selected
    if (selectedMonth !== 'ALL') {
      dataToCount = incidentsData.filter(incident => {
        const m = getMonthIndex(incident.date)
        return m === selectedMonth
      })
    }
    
    const counts = {
      US: 0,
      EU: 0,
      ASIA: 0,
      NO: 0,
      ALL: dataToCount.length
    }
    dataToCount.forEach(incident => {
      if (incident.region in counts) {
        counts[incident.region]++
      }
    })
    return counts
  }, [selectedMonth])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set()
    incidentsData.forEach(incident => {
      if (incident.tags) {
        incident.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  }, [])

  // Filter and sort incidents
  const filteredIncidents = useMemo(() => {
    let filtered = incidentsData

    // Filter by month
    if (selectedMonth !== 'ALL') {
      filtered = filtered.filter(incident => {
        const m = getMonthIndex(incident.date)
        return m === selectedMonth
      })
    }

    // Filter by region
    if (selectedRegion !== 'ALL') {
      filtered = filtered.filter(incident => incident.region === selectedRegion)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(incident => {
        const matchesTitle = incident.title.toLowerCase().includes(query)
        const matchesSummary = incident.summary.toLowerCase().includes(query)
        const matchesTags = incident.tags?.some(tag => tag.toLowerCase().includes(query))
        return matchesTitle || matchesSummary || matchesTags
      })
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(incident => {
        return incident.tags?.some(tag => selectedTags.includes(tag))
      })
    }

    // Sort by date descending (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [selectedMonth, selectedRegion, searchQuery, selectedTags])

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nb-NO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Generate empty state message based on active filters
  const getEmptyStateMessage = () => {
    const filters = []
    if (selectedMonth !== 'ALL') filters.push(MONTHS_NO[selectedMonth])
    if (selectedRegion !== 'ALL') {
      const regionNames = { US: 'USA', EU: 'Europa', ASIA: 'Asia', NO: 'Norge' }
      filters.push(regionNames[selectedRegion])
    }
    if (selectedTags.length > 0) filters.push(`tag: ${selectedTags.join(', ')}`)
    if (searchQuery.trim()) filters.push(`søk: "${searchQuery}"`)
    
    if (filters.length > 0) {
      return `Ingen treff for ${filters.join(' + ')}`
    }
    return 'Ingen hendelser funnet'
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Security News Year in Review 2025</h1>
        <p className="subtitle">Oversikt over cybersikkerhetshendelser</p>
      </header>

      {/* Region Filter */}
      <div className="region-filter">
        <button 
          className={selectedRegion === 'ALL' ? 'active' : ''}
          onClick={() => setSelectedRegion('ALL')}
        >
          Alle ({regionCounts.ALL})
        </button>
        <button 
          className={selectedRegion === 'US' ? 'active' : ''}
          onClick={() => setSelectedRegion('US')}
        >
          USA ({regionCounts.US})
        </button>
        <button 
          className={selectedRegion === 'EU' ? 'active' : ''}
          onClick={() => setSelectedRegion('EU')}
        >
          Europa ({regionCounts.EU})
        </button>
        <button 
          className={selectedRegion === 'ASIA' ? 'active' : ''}
          onClick={() => setSelectedRegion('ASIA')}
        >
          Asia ({regionCounts.ASIA})
        </button>
        <button 
          className={selectedRegion === 'NO' ? 'active' : ''}
          onClick={() => setSelectedRegion('NO')}
        >
          Norge ({regionCounts.NO})
        </button>
      </div>

      {/* Month Filter */}
      <div className="month-filter-container">
        {/* Dropdown for mobile */}
        <select 
          className="month-dropdown"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
        >
          <option value="ALL">Alle måneder</option>
          {MONTHS_NO.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>

        {/* Buttons for desktop */}
        <div className="month-buttons">
          <button 
            className={selectedMonth === 'ALL' ? 'active' : ''}
            onClick={() => setSelectedMonth('ALL')}
          >
            Alle
          </button>
          {MONTHS_NO.map((month, index) => (
            <button
              key={index}
              className={selectedMonth === index ? 'active' : ''}
              onClick={() => setSelectedMonth(index)}
            >
              {month.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input 
          type="text"
          className="search-input"
          placeholder="Søk i tittel, sammendrag eller tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tag Chips */}
      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <span className="tag-label">Valgte tags:</span>
          {selectedTags.map(tag => (
            <button 
              key={tag} 
              className="tag-chip selected"
              onClick={() => handleTagClick(tag)}
            >
              {tag} ×
            </button>
          ))}
        </div>
      )}

      {/* Incidents List */}
      <main className="incidents-container">
        {filteredIncidents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>{getEmptyStateMessage()}</h2>
            <p>Prøv å endre søkekriteriene eller velg en annen måned/region.</p>
          </div>
        ) : (
          <div className="incidents-list">
            {filteredIncidents.map(incident => (
              <article key={incident.id} className="incident-card">
                <div className="incident-header">
                  <time className="incident-date">{formatDate(incident.date)}</time>
                  <span className={`region-badge ${incident.region.toLowerCase()}`}>
                    {incident.region}
                  </span>
                </div>
                <h2 className="incident-title">
                  <a href={incident.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {incident.title}
                  </a>
                </h2>
                <p className="incident-summary">{incident.summary}</p>
                <div className="incident-footer">
                  <span className="source-name">
                    Kilde: {incident.sourceName}
                    {incident.country && ` • ${incident.country}`}
                  </span>
                  {incident.tags && incident.tags.length > 0 && (
                    <div className="tags">
                      {incident.tags.map(tag => (
                        <button
                          key={tag}
                          className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Security News Year in Review 2025 • Oppdatert {new Date().toLocaleDateString('nb-NO')}</p>
      </footer>
    </div>
  )
}

export default App
