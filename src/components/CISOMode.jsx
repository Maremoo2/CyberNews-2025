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
 * - Most disruptive ongoing cases
 * - Fast-moving exploit-led exposure
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
      .sort((a, b) => {
        // Safe date comparison with fallback to 0 for invalid/missing dates
        const dateA = a.last_seen ? new Date(a.last_seen).getTime() : 0;
        const dateB = b.last_seen ? new Date(b.last_seen).getTime() : 0;
        return dateB - dateA; // Most recent first
      })
      .slice(0, 10); // Top 10 most recent
  }, [incidents, mode.enabled, mode.incidentOnly]);

  // NEW: Most disruptive ongoing cases
  const disruptiveCases = useMemo(() => {
    if (!incidents || !mode.enabled) return [];
    
    // Filter to ongoing incidents with high severity in last 14 days
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    return incidents
      .filter(i => {
        // Must be incident type
        if (mode.incidentOnly && i.content_type !== 'incident' && i.content_type !== 'campaign') return false;
        
        // Must be ongoing
        if (i.timeline?.status !== 'ongoing') return false;
        
        // Must have high severity
        if (i.severity_score < 40) return false;
        
        // Must have recent update
        const lastSeen = i.timeline?.last_seen || i.date;
        const lastSeenDate = new Date(lastSeen);
        if (lastSeenDate < twoWeeksAgo) return false;
        
        return true;
      })
      .sort((a, b) => b.severity_score - a.severity_score)
      .slice(0, 5)
      .map(i => ({
        ...i,
        reasons: generateWhyReasons(i, 'disruptive')
      }));
  }, [incidents, mode.enabled, mode.incidentOnly]);

  // NEW: Fast-moving exploit-led exposure
  const exploitCases = useMemo(() => {
    if (!incidents || !mode.enabled) return [];
    
    // Filter to exploit-led incidents (CVE or T1190)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return incidents
      .filter(i => {
        // Must be incident type
        if (mode.incidentOnly && i.content_type !== 'incident' && i.content_type !== 'campaign') return false;
        
        // Must be recent (last 7 days)
        const incidentDate = new Date(i.date);
        if (incidentDate < oneWeekAgo) return false;
        
        // Must have exploit indicators
        const hasExploit = i.mitre_technique_ids?.includes('T1190') || 
                          /cve-\d{4}-\d+/i.test(i.title + i.summary);
        if (!hasExploit) return false;
        
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(i => ({
        ...i,
        reasons: generateWhyReasons(i, 'exploit')
      }));
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

          {/* NEW: Most Disruptive Ongoing Cases */}
          {disruptiveCases.length > 0 && (
            <div className="ciso-panel disruptive-cases">
              <h4 className="panel-title">
                ⚠️ Most Disruptive Ongoing Cases ({disruptiveCases.length})
              </h4>
              <div className="panel-subtitle">
                High-severity incidents active in last 14 days
              </div>
              <div className="case-list">
                {disruptiveCases.map((incident) => (
                  <div key={incident.id} className="case-item">
                    <div className="case-header">
                      <div className="case-title">{incident.title}</div>
                      <div className="case-severity">
                        {incident.severity_score}/100
                      </div>
                    </div>
                    <div className="case-why">
                      <strong>Why you're seeing this:</strong>
                      <ul className="why-list">
                        {incident.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Fast-Moving Exploit-Led Exposure */}
          {exploitCases.length > 0 && (
            <div className="ciso-panel exploit-cases">
              <h4 className="panel-title">
                🚨 Fast-Moving Exploit-Led Exposure ({exploitCases.length})
              </h4>
              <div className="panel-subtitle">
                CVE exploitations and public-facing vulnerabilities (last 7 days)
              </div>
              <div className="case-list">
                {exploitCases.map((incident) => (
                  <div key={incident.id} className="case-item">
                    <div className="case-header">
                      <div className="case-title">{incident.title}</div>
                      <div className="case-date">
                        {new Date(incident.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="case-why">
                      <strong>Why you're seeing this:</strong>
                      <ul className="why-list">
                        {incident.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ongoing Incidents List */}
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

/**
 * Generate "why you're seeing this" reasons (max 3 bullets)
 */
function generateWhyReasons(incident, context) {
  const reasons = [];
  
  if (context === 'disruptive') {
    // Why disruptive?
    if (incident.severity_score >= 60) {
      reasons.push(`High severity score: ${incident.severity_score}/100`);
    } else if (incident.severity_score >= 40) {
      reasons.push(`Moderate-high severity: ${incident.severity_score}/100`);
    }
    
    if (incident.timeline?.status === 'ongoing' && incident.timeline.first_seen) {
      const firstSeen = new Date(incident.timeline.first_seen);
      if (!isNaN(firstSeen.getTime())) {
        const daysSince = Math.round((new Date() - firstSeen) / (1000 * 60 * 60 * 24));
        reasons.push(`Active for ${daysSince} days`);
      }
    }
    
    if (incident.severity_drivers?.includes('Critical infrastructure impact')) {
      reasons.push('Impacts critical infrastructure');
    } else if (incident.severity_drivers?.includes('Service disruption')) {
      reasons.push('Service disruption/outage');
    } else if (incident.severity_drivers?.includes('Sensitive data exposure')) {
      reasons.push('Sensitive data exposure');
    }
  } else if (context === 'exploit') {
    // Why exploit-led?
    const cveMatch = (incident.title + incident.summary).match(/cve-\d{4}-\d+/i);
    if (cveMatch) {
      reasons.push(`CVE identified: ${cveMatch[0].toUpperCase()}`);
    }
    
    if (incident.mitre_technique_ids?.includes('T1190')) {
      reasons.push('Exploits public-facing application (T1190)');
    }
    
    const daysSince = Math.round((new Date() - new Date(incident.date)) / (1000 * 60 * 60 * 24));
    reasons.push(`Reported ${daysSince} day${daysSince !== 1 ? 's' : ''} ago`);
  }
  
  // Limit to 3 reasons
  return reasons.slice(0, 3);
}

export default CISOMode;
