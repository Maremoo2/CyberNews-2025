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

const currentYear = new Date().getFullYear()

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
  return (
    <div className="view-container data-insights-view">
      <div className="view-header">
        <h1>📊 Data & Insights</h1>
        <p className="view-description">
          All incidents, data quality metrics, methodology, and AI-powered intelligence
        </p>
      </div>

      {selectedYear === currentYear && (
        <div id="daily-digest">
          <AIInsights />
        </div>
      )}

      {selectedYear === currentYear && (
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
