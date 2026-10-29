import Phaser from 'phaser';

// Character color data interface (mirrors the key fields of PlayableCharacter)
export interface CharacterPaletteData {
  id?: string;
  hairColor?: string;
  jacketColor?: string;
  colorHex?: string;
}

// Procedural generator for the player character's 2D anime spritesheet.
// Generates states: idle (4 frames), walk (6 frames), run (6 frames), jump (4 frames), dodge (4 frames), interact (4 frames), phone (4 frames), victory (4 frames), worried (4 frames)
// Each frame is 64x64 pixels.

export function generateAiraSpritesheet(
  scene: Phaser.Scene,
  character?: CharacterPaletteData | null
): string {
  // Each character gets a unique texture key so switching characters regenerates the sprite
  const charId = character?.id || 'default';
  const textureKey = `aira_spritesheet_${charId}`;
  if (scene.textures.exists(textureKey)) {
    return textureKey;
  }

  const frameWidth = 64;
  const frameHeight = 64;
  const totalFrames = 40; // 0..3: idle, 4..9: walk, 10..15: run, 16..19: jump, 20..23: dodge, 24..27: interact, 28..31: phone, 32..35: victory, 36..39: worried
  const canvasWidth = frameWidth * totalFrames;
  const canvasHeight = frameHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d')!;

  // Character-aware color palette — derives colors from the selected character
  // Falls back to generic 'Aira' defaults when no character is selected
  const id = character?.id || 'default';

  // Per-character hair, jacket, and eye palette
  const paletteMap: Record<string, { hair: string; hairShadow: string; jacket: string; trim: string; eyes: string; shoes: string }> = {
    gyanvi:  { hair: '#2D1A55', hairShadow: '#4C1D95', jacket: '#6D28D9', trim: '#A78BFA', eyes: '#A78BFA', shoes: '#7C3AED' },
    aanya:   { hair: '#1A1A2E', hairShadow: '#0F766E', jacket: '#0F766E', trim: '#67E8F9', eyes: '#22D3EE', shoes: '#0D9488' },
    meera:   { hair: '#2D1B69', hairShadow: '#4C1D95', jacket: '#5B21B6', trim: '#C4B5FD', eyes: '#A5B4FC', shoes: '#7C3AED' },
    riya:    { hair: '#1C0A00', hairShadow: '#78350F', jacket: '#B45309', trim: '#FBBF24', eyes: '#FBBF24', shoes: '#D97706' },
    mahima:  { hair: '#3D1A28', hairShadow: '#831843', jacket: '#BE185D', trim: '#F9A8D4', eyes: '#F472B6', shoes: '#EC4899' },
    default: { hair: '#A78BFA', hairShadow: '#7C3AED', jacket: '#4B7BFF', trim: '#67E8F9', eyes: '#67E8F9', shoes: '#F472D0' },
  };

  const palette = paletteMap[id] || paletteMap.default;
  // Override with live character colors if available (respects any dynamic re-skinning)
  const cHair       = character?.hairColor   || palette.hair;
  const cHairShadow = palette.hairShadow;
  const cSkin       = '#FFE4D6'; // Soft warm anime skin tone (universal)
  const cSkinShadow = '#FBCFE8';
  const cEyes       = character?.colorHex    || palette.eyes;
  const cJacket     = character?.jacketColor || palette.jacket;
  const cJacketTrim = palette.trim;
  const cPants      = '#11142B'; // Deep navy jeans (universal)
  const cShoes      = palette.shoes;
  const cPhone      = '#F8FAFC'; // Glowing phone (universal)

  function drawAiraFrame(
    frameIndex: number,
    state: string,
    subFrame: number
  ) {
    const ox = frameIndex * frameWidth;
    const oy = 0;

    ctx.save();
    ctx.translate(ox + 32, oy + 32);

    let bobY = 0;
    let legOffsetL = 0;
    let legOffsetR = 0;
    let armOffsetL = 0;
    let armOffsetR = 0;
    let hairSway = 0;
    let isHoldingPhone = false;
    let isReaching = false;
    let isVictory = false;
    let eyeState = 'normal'; // 'normal' | 'happy' | 'worried' | 'blink'

    if (state === 'idle') {
      bobY = Math.sin((subFrame / 4) * Math.PI * 2) * 1.5;
      hairSway = Math.cos((subFrame / 4) * Math.PI * 2) * 2;
      if (subFrame === 2) eyeState = 'blink';
    } else if (state === 'walk') {
      bobY = Math.abs(Math.sin((subFrame / 6) * Math.PI * 2)) * 2;
      legOffsetL = Math.sin((subFrame / 6) * Math.PI * 2) * 12;
      legOffsetR = -Math.sin((subFrame / 6) * Math.PI * 2) * 12;
      armOffsetL = -Math.sin((subFrame / 6) * Math.PI * 2) * 10;
      armOffsetR = Math.sin((subFrame / 6) * Math.PI * 2) * 10;
      hairSway = -Math.sin((subFrame / 6) * Math.PI * 2) * 4;
    } else if (state === 'run') {
      bobY = Math.abs(Math.sin((subFrame / 6) * Math.PI * 2)) * 4;
      legOffsetL = Math.sin((subFrame / 6) * Math.PI * 2) * 18;
      legOffsetR = -Math.sin((subFrame / 6) * Math.PI * 2) * 18;
      armOffsetL = -Math.sin((subFrame / 6) * Math.PI * 2) * 16;
      armOffsetR = Math.sin((subFrame / 6) * Math.PI * 2) * 16;
      hairSway = -Math.sin((subFrame / 6) * Math.PI * 2) * 8 - 4;
    } else if (state === 'jump') {
      bobY = -6 + Math.abs(subFrame - 1.5) * 3;
      legOffsetL = -6;
      legOffsetR = 6;
      armOffsetL = -14;
      armOffsetR = 14;
      hairSway = -6;
    } else if (state === 'dodge') {
      bobY = 4;
      legOffsetL = -10;
      legOffsetR = 10;
      armOffsetL = -8;
      armOffsetR = -8;
      hairSway = 8;
      eyeState = 'worried';
    } else if (state === 'interact') {
      bobY = 0;
      isReaching = true;
      hairSway = 2;
    } else if (state === 'phone') {
      bobY = 0;
      isHoldingPhone = true;
    } else if (state === 'victory') {
      bobY = Math.sin((subFrame / 4) * Math.PI * 2) * 2 - 2;
      isVictory = true;
      eyeState = 'happy';
      hairSway = Math.sin((subFrame / 4) * Math.PI * 2) * 3;
    } else if (state === 'worried') {
      bobY = 2;
      eyeState = 'worried';
      hairSway = -2;
    }

    // Shadow on ground
    ctx.beginPath();
    ctx.ellipse(0, 26, Math.max(8, 16 - Math.abs(bobY)), 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8, 11, 24, 0.4)';
    ctx.fill();

    ctx.translate(0, bobY);

    // 1. Long Lavender Hair (Back Layer)
    ctx.fillStyle = cHairShadow;
    ctx.beginPath();
    ctx.moveTo(-10, -18);
    ctx.quadraticCurveTo(-16 + hairSway, 0, -12 + hairSway, 14);
    ctx.quadraticCurveTo(0, 16, 12 + hairSway, 14);
    ctx.quadraticCurveTo(16 + hairSway, 0, 10, -18);
    ctx.closePath();
    ctx.fill();

    // 2. Back Arm
    ctx.save();
    ctx.translate(-8, -4);
    ctx.rotate((armOffsetL * Math.PI) / 180);
    ctx.fillStyle = cJacket;
    ctx.beginPath();
    ctx.roundRect(-3, 0, 6, 14, 3);
    ctx.fill();
    // Hand
    ctx.fillStyle = cSkin;
    ctx.beginPath();
    ctx.arc(0, 15, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Legs
    // Left Leg
    ctx.save();
    ctx.translate(-4, 6);
    ctx.rotate((legOffsetL * Math.PI) / 180);
    ctx.fillStyle = cPants;
    ctx.fillRect(-2.5, 0, 5, 14);
    // Shoe
    ctx.fillStyle = cShoes;
    ctx.beginPath();
    ctx.roundRect(-3, 13, 7, 5, 2);
    ctx.fill();
    ctx.restore();

    // Right Leg
    ctx.save();
    ctx.translate(4, 6);
    ctx.rotate((legOffsetR * Math.PI) / 180);
    ctx.fillStyle = cPants;
    ctx.fillRect(-2.5, 0, 5, 14);
    // Shoe
    ctx.fillStyle = cShoes;
    ctx.beginPath();
    ctx.roundRect(-3, 13, 7, 5, 2);
    ctx.fill();
    ctx.restore();

    // 4. Torso & Jacket
    ctx.fillStyle = cJacket;
    ctx.beginPath();
    ctx.roundRect(-7, -8, 14, 15, 3);
    ctx.fill();

    // Neon trim / shirt
    ctx.fillStyle = cJacketTrim;
    ctx.fillRect(-1.5, -8, 3, 15);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-4, -8);
    ctx.lineTo(4, -8);
    ctx.lineTo(0, -2);
    ctx.closePath();
    ctx.fill();

    // 5. Head & Neck (Cute Youthful Anime Sprite Design)
    // Neck
    ctx.fillStyle = cSkinShadow;
    ctx.fillRect(-2, -11, 4, 4);

    // Head (Slightly rounded soft anime contour)
    ctx.fillStyle = cSkin;
    ctx.beginPath();
    ctx.roundRect(-8.5, -25, 17, 15, 7);
    ctx.fill();

    // Cute Soft Rosy Cheeks (Blush)
    ctx.fillStyle = '#FB7185';
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(-5.5, -14, 2.2, 0, Math.PI * 2);
    ctx.arc(5.5, -14, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Small delicate nose
    ctx.fillStyle = '#EA580C';
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.arc(0, -14.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Face features
    if (eyeState === 'blink') {
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-5.5, -17);
      ctx.lineTo(-1.5, -17);
      ctx.moveTo(1.5, -17);
      ctx.lineTo(5.5, -17);
      ctx.stroke();
    } else if (eyeState === 'happy') {
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-3.5, -16.5, 2.8, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(3.5, -16.5, 2.8, Math.PI, 0);
      ctx.stroke();
    } else if (eyeState === 'worried') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-3.5, -17, 3, 0, Math.PI * 2);
      ctx.arc(3.5, -17, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cEyes;
      ctx.beginPath();
      ctx.arc(-3.5, -17, 2.2, 0, Math.PI * 2);
      ctx.arc(3.5, -17, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Pupil & Specular catchlight
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-3.5, -17, 1.2, 0, Math.PI * 2);
      ctx.arc(3.5, -17, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-4.2, -18, 0.8, 0, Math.PI * 2);
      ctx.arc(2.8, -18, 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Worried soft eyebrows
      ctx.strokeStyle = '#2E1065';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-6, -21.5);
      ctx.lineTo(-2, -19.5);
      ctx.moveTo(6, -21.5);
      ctx.lineTo(2, -19.5);
      ctx.stroke();
    } else {
      // Large Expressive Anime Eyes (Detailed dual-layer irises with lash line and catchlights)
      // Sclera
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-3.8, -17, 3.2, 0, Math.PI * 2);
      ctx.arc(3.8, -17, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Rich Iris Gradient
      ctx.fillStyle = '#7C3AED';
      ctx.beginPath();
      ctx.arc(-3.8, -17, 2.5, 0, Math.PI * 2);
      ctx.arc(3.8, -17, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cEyes;
      ctx.beginPath();
      ctx.arc(-3.8, -16.2, 1.8, 0, Math.PI * 2);
      ctx.arc(3.8, -16.2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Deep Pupil
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-3.8, -17, 1.2, 0, Math.PI * 2);
      ctx.arc(3.8, -17, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight Sparkles
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-4.6, -18.2, 0.9, 0, Math.PI * 2);
      ctx.arc(3.0, -18.2, 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Delicate upper lash
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6.2, -18.2);
      ctx.lineTo(-1.5, -18.8);
      ctx.moveTo(1.5, -18.8);
      ctx.lineTo(6.2, -18.2);
      ctx.stroke();

      // Soft Eyebrows
      ctx.strokeStyle = '#2E1065';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, -20.8);
      ctx.lineTo(-2, -20.8);
      ctx.moveTo(2, -20.8);
      ctx.lineTo(6, -20.8);
      ctx.stroke();
    }

    // Small Delicate Cute Anime Mouth
    ctx.strokeStyle = '#BE123C';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (eyeState === 'happy') {
      ctx.arc(0, -12.5, 2.2, 0, Math.PI);
    } else if (eyeState === 'worried') {
      ctx.arc(0, -11, 1.8, Math.PI, 0);
    } else {
      ctx.arc(0, -12.8, 1.8, 0.1 * Math.PI, 0.9 * Math.PI);
    }
    ctx.stroke();


    // 6. Anime Bangs & Hair Front
    ctx.fillStyle = cHair;
    ctx.beginPath();
    ctx.moveTo(-8, -24);
    ctx.lineTo(8, -24);
    ctx.lineTo(9, -20);
    ctx.lineTo(5, -18);
    ctx.lineTo(2, -21);
    ctx.lineTo(0, -17);
    ctx.lineTo(-3, -21);
    ctx.lineTo(-6, -18);
    ctx.lineTo(-9, -20);
    ctx.closePath();
    ctx.fill();

    // Twin Bang Strands (framing face)
    ctx.beginPath();
    ctx.moveTo(-8, -20);
    ctx.quadraticCurveTo(-11, -10, -9, -4);
    ctx.lineTo(-7, -4);
    ctx.quadraticCurveTo(-7, -10, -6, -18);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, -20);
    ctx.quadraticCurveTo(11, -10, 9, -4);
    ctx.lineTo(7, -4);
    ctx.quadraticCurveTo(7, -10, 6, -18);
    ctx.fill();

    // 7. Front Arm
    ctx.save();
    if (isVictory) {
      // Arms up V-sign
      ctx.translate(8, -4);
      ctx.rotate((-130 * Math.PI) / 180);
      ctx.fillStyle = cJacket;
      ctx.beginPath();
      ctx.roundRect(-3, 0, 6, 14, 3);
      ctx.fill();
      ctx.fillStyle = cSkin;
      ctx.beginPath();
      ctx.arc(0, 15, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (isHoldingPhone) {
      // Hand holding glowing smartphone up to ear or in front
      ctx.translate(6, -4);
      ctx.rotate((-45 * Math.PI) / 180);
      ctx.fillStyle = cJacket;
      ctx.beginPath();
      ctx.roundRect(-3, 0, 6, 12, 3);
      ctx.fill();
      // Glowing Phone
      ctx.fillStyle = cPhone;
      ctx.shadowColor = '#67E8F9';
      ctx.shadowBlur = 6;
      ctx.fillRect(0, 8, 7, 12);
      ctx.shadowBlur = 0;
      // Phone Screen glow
      ctx.fillStyle = '#67E8F9';
      ctx.fillRect(1, 9, 5, 10);
    } else if (isReaching) {
      // Hand reaching forward to interact
      ctx.translate(6, -4);
      ctx.rotate((-70 * Math.PI) / 180);
      ctx.fillStyle = cJacket;
      ctx.beginPath();
      ctx.roundRect(-3, 0, 6, 14, 3);
      ctx.fill();
      ctx.fillStyle = cSkin;
      ctx.beginPath();
      ctx.arc(0, 15, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal arm swing
      ctx.translate(8, -4);
      ctx.rotate((armOffsetR * Math.PI) / 180);
      ctx.fillStyle = cJacket;
      ctx.beginPath();
      ctx.roundRect(-3, 0, 6, 14, 3);
      ctx.fill();
      ctx.fillStyle = cSkin;
      ctx.beginPath();
      ctx.arc(0, 15, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.restore();
  }

  let curFrame = 0;

  // 1. Idle (4 frames: 0..3)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'idle', i);
  }
  // 2. Walk (6 frames: 4..9)
  for (let i = 0; i < 6; i++) {
    drawAiraFrame(curFrame++, 'walk', i);
  }
  // 3. Run (6 frames: 10..15)
  for (let i = 0; i < 6; i++) {
    drawAiraFrame(curFrame++, 'run', i);
  }
  // 4. Jump (4 frames: 16..19)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'jump', i);
  }
  // 5. Dodge (4 frames: 20..23)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'dodge', i);
  }
  // 6. Interact (4 frames: 24..27)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'interact', i);
  }
  // 7. Phone (4 frames: 28..31)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'phone', i);
  }
  // 8. Victory (4 frames: 32..35)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'victory', i);
  }
  // 9. Worried (4 frames: 36..39)
  for (let i = 0; i < 4; i++) {
    drawAiraFrame(curFrame++, 'worried', i);
  }

  // Register texture in Phaser Scene
  if (scene.textures.exists(textureKey)) {
    scene.textures.remove(textureKey);
  }

  scene.textures.addSpriteSheet(textureKey, canvas as unknown as HTMLImageElement, {
    frameWidth: 64,
    frameHeight: 64
  });

  // Create or refresh Phaser Animations
  const anims = scene.anims;

  if (!anims.exists('aira-idle')) {
    anims.create({
      key: 'aira-idle',
      frames: anims.generateFrameNumbers(textureKey, { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
  }

  if (!anims.exists('aira-walk')) {
    anims.create({
      key: 'aira-walk',
      frames: anims.generateFrameNumbers(textureKey, { start: 4, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
  }

  if (!anims.exists('aira-run')) {
    anims.create({
      key: 'aira-run',
      frames: anims.generateFrameNumbers(textureKey, { start: 10, end: 15 }),
      frameRate: 14,
      repeat: -1
    });
  }

  if (!anims.exists('aira-jump')) {
    anims.create({
      key: 'aira-jump',
      frames: anims.generateFrameNumbers(textureKey, { start: 16, end: 19 }),
      frameRate: 8,
      repeat: 0
    });
  }

  if (!anims.exists('aira-dodge')) {
    anims.create({
      key: 'aira-dodge',
      frames: anims.generateFrameNumbers(textureKey, { start: 20, end: 23 }),
      frameRate: 10,
      repeat: 0
    });
  }

  if (!anims.exists('aira-interact')) {
    anims.create({
      key: 'aira-interact',
      frames: anims.generateFrameNumbers(textureKey, { start: 24, end: 27 }),
      frameRate: 8,
      repeat: -1
    });
  }

  if (!anims.exists('aira-phone')) {
    anims.create({
      key: 'aira-phone',
      frames: anims.generateFrameNumbers(textureKey, { start: 28, end: 31 }),
      frameRate: 6,
      repeat: -1
    });
  }

  if (!anims.exists('aira-victory')) {
    anims.create({
      key: 'aira-victory',
      frames: anims.generateFrameNumbers(textureKey, { start: 32, end: 35 }),
      frameRate: 7,
      repeat: -1
    });
  }

  if (!anims.exists('aira-worried')) {
    anims.create({
      key: 'aira-worried',
      frames: anims.generateFrameNumbers(textureKey, { start: 36, end: 39 }),
      frameRate: 6,
      repeat: -1
    });
  }

  return textureKey;
}
