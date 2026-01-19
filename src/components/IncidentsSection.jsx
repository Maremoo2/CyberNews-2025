import { useMemo, useState, useEffect, useRef } from "react";
import './IncidentsSection.css';
import { normalizeContentType } from '../utils/populationUtils';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// Helper to get URL params
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    tab: params.get('tab') || 'all',
    page: parseInt(params.get('page') || '1', 10),
    pageSize: parseInt(params.get('pageSize') || '10', 10),
    query: params.get('q') || '',
    curated: params.get('curated') === '1'
  };
}

// Helper to update URL params
function updateUrlParams(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach(key => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, '', url);
}

export default function IncidentsSection({ incidents, onTagClick, selectedTags, formatDate, getImpactBadge }) {
  // Initialize state from URL params
  const urlParams = getUrlParams();
  const [tab, setTab] = useState(urlParams.tab);
  const [pageSize, setPageSize] = useState(urlParams.pageSize);
  const [page, setPage] = useState(urlParams.page);
  const [query, setQuery] = useState(urlParams.query);
  const [curatedOnly, setCuratedOnly] = useState(urlParams.curated);
  const [debouncedQuery, setDebouncedQuery] = useState(urlParams.query);
  const searchInputRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Calculate tab counts with normalized content types
  const tabCounts = useMemo(() => {
    const counts = {
      all: incidents.length,
      incident: 0,
      vulnerability: 0,
      policy: 0,
      opinion: 0,
    };
    
    incidents.forEach(x => {
      const normalizedType = normalizeContentType(x.content_type);
      if (normalizedType === 'incident') counts.incident++;
      else if (normalizedType === 'vulnerability') counts.vulnerability++;
      else if (normalizedType === 'policy') counts.policy++;
      else if (normalizedType === 'opinion') counts.opinion++;
    });
    
    return counts;
  }, [incidents]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    return incidents
      .filter((x) => {
        if (tab === "all") return true;
        // Use normalized content type for filtering
        const normalizedType = normalizeContentType(x.content_type);
        return normalizedType === tab;
      })
      .filter((x) => curatedOnly ? x.is_curated : true)
      .filter((x) => {
        if (!q) return true;
        return (
          (x.title || "").toLowerCase().includes(q) ||
          (x.summary || "").toLowerCase().includes(q) ||
          (x.tags || []).some((t) => (t || "").toLowerCase().includes(q))
        );
      });
  }, [incidents, tab, debouncedQuery, curatedOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Reset page when filters change - intentional setState in effect for pagination reset
  useEffect(() => {
    setPage(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, [tab, pageSize, debouncedQuery, curatedOnly]);

  // Update URL params when state changes
  useEffect(() => {
    updateUrlParams({
      tab: tab !== 'all' ? tab : '',
      page: page > 1 ? page : '',
      pageSize: pageSize !== 10 ? pageSize : '',
      q: query || '',
      curated: curatedOnly ? '1' : ''
    });
  }, [tab, page, pageSize, query, curatedOnly]);

  const pageItems = useMemo(() => paginate(filtered, page, pageSize), [filtered, page, pageSize]);

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, filtered.length);

  // Reset all filters function
  const resetFilters = () => {
    setTab('all');
    setPage(1);
    setPageSize(10);
    setQuery('');
    setDebouncedQuery('');
    setCuratedOnly(false);
  };

  // Clear search function
  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Copy shareable link
  const copyShareableLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get active filters for empty state
  const activeFilters = useMemo(() => {
    const filters = [];
    if (tab !== 'all') filters.push({ label: `Tab: ${tab.toUpperCase()}`, clear: () => setTab('all') });
    if (curatedOnly) filters.push({ label: 'Curated only', clear: () => setCuratedOnly(false) });
    if (debouncedQuery) filters.push({ 
      label: `Search: "${debouncedQuery}"`, 
      clear: () => {
        setQuery('');
        setDebouncedQuery('');
      }
    });
    return filters;
  }, [tab, curatedOnly, debouncedQuery]);

  return (
    <section className="incidents-section" id="incidents">
      <div className="section-header">
        <h2>📋 Incident Timeline</h2>
        <p className="subtitle">Detailed incident list with filtering and pagination</p>
      </div>

      <div className="toolbar">
        <div className="tabs">
          {[
            { id: "all", label: "ALL", count: tabCounts.all, tooltip: "All content types" },
            { id: "incident", label: "INCIDENT-RELATED ARTICLES", count: tabCounts.incident, tooltip: "Incidents, breaches, attacks & campaigns" },
            { id: "vulnerability", label: "VULNERABILITIES", count: tabCounts.vulnerability, tooltip: "Vulnerabilities and CVEs" },
            { id: "policy", label: "POLICY", count: tabCounts.policy, tooltip: "Policy, regulation & legal" },
            { id: "opinion", label: "OPINION/PREDICTIONS", count: tabCounts.opinion, tooltip: "Opinions, predictions & forecasts" }
          ].map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "tab active" : "tab"}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              title={t.tooltip}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="controls">
          <label className="curated-toggle">
            <input
              type="checkbox"
              checked={curatedOnly}
              onChange={(e) => setCuratedOnly(e.target.checked)}
            />
            <span>Curated only</span>
          </label>

          <div className="search-wrapper">
            <input
              ref={searchInputRef}
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, summary, tags…"
              aria-label="Search incidents"
            />
            {query && (
              <button 
                className="search-clear" 
                onClick={clearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(Number(e.target.value))}
            aria-label="Items per page"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>

          <button 
            className="copy-link-btn" 
            onClick={copyShareableLink}
            title="Copy shareable link"
            aria-label="Copy shareable link"
          >
            🔗 Copy link
          </button>
        </div>
      </div>

      <div className="meta">
        Showing <b>{filtered.length ? start : 0}</b>–<b>{filtered.length ? end : 0}</b> of <b>{filtered.length}</b> {tab === 'all' ? 'items' : tab === 'incident' ? 'incidents' : tab}
      </div>

      <div className="list">
        {pageItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No incidents found</h3>
            <p>No incidents match your current filters.</p>
            {activeFilters.length > 0 && (
              <div className="active-filters">
                <p className="filters-label">Active filters:</p>
                <div className="filter-chips">
                  {activeFilters.map((filter, index) => (
                    <button 
                      key={index} 
                      className="filter-chip"
                      onClick={filter.clear}
                      aria-label={`Remove filter: ${filter.label}`}
                    >
                      {filter.label} <span className="chip-close">×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button className="reset-btn" onClick={resetFilters}>
              Reset all filters
            </button>
          </div>
        ) : (
          pageItems.map((item) => {
            const impactBadge = getImpactBadge(item.impact);
            return (
              <article key={item.id} className="card">
                <div className="cardHeader">
                  <time className="date">{formatDate(item.date)}</time>
                  <span className={`region ${item.region?.toLowerCase()}`}>{item.region}</span>
                  {item.severity === "critical" && <span className="badge critical">CRITICAL</span>}
                </div>
                <h3 className="title">
                  {impactBadge && (
                    <span 
                      className={`impact-badge ${impactBadge.className}`} 
                      title={impactBadge.label}
                      aria-label={`Severity: ${impactBadge.label}`}
                      role="img"
                    >
                      {impactBadge.emoji}
                    </span>
                  )}
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p className="summary">{item.summary}</p>
                <div className="tags">
                  {(item.tags || []).slice(0, 6).map((t) => (
                    <button
                      key={t}
                      className={`tag ${selectedTags.includes(t) ? 'selected' : ''}`}
                      onClick={() => onTagClick(t)}
                      aria-label={selectedTags.includes(t) ? `Remove filter: ${t}` : `Filter on: ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <div className="pager">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span>
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
