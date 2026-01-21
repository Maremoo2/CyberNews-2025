import { useState } from 'react';
import './GlossaryTooltip.css';
import glossary from '../../config/cybersecurity-glossary.json';

/**
 * GlossaryTooltip Component
 * 
 * Displays cybersecurity term definitions on hover
 * Usage: <GlossaryTooltip term="phishing">phishing</GlossaryTooltip>
 */
function GlossaryTooltip({ term, children, className = '' }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Normalize term to match glossary keys (lowercase, hyphenated)
  const normalizedTerm = term.toLowerCase().replace(/\s+/g, '-');
  const termData = glossary.terms[normalizedTerm];
  
  // If term not in glossary, render children without tooltip
  if (!termData) {
    return <span className={className}>{children}</span>;
  }
  
  return (
    <span 
      className={`glossary-term ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-describedby={showTooltip ? `tooltip-${normalizedTerm}` : undefined}
    >
      {children}
      <span className="glossary-icon" aria-hidden="true">ℹ️</span>
      {showTooltip && (
        <span 
          id={`tooltip-${normalizedTerm}`}
          className="glossary-tooltip"
          role="tooltip"
        >
          <strong className="tooltip-title">{term}</strong>
          <p className="tooltip-definition">{termData.definition}</p>
          {termData.category && (
            <span className="tooltip-category">{getCategoryDisplay(termData.category)}</span>
          )}
          {termData.mitre_techniques && termData.mitre_techniques.length > 0 && (
            <div className="tooltip-mitre">
              <strong>MITRE ATT&CK:</strong> {termData.mitre_techniques.join(', ')}
            </div>
          )}
          {termData.related_terms && termData.related_terms.length > 0 && (
            <div className="tooltip-related">
              <strong>Related:</strong> {termData.related_terms.slice(0, 3).join(', ')}
            </div>
          )}
        </span>
      )}
    </span>
  );
}

function getCategoryDisplay(category) {
  const categories = {
    'attack-type': '⚔️ Attack',
    'malware': '🦠 Malware',
    'technique': '🔧 Technique',
    'tactic': '🎯 Tactic',
    'actor-type': '👥 Actor',
    'vulnerability': '🔓 Vulnerability',
    'defense': '🛡️ Defense',
    'practice': '📋 Practice',
    'framework': '📚 Framework',
    'standard': '📜 Standard',
    'detection': '🔍 Detection',
    'organizational': '🏢 Organization',
    'architecture': '🏗️ Architecture',
    'strategy': '📊 Strategy',
    'risk': '⚠️ Risk'
  };
  return categories[category] || category;
}

export default GlossaryTooltip;
