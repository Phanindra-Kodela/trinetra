import Phaser from 'phaser';

export default class Level5Scene extends Phaser.Scene {
  constructor() {
    super('Level5Scene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0d1117'); // Dark hacker terminal vibe
    this.score = 0;
    this.currentQuestion = 0;

    // Header
    this.add.text(400, 40, 'DPDPA 2023 COMPLIANCE TEST', { fontSize: '24px', fill: '#646cff', fontStyle: 'bold' }).setOrigin(0.5);
    this.progressText = this.add.text(400, 75, `Question 1 of 5`, { fontSize: '16px', fill: '#aaa' }).setOrigin(0.5);

    // The 5 Quiz Questions based on the DPDPA 2023 and Aadhaar architecture
    this.questions = [
      {
        q: "What does the Digital Personal Data Protection Act (DPDPA) 2023 primarily protect?",
        options: ["Digital personal data of citizens", "Government state secrets", "Corporate trade secrets"],
        correctIndex: 0
      },
      {
        q: "Under DPDPA 2023, what is required before processing a minor's (under 18) data?",
        options: ["A nominal processing fee", "School principal approval", "Verifiable parental consent"],
        correctIndex: 2
      },
      {
        q: "Which of these is a core feature of Aadhaar's architecture?",
        options: ["Centralized biometric database", "Tracks daily bank transactions", "Stores religion and caste"],
        correctIndex: 0
      },
      {
        q: "Which of the following constitutes a serious data breach under the law?",
        options: ["Losing a physical paper notebook", "Unauthorized access to a digital database", "Asking for someone's public name"],
        correctIndex: 1
      },
      {
        q: "What principle dictates that data should only be collected for a specific, stated reason?",
        options: ["Infinite Data Retention", "Data Maximization", "Purpose Limitation"],
        correctIndex: 2
      }
    ];

    this.uiGroup = this.add.group();
    this.renderQuestion();
  }

  renderQuestion() {
    this.uiGroup.clear(true, true);
    const qData = this.questions[this.currentQuestion];

    this.progressText.setText(`Question ${this.currentQuestion + 1} of 5`);

    // Question Box
    const qBox = this.add.rectangle(400, 180, 600, 120, 0x161b22).setStrokeStyle(1, 0x30363d);
    const qText = this.add.text(400, 180, qData.q, { 
      fontSize: '20px', fill: '#c9d1d9', align: 'center', wordWrap: { width: 550 }, lineHeight: 1.5 
    }).setOrigin(0.5);
    
    this.uiGroup.addMultiple([qBox, qText]);

    // Render Option Buttons
    qData.options.forEach((optText, index) => {
      const yPos = 300 + (index * 80);
      const isCorrect = (index === qData.correctIndex);
      
      const btn = this.createOptionButton(400, yPos, optText, isCorrect);
      this.uiGroup.add(btn);
    });
  }

  createOptionButton(x, y, text, isCorrect) {
    const btnContainer = this.add.container(x, y);
    btnContainer.setSize(500, 60);

    const bg = this.add.rectangle(0, 0, 500, 60, 0x21262d).setStrokeStyle(1, 0x646cff);
    const label = this.add.text(0, 0, text, { fontSize: '16px', fill: '#fff', align: 'center', wordWrap: { width: 480 } }).setOrigin(0.5);

    btnContainer.add([bg, label]);
    btnContainer.setInteractive({ useHandCursor: true });

    btnContainer.on('pointerover', () => bg.setFillStyle(0x30363d));
    btnContainer.on('pointerout', () => bg.setFillStyle(0x21262d));

    btnContainer.on('pointerdown', () => {
      // Disable further clicks
      this.uiGroup.getChildren().forEach(child => {
        if (child.disableInteractive) child.disableInteractive();
      });

      if (isCorrect) {
        bg.setFillStyle(0x238636); // GitHub success green
        this.score += 20; // 5 questions * 20 = 100 max score
      } else {
        bg.setFillStyle(0xda3633); // Error red
        this.cameras.main.shake(200, 0.01);
      }

      // Short delay, then next question
      this.time.delayedCall(1200, () => {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
          this.endPhaseA(true);
        } else {
          this.renderQuestion();
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