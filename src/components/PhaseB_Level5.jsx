import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level5({ phaseAScore, onComplete }) {
  const [step, setStep] = useState('dilemma'); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');

  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 5, score: phaseAScore });
  }, [phaseAScore]);

  const choices = [
    { id: 'tell_parent', text: "Tell your parent privately and let them handle it." },
    { id: 'anonymous', text: "File an anonymous complaint on the UIDAI/Data Protection portal." },
    { id: 'journalist', text: "Send the evidence anonymously to an investigative journalist." },
    { id: 'confront', text: "Confront the colleague directly to make them stop." },
    { id: 'ignore', text: "Do nothing. It's too risky for your family." }
  ];

  const consequences = {
    tell_parent: [
      { time: "Immediate", text: "Your parent is shocked, but tells you to stay out of it to protect their job." },
      { time: "1 Week Later", text: "The colleague is quietly transferred to another department. No police are involved." },
      { time: "1 Month Later", text: "You realize the data selling continues elsewhere. Protecting loyalty suppressed justice." }
    ],
    anonymous: [
      { time: "Immediate", text: "You submit the logs via a VPN. It feels terrifying but right." },
      { time: "1 Week Later", text: "A quiet internal audit begins at your parent's company." },
      { time: "1 Month Later", text: "The colleague is arrested. Your parent's job is safe because the tip was truly anonymous. Systemic channels worked." }
    ],
    journalist: [
      { time: "Immediate", text: "You send an encrypted email. A massive news story drops the next day." },
      { time: "1 Week Later", text: "Extreme fallout. The company is raided, and your parent is temporarily suspended during the investigation." },
      { time: "1 Month Later", text: "The leak is plugged, but your family suffered severe collateral damage. Justice was served, but at a high cost." }
    ],
    confront: [
      { time: "Immediate", text: "The colleague laughs it off, but immediately goes to their computer." },
      { time: "1 Week Later", text: "They delete all local evidence and change their encryption keys." },
      { time: "1 Month Later", text: "They continue selling data, but now they are untraceable. Vigilantism tipped them off." }
    ],
    ignore: [
      { time: "Immediate", text: "You stay quiet. Your family life remains peaceful." },
      { time: "1 Week Later", text: "Thousands of citizens have their bank accounts drained via identity theft." },
      { time: "1 Month Later", text: "Your own grandparent gets scammed using data bought from that exact leak. Inaction has a price." }
    ]
  };

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 5, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 5, reflection: reflectionText });
    logGameEvent('game_completed', { status: 'success' }); // Log that the whole game is done!
    onComplete(); 
  };

  return (
    <div style={styles.container}>
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>
            While using your parent's home office computer, you stumble across an open folder. You realize your parent's close colleague is illegally selling a database of Aadhaar-linked citizen data to aggressive telemarketers and scammers.
            <br/><br/>
            Reporting this could destroy the colleague's life and potentially put your parent's job at risk.
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
            Finish Trinetra 2.0
          </button>
        </div>
      )}
    </div>
  );
}

// Standard Styles
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