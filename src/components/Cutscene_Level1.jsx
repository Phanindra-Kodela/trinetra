import { useState, useEffect } from 'react';

export default function Cutscene_Level1({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Cinematic timing sequence
    const sequence = [
      { time: 1000, action: () => setStep(1) }, // Show no signal
      { time: 3000, action: () => setStep(2) }, // Show dialogue
      { time: 5000, action: () => setStep(3) }  // Show button
    ];

    const timeouts = sequence.map(s => setTimeout(s.action, s.time));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div style={styles.container}>
      <p style={styles.narration}>
        "Veda needs internet urgently to send her school assignment. But her mobile data is over..."
      </p>

      {/* FAKE PHONE STATUS BAR */}
      <div style={{ ...styles.phoneScreen, opacity: step >= 1 ? 1 : 0 }}>
        <div style={styles.statusBar}>
          <span>14:30</span>
          <span style={{ color: '#F44336', animation: 'blink 1s infinite' }}>⚠️ NO SERVICE</span>
          <span>🔋 12%</span>
        </div>
        <div style={styles.screenBody}>
          <h2 style={{ color: '#F44336', textAlign: 'center' }}>Assignment Upload Failed.</h2>
          <p style={{ color: '#888', textAlign: 'center' }}>Please connect to the internet to retry.</p>
        </div>
      </div>

      {/* VEDA'S DIALOGUE */}
      <div style={{ ...styles.dialogueBox, opacity: step >= 2 ? 1 : 0, transition: 'opacity 1s ease' }}>
        <div style={styles.spriteBox}>🕵️‍♀️</div>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#646cff', margin: '0 0 5px 0' }}>Veda</h3>
          <p style={{ margin: 0, fontStyle: 'italic', color: '#ddd' }}>
            "Oh no… no mobile data. I need internet fast. Maybe I can find WiFi nearby."
          </p>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div style={{ ...styles.actionArea, opacity: step >= 3 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <h3 style={{ color: '#4CAF50', letterSpacing: '1px' }}>FIND A SAFE CONNECTION</h3>
        <button style={styles.startButton} className="action-btn" onClick={onComplete}>
          START JOURNEY
        </button>
      </div>

      <style>{`
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}

const styles = {
  container: { width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' },
  narration: { fontSize: '1.1rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center' },
  phoneScreen: { width: '100%', backgroundColor: '#111', borderRadius: '16px', border: '4px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'opacity 1s ease' },
  statusBar: { backgroundColor: '#000', padding: '10px 15px', color: '#fff', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' },
  screenBody: { padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  dialogueBox: { width: '100%', backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #444', display: 'flex', gap: '1rem', alignItems: 'center' },
  spriteBox: { fontSize: '3rem', backgroundColor: '#242424', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #646cff' },
  actionArea: { textAlign: 'center', width: '100%' },
  startButton: { padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }
};