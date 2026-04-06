import Phaser from 'phaser';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  create() {
    // 1. WORLD SETUP (A long vertical road: 800px wide, 3000px tall)
    this.cameras.main.setBackgroundColor('#2d2d2d');
    this.physics.world.setBounds(0, 0, 800, 3000);
    this.cameras.main.setBounds(0, 0, 800, 3000);

    // Draw the "Road" down the middle
    this.add.rectangle(400, 1500, 400, 3000, 0x444444);

    // --- GAME VARIABLES ---
    this.coins = 0;
    this.collectedLetters = [];
    this.hasCafeWifi = false;
    this.trapTriggered = false;
    this.isGameActive = true;

    // 2. THE HUD (Fixed to the camera so it doesn't scroll away)
    this.hudBg = this.add.rectangle(400, 30, 800, 60, 0x111111).setScrollFactor(0);
    this.coinText = this.add.text(20, 20, 'Coins: 0', { fontSize: '20px', fill: '#FFD700', fontStyle: 'bold' }).setScrollFactor(0);
    this.letterText = this.add.text(200, 20, 'Password: _ _ _ _ _ _ _', { fontSize: '20px', fill: '#fff' }).setScrollFactor(0);
    this.signalText = this.add.text(550, 20, 'Signal: NO DATA', { fontSize: '20px', fill: '#F44336', fontStyle: 'bold' }).setScrollFactor(0);
    this.alertText = this.add.text(400, 100, '', { fontSize: '24px', fill: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

    // 3. THE PLAYER (Veda) - Starts at the very bottom (y: 2800)
    // We draw the rectangle first, THEN hand it over to the physics engine!
    this.player = this.add.rectangle(400, 2800, 40, 40, 0x646cff);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    // Setup Keyboard Controls
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cursors = this.input.keyboard.createCursorKeys();

    // 4. GENERATE COLLECTIBLES (Coins & Letters)
    this.coinGroup = this.physics.add.group();
    for (let i = 0; i < 15; i++) {
      let coin = this.add.circle(Phaser.Math.Between(250, 550), Phaser.Math.Between(400, 2600), 10, 0xFFD700);
      this.physics.add.existing(coin);
      this.coinGroup.add(coin);
    }

    this.letterGroup = this.physics.add.group();
    const lettersToSpawn = ['S', 'A', 'F', 'E', '1', '2', '3'];
    let ySpawn = 2600;
    lettersToSpawn.forEach(char => {
      // Clamped X so they don't spawn off the road, fixed Y spacing!
      let box = this.add.rectangle(Phaser.Math.Between(250, 550), ySpawn, 30, 30, 0x4CAF50);
      let text = this.add.text(box.x, box.y, char, { fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
      
      this.physics.add.existing(box);
      box.char = char; 
      box.textObj = text; 
      this.letterGroup.add(box);
      
      ySpawn -= 320; // Exact spacing ensures no overlaps
    });

    // 5. THE ZONES (Triggers for the story events)
    this.cafeZone = this.add.zone(200, 2000, 200, 300);
    this.physics.add.existing(this.cafeZone);
    this.add.rectangle(200, 2000, 200, 300, 0x8D6E63, 0.5); 
    this.add.text(200, 2000, 'CAFE\n(Temp WiFi)', { fill: '#fff', align: 'center' }).setOrigin(0.5);

    // CHANGED: Width from 400 to 500 so Veda can't sneak past the edges!
    this.trapZone = this.add.zone(400, 1000, 500, 200);
    this.physics.add.existing(this.trapZone);
    this.add.rectangle(400, 1000, 400, 200, 0xF44336, 0.3); 
    this.add.text(400, 1000, 'FREE PUBLIC WIFI\n(Connect Now!)', { fill: '#fff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);

    // Zone C: The Secure Study Hub (y: 200) - The Finish Line!
    this.safeZone = this.add.zone(400, 200, 400, 200);
    this.physics.add.existing(this.safeZone);
    this.add.rectangle(400, 200, 400, 200, 0x1976D2, 0.5); // Visual marker
    this.add.text(400, 200, 'STUDY HUB\n(Secure Network)', { fill: '#fff', align: 'center', fontSize: '20px' }).setOrigin(0.5);

    // 6. SETUP OVERLAPS (What happens when Veda hits things)
    this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.letterGroup, this.collectLetter, null, this);
    this.physics.add.overlap(this.player, this.safeZone, this.reachFinish, null, this);
  }

  // --- INTERACTION LOGIC ---

  collectCoin(player, coin) {
    coin.destroy(); // Remove from screen
    this.coins += 5;
    this.updateHUD();
  }

  collectLetter(player, box) {
    this.collectedLetters.push(box.char);
    box.textObj.destroy();
    box.destroy();
    this.updateHUD();
    this.showAlert(`Collected: ${box.char}`, '#4CAF50');
  }

  updateHUD() {
    this.coinText.setText(`Coins: ${this.coins}`);
    let passDisplay = this.collectedLetters.join(' ') + ' _'.repeat(7 - this.collectedLetters.length);
    this.letterText.setText(`Password: ${passDisplay}`);
  }

  showAlert(message, color) {
    this.alertText.setText(message);
    this.alertText.setBackgroundColor(color);
    this.alertText.setAlpha(1);
    
    // Fade it out after 2 seconds
    this.tweens.add({ targets: this.alertText, alpha: 0, duration: 2000, delay: 1000 });
  }

  // --- THE GAME LOOP (Runs 60 times a second) ---
  update() {
    if (!this.isGameActive) return;

    // 1. Player Movement Logic (Arrow Keys or WASD)
    this.player.body.setVelocity(0); // Stop moving by default

    const speed = 250;
    if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed); // Move forward!
    if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);

    // 2. Zone Checking Logic
    // Cafe Zone Logic
    if (this.physics.overlap(this.player, this.cafeZone)) {
      if (!this.hasCafeWifi) {
        this.hasCafeWifi = true;
        this.signalText.setText('Signal: CAFE WIFI');
        this.signalText.setFill('#4CAF50');
        this.showAlert('Connected to Cafe WiFi!', '#4CAF50');
      }
    } else if (this.hasCafeWifi) {
      // She stepped out of the cafe!
      this.hasCafeWifi = false;
      this.signalText.setText('Signal: NO DATA');
      this.signalText.setFill('#F44336');
      this.showAlert('Lost Connection! Out of range.', '#F44336');
    }

    // Public Trap Zone Logic
    if (this.physics.overlap(this.player, this.trapZone) && !this.trapTriggered) {
      this.trapTriggered = true; // Only trigger once!
      this.coins = Math.max(0, this.coins - 15); // Lose coins, but don't drop below 0
      this.updateHUD();
      
      this.cameras.main.shake(200, 0.02); // Shake the screen
      this.signalText.setText('Signal: UNSTABLE');
      this.showAlert('WARNING: Unsafe Network! Data Leaked (-15 Coins)', '#F44336');
    }
  }

  reachFinish() {
    if (!this.isGameActive) return;
    this.isGameActive = false; // Stop movement
    this.player.body.setVelocity(0);
    
    this.showAlert('Reached the Study Hub!', '#1976D2');
    
    // Wait 1.5 seconds so they can read the alert, then trigger the Password Puzzle UI
    this.time.delayedCall(1500, () => {
      this.showKeypad();
    });
  }

  showKeypad() {
    // Lock the camera Y position so the UI spawns exactly where the player is looking
    let camY = this.cameras.main.scrollY + 300;

    // Darken background
    this.add.rectangle(400, camY, 800, 600, 0x000000, 0.8);

    // Keypad Panel
    this.add.rectangle(400, camY, 500, 400, 0x1a1a1a).setStrokeStyle(4, 0x1976D2);
    this.add.text(400, camY - 150, 'Select Network: StudyHub_Secure', { fontSize: '20px', fill: '#4CAF50' }).setOrigin(0.5);
    this.add.text(400, camY - 110, 'ENTER PASSWORD:', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    this.inputDisplay = this.add.text(400, camY - 50, '_ _ _ _ _ _ _', { fontSize: '36px', fill: '#FFD700', letterSpacing: 5 }).setOrigin(0.5);
    this.typedPassword = '';

    // Create a scrambled row of buttons from the letters they collected
    // (If they missed a letter, we provide the full array so they don't get soft-locked)
    let keysToRender = ['S', 'A', 'F', 'E', '1', '2', '3'];
    Phaser.Utils.Array.Shuffle(keysToRender);

    // Render Buttons
    keysToRender.forEach((key, index) => {
      let xPos = 190 + (index * 70); 
      if (index > 3) xPos = 260 + ((index - 4) * 70); // Move to second row

      let yPos = index > 3 ? camY + 80 : camY + 10;

      let btnBox = this.add.rectangle(xPos, yPos, 50, 50, 0x333333).setStrokeStyle(2, 0x888);
      let btnText = this.add.text(xPos, yPos, key, { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

      btnBox.setInteractive({ useHandCursor: true });
      btnBox.on('pointerover', () => btnBox.setFillStyle(0x555555));
      btnBox.on('pointerout', () => btnBox.setFillStyle(0x333333));
      btnBox.on('pointerdown', () => {
        if (this.typedPassword.length < 7) {
          this.typedPassword += key;
          this.updatePasswordDisplay();
        }
      });
    });

    // Clear Button
    let clearBtn = this.add.rectangle(250, camY + 160, 100, 40, 0xF44336).setInteractive({ useHandCursor: true });
    this.add.text(250, camY + 160, 'CLEAR', { fontSize: '18px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    clearBtn.on('pointerdown', () => {
      this.typedPassword = '';
      this.updatePasswordDisplay();
    });

    // Submit Button
    let submitBtn = this.add.rectangle(550, camY + 160, 100, 40, 0x4CAF50).setInteractive({ useHandCursor: true });
    this.add.text(550, camY + 160, 'CONNECT', { fontSize: '18px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    
    submitBtn.on('pointerdown', () => {
      if (this.typedPassword === 'SAFE123') {
         submitBtn.setFillStyle(0x1cd153);
         this.add.text(400, camY + 220, 'ACCESS GRANTED!', { fontSize: '26px', fill: '#1cd153', fontStyle: 'bold' }).setOrigin(0.5);
         
         // Success! Move to React Phase B
         this.time.delayedCall(1500, () => {
             document.dispatchEvent(new CustomEvent('phaseA_complete', {
               detail: { success: true, score: this.coins }
             }));
         });
      } else {
         // Wrong Password - Shake screen and flash red
         this.cameras.main.shake(200, 0.01);
         this.inputDisplay.setFill('#F44336');
         this.time.delayedCall(500, () => this.inputDisplay.setFill('#FFD700'));
      }
    });
  }

  updatePasswordDisplay() {
    let display = this.typedPassword.split('').join(' ');
    let underscores = ' _'.repeat(7 - this.typedPassword.length);
    this.inputDisplay.setText(display + underscores);
  }
}