import { useState, useEffect } from 'react';
import './StickyNav.css';

function StickyNav({ selectedYear, onYearChange, cisoMode, onCisoModeChange, uniqueIncidents, totalArticles }) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);

      // Detect active section
      const sections = [
        'summary', 'snapshot', 'themes', 'attack-chains', 'benchmarking',
        'mitre', 'actors', 'defense', 'regulation', 'predictions', 'methodology', 'incidents'
      ];

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Account for sticky nav height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'summary', label: 'Summary' },
    { id: 'snapshot', label: 'Snapshot' },
    { id: 'themes', label: 'Themes' },
    { id: 'attack-chains', label: 'Attack Chains' },
    { id: 'benchmarking', label: 'Benchmarking' },
    { id: 'mitre', label: 'MITRE' },
    { id: 'actors', label: 'Actors' },
    { id: 'defense', label: 'Defense' },
    { id: 'regulation', label: 'Regulation' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'incidents', label: 'Incidents' }
  ];

  return (
    <nav className={`sticky-nav ${isSticky ? 'is-sticky' : ''}`}>
      <div className="sticky-nav-content">
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
                🎯 {uniqueIncidents.toLocaleString()} estimated unique incidents
              </span>
              <span className="badge-separator">•</span>
              <span className="badge-item articles" title="Total incident-related articles">
                📰 {totalArticles.toLocaleString()} articles
              </span>
            </div>
          )}
        </div>

        <div className="nav-center">
          <div className="section-nav">
            <button
              className="nav-dropdown-trigger"
              onClick={(e) => {
                e.currentTarget.nextElementSibling.classList.toggle('show');
              }}
            >
              📑 Innhold
            </button>
            <div className="section-dropdown">
              {sections.map(section => (
                <button
                  key={section.id}
                  className={activeSection === section.id ? 'active' : ''}
                  onClick={() => {
                    scrollToSection(section.id);
                    document.querySelector('.section-dropdown').classList.remove('show');
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StickyNav;
