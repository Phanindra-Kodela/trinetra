import { useState, useEffect } from 'react';
import { logGameEvent } from '../config/telemetry';

export default function PhaseB_Level2({ phaseAScore, onComplete }) {
  // Expanded State Machine
  const [step, setStep] = useState('dilemma'); // dilemma -> consequences -> reflection -> unmasked -> quiz -> reward
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [reflectionText, setReflectionText] = useState('');
  
  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    logGameEvent('phaseA_completed', { level: 2, score: phaseAScore });
  }, [phaseAScore]);

  // --- EXISTING PHASE B DATA ---
  const choices = [
    { id: 'ask_delete', text: "Ask Rahul in the group to delete it." },
    { id: 'report', text: "Report the incident to your class teacher." },
    { id: 'message_priya', text: "Message Priya privately to let her know." },
    { id: 'evidence', text: "Take a screenshot to save as evidence." },
    { id: 'nothing', text: "Do nothing and ignore the chat." }
  ];

  const consequences = {
    ask_delete: [ { time: "Immediate", text: "Rahul calls you a buzzkill, but deletes the message." }, { time: "1 Week Later", text: "The photo is gone from the main chat, but a few kids already saved it." }, { time: "1 Month Later", text: "Priya finds out what you did and thanks you for standing up for her." } ],
    report: [ { time: "Immediate", text: "The teacher immediately shuts down the group chat." }, { time: "1 Week Later", text: "Students are angry at the 'snitch' who got the chat deleted." }, { time: "1 Month Later", text: "The school institutes a strict, clear cyberbullying policy because of the incident." } ],
    message_priya: [ { time: "Immediate", text: "Priya is incredibly embarrassed but grateful you warned her." }, { time: "1 Week Later", text: "Priya pretends to be sick to avoid coming to school." }, { time: "1 Month Later", text: "Priya talks to the school counselor and decides to switch friend groups." } ],
    evidence: [ { time: "Immediate", text: "You take a screenshot. Now the photo is on your phone too." }, { time: "1 Week Later", text: "You show the principal, but get a warning yourself for possessing the photo." }, { time: "1 Month Later", text: "Rahul gets suspended, but you realize the risk of hoarding sensitive data." } ],
    nothing: [ { time: "Immediate", text: "The chat laughs. The image view count keeps exploding." }, { time: "1 Week Later", text: "The photo becomes a meme across the entire school." }, { time: "1 Month Later", text: "Priya deletes all her social media profiles and completely isolates herself." } ]
  };

  // --- NEW QUIZ DATA ---
  const quizQuestions = [
    { q: "Is sharing someone's photo without permission okay?", options: ["Yes, if it's funny", "No, it violates consent"], correct: 1 },
    { q: "If 3 people share a photo to 3 more people each...", options: ["It stops eventually", "It spreads exponentially fast"], correct: 1 },
    { q: "What should a responsible bystander do?", options: ["Ignore it", "Act to protect the victim"], correct: 1 },
    { q: "Why is messaging Priya privately a good choice?", options: ["To laugh about it", "To show empathy and support"], correct: 1 },
    { q: "Does ignoring the problem help the victim?", options: ["No, passive harm is still harm", "Yes, it goes away naturally"], correct: 0 }
  ];

  // --- HANDLERS ---
  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    setStep('consequences');
    logGameEvent('phaseB_choice_made', { level: 2, choice: choiceId });
  };

  const submitReflection = () => {
    logGameEvent('phaseB_reflection_submitted', { level: 2, reflection: reflectionText });
    setStep('unmasked'); // Transition to the new cinematic ending instead of exiting!
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

  // --- RANK CALCULATION ---
  const getRank = () => {
    const totalScore = phaseAScore + (quizScore * 20); // Combine Arcade score + Quiz score
    if (totalScore > 150) return { title: "🏆 Viral Guardian", color: "#FFD700" };
    if (totalScore > 100) return { title: "🛡️ Digital Protector", color: "#4CAF50" };
    if (totalScore > 50) return { title: "📘 Learner", color: "#2196F3" };
    return { title: "⚠️ Needs Awareness", color: "#F44336" };
  };

  return (
    <div style={styles.container}>
      
      {/* 1. THE DILEMMA */}
      {step === 'dilemma' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#646cff' }}>Phase B: The Dilemma</h2>
          <p style={styles.narrative}>"Priya left the group…" <br/><br/>She saw the photo. The damage is done, but the fallout is just beginning.</p>
          <p style={styles.prompt}>What should Veda do now?</p>
          <div style={styles.buttonStack}>
            {choices.map(c => <button key={c.id} style={styles.choiceButton} className="choice-btn" onClick={() => handleChoice(c.id)}>{c.text}</button>)}
          </div>
        </div>
      )}

      {/* 2. THE CONSEQUENCES */}
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

      {/* 3. THE REFLECTION */}
      {step === 'reflection' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#4CAF50' }}>Reflection Journal</h2>
          <p style={styles.prompt}>What would YOU do in real life vs. what you chose in the game? Why?</p>
          <textarea style={styles.textArea} value={reflectionText} onChange={(e) => setReflectionText(e.target.value)} placeholder="Type your justification here..." />
          <button style={{...styles.primaryButton, opacity: reflectionText.length > 5 ? 1 : 0.5}} className="action-btn" disabled={reflectionText.length < 5} onClick={submitReflection}>Submit Investigation</button>
        </div>
      )}

      {/* 4. ETHICS UNMASKED (LESSON SCREEN) */}
      {step === 'unmasked' && (
        <div style={styles.card} className="game-card">
          <h1 style={{ color: '#646cff', textAlign: 'center' }}>ETHICS UNMASKED</h1>
          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>What Really Happened?</h3>
          <ul style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.1rem' }}>
            <li>The photo was shared <strong>without consent</strong>.</li>
            <li>The spread happened exponentially fast, hurting real people.</li>
            <li>Many bystanders watched, but few intervened.</li>
          </ul>
          
          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '20px' }}>Core Concepts</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={styles.tag}>📌 Digital Consent</span>
            <span style={styles.tag}>📌 Bystander Responsibility</span>
            <span style={styles.tag}>❤️ Empathy & Respect</span>
          </div>
          <button style={styles.primaryButton} className="action-btn" onClick={() => setStep('quiz')}>Start Quick Check</button>
        </div>
      )}

      {/* 5. QUICK CHECK QUIZ */}
      {step === 'quiz' && (
        <div style={styles.card} className="game-card">
          <h2 style={{ color: '#FF9800', textAlign: 'center' }}>Quick Check ({quizIndex + 1}/5)</h2>
          <p style={{ ...styles.narrative, textAlign: 'center', margin: '2rem 0', fontSize: '1.4rem' }}>
            {quizQuestions[quizIndex].q}
          </p>
          <div style={styles.buttonStack}>
            {quizQuestions[quizIndex].options.map((opt, idx) => (
              <button key={idx} style={styles.choiceButton} className="choice-btn" onClick={() => handleQuizAnswer(idx)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. REWARD SCREEN */}
      {step === 'reward' && (
        <div style={{...styles.card, textAlign: 'center'}} className="game-card">
          <h2 style={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px' }}>Level 2 Complete</h2>
          <h1 style={{ fontSize: '3rem', color: getRank().color, margin: '10px 0' }}>{getRank().title}</h1>
          
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '8px', margin: '2rem 0' }}>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Viral Defense Score: <strong style={{color: '#FFD700'}}>{phaseAScore}</strong></p>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Ethics Quiz Score: <strong style={{color: '#4CAF50'}}>{quizScore}/5</strong></p>
          </div>

          <p style={{ fontStyle: 'italic', color: '#aaa', marginBottom: '2rem' }}>
            "Veda learned that one click can spread harm… but one brave action can stop it."
          </p>

          <button style={styles.primaryButton} className="action-btn" onClick={onComplete}>Return to Menu</button>
        </div>
      )}

    </div>
  );
}

// --- STYLES ---
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