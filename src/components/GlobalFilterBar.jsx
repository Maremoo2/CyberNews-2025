import { useState, useEffect } from 'react';
import './GlobalFilterBar.css';
import taxonomy from '../../config/taxonomy.json';

function GlobalFilterBar({ 
  onFilterChange, 
  initialFilters = {
    contentType: 'all',
    severity: 'all',
    actorType: 'all',
    sector: 'all',
    region: 'all',
    dateRange: { start: '', end: '' }
  }
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'dateRange') {
      return value.start || value.end;
    }
    return value !== 'all';
  }).length;

  return (
    <div className="global-filter-bar">
      <div className="filter-bar-header">
        <div className="filter-bar-title">
          <span className="filter-icon">🎛️</span>
          <h3>Global Filters</h3>
          {activeFilterCount > 0 && (
            <span className="active-filter-badge">{activeFilterCount} active</span>
          )}
        </div>
        <div className="filter-bar-actions">
          <button 
            className="reset-button"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
          >
            🔄 Reset All
          </button>
          <button 
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▲ Collapse' : '▼ Expand'}
          </button>
        </div>
      </div>

      <div className={`filter-bar-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Content Type Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-label-icon">📋</span>
            Content Type
          </label>
          <select
            className="filter-select"
            value={filters.contentType}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
          >
            <option value="all">All Content</option>
            {Object.entries(taxonomy.contentTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-label-icon">⚠️</span>
            Severity
          </label>
          <select
            className="filter-select"
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
          >
            <option value="all">All Severities</option>
            {Object.entries(taxonomy.severityLevels).map(([key, level]) => (
              <option key={key} value={key}>
                {level.icon} {level.label} ({level.range[0]}-{level.range[1]})
              </option>
            ))}
          </select>
        </div>

        {/* Actor Type Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-label-icon">👥</span>
            Actor Type
          </label>
          <select
            className="filter-select"
            value={filters.actorType}
            onChange={(e) => handleFilterChange('actorType', e.target.value)}
          >
            <option value="all">All Actors</option>
            {Object.entries(taxonomy.actorTypes).map(([key, actor]) => (
              <option key={key} value={key}>
                {actor.icon} {actor.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-label-icon">🏢</span>
            Sector
          </label>
          <select
            className="filter-select"
            value={filters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
          >
            <option value="all">All Sectors</option>
            {Object.entries(taxonomy.sectors).map(([key, sector]) => (
              <option key={key} value={key}>
                {sector.icon} {sector.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-label-icon">🌍</span>
            Region
          </label>
          <select
            className="filter-select"
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="all">All Regions</option>
            {Object.entries(taxonomy.regions).map(([key, region]) => (
              <option key={key} value={key}>
                {region.icon} {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="filter-group date-range-group">
          <label className="filter-label">
            <span className="filter-label-icon">📅</span>
            Date Range
          </label>
          <div className="date-range-inputs">
            <input
              type="date"
              className="filter-input"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              placeholder="Start date"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              className="filter-input"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="active-filters-summary">
          <span className="summary-label">Active:</span>
          {filters.contentType !== 'all' && (
            <span className="filter-chip">
              Content: {taxonomy.contentTypes[filters.contentType]?.label || filters.contentType}
              <button onClick={() => handleFilterChange('contentType', 'all')}>×</button>
            </span>
          )}
          {filters.severity !== 'all' && (
            <span className="filter-chip">
              Severity: {taxonomy.severityLevels[filters.severity]?.label || filters.severity}
              <button onClick={() => handleFilterChange('severity', 'all')}>×</button>
            </span>
          )}
          {filters.actorType !== 'all' && (
            <span className="filter-chip">
              Actor: {taxonomy.actorTypes[filters.actorType]?.label || filters.actorType}
              <button onClick={() => handleFilterChange('actorType', 'all')}>×</button>
            </span>
          )}
          {filters.sector !== 'all' && (
            <span className="filter-chip">
              Sector: {taxonomy.sectors[filters.sector]?.label || filters.sector}
              <button onClick={() => handleFilterChange('sector', 'all')}>×</button>
            </span>
          )}
          {filters.region !== 'all' && (
            <span className="filter-chip">
              Region: {taxonomy.regions[filters.region]?.label || filters.region}
              <button onClick={() => handleFilterChange('region', 'all')}>×</button>
            </span>
          )}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <span className="filter-chip">
              Date: {filters.dateRange.start || '...'} - {filters.dateRange.end || '...'}
              <button onClick={() => setFilters(prev => ({ ...prev, dateRange: { start: '', end: '' } }))}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalFilterBar;
