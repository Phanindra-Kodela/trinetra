import { useState, useEffect } from 'react';

export default function Cutscene_Level2({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // The Cinematic Timing Sequence (in milliseconds)
    const sequence = [
      { time: 2000, action: () => setMessages(m => [...m, { id: 1, text: "😂😂😂", sender: "Rahul" }]) },
      { time: 3000, action: () => setMessages(m => [...m, { id: 2, text: "Forward this!", sender: "Amit" }]) },
      { time: 4500, action: () => setMessages(m => [...m, { id: 3, isImage: true, text: "[ BLURRED PHOTO ]", sender: "Rahul" }]) },
      { time: 5500, action: () => setMessages(m => [...m, { id: 4, text: "OMG look at Priya!", sender: "Neha" }]) },
      { time: 6000, action: () => setMessages(m => [...m, { id: 5, text: "Send to others!", sender: "Amit" }]) },
      { time: 8000, action: () => setShowDialogue(true) },
      { time: 10000, action: () => setShowButton(true) }
    ];

    const timeouts = sequence.map(step => setTimeout(step.action, step.time));
    return () => timeouts.forEach(clearTimeout); // Cleanup if the player skips
  }, []);

  return (
    <div style={styles.container}>
      {/* NARRATION HEADER */}
      <p style={styles.narration}>
        "Lunch break had just started when Veda’s phone began buzzing nonstop…"
      </p>

      {/* FAKE WHATSAPP UI */}
      <div style={styles.phoneScreen}>
        <div style={styles.chatHeader}>Class X Group (45 members)</div>
        
        <div style={styles.chatBody}>
          {messages.map(msg => (
            <div key={msg.id} style={styles.messageBubble} className="game-card">
              <span style={styles.sender}>{msg.sender}</span>
              {msg.isImage ? (
                <div style={styles.imagePlaceholder}>{msg.text}</div>
              ) : (
                <p style={{ margin: '5px 0 0 0' }}>{msg.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* VEDA'S DIALOGUE */}
      <div style={{ ...styles.dialogueBox, opacity: showDialogue ? 1 : 0, transition: 'opacity 1s ease' }}>
        <div style={styles.spriteBox}>🕵️‍♀️</div>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#646cff', margin: '0 0 5px 0' }}>Veda</h3>
          <p style={{ margin: 0, fontStyle: 'italic', color: '#ddd' }}>
            "This… this is Priya’s photo… who shared this? This is wrong… and it’s spreading fast…"
          </p>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div style={{ ...styles.actionArea, opacity: showButton ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <h3 style={{ color: '#F44336', letterSpacing: '1px' }}>STOP THE SPREAD BEFORE IT GOES VIRAL</h3>
        <button style={styles.startButton} className="action-btn" onClick={onComplete}>
          START UPLINK
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' },
  narration: { fontSize: '1.1rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center' },
  phoneScreen: { width: '100%', height: '350px', backgroundColor: '#0b141a', borderRadius: '16px', border: '8px solid #222', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  chatHeader: { backgroundColor: '#202c33', padding: '1rem', color: '#fff', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #333' },
  chatBody: { flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto' },
  messageBubble: { backgroundColor: '#202c33', padding: '0.8rem', borderRadius: '8px', maxWidth: '80%', alignSelf: 'flex-start', borderLeft: '4px solid #1cd153' },
  sender: { fontSize: '0.8rem', color: '#1cd153', fontWeight: 'bold' },
  imagePlaceholder: { width: '200px', height: '120px', backgroundColor: '#333', marginTop: '5px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4444', fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center', filter: 'blur(1px)' },
  dialogueBox: { width: '100%', backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #444', display: 'flex', gap: '1rem', alignItems: 'center' },
  spriteBox: { fontSize: '3rem', backgroundColor: '#242424', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #646cff' },
  actionArea: { textAlign: 'center', width: '100%' },
  startButton: { padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#F44336', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }
};