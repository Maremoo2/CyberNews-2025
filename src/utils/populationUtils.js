/**
 * Population Utilities - Single Source of Truth
 * 
 * This module ensures all sections use the same population/filtering logic.
 * All components should import getPopulation() and use the same filtered dataset.
 */

/**
 * Get filtered population based on consistent criteria
 * @param {Array} incidents - Raw incident data
 * @param {Object} filters - Filtering options
 * @returns {Object} - Filtered population with metadata
 */
export function getPopulation(incidents, filters = {}) {
  if (!incidents || !Array.isArray(incidents)) {
    return {
      incidents: [],
      metadata: {
        total: 0,
        filtered: 0,
        filters: filters
      }
    };
  }

  const total = incidents.length;
  let filtered = [...incidents];

  // Apply year filter (if provided)
  if (filters.year) {
    filtered = filtered.filter(inc => {
      const incYear = new Date(inc.date).getFullYear();
      return incYear === filters.year;
    });
  }

  // Apply curated only filter
  if (filters.curatedOnly) {
    filtered = filtered.filter(inc => inc.is_curated === true);
  }

  // Apply high confidence only filter
  if (filters.highConfidenceOnly) {
    filtered = filtered.filter(inc => (inc.confidence || 0) >= 70);
  }

  // Apply critical only filter
  if (filters.criticalOnly) {
    filtered = filtered.filter(inc => inc.severity === 'critical');
  }

  // Apply content type filter
  if (filters.contentType && filters.contentType !== 'all') {
    filtered = filtered.filter(inc => {
      const normalizedType = normalizeContentType(inc.content_type);
      return normalizedType === filters.contentType;
    });
  }

  // Apply region filter
  if (filters.region && filters.region !== 'ALL') {
    filtered = filtered.filter(inc => inc.region === filters.region);
  }

  // Apply month filter
  if (filters.month !== undefined && filters.month !== 'ALL') {
    filtered = filtered.filter(inc => {
      const date = new Date(inc.date);
      return date.getMonth() === filters.month;
    });
  }

  return {
    incidents: filtered,
    metadata: {
      total,
      filtered: filtered.length,
      filters: { ...filters }
    }
  };
}

/**
 * Normalize content_type to consistent values
 * Maps various content type values to standard categories
 */
export function normalizeContentType(contentType) {
  if (!contentType) return 'incident'; // Default to incident if not specified

  const type = contentType.toLowerCase();

  // Map variations to standard categories
  const typeMap = {
    // Opinion/Predictions
    'opinion': 'opinion',
    'prediction': 'opinion',
    'predictions': 'opinion',
    'forecast': 'opinion',
    
    // Policy/Regulation
    'policy': 'policy',
    'regulation': 'policy',
    'court/regulation': 'policy',
    'court': 'policy',
    'legal': 'policy',
    
    // Vulnerability
    'vulnerability': 'vulnerability',
    'vuln': 'vulnerability',
    'cve': 'vulnerability',
    
    // Incident (default)
    'incident': 'incident',
    'breach': 'incident',
    'attack': 'incident',
    'data-breach': 'incident'
  };

  return typeMap[type] || 'incident';
}

/**
 * Get data health statistics with field presence diagnostics
 * Shows what percentage of data has various enrichment fields
 */
