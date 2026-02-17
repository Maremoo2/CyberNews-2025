import SectorAnalysis from '../components/SectorAnalysis'
import SectorBenchmarking from '../components/SectorBenchmarking'

export default function SectorsView({ incidents, selectedYear, filters }) {
  return (
    <div className="view-container sectors-view">
      <div className="view-header">
        <h1>🏢 Sectors Analysis</h1>
        <p className="view-description">
          Deep dive into targeted sectors and industry benchmarking
        </p>
      </div>

      <SectorAnalysis incidents={incidents} selectedYear={selectedYear} />

      <div id="benchmarking">
        <SectorBenchmarking incidents={incidents} filters={filters} />
      </div>
    </div>
  )
}
