import { useMemo } from 'react';
import './WeeklyHighlights.css';

function WeeklyHighlights({ incidents }) {
  const weeklyHighlights = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Get date from 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    // Filter incidents from last 7 days
    const recentIncidents = incidents.filter(incident => {
      if (!incident.date) return false;
      return incident.date >= sevenDaysAgoStr;
    });

    if (recentIncidents.length === 0) {
      return [];
    }

    // Group by title similarity or incidentId to find most covered stories
    const incidentGroups = {};
    
    recentIncidents.forEach(incident => {
      // Use incidentId if available, otherwise use first few words of title
      const key = incident.incidentId || incident.title?.substring(0, 50) || 'unknown';
      
      if (!incidentGroups[key]) {
        incidentGroups[key] = {
          incidents: [],
          count: 0,
          latestDate: incident.date,
          severity: incident.severity || 'low',
          impact: incident.impact || 0,
          tags: new Set(),
          title: incident.title
        };
      }
      
      incidentGroups[key].incidents.push(incident);
      incidentGroups[key].count++;
      
      // Collect tags, filtering out meaningless ones for consistency with rest of app
      if (incident.tags && Array.isArray(incident.tags)) {
        const excludedTags = ['unknown', 'general', 'misc', 'other', 'n/a', 'none', ''];
        incident.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (!excludedTags.includes(lowerTag)) {
            incidentGroups[key].tags.add(tag);
          }
        });
      }
      
      // Keep the latest date
      if (incident.date > incidentGroups[key].latestDate) {
        incidentGroups[key].latestDate = incident.date;
        incidentGroups[key].title = incident.title;
      }
      
      // Keep highest severity/impact
      if (incident.impact > incidentGroups[key].impact) {
        incidentGroups[key].impact = incident.impact;
        incidentGroups[key].severity = incident.severity || 'low';
      }
    });

    // Convert to array and sort by coverage (count) and impact
    const topStories = Object.entries(incidentGroups)
      .map(([key, data]) => ({
        key,
        ...data,
        tags: Array.from(data.tags).slice(0, 3)
      }))
      .sort((a, b) => {
        // Sort by count first, then by impact
        if (b.count !== a.count) return b.count - a.count;
        return b.impact - a.impact;
      })
      .slice(0, 3);

    return topStories;
  }, [incidents]);

  if (weeklyHighlights.length === 0) {
    return null;
  }

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: '🔴',
      high: '🟠',
      moderate: '🟡',
      low: '🟢'
    };
    return icons[severity] || '⚪';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="weekly-highlights">
      <div className="highlights-header">
        <h3>🔥 Top 3 This Week</h3>
        <p className="highlights-subtitle">Most covered incidents in the last 7 days</p>
      </div>

      <div className="highlights-grid">
        {weeklyHighlights.map((story, index) => (
          <div key={story.key} className={`highlight-card rank-${index + 1}`}>
            <div className="highlight-rank">#{index + 1}</div>
            <div className="highlight-content">
              <div className="highlight-header">
                <span className="highlight-severity">
                  {getSeverityIcon(story.severity)} {story.severity}
                </span>
                <span className="highlight-coverage">
                  {story.count} article{story.count > 1 ? 's' : ''}
                </span>
              </div>
              <h4 className="highlight-title">{story.title}</h4>
              <div className="highlight-meta">
                <span className="highlight-date">Latest: {formatDate(story.latestDate)}</span>
                {story.tags.length > 0 && (
                  <div className="highlight-tags">
                    {story.tags.map(tag => (
                      <span key={tag} className="highlight-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyHighlights;
