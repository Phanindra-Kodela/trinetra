import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Accept the specific Scene class as a prop
export default function PhaserGame({ scene, onComplete }) {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: 800,
      height: 600,
      scene: [scene], // Load the dynamic scene here!
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);

    const handleGameEnd = (event) => onComplete(event.detail);
    document.addEventListener('phaseA_complete', handleGameEnd);

    return () => {
      document.removeEventListener('phaseA_complete', handleGameEnd);
      if (gameRef.current) gameRef.current.destroy(true);
    };
  }, [scene, onComplete]); // Re-run if the scene changes

  return <div id="phaser-container" style={{ width: '100%', height: '100%' }} />;
}