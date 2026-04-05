import { useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function SummaryScreen({ onRestart }) {
  
  useEffect(() => {
    // Log that the player reached the summary screen
    logGameEvent('viewed_summary_screen', {});
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card} className="game-card">
        <h1 style={styles.title}>MISSION COMPLETE</h1>
        <p style={styles.subtitle}>You have successfully navigated the digital landscape!</p>

        <div style={styles.badgeContainer}>
          {/* Skill Badge */}
          <div style={styles.badgeCard} className="consequence-card">
            <div style={styles.iconBackground}>
              <span style={{ fontSize: '3rem' }}>⚡</span>
            </div>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Skill Badge</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Awarded for identifying cyber threats and scoring more than 70% in all active simulations.
            </p>
            <div style={styles.status}>STATUS: <span style={{ color: '#4CAF50' }}>EARNED</span></div>
          </div>

          {/* Ethics Badge */}
          <div style={styles.badgeCard} className="consequence-card">
            <div style={styles.iconBackground}>
              <span style={{ fontSize: '3rem' }}>⚖️</span>
            </div>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Ethics Badge</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Awarded for demonstrating deep moral reasoning and completing all reflection journals.
            </p>
            <div style={styles.status}>STATUS: <span style={{ color: '#4CAF50' }}>EARNED</span></div>
          </div>
        </div>

        <div style={styles.finalRank}>
          <p style={{ color: '#888', margin: '0 0 5px 0', fontSize: '0.9rem', textTransform: 'uppercase' }}>Final Evaluation</p>
          <h2 style={{ color: '#646cff', margin: 0, letterSpacing: '2px' }}>CERTIFIED CYBER-DEFENDER</h2>
        </div>

        <button style={styles.primaryButton} className="action-btn" onClick={onRestart}>
          Return to Main Menu
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: '100%', display: 'flex', justifyContent: 'center', padding: '2rem' },
  card: { backgroundColor: '#1a1a1a', padding: '3rem', borderRadius: '12px', border: '1px solid #333', maxWidth: '800px', width: '100%', textAlign: 'center' },
  title: { fontSize: '3rem', margin: '0 0 10px 0', color: '#4CAF50', letterSpacing: '2px' },
  subtitle: { fontSize: '1.2rem', color: '#ccc', marginBottom: '3rem' },
  badgeContainer: { display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' },
  badgeCard: { backgroundColor: '#242424', padding: '2rem', borderRadius: '12px', flex: '1', minWidth: '250px', borderTop: '4px solid #646cff', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  iconBackground: { backgroundColor: '#1a1a1a', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', border: '2px solid #444' },
  status: { marginTop: 'auto', paddingTop: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.9rem', color: '#888' },
  finalRank: { backgroundColor: '#111', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #555', marginBottom: '2.5rem' },
  primaryButton: { padding: '1rem 2rem', backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }
};