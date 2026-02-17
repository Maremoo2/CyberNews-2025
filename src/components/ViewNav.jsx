import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './ViewNav.css';

function ViewNav({ selectedYear, onYearChange, cisoMode, onCisoModeChange, uniqueIncidents, totalArticles }) {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const views = [
    { path: '/', label: '📊 Overview' },
    { path: '/threats', label: '🌍 Threat Landscape' },
    { path: '/mitre', label: '🎯 MITRE & Chains' },
    { path: '/defense', label: '🛡️ Defense' },
    { path: '/sectors', label: '🏢 Sectors' },
    { path: '/ciso', label: '👔 CISO View' },
    { path: '/data', label: '📚 Data & Insights' }
  ];

  return (
    <nav className={`view-nav ${isSticky ? 'is-sticky' : ''}`}>
      <div className="view-nav-content">
        <div className="nav-left">
          <div className="year-toggle">
            <button
              className={selectedYear === 2025 ? 'active' : ''}
              onClick={() => onYearChange(2025)}
              aria-pressed={selectedYear === 2025}
            >
              2025
            </button>
            <button
              className={selectedYear === 2026 ? 'active' : ''}
              onClick={() => onYearChange(2026)}
              aria-pressed={selectedYear === 2026}
            >
              2026
            </button>
          </div>

          <button
            className={`ciso-toggle ${cisoMode.enabled ? 'active' : ''}`}
            onClick={() => onCisoModeChange({ ...cisoMode, enabled: !cisoMode.enabled })}
            aria-pressed={cisoMode.enabled}
          >
            💼 CISO Mode
          </button>

          {/* Data Volume Badge */}
          {uniqueIncidents && totalArticles && (
            <div className="data-volume-badge">
              <span className="badge-item unique" title="Estimated unique incidents (deduplicated)">
                🎯 {uniqueIncidents.toLocaleString()} incidents
              </span>
              <span className="badge-separator">•</span>
              <span className="badge-item articles" title="Total incident-related articles">
                📰 {totalArticles.toLocaleString()} articles
              </span>
            </div>
          )}
        </div>

        <div className="nav-center">
          <div className="view-tabs">
            {views.map(view => (
              <NavLink
                key={view.path}
                to={view.path}
                className={({ isActive }) => `view-tab ${isActive ? 'active' : ''}`}
                end={view.path === '/'}
              >
                {view.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ViewNav;
