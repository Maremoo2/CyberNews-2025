import { useState } from 'react';
import './CISOMode.css';

/**
 * CISO Mode Toggle Component
 * Professional executive dashboard with filtering options:
 * - Only critical incidents
 * - Only curated (high-quality) incidents  
 * - Only high confidence mappings
 */
function CISOMode({ onModeChange }) {
  const [mode, setMode] = useState({
    enabled: false,
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
    if (field !== 'enabled' && !newMode.criticalOnly && !newMode.curatedOnly && !newMode.highConfidenceOnly) {
      newMode.enabled = false;
    }
    
    setMode(newMode);
    onModeChange(newMode);
  };

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
            {mode.criticalOnly && <span className="filter-badge">Critical</span>}
            {mode.curatedOnly && <span className="filter-badge">Curated</span>}
            {mode.highConfidenceOnly && <span className="filter-badge">High Confidence</span>}
          </div>
        </>
      )}
    </div>
  );
}

export default CISOMode;
