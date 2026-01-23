/**
 * Consistency Checks for Dashboard Metrics
 * 
 * These utilities ensure n/N integrity, prevent silent data drift,
 * and make all percentages auditable.
 * 
 * Design principle: "Exec will notice this in 5 seconds" - catch errors early.
 */

/**
 * Calculate percentage with built-in consistency checks
 * @param {number} n - Numerator (must be ≤ N)
 * @param {number} N - Denominator (population)
 * @param {number} digits - Decimal places (default: 1)
 * @returns {object} { pct: number|null, text: string, ok: boolean }
 */
export function safePct(n, N, digits = 1) {
  // Handle invalid denominators
  if (!N || N <= 0) {
    return { pct: null, text: "N/A", ok: true };
  }
  
  // Calculate percentage
  const p = +(100 * n / N).toFixed(digits);
  
  // Consistency checks
  const ok = n <= N && Number.isFinite(p) && p >= 0 && p <= 100;
  
  if (!ok) {
    console.warn("❌ Bad ratio detected", { n, N, p, issue: n > N ? "n > N" : "invalid calculation" });
  }
  
  return { 
    pct: p, 
    text: `${p}% (${n}/${N})`, 
    ok 
  };
}

/**
 * Format coverage metric with explicit population label
 * @param {number} n - Numerator
 * @param {number} N - Denominator
 * @param {string} noun - Population label (e.g., "incident-related items")
 * @param {number} digits - Decimal places
 * @returns {object} { pct, formattedText, displayText, ok }
 */
export function formatCoverage({ n, N, noun, digits = 1 }) {
  const result = safePct(n, N, digits);
  
  return {
    pct: result.pct,
    formattedText: `${n}/${N} ${noun} (${result.pct}%)`,
    displayText: `${result.pct}%`,
    ok: result.ok
  };
}

/**
 * Validate that words match math (semantic consistency check)
 * @param {string} label - What the UI says (e.g., "incidents", "items")
 * @param {string} actualNoun - What we're actually counting
 * @returns {boolean} true if consistent
 */
export function validateLabelConsistency(label, actualNoun) {
  const normalized = label.toLowerCase();
  const actual = actualNoun.toLowerCase();
  
  // Check for common mismatches
  const isInconsistent = (
    (normalized.includes('incident') && actual.includes('item')) ||
    (normalized.includes('item') && actual.includes('incident') && !actual.includes('item'))
  );
  
  if (isInconsistent) {
    console.warn("❌ Label/noun mismatch", { label, actualNoun });
    return false;
  }
  
  return true;
}

/**
 * Create population context for a section
 * @param {string} populationLabel - Description of what's being counted
 * @param {number} populationN - Count
 * @returns {object} { label, count, text }
 */
export function createPopulationContext(populationLabel, populationN) {
  return {
    label: populationLabel,
    count: populationN,
    text: `Population: ${populationLabel} (${populationN.toLocaleString()})`
  };
}

/**
 * Check data quality: unknown/empty tag rate
 * @param {Array} items - List of items
 * @returns {object} { unknownRate, unknownCount, totalCount, isHighQuality }
 */
export function checkTagQuality(items) {
  if (!items || items.length === 0) {
    return { unknownRate: 0, unknownCount: 0, totalCount: 0, isHighQuality: true };
  }
  
  const unknownTags = ['unknown', 'general', 'misc', 'none', 'n/a', ''];
  const unknownCount = items.filter(item => {
    if (!item.tags || item.tags.length === 0) return true;
    return item.tags.every(tag => 
      !tag || unknownTags.includes(tag.toLowerCase().trim())
    );
  }).length;
  
  const unknownRate = (unknownCount / items.length) * 100;
  const isHighQuality = unknownRate < 20; // Threshold: 20%
  
  if (!isHighQuality) {
    console.warn(`⚠️ High unknown tag rate: ${unknownRate.toFixed(1)}% (${unknownCount}/${items.length})`);
  }
  
  return {
    unknownRate: parseFloat(unknownRate.toFixed(1)),
    unknownCount,
    totalCount: items.length,
    isHighQuality
  };
}

/**
 * Check curation coverage
 * @param {number} curatedCount - Number of curated items
 * @param {number} totalCount - Total items
 * @returns {object} { curationRate, isSufficient, message }
 */
export function checkCurationCoverage(curatedCount, totalCount) {
  const result = safePct(curatedCount, totalCount, 1);
  const isSufficient = result.pct >= 10; // Threshold: 10%
  
  return {
    curationRate: result.pct,
    isSufficient,
    message: isSufficient 
      ? `Curation: ${result.text}` 
      : `⚠️ Low curation: ${result.text} (threshold: 10%)`
  };
}

/**
 * Validate cluster metrics for deduplication sanity
 * @param {number} totalItems - Total items
 * @param {number} uniqueClusters - Unique clusters
 * @returns {object} { ratio, isReasonable, message }
 */
export function validateClusterRatio(totalItems, uniqueClusters) {
  if (!uniqueClusters || uniqueClusters === 0) {
    return { ratio: 0, isReasonable: false, message: "No clusters detected" };
  }
  
  const ratio = totalItems / uniqueClusters;
  
  // Reasonable ratio: between 1.5x and 10x
  // Below 1.5x: under-clustering (too many unique)
  // Above 10x: over-clustering (too few unique)
  const isReasonable = ratio >= 1.5 && ratio <= 10;
  
  if (!isReasonable) {
    if (ratio < 1.5) {
      console.warn(`⚠️ Possible under-clustering: ${ratio.toFixed(1)}x (too many unique clusters)`);
    } else {
      console.warn(`⚠️ Possible over-clustering: ${ratio.toFixed(1)}x (too few unique clusters)`);
    }
  }
  
  return {
    ratio: parseFloat(ratio.toFixed(1)),
    isReasonable,
    message: isReasonable 
      ? `Cluster ratio: ${ratio.toFixed(1)}x (${totalItems}/${uniqueClusters})` 
      : `⚠️ Unusual cluster ratio: ${ratio.toFixed(1)}x`
  };
}

/**
 * Run comprehensive consistency check on a metric
 * @param {object} params - { n, N, label, noun, expectedRange }
 * @returns {object} { isValid, errors, warnings }
 */
export function validateMetric({ n, N, label, noun, expectedRange = null }) {
  const errors = [];
  const warnings = [];
  
  // Check n/N integrity
  const pctResult = safePct(n, N);
  if (!pctResult.ok) {
    errors.push(`Invalid ratio: ${n}/${N}`);
  }
  
  // Check label consistency
  if (!validateLabelConsistency(label, noun)) {
    errors.push(`Label "${label}" doesn't match noun "${noun}"`);
  }
  
  // Check expected range if provided
  if (expectedRange && pctResult.pct !== null) {
    const { min, max } = expectedRange;
    if (pctResult.pct < min || pctResult.pct > max) {
      warnings.push(`Value ${pctResult.pct}% outside expected range [${min}%, ${max}%]`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    result: pctResult
  };
}

/**
 * Create a population banner for section headers
 * @param {string} label - Population description
 * @param {number} count - Population count
 * @returns {string} Formatted text for display
 */
export function createPopulationBanner(label, count) {
  return `📊 Population: ${label} (${count.toLocaleString()})`;
}
