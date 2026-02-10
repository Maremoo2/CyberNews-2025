import { useState, useEffect } from 'react';
import './ReadingProgress.css';

/**
 * Reading Progress Component
 * Implements Zeigarnik Effect: Shows progress to encourage completion
 * Also provides Fitts's Law compliant navigation buttons
 */
function ReadingProgress({ incidents, currentFilters }) {
  const [readIncidents, setReadIncidents] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [visibleIncidents, setVisibleIncidents] = useState([]);

  useEffect(() => {
    // Filter incidents based on current filters
    let filtered = incidents;
    if (currentFilters?.severity) {
      filtered = filtered.filter(i => (i.severity || 0) >= currentFilters.severity);
    }
    setVisibleIncidents(filtered);
  }, [incidents, currentFilters]);

  useEffect(() => {
    // Calculate progress
    if (visibleIncidents.length > 0) {
      const progressPercent = Math.round((readIncidents.size / visibleIncidents.length) * 100);
      setProgress(progressPercent);
    }
  }, [readIncidents, visibleIncidents]);

  useEffect(() => {
    // Track which incidents are viewed
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const incidentId = entry.target.dataset.incidentId;
            if (incidentId) {
              setReadIncidents(prev => new Set([...prev, incidentId]));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all incident cards
    const incidentElements = document.querySelectorAll('[data-incident-id]');
    incidentElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleIncidents]);

  const handleReset = () => {
    setReadIncidents(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinue = () => {
    // Find first unread incident and scroll to it
    const firstUnread = visibleIncidents.find(inc => !readIncidents.has(inc.id));
    if (firstUnread) {
      const element = document.querySelector(`[data-incident-id="${firstUnread.id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (visibleIncidents.length === 0) {
    return null;
  }

  const isComplete = progress === 100;
  const readCount = readIncidents.size;
  const totalCount = visibleIncidents.length;

  return (
    <div className="reading-progress-container">
      <div className="reading-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="reading-progress-content">
        <div className="progress-stats">
          <span className="progress-emoji">{isComplete ? '✅' : '📖'}</span>
          <span className="progress-text">
            {isComplete ? (
              <>
                <strong>Ferdig!</strong> Du har lest alle {totalCount} trusler
              </>
            ) : (
              <>
                <strong>{readCount} av {totalCount}</strong> trusler lest
                {readCount > 0 && ` (${progress}%)`}
              </>
            )}
          </span>
        </div>

        <div className="progress-actions">
          {!isComplete && readCount > 0 && (
            <button 
              className="continue-btn"
              onClick={handleContinue}
              title="Gå til neste uleste trussel"
            >
              ➡️ Fortsett lesing
            </button>
          )}
          
          {readCount > 0 && (
            <button 
              className="reset-btn"
              onClick={handleReset}
              title="Nullstill fremdrift og gå til toppen"
            >
              🔄 Start på nytt
            </button>
          )}
        </div>
      </div>

      {!isComplete && readCount === 0 && (
        <div className="progress-hint">
          💡 <em>Din lesestatus spores automatisk når du blar gjennom truslene</em>
        </div>
      )}

      {isComplete && (
        <div className="progress-celebration">
          🎉 <em>Flott jobbet! Du har nå oversikt over alle aktuelle trusler.</em>
        </div>
      )}
    </div>
  );
}

export default ReadingProgress;
