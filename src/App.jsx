import { useState, useEffect, useMemo } from 'react'
import './App.css'
import incidentsData from '../data/incidents.json'

function App() {
  const [selectedRegion, setSelectedRegion] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  // Get region counts
  const regionCounts = useMemo(() => {
    const counts = {
      US: 0,
      EU: 0,
      ASIA: 0,
      NO: 0,
      ALL: incidentsData.length
    }
    incidentsData.forEach(incident => {
      if (counts.hasOwnProperty(incident.region)) {
        counts[incident.region]++
      }
    })
    return counts
  }, [])

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
  }, [selectedRegion, searchQuery, selectedTags])

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
            <h2>Ingen hendelser funnet</h2>
            <p>Prøv å endre søkekriteriene eller velg en annen region.</p>
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
