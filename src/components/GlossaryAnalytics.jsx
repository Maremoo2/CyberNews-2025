import { useMemo } from 'react';
import './GlossaryAnalytics.css';
import glossary from '../../config/cybersecurity-glossary.json';

/**
 * GlossaryAnalytics Component
 * 
 * Displays analytics about glossary term usage across incidents
 * Shows which cybersecurity terms are most prevalent in the data
 */
function GlossaryAnalytics({ incidents }) {
  // Calculate term frequency across all incidents
  const termStats = useMemo(() => {
    const stats = {};
    
    // Initialize all terms with 0 count
    Object.keys(glossary.terms).forEach(term => {
      stats[term] = {
        count: 0,
        category: glossary.terms[term].category,
        definition: glossary.terms[term].definition
      };
    });
    
    // Count occurrences in incidents
    incidents.forEach(incident => {
      if (incident.glossary_terms && Array.isArray(incident.glossary_terms)) {
        incident.glossary_terms.forEach(term => {
          if (stats[term]) {
            stats[term].count++;
          }
        });
      }
    });
    
    // Convert to array and sort by count
    return Object.entries(stats)
      .map(([term, data]) => ({ term, ...data }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [incidents]);
  
  // Group by category
  const termsByCategory = useMemo(() => {
    const grouped = {};
    termStats.forEach(item => {
      const cat = item.category || 'other';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(item);
    });
    return grouped;
  }, [termStats]);
  
  // Top 10 terms
  const topTerms = termStats.slice(0, 10);
  
  // Calculate coverage
  const totalIncidents = incidents.length;
  const incidentsWithTerms = incidents.filter(i => 
    i.glossary_terms && i.glossary_terms.length > 0
  ).length;
  const coveragePercent = totalIncidents > 0 
    ? ((incidentsWithTerms / totalIncidents) * 100).toFixed(1)
    : 0;
  
  return (
    <div className="glossary-analytics">
      <h2>📊 Glossary Term Analytics</h2>
      <p className="analytics-description">
        Analysis of cybersecurity terminology usage across {totalIncidents} incidents
      </p>
      
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-value">{termStats.length}</div>
          <div className="summary-label">Active Terms</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{incidentsWithTerms}</div>
          <div className="summary-label">Incidents Tagged</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{coveragePercent}%</div>
          <div className="summary-label">Coverage Rate</div>
        </div>
      </div>
      
      {topTerms.length > 0 && (
        <div className="top-terms-section">
          <h3>Top 10 Most Common Terms</h3>
          <div className="top-terms-list">
            {topTerms.map((item, index) => (
              <div key={item.term} className="term-stat-item">
                <div className="term-rank">#{index + 1}</div>
                <div className="term-info">
                  <div className="term-name">
                    {item.term.replace(/-/g, ' ')}
                    <span className="term-category-mini">
                      {getCategoryIcon(item.category)}
                    </span>
                  </div>
                  <div className="term-stat-bar">
                    <div 
                      className="term-stat-fill"
                      style={{ width: `${(item.count / topTerms[0].count) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="term-count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {Object.keys(termsByCategory).length > 0 && (
        <div className="category-breakdown">
          <h3>Terms by Category</h3>
          <div className="category-grid">
            {Object.entries(termsByCategory).map(([category, terms]) => {
              const totalCount = terms.reduce((sum, t) => sum + t.count, 0);
              return (
                <div key={category} className="category-card">
                  <div className="category-header">
                    <span className="category-icon">{getCategoryIcon(category)}</span>
                    <span className="category-name">{formatCategory(category)}</span>
                  </div>
                  <div className="category-stats">
                    <div className="category-count">{terms.length} terms</div>
                    <div className="category-total">{totalCount} occurrences</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="analytics-note">
        <p>
          <strong>Note:</strong> Term detection is automated using the cybersecurity glossary. 
          Terms are extracted from incident titles, summaries, and tags during the enrichment process.
        </p>
      </div>
    </div>
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
    'risk': '⚠️',
    'other': '📌'
  };
  return icons[category] || '📌';
}

export default GlossaryAnalytics;
