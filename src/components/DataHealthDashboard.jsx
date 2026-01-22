import { useState } from 'react';
import { getDataHealth, getEnrichmentQualityMessage } from '../utils/populationUtils';
import { getDataCompleteness, getContentTypeBreakdown } from '../utils/analyticsUtils';
import './DataHealthDashboard.css';

/**
 * Data Health Dashboard
 * Shows transparency about data quality and enrichment status
 */
function DataHealthDashboard({ incidents }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  if (!incidents || incidents.length === 0) {
    return null;
  }

  const health = getDataHealth(incidents);
  const qualityMessage = getEnrichmentQualityMessage(incidents);
  const completeness = getDataCompleteness(incidents);
  const contentBreakdown = getContentTypeBreakdown(incidents);

  // Get diagnosis message
  const getDiagnosisMessage = () => {
    if (health.diagnosis === 'raw_data') {
      return {
        icon: '📦',
        title: 'You are viewing RAW dataset',
        message: 'No enrichment fields present. This is the raw data without analysis.',
        type: 'info'
      };
    } else if (health.diagnosis === 'empty_enrichment') {
      return {
        icon: '⚠️',
        title: 'Enrichment fields exist but values are empty',
        message: 'This could indicate a pipeline bug. Fields are present but contain no data.',
        type: 'error'
      };
    } else if (health.diagnosis === 'partial_enrichment') {
      return {
        icon: '⚙️',
        title: 'Partial enrichment detected',
        message: 'Some enrichment exists but coverage is incomplete.',
        type: 'info'
      };
    }
    return null;
  };

  const diagnosis = getDiagnosisMessage();

  return (
    <>
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
            {diagnosis && (
              <div className={`diagnosis-banner ${diagnosis.type}`}>
                <span className="diagnosis-icon">{diagnosis.icon}</span>
                <div className="diagnosis-content">
                  <strong>{diagnosis.title}</strong>
                  <p>{diagnosis.message}</p>
                </div>
              </div>
            )}

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
                  {!health.fieldPresence.severityField && <span className="field-missing"> • field missing</span>}
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
                  {!health.fieldPresence.themesField && <span className="field-missing"> • field missing</span>}
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
                  {!health.fieldPresence.mitreField && <span className="field-missing"> • field missing</span>}
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
                  {!health.fieldPresence.curatedField && <span className="field-missing"> • field missing</span>}
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
                  {!health.fieldPresence.contentTypeField && <span className="field-missing"> • field missing</span>}
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

            {/* NEW: Content Type Breakdown */}
            {contentBreakdown && contentBreakdown.breakdown && (
              <div className="content-type-section">
                <h3 className="section-title">📑 Content Type Distribution</h3>
                <div className="content-type-grid">
                  {Object.entries(contentBreakdown.breakdown).map(([type, count]) => (
                    <div key={type} className="content-type-item">
                      <span className="type-label">{type}</span>
                      <span className="type-count">{count}</span>
                      <span className="type-percent">({contentBreakdown.percentages[type]}%)</span>
                    </div>
                  ))}
                </div>
                <p className="content-type-note">
                  💡 For accurate analytics, use "Incident-only" filter to exclude explainers, opinions, and product content.
                </p>
              </div>
            )}

            {/* NEW: Data Completeness Dashboard */}
            {completeness && completeness.percentages && (
              <div className="completeness-section">
                <h3 className="section-title">📊 Field Completeness (What to Curate Next)</h3>
                
                {/* P2 improvement: Color-coded sector quality with tooltip */}
                {completeness.sectorQuality && (
                  <div 
                    className={`sector-quality-alert ${
                      completeness.sectorQuality.unknownRate < 20 ? 'quality-good' :
                      completeness.sectorQuality.unknownRate < 40 ? 'quality-medium' :
                      'quality-poor'
                    }`}
                    title={
                      completeness.sectorQuality.unknownRate >= 40 
                        ? 'High unknown rate indicates weak enrichment signals' 
                        : completeness.sectorQuality.unknownRate >= 20
                        ? 'Moderate unknown rate - enrichment could be improved'
                        : 'Good sector enrichment coverage'
                    }
                  >
                    <strong>
                      {completeness.sectorQuality.unknownRate < 20 ? '✅' : 
                       completeness.sectorQuality.unknownRate < 40 ? '⚠️' : '🔴'} Sector Quality:
                    </strong> {completeness.sectorQuality.unknownRate}% unknown/unclassified 
                    ({completeness.sectorQuality.unknown} items)
                    {completeness.sectorQuality.unknownRate >= 40 && ' - Weak enrichment signals'}
                  </div>
                )}
                
                <div className="completeness-stats">
                  <div className="completeness-stat">
                    <span className="stat-label">Sector/Tags:</span>
                    <span className="stat-value">{completeness.percentages.with_sector}%</span>
                    <span className="stat-bar" style={{ 
                      width: `${completeness.percentages.with_sector}%`,
                      background: completeness.percentages.with_sector >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                  completeness.percentages.with_sector >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                  'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                    }}></span>
                  </div>
                  {completeness.sectorQuality && (
                    <div className="completeness-stat">
                      <span className="stat-label">Sector (Enriched):</span>
                      <span className="stat-value">{completeness.sectorQuality.enrichmentRate}%</span>
                      <span className="stat-bar" style={{ 
                        width: `${completeness.sectorQuality.enrichmentRate}%`,
                        background: completeness.sectorQuality.enrichmentRate >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                    completeness.sectorQuality.enrichmentRate >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                    'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                      }}></span>
                    </div>
                  )}
                  <div className="completeness-stat">
                    <span className="stat-label">Country:</span>
                    <span className="stat-value">{completeness.percentages.with_country}%</span>
                    <span className="stat-bar" style={{ 
                      width: `${completeness.percentages.with_country}%`,
                      background: completeness.percentages.with_country >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                  completeness.percentages.with_country >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                  'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                    }}></span>
                  </div>
                  <div className="completeness-stat">
                    <span className="stat-label">Incident Type:</span>
                    <span className="stat-value">{completeness.percentages.with_incident_type}%</span>
                    <span className="stat-bar" style={{ 
                      width: `${completeness.percentages.with_incident_type}%`,
                      background: completeness.percentages.with_incident_type >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                  completeness.percentages.with_incident_type >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                  'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                    }}></span>
                  </div>
                  <div className="completeness-stat">
                    <span className="stat-label">Actor Category:</span>
                    <span className="stat-value">{completeness.percentages.with_actor_category}%</span>
                    <span className="stat-bar" style={{ 
                      width: `${completeness.percentages.with_actor_category}%`,
                      background: completeness.percentages.with_actor_category >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                  completeness.percentages.with_actor_category >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                  'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                    }}></span>
                  </div>
                  <div className="completeness-stat">
                    <span className="stat-label">MITRE Mapping:</span>
                    <span className="stat-value">{completeness.percentages.with_mitre_mapping}%</span>
                    <span className="stat-bar" style={{ 
                      width: `${completeness.percentages.with_mitre_mapping}%`,
                      background: completeness.percentages.with_mitre_mapping >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                  completeness.percentages.with_mitre_mapping >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                  'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                    }}></span>
                  </div>
                  <div className="completeness-stat">
                    <span className="stat-label">Timeline Status:</span>
                    <span className="stat-value">{completeness.percentages.with_milestones}%</span>
                    <span className="stat-bar" style={{ 
                      width: `${completeness.percentages.with_milestones}%`,
                      background: completeness.percentages.with_milestones >= 80 ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                                  completeness.percentages.with_milestones >= 50 ? 'linear-gradient(90deg, #ffa726 0%, #ffb74d 100%)' :
                                  'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                    }}></span>
                  </div>
                </div>
              </div>
            )}

            <div className="health-actions">
              <button className="how-to-btn" onClick={() => setShowModal(true)}>
                📖 How to generate analytics
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="enrichment-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="enrichment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>🚀 Generate Analytics Data</h2>
            <p className="modal-intro">
              This dashboard runs on enriched data that includes severity scores, themes, 
              MITRE ATT&CK mapping, and threat actor attribution. Follow these steps:
            </p>

            <div className="modal-steps">
              <div className="modal-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Install dependencies</h3>
                  <code className="code-block">npm install</code>
                  <p>Ensures all required packages are available</p>
                </div>
              </div>

              <div className="modal-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Run enrichment script</h3>
                  <code className="code-block">npm run enrich-enhanced</code>
                  <p>Processes incidents and generates analytics (takes 2-5 minutes)</p>
                </div>
              </div>

              <div className="modal-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Start development server</h3>
                  <code className="code-block">npm run dev</code>
                  <p>Launch the dashboard with full analytics enabled</p>
                </div>
              </div>
            </div>

            <div className="modal-why">
              <h3>Why this matters</h3>
              <ul>
                <li><strong>Severity Analysis:</strong> Identifies critical vs low-risk incidents</li>
                <li><strong>Strategic Themes:</strong> Groups incidents into strategic risk categories</li>
                <li><strong>MITRE ATT&CK:</strong> Maps attack techniques to industry framework</li>
                <li><strong>Attribution:</strong> Links incidents to known threat actors</li>
              </ul>
            </div>

            <button className="modal-action" onClick={() => setShowModal(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DataHealthDashboard;
