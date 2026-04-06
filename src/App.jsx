import { useState, useEffect } from 'react'
import './App.css'
import { loginAnonymously } from './config/firebase'
import HomeScreen from './components/HomeScreen'
import GameBoard from './components/GameBoard'
import SummaryScreen from './components/SummaryScreen'
import Cutscene_Level2 from './components/Cutscene_Level2';
import Cutscene_Level1 from './components/Cutscene_Level1';

function App() {
  const [gameState, setGameState] = useState('idle') 
  const [currentLevel, setCurrentLevel] = useState(null)
  const [phaseAScore, setPhaseAScore] = useState(0)

  useEffect(() => {
    loginAnonymously();
  }, []);

  const startGame = (levelId) => {
    setCurrentLevel(levelId);
    setPhaseAScore(0); 
    
    if (levelId === 1 || levelId === 2) {
      setGameState('cutscene');
    } else {
      setGameState('playing');
    }
  }

  const resetGame = () => {
    setGameState('idle');
    setCurrentLevel(null);
    setPhaseAScore(0);
  }

  return (
    <div className="app-container">
      <main className="game-main">
        
        {/* 1. Only show Home Screen when idle */}
        {gameState === 'idle' && (
          <HomeScreen onSelectLevel={startGame} />
        )}
        {gameState === 'cutscene' && currentLevel === 1 && (
          <Cutscene_Level1 onComplete={() => setGameState('playing')} />
        )}
        {gameState === 'cutscene' && currentLevel === 2 && (
          <Cutscene_Level2 onComplete={() => setGameState('playing')} />
        )}

        {/* 2. Only show Game Board during gameplay phases */}
        {(gameState === 'playing' || gameState === 'phaseB') && (  
          <GameBoard 
            gameState={gameState} 
            setGameState={setGameState} 
            level={currentLevel}
            phaseAScore={phaseAScore}
            setPhaseAScore={setPhaseAScore}
          />
        )}

        {/* 3. Only show Summary Screen at the end */}
        {gameState === 'summary' && (
          <SummaryScreen onRestart={resetGame} />
        )}

      </main>
    </div>
  )
}

export default App