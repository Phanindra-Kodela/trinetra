export default function Controls({ gameState, onStart, onPause, onReset }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      
      {/* Conditional rendering based on gameState */}
      {gameState === 'playing' ? (
        <button onClick={onPause} style={buttonStyle}>
          Pause
        </button>
      ) : (
        <button onClick={onStart} style={buttonStyle}>
          {gameState === 'paused' ? 'Resume' : 'Start Game'}
        </button>
      )}

      <button 
        onClick={onReset} 
        disabled={gameState === 'idle'}
        style={{
          ...buttonStyle, 
          opacity: gameState === 'idle' ? 0.5 : 1,
          cursor: gameState === 'idle' ? 'not-allowed' : 'pointer'
        }}
      >
        Reset
      </button>

    </div>
  )
}

// A quick styling object to keep the JSX clean
const buttonStyle = {
  padding: '0.6rem 1.2rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  backgroundColor: '#646cff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
}