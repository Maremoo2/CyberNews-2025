import { useState, useEffect, useMemo, useCallback } from 'react'
import './App.css'
import incidents2025 from '../data/incidents-2025.json'
import incidents2026 from '../data/incidents-2026.json'
import InteractiveTagCloud from './components/InteractiveTagCloud'
import YearWheel from './components/YearWheel'
import YearStats from './components/YearStats'
import TrendDashboard from './components/TrendDashboard'

// Month helpers
const MONTHS_NO = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember"
];

// Impact badge configuration
const IMPACT_STYLES = {
  5: { label: 'Kritisk', className: 'impact-critical', emoji: '🔴' },
  4: { label: 'Alvorlig', className: 'impact-high', emoji: '🟠' },
  3: { label: 'Moderat', className: 'impact-moderate', emoji: '⚪' }
};

function getMonthIndex(dateStr) {
  // dateStr: "YYYY-MM-DD"
  // Validate format and extract month directly from string
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const month = parseInt(dateStr.substring(5, 7), 10) - 1; // Convert to 0-11
  return (month >= 0 && month <= 11) ? month : null;
}

// Monthly summaries - concise overview per month
const MONTH_SUMMARIES = {
  0: "Året startet med store kryptovalutaangrep og økende ransomware-aktivitet.",
  1: "Rekordstore kryptoinnbrudd og eskalerende statsstøttede cyberangrep.",
  2: "Cloud-tjenester og forsyningskjeder ble rammet av omfattende datainnbrudd.",
  3: "Phishing og utpressing dominerte, med store saksrettede angrep mot idrettsbransjen.",
  4: "Ransomware rammet store detaljhandelskjeder med milliardtap.",
  5: "Historisk lekkasje av 16 milliarder innloggingsdetaljer.",
  6: "Zero-day angrep og statsstøttede kampanjer mot kritisk infrastruktur.",
  7: "Forsyningskjeder og cloud-plattformer kompromittert av sofistikerte aktører.",
  8: "Ransomware lammet europeiske flyplasser og global transport.",
  9: "Sikkerhetsleverandører ble selv ofre for omfattende datainnbrudd.",
  10: "Oracle-sårbarheter utnyttet mot universiteter og store bedrifter over hele verden.",
  11: "Massive datainnbrudd rammet millioner av forbrukere i Asia og globalt.",
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
  // Year selection state (default to 2025 to allow early 2026 data addition)
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedRegion, setSelectedRegion] = useState(initialState.region)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState(initialState.tags)
  const [selectedMonth, setSelectedMonth] = useState(initialState.month)
  const [showMajorOnly, setShowMajorOnly] = useState(initialState.major)

  // Get incidents data based on selected year using object lookup for maintainability
  const yearDataMap = {
    2025: incidents2025,
    2026: incidents2026
  }
  const incidentsData = yearDataMap[selectedYear] || incidents2025

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    
    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

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
    
    // Only support single tag in URL for simplicity of shareable links
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
  }, [incidentsData, selectedMonth])

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

    // Filter by search query (using debounced value)
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase()
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
  }, [incidentsData, selectedMonth, selectedRegion, debouncedSearch, selectedTags, showMajorOnly])

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const resetAllFilters = useCallback(() => {
    setSelectedMonth('ALL')
    setSelectedRegion('ALL')
    setSearchQuery('')
    setDebouncedSearch('')
    setSelectedTags([])
    setShowMajorOnly(false)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nb-NO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Get impact badge styling
  const getImpactBadge = (impact) => {
    if (!impact || impact < 3) return null
    return IMPACT_STYLES[impact] || null
  }

  // Generate empty state message based on active filters
  const getEmptyStateMessage = () => {
    if (debouncedSearch.trim()) {
      return {
        title: `Ingen treff for "${debouncedSearch}"`,
        suggestions: ['Prøv et annet søkeord', 'Fjern søket for å se alle hendelser', 'Søk etter "ransomware", "breach" eller "apt"']
      }
    }
    
    const filters = []
    if (selectedMonth !== 'ALL') filters.push(MONTHS_NO[selectedMonth])
    if (selectedRegion !== 'ALL') {
      const regionNames = { US: 'USA', EU: 'Europa', ASIA: 'Asia', NO: 'Norge' }
      filters.push(regionNames[selectedRegion])
    }
    if (selectedTags.length > 0) filters.push(`tag: ${selectedTags.join(', ')}`)
    if (showMajorOnly) filters.push('kun største saker')
    
    if (filters.length > 0) {
      return {
        title: `Ingen treff for ${filters.join(' + ')}`,
        suggestions: ['Prøv å velge en annen måned', 'Velg en annen region', 'Fjern noen filtre']
      }
    }
    
    return {
      title: 'Ingen hendelser funnet',
      suggestions: []
    }
  }

  return (
    <div className="app">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>
      
      <header className="header">
        <div className="header-content">
          <div className="header-text">
            <h1>Security News Year in Review {selectedYear}</h1>
            <p className="subtitle">Oversikt over cybersikkerhetshendelser</p>
          </div>
          <div className="year-selector">
            <button 
              className={selectedYear === 2025 ? 'year-btn active' : 'year-btn'}
              onClick={() => setSelectedYear(2025)}
              aria-label="Vis 2025 hendelser"
              aria-pressed={selectedYear === 2025}
            >
              2025
            </button>
            <button 
              className={selectedYear === 2026 ? 'year-btn active' : 'year-btn'}
              onClick={() => setSelectedYear(2026)}
              aria-label="Vis 2026 hendelser"
              aria-pressed={selectedYear === 2026}
            >
              2026
            </button>
          </div>
        </div>
      </header>

      {/* Year Stats */}
      <YearStats incidents={incidentsData} selectedYear={selectedYear} />

      {/* Trend Dashboard - Shows news summaries and trends for 2026 */}
      <TrendDashboard 
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedRegion={selectedRegion}
      />

      {/* Year Wheel */}
      <YearWheel 
        incidents={incidentsData}
        selectedMonth={selectedMonth}
        onMonthClick={setSelectedMonth}
        selectedYear={selectedYear}
      />

      {/* Interactive Tag Cloud - Commented out as buzzwords are shown in TrendDashboard above */}
      {/* <InteractiveTagCloud 
        incidents={incidentsData}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
        selectedYear={selectedYear}
      /> */}

      {/* Filters Section - Grouped for better UX */}
      <div className="filters-section" role="region" aria-label="Filtre for hendelser">
        {/* Region Filter */}
        <div className="region-filter" role="group" aria-label="Regionfilter">
          <button 
            className={selectedRegion === 'ALL' ? 'active' : ''}
            onClick={() => setSelectedRegion('ALL')}
            aria-label="Vis alle regioner"
            aria-pressed={selectedRegion === 'ALL'}
          >
            Alle ({regionCounts.ALL})
          </button>
          <button 
            className={selectedRegion === 'US' ? 'active' : ''}
            onClick={() => setSelectedRegion('US')}
            aria-label="Filtrer på USA"
            aria-pressed={selectedRegion === 'US'}
          >
            USA ({regionCounts.US})
          </button>
          <button 
            className={selectedRegion === 'EU' ? 'active' : ''}
            onClick={() => setSelectedRegion('EU')}
            aria-label="Filtrer på Europa"
            aria-pressed={selectedRegion === 'EU'}
          >
            Europa ({regionCounts.EU})
          </button>
          <button 
            className={selectedRegion === 'ASIA' ? 'active' : ''}
            onClick={() => setSelectedRegion('ASIA')}
            aria-label="Filtrer på Asia"
            aria-pressed={selectedRegion === 'ASIA'}
          >
            Asia ({regionCounts.ASIA})
          </button>
          <button 
            className={selectedRegion === 'NO' ? 'active' : ''}
            onClick={() => setSelectedRegion('NO')}
            aria-label="Filtrer på Norge"
            aria-pressed={selectedRegion === 'NO'}
          >
            Norge ({regionCounts.NO})
          </button>
        </div>

        {/* Month Filter */}
        <div className="month-filter-container" role="group" aria-label="Månedsfilter">
          {/* Dropdown for mobile */}
          <select 
            className="month-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))}
            aria-label="Velg måned"
          >
            <option value="ALL">📅 Alle måneder</option>
            {MONTHS_NO.map((month, index) => (
              <option key={index} value={index}>📅 {month}</option>
            ))}
          </select>

          {/* Buttons for desktop */}
          <div className="month-buttons">
            <button 
              className={selectedMonth === 'ALL' ? 'active' : ''}
              onClick={() => setSelectedMonth('ALL')}
              aria-label="Vis alle måneder"
              aria-pressed={selectedMonth === 'ALL'}
            >
              Alle
            </button>
            {MONTHS_NO.map((month, index) => (
              <button
                key={index}
                className={selectedMonth === index ? 'active' : ''}
                onClick={() => setSelectedMonth(index)}
                aria-label={`Filtrer på ${month}`}
                aria-pressed={selectedMonth === index}
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
              aria-label="Vis kun største saker med impact 4 eller høyere"
            />
            <span className="toggle-label" aria-label="Kun største saker, impact 4 eller høyere">
              ⚠️ Kun største saker (impact ≥ 4)
            </span>
          </label>
        </div>
      </div>

      {/* Monthly Summary */}
      {selectedMonth !== 'ALL' && MONTH_SUMMARIES[selectedMonth] && (
        <div className="month-summary">
          {MONTH_SUMMARIES[selectedMonth]}
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <input 
            type="text"
            className="search-input"
            placeholder="🔍 Søk i tittel, sammendrag eller tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Søk i cybersikkerhetshendelser"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Fjern søketekst"
              title="Fjern søk"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tag Chips */}
      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <span className="tag-label" aria-label="Valgte emneord">🏷️ Valgte tags:</span>
          {selectedTags.map(tag => (
            <button 
              key={tag} 
              className="tag-chip selected"
              onClick={() => handleTagClick(tag)}
              aria-label={`Fjern filter: ${tag}`}
            >
              {tag} ×
            </button>
          ))}
        </div>
      )}

      {/* Incidents List */}
      <main id="main-content" className="incidents-container">
        {filteredIncidents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>{getEmptyStateMessage().title}</h2>
            {getEmptyStateMessage().suggestions.length > 0 && (
              <ul className="empty-suggestions">
                {getEmptyStateMessage().suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            )}
            <button 
              className="reset-filters-btn"
              onClick={resetAllFilters}
              aria-label="Tilbakestill alle filtre"
            >
              Tilbakestill alle filtre
            </button>
          </div>
        ) : (
          <div className="incidents-list">
            {filteredIncidents.map(incident => {
              const impactBadge = getImpactBadge(incident.impact)
              return (
              <article key={incident.id} className="incident-card">
                <div className="incident-header">
                  <time className="incident-date" aria-label={`Dato: ${formatDate(incident.date)}`}>
                    📅 {formatDate(incident.date)}
                  </time>
                  <span className={`region-badge ${incident.region.toLowerCase()}`} aria-label={`Region: ${incident.region}`}>
                    {incident.region}
                  </span>
                </div>
                <h2 className="incident-title">
                  {impactBadge && (
                    <span 
                      className={`impact-badge ${impactBadge.className}`} 
                      title={impactBadge.label}
                      aria-label={`Alvorlighetsgrad: ${impactBadge.label}`}
                      role="img"
                    >
                      {impactBadge.emoji}
                    </span>
                  )}
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
                    <div className="tags" role="group" aria-label="Emneord">
                      {incident.tags.map(tag => (
                        <button
                          key={tag}
                          className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => handleTagClick(tag)}
                          aria-label={selectedTags.includes(tag) ? `Fjern filter: ${tag}` : `Filtrer på: ${tag}`}
                          aria-pressed={selectedTags.includes(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )}
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-reflection">
          <p className="footer-quote">
            Årshjulet viser hvor tett nyhetsbildet var.<br />
            Men konsekvensene varer ofte lenger enn overskriftene.
          </p>
        </div>
        <p className="footer-meta">
          Dekker {selectedYear} • {incidentsData.length} hendelser • Sist oppdatert {new Date().toLocaleDateString('nb-NO')}
        </p>
      </footer>
    </div>
  )
}

export default App
