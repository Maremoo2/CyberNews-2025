import './HeroSection.css';

/**
 * Hero Section Component
 * Modern landing section with visual appeal and clear CTAs
 */
function HeroSection({ onNavigate }) {
  const stats = [
    { value: '800+', label: 'Incidents Tracked', emoji: '🎯', color: '#00d4ff' },
    { value: '100%', label: 'MITRE Mapped', emoji: '🛡️', color: '#44ff88' },
    { value: 'Daily', label: 'Updates', emoji: '📊', color: '#ffaa44' },
    { value: 'AI', label: 'Powered Analysis', emoji: '🤖', color: '#ff44ff' }
  ];

  const features = [
    {
      icon: '📅',
      title: 'Daily Digest',
      description: 'Top 3 threats with tactical analysis',
      action: 'View Today',
      color: '#ff4444'
    },
    {
      icon: '📊',
      title: 'Weekly Brief',
      description: 'Strategic overview and trends',
      action: 'View Week',
      color: '#ffaa44'
    },
    {
      icon: '📈',
      title: 'Full Analysis',
      description: 'Deep dive into threat landscape',
      action: 'Explore Data',
      color: '#00d4ff'
    }
  ];

  return (
    <div className="hero-section">
      {/* Background pattern */}
      <div className="hero-background" />
      
      {/* Main hero content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          <span className="badge-text">Live • Oppdatert daglig</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-emoji">🛡️</span>
          CyberNews 2026
        </h1>

        <p className="hero-subtitle">
          En datadrevet oversikt over trussellandskapet
        </p>

        <p className="hero-description">
          Strukturert, filtrerbart og visualisert med MITRE ATT&CK mapping,
          AI-drevet analyse og transparente severity scores
        </p>

        {/* Stats cards */}
        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={{ '--accent-color': stat.color }}
            >
              <div className="stat-emoji">{stat.emoji}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick action cards */}
        <div className="hero-actions">
          {features.map((feature, index) => (
            <button
              key={index}
              className="action-card"
              onClick={() => onNavigate && onNavigate(feature.title)}
              style={{ '--accent-color': feature.color }}
            >
              <div className="action-icon">{feature.icon}</div>
              <div className="action-content">
                <h3 className="action-title">{feature.title}</h3>
                <p className="action-description">{feature.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span>Scroll for mer</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
