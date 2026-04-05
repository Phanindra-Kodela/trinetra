import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level2({ phaseAScore, onComplete }) {
  const [step, setStep] = useState('dilemma'); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');

  // Log the Phase A score
  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 2, score: phaseAScore });
  }, [phaseAScore]);

  // The 5 choices dictated by the academic brief
  const choices = [
    { id: 'ask_delete', text: "Ask Rahul in the group to delete it." },
    { id: 'report', text: "Report the incident to your class teacher." },
    { id: 'message_priya', text: "Message Priya privately to let her know." },
    { id: 'evidence', text: "Take a screenshot to save as evidence." },
    { id: 'nothing', text: "Do nothing and ignore the chat." }
  ];

  // The consequence cards mapped to the choices
  const consequences = {
    ask_delete: [
      { time: "Immediate", text: "Rahul calls you a buzzkill, but deletes the message." },
      { time: "1 Week Later", text: "The photo is gone from the main chat, but a few kids already saved it." },
      { time: "1 Month Later", text: "Priya finds out what you did and thanks you for standing up for her." }
    ],
    report: [
      { time: "Immediate", text: "The teacher immediately shuts down the group chat." },
      { time: "1 Week Later", text: "Students are angry at the 'snitch' who got the chat deleted." },
      { time: "1 Month Later", text: "The school institutes a strict, clear cyberbullying policy because of the incident." }
    ],
    message_priya: [
      { time: "Immediate", text: "Priya is incredibly embarrassed but grateful you warned her." },
      { time: "1 Week Later", text: "Priya pretends to be sick to avoid coming to school." },
      { time: "1 Month Later", text: "Priya talks to the school counselor and decides to switch friend groups." }
    ],
    evidence: [
      { time: "Immediate", text: "You take a screenshot. Now the photo is on your phone too." },
      { time: "1 Week Later", text: "You show the principal, but get a warning yourself for possessing the photo." },
      { time: "1 Month Later", text: "Rahul gets suspended, but you realize the risk of hoarding sensitive data." }
    ],
    nothing: [
      { time: "Immediate", text: "The chat laughs. The image view count keeps exploding." },
      { time: "1 Week Later", text: "The photo becomes a meme across the entire school." },
      { time: "1 Month Later", text: "Priya deletes all her social media profiles and completely isolates herself." }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 2, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 2, reflection: reflectionText });
    onComplete(); 
  };

  return (
    <div style={styles.container}>
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>
            You calculated how fast the photo is spreading. It's an embarrassing picture of your classmate, Priya, taken without her consent. People in the chat are laughing and making jokes.
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
            Complete Level 2
          </button>
        </div>
      )}
    </div>
  );
}

// Reuse the exact same styles as Level 1
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