import { useMemo, useState, useEffect } from "react";
import './IncidentsSection.css';

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return incidents
      .filter((x) => {
        if (tab === "all") return true;
        // Map content_type to tabs
        if (tab === "incident") return x.content_type === "incident" || !x.content_type;
        if (tab === "vulnerability") return x.content_type === "vulnerability";
        if (tab === "policy") return x.content_type === "policy" || x.content_type === "court/regulation";
        if (tab === "opinion") return x.content_type === "opinion" || x.content_type === "prediction";
        return false;
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
  }, [incidents, tab, query, curatedOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Reset page when filters change
  useEffect(() => setPage(1), [tab, pageSize, query, curatedOnly]);

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
    setCuratedOnly(false);
  };

  return (
    <section className="incidents-section" id="incidents">
      <div className="section-header">
        <h2>📋 Incident Timeline</h2>
        <p className="subtitle">Detailed incident list with filtering and pagination</p>
      </div>

      <div className="toolbar">
        <div className="tabs">
          {[
            { id: "all", label: "ALL" },
            { id: "incident", label: "INCIDENTS" },
            { id: "vulnerability", label: "VULNERABILITIES" },
            { id: "policy", label: "POLICY" },
            { id: "opinion", label: "OPINION/PREDICTIONS" }
          ].map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "tab active" : "tab"}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
            >
              {t.label}
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

          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, summary, tags…"
            aria-label="Search incidents"
          />

          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(Number(e.target.value))}
            aria-label="Items per page"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>

      <div className="meta">
        Showing <b>{filtered.length ? start : 0}</b>–<b>{filtered.length ? end : 0}</b> of <b>{filtered.length}</b> incidents
      </div>

      <div className="list">
        {pageItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No incidents found</h3>
            <p>No incidents match your current filters.</p>
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
