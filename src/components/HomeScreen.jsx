export default function HomeScreen({ onSelectLevel }) {
  // Level data matching your project brief
  const levels = [
    { id: 1, title: "The Free WiFi Trap", locked: false },
    { id: 2, title: "The Shared Photo", locked: false},
    { id: 3, title: "The UPI PIN Discovery", locked: false },
    { id: 4, title: "The Teacher's Deepfake", locked: false },
    { id: 5, title: "The Aadhaar Leak", locked: false },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>TRINETRA 2.0</h1>
        <p style={styles.subtitle}>A Cyber-Ethics Adventure</p>
      </div>

      <div style={styles.content}>
        {/* Veda Character Panel */}
        <div style={styles.characterPanel}>
          <div style={styles.spriteBox}>
            {/* REPLACE THIS EMOJI with an <img src="/veda-sprite.png" /> later */}
           <img src="/veda.png" alt="Veda" style={{ width: '100px' }} />
          </div>
          <h2 style={{ margin: '10px 0 5px 0' }}>Veda</h2>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Ready to investigate?</p>
        </div>

        {/* Level Selector */}
        <div style={styles.levelSelector}>
          <h2 style={{ marginBottom: '1rem', color: '#646cff' }}>Select Mission</h2>
          <div style={styles.levelGrid}>
            {levels.map((level) => (
              <button
                key={level.id}
                style={{
                  ...styles.levelButton,
                  ...(level.locked ? styles.locked : styles.unlocked)
                }}
                disabled={level.locked}
                onClick={() => onSelectLevel(level.id)}
              >
                <div style={styles.levelHeader}>
                  <span style={{ fontWeight: 'bold' }}>Level {level.id}</span>
                  <span>{level.locked ? '🔒' : '🔓'}</span>
                </div>
                <div style={styles.levelTitle}>{level.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '900px', gap: '2rem' },
  header: { textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', width: '100%' },
  title: { fontSize: '3rem', margin: 0, color: '#646cff', letterSpacing: '2px' },
  subtitle: { fontSize: '1.2rem', color: '#888', margin: '5px 0 0 0' },
  content: { display: 'flex', gap: '3rem', width: '100%', flexWrap: 'wrap', justifyContent: 'center' },
  characterPanel: { flex: '1', minWidth: '250px', backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' },
  spriteBox: { width: '150px', height: '150px', backgroundColor: '#242424', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '4px solid #646cff' },
  levelSelector: { flex: '2', minWidth: '300px' },
  levelGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  levelButton: { width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.1s' },
  unlocked: { backgroundColor: '#2a2a2a', borderLeft: '6px solid #4CAF50', color: '#fff' },
  locked: { backgroundColor: '#1a1a1a', borderLeft: '6px solid #555', color: '#555', cursor: 'not-allowed' },
  levelHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' },
  levelTitle: { fontSize: '1.2rem' }
};