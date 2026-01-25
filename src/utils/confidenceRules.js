/**
 * Confidence Rules - Centralized Deterministic Logic
 * 
 * Defines objective thresholds for confidence levels across the dashboard.
 * Makes confidence determination transparent and defensible for executive reporting.
 */

import { formatCoverage, validateMetric } from './consistencyChecks.js';

/**
 * MITRE ATT&CK Mapping Confidence
 * @param {number} coveragePct - Percentage of items with MITRE technique mapping
 * @param {number} mappedItems - Actual count of items with MITRE mapping
 * @param {number} totalItems - Total incident-related items
 * @param {string} method - Mapping method (e.g., "keyword-based", "manual")
 * @returns {object} { level: string, tooltip: string }
 */
export function getMitreConfidence(coveragePct, mappedItems, totalItems, method = "keyword-based") {
  const pct = parseFloat(coveragePct) || 0;
  
  // Validate metric consistency
  const validation = validateMetric({
    n: mappedItems,
    N: totalItems,
    label: "MITRE coverage",
    noun: "incident-related items"
  });
  
  if (!validation.isValid) {
    console.error("MITRE confidence calculation error:", validation.errors);
  }
  
  // Format coverage consistently
  const coverage = formatCoverage({
    n: mappedItems,
    N: totalItems,
    noun: "incident-related items",
    digits: 1
  });
  
  // High: coverage >= 60% and not keyword-only (won't hit this in V1)
  if (pct >= 60 && method !== "keyword-based") {
    return {
      level: "high",
      tooltip: `Manual validation with ${coverage.formattedText}. Confirmed tactical analysis.`
    };
  }
  
  // Medium: coverage >= 20% (keyword-based but meaningful signal)
  if (pct >= 20) {
    return {
      level: "medium",
      tooltip: `Keyword-based mapping; interpret as signals, not confirmed TTPs. Coverage: ${coverage.formattedText}.`
    };
  }
  
  // Low: < 20%
  return {
    level: "low",
    tooltip: `Limited mapping coverage ${coverage.formattedText} for strong conclusions. Early-stage data.`
  };
}

/**
 * Attack Chain Reconstruction Confidence
 * @param {number} coveragePct - Percentage of items with multi-tactic mapping
 * @param {number} multiStageItems - Count of items with 2+ MITRE tactics
 * @param {number} incidentRelatedItems - Total incident-related items
 * @returns {object} { level: string, tooltip: string }
 */
export function getAttackChainConfidence(coveragePct, multiStageItems, incidentRelatedItems) {
  const pct = parseFloat(coveragePct) || 0;
  
  // Validate metric consistency
  const validation = validateMetric({
    n: multiStageItems,
    N: incidentRelatedItems,
    label: "Attack chains",
    noun: "incident-related items"
  });
  
  if (!validation.isValid) {
    console.error("Attack chain confidence calculation error:", validation.errors);
  }
  
  // Format coverage consistently
  const coverage = formatCoverage({
    n: multiStageItems,
    N: incidentRelatedItems,
    noun: "incident-related items",
    digits: 1
  });
  
  // Medium if coverage >= 5%
  if (pct >= 5) {
    return {
      level: "medium",
      tooltip: `Chains reconstructed from multi-tactic items; partial visibility. Coverage: ${coverage.formattedText}. Keyword-based.`
    };
  }
  
  // Low if < 5%
  return {
    level: "low",
    tooltip: `Very limited chain data: ${coverage.formattedText}. Use as directional signals only.`
  };
}

/**
 * Severity Model Confidence
 * @param {number} curationRatePct - Percentage of manually curated items
 * @param {number} curatedCount - Actual count of curated items
 * @param {number} incidentRelatedItems - Total incident-related items (denominator)
 * @param {number} severityCoveragePct - Percentage of incidents with severity assigned
 * @returns {object} { level: string, tooltip: string }
 */
export function getSeverityConfidence(curationRatePct, curatedCount, incidentRelatedItems, severityCoveragePct = 100) {
  const curation = parseFloat(curationRatePct) || 0;
  const coverage = parseFloat(severityCoveragePct) || 0;
  
  // Validate metric consistency
  const validation = validateMetric({
    n: curatedCount,
    N: incidentRelatedItems,
    label: "Curation",
    noun: "incident-related items"
  });
  
  if (!validation.isValid) {
    console.error("Severity confidence calculation error:", validation.errors);
  }
  
  // Format coverage consistently
  const curationCoverage = formatCoverage({
    n: curatedCount,
    N: incidentRelatedItems,
    noun: "incident-related items",
    digits: 1
  });
  
  // High: curationRate >= 25% and severityCoverage >= 70%
  if (curation >= 25 && coverage >= 70) {
    return {
      level: "high",
      tooltip: `High curation: ${curationCoverage.formattedText} with comprehensive severity assessment (${coverage.toFixed(0)}% coverage).`
    };
  }
  
  // Medium: curationRate >= 10% or severityCoverage >= 40%
  if (curation >= 10 || coverage >= 40) {
    return {
      level: "medium",
      tooltip: `Severity requires confirmed impact. Moderate curation: ${curationCoverage.formattedText} or coverage (${coverage.toFixed(0)}%).`
    };
  }
  
  // Low: else
  return {
    level: "low",
    tooltip: `Severity is conservative and requires confirmed impact. Low curation: ${curationCoverage.formattedText}, early-year enrichment pending.`
  };
}

/**
 * Deduplication "Estimated Unique Incidents" Confidence
 * @param {number} falseMergeRate - False merge rate percentage (if available)
 * @param {boolean} hasAuditSignals - Whether manual corrections/validation exist
 * @returns {object} { level: string, tooltip: string }
 */
export function getDedupeConfidence(falseMergeRate = null, hasAuditSignals = false) {
  const falseMerge = falseMergeRate !== null ? parseFloat(falseMergeRate) : null;
  
  // High: only if audited with low false merge rate
  if (hasAuditSignals && falseMerge !== null && falseMerge < 5) {
    return {
      level: "high",
      tooltip: `Audited deduplication with ${falseMerge.toFixed(1)}% false merge rate. Manual validation performed.`
    };
  }
  
  // Medium by default (heuristic clustering)
  return {
    level: "medium",
    tooltip: `Estimated incidents are clustered using heuristics (title similarity, source, date window). Not individually verified.`
  };
}

/**
 * Data Quality Score Confidence
 * @param {number} qualityScore - Overall quality score (0-100)
 * @returns {object} { level: string, tooltip: string }
 */
export function getDataQualityConfidence(qualityScore) {
  const score = parseFloat(qualityScore) || 0;
  
  if (score >= 70) {
    return {
      level: "high",
      tooltip: `Strong data quality (${score.toFixed(0)}/100) based on deduplication, attribution, and enrichment metrics.`
    };
  }
  
  if (score >= 50) {
    return {
      level: "medium",
      tooltip: `Moderate data quality (${score.toFixed(0)}/100). Some enrichment gaps but core metrics reliable.`
    };
  }
  
  return {
    level: "low",
    tooltip: `Limited data quality (${score.toFixed(0)}/100). Early-stage enrichment; use for directional analysis only.`
  };
}

/**
 * Generate confidence summary line for dashboard header
 * @param {object} confidenceLevels - Object with keys: severity, mitre, attackChains, dedup
 * @returns {string} Formatted confidence summary
 */
export function getConfidenceSummary(confidenceLevels) {
  const icons = {
    high: '🟢',
    medium: '🟡',
    low: '🔴'
  };
  
  const parts = [];
  if (confidenceLevels.severity) parts.push(`Severity ${icons[confidenceLevels.severity]}`);
  if (confidenceLevels.mitre) parts.push(`MITRE ${icons[confidenceLevels.mitre]}`);
  if (confidenceLevels.attackChains) parts.push(`Attack chains ${icons[confidenceLevels.attackChains]}`);
  if (confidenceLevels.dedup) parts.push(`Deduplication ${icons[confidenceLevels.dedup]}`);
  
  return `Confidence: ${parts.join(' | ')}`;
}
