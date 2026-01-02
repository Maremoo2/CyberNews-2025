import './BuzzwordCloud.css'

function BuzzwordCloud({ buzzwords, selectedBuzzwords = [], onBuzzwordClick }) {
  // Calculate font size based on position (first items are more frequent)
  const getTagSize = (index) => {
    if (buzzwords.length === 0) return 0.9
    const normalized = 1 - (index / buzzwords.length)
    // Size between 0.9rem and 2rem
    return 0.9 + (normalized * 1.1)
  }

  if (!buzzwords || buzzwords.length === 0) {
    return null
  }

  return (
    <div className="buzzword-cloud-container">
      <h3 className="buzzword-cloud-title">🔑 Nøkkelord</h3>
      <div className="buzzword-cloud">
        {buzzwords.map((buzzword, index) => (
          <button
            key={buzzword}
            className={`cloud-buzzword ${selectedBuzzwords.includes(buzzword) ? 'selected' : ''}`}
            onClick={() => onBuzzwordClick && onBuzzwordClick(buzzword)}
            style={{ fontSize: `${getTagSize(index)}rem` }}
            title={`${buzzword}`}
            aria-label={`Filter by ${buzzword}`}
          >
            {buzzword}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BuzzwordCloud
