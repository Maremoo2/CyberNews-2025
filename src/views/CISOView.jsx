import ExecutiveSummary from '../components/ExecutiveSummary'
import CISOMode from '../components/CISOMode'
import StrategicRiskThemes from '../components/StrategicRiskThemes'
import RegulationImpact from '../components/RegulationImpact'
import ForecastsAndPredictions from '../components/ForecastsAndPredictions'

export default function CISOView({ incidents, selectedYear, filters, onModeChange }) {
  return (
    <div className="view-container ciso-view">
      <div className="view-header">
        <h1>👔 CISO View</h1>
        <p className="view-description">
          Executive summary, business impact, and strategic priorities for security leaders
        </p>
      </div>

      <CISOMode onModeChange={onModeChange} incidents={incidents} />

      <div id="summary">
        <ExecutiveSummary incidents={incidents} selectedYear={selectedYear} />
      </div>

      <div id="themes">
        <StrategicRiskThemes incidents={incidents} selectedYear={selectedYear} filters={filters} />
      </div>

      <div id="regulation">
        <RegulationImpact selectedYear={selectedYear} />
      </div>

      <div id="predictions">
        <ForecastsAndPredictions incidents={incidents} selectedYear={selectedYear} />
      </div>
    </div>
  )
}
