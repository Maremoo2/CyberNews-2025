import './ActorConfidenceBadge.css';

/**
 * ActorConfidenceBadge Component
 * 
 * Displays confidence level for threat actor attribution with clear visual indicators:
 * - 🟢 High confidence (law enforcement / indictment / vendor)
 * - 🟡 Suspected (media consensus / multiple credible sources)
 * - ⚪ Mention-only (article text / single source)
 */
function ActorConfidenceBadge({ confidence, showLabel = true, size = 'md' }) {
  const getConfidenceInfo = (level) => {
    const levels = {
      high: {
        icon: '🟢',
        label: 'High confidence',
        description: 'Law enforcement / indictment / vendor attribution',
        className: 'high'
      },
      medium: {
        icon: '🟡',
        label: 'Suspected',
        description: 'Media consensus / multiple credible sources',
        className: 'medium'
      },
      low: {
        icon: '⚪',
        label: 'Mention-only',
        description: 'Article text / single source',
        className: 'low'
      }
    };
    
    return levels[level] || levels.low;
  };

  const info = getConfidenceInfo(confidence);

  return (
    <span 
      className={`actor-confidence-badge ${info.className} size-${size}`}
      title={info.description}
      aria-label={`Attribution confidence: ${info.label}`}
    >
      <span className="confidence-icon">{info.icon}</span>
      {showLabel && <span className="confidence-label">{info.label}</span>}
    </span>
  );
}

export default ActorConfidenceBadge;
