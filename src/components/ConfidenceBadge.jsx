import './ConfidenceBadge.css';

/**
 * ConfidenceBadge Component (Refined API)
 * 
 * Reusable component to display confidence/data quality indicators.
 * Makes uncertainty visible before users interpret the data.
 * 
 * Usage:
 *   <ConfidenceBadge level="high" label="MITRE coverage" value="85%" tooltip="..." />
 *   <ConfidenceBadge level="medium" label="Severity model" value="2% curated" tooltip="..." />
 *   <ConfidenceBadge level="low" label="Attack chains" value="5.5%" tooltip="..." />
 */
function ConfidenceBadge({ 
  level = 'medium',     // 'high', 'medium', 'low'
  label,                // What the confidence applies to (e.g., "MITRE coverage", "Severity model")
  value,                // String/number (e.g., "32.6%", "2% curated", "5.5%")
  tooltip,              // Short, plain-language explanation
  variant = 'pill',     // 'pill' or 'inline'
  size = 'sm'           // 'sm' or 'md'
}) {
  const getConfig = (level) => {
    const configs = {
      high: {
        icon: '🟢',
        word: 'High',
        color: '#16a34a',
        bgColor: 'rgba(22, 163, 74, 0.1)'
      },
      medium: {
        icon: '🟡',
        word: 'Medium',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)'
      },
      low: {
        icon: '🔴',
        word: 'Low',
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.1)'
      }
    };
    return configs[level] || configs.medium;
  };

  const config = getConfig(level);
  
  // Build display text: Icon + word + optional label: value
  const displayParts = [
    `${config.icon} ${config.word}`
  ];
  
  if (label && value) {
    displayParts.push(`${label}: ${value}`);
  } else if (label) {
    displayParts.push(label);
  }
  
  const displayText = displayParts.join(' — ');

  return (
    <div 
      className={`confidence-badge confidence-${level} variant-${variant} size-${size}`}
      title={tooltip}
      role="status"
      aria-label={`${config.word} confidence for ${label || 'this data'}`}
    >
      <span className="confidence-content">{displayText}</span>
    </div>
  );
}

export default ConfidenceBadge;
