import './ConfidenceBadge.css';

/**
 * ConfidenceBadge Component
 * 
 * Reusable component to display confidence/data quality indicators.
 * Makes uncertainty visible before users interpret the data.
 * 
 * Usage:
 *   <ConfidenceBadge level="high" metric="MITRE mapping" percentage={85} />
 *   <ConfidenceBadge level="medium" metric="Attribution" percentage={45} tooltip="Based on..." />
 *   <ConfidenceBadge level="low" metric="Severity classification" />
 */
function ConfidenceBadge({ 
  level = 'medium',  // 'high', 'medium', 'low'
  metric,            // What the confidence applies to (e.g., "MITRE mapping", "Attribution")
  percentage,        // Optional: show percentage
  tooltip,           // Optional: additional context
  size = 'normal'    // 'small', 'normal', 'large'
}) {
  const getConfig = (level) => {
    const configs = {
      high: {
        icon: '🟢',
        label: 'High Confidence',
        color: '#16a34a',
        bgColor: 'rgba(22, 163, 74, 0.1)',
        description: 'Confirmed or well-validated data'
      },
      medium: {
        icon: '🟡',
        label: 'Medium Confidence',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        description: 'Credible but not fully verified'
      },
      low: {
        icon: '🔴',
        label: 'Low Confidence',
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.1)',
        description: 'Limited validation or early-stage data'
      }
    };
    return configs[level] || configs.medium;
  };

  const config = getConfig(level);
  const displayText = metric 
    ? `${config.label}: ${metric}${percentage ? ` (${percentage}%)` : ''}`
    : config.label;

  const fullTooltip = tooltip || config.description;

  return (
    <div 
      className={`confidence-badge confidence-${level} size-${size}`}
      title={fullTooltip}
      role="status"
      aria-label={`${config.label} for ${metric || 'this data'}`}
    >
      <span className="confidence-icon">{config.icon}</span>
      <span className="confidence-text">{displayText}</span>
    </div>
  );
}

export default ConfidenceBadge;
