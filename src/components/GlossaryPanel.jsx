import { useState, useMemo } from 'react';
import './GlossaryPanel.css';
import glossary from '../../config/cybersecurity-glossary.json';

/**
 * GlossaryPanel Component
 * 
 * Displays a searchable mini-glossary of cybersecurity terms
 * Can be toggled open/closed
 */
function GlossaryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    Object.values(glossary.terms).forEach(term => {
      if (term.category) {
        cats.add(term.category);
      }
    });
    return Array.from(cats);
  }, []);
  
  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    const terms = Object.entries(glossary.terms);
    
    let filtered = terms;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(([, data]) => data.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(([key, data]) => 
        key.includes(search) || 
        data.definition.toLowerCase().includes(search) ||
        (data.related_terms && data.related_terms.some(t => t.includes(search)))
      );
    }
    
    // Sort alphabetically
    filtered.sort((a, b) => a[0].localeCompare(b[0]));
    
    return filtered;
  }, [searchTerm, selectedCategory]);
  
  return (
    <>
      {/* Toggle Button */}
      <button 
        className="glossary-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cybersecurity glossary"
        title="View cybersecurity terms glossary"
      >
        📚 Glossary {isOpen ? '✕' : ''}
      </button>
      
      {/* Panel */}
      {isOpen && (
        <>
          <div 
            className="glossary-overlay" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="glossary-panel" role="dialog" aria-label="Cybersecurity Glossary">
            <div className="glossary-header">
              <h2>Cybersecurity Glossary</h2>
              <button 
                className="glossary-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close glossary"
              >
                ✕
              </button>
            </div>
            
            <div className="glossary-controls">
              <input 
                type="text"
                className="glossary-search"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search glossary terms"
              />
              
              <select 
                className="glossary-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="glossary-content">
              {filteredTerms.length === 0 ? (
                <p className="glossary-no-results">
                  No terms found matching your search.
                </p>
              ) : (
                <div className="glossary-terms-list">
                  {filteredTerms.map(([key, data]) => (
                    <div key={key} className="glossary-term-item">
                      <h3 className="term-name">
                        {key.replace(/-/g, ' ')}
                        {data.category && (
                          <span className="term-category-badge">
                            {getCategoryIcon(data.category)} {formatCategory(data.category)}
                          </span>
                        )}
                      </h3>
                      <p className="term-definition">{data.definition}</p>
                      {data.mitre_techniques && data.mitre_techniques.length > 0 && (
                        <div className="term-mitre">
                          <strong>MITRE ATT&CK:</strong> {data.mitre_techniques.join(', ')}
                        </div>
                      )}
                      {data.related_terms && data.related_terms.length > 0 && (
                        <div className="term-related">
                          <strong>Related:</strong> {data.related_terms.slice(0, 5).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="glossary-footer">
              <p className="glossary-count">
                Showing {filteredTerms.length} of {Object.keys(glossary.terms).length} terms
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function formatCategory(category) {
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getCategoryIcon(category) {
  const icons = {
    'attack-type': '⚔️',
    'malware': '🦠',
    'technique': '🔧',
    'tactic': '🎯',
    'actor-type': '👥',
    'vulnerability': '🔓',
    'defense': '🛡️',
    'practice': '📋',
    'framework': '📚',
    'standard': '📜',
    'detection': '🔍',
    'organizational': '🏢',
    'architecture': '🏗️',
    'strategy': '📊',
    'risk': '⚠️'
  };
  return icons[category] || '📌';
}

export default GlossaryPanel;
