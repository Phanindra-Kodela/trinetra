import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level4({ phaseAScore, onComplete }) {
  const [step, setStep] = useState('dilemma'); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');

  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 4, score: phaseAScore });
  }, [phaseAScore]);

  const choices = [
    { id: 'report_ig', text: "Report the video directly to Instagram/WhatsApp." },
    { id: 'counter', text: "Reply in the comments with evidence that it's fake." },
    { id: 'teacher', text: "Tell the teacher privately so they know." },
    { id: 'creator', text: "Try to track down the student who made it." },
    { id: 'escalate', text: "Involve parents and the principal immediately." }
  ];

  const consequences = {
    report_ig: [
      { time: "Immediate", text: "You submit the report. The video stays up while 'under review'." },
      { time: "1 Week Later", text: "The platform finally removes it, but it has already been downloaded by many." },
      { time: "1 Month Later", text: "You realize platform reporting is necessary, but often too slow for fast-moving local rumors." }
    ],
    counter: [
      { time: "Immediate", text: "You post your scanner evidence. Trolls start arguing with you." },
      { time: "1 Week Later", text: "The Streisand Effect: Your comments boosted the algorithm! Now even more people have seen the video." },
      { time: "1 Month Later", text: "You learn that directly engaging with malicious content often amplifies it instead of stopping it." }
    ],
    teacher: [
      { time: "Immediate", text: "The teacher is devastated and highly stressed." },
      { time: "1 Week Later", text: "The teacher takes a leave of absence to deal with the mental health impact." },
      { time: "1 Month Later", text: "The teacher returns with support from the Cyber Cell. Warning them gave them time to prepare legally." }
    ],
    creator: [
      { time: "Immediate", text: "You confront a suspect. They threaten to make a deepfake of YOU next." },
      { time: "1 Week Later", text: "Vicious rumors about you start spreading online." },
      { time: "1 Month Later", text: "You realize digital vigilantism puts you in direct danger. This was a job for authorities." }
    ],
    escalate: [
      { time: "Immediate", text: "The principal calls an emergency assembly and contacts the IT cell." },
      { time: "1 Week Later", text: "The cyber police trace the IP. The creator faces serious legal consequences under the IT Act." },
      { time: "1 Month Later", text: "The school establishes a strict digital media policy. Systemic action solved a systemic problem." }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 4, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 4, reflection: reflectionText });
    onComplete(); 
  };

  return (
    <div style={styles.container}>
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>
            You successfully used your forensics skills to prove the viral video of your teacher is a deepfake. 
            However, most students in the school still believe it's real, and it is spreading rapidly on Instagram and WhatsApp.
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
            Complete Level 4
          </button>
        </div>
      )}
    </div>
  );
}

// Same standard styles used across all Phase B components
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