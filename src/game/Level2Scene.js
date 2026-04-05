import Phaser from 'phaser';

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super('Level2Scene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b141a'); // Dark chat background
    this.score = 0;

    // 1. Chat UI Header
    this.add.rectangle(400, 30, 800, 60, 0x202c33);
    this.add.text(400, 30, 'Class X Group (45 members)', { fontSize: '20px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    // 2. The Embarrassing Photo Message
    this.add.rectangle(400, 200, 300, 250, 0x005c4b).setStrokeStyle(2, 0x00a884);
    this.add.text(400, 100, '~ Rahul', { fontSize: '14px', fill: '#1cd153' }).setOrigin(0.5);
    
    // Placeholder for the photo
    this.add.rectangle(400, 180, 260, 140, 0x333333);
    this.add.text(400, 180, '[ EMBARRASSING PHOTO ]', { fill: '#ff4444', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 280, 'Look what Priya did lol 😂', { fill: '#fff' }).setOrigin(0.5);

    // 3. Exponential Spread Visualizer
    this.add.text(400, 380, 'TRACKING IMAGE SPREAD...', { fontSize: '16px', fill: '#aaa' }).setOrigin(0.5);
    this.views = 1;
    this.viewText = this.add.text(400, 430, `Views: ${this.views}`, { fontSize: '48px', fill: '#ff4444', fontStyle: 'bold' }).setOrigin(0.5);

    // Animate the exponential growth (x3 every second for 6 seconds)
    this.spreadTimer = this.time.addEvent({
      delay: 1000,
      repeat: 5,
      callback: () => {
        this.views *= 3;
        this.viewText.setText(`Views: ${this.views}`);
        this.cameras.main.shake(100, 0.005); // UI shakes as it goes viral
      }
    });

    // 4. Trigger Quiz after the spread simulation
    this.time.delayedCall(7000, this.showQuiz, [], this);
  }

  showQuiz() {
    // Darken background for quiz
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

    this.add.text(400, 150, 'SPREAD ANALYSIS', { fontSize: '32px', fill: '#646cff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 220, 'If 1 person forwards a photo to 3 people,\nand those 3 forward to 3 more every 10 minutes...\nHow many people see it in exactly 1 hour (6 hops)?', { fontSize: '20px', fill: '#fff', align: 'center', lineHeight: 1.5 }).setOrigin(0.5);

    // Quiz Options
    const options = [
      { text: "18 people", correct: false },
      { text: "729 people", correct: true }, // 3^6
      { text: "216 people", correct: false }
    ];

    options.forEach((opt, index) => {
      const yPos = 350 + (index * 70);
      const btn = this.add.rectangle(400, yPos, 400, 50, 0x2a2a2a).setInteractive({ useHandCursor: true });
      this.add.text(400, yPos, opt.text, { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

      btn.on('pointerover', () => btn.setFillStyle(0x3a3a3a));
      btn.on('pointerout', () => btn.setFillStyle(0x2a2a2a));

      btn.on('pointerdown', () => {
        if (opt.correct) {
          btn.setFillStyle(0x4CAF50); // Green
          this.score = 100;
        } else {
          btn.setFillStyle(0xF44336); // Red
          this.score = 0;
        }
        
        // Wait 1 second so they see if they were right, then end phase
        this.time.delayedCall(1000, () => this.endPhaseA(opt.correct));
      });
    });
  }

  endPhaseA(success) {
    document.dispatchEvent(new CustomEvent('phaseA_complete', { 
      detail: { success, score: this.score } 
    }));
  }
}