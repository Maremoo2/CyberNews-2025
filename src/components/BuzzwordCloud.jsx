import './BuzzwordCloud.css'

function BuzzwordCloud({ buzzwords, selectedBuzzwords = [], onBuzzwordClick }) {
  // Calculate font size based on position (earlier = more frequent)
  const getTagSize = (index) => {
    if (!buzzwords || buzzwords.length === 0) return 0.9
    
    // First items are larger (most frequent)
    const normalized = 1 - (index / buzzwords.length)
    // Size between 0.9rem and 2rem
    return 0.9 + (normalized * 1.1)
  }

  // Generate colors for variety
  const getTagColor = (index) => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ]
    return colors[index % colors.length]
  }

  if (!buzzwords || buzzwords.length === 0) {
    return (
      <div className="buzzword-cloud-container">
        <h3 className="buzzword-cloud-title">Buzzwords</h3>
        <p className="no-buzzwords">Ingen buzzwords tilgjengelig for valgt periode</p>
      </div>
    )
  }

  return (
    <div className="buzzword-cloud-container">
      <h3 className="buzzword-cloud-title">Buzzwords fra Nyhetssammendrag</h3>
      <div className="buzzword-cloud">
        {buzzwords.map((word, index) => (
          <button
            key={word}
            className={`cloud-buzzword ${selectedBuzzwords.includes(word) ? 'selected' : ''}`}
            onClick={() => onBuzzwordClick && onBuzzwordClick(word)}
            style={{ 
              fontSize: `${getTagSize(index)}rem`,
              color: getTagColor(index)
            }}
            title={`${word}`}
            aria-label={`Buzzword: ${word}`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BuzzwordCloud
