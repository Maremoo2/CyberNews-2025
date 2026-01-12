/**
 * Analytics Utilities - Source of Truth Implementation
 * 
 * Implements consistent counting rules, transparent methodologies,
 * and proper deduplication per requirements.
 */

// ============================================================================
// COUNTING TYPES
// ============================================================================
export const COUNTING_TYPES = {
  UNIQUE: 'unique',      // Count unique incidents (deduplicated)
  MENTIONS: 'mentions'   // Count tag/sector mentions (can exceed total)
};

// ============================================================================
// POPULATION FILTERS
// ============================================================================
export const POPULATION_TYPES = {
  ALL: 'all',
  CURATED: 'curated',
  CRITICAL_ONLY: 'critical-only'
};

// ============================================================================
// UNIQUE INCIDENT COUNTING
// ============================================================================
/**
 * Count unique incidents (source of truth for Executive Summary)
 * @param {Array} incidents - Array of incidents
 * @param {Object} filters - Optional filters (region, timeWindow, etc.)
 * @returns {Object} - Count and metadata
 */
export function countUniqueIncidents(incidents, filters = {}) {
  let filtered = incidents;
  
  // Apply population filter
  if (filters.population === POPULATION_TYPES.CURATED) {
    filtered = filtered.filter(i => i.is_curated);
  } else if (filters.population === POPULATION_TYPES.CRITICAL_ONLY) {
    filtered = filtered.filter(i => i.severity === 'critical');
  }
  
  // Apply region filter
  if (filters.region && filters.region !== 'ALL') {
    filtered = filtered.filter(i => i.region === filters.region);
  }
  
  // Apply time window filter
  if (filters.timeWindow) {
    filtered = filterByTimeWindow(filtered, filters.timeWindow);
  }
  
  // Deduplicate by incident_id (our unique key)
  const uniqueIds = new Set(filtered.map(i => i.id));
  
  return {
    count: uniqueIds.size,
    countingType: COUNTING_TYPES.UNIQUE,
    population: filters.population || POPULATION_TYPES.ALL,
    metadata: {
      region: filters.region || 'ALL',
      timeWindow: filters.timeWindow || 'all'
    }
  };
}

// ============================================================================
// TAG/SECTOR MENTION COUNTING
// ============================================================================
/**
 * Count tag or sector mentions (can exceed total unique incidents)
 * @param {Array} incidents - Array of incidents
 * @param {String} field - Field to count ('tags', 'themes', 'sectors')
 * @param {Object} filters - Optional filters
 * @returns {Object} - Counts by tag/sector with metadata
 */
export function countMentions(incidents, field, filters = {}) {
  let filtered = incidents;
  
  // Apply population filter
  if (filters.population === POPULATION_TYPES.CURATED) {
    filtered = filtered.filter(i => i.is_curated);
  } else if (filters.population === POPULATION_TYPES.CRITICAL_ONLY) {
    filtered = filtered.filter(i => i.severity === 'critical');
  }
  
  // Apply region filter
  if (filters.region && filters.region !== 'ALL') {
    filtered = filtered.filter(i => i.region === filters.region);
  }
  
  // Apply time window filter
  if (filters.timeWindow) {
    filtered = filterByTimeWindow(filtered, filters.timeWindow);
  }
  
  // Count mentions
  const counts = {};
  let totalMentions = 0;
  
  filtered.forEach(incident => {
    const items = getFieldValue(incident, field);
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const key = typeof item === 'object' ? item.id || item.name : item;
        counts[key] = (counts[key] || 0) + 1;
        totalMentions++;
      });
    }
  });
  
  return {
    counts,
    totalMentions,
    uniqueIncidents: filtered.length,
    countingType: COUNTING_TYPES.MENTIONS,
    population: filters.population || POPULATION_TYPES.ALL,
    metadata: {
      field,
      region: filters.region || 'ALL',
      timeWindow: filters.timeWindow || 'all'
    },
    note: 'Total mentions can exceed unique incidents because incidents can have multiple ' + field
  };
}