export function getDataHealth(incidents) {
  if (!incidents || incidents.length === 0) {
    return {
      loaded: 0,
      hasSeverity: 0,
      hasThemes: 0,
      hasMitre: 0,
      curated: 0,
      hasContentType: 0,
      percentages: {
        severity: 0,
        themes: 0,
        mitre: 0,
        curated: 0,
        contentType: 0
      },
      fieldPresence: {
        severityField: false,
        themesField: false,
        mitreField: false,
        curatedField: false,
        contentTypeField: false
      },
      diagnosis: 'no_data'
    };
  }

  const total = incidents.length;
  const hasSeverity = incidents.filter(i => i.severity && i.severity !== 'unknown').length;
  const hasThemes = incidents.filter(i => i.themes && Array.isArray(i.themes) && i.themes.length > 0).length;
  const hasMitre = incidents.filter(i => i.mitre_techniques && Array.isArray(i.mitre_techniques) && i.mitre_techniques.length > 0).length;
  const curated = incidents.filter(i => i.is_curated === true).length;
  const hasContentType = incidents.filter(i => i.content_type && i.content_type !== '').length;

  // Check if fields exist at all (even if empty)
  const fieldPresence = {
    severityField: incidents.some(i => 'severity' in i),
    themesField: incidents.some(i => 'themes' in i),
    mitreField: incidents.some(i => 'mitre_techniques' in i),
    curatedField: incidents.some(i => 'is_curated' in i),
    contentTypeField: incidents.some(i => 'content_type' in i)
  };

  // Diagnose the situation
  let diagnosis = 'unknown';
  const hasAnyEnrichmentFields = Object.values(fieldPresence).some(v => v);
  
  if (!hasAnyEnrichmentFields) {
    diagnosis = 'raw_data'; // No enrichment fields present at all
  } else if (hasAnyEnrichmentFields && hasSeverity === 0 && hasThemes === 0 && hasMitre === 0) {
    diagnosis = 'empty_enrichment'; // Fields exist but are empty (pipeline bug)
  } else if (hasSeverity > 0 || hasThemes > 0 || hasMitre > 0) {
    diagnosis = 'partial_enrichment'; // Some enrichment exists
  }

  return {
    loaded: total,
    hasSeverity,
    hasThemes,
    hasMitre,
    curated,
    hasContentType,
    percentages: {
      severity: total > 0 ? Math.round((hasSeverity / total) * 100) : 0,
      themes: total > 0 ? Math.round((hasThemes / total) * 100) : 0,
      mitre: total > 0 ? Math.round((hasMitre / total) * 100) : 0,
      curated: total > 0 ? Math.round((curated / total) * 100) : 0,
      contentType: total > 0 ? Math.round((hasContentType / total) * 100) : 0
    },
    fieldPresence,
    diagnosis
  };
}

/**
 * Count unique incidents (for display)
 * This helps distinguish between incident count and source count
 */
export function countUniqueIncidents(incidents) {
  if (!incidents || incidents.length === 0) return 0;
  
  // Use Set to deduplicate by ID
  const uniqueIds = new Set(incidents.map(inc => inc.id));
  return uniqueIds.size;
}

/**
 * Check if data is enriched enough for analysis
 * Returns true if at least 10% of data has key enrichment fields
 */
export function isDataEnriched(incidents) {
  const health = getDataHealth(incidents);
  
  // Consider data enriched if at least 10% has severity or themes or MITRE
  const minThreshold = Math.max(1, Math.floor(health.loaded * 0.1));
  
  return (
    health.hasSeverity >= minThreshold ||
    health.hasThemes >= minThreshold ||
    health.hasMitre >= minThreshold
  );
}

/**
 * Get enrichment quality message
 * Returns a user-friendly message about data quality
 */
export function getEnrichmentQualityMessage(incidents) {
  const health = getDataHealth(incidents);
  
  if (health.loaded === 0) {
    return 'No data loaded';
  }
  
  if (!isDataEnriched(incidents)) {
    return 'Data is not yet enriched. Run the enrichment script to enable analysis features.';
  }
  
  // Check for good enrichment (>50%)
  if (health.percentages.severity > 50 && health.percentages.themes > 50) {
    return 'Data quality: Good';
  }
  
  // Check for partial enrichment (10-50%)
  if (health.percentages.severity > 10 || health.percentages.themes > 10) {
    return 'Data quality: Partial - some analysis features may be limited';
  }
  
  return 'Data quality: Limited enrichment';
}

/**
 * Filter items to incidents only (excluding opinion, policy, vulnerability)
 * This provides a consistent definition of "incidents" across all components
 */
export function filterToIncidentsOnly(items) {
  if (!items || !Array.isArray(items)) return [];
  
  return items.filter(item => {
    const normalizedType = normalizeContentType(item.content_type);
    // Only include actual incidents, exclude vulnerability/policy/opinion
    return normalizedType === 'incident';
  });
}

/**
 * Get the correct count label based on population mode
 * @param {number} count - The count to display
 * @param {string} mode - 'incidents' or 'all'
 * @param {boolean} plural - Whether to use plural form (default: true)
 */
export function getCountLabel(count, mode, plural = true) {
  if (mode === 'incidents') {
    return plural ? 'incidents' : 'incident';
  }
  return plural ? 'items' : 'item';
}
