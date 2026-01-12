import { useState } from 'react';
import { getDataHealth, getEnrichmentQualityMessage } from '../utils/populationUtils';
import './DataHealthDashboard.css';

/**
 * Data Health Dashboard
 * Shows transparency about data quality and enrichment status
 */
function DataHealthDashboard({ incidents }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!incidents || incidents.length === 0) {
    return null;
  }

  const health = getDataHealth(incidents);
  const qualityMessage = getEnrichmentQualityMessage(incidents);

  return (
    <div className="data-health-dashboard">
      <button 
        className="health-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label="Toggle data health details"
      >
        <span className="health-icon">📊</span>
        <span className="health-summary">
          Data Health: {health.loaded} loaded
          {health.curated > 0 && ` • ${health.curated} curated (${health.percentages.curated}%)`}
        </span>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="health-details">
          <div className="health-message">
            <strong>{qualityMessage}</strong>
          </div>

          <div className="health-stats">
            <div className="health-stat">
              <span className="stat-label">Total Loaded:</span>
              <span className="stat-value">{health.loaded}</span>
              <span className="stat-bar" style={{ width: '100%' }}></span>
            </div>

            <div className="health-stat">
              <span className="stat-label">Has Severity:</span>
              <span className="stat-value">
                {health.hasSeverity} ({health.percentages.severity}%)
              </span>
              <span 
                className="stat-bar" 
                style={{ 
                  width: `${health.percentages.severity}%`,
                  backgroundColor: health.percentages.severity > 50 ? '#4caf50' : '#ff9800'
                }}
              ></span>
            </div>

            <div className="health-stat">
              <span className="stat-label">Has Themes:</span>
              <span className="stat-value">
                {health.hasThemes} ({health.percentages.themes}%)
              </span>
              <span 
                className="stat-bar" 
                style={{ 
                  width: `${health.percentages.themes}%`,
                  backgroundColor: health.percentages.themes > 50 ? '#4caf50' : '#ff9800'
                }}
              ></span>
            </div>

            <div className="health-stat">
              <span className="stat-label">Has MITRE:</span>
              <span className="stat-value">
                {health.hasMitre} ({health.percentages.mitre}%)
              </span>
              <span 
                className="stat-bar" 
                style={{ 
                  width: `${health.percentages.mitre}%`,
                  backgroundColor: health.percentages.mitre > 50 ? '#4caf50' : '#ff9800'
                }}
              ></span>
            </div>

            <div className="health-stat">
              <span className="stat-label">Curated:</span>
              <span className="stat-value">
                {health.curated} ({health.percentages.curated}%)
              </span>
              <span 
                className="stat-bar" 
                style={{ 
                  width: `${health.percentages.curated}%`,
                  backgroundColor: health.percentages.curated > 10 ? '#4caf50' : '#f44336'
                }}
              ></span>
            </div>

            <div className="health-stat">
              <span className="stat-label">Has Content Type:</span>
              <span className="stat-value">
                {health.hasContentType} ({health.percentages.contentType}%)
              </span>
              <span 
                className="stat-bar" 
                style={{ 
                  width: `${health.percentages.contentType}%`,
                  backgroundColor: health.percentages.contentType > 50 ? '#4caf50' : '#ff9800'
                }}
              ></span>
            </div>
          </div>

          <div className="health-note">
            <p>
              <strong>Note:</strong> This dashboard shows data enrichment quality. 
              If enrichment percentages are low, run the enrichment script: 
              <code>npm run enrich-enhanced</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataHealthDashboard;