// ============================================================================
// SEVERITY DISTRIBUTION
// ============================================================================
export function getSeverityDistribution(incidents, filters = {}) {
  const filtered = applyFilters(incidents, filters);
  
  const distribution = {
    critical: filtered.filter(i => i.severity === 'critical').length,
    high: filtered.filter(i => i.severity === 'high').length,
    moderate: filtered.filter(i => i.severity === 'moderate').length,
    low: filtered.filter(i => i.severity === 'low').length
  };
  
  return {
    distribution,
    total: filtered.length,
    countingType: COUNTING_TYPES.UNIQUE,
    population: filters.population || POPULATION_TYPES.ALL
  };
}

// ============================================================================
// ATTRIBUTION RATE
// ============================================================================
export function getAttributionRate(incidents, filters = {}) {
  const filtered = applyFilters(incidents, filters);
  
  const attributed = filtered.filter(i => i.is_attributed).length;
  const total = filtered.length;
  
  return {
    attributed,
    total,
    rate: total > 0 ? Math.round((attributed / total) * 100) : 0,
    countingType: COUNTING_TYPES.UNIQUE,
    population: filters.population || POPULATION_TYPES.ALL
  };
}

// ============================================================================
// MITRE ATT&CK STATISTICS
// ============================================================================
export function getMitreStats(incidents, filters = {}) {
  const filtered = applyFilters(incidents, filters);
  
  // Count incidents with MITRE mappings
  const withMitre = filtered.filter(i => i.mitre_techniques && i.mitre_techniques.length > 0).length;
  
  // Count techniques by confidence
  const techniquesByConfidence = {
    high: new Set(),
    medium: new Set(),
    low: new Set()
  };
  
  filtered.forEach(incident => {
    if (incident.mitre_techniques) {
      incident.mitre_techniques.forEach(tech => {
        if (tech.confidence && techniquesByConfidence[tech.confidence]) {
          techniquesByConfidence[tech.confidence].add(tech.id);
        }
      });
    }
  });
  
  return {
    incidentsWithMitre: withMitre,
    totalIncidents: filtered.length,
    coverageRate: filtered.length > 0 ? Math.round((withMitre / filtered.length) * 100) : 0,
    highConfidenceTechniques: techniquesByConfidence.high.size,
    mediumConfidenceTechniques: techniquesByConfidence.medium.size,
    lowConfidenceTechniques: techniquesByConfidence.low.size,
    countingType: COUNTING_TYPES.UNIQUE,
    population: filters.population || POPULATION_TYPES.ALL
  };
}

// ============================================================================
// TOP TECHNIQUES (High Confidence Only)
// ============================================================================
export function getTopMitreTechniques(incidents, filters = {}, limit = 10, confidenceFilter = 'high') {
  const filtered = applyFilters(incidents, filters);
  
  const techniqueCounts = {};
  
  filtered.forEach(incident => {
    if (incident.mitre_techniques) {
      incident.mitre_techniques
        .filter(tech => !confidenceFilter || tech.confidence === confidenceFilter)
        .forEach(tech => {
          const key = tech.id;
          if (!techniqueCounts[key]) {
            techniqueCounts[key] = {
              id: tech.id,
              name: tech.name,
              count: 0
            };
          }
          techniqueCounts[key].count++;
        });
    }
  });
  
  return {
    techniques: Object.values(techniqueCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit),
    countingType: COUNTING_TYPES.MENTIONS,
    confidenceFilter,
    population: filters.population || POPULATION_TYPES.ALL,
    note: `Showing only ${confidenceFilter} confidence mappings`
  };
}

// ============================================================================
// STRATEGIC THEMES
// ============================================================================
export function getTopThemes(incidents, filters = {}, limit = 5) {
  const filtered = applyFilters(incidents, filters);
  
  const themeCounts = {};
  const themeIncidents = {};
  
  filtered.forEach(incident => {
    if (incident.themes) {
      incident.themes.forEach(theme => {
        const key = theme.id;
        if (!themeCounts[key]) {
          themeCounts[key] = {
            id: theme.id,
            name: theme.name,
            count: 0,
            incidents: new Set()
          };
        }
        themeCounts[key].count++;
        themeCounts[key].incidents.add(incident.id);
      });
    }
  });
  
  return {
    themes: Object.values(themeCounts)
      .map(t => ({
        id: t.id,
        name: t.name,
        mentions: t.count,
        uniqueIncidents: t.incidents.size
      }))
      .sort((a, b) => b.uniqueIncidents - a.uniqueIncidents)
      .slice(0, limit),
    countingType: 'both', // Shows both mentions and unique incidents
    population: filters.population || POPULATION_TYPES.ALL
  };
}

