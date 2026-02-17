import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import incidents2025 from '../data/incidents-2025-enriched.json'
import incidents2026 from '../data/incidents-2026-enriched.json'
import metadata from '../data/metadata.json'
import learningLog from '../data/learning-log.json'
import ViewNav from './components/ViewNav'
import GlobalFilterBar from './components/GlobalFilterBar'
import BackToTop from './components/BackToTop'
import DataModelTooltip from './components/DataModelTooltip'
import ReadingProgress from './components/ReadingProgress'
import WeeklyHighlights from './components/WeeklyHighlights'
import { enhanceIncidents } from './utils/deduplicationUtils'

// Import view components
import OverviewView from './views/OverviewView'
import ThreatLandscapeView from './views/ThreatLandscapeView'
import MITREView from './views/MITREView'
import DefenseView from './views/DefenseView'
import SectorsView from './views/SectorsView'
import CISOView from './views/CISOView'
import DataInsightsView from './views/DataInsightsView'

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
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const month = parseInt(dateStr.substring(5, 7), 10) - 1;
  return (month >= 0 && month <= 11) ? month : null;
}

// Helper to parse initial state from URL
function getInitialStateFromURL() {
  const params = new URLSearchParams(window.location.search)
  const state = {
    month: 'ALL',
    region: 'ALL',
    tags: [],
    major: false
  }
  
  const monthParam = params.get('m') || params.get('month')
  if (monthParam) {
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mai': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
    }
    if (monthParam in monthMap) {
      state.month = monthMap[monthParam]
    } else {
      const monthIndex = parseInt(monthParam, 10)
      if (monthIndex >= 0 && monthIndex <= 11) {
        state.month = monthIndex
      }
    }
  }
  
  const regionParam = params.get('r') || params.get('region')
  if (regionParam) {
    const regionUpper = regionParam.toUpperCase()
    if (['US', 'EU', 'ASIA', 'NO'].includes(regionUpper)) {
      state.region = regionUpper
    }
  }
  
  const tagParam = params.get('t') || params.get('tag')
  if (tagParam) {
    state.tags = [tagParam]
  }
  
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
  
  const [selectedRegion] = useState(initialState.region)
  const [searchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState(initialState.tags)
  const [selectedMonth, setSelectedMonth] = useState(initialState.month)
  const [showMajorOnly] = useState(initialState.major)
  const [showCuratedOnly] = useState(false)
  const [cisoMode, setCisoMode] = useState({
    enabled: false,
    incidentOnly: true,
    criticalOnly: false,
    curatedOnly: false,
    highConfidenceOnly: false
  })
  
  // Global filter state
  const [globalFilters, setGlobalFilters] = useState({
    contentType: 'all',
    severity: 'all',
    actorType: 'all',
    sector: 'all',
    region: 'all',
    dateRange: { start: '', end: '' }
  })
  
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Get incidents data based on selected year
  const yearDataMap = {
    2025: incidents2025,
    2026: incidents2026
  }
  const incidentsData = yearDataMap[selectedYear] || incidents2025

  // Get last updated date from metadata
  const lastUpdated = useMemo(() => {
    if (metadata && metadata.lastUpdated) {
      const date = new Date(metadata.lastUpdated);
      return { 
        formatted: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 
        iso: date.toISOString().split('T')[0],
        utc: date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      };
    }
    const now = new Date();
    return { 
      formatted: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 
      iso: now.toISOString().split('T')[0],
      utc: now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    };
  }, []);

  // Calculate the latest data point (newest article date)
  const latestDataPoint = useMemo(() => {
    if (!incidentsData || incidentsData.length === 0) return null;
    const latestDate = incidentsData.reduce((latest, incident) => {
      if (!incident.date) return latest;
      return incident.date > latest ? incident.date : latest;
    }, '1970-01-01');
    return latestDate !== '1970-01-01' ? latestDate : null;
  }, [incidentsData]);

  // Calculate estimated unique incidents vs total articles
  const deduplicationStats = useMemo(() => {
    if (!incidentsData || incidentsData.length === 0) {
      return { estimatedUniqueIncidents: 0, totalArticles: 0 };
    }
    const result = enhanceIncidents(incidentsData);
    return result.stats;
  }, [incidentsData]);
  
  const uniqueIncidentCount = deduplicationStats.estimatedUniqueIncidents;
  const totalSourceCount = deduplicationStats.totalArticles;

  // Check if data is enriched
  const enrichmentInfo = useMemo(() => {
    if (!incidentsData || incidentsData.length === 0) {
      return { isEnriched: false, timestamp: null };
    }
    
    const hasEnrichment = incidentsData.some(i => 
      (i.severity && i.severity !== 'unknown') ||
      (i.themes && Array.isArray(i.themes) && i.themes.length > 0) ||
      (i.mitre_techniques && Array.isArray(i.mitre_techniques) && i.mitre_techniques.length > 0)
    );
    
    const buildTimestamp = import.meta.env.VITE_BUILD_TIME || new Date().toISOString().split('T')[0];
    
    return {
      isEnriched: hasEnrichment,
      timestamp: hasEnrichment ? buildTimestamp : null
    };
  }, [incidentsData]);

  // Update page title when year changes
  useEffect(() => {
    document.title = `Security News Year in Review ${selectedYear}`;
  }, [selectedYear]);

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

  // Filter and sort incidents
  const filteredIncidents = useMemo(() => {
    let filtered = incidentsData

    // Global Filters
    if (globalFilters.contentType !== 'all') {
      filtered = filtered.filter(incident => 
        incident.content_type === globalFilters.contentType
      );
    }

    if (globalFilters.severity !== 'all') {
      filtered = filtered.filter(incident => 
        incident.severity === globalFilters.severity
      );
    }

    if (globalFilters.actorType !== 'all') {
      filtered = filtered.filter(incident => 
        incident.actor_category === globalFilters.actorType
      );
    }

    if (globalFilters.sector !== 'all') {
      filtered = filtered.filter(incident => 
        incident.sector === globalFilters.sector
      );
    }

    if (globalFilters.region !== 'all') {
      filtered = filtered.filter(incident => 
        incident.region === globalFilters.region
      );
    }

    // Date Range Filter
    if (globalFilters.dateRange.start || globalFilters.dateRange.end) {
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.date);
        const startDate = globalFilters.dateRange.start ? new Date(globalFilters.dateRange.start) : null;
        const endDate = globalFilters.dateRange.end ? new Date(globalFilters.dateRange.end) : null;
        
        if (startDate && incidentDate < startDate) return false;
        if (endDate && incidentDate > endDate) return false;
        return true;
      });
    }

    // CISO Mode Filters
    if (cisoMode.enabled) {
      if (cisoMode.incidentOnly) {
        filtered = filtered.filter(incident => 
          incident.content_type === 'incident' || incident.content_type === 'campaign'
        );
      }
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

    // Month filter
    if (selectedMonth !== 'ALL') {
      filtered = filtered.filter(incident => {
        const m = getMonthIndex(incident.date)
        return m === selectedMonth
      })
    }

    // Region filter (old way - for backwards compat)
    if (selectedRegion !== 'ALL') {
      filtered = filtered.filter(incident => incident.region === selectedRegion)
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(incident =>
        selectedTags.some(tag => 
          incident.tags && incident.tags.includes(tag)
        )
      )
    }

    // Search filter - searches across title, summary, organization, and tags
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase()
      filtered = filtered.filter(incident => {
        const searchableText = [
          incident.title,
          incident.summary,
          incident.organization,
          ...(incident.tags || [])
        ].filter(Boolean).join(' ').toLowerCase()
        
        return searchableText.includes(query)
      })
    }

    // Major incidents only
    if (showMajorOnly) {
      filtered = filtered.filter(incident => incident.is_major === true || incident.impact >= 4)
    }

    // Curated only
    if (showCuratedOnly) {
      filtered = filtered.filter(incident => incident.is_curated === true)
    }

    // Sort by date descending
    return filtered.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.localeCompare(a.date)
    })
  }, [incidentsData, globalFilters, cisoMode, selectedMonth, selectedRegion, selectedTags, debouncedSearch, showMajorOnly, showCuratedOnly])

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getImpactBadge = (impact) => {
    if (!impact || impact < 3) return null
    return IMPACT_STYLES[impact] || null
  }

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <div className="app">
        {/* Skip to main content link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <header className="header">
          <div className="header-content">
            <div className="header-text">
              <h1>
                {(() => {
                  const today = latestDataPoint || new Date().toISOString().split('T')[0];
                  return selectedYear === currentYear 
                    ? `Security News — ${selectedYear} YTD (as of ${today})`
                    : `Security News Year in Review ${selectedYear}`;
                })()}
              </h1>
              <p className="subtitle">
                {selectedYear === currentYear
                  ? "Year-to-date coverage of cybersecurity news and incidents"
                  : "Overview of cybersecurity incidents"}
              </p>
              <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                <DataModelTooltip />
              </div>
              <div className="data-timestamp-section">
                <p className="data-through" title="Latest article published date in dataset">
                  📅 <strong>Data through:</strong> {latestDataPoint || 'N/A'} <em>(latest article published)</em>
                </p>
                <p className="last-updated" title={`System last refreshed: ${lastUpdated.utc}`}>
                  🔄 Last updated: {lastUpdated.utc} <em>(last pipeline run)</em>
                </p>
                {enrichmentInfo.isEnriched && enrichmentInfo.timestamp && (
                  <p className="enrichment-timestamp" title="Analytics generation date">
                    📊 Analytics generated: {enrichmentInfo.timestamp}
                  </p>
                )}
              </div>
              <p className="data-counts">
                {uniqueIncidentCount === totalSourceCount ? (
                  <span className="count-item">
                    <strong>{totalSourceCount}</strong> items
                  </span>
                ) : (
                  <>
                    <span className="count-item primary-metric">
                      <span className="metric-icon">🎯</span>
                      <strong>{uniqueIncidentCount}</strong> estimated unique incidents
                    </span>
                    <span className="count-separator"> • </span>
                    <span className="count-item secondary-metric">
                      <span className="metric-icon">📰</span>
                      <strong>{totalSourceCount}</strong> items/articles
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

        {/* View Navigation */}
        <ViewNav 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          cisoMode={cisoMode}
          onCisoModeChange={setCisoMode}
          uniqueIncidents={uniqueIncidentCount}
          totalArticles={totalSourceCount}
        />

        {/* Global Filter Bar */}
        <GlobalFilterBar 
          onFilterChange={setGlobalFilters}
          initialFilters={globalFilters}
        />

        {/* Reading Progress Tracker */}
        {selectedYear === currentYear && filteredIncidents.length > 0 && (
          <ReadingProgress 
            incidents={filteredIncidents} 
            currentFilters={globalFilters}
          />
        )}

        {/* Data Methodology Note */}
        <section className="methodology-note-section" aria-label="Data methodology">
          <div className="methodology-note">
            <div className="note-icon">ℹ️</div>
            <div className="note-content">
              <strong>About the data:</strong> This report summarizes <strong>news articles and items published in {selectedYear}</strong>.
              Item counts represent news articles and updates from RSS feeds. Multiple articles may report on the same underlying incident.
              {selectedYear === currentYear && (
                <span className="ytd-note"> As we are early in {selectedYear}, trend analysis requiring quarterly data is limited.</span>
              )}
            </div>
          </div>
        </section>

        {/* Weekly Highlights */}
        {selectedYear === currentYear && (
          <WeeklyHighlights incidents={incidentsData} />
        )}

        {/* Main Content - Routed Views */}
        <main id="main-content">
          <Routes>
            <Route path="/" element={
              <OverviewView 
                incidents={filteredIncidents}
                selectedYear={selectedYear}
                filters={globalFilters}
              />
            } />
            <Route path="/threats" element={
              <ThreatLandscapeView 
                incidents={filteredIncidents}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedRegion={selectedRegion}
                filters={globalFilters}
              />
            } />
            <Route path="/mitre" element={
              <MITREView 
                incidents={filteredIncidents}
                filters={globalFilters}
              />
            } />
            <Route path="/defense" element={
              <DefenseView 
                incidents={filteredIncidents}
                selectedYear={selectedYear}
                filters={globalFilters}
              />
            } />
            <Route path="/sectors" element={
              <SectorsView 
                incidents={filteredIncidents}
                selectedYear={selectedYear}
                filters={globalFilters}
              />
            } />
            <Route path="/ciso" element={
              <CISOView 
                incidents={filteredIncidents}
                selectedYear={selectedYear}
                filters={globalFilters}
                onModeChange={setCisoMode}
              />
            } />
            <Route path="/data" element={
              <DataInsightsView 
                incidents={incidentsData}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                filteredIncidents={filteredIncidents}
                handleTagClick={handleTagClick}
                selectedTags={selectedTags}
                formatDate={formatDate}
                getImpactBadge={getImpactBadge}
                learningLog={learningLog}
                cisoMode={cisoMode}
              />
            } />
          </Routes>
        </main>

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
            Covers {selectedYear} • {incidentsData.length} items • Last updated {new Date().toLocaleDateString('en-US')}
          </p>
        </footer>
      </div>
    </Router>
  )
}

export default App
