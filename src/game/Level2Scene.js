import Phaser from 'phaser';

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super('Level2Scene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b141a'); // Dark network vibe

    // --- GAME VARIABLES ---
    this.energy = 100;
    this.coins = 0;
    this.combo = 0;
    this.viralRisk = 0;
    this.timeLeft = 30;
    this.isGameOver = false;

    // --- HUD (Heads Up Display) ---
    this.add.rectangle(400, 30, 800, 60, 0x202c33);
    this.timerText = this.add.text(20, 20, `Time: ${this.timeLeft}s`, { fontSize: '20px', fill: '#fff', fontStyle: 'bold' });
    this.scoreText = this.add.text(150, 20, `Coins: 0 | Combo: x0`, { fontSize: '20px', fill: '#FFD700', fontStyle: 'bold' });
    this.riskText = this.add.text(600, 20, `Risk: 0%`, { fontSize: '20px', fill: '#4CAF50', fontStyle: 'bold' });

    // --- NETWORK GRAPH SETUP ---
    this.nodes = [];
    this.activeConnections = []; // Tracks the red lines we need to cut
    this.graphics = this.add.graphics(); // Used to draw the connection lines
    
    // Generate 50 random nodes scattered around the screen
    for (let i = 0; i < 50; i++) {
      let x = Phaser.Math.Between(50, 750);
      let y = Phaser.Math.Between(100, 550);
      let circle = this.add.circle(x, y, 8, 0x555555); // Default gray (idle)
      this.nodes.push({ id: i, x: x, y: y, circle: circle, state: 'idle', timer: 0 });
    }

    // --- THE SWIPE TO CUT MECHANIC ---
    // We draw a trail following the pointer. If the trail crosses a red line, it cuts it!
    this.swipeTrail = this.add.graphics();
    
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown || this.isGameOver) return;

      // Draw the swipe visual
      this.swipeTrail.clear();
      this.swipeTrail.lineStyle(4, 0x646cff, 1);
      this.swipeTrail.beginPath();
      this.swipeTrail.moveTo(pointer.prevPosition.x, pointer.prevPosition.y);
      this.swipeTrail.lineTo(pointer.x, pointer.y);
      this.swipeTrail.strokePath();

      // Create a mathematical line for the swipe
      let swipeLine = new Phaser.Geom.Line(pointer.prevPosition.x, pointer.prevPosition.y, pointer.x, pointer.y);

      // Check if the swipe intersects any active red lines
      for (let i = this.activeConnections.length - 1; i >= 0; i--) {
        let conn = this.activeConnections[i];
        let connLine = new Phaser.Geom.Line(conn.source.x, conn.source.y, conn.target.x, conn.target.y);
        
        if (Phaser.Geom.Intersects.LineToLine(swipeLine, connLine)) {
          this.cutConnection(conn, i);
        }
      }

      // Fade out the swipe trail quickly
      this.time.delayedCall(50, () => this.swipeTrail.clear());
    });

    // --- START THE VIRAL OUTBREAK ---
    // Make the center node the "Patient Zero" (Priya's Photo)
    let centerNode = this.nodes[0];
    centerNode.x = 400; centerNode.y = 300;
    centerNode.circle.setPosition(400, 300);
    this.infectNode(centerNode);

    // Main Game Loop Timer (Ticks every 1 second)
    this.time.addEvent({ delay: 1000, callback: this.gameTick, callbackScope: this, loop: true });
  }

  // --- GAME LOGIC FUNCTIONS ---

  infectNode(node) {
    if (this.isGameOver) return;
    node.state = 'active';
    node.timer = 2; // 3 seconds to cut!
    node.circle.setFillStyle(0xF44336); // Turns Red
    
    // Add a pulsing animation to active nodes
    this.tweens.add({
      targets: node.circle,
      scale: 1.5,
      yoyo: true,
      repeat: -1,
      duration: 300
    });
  }

  spreadFromNode(sourceNode) {
    if (this.isGameOver) return;
    sourceNode.state = 'infected'; // Already spread, can't be cut anymore
    sourceNode.circle.setFillStyle(0x8B0000); // Dark red
    this.tweens.killTweensOf(sourceNode.circle); // Stop pulsing
    sourceNode.circle.setScale(1);

    // Penalty for missing!
    this.combo = 0;
    this.viralRisk += 5;
    this.cameras.main.shake(150, 0.01);
    this.updateHUD();

    // Spread to 2-3 random idle nodes
    let spreadCount = Phaser.Math.Between(2, 3);
    let idleNodes = this.nodes.filter(n => n.state === 'idle');
    
    Phaser.Utils.Array.Shuffle(idleNodes);
    
    for (let i = 0; i < Math.min(spreadCount, idleNodes.length); i++) {
      let targetNode = idleNodes[i];
      this.infectNode(targetNode);
      this.activeConnections.push({ source: sourceNode, target: targetNode });
    }
    this.drawNetwork();
  }

  cutConnection(conn, index) {
    // Reward for cutting!
    this.coins += 10;
    this.combo += 1;
    this.viralRisk = Math.max(0, this.viralRisk - 3);
    this.updateHUD();

    // Stop the target node from spreading
    let target = conn.target;
    target.state = 'blocked';
    target.circle.setFillStyle(0x4CAF50); // Turns Green
    this.tweens.killTweensOf(target.circle);
    target.circle.setScale(1);

    // Remove the red line
    this.activeConnections.splice(index, 1);
    this.drawNetwork();

    // Spawn a little "+10" text effect
    let floatText = this.add.text(target.x, target.y - 20, '+10', { fontSize: '16px', fill: '#FFD700', fontStyle: 'bold' });
    this.tweens.add({ targets: floatText, y: target.y - 50, alpha: 0, duration: 800, onComplete: () => floatText.destroy() });
  }

  drawNetwork() {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xF44336, 0.8); // Red spreading lines
    
    this.activeConnections.forEach(conn => {
      this.graphics.beginPath();
      this.graphics.moveTo(conn.source.x, conn.source.y);
      this.graphics.lineTo(conn.target.x, conn.target.y);
      this.graphics.strokePath();
    });
  }

  updateHUD() {
    this.scoreText.setText(`Coins: ${this.coins} | Combo: x${this.combo}`);
    this.riskText.setText(`Risk: ${this.viralRisk}%`);
    if (this.viralRisk > 70) this.riskText.setFill('#F44336');
    else if (this.viralRisk > 40) this.riskText.setFill('#FF9800');
    else this.riskText.setFill('#4CAF50');
  }

  gameTick() {
    if (this.isGameOver) return;

    // 1. Handle Global Timer
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    // 2. Handle Individual Node Timers
    let activeNodes = this.nodes.filter(n => n.state === 'active');
    activeNodes.forEach(node => {
      node.timer--;
      if (node.timer <= 0) {
        this.spreadFromNode(node); // It spread!
      }
    });

    // 3. Check End Conditions
    if (this.timeLeft <= 0 || this.viralRisk >= 100) {
      this.endGame(this.viralRisk < 100);
    }
  }

  endGame(success) {
    this.isGameOver = true;
    this.graphics.clear();
    this.tweens.killAll(); // Stop all animations
    
    // Dim the screen
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    
    let msg = success ? "SPREAD CONTAINED!" : "VIRAL OUTBREAK!";
    let color = success ? '#4CAF50' : '#F44336';
    
    this.add.text(400, 250, msg, { fontSize: '40px', fill: color, fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 320, `Final Score: ${this.coins}`, { fontSize: '24px', fill: '#FFD700' }).setOrigin(0.5);

    // Wait 2.5 seconds so they can see their score, then tell React we are done
    this.time.delayedCall(2500, () => {
      document.dispatchEvent(new CustomEvent('phaseA_complete', { 
        detail: { success, score: this.coins } 
      }));
    });
  }
}