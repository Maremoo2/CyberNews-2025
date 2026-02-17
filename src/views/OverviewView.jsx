import HeroSection from '../components/HeroSection'
import ExecutiveSummary from '../components/ExecutiveSummary'
import ThreatLandscapeSnapshot from '../components/ThreatLandscapeSnapshot'
import StrategicRiskThemes from '../components/StrategicRiskThemes'
import YearStats from '../components/YearStats'
import QuarterlyReview from '../components/QuarterlyReview'

export default function OverviewView({ incidents, selectedYear, filters }) {
  return (
    <div className="view-container overview-view">
      <div id="home">
        <HeroSection selectedYear={selectedYear} />
      </div>

      <div id="summary">
        <ExecutiveSummary incidents={incidents} selectedYear={selectedYear} />
      </div>

      <div id="snapshot">
        <ThreatLandscapeSnapshot incidents={incidents} />
      </div>

      <div id="themes">
        <StrategicRiskThemes incidents={incidents} selectedYear={selectedYear} filters={filters} />
      </div>

      <YearStats incidents={incidents} selectedYear={selectedYear} />

      <QuarterlyReview incidents={incidents} />
    </div>
  )
}
