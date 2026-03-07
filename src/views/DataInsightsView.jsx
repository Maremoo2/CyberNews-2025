import IncidentsSection from '../components/IncidentsSection'
import YearWheel from '../components/YearWheel'
import DataHealthDashboard from '../components/DataHealthDashboard'
import DeduplicationStats from '../components/DeduplicationStats'
import ValidationDashboard from '../components/ValidationDashboard'
import BiasIndicator from '../components/BiasIndicator'
import GlossaryAnalytics from '../components/GlossaryAnalytics'
import MethodologyAndLimitations from '../components/MethodologyAndLimitations'
import AIInsights from '../components/AIInsights'
import WeeklyAnalysis from '../components/WeeklyAnalysis'
import GlossaryPanel from '../components/GlossaryPanel'
import DocumentsGuide from '../components/DocumentsGuide'
import metadata from '../../data/metadata.json'

export default function DataInsightsView({ 
  incidents, 
  selectedYear,
  selectedMonth,
  setSelectedMonth,
  filteredIncidents,
  handleTagClick,
  selectedTags,
  formatDate,
  getImpactBadge,
  learningLog,
  cisoMode
}) {
  const hasIncidents = incidents && incidents.length > 0;
  const currentYear = new Date().getFullYear();
  const isCurrentYear = selectedYear === currentYear;

  // Compute enrichment staleness warning
  const lastUpdated = metadata.lastUpdated ? new Date(metadata.lastUpdated) : null;
  const lastEnrichment = metadata.lastEnrichment ? new Date(metadata.lastEnrichment) : null;
  const enrichmentStaleDays = (lastUpdated && lastEnrichment)
    ? Math.floor((lastUpdated - lastEnrichment) / (1000 * 60 * 60 * 24))
    : 0;
  const showEnrichmentWarning = enrichmentStaleDays > 7;

  return (
    <div className="view-container data-insights-view">
      <div className="view-header">
        <h1>📊 Data & Insights</h1>
        <p className="view-description">
          All incidents, data quality metrics, methodology, and AI-powered intelligence
        </p>
      </div>

      {showEnrichmentWarning && (
        <div className="enrichment-staleness-warning" role="alert" aria-live="polite">
          <span className="warning-icon">⚠️</span>
          <span>
            <strong>Enrichment data is {enrichmentStaleDays} days behind.</strong>{' '}
            Articles added after {lastEnrichment.toLocaleDateString('en-US')} may lack MITRE mappings,
            severity scores, and actor attribution. Last enrichment: {lastEnrichment.toLocaleDateString('en-US')}.
          </span>
        </div>
      )}

      {hasIncidents && isCurrentYear && (
        <div id="daily-digest">
          <AIInsights />
        </div>
      )}

      {hasIncidents && isCurrentYear && (
        <div id="weekly-brief">
          <WeeklyAnalysis />
        </div>
      )}

      <YearWheel 
        incidents={incidents}
        selectedMonth={selectedMonth}
        onMonthClick={setSelectedMonth}
        selectedYear={selectedYear}
      />

      <div id="incidents">
        <IncidentsSection 
          incidents={filteredIncidents}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
          formatDate={formatDate}
          getImpactBadge={getImpactBadge}
        />
      </div>

      {!cisoMode.enabled && <DataHealthDashboard incidents={incidents} />}

      {!cisoMode.enabled && <GlossaryAnalytics incidents={incidents} />}

      {!cisoMode.enabled && <DeduplicationStats incidents={incidents} />}

      {!cisoMode.enabled && <BiasIndicator incidents={incidents} />}

      {!cisoMode.enabled && <ValidationDashboard incidents={incidents} learningLog={learningLog} />}

      {!cisoMode.enabled && (
        <div id="methodology">
          <MethodologyAndLimitations />
        </div>
      )}

      {!cisoMode.enabled && (
        <div id="glossary">
          <GlossaryPanel />
        </div>
      )}

      <DocumentsGuide />
    </div>
  )
}
