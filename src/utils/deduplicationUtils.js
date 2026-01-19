/**
 * Incident Deduplication and Enhancement Utilities
 * 
 * Implements:
 * 1. Estimated unique incidents with fingerprinting
 * 2. Confidence score classification
 * 3. Incident timeline aggregation
 */

/**
 * Generate a fingerprint for an incident to identify duplicates
 * Uses: organization + attack_type + date (±3 days window)
 */
export function generateIncidentFingerprint(incident) {
  if (!incident) return null;
  
  // Extract organization/victim from title or summary
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  
  // Try to extract organization name (simplified approach)
  const orgPatterns = [
    /(?:at|against|targeting|hit|breached?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:suffered|experienced|confirmed)/,
  ];
  
  let organization = 'unknown';
  for (const pattern of orgPatterns) {
    const match = incident.title.match(pattern);
    if (match && match[1]) {
      organization = match[1].toLowerCase().trim();
      break;
    }
  }
  
  // Get attack type from tags or MITRE techniques
  let attackType = 'unknown';
  if (incident.tags && incident.tags.length > 0) {
    // Prioritize specific attack types
    const attackTags = ['ransomware', 'phishing', 'ddos', 'malware', 'data breach', 'vulnerability'];
    const foundAttack = incident.tags.find(tag => 
      attackTags.some(at => tag.toLowerCase().includes(at))
    );
    if (foundAttack) {
      attackType = foundAttack.toLowerCase();
    }
  }
  
  // Get week number for date grouping (±3 days)
  const date = new Date(incident.date);
  const weekNumber = getWeekNumber(date);
  const year = date.getFullYear();
  
  // Generate fingerprint
  return `${organization}_${attackType}_${year}w${weekNumber}`;
}

/**
 * Get ISO week number for date
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Deduplicate incidents and estimate unique incident count
 */
export function deduplicateIncidents(incidents) {
  if (!incidents || incidents.length === 0) {
    return {
      uniqueIncidents: [],
      estimatedUniqueCount: 0,
      articleCount: 0,
      deduplicationRatio: 1,
      clusters: {}
    };
  }
  
  const clusters = {};
  const articleCount = incidents.length;
  
  // Group incidents by fingerprint
  incidents.forEach(incident => {
    const fingerprint = generateIncidentFingerprint(incident);
    if (!clusters[fingerprint]) {
      clusters[fingerprint] = {
        fingerprint,
        articles: [],
        firstSeen: incident.date,
        lastSeen: incident.date,
        representativeIncident: incident,
        articleCount: 0
      };
    }
    
    clusters[fingerprint].articles.push(incident);
    clusters[fingerprint].articleCount++;
    
    // Update date range
    if (incident.date < clusters[fingerprint].firstSeen) {
      clusters[fingerprint].firstSeen = incident.date;
    }
    if (incident.date > clusters[fingerprint].lastSeen) {
      clusters[fingerprint].lastSeen = incident.date;
    }
    
    // Use highest confidence incident as representative
    if (incident.confidence > (clusters[fingerprint].representativeIncident.confidence || 0)) {
      clusters[fingerprint].representativeIncident = incident;
    }
  });
  
  const uniqueIncidents = Object.values(clusters).map(cluster => ({
    ...cluster.representativeIncident,
    _cluster: {
      fingerprint: cluster.fingerprint,
      articleCount: cluster.articleCount,
      firstSeen: cluster.firstSeen,
      lastSeen: cluster.lastSeen,
      allArticles: cluster.articles
    }
  }));
  
  const estimatedUniqueCount = Object.keys(clusters).length;
  const deduplicationRatio = articleCount / estimatedUniqueCount;
  
  return {
    uniqueIncidents,
    estimatedUniqueCount,
    articleCount,
    deduplicationRatio,
    clusters
  };
}

/**
 * Classify confidence level based on incident properties
 * High: confirmed breach with official sources
 * Medium: credible reporting from reliable sources  
 * Low: speculation, rumors, or opinion pieces
 */