// ============================================================================
// KEY PERFORMANCE INDICATORS (KPIs)
// ============================================================================
export function calculateKPIs(incidents, filters = {}) {
  const filtered = applyFilters(incidents, filters);
  
  if (filtered.length === 0) {
    return {
      criticalRate: 0,
      exploitLedRate: 0,
      cloudExfilRate: 0,
      attributionRate: 0,
      curatedCoverage: 0,
      meanConfidence: 0
    };
  }
  
  // Critical rate = critical / total
  const critical = filtered.filter(i => i.severity === 'critical').length;
  const criticalRate = Math.round((critical / filtered.length) * 100);
  
  // Exploit-led rate = incidents with T1190 or "exploited in wild"
  const exploitLed = filtered.filter(i => 
    i.mitre_technique_ids?.includes('T1190') ||
    i.severity_drivers?.some(d => d.toLowerCase().includes('exploited'))
  ).length;
  const exploitLedRate = Math.round((exploitLed / filtered.length) * 100);
  
  // Cloud exfiltration rate = incidents with cloud-exfiltration theme
  const cloudExfil = filtered.filter(i =>
    i.themes?.some(t => t.id === 'cloud-exfiltration')
  ).length;
  const cloudExfilRate = Math.round((cloudExfil / filtered.length) * 100);
  
  // Attribution rate = attributed / total
  const attributed = filtered.filter(i => i.is_attributed).length;
  const attributionRate = Math.round((attributed / filtered.length) * 100);
  
  // Curated coverage = curated / total
  const curated = filtered.filter(i => i.is_curated).length;
  const curatedCoverage = Math.round((curated / filtered.length) * 100);
  
  // Mean confidence
  const totalConfidence = filtered.reduce((sum, i) => sum + (i.confidence || 0), 0);
  const meanConfidence = Math.round(totalConfidence / filtered.length);
  
  return {
    criticalRate,
    exploitLedRate,
    cloudExfilRate,
    attributionRate,
    curatedCoverage,
    meanConfidence,
    totalIncidents: filtered.length,
    population: filters.population || POPULATION_TYPES.ALL
  };
}

// ============================================================================
// SECTOR ANALYSIS
// ============================================================================
export function getSectorAnalysis(incidents, sector, filters = {}) {
  // Filter for sector (sector is in tags)
  const sectorIncidents = incidents.filter(i => 
    i.tags?.some(tag => tag.toLowerCase().includes(sector.toLowerCase()))
  );
  
  const filtered = applyFilters(sectorIncidents, filters);
  
  if (filtered.length === 0) {
    return null;
  }
  
  // Top 3 initial access techniques
  const initialAccessTechniques = {};
  filtered.forEach(incident => {
    if (incident.mitre_techniques) {
      incident.mitre_techniques
        .filter(tech => incident.mitre_tactics?.includes('initial-access'))
        .forEach(tech => {
          initialAccessTechniques[tech.id] = initialAccessTechniques[tech.id] || { name: tech.name, count: 0 };
          initialAccessTechniques[tech.id].count++;
        });
    }
  });
  
  const topInitialAccess = Object.values(initialAccessTechniques)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  // Top 3 themes
  const themeAnalysis = getTopThemes(filtered, {}, 3);
  
  // Attribution rate for this sector
  const attributionRate = getAttributionRate(filtered, {});
  
  return {
    sector,
    totalIncidents: filtered.length,
    topInitialAccess,
    topThemes: themeAnalysis.themes,
    attributionRate: attributionRate.rate,
    severityDistribution: getSeverityDistribution(filtered, {}).distribution
  };
}

