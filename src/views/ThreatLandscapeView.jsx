import ThreatActorProfile from '../components/ThreatActorProfile'
import TrendDashboard from '../components/TrendDashboard'
import TrendAcceleration from '../components/TrendAcceleration'
import TrendContinuity from '../components/TrendContinuity'

export default function ThreatLandscapeView({ 
  incidents, 
  selectedYear, 
  selectedMonth, 
  selectedRegion,
  filters 
}) {
  return (
    <div className="view-container threat-landscape-view">
      <div className="view-header">
        <h1>🌍 Threat Landscape</h1>
        <p className="view-description">
          Overview of threat actors, attack vectors, and emerging trends in {selectedYear}
        </p>
      </div>

      <div id="actors">
        <ThreatActorProfile incidents={incidents} />
      </div>

      <TrendDashboard 
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedRegion={selectedRegion}
        incidents={incidents}
      />

      <TrendAcceleration incidents={incidents} filters={filters} />

      <TrendContinuity incidents={incidents} />
    </div>
  )
}
