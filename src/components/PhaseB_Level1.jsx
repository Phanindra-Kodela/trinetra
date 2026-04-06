import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level1({ phaseAScore, onComplete }) {
  const [step, setStep] = useState('dilemma'); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');
  
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 1, score: phaseAScore });
  }, [phaseAScore]);

  const choices = [
    { id: 'warn', text: "Warn Arjun and explain the danger of honeypots." },
    { id: 'secret', text: "Secretly disconnect his phone without telling him." },
    { id: 'lesson', text: "Let him connect so he learns a hard lesson." },
    { id: 'report', text: "Find a security guard to report the network." }
  ];

  const consequences = {
    warn: [ { time: "Immediate", text: "Arjun listens and stops." }, { time: "1 Week Later", text: "He checks network names more carefully." }, { time: "1 Month Later", text: "He teaches another friend to stay safe." } ],
    secret: [ { time: "Immediate", text: "He is confused about why his internet dropped." }, { time: "1 Week Later", text: "He still does not understand the danger." }, { time: "1 Month Later", text: "He makes the same mistake again and his data is compromised." } ],
    lesson: [ { time: "Immediate", text: "He connects to the risky network." }, { time: "1 Week Later", text: "His social media accounts are hacked." }, { time: "1 Month Later", text: "He remembers the mistake, but the cost was entirely avoidable." } ],
    report: [ { time: "Immediate", text: "Staff are alerted and investigate." }, { time: "1 Week Later", text: "The fake hotspot is permanently removed." }, { time: "1 Month Later", text: "More people stay safe, but Arjun still needed a direct warning from you." } ]
  };

  const quizQuestions = [
    { q: "Is every 'Free WiFi' safe to use?", options: ["Yes", "No"], correct: 1 },
    { q: "What should Veda do before connecting to a public network?", options: ["Connect immediately", "Verify the network first"], correct: 1 },
    { q: "What happened when Veda used the unsafe free WiFi?", options: ["She gained extra coins", "She lost coins (Data leak)"], correct: 1 },
    { q: "Why did the cafe WiFi stop working?", options: ["It only works inside the cafe's area", "The internet broke"], correct: 0 },
    { q: "What is the best first step if Arjun is about to join suspicious WiFi?", options: ["Ignore him", "Warn and explain"], correct: 1 }
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 1, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 1, reflection: reflectionText });
    setStep('unmasked'); 
  };

  const handleQuizAnswer = (selectedIndex) => {
    if (selectedIndex === quizQuestions[quizIndex].correct) {
      setQuizScore(s => s + 1);
    }
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setStep('reward');
    }
  };

  const getRank = () => {
    const totalScore = phaseAScore + (quizScore * 20); 
    if (totalScore > 140) return { title: "🏆 Safe WiFi Explorer", color: "#FFD700" };
    if (totalScore > 100) return { title: "🛡️ Digital Guide", color: "#4CAF50" };
    return { title: "⚠️ Needs Awareness", color: "#F44336" };
  };

  return (
    <div style={styles.container}>
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>You safely connected! But just as you finish, your 12-year-old brother, Arjun, pulls out his phone. <br/><br/>"Akka, I found free WiFi too!" he says, tapping a network named <strong>FreeNet_Instant</strong>.</p>
          <p style={styles.prompt}>What should Veda do?</p>
          <div style={styles.buttonStack}>
            {choices.map(c => <button key={c.id} style={styles.choiceButton} className="choice-btn" onClick={() => handleChoice(c.id)}>{c.text}</button>)}
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
          <button style={styles.primaryButton} className="action-btn" onClick={() => setStep('reflection')}>Continue to Reflection</button>
        </div>
      )}

      {step === 'reflection' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#4CAF50' }}>Reflection Journal</h2>
          <p style={styles.prompt}>Why is it important to protect others online, not just yourself?</p>
          <textarea style={styles.textArea} value={reflectionText} onChange={(e) => setReflectionText(e.target.value)} placeholder="Type your justification here..." />
          <button style={{...styles.primaryButton, opacity: reflectionText.length > 5 ? 1 : 0.5}} className="action-btn" disabled={reflectionText.length < 5} onClick={submitReflection}>Submit Investigation</button>
        </div>
      )}

      {step === 'unmasked' && (
        <div style={styles.card} className="game-card">
          <h1 style={{ color: '#646cff', textAlign: 'center' }}>ETHICS UNMASKED</h1>
          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>What Veda Learned:</h3>
          <ul style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.1rem' }}>
            <li>Some WiFi (like the Cafe) works <strong>only in one location</strong>.</li>
            <li>Unsafe "Free WiFi" can be a trap to steal data (like your coins).</li>
            <li>Trusted networks should always be verified before connecting.</li>
          </ul>
          
          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '20px' }}>Core Concepts</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={styles.tag}>📌 Verification</span>
            <span style={styles.tag}>📌 Honeypot Networks</span>
            <span style={styles.tag}>❤️ Digital Mentorship</span>
          </div>
          <button style={styles.primaryButton} className="action-btn" onClick={() => setStep('quiz')}>Start Quick Check</button>
        </div>
      )}

      {step === 'quiz' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#FF9800', textAlign: 'center' }}>Quick Check ({quizIndex + 1}/5)</h2>
          <p style={{ ...styles.narrative, textAlign: 'center', margin: '2rem 0', fontSize: '1.4rem' }}>{quizQuestions[quizIndex].q}</p>
          <div style={styles.buttonStack}>
            {quizQuestions[quizIndex].options.map((opt, idx) => (
              <button key={idx} style={styles.choiceButton} className="choice-btn" onClick={() => handleQuizAnswer(idx)}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {step === 'reward' && (
        <div style={{...styles.card, textAlign: 'center'}} className="game-card">
          <h2 style={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px' }}>Level 1 Complete</h2>
          <h1 style={{ fontSize: '3rem', color: getRank().color, margin: '10px 0' }}>{getRank().title}</h1>
          
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '8px', margin: '2rem 0' }}>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Coins Retained: <strong style={{color: '#FFD700'}}>{phaseAScore}</strong></p>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Ethics Quiz Score: <strong style={{color: '#4CAF50'}}>{quizScore}/5</strong></p>
          </div>

          <p style={{ fontStyle: 'italic', color: '#aaa', marginBottom: '2rem' }}>"Veda found the right path, avoided unsafe WiFi, and learned how to protect others too."</p>

          <button style={styles.primaryButton} className="action-btn" onClick={onComplete}>Return to Menu</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box' },
  card: { backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333', maxWidth: '650px', width: '100%', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  narrative: { fontSize: '1.2rem', lineHeight: '1.6', color: '#ddd', marginBottom: '1.5rem' },
  prompt: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' },
  buttonStack: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  choiceButton: { padding: '1rem', backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '1.1rem' },
  consequenceGrid: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
  consequenceCard: { backgroundColor: '#242424', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #646cff' },
  timeBadge: { fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', fontWeight: 'bold' },
  primaryButton: { padding: '1rem', width: '100%', backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' },
  textArea: { width: '100%', height: '120px', backgroundColor: '#242424', color: '#fff', border: '1px solid #444', borderRadius: '8px', padding: '1rem', fontSize: '1rem', marginBottom: '1.5rem', resize: 'vertical' },
  tag: { backgroundColor: '#2a2a2a', padding: '8px 12px', borderRadius: '20px', fontSize: '0.9rem', color: '#4CAF50', border: '1px solid #333' }
};