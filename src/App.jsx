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
  // Validate format and extract month directly from string
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const month = parseInt(dateStr.substring(5, 7), 10) - 1; // Convert to 0-11
  return (month >= 0 && month <= 11) ? month : null;
}

// Monthly summaries
const MONTH_SUMMARIES = {
  11: "Desember 2025: Ransomware dominerte helsesektoren, samtidig som flere statlige aktører var involvert i målrettede angrep.",
  10: "November 2025: Massive datainnbrudd og statsstøttede trusler preget måneden, med særlig fokus på finanssektoren.",
  9: "Oktober 2025: Målrettede angrep mot norske bedrifter og kritisk infrastruktur.",
};

// Helper to parse initial state from URL
function getInitialStateFromURL() {
  const params = new URLSearchParams(window.location.search)
  const state = {
    month: 'ALL',
    region: 'ALL',
    tags: [],
    major: false
  }
  
  // Month parameter (m=jan, m=0-11, or month=january)
  const monthParam = params.get('m') || params.get('month')
  if (monthParam) {
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mai': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
    }
    const monthIndex = monthMap[monthParam.toLowerCase()] ?? parseInt(monthParam, 10)
    if (monthIndex >= 0 && monthIndex <= 11) {
      state.month = monthIndex
    }
  }
  
  // Region parameter (r=no, region=NO)
  const regionParam = params.get('r') || params.get('region')
  if (regionParam) {
    const region = regionParam.toUpperCase()
    if (['US', 'EU', 'ASIA', 'NO'].includes(region)) {
      state.region = region
    }
  }
  
  // Tag parameter (t=ransomware or tag=ransomware)
  const tagParam = params.get('t') || params.get('tag')
  if (tagParam) {
    state.tags = [tagParam]
  }
  
  // Major filter parameter (major=true)
  const majorParam = params.get('major')
  if (majorParam === 'true' || majorParam === '1') {
    state.major = true
  }
  
  return state
}

function App() {
  const initialState = getInitialStateFromURL()
  const [selectedRegion, setSelectedRegion] = useState(initialState.region)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState(initialState.tags)
  const [selectedMonth, setSelectedMonth] = useState(initialState.month)
  const [showMajorOnly, setShowMajorOnly] = useState(initialState.major)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (selectedMonth !== 'ALL') {
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']
      params.set('m', monthNames[selectedMonth])
    }
    
    if (selectedRegion !== 'ALL') {
      params.set('r', selectedRegion.toLowerCase())
    }
    
    if (selectedTags.length === 1) {
      params.set('t', selectedTags[0])
    }
    
    if (showMajorOnly) {
      params.set('major', 'true')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [selectedMonth, selectedRegion, selectedTags, showMajorOnly])

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

    // Filter by major incidents only
    if (showMajorOnly) {
      filtered = filtered.filter(incident => incident.impact >= 4)
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
  }, [selectedMonth, selectedRegion, searchQuery, selectedTags, showMajorOnly])

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
        {/* Monthly Summary */}
        {selectedMonth !== 'ALL' && MONTH_SUMMARIES[selectedMonth] && (
          <div className="month-summary">
            {MONTH_SUMMARIES[selectedMonth]}
          </div>
        )}

        {/* Dropdown for mobile */}
        <select 
          className="month-dropdown"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))}
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

      {/* Major Incidents Toggle */}
      <div className="major-filter-container">
        <label className="major-toggle">
          <input
            type="checkbox"
            checked={showMajorOnly}
            onChange={(e) => setShowMajorOnly(e.target.checked)}
          />
          <span className="toggle-label">Kun største saker (impact ≥ 4)</span>
        </label>
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
        <p>
          Dekker 2025 • {incidentsData.length} hendelser • Sist oppdatert {new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'numeric', year: 'numeric' })}
        </p>
      </footer>
    </div>
  )
}

export default App