export function classifyConfidenceLevel(incident) {
  if (!incident) return { level: 'low', score: 0, reasons: [] };
  
  const reasons = [];
  let score = incident.confidence || 50; // Start with existing confidence or default
  
  // High confidence indicators
  if (incident.is_curated) {
    score += 15;
    reasons.push('Curated by security team');
  }
  
  if (incident.content_type === 'incident' || incident.content_type === 'campaign') {
    score += 10;
    reasons.push('Classified as confirmed incident');
  }
  
  // Check for official confirmation keywords
  const text = `${incident.title} ${incident.summary}`.toLowerCase();
  const confirmedKeywords = ['confirmed', 'official', 'announced', 'disclosed', 'admitted'];
  if (confirmedKeywords.some(kw => text.includes(kw))) {
    score += 10;
    reasons.push('Contains confirmation language');
  }
  
  // Check for breach indicators
  const breachKeywords = ['breach', 'hack', 'compromise', 'attack', 'ransomware'];
  if (breachKeywords.some(kw => text.includes(kw))) {
    score += 5;
    reasons.push('Clear breach indicators');
  }
  
  // Medium confidence indicators
  if (incident.severity && incident.severity !== 'unknown') {
    score += 5;
    reasons.push('Severity assessed');
  }
  
  if (incident.mitre_techniques && incident.mitre_techniques.length > 0) {
    score += 5;
    reasons.push('MITRE techniques mapped');
  }
  
  // Low confidence detractors
  if (incident.content_type === 'opinion' || incident.content_type === 'prediction') {
    score -= 20;
    reasons.push('Opinion or prediction content');
  }
  
  const speculationKeywords = ['rumor', 'alleged', 'reportedly', 'claims', 'speculation'];
  if (speculationKeywords.some(kw => text.includes(kw))) {
    score -= 10;
    reasons.push('Contains speculation language');
  }
  
  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  // Classify into levels
  let level;
  if (score >= 70) {
    level = 'high';
  } else if (score >= 40) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  return {
    level,
    score,
    reasons,
    label: getLevelLabel(level)
  };
}

/**
 * Get human-readable label for confidence level
 */
function getLevelLabel(level) {
  const labels = {
    high: 'Confirmed breach',
    medium: 'Credible reporting',
    low: 'Speculation/opinion'
  };
  return labels[level] || 'Unknown';
}

/**
 * Build incident timeline from cluster
 * Tracks: first reported, updates, resolution
 */
export function buildIncidentTimeline(incident) {
  if (!incident) return null;
  
  const timeline = {
    firstReported: incident.date,
    updates: [],
    resolution: null,
    status: incident.timeline?.status || 'ongoing',
    daysSinceFirst: 0
  };
  
  // If this is a clustered incident, extract timeline from articles
  if (incident._cluster && incident._cluster.allArticles) {
    const articles = incident._cluster.allArticles;
    
    // Sort by date
    articles.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    timeline.firstReported = articles[0].date;
    timeline.updates = articles.slice(1).map(article => ({
      date: article.date,
      title: article.title,
      source: article.sourceName
    }));
    
    // Check for resolution indicators in latest articles
    const latestArticles = articles.slice(-2);
    const resolutionKeywords = ['resolved', 'restored', 'recovered', 'contained', 'fixed'];
    const hasResolution = latestArticles.some(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      return resolutionKeywords.some(kw => text.includes(kw));
    });
    
    if (hasResolution) {
      timeline.resolution = articles[articles.length - 1].date;
      timeline.status = 'resolved';
    }
  } else {
    // Single article - check existing timeline data
    if (incident.timeline) {
      timeline.firstReported = incident.timeline.first_seen || incident.date;
      timeline.resolution = incident.timeline.recovery_complete || incident.timeline.service_restored;
      timeline.status = incident.timeline.status || 'ongoing';
    }
  }
  
  // Calculate days since first report
  const first = new Date(timeline.firstReported);
  const now = new Date();
  timeline.daysSinceFirst = Math.floor((now - first) / (1000 * 60 * 60 * 24));
  
  return timeline;
}

/**
 * Enhance incidents with deduplication, confidence, and timeline data
 */
export function enhanceIncidents(incidents) {
  if (!incidents || incidents.length === 0) {
    return {
      enhanced: [],
      stats: {
        totalArticles: 0,
        estimatedUniqueIncidents: 0,
        deduplicationRatio: 1,
        confidenceDistribution: { high: 0, medium: 0, low: 0 }
      }
    };
  }
  
  // First deduplicate
  const deduped = deduplicateIncidents(incidents);
  
  // Then enhance each unique incident
  const enhanced = deduped.uniqueIncidents.map(incident => {
    const confidence = classifyConfidenceLevel(incident);
    const timeline = buildIncidentTimeline(incident);
    
    return {
      ...incident,
      _enhanced: {
        confidenceLevel: confidence.level,
        confidenceScore: confidence.score,
        confidenceReasons: confidence.reasons,
        confidenceLabel: confidence.label,
        timeline: timeline,
        isCluster: incident._cluster && incident._cluster.articleCount > 1,
        clusterSize: incident._cluster ? incident._cluster.articleCount : 1
      }
    };
  });
  
  // Calculate stats
  const confidenceDistribution = {
    high: enhanced.filter(i => i._enhanced.confidenceLevel === 'high').length,
    medium: enhanced.filter(i => i._enhanced.confidenceLevel === 'medium').length,
    low: enhanced.filter(i => i._enhanced.confidenceLevel === 'low').length
  };
  
  return {
    enhanced,
    stats: {
      totalArticles: deduped.articleCount,
      estimatedUniqueIncidents: deduped.estimatedUniqueCount,
      deduplicationRatio: deduped.deduplicationRatio.toFixed(1),
      confidenceDistribution
    }
  };
}
