import Phaser from 'phaser';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  create() {
    // 1. Setup Background and Instructions
    this.cameras.main.setBackgroundColor('#1a1a1a');
    
    this.add.text(400, 40, 'SCANNING LOCAL NETWORKS...', { 
      fontSize: '24px', fill: '#646cff', fontStyle: 'bold', letterSpacing: '2px' 
    }).setOrigin(0.5);
    
    this.add.text(400, 80, 'Inspect the properties. Tap the suspicious honeypot network!', { 
      fontSize: '16px', fill: '#aaa' 
    }).setOrigin(0.5);

    // 2. Setup the Timer
    this.timeLeft = 90;
    this.timerText = this.add.text(400, 120, `Time: ${this.timeLeft}s`, { 
      fontSize: '32px', fill: '#fff', fontStyle: 'bold' 
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // 3. Network Card Data (Adding HTTPS, Cert, Signal)
    const cardPositions = [200, 400, 600];
    const cardData = [
      { name: "Cafe_Guest", https: "🔒 YES", cert: "Verified", signal: "Weak", isFake: false },
      { name: "Free_Public_WiFi", https: "🔓 NO", cert: "Missing!", signal: "Excellent", isFake: true }, // The Honeypot
      { name: "Airport_Secure", https: "🔒 YES", cert: "Verified", signal: "Good", isFake: false }
    ];

    // 4. Render the Interactive Cards
    cardPositions.forEach((x, index) => {
      const data = cardData[index];
      
      // Use a container to group the background and text together
      const cardContainer = this.add.container(x, 350);
      
      // Card Background
      const bg = this.add.rectangle(0, 0, 170, 240, 0x2a2a2a)
        .setStrokeStyle(2, 0x555555)
        .setInteractive({ useHandCursor: true });
        
      // Add a hover effect so the player knows it's clickable
      bg.on('pointerover', () => bg.setStrokeStyle(4, 0x646cff));
      bg.on('pointerout', () => bg.setStrokeStyle(2, 0x555555));

      // Card Text Elements
      const titleText = this.add.text(0, -80, data.name, { fontSize: '16px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
      const sepText = this.add.text(0, -60, '----------------', { fill: '#555' }).setOrigin(0.5);
      
      // Make the missing HTTPS visually distinct
      const httpsColor = data.https.includes('NO') ? '#F44336' : '#4CAF50';
      const httpsText = this.add.text(0, -30, `HTTPS: ${data.https}`, { fontSize: '14px', fill: httpsColor }).setOrigin(0.5);
      
      const certText = this.add.text(0, 10, `Cert: ${data.cert}`, { fontSize: '14px', fill: '#ccc' }).setOrigin(0.5);
      const signalText = this.add.text(0, 50, `Signal: ${data.signal}`, { fontSize: '14px', fill: '#ccc' }).setOrigin(0.5);

      cardContainer.add([bg, titleText, sepText, httpsText, certText, signalText]);

      // 5. Handle Click Logic
      bg.on('pointerdown', () => {
        if (data.isFake) {
          this.endPhaseA(true); 
        } else {
          // Penalty for wrong guess
          this.cameras.main.shake(200, 0.01);
          this.timeLeft -= 10;
          
          // Flash the card red briefly
          bg.fillColor = 0x4a1a1a; 
          this.time.delayedCall(200, () => { bg.fillColor = 0x2a2a2a; });
        }
      });
    });
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);
    
    // Add visual urgency if time is running out
    if (this.timeLeft <= 10) {
      this.timerText.setFill('#F44336');
    }
    
    if (this.timeLeft <= 0) {
      this.endPhaseA(false);
    }
  }

  endPhaseA(success) {
    // Calculate final score based on time remaining 
    const finalScore = success ? this.timeLeft * 10 : 0;
    
    document.dispatchEvent(new CustomEvent('phaseA_complete', { 
      detail: { success, score: finalScore } 
    }));
  }
}