import { useMemo } from 'react';
import './ThreatLandscapeSnapshot.css';

/**
 * Threat Landscape Snapshot
 * 4-box overview: Top Initial Access, Top Impact, Top Themes, Top Defensive Focus
 */
function ThreatLandscapeSnapshot({ incidents }) {
  const snapshot = useMemo(() => {
    // Top Initial Access (MITRE T1190, T1133, T1566)
    const initialAccessCounts = {};
    incidents.forEach(incident => {
      if (incident.mitre_techniques) {
        incident.mitre_techniques.forEach(tech => {
          if (['T1190', 'T1133', 'T1566', 'T1078'].includes(tech.id)) {
            initialAccessCounts[tech.name] = (initialAccessCounts[tech.name] || 0) + 1;
          }
        });
      }
    });
    const topInitialAccess = Object.entries(initialAccessCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1)[0] || ['Unknown', 0];

    // Top Impact (most common severity)
    const criticalCount = incidents.filter(i => i.severity === 'critical').length;
    const highCount = incidents.filter(i => i.impact >= 4).length;
    const topImpact = criticalCount > 0 
      ? `${criticalCount} Critical Incidents` 
      : `${highCount} High-Impact Events`;

    // Top 3 Themes
    const themeCounts = {};
    incidents.forEach(incident => {
      if (incident.themes) {
        incident.themes.forEach(theme => {
          const themeName = typeof theme === 'object' ? theme.name : theme;
          themeCounts[themeName] = (themeCounts[themeName] || 0) + 1;
        });
      }
    });
    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    // Top Defensive Focus (most needed controls)
    const exploitLed = incidents.filter(i => 
      i.mitre_technique_ids?.includes('T1190') ||
      i.severity_drivers?.some(d => d.toLowerCase().includes('exploit'))
    ).length;
    const identityBased = incidents.filter(i =>
      i.mitre_technique_ids?.includes('T1078') ||
      i.tags?.some(t => t.toLowerCase().includes('identity'))
    ).length;
    
    let topDefense = 'Patch Management';
    if (identityBased > exploitLed) {
      topDefense = 'Identity & Access Management';
    } else if (exploitLed > incidents.length * 0.3) {
      topDefense = 'Vulnerability Management';
    }

    return {
      topInitialAccess,
      topImpact,
      topThemes,
      topDefense,
      totalIncidents: incidents.length
    };
  }, [incidents]);

  return (
    <div className="threat-landscape-snapshot">
      <div className="section-header">
        <h2>🌐 Threat Landscape Snapshot</h2>
        <p className="subtitle">Quick overview of the current threat environment</p>
      </div>

      <div className="snapshot-grid">
        <div className="snapshot-card">
          <div className="card-icon">🚪</div>
          <h3>Top Initial Access</h3>
          <div className="card-value">{snapshot.topInitialAccess[0]}</div>
          <div className="card-stat">{snapshot.topInitialAccess[1]} incidents</div>
        </div>

        <div className="snapshot-card">
          <div className="card-icon">💥</div>
          <h3>Top Impact</h3>
          <div className="card-value">{snapshot.topImpact}</div>
          <div className="card-stat">of {snapshot.totalIncidents} total</div>
        </div>

        <div className="snapshot-card">
          <div className="card-icon">🎯</div>
          <h3>Top Themes</h3>
          <div className="card-themes">
            {snapshot.topThemes.length > 0 ? (
              snapshot.topThemes.map((theme, idx) => (
                <div key={idx} className="theme-item">
                  {idx + 1}. {theme}
                </div>
              ))
            ) : (
              <div className="theme-item">No themes detected</div>
            )}
          </div>
        </div>

        <div className="snapshot-card">
          <div className="card-icon">🛡️</div>
          <h3>Top Defensive Focus</h3>
          <div className="card-value">{snapshot.topDefense}</div>
          <div className="card-stat">Priority control area</div>
        </div>
      </div>
    </div>
  );
}

export default ThreatLandscapeSnapshot;
