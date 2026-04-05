import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level1({ phaseAScore, onComplete }) {
  const [step, setStep] = useState('dilemma'); // 'dilemma', 'consequences', 'reflection'
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');

  // 1. Log the Phase A score as soon as this component mounts
  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 1, score: phaseAScore });
  }, [phaseAScore]);

  // The 4 choices dictated by the academic brief
  const choices = [
    { id: 'warn', text: "Warn Arjun and explain the danger of honeypots." },
    { id: 'secret', text: "Secretly disconnect his phone without telling him." },
    { id: 'learn', text: "Let him connect so he learns a hard lesson." },
    { id: 'report', text: "Find a security guard to report the network." }
  ];

  // The consequence cards mapped to the choices across 3 timepoints
  const consequences = {
    warn: [
      { time: "Immediate", text: "Arjun stops. He is annoyed you are bossing him around." },
      { time: "1 Week Later", text: "He asks you to check if his school WiFi is safe." },
      { time: "1 Month Later", text: "He helps a friend avoid a fake network at a cafe. Your guidance spread!" }
    ],
    secret: [
      { time: "Immediate", text: "Arjun is safe, but confused why his internet dropped." },
      { time: "1 Week Later", text: "He finds another free WiFi network and connects immediately." },
      { time: "1 Month Later", text: "His phone is compromised by malware because he never learned the underlying lesson." }
    ],
    learn: [
      { time: "Immediate", text: "Arjun's phone is bombarded with spam pop-ups." },
      { time: "1 Week Later", text: "His WhatsApp account gets hijacked." },
      { time: "1 Month Later", text: "He loses trust in you for not warning him when you knew the danger." }
    ],
    report: [
      { time: "Immediate", text: "The guard ignores you, saying 'I just watch the gate.'" },
      { time: "1 Week Later", text: "The fake network is still running at the station." },
      { time: "1 Month Later", text: "You realize systemic reporting requires the right channels (like a cyber cell), not just any authority figure." }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 1, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 1, reflection: reflectionText });
    onComplete(); // Send the player back to the main menu
  };

  return (
    <div style={styles.container}>
      {/* STEP 1: The Dilemma */}
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>
            You correctly identified the honeypot! But just as you disconnect, you see your 12-year-old brother, Arjun, 
            pulling out his phone. He taps the "Free_Public_WiFi" network. 
          </p>
          <p style={styles.prompt}>What do you do?</p>
          
          <div style={styles.buttonStack}>
            {choices.map(c => (
                <button key={c.id} style={styles.choiceButton} className="choice-btn" onClick={() => handleChoice(c.id)}>                   {c.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: The Consequences */}
      {step === 'consequences' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#F44336' }}>The Ripple Effect</h2>
          <div style={styles.consequenceGrid}>
            {consequences[selectedChoice].map((cons, index) => (
              <div key={index} style={styles.consequenceCard} className="consequence-card">
                <div style={styles.timeBadge}>{cons.time}</div>
                <p>{cons.text}</p>
              </div>
            ))}
          </div>
          <button style={styles.primaryButton} className="action-btn" onClick={() => setStep('reflection')}>
            Continue to Reflection
          </button>
        </div>
      )}

      {/* STEP 3: The Reflection Journal */}
      {step === 'reflection' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#4CAF50' }}>Reflection Journal</h2>
          <p style={styles.prompt}>What would YOU do in real life vs. what you chose in the game? Why?</p>
          <textarea 
            style={styles.textArea} 
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Type your justification here... (Required for the Ethics Badge)"
          />
          <button 
            style={{...styles.primaryButton, opacity: reflectionText.length > 5 ? 1 : 0.5}} 
            className="action-btn"
            disabled={reflectionText.length < 5}
            onClick={submitReflection}
            >
            Complete Level 1
          </button>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const styles = {
  container: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box' },
  card: { backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '1px solid #333', maxWidth: '600px', width: '100%', textAlign: 'left' },
  narrative: { fontSize: '1.2rem', lineHeight: '1.6', color: '#ddd', marginBottom: '1.5rem' },
  prompt: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' },
  buttonStack: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  choiceButton: { padding: '1rem', backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', transition: 'background 0.2s' },
  consequenceGrid: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
  consequenceCard: { backgroundColor: '#242424', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #646cff' },
  timeBadge: { fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', fontWeight: 'bold' },
  primaryButton: { padding: '1rem', width: '100%', backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' },
  textArea: { width: '100%', height: '150px', backgroundColor: '#242424', color: '#fff', border: '1px solid #444', borderRadius: '8px', padding: '1rem', fontSize: '1rem', marginBottom: '1.5rem', resize: 'vertical', boxSizing: 'border-box' }
};