// ============================================================================
// TIME SERIES ANALYSIS
// ============================================================================
export function getTimeSeriesData(incidents, granularity = 'month', filters = {}) {
  const filtered = applyFilters(incidents, filters);
  
  const timeSeries = {};
  
  filtered.forEach(incident => {
    const date = new Date(incident.date);
    let key;
    
    if (granularity === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else if (granularity === 'quarter') {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      key = `${date.getFullYear()}-Q${quarter}`;
    } else if (granularity === 'year') {
      key = String(date.getFullYear());
    }
    
    if (!timeSeries[key]) {
      timeSeries[key] = {
        period: key,
        count: 0,
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0
      };
    }
    
    timeSeries[key].count++;
    timeSeries[key][incident.severity]++;
  });
  
  return {
    series: Object.values(timeSeries).sort((a, b) => a.period.localeCompare(b.period)),
    granularity,
    countingType: COUNTING_TYPES.UNIQUE,
    population: filters.population || POPULATION_TYPES.ALL
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function applyFilters(incidents, filters) {
  let filtered = incidents;
  
  // Population filter
  if (filters.population === POPULATION_TYPES.CURATED) {
    filtered = filtered.filter(i => i.is_curated);
  } else if (filters.population === POPULATION_TYPES.CRITICAL_ONLY) {
    filtered = filtered.filter(i => i.severity === 'critical');
  }
  
  // Region filter
  if (filters.region && filters.region !== 'ALL') {
    filtered = filtered.filter(i => i.region === filters.region);
  }
  
  // Time window filter
  if (filters.timeWindow) {
    filtered = filterByTimeWindow(filtered, filters.timeWindow);
  }
  
  // Month filter
  if (filters.month !== undefined && filters.month !== 'ALL') {
    filtered = filtered.filter(i => {
      const date = new Date(i.date);
      return date.getMonth() === filters.month;
    });
  }
  
  return filtered;
}

function filterByTimeWindow(incidents, timeWindow) {
  if (timeWindow.start && timeWindow.end) {
    const start = new Date(timeWindow.start);
    const end = new Date(timeWindow.end);
    return incidents.filter(i => {
      const date = new Date(i.date);
      return date >= start && date <= end;
    });
  }
  return incidents;
}

function getFieldValue(incident, field) {
  // Map field names to actual incident properties
  const fieldMap = {
    'tags': 'tags',
    'themes': 'themes',
    'sectors': 'tags', // sectors are in tags
    'mitre_techniques': 'mitre_techniques',
    'mitre_tactics': 'mitre_tactics'
  };
  
  const actualField = fieldMap[field] || field;
  return incident[actualField];
}

// ============================================================================
// QA VALIDATION
// ============================================================================
export function validateCounts(incidents, counts, type) {
  const errors = [];
  
  // For unique counts, total should match filtered incidents
  if (type === COUNTING_TYPES.UNIQUE) {
    if (counts.count !== incidents.length) {
      errors.push({
        type: 'count_mismatch',
        message: `Count mismatch: reported ${counts.count} but filtered ${incidents.length} incidents`
      });
    }
  }
  
  // For mention counts, total mentions can exceed unique incidents
  if (type === COUNTING_TYPES.MENTIONS) {
    if (counts.totalMentions < counts.uniqueIncidents) {
      errors.push({
        type: 'impossible_count',
        message: `Total mentions (${counts.totalMentions}) cannot be less than unique incidents (${counts.uniqueIncidents})`
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================================
// EXPORT METADATA
// ============================================================================
export const COUNTING_NOTES = {
  unique: "Counts are shown as unique incidents (deduplicated by incident_id). This is the default counting method for Executive Summary and KPIs.",
  mentions: "Counts are shown as tag/sector mentions. A single incident can have multiple tags/sectors, so totals may exceed the number of unique incidents.",
  both: "Shows both mention counts and unique incident counts for transparency."
};

export const METHODOLOGY_NOTES = {
  severity: "Severity scoring uses a transparent 0-100 point system based on Impact (0-40), Exploitability (0-30), and Adversary (0-15) factors, plus confidence modifiers (-15 to +15).",
  mitre: "MITRE ATT&CK mappings use a two-signal rule requiring multiple keyword matches for confidence. Tactics are automatically derived from techniques. Use high-confidence filter for operational use.",
  attribution: "Attribution is based on public reporting and includes confidence levels. Many incidents remain unattributed or are intentionally misattributed.",
  themes: "Strategic themes are automatically assigned with confidence scoring. Each incident can have up to 3 themes to maintain analytical focus.",
  limitations: "This analysis is based on publicly reported incidents and carries inherent biases: media bias, underreporting in certain sectors/regions, survivorship bias, and lag in disclosure."
};
