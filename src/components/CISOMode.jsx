import { useState, useMemo } from 'react';
import { getIncidentDurations, POPULATION_TYPES } from '../utils/analyticsUtils';
import './CISOMode.css';

/**
 * CISO Mode Toggle Component
 * Professional executive dashboard with filtering options:
 * - Incident-only (default): Real-world incidents, excludes explainers/opinions
 * - Critical incidents only
 * - Curated (high-quality) incidents  
 * - High confidence mappings
 * - Shows ongoing incidents list
 */
function CISOMode({ onModeChange, incidents }) {
  const [mode, setMode] = useState({
    enabled: false,
    incidentOnly: true,  // NEW: Default to incidents-only
    criticalOnly: false,
    curatedOnly: false,
    highConfidenceOnly: false
  });

  const handleToggle = (field) => {
    const newMode = { ...mode, [field]: !mode[field] };
    
    // If enabling any filter, enable CISO mode
    if ((field !== 'enabled') && !mode[field]) {
      newMode.enabled = true;
    }
    
    // If disabling all filters, disable CISO mode
    if (field !== 'enabled' && !newMode.incidentOnly && !newMode.criticalOnly && !newMode.curatedOnly && !newMode.highConfidenceOnly) {
      newMode.enabled = false;
    }
    
    setMode(newMode);
    onModeChange(newMode);
  };

  // Get ongoing incidents
  const ongoingIncidents = useMemo(() => {
    if (!incidents || !mode.enabled) return [];
    
    const durations = getIncidentDurations(incidents, {
      population: mode.incidentOnly ? POPULATION_TYPES.INCIDENT_ONLY : POPULATION_TYPES.ALL
    });
    
    return durations.ongoing_incidents
      .sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen))
      .slice(0, 10); // Top 10 most recent
  }, [incidents, mode.enabled, mode.incidentOnly]);

  return (
    <div className={`ciso-mode-panel ${mode.enabled ? 'active' : ''}`}>
      <div className="ciso-header">
        <div className="ciso-title">
          <span className="icon">💼</span>
          <h3>CISO Mode</h3>
        </div>
        <button 
          className={`toggle-btn ${mode.enabled ? 'active' : ''}`}
          onClick={() => handleToggle('enabled')}
        >
          {mode.enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {mode.enabled && (
        <>
          <div className="ciso-description">
            Executive-level view with enhanced filtering for strategic decision making
          </div>

          <div className="filter-options">
            <label className={`filter-option ${mode.incidentOnly ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={mode.incidentOnly}
                onChange={() => handleToggle('incidentOnly')}
              />
              <div className="filter-content">
                <span className="filter-icon">🎯</span>
                <div className="filter-text">
                  <strong>Incident-Only</strong>
                  <span className="filter-desc">Exclude explainers, opinions & products</span>
                </div>
              </div>
            </label>

            <label className={`filter-option ${mode.criticalOnly ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={mode.criticalOnly}
                onChange={() => handleToggle('criticalOnly')}
              />
              <div className="filter-content">
                <span className="filter-icon">🔴</span>
                <div className="filter-text">
                  <strong>Critical Only</strong>
                  <span className="filter-desc">Show only severity ≥80/100</span>
                </div>
              </div>
            </label>

            <label className={`filter-option ${mode.curatedOnly ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={mode.curatedOnly}
                onChange={() => handleToggle('curatedOnly')}
              />
              <div className="filter-content">
                <span className="filter-icon">✅</span>
                <div className="filter-text">
                  <strong>Curated Only</strong>
                  <span className="filter-desc">High-quality enrichment</span>
                </div>
              </div>
            </label>

            <label className={`filter-option ${mode.highConfidenceOnly ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={mode.highConfidenceOnly}
                onChange={() => handleToggle('highConfidenceOnly')}
              />
              <div className="filter-content">
                <span className="filter-icon">🎯</span>
                <div className="filter-text">
                  <strong>High Confidence Only</strong>
                  <span className="filter-desc">Filter low-confidence mappings</span>
                </div>
              </div>
            </label>
          </div>

          <div className="active-filters-summary">
            {mode.incidentOnly && <span className="filter-badge">Incidents</span>}
            {mode.criticalOnly && <span className="filter-badge">Critical</span>}
            {mode.curatedOnly && <span className="filter-badge">Curated</span>}
            {mode.highConfidenceOnly && <span className="filter-badge">High Confidence</span>}
          </div>

          {/* NEW: Ongoing Incidents List */}
          {ongoingIncidents.length > 0 && (
            <div className="ongoing-incidents">
              <h4 className="ongoing-title">
                🔄 Top Ongoing Incidents ({ongoingIncidents.length})
              </h4>
              <div className="ongoing-list">
                {ongoingIncidents.map((incident) => (
                  <div key={incident.id} className="ongoing-item">
                    <div className="ongoing-indicator"></div>
                    <div className="ongoing-content">
                      <div className="ongoing-item-title">{incident.title}</div>
                      <div className="ongoing-dates">
                        {incident.first_seen && incident.last_seen ? (
                          <>
                            First seen: {new Date(incident.first_seen).toLocaleDateString()} • 
                            Last update: {new Date(incident.last_seen).toLocaleDateString()}
                          </>
                        ) : incident.date ? (
                          `Date: ${new Date(incident.date).toLocaleDateString()}`
                        ) : (
                          'Date unavailable'
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CISOMode;
