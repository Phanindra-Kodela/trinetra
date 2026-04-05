import Phaser from 'phaser';

export default class Level4Scene extends Phaser.Scene {
  constructor() {
    super('Level4Scene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a1a');
    this.score = 0;
    this.currentCase = 0;

    // Header
    this.add.text(400, 40, 'DEEPFAKE FORENSICS', { fontSize: '26px', fill: '#646cff', fontStyle: 'bold' }).setOrigin(0.5);
    this.progressText = this.add.text(400, 75, `Image 1 of 4`, { fontSize: '16px', fill: '#aaa' }).setOrigin(0.5);

    // The 4 Test Cases based on your brief
    this.cases = [
      { id: 1, isFake: true,  title: "Video Frame: Principal's Speech", clues: ["Unnatural eye blinking", "Lip-sync delay: 200ms", "Blurry artifacts around the chin"] },
      { id: 2, isFake: false, title: "Photo: School Event", clues: ["Natural lighting shadows", "Clear background details", "Consistent hair textures"] },
      { id: 3, isFake: true,  title: "Audio/Video: Teacher's Rant", clues: ["Robotic voice cadence", "Teeth blur when speaking", "Unmatched background noise"] },
      { id: 4, isFake: false, title: "Photo: Class Trip", clues: ["Proportional facial features", "Reflections in glasses match environment", "No edge blurring"] }
    ];

    // UI Elements Group
    this.uiGroup = this.add.group();
    this.renderCase();
  }

  renderCase() {
    this.uiGroup.clear(true, true); // Clear previous UI
    const currentData = this.cases[this.currentCase];

    this.progressText.setText(`Scanning File ${this.currentCase + 1} of 4...`);

    // 1. Placeholder for the Image being analyzed
    const imageBox = this.add.rectangle(400, 200, 300, 180, 0x242424).setStrokeStyle(2, 0x555);
    const imageText = this.add.text(400, 200, currentData.title, { fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    
    // 2. The Scanner Checklist
    const checklistBox = this.add.rectangle(400, 370, 400, 120, 0x111).setStrokeStyle(1, 0x444);
    const checklistTitle = this.add.text(220, 325, 'SCAN RESULTS:', { fontSize: '14px', fill: '#4CAF50', fontStyle: 'bold' });
    
    // Render the clues bullet points
    const clueTexts = currentData.clues.map((clue, i) => {
      return this.add.text(230, 350 + (i * 25), `> ${clue}`, { fontSize: '14px', fill: '#ccc' });
    });

    // 3. Classification Buttons
    const btnReal = this.createButton(280, 480, 'REAL', 0x4CAF50, !currentData.isFake);
    const btnFake = this.createButton(520, 480, 'DEEPFAKE', 0xF44336, currentData.isFake);

    this.uiGroup.addMultiple([imageBox, imageText, checklistBox, checklistTitle, btnReal, btnFake, ...clueTexts]);
  }

  createButton(x, y, text, color, isCorrectAnswer) {
    const btnContainer = this.add.container(x, y);
    btnContainer.setSize(200, 50);

    const bg = this.add.rectangle(0, 0, 200, 50, 0x2a2a2a).setStrokeStyle(2, color);
    const label = this.add.text(0, 0, text, { fontSize: '18px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    btnContainer.add([bg, label]);
    btnContainer.setInteractive({ useHandCursor: true });

    btnContainer.on('pointerover', () => bg.setFillStyle(0x333));
    btnContainer.on('pointerout', () => bg.setFillStyle(0x2a2a2a));

    btnContainer.on('pointerdown', () => {
      // Disable clicks to prevent double-firing
      btnContainer.disableInteractive(); 

      if (isCorrectAnswer) {
        bg.setFillStyle(0x1b3022); // Success flash
        this.score += 50;
      } else {
        this.cameras.main.shake(200, 0.01);
        bg.setFillStyle(0x4a1a1a); // Error flash
      }

      // Wait 1 second, then load next case or end
      this.time.delayedCall(1000, () => {
        this.currentCase++;
        if (this.currentCase >= this.cases.length) {
          this.endPhaseA(true);
        } else {
          this.renderCase();
        }
      });
    });

    return btnContainer;
  }

  endPhaseA(success) {
    document.dispatchEvent(new CustomEvent('phaseA_complete', { 
      detail: { success, score: this.score } 
    }));
  }
}