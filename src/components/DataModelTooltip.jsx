import { useState } from 'react';
import './DataModelTooltip.css';

/**
 * DataModelTooltip Component
 * 
 * Provides a clear explanation of the data model terminology used throughout the dashboard.
 * Explains the difference between Items/Articles, Incidents, and Clusters.
 */
function DataModelTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="data-model-tooltip">
      <button 
        className="tooltip-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Show data model explanation"
        title="Click to learn about our data model"
      >
        <span className="tooltip-icon">ℹ️</span>
        <span className="tooltip-label">Data Model</span>
      </button>

      {isOpen && (
        <div className="tooltip-modal">
          <div className="tooltip-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="tooltip-content">
            <div className="tooltip-header">
              <h3>📊 Data Model & Terminology</h3>
              <button 
                className="tooltip-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="tooltip-body">
              <div className="term-definition">
                <h4>📰 Item / Article</h4>
                <p>
                  One RSS entry or news article from a source. This is the raw unit of content.
                  <strong> Example:</strong> A single news article about a ransomware attack.
                </p>
              </div>

              <div className="term-definition">
                <h4>🎯 Incident</h4>
                <p>
                  A real-world cybersecurity event (e.g., a breach, attack, or compromise).
                  <strong> Note:</strong> Multiple articles may report on the same incident.
                </p>
              </div>

              <div className="term-definition">
                <h4>🔵 Incident Cluster</h4>
                <p>
                  A group of articles that appear to describe the same incident, identified using 
                  heuristics (organization + attack type + date window ±3 days). This is an 
                  <strong> estimate</strong> of unique incidents, not a confirmed count.
                </p>
              </div>

              <div className="term-definition">
                <h4>🔓 Vulnerability / CVE</h4>
                <p>
                  A software weakness or security flaw. May or may not be exploited in an actual incident.
                </p>
              </div>

              <div className="term-definition">
                <h4>📋 Incident-Related Item</h4>
                <p>
                  An article that describes an actual cybersecurity event (not opinion pieces, product 
                  announcements, VPN ads, or how-to guides).
                </p>
              </div>

              <div className="important-note">
                <strong>⚠️ Important:</strong> Throughout this dashboard:
                <ul>
                  <li><strong>Items/Articles</strong> = count of news articles (higher numbers)</li>
                  <li><strong>Incident Clusters</strong> = estimated unique events (lower numbers)</li>
                  <li><strong>Sector/Tag mentions</strong> = can exceed total items (one item can have multiple tags)</li>
                </ul>
                <p style={{ marginTop: '0.75rem' }}>
                  Always check the label to understand what's being counted. When in doubt, 
                  assume it's counting <em>items</em> unless specifically labeled as "clusters" or "estimated unique incidents".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataModelTooltip;
