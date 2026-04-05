import { useState, useEffect } from 'react'
import './App.css'
import { loginAnonymously } from './config/firebase'
import HomeScreen from './components/HomeScreen'
import GameBoard from './components/GameBoard'
import SummaryScreen from './components/SummaryScreen' // <-- Make sure this is imported!

function App() {
  const [gameState, setGameState] = useState('idle') 
  const [currentLevel, setCurrentLevel] = useState(null)
  const [phaseAScore, setPhaseAScore] = useState(0)

  useEffect(() => {
    loginAnonymously();
  }, []);

  const startGame = (levelId) => {
    setCurrentLevel(levelId);
    setGameState('playing');
    setPhaseAScore(0); 
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