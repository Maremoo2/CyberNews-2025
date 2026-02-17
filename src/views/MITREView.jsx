import ThreatIntelligence from '../components/ThreatIntelligence'
import AttackChainAnalysis from '../components/AttackChainAnalysis'

export default function MITREView({ incidents, filters }) {
  return (
    <div className="view-container mitre-view">
      <div className="view-header">
        <h1>🎯 MITRE ATT&CK & Attack Chains</h1>
        <p className="view-description">
          Analysis of attack techniques, tactics, and complete attack chain reconstructions
        </p>
      </div>

      <div id="mitre">
        <ThreatIntelligence incidents={incidents} />
      </div>

      <div id="attack-chains">
        <AttackChainAnalysis incidents={incidents} filters={filters} />
      </div>
    </div>
  )
}
