import DefenseAnalysis from '../components/DefenseAnalysis'
import DetectionGapAnalysis from '../components/DetectionGapAnalysis'

export default function DefenseView({ incidents, selectedYear, filters }) {
  return (
    <div className="view-container defense-view">
      <div className="view-header">
        <h1>🛡️ Defense Effectiveness</h1>
        <p className="view-description">
          What worked, what failed, and where detection gaps exist
        </p>
      </div>

      <div id="defense">
        <DefenseAnalysis incidents={incidents} selectedYear={selectedYear} />
      </div>

      <div id="detection-gaps">
        <DetectionGapAnalysis incidents={incidents} filters={filters} />
      </div>
    </div>
  )
}
