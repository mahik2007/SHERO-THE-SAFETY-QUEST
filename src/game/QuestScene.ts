import Phaser from 'phaser';
import { generateAiraSpritesheet, CharacterPaletteData } from './airaSpritesheet';
import { generateEnvironmentTextures } from './environmentTextures';
import { generateIsometricTextures } from './isometricTextures';

export interface QuestSceneInitData {
  missionId: string;
  missionNumber: number;
  environmentName: string;
  nodeIndex: number; // 1, 2, or 3
  onReachTrigger?: () => void;
  heroName?: string;
  character?: CharacterPaletteData | null;
}


export class QuestScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    eKey: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
  };

  private triggerMarker?: Phaser.GameObjects.Sprite;
  private triggerZone?: Phaser.GameObjects.Zone;
  private triggerReached: boolean = false;
  private npcDriver?: Phaser.GameObjects.Sprite;
  private busSprite?: Phaser.GameObjects.Image;

  private initData!: QuestSceneInitData;
  private isAiraLocked: boolean = false;
  private virtualJoystickVector = { x: 0, y: 0 };
  private speechBubble?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'QuestScene' });
  }

  init(data: QuestSceneInitData) {
    this.initData = data;
    this.triggerReached = false;
    this.isAiraLocked = false;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Generate procedural art assets (2D & 2.5D Isometric textures)
    // Pass the selected character so the sprite sheet reflects character-specific colors
    const spriteKey = generateAiraSpritesheet(this, this.initData.character);
    generateEnvironmentTextures(this);
    generateIsometricTextures(this);

    // 2. Set World Boundaries for 2.5D Explorable City (2000 x 900)
    const mapW = 2000;
    const mapH = 900;
    this.physics.world.setBounds(0, 0, mapW, mapH);
    this.physics.world.gravity.y = 0; // Top-down / Isometric 2.5D plane (no side-scroller gravity)

    // 3. Render 2.5D Isometric Diamond Grid Terrain (Roadways and Sidewalk Plazas)
    this.createIsometricCityGrid(mapW, mapH);

    // 4. Place 2.5D Isometric Buildings, Bus Stop, and Props with Dynamic Depth Sorting
    this.createIsometricBuildingsAndProps(mapW, mapH);

    // 5. Spawn Named Heroine in Isometric Space
    const spawnX = Math.max(160, (this.initData.nodeIndex - 1) * 550 + 180);
    const spawnY = 460;

    this.player = this.physics.add.sprite(spawnX, spawnY, spriteKey, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.25);
    this.player.setSize(24, 30);
    this.player.setOffset(20, 32);
    this.player.setDepth(this.player.y);

    // Play idle animation
    this.player.anims.play('aira-idle', true);

    // 6. Spawn Interactive Target Waypoint Zone for Decision Node
    const targetTriggerX = spawnX + 380;
    const targetTriggerY = spawnY - 40;
    this.createTriggerAt(targetTriggerX, targetTriggerY);

    // 7. Interactive NPC Driver with Speech Bubble & Welcome Greeting
    if (this.initData.missionNumber === 1 || this.initData.missionNumber === 3) {
      this.createDriverNPC(spawnX + 330, spawnY - 60);
    }

    // 8. 2.5D Isometric Camera Following
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBackgroundColor('#080B18');

    // 9. Input Controls Setup (WASD + Arrow Keys + E + Space)
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        eKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      };
    }

    // Listen to React custom events
    window.addEventListener('shero_virtual_move', this.handleVirtualMove as EventListener);
    window.addEventListener('shero_set_pose', this.handleSetPose as EventListener);
  }

  private createIsometricCityGrid(mapW: number, mapH: number) {
    // Fill the isometric ground plane with diamond tiles (64 x 32)
    const tileW = 64;
    const tileH = 32;

    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 35; col++) {
        // Isometric coordinate conversion: (col - row) * (tileW / 2), (col + row) * (tileH / 2)
        const isoX = (col - row) * (tileW / 2) + 600;
        const isoY = (col + row) * (tileH / 2) + 100;

        if (isoX >= -64 && isoX <= mapW + 64 && isoY >= -32 && isoY <= mapH + 32) {
          // Central boulevard is road, sides are sidewalks
          const isRoad = row >= 8 && row <= 16;
          const texture = isRoad ? 'iso_road' : 'iso_sidewalk';
          const tile = this.add.image(isoX, isoY, texture);
          tile.setDepth(1);
        }
      }
    }
  }

  private createIsometricBuildingsAndProps(mapW: number, mapH: number) {
    // 1. Isometric Towers along the northern avenue
    const towers = [
      { x: 300, y: 220 },
      { x: 550, y: 160 },
      { x: 900, y: 200 },
      { x: 1250, y: 170 },
      { x: 1600, y: 210 }
    ];

    towers.forEach(t => {
      const bldg = this.add.image(t.x, t.y, 'iso_building_tower');
      bldg.setOrigin(0.5, 0.9);
      bldg.setDepth(t.y);
    });

    // 2. Isometric Bus Stop Shelter
    const busStop = this.add.image(520, 390, 'iso_bus_stop');
    busStop.setOrigin(0.5, 0.85);
    busStop.setDepth(390);

    // 3. Isometric 2.5D Transit Bus
    this.busSprite = this.add.image(620, 430, 'iso_bus');
    this.busSprite.setOrigin(0.5, 0.8);
    this.busSprite.setDepth(430);

    // Engine idling vibration tween
    this.tweens.add({
      targets: this.busSprite,
      y: 432,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4. Staffed Safe Haven Store (Mission 1 & 2 destination safe point)
    const safeHaven = this.add.image(1350, 360, 'iso_safe_haven');
    safeHaven.setOrigin(0.5, 0.9);
    safeHaven.setDepth(360);

    // 5. Isometric Neon Street Lamps with depth sorting
    for (let lx = 200; lx < mapW; lx += 280) {
      const lampY = 480 + (lx % 60);
      const lamp = this.add.image(lx, lampY, 'iso_lamp');
      lamp.setOrigin(0.5, 0.95);
      lamp.setDepth(lampY);
    }
  }

  private createDriverNPC(x: number, y: number) {
    this.npcDriver = this.add.sprite(x, y, 'iso_npc_driver');
    this.npcDriver.setOrigin(0.5, 0.9);
    this.npcDriver.setDepth(y);

    // Subtle breathing / idle motion
    this.tweens.add({
      targets: this.npcDriver,
      y: y - 2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Overhead Dialogue Speech Bubble
    const heroName = this.initData.heroName || 'Gyanvi';
    const bubbleContainer = this.add.container(x, y - 65);

    const bgRect = this.add.rectangle(0, 0, 160, 28, 0x11142b, 0.95);
    bgRect.setStrokeStyle(1.5, 0x67e8f9);

    const txt = this.add.text(0, 0, `Driver: "Hey, ${heroName}!"`, {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#67E8F9',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    bubbleContainer.add([bgRect, txt]);
    bubbleContainer.setDepth(y + 10);
    this.speechBubble = bubbleContainer;

    // Pulse bubble
    this.tweens.add({
      targets: bubbleContainer,
      y: y - 68,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private handleVirtualMove = (e: CustomEvent<{ vx: number; vy: number }>) => {
    this.virtualJoystickVector = { x: e.detail.vx, y: e.detail.vy };
  };

  private handleSetPose = (e: CustomEvent<{ pose: string }>) => {
    if (!this.player || !this.player.active) return;
    const pose = e.detail.pose;
    if (pose === 'victory') {
      this.isAiraLocked = true;
      this.player.setVelocity(0, 0);
      this.player.anims.play('aira-victory', true);
    } else if (pose === 'worried') {
      this.isAiraLocked = true;
      this.player.setVelocity(0, 0);
      this.player.anims.play('aira-worried', true);
    } else if (pose === 'interact') {
      this.player.anims.play('aira-interact', true);
    } else if (pose === 'phone') {
      this.player.anims.play('aira-phone', true);
    }
  };

  private createTriggerAt(x: number, y: number) {
    this.triggerMarker = this.add.sprite(x, y - 10, 'trigger_marker');
    this.triggerMarker.setScale(0.9);
    this.triggerMarker.setDepth(y + 5);

    // Pulse animation
    this.tweens.add({
      targets: this.triggerMarker,
      scale: 1.1,
      alpha: 0.85,
      y: y - 18,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Trigger zone (80 x 80)
    this.triggerZone = this.add.zone(x, y, 80, 80);
    this.physics.add.existing(this.triggerZone, true);

    this.physics.add.overlap(this.player, this.triggerZone, () => {
      if (!this.triggerReached) {
        this.triggerReached = true;
        this.player.setVelocity(0, 0);
        this.player.anims.play('aira-interact', true);

        // Flash marker and notify React
        this.tweens.add({
          targets: this.triggerMarker,
          scale: 1.4,
          alpha: 0,
          duration: 350,
          onComplete: () => {
            if (this.initData.onReachTrigger) {
              this.initData.onReachTrigger();
            }
            window.dispatchEvent(
              new CustomEvent('shero_trigger_activated', {
                detail: { nodeIndex: this.initData.nodeIndex }
              })
            );
          }
        });
      }
    });
  }

  update() {
    if (!this.player || this.isAiraLocked) return;

    let moveX = 0;
    let moveY = 0;

    // Keyboard inputs (WASD / Arrows)
    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
        moveX -= 1;
      }
      if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
        moveX += 1;
      }
      if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
        moveY -= 1;
      }
      if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
        moveY += 1;
      }
    }

    // Virtual Joystick inputs (Mobile / Touch)
    if (this.virtualJoystickVector.x !== 0 || this.virtualJoystickVector.y !== 0) {
      moveX = this.virtualJoystickVector.x;
      moveY = this.virtualJoystickVector.y;
    }

    const speed = 190;
    if (moveX !== 0 || moveY !== 0) {
      // Normalize vector for isometric 2.5D diagonal travel
      const length = Math.sqrt(moveX * moveX + moveY * moveY);
      const nx = (moveX / length) * speed;
      const ny = (moveY / length) * (speed * 0.7); // 0.7 aspect ratio for isometric depth

      this.player.setVelocity(nx, ny);
      this.player.setFlipX(moveX < 0);
      this.player.anims.play('aira-walk', true);

      // Dynamic 2.5D Depth Sorting: Lower Y appears in front of higher Y
      this.player.setDepth(this.player.y);
    } else {
      this.player.setVelocity(0, 0);
      if (!this.triggerReached) {
        this.player.anims.play('aira-idle', true);
      }
    }
  }

  public setAiraPose(pose: 'idle' | 'walk' | 'run' | 'jump' | 'dodge' | 'interact' | 'phone' | 'victory' | 'worried') {
    if (!this.player || !this.player.active) return;
    this.player.setVelocity(0, 0);
    this.player.anims.play(`aira-${pose}`, true);
  }

  destroy() {
    window.removeEventListener('shero_virtual_move', this.handleVirtualMove as EventListener);
    window.removeEventListener('shero_set_pose', this.handleSetPose as EventListener);
  }
}
