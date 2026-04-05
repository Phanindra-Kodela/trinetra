import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level3({ phaseAScore, onComplete }) {
  const [step, setStep] = useState('dilemma'); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');

  // Log the Phase A score
  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 3, score: phaseAScore });
  }, [phaseAScore]);

  // The 5 choices dictated by the academic brief
  const choices = [
    { id: 'return_blind', text: "Return the notebook to the lost & found without looking." },
    { id: 'erase', text: "Cross out the UPI PIN with a pen, then return it." },
    { id: 'contact', text: "Find the senior and tell them directly about the security risk." },
    { id: 'photo', text: "Take a photo of the page to show the teacher as proof." },
    { id: 'ignore', text: "Leave the notebook exactly where you found it." }
  ];

  // The consequence cards mapped to the choices
  const consequences = {
    return_blind: [
      { time: "Immediate", text: "You drop it at the office. You feel good about being honest." },
      { time: "1 Week Later", text: "The senior gets it back, but doesn't realize their PIN was exposed." },
      { time: "1 Month Later", text: "They lose their notebook again. Because they didn't learn to hide their PIN, their account is compromised." }
    ],
    erase: [
      { time: "Immediate", text: "You permanently scribble out the PIN, protecting their money." },
      { time: "1 Week Later", text: "The senior is furious that someone 'vandalized' their notes." },
      { time: "1 Month Later", text: "You realize taking unilateral action without communication can cause misunderstandings." }
    ],
    contact: [
      { time: "Immediate", text: "The senior is initially embarrassed, but thanks you profusely." },
      { time: "1 Week Later", text: "They change their PIN and start using a secure password manager app." },
      { time: "1 Month Later", text: "They help you study for a difficult exam to repay the favor. Direct communication built trust!" }
    ],
    photo: [
      { time: "Immediate", text: "You have proof! But now, a highly sensitive UPI PIN is sitting in your phone's camera roll." },
      { time: "1 Week Later", text: "The teacher handles it, but reprimands you for creating a digital copy of financial data." },
      { time: "1 Month Later", text: "Your phone auto-backs up the photo to the cloud, creating a permanent, unnecessary security risk." }
    ],
    ignore: [
      { time: "Immediate", text: "You walk away. It's not your problem." },
      { time: "1 Week Later", text: "A dishonest student finds the notebook and copies the details." },
      { time: "1 Month Later", text: "The senior's bank account is drained. You realize that doing nothing is still a choice with consequences." }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 3, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 3, reflection: reflectionText });
    onComplete(); 
  };

  return (
    <div style={styles.container}>
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>
            You successfully matched the UPI threats and defenses! Right after, you sit at a desk in the school library and find a notebook left behind by a senior. 
            <br/><br/>
            Flipping it open to see who it belongs to, you discover a page titled "Important Passwords" with their 6-digit UPI PIN written in plain text.
          </p>
          <p style={styles.prompt}>What do you do?</p>
          
          <div style={styles.buttonStack}>
            {choices.map(c => (
              <button key={c.id} style={styles.choiceButton} className="choice-btn" onClick={() => handleChoice(c.id)}>
                {c.text}
              </button>
            ))}
          </div>
        </div>
      )}

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
            Complete Level 3
          </button>
        </div>
      )}
    </div>
  );
}

// Reusing the exact same styles as Levels 1 & 2
const styles = {
  container: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box' },
  card: { backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '1px solid #333', maxWidth: '600px', width: '100%', textAlign: 'left' },
  narrative: { fontSize: '1.2rem', lineHeight: '1.6', color: '#ddd', marginBottom: '1.5rem' },
  prompt: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' },
  buttonStack: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  choiceButton: { padding: '1rem', backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' },
  consequenceGrid: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
  consequenceCard: { backgroundColor: '#242424', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #646cff' },
  timeBadge: { fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', fontWeight: 'bold' },
  primaryButton: { padding: '1rem', width: '100%', backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' },
  textArea: { width: '100%', height: '150px', backgroundColor: '#242424', color: '#fff', border: '1px solid #444', borderRadius: '8px', padding: '1rem', fontSize: '1rem', marginBottom: '1.5rem', resize: 'vertical', boxSizing: 'border-box' }
};