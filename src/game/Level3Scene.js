import Phaser from 'phaser';

export default class Level3Scene extends Phaser.Scene {
  constructor() {
    super('Level3Scene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a2e'); // Slight dark blue tint
    
    // 1. Header and Instructions
    this.add.text(400, 40, 'UPI SECURITY PROTOCOL', { fontSize: '26px', fill: '#646cff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 75, 'Drag the Threat (Left) to its matching Defense (Right)', { fontSize: '16px', fill: '#aaa' }).setOrigin(0.5);

    this.score = 0;
    this.matchesMade = 0;

    // 2. The Threat/Defense Data (Simplified to 3 pairs for mobile-friendly spacing)
    const pairs = [
      { id: 1, threat: "Stolen Unlocked Phone", defense: "App Lock / Biometrics" },
      { id: 2, threat: "Fake 'Receive Money' Link", defense: "Verify UPI ID Before Pin" },
      { id: 3, threat: "Someone guessing your PIN", defense: "Complex 6-Digit UPI PIN" }
    ];

    // 3. Render Drop Zones (Defenses on the Right)
    pairs.forEach((pair, index) => {
      const yPos = 180 + (index * 130);
      
      // Visual background for the drop zone
      const zoneBg = this.add.rectangle(600, yPos, 260, 90, 0x242424).setStrokeStyle(2, 0x555);
      this.add.text(600, yPos - 25, 'DEFENSE', { fontSize: '12px', fill: '#888', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(600, yPos + 10, pair.defense, { fontSize: '18px', fill: '#4CAF50', align: 'center', wordWrap: { width: 240 } }).setOrigin(0.5);

      // The actual invisible Phaser drop zone
      const dropZone = this.add.zone(600, yPos, 260, 90).setRectangleDropZone(260, 90);
      dropZone.pairId = pair.id; // Tag it so we know what belongs here
    });

    // 4. Render Draggable Items (Threats on the Left)
    // We shuffle the array so they don't spawn directly across from their answer
    const shuffledPairs = Phaser.Utils.Array.Shuffle([...pairs]);

    shuffledPairs.forEach((pair, index) => {
      const yPos = 180 + (index * 130);
      
      // Create a container to hold the box and text together
      const dragItem = this.add.container(200, yPos);
      dragItem.setSize(260, 90); // Must set size for the container to be interactive
      
      const bg = this.add.rectangle(0, 0, 260, 90, 0x333).setStrokeStyle(2, 0x646cff);
      const label = this.add.text(0, -25, 'THREAT', { fontSize: '12px', fill: '#ff4444', fontStyle: 'bold' }).setOrigin(0.5);
      const text = this.add.text(0, 10, pair.threat, { fontSize: '16px', fill: '#fff', align: 'center', wordWrap: { width: 240 } }).setOrigin(0.5);

      dragItem.add([bg, label, text]);
      
      // Enable dragging
      dragItem.setInteractive({ cursor: 'grab' });
      this.input.setDraggable(dragItem);
      
      // Save data for checking matches and snapping back
      dragItem.pairId = pair.id; 
      dragItem.originalX = 200;
      dragItem.originalY = yPos;
    });

    // 5. Drag and Drop Logic
    this.input.on('dragstart', (pointer, gameObject) => {
      this.children.bringToTop(gameObject); // Bring to front while dragging
      gameObject.list[0].setStrokeStyle(3, 0xffffff); // Highlight border (list[0] is the bg rectangle)
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => {
      if (gameObject.pairId === dropZone.pairId) {
        // CORRECT MATCH
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        
        // Lock it in place
        this.input.setDraggable(gameObject, false);
        gameObject.list[0].setStrokeStyle(3, 0x4CAF50); // Green border
        gameObject.list[0].setFillStyle(0x1b3022); // Greenish background
        
        this.matchesMade++;
        this.score += 100;

        // Check for win condition
        if (this.matchesMade === pairs.length) {
          this.time.delayedCall(1000, () => this.endPhaseA(true)); // Wait 1 sec, then end
        }
      } else {
        // WRONG MATCH (Shake and snap back)
        this.cameras.main.shake(200, 0.01);
        gameObject.x = gameObject.originalX;
        gameObject.y = gameObject.originalY;
      }
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      if (!dropped) {
        // Snaps back if dropped in empty space
        gameObject.x = gameObject.originalX;
        gameObject.y = gameObject.originalY;
      }
      // Reset border if it hasn't been locked in (locked items have green borders)
      if (gameObject.list[0].strokeColor === 0xffffff) {
        gameObject.list[0].setStrokeStyle(2, 0x646cff); 
      }
    });
  }

  endPhaseA(success) {
    document.dispatchEvent(new CustomEvent('phaseA_complete', { 
      detail: { success, score: this.score } 
    }));
  }
}