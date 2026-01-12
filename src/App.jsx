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
import DetectionGapAnalysis from './components/DetectionGapAnalysis'
import StickyNav from './components/StickyNav'
import ThreatLandscapeSnapshot from './components/ThreatLandscapeSnapshot'
import IncidentsSection from './components/IncidentsSection'
import BackToTop from './components/BackToTop'
import DataHealthDashboard from './components/DataHealthDashboard'
import { countUniqueIncidents } from './utils/populationUtils'

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
  
  // Get year from URL or default to 2026
  const urlParams = new URLSearchParams(window.location.search);
  const yearFromUrl = parseInt(urlParams.get('year') || '2026', 10);
  const [selectedYear, setSelectedYear] = useState([2025, 2026].includes(yearFromUrl) ? yearFromUrl : 2026);
  
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

  // Calculate last updated date from actual data
  const lastUpdated = useMemo(() => {
    if (!incidentsData || incidentsData.length === 0) {
      return { formatted: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), iso: new Date().toISOString().split('T')[0] };
    }
    const dates = incidentsData
      .map(inc => inc.date)
      .filter(date => date)
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) {
      return { formatted: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), iso: new Date().toISOString().split('T')[0] };
    }
    
    const maxDate = new Date(Math.max(...dates));
    return { 
      formatted: maxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 
      iso: maxDate.toISOString().split('T')[0]
    };
  }, [incidentsData]);

  // Calculate unique incidents vs total sources
  const uniqueIncidentCount = useMemo(() => countUniqueIncidents(incidentsData), [incidentsData]);
  const totalSourceCount = incidentsData?.length || 0;

  // Check if data is enriched and get enrichment timestamp
  const enrichmentInfo = useMemo(() => {
    if (!incidentsData || incidentsData.length === 0) {
      return { isEnriched: false, timestamp: null };
    }
    
    // Check if any incident has enrichment fields
    const hasEnrichment = incidentsData.some(i => 
      (i.severity && i.severity !== 'unknown') ||
      (i.themes && Array.isArray(i.themes) && i.themes.length > 0) ||
      (i.mitre_techniques && Array.isArray(i.mitre_techniques) && i.mitre_techniques.length > 0)
    );
    
    // Use build time or current date as enrichment timestamp
    const buildTimestamp = import.meta.env.VITE_BUILD_TIME || new Date().toISOString().split('T')[0];
    
    return {
      isEnriched: hasEnrichment,
      timestamp: hasEnrichment ? buildTimestamp : null
    };
  }, [incidentsData]);

  // Update URL when year changes
  useEffect(() => {
    const url = new URL(window.location);
    if (selectedYear !== 2026) {
      url.searchParams.set('year', selectedYear);
    } else {
      url.searchParams.delete('year');
    }
    window.history.replaceState({}, '', url);
  }, [selectedYear]);

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
            <p className="last-updated" title={`Last data from: ${lastUpdated.iso}`}>
              Last updated (from data): {lastUpdated.iso}
            </p>
            {enrichmentInfo.isEnriched && enrichmentInfo.timestamp && (
              <p className="enrichment-timestamp" title="Analytics generation date">
                Analytics generated: {enrichmentInfo.timestamp}
              </p>
            )}
            <p className="data-counts">
              {uniqueIncidentCount === totalSourceCount ? (
                <span className="count-item">
                  <strong>{totalSourceCount}</strong> incidents
                </span>
              ) : (
                <>
                  <span className="count-item">
                    <strong>{uniqueIncidentCount}</strong> unique incidents (deduplicated)
                  </span>
                  <span className="count-separator"> • </span>
                  <span className="count-item">
                    <strong>{totalSourceCount}</strong> total sources/articles
                  </span>
                </>
              )}
            </p>
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

      {/* Sticky Navigation */}
      <StickyNav 
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        cisoMode={cisoMode}
        onCisoModeChange={setCisoMode}
      />

      {/* Hero / Value Proposition */}
      <section className="hero-section" aria-label="About this site">
        <div className="hero-content">
          <p className="hero-text">
            Cyber incidents happen daily. This site collects, structures, and contextualizes them – 
            making patterns visible before the next incident occurs.
          </p>
        </div>
      </section>

      {/* Data Health Dashboard */}
      <DataHealthDashboard incidents={incidentsData} />

      {/* CISO Mode - Enterprise Dashboard Toggle (keep for desktop layout) */}
      <CISOMode onModeChange={setCisoMode} />

      {/* Executive Summary - Strategic Overview */}
      <div id="summary">
        <ExecutiveSummary incidents={incidentsData} selectedYear={selectedYear} />
      </div>

      {/* Threat Landscape Snapshot - 1-page overview */}
      <div id="snapshot">
        <ThreatLandscapeSnapshot incidents={incidentsData} />
      </div>

      {/* Strategic Risk Themes - Top 5 Themes */}
      <div id="themes">
        <StrategicRiskThemes incidents={incidentsData} selectedYear={selectedYear} filters={{}} />
      </div>

      {/* Attack Chain Reconstruction - Enterprise Feature */}
      <div id="attack-chains">
        <AttackChainAnalysis incidents={incidentsData} filters={{}} />
      </div>

      {/* Sector Benchmarking - CISO-Level Comparison */}
      <div id="benchmarking">
        <SectorBenchmarking incidents={incidentsData} filters={{}} />
      </div>

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
      <div id="defense">
        <DefenseAnalysis incidents={incidentsData} selectedYear={selectedYear} />
      </div>

      {/* Detection Gap Analysis - Control Coverage Assessment */}
      <DetectionGapAnalysis incidents={incidentsData} filters={{}} />

      {/* Regulation Impact - NIS2, GDPR, DSA, etc. */}
      <RegulationImpact selectedYear={selectedYear} />

      {/* Forecasts and Predictions */}
      <div id="predictions">
        <ForecastsAndPredictions incidents={incidentsData} selectedYear={selectedYear} />
      </div>

      {/* Methodology and Limitations */}
      <MethodologyAndLimitations />

      {/* Year Wheel */}
      <YearWheel 
        incidents={incidentsData}
        selectedMonth={selectedMonth}
        onMonthClick={setSelectedMonth}
        selectedYear={selectedYear}
      />

      {/* Incidents Section with Pagination and Tabs */}
      <IncidentsSection 
        incidents={filteredIncidents}
        onTagClick={handleTagClick}
        selectedTags={selectedTags}
        formatDate={formatDate}
        getImpactBadge={getImpactBadge}
      />

      {/* Back to Top Button */}
      <BackToTop />

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
