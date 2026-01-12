import { useState, useEffect, useMemo, useCallback } from 'react'
import './App.css'
import incidents2025 from '../data/incidents-2025-enriched.json'
import incidents2026 from '../data/incidents-2026-enriched.json'
import InteractiveTagCloud from './components/InteractiveTagCloud'
import YearWheel from './components/YearWheel'
import YearStats from './components/YearStats'
import TrendDashboard from './components/TrendDashboard'
import ExecutiveSummary from './components/ExecutiveSummary'
import SectorAnalysis from './components/SectorAnalysis'
import ThreatIntelligence from './components/ThreatIntelligence'
import ThreatActorProfile from './components/ThreatActorProfile'
import DefenseAnalysis from './components/DefenseAnalysis'
import RegulationImpact from './components/RegulationImpact'
import ForecastsAndPredictions from './components/ForecastsAndPredictions'
import StrategicRiskThemes from './components/StrategicRiskThemes'
import MethodologyAndLimitations from './components/MethodologyAndLimitations'
import AttackChainAnalysis from './components/AttackChainAnalysis'
import SectorBenchmarking from './components/SectorBenchmarking'
import TrendAcceleration from './components/TrendAcceleration'
import CISOMode from './components/CISOMode'

// Month helpers
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Impact badge configuration
const IMPACT_STYLES = {
  5: { label: 'Critical', className: 'impact-critical', emoji: '🔴' },
  4: { label: 'High', className: 'impact-high', emoji: '🟠' },
  3: { label: 'Moderate', className: 'impact-moderate', emoji: '⚪' }
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
  0: "The year started with major cryptocurrency attacks and increasing ransomware activity.",
  1: "Record-breaking crypto breaches and escalating state-sponsored cyberattacks.",
  2: "Cloud services and supply chains hit by extensive data breaches.",
  3: "Phishing and extortion dominated, with major targeted attacks against the sports industry.",
  4: "Ransomware hit major retail chains with billion-dollar losses.",
  5: "Historic leak of 16 billion login credentials.",
  6: "Zero-day attacks and state-sponsored campaigns against critical infrastructure.",
  7: "Supply chains and cloud platforms compromised by sophisticated actors.",
  8: "Ransomware crippled European airports and global transport.",
  9: "Security vendors themselves fell victim to extensive data breaches.",
  10: "Oracle vulnerabilities exploited against universities and large companies worldwide.",
  11: "Massive data breaches hit millions of consumers in Asia and globally.",
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
  // Year selection state (default to 2026)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedRegion, setSelectedRegion] = useState(initialState.region)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState(initialState.tags)
  const [selectedMonth, setSelectedMonth] = useState(initialState.month)
  const [showMajorOnly, setShowMajorOnly] = useState(initialState.major)
  const [showCuratedOnly, setShowCuratedOnly] = useState(false)
  const [cisoMode, setCisoMode] = useState({
    enabled: false,
    criticalOnly: false,
    curatedOnly: false,
    highConfidenceOnly: false
  })

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

    // CISO Mode Filters (applied first for executive view)
    if (cisoMode.enabled) {
      if (cisoMode.criticalOnly) {
        filtered = filtered.filter(incident => incident.severity === 'critical')
      }
      if (cisoMode.curatedOnly) {
        filtered = filtered.filter(incident => incident.is_curated)
      }
      if (cisoMode.highConfidenceOnly) {
        filtered = filtered.filter(incident => incident.confidence >= 70)
      }
    }

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

    // Filter by curated only
    if (showCuratedOnly) {
      filtered = filtered.filter(incident => incident.is_curated)
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
  }, [incidentsData, selectedMonth, selectedRegion, debouncedSearch, selectedTags, showMajorOnly, showCuratedOnly, cisoMode])

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
    setShowCuratedOnly(false)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
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
        title: `No results for "${debouncedSearch}"`,
        suggestions: ['Try another search term', 'Remove search to see all incidents', 'Search for "ransomware", "breach" or "apt"']
      }
    }
    
    const filters = []
    if (selectedMonth !== 'ALL') filters.push(MONTHS_EN[selectedMonth])
    if (selectedRegion !== 'ALL') {
      const regionNames = { US: 'USA', EU: 'Europe', ASIA: 'Asia', NO: 'Norway' }
      filters.push(regionNames[selectedRegion])
    }
    if (selectedTags.length > 0) filters.push(`tag: ${selectedTags.join(', ')}`)
    if (showMajorOnly) filters.push('major incidents only')
    if (showCuratedOnly) filters.push('curated only')
    
    if (filters.length > 0) {
      return {
        title: `No results for ${filters.join(' + ')}`,
        suggestions: ['Try selecting another month', 'Select another region', 'Remove some filters']
      }
    }
    
    return {
      title: 'No incidents found',
      suggestions: []
    }
  }

  return (
    <div className="app">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <header className="header">
        <div className="header-content">
          <div className="header-text">
            <h1>Security News Year in Review {selectedYear}</h1>
            <p className="subtitle">Overview of cybersecurity incidents</p>
          </div>
          <div className="year-selector">
            <button 
              className={selectedYear === 2025 ? 'year-btn active' : 'year-btn'}
              onClick={() => setSelectedYear(2025)}
              aria-label="Show 2025 incidents"
              aria-pressed={selectedYear === 2025}
            >
              2025
            </button>
            <button 
              className={selectedYear === 2026 ? 'year-btn active' : 'year-btn'}
              onClick={() => setSelectedYear(2026)}
              aria-label="Show 2026 incidents"
              aria-pressed={selectedYear === 2026}
            >
              2026
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Value Proposition */}
      <section className="hero-section" aria-label="About this site">
        <div className="hero-content">
          <p className="hero-text">
            Cyber incidents happen daily. This site collects, structures, and contextualizes them – 
            making patterns visible before the next incident occurs.
          </p>
        </div>
      </section>

      {/* CISO Mode - Enterprise Dashboard Toggle */}
      <CISOMode onModeChange={setCisoMode} />

      {/* Executive Summary - Strategic Overview */}
      <ExecutiveSummary incidents={incidentsData} selectedYear={selectedYear} />

      {/* Strategic Risk Themes - Top 5 Themes */}
      <StrategicRiskThemes incidents={incidentsData} selectedYear={selectedYear} filters={{}} />

      {/* Attack Chain Reconstruction - Enterprise Feature */}
      <AttackChainAnalysis incidents={incidentsData} filters={{}} />

      {/* Sector Benchmarking - CISO-Level Comparison */}
      <SectorBenchmarking incidents={incidentsData} filters={{}} />

      {/* Trend Acceleration - Emerging vs. Declining Threats */}
      <TrendAcceleration incidents={incidentsData} filters={{}} />

      {/* Year Stats */}
      <YearStats incidents={incidentsData} selectedYear={selectedYear} />

      {/* MITRE ATT&CK Framework Analysis */}
      <ThreatIntelligence incidents={incidentsData} />

      {/* Threat Actor Profiling */}
      <ThreatActorProfile incidents={incidentsData} />

      {/* Sector Analysis - Deep dive into targeted sectors */}
      <SectorAnalysis incidents={incidentsData} selectedYear={selectedYear} />

      {/* Trend Dashboard - Shows news summaries and trends for 2026 */}
      <TrendDashboard 
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedRegion={selectedRegion}
        incidents={incidentsData}
      />

      {/* Defense Analysis - What worked and what failed */}
      <DefenseAnalysis incidents={incidentsData} selectedYear={selectedYear} />

      {/* Regulation Impact - NIS2, GDPR, DSA, etc. */}
      <RegulationImpact selectedYear={selectedYear} />

      {/* Forecasts and Predictions */}
      <ForecastsAndPredictions incidents={incidentsData} selectedYear={selectedYear} />

      {/* Methodology and Limitations */}
      <MethodologyAndLimitations />

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
      <div className="filters-section" role="region" aria-label="Incident filters">
        {/* Region Filter */}
        <div className="region-filter" role="group" aria-label="Region filter">
          <button 
            className={selectedRegion === 'ALL' ? 'active' : ''}
            onClick={() => setSelectedRegion('ALL')}
            aria-label="Show all regions"
            aria-pressed={selectedRegion === 'ALL'}
          >
            All ({regionCounts.ALL})
          </button>
          <button 
            className={selectedRegion === 'US' ? 'active' : ''}
            onClick={() => setSelectedRegion('US')}
            aria-label="Filter on USA"
            aria-pressed={selectedRegion === 'US'}
          >
            USA ({regionCounts.US})
          </button>
          <button 
            className={selectedRegion === 'EU' ? 'active' : ''}
            onClick={() => setSelectedRegion('EU')}
            aria-label="Filter on Europe"
            aria-pressed={selectedRegion === 'EU'}
          >
            Europe ({regionCounts.EU})
          </button>
          <button 
            className={selectedRegion === 'ASIA' ? 'active' : ''}
            onClick={() => setSelectedRegion('ASIA')}
            aria-label="Filter on Asia"
            aria-pressed={selectedRegion === 'ASIA'}
          >
            Asia ({regionCounts.ASIA})
          </button>
          <button 
            className={selectedRegion === 'NO' ? 'active' : ''}
            onClick={() => setSelectedRegion('NO')}
            aria-label="Filter on Norway"
            aria-pressed={selectedRegion === 'NO'}
          >
            Norway ({regionCounts.NO})
          </button>
        </div>

        {/* Month Filter */}
        <div className="month-filter-container" role="group" aria-label="Month filter">
          {/* Dropdown for mobile */}
          <select 
            className="month-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))}
            aria-label="Select month"
          >
            <option value="ALL">📅 All months</option>
            {MONTHS_EN.map((month, index) => (
              <option key={index} value={index}>📅 {month}</option>
            ))}
          </select>

          {/* Buttons for desktop */}
          <div className="month-buttons">
            <button 
              className={selectedMonth === 'ALL' ? 'active' : ''}
              onClick={() => setSelectedMonth('ALL')}
              aria-label="Show all months"
              aria-pressed={selectedMonth === 'ALL'}
            >
              All
            </button>
            {MONTHS_EN.map((month, index) => (
              <button
                key={index}
                className={selectedMonth === index ? 'active' : ''}
                onClick={() => setSelectedMonth(index)}
                aria-label={`Filter on ${month}`}
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
              aria-label="Show only major incidents with impact 4 or higher"
            />
            <span className="toggle-label" aria-label="Only major incidents, impact 4 or higher">
              ⚠️ Major incidents only (impact ≥ 4)
            </span>
          </label>
        </div>

        {/* Curated Filter Toggle */}
        <div className="curated-filter-container">
          <label className="curated-toggle">
            <input
              type="checkbox"
              checked={showCuratedOnly}
              onChange={(e) => setShowCuratedOnly(e.target.checked)}
              aria-label="Show only curated incidents with high-quality enrichment"
            />
            <span className="toggle-label" aria-label="Only curated, high-quality incidents">
              ✅ Curated only (high-quality enrichment)
            </span>
          </label>
          <div className="filter-note">
            <small>Count type: <strong>unique incidents</strong> | Population: <strong>{showCuratedOnly ? 'curated' : 'all'}</strong></small>
          </div>
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
            placeholder="🔍 Search in title, summary or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search in cybersecurity incidents"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search text"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tag Chips */}
      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <span className="tag-label" aria-label="Selected tags">🏷️ Selected tags:</span>
          {selectedTags.map(tag => (
            <button 
              key={tag} 
              className="tag-chip selected"
              onClick={() => handleTagClick(tag)}
              aria-label={`Remove filter: ${tag}`}
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
              aria-label="Reset all filters"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="incidents-list">
            {filteredIncidents.map(incident => {
              const impactBadge = getImpactBadge(incident.impact)
              return (
              <article key={incident.id} className="incident-card">
                <div className="incident-header">
                  <time className="incident-date" aria-label={`Date: ${formatDate(incident.date)}`}>
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
                      aria-label={`Severity: ${impactBadge.label}`}
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
                    Source: {incident.sourceName}
                    {incident.country && ` • ${incident.country}`}
                  </span>
                  {incident.tags && incident.tags.length > 0 && (
                    <div className="tags" role="group" aria-label="Tags">
                      {incident.tags.map(tag => (
                        <button
                          key={tag}
                          className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => handleTagClick(tag)}
                          aria-label={selectedTags.includes(tag) ? `Remove filter: ${tag}` : `Filter on: ${tag}`}
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
            The year wheel shows how dense the news cycle was.<br />
            But cybersecurity is rarely about isolated incidents – and almost always about patterns.
          </p>
        </div>
        <p className="footer-meta">
          Covers {selectedYear} • {incidentsData.length} incidents • Last updated {new Date().toLocaleDateString('en-US')}
        </p>
      </footer>
    </div>
  )
}

export default App
