import PhaserGame from './PhaserGame';
import PhaseB_Level1 from './PhaseB_Level1';
import PhaseB_Level2 from './PhaseB_Level2';
import Level1Scene from '../game/Level1Scene';
import Level2Scene from '../game/Level2Scene'; // Import the new scene
import Level3Scene from '../game/Level3Scene';
import PhaseB_Level3 from './PhaseB_Level3';
import Level4Scene from '../game/Level4Scene';
import PhaseB_Level4 from './PhaseB_Level4';
import Level5Scene from '../game/Level5Scene';
import PhaseB_Level5 from './PhaseB_Level5';

export default function GameBoard({ gameState, setGameState, level, setPhaseAScore, phaseAScore }) {
  
  const handlePhaseAComplete = (result) => {
    setPhaseAScore(result.score); 
    setGameState('phaseB');       
  };

  const handleLevelComplete = () => {
    if (level === 5) {
      // If they beat the final level, show the summary!
      setGameState('summary'); 
    } else {
      // Otherwise, return to the level selector
      setGameState('idle'); 
    }
  };

  // Logic to pick the right Phaser Scene
  const getActiveScene = () => {
    if (level === 1) return Level1Scene;
    if (level === 2) return Level2Scene;
    if (level === 3) return Level3Scene;
    if (level === 4) return Level4Scene;
    if (level === 5) return Level5Scene;
    return Level1Scene; 
  };

  return (
    <div style={boardContainerStyle}>
      {/* PHASE A: Dynamic Phaser Canvas */}
      {gameState === 'playing' && (
        <PhaserGame scene={getActiveScene()} onComplete={handlePhaseAComplete} />
      )}

      {/* PHASE B: Dynamic React Components */}
      {gameState === 'phaseB' && level === 1 && (
        <PhaseB_Level1 phaseAScore={phaseAScore} onComplete={handleLevelComplete} />
      )}
      
      {gameState === 'phaseB' && level === 2 && (
        <PhaseB_Level2 phaseAScore={phaseAScore} onComplete={handleLevelComplete} />
      )}

      {gameState === 'phaseB' && level === 3 && (
        <PhaseB_Level3 phaseAScore={phaseAScore} onComplete={handleLevelComplete} />
      )}

      {/* Remove the old Level 3 placeholder if you haven't already! */}
      {gameState === 'phaseB' && level === 4 && (
        <PhaseB_Level4 phaseAScore={phaseAScore} onComplete={handleLevelComplete} />
      )}
      
      {gameState === 'phaseB' && level === 5 && (
        <PhaseB_Level5 phaseAScore={phaseAScore} onComplete={handleLevelComplete} />
      )}
    </div>
  )
}

const boardContainerStyle = {
  width: '100%', maxWidth: '800px', minHeight: '600px',
  position: 'relative', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden'
}