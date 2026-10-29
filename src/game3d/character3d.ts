import * as THREE from 'three';
import { PlayableCharacter } from '../components/CharacterSelectScreen';

export interface Character3DController {
  group: THREE.Group;
  updateAnimation: (delta: number, isMoving: boolean, speed: number, poseState: string) => void;
  setOutfitColor: (outfit: 'cyber_guardian' | 'neon_casual' | 'stealth_jacket') => void;
}

/**
 * Creates an authentic anime-style 3D character matching the 5 playable characters:
 * - Gyanvi: long violet hair, purple jacket, backpack
 * - Aanya: teal jacket, sleek black bob, headphones
 * - Meera: lavender cardigan, wavy hair, round glasses
 * - Riya: mustard/amber jacket, high ponytail, sporty cap
 * - Mahima: pastel pink cardigan, ribbon/hair clips, gentle smile
 */
export function createAira3DCharacter(
  outfit: 'cyber_guardian' | 'neon_casual' | 'stealth_jacket' = 'cyber_guardian',
  selectedCharacter?: PlayableCharacter | null
): Character3DController {
  const root = new THREE.Group();
  root.name = 'hero_3d_root';

  const charId = selectedCharacter?.id || 'gyanvi';

  // 1. Color Palette derivation
  let skinHex = 0xFFDFD3;
  let hairHex = 0x2A1845;
  let jacketHex = 0x6D28D9;
  let trimHex = 0xA78BFA;
  let pantsHex = 0x11142B;
  let shoeHex = 0x7C3AED;

  if (selectedCharacter) {
    jacketHex = parseInt(selectedCharacter.jacketColor.replace('#', '0x'), 16) || 0x6D28D9;
    hairHex = parseInt(selectedCharacter.hairColor.replace('#', '0x'), 16) || 0x2A1845;
    trimHex = parseInt(selectedCharacter.colorHex.replace('#', '0x'), 16) || 0xA78BFA;
  } else {
    if (outfit === 'neon_casual') {
      jacketHex = 0xD946EF;
      trimHex = 0xFDE047;
      pantsHex = 0x1E1B4B;
    } else if (outfit === 'stealth_jacket') {
      jacketHex = 0x1E293B;
      trimHex = 0x67E8F9;
      pantsHex = 0x090D16;
    }
  }

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.55 });
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairHex,
    roughness: 0.4,
    emissive: hairHex,
    emissiveIntensity: 0.2
  });
  const jacketMat = new THREE.MeshStandardMaterial({ color: jacketHex, roughness: 0.45, metalness: 0.15 });
  const trimMat = new THREE.MeshStandardMaterial({
    color: trimHex,
    roughness: 0.2,
    emissive: trimHex,
    emissiveIntensity: 0.5
  });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsHex, roughness: 0.7 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: shoeHex, roughness: 0.4, emissive: trimHex, emissiveIntensity: 0.2 });

  // 2. Torso & Upper Body
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 1.0;

  // Anime tailored jacket
  const bodyGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.65, 16);
  const bodyMesh = new THREE.Mesh(bodyGeo, jacketMat);
  bodyMesh.castShadow = true;
  torsoGroup.add(bodyMesh);

  // Neon Trim strip down front
  const trimGeo = new THREE.BoxGeometry(0.05, 0.66, 0.4);
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  torsoGroup.add(trimMesh);

  // 3. Head & Neck (Cute Youthful Anime Proportions)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.54;

  const neckGeo = new THREE.CylinderGeometry(0.065, 0.08, 0.16, 12);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.y = -0.06;
  headGroup.add(neckMesh);

  // Cute slightly rounded anime head with soft cheeks and gentle jawline (slightly larger head for youthful anime aesthetic)
  const headGeo = new THREE.SphereGeometry(0.265, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.scale.set(1.0, 1.05, 0.98); // soft rounded face contour
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Soft cheeks
  const cheekMat = new THREE.MeshBasicMaterial({ color: 0xFCA5A5, transparent: true, opacity: 0.55 });
  [-0.13, 0.13].forEach((cx) => {
    const cheekMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), cheekMat);
    cheekMesh.scale.set(1.1, 0.6, 0.4);
    cheekMesh.position.set(cx, -0.035, 0.22);
    headGroup.add(cheekMesh);
  });

  // Character specific eye colors
  let irisColorHex = trimHex;
  let irisMidHex = 0x67E8F9;
  let lashColorHex = 0x0F172A;

  if (charId === 'gyanvi') {
    irisColorHex = 0x7C3AED;
    irisMidHex = 0xC4B5FD;
    lashColorHex = 0x1E1035;
  } else if (charId === 'aanya') {
    irisColorHex = 0x0D9488;
    irisMidHex = 0x22D3EE;
    lashColorHex = 0x082F3B;
  } else if (charId === 'meera') {
    irisColorHex = 0x6366F1;
    irisMidHex = 0xA5B4FC;
    lashColorHex = 0x1E1B4B;
  } else if (charId === 'riya') {
    irisColorHex = 0xD97706;
    irisMidHex = 0xFBBF24;
    lashColorHex = 0x451A03;
  } else if (charId === 'mahima') {
    irisColorHex = 0xDB2777;
    irisMidHex = 0xF472B6;
    lashColorHex = 0x4A044E;
  }

  // Large Expressive Anime Eyes (Deep CG Multi-layer Eyes with Highlights & Lashes)
  const scleraMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const irisMat = new THREE.MeshBasicMaterial({ color: irisColorHex });
  const irisGlowMat = new THREE.MeshBasicMaterial({ color: irisMidHex });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x080914 });
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const lashMat = new THREE.MeshBasicMaterial({ color: lashColorHex });

  [-0.088, 0.088].forEach((eyeX, idx) => {
    const isRight = idx === 1;

    // Sclera (White eye background)
    const sclera = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.088, 0.015), scleraMat);
    sclera.position.set(eyeX, 0.025, 0.245);
    headGroup.add(sclera);

    // Main Iris (Rich Character Accent)
    const iris = new THREE.Mesh(new THREE.BoxGeometry(0.054, 0.076, 0.02), irisMat);
    iris.position.set(eyeX, 0.022, 0.25);
    headGroup.add(iris);

    // Lower Iris Radiance / Glow
    const irisGlow = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.032, 0.022), irisGlowMat);
    irisGlow.position.set(eyeX, -0.002, 0.252);
    headGroup.add(irisGlow);

    // Deep Pupil
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.044, 0.024), pupilMat);
    pupil.position.set(eyeX, 0.025, 0.254);
    headGroup.add(pupil);

    // Specular Highlight Star / Catchlight (Top)
    const sparkleMain = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, 0.026), sparkleMat);
    sparkleMain.position.set(eyeX + (isRight ? -0.012 : 0.012), 0.045, 0.256);
    headGroup.add(sparkleMain);

    // Sub-catchlight (Bottom corner)
    const sparkleSub = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.026), sparkleMat);
    sparkleSub.position.set(eyeX + (isRight ? 0.012 : -0.012), 0.005, 0.256);
    headGroup.add(sparkleSub);

    // Upper Anime Eyelash
    const lash = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.016, 0.024), lashMat);
    lash.position.set(eyeX, 0.065, 0.255);
    lash.rotation.z = isRight ? -0.08 : 0.08;
    headGroup.add(lash);

    // Delicate Double Eyelid / Brow
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.01, 0.02), lashMat);
    brow.position.set(eyeX, 0.095, 0.245);
    brow.rotation.z = isRight ? -0.06 : 0.06;
    headGroup.add(brow);
  });

  // Small delicate cute anime nose
  const noseMat = new THREE.MeshBasicMaterial({ color: 0xF87171, transparent: true, opacity: 0.65 });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), noseMat);
  nose.position.set(0, -0.01, 0.262);
  headGroup.add(nose);

  // Subtle cute smiling mouth
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0xBE123C });
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.01, 0.018), mouthMat);
  mouth.position.set(0, -0.06, 0.255);
  headGroup.add(mouth);

  // Character-specific hairstyles & accessories
  const hairTopGeo = new THREE.SphereGeometry(0.285, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.68);
  const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
  hairTop.position.y = 0.025;
  headGroup.add(hairTop);

  // Fringe bangs
  const bangsGeo = new THREE.BoxGeometry(0.34, 0.13, 0.13);
  const bangs = new THREE.Mesh(bangsGeo, hairMat);
  bangs.position.set(0, 0.145, 0.2);
  bangs.rotation.x = 0.2;
  headGroup.add(bangs);


  if (charId === 'gyanvi') {
    // Long hair flowing down back and sides + Backpack
    const longHairGeo = new THREE.BoxGeometry(0.36, 0.65, 0.16);
    const longHair = new THREE.Mesh(longHairGeo, hairMat);
    longHair.position.set(0, -0.22, -0.16);
    headGroup.add(longHair);

    // Backpack
    const backpackMat = new THREE.MeshStandardMaterial({ color: 0x4C1D95, roughness: 0.6 });
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.18), backpackMat);
    backpack.position.set(0, 0.02, -0.22);
    torsoGroup.add(backpack);

  } else if (charId === 'aanya') {
    // Sleek Bob cut + Headphones
    const bobL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.25), hairMat);
    bobL.position.set(-0.24, -0.08, 0.02);
    const bobR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.25), hairMat);
    bobR.position.set(0.24, -0.08, 0.02);
    headGroup.add(bobL, bobR);

    // Headphones around neck/ears
    const phoneBand = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 8, 20, Math.PI), trimMat);
    phoneBand.rotation.x = Math.PI / 2;
    phoneBand.position.y = -0.06;
    headGroup.add(phoneBand);

  } else if (charId === 'meera') {
    // Wavy shoulder length + Round Glasses
    const wavyL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.5, 8), hairMat);
    wavyL.position.set(-0.22, -0.16, -0.04);
    const wavyR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.5, 8), hairMat);
    wavyR.position.set(0.22, -0.16, -0.04);
    headGroup.add(wavyL, wavyR);

    // Glasses
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xFDE047 });
    [-0.08, 0.08].forEach(gx => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.035, 0.05, 12), frameMat);
      ring.position.set(gx, 0.02, 0.25);
      headGroup.add(ring);
    });
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.01), frameMat);
    bridge.position.set(0, 0.02, 0.25);
    headGroup.add(bridge);

  } else if (charId === 'riya') {
    // High ponytail + cap visor
    const ptail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 10), hairMat);
    ptail.position.set(0, 0.28, -0.22);
    ptail.rotation.x = -1.0;
    headGroup.add(ptail);

    // Sporty visor/cap
    const capMat = new THREE.MeshStandardMaterial({ color: 0xD97706 });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.18), capMat);
    visor.position.set(0, 0.12, 0.26);
    visor.rotation.x = 0.15;
    headGroup.add(visor);

  } else if (charId === 'mahima') {
    // Twin soft ribbons + pastel hair clips
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xF472B6, emissive: 0xDB2777, emissiveIntensity: 0.4 });
    [-0.2, 0.2].forEach(rx => {
      const clip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.03), ribbonMat);
      clip.position.set(rx, 0.14, 0.2);
      clip.rotation.z = rx > 0 ? 0.3 : -0.3;
      headGroup.add(clip);

      const curl = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 8), hairMat);
      curl.position.set(rx * 1.1, -0.15, 0.02);
      curl.rotation.z = rx > 0 ? -0.2 : 0.2;
      headGroup.add(curl);
    });
  }

  torsoGroup.add(headGroup);

  // 4. Arms (Pivot at Shoulders)
  const armLGroup = new THREE.Group();
  armLGroup.position.set(-0.3, 0.24, 0);
  const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.55, 10);
  const armLMesh = new THREE.Mesh(armGeo, jacketMat);
  armLMesh.position.y = -0.25;
  armLMesh.castShadow = true;
  armLGroup.add(armLMesh);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), skinMat);
  handL.position.y = -0.54;
  armLGroup.add(handL);
  torsoGroup.add(armLGroup);

  const armRGroup = new THREE.Group();
  armRGroup.position.set(0.3, 0.24, 0);
  const armRMesh = new THREE.Mesh(armGeo, jacketMat);
  armRMesh.position.y = -0.25;
  armRMesh.castShadow = true;
  armRGroup.add(armRMesh);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), skinMat);
  handR.position.y = -0.54;
  armRGroup.add(handR);

  // Glowing Cyber Phone attached to Right Hand
  const phoneMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.14, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xF8FAFC, emissive: 0x67E8F9, emissiveIntensity: 0.8 })
  );
  phoneMesh.position.set(0, -0.54, 0.06);
  phoneMesh.visible = false;
  armRGroup.add(phoneMesh);

  torsoGroup.add(armRGroup);
  root.add(torsoGroup);

  // 5. Legs (Pivot at Hips)
  const legLGroup = new THREE.Group();
  legLGroup.position.set(-0.13, 0.68, 0);
  const legGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.68, 10);
  const legLMesh = new THREE.Mesh(legGeo, pantsMat);
  legLMesh.position.y = -0.32;
  legLMesh.castShadow = true;
  legLGroup.add(legLMesh);
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.22), shoeMat);
  shoeL.position.set(0, -0.65, 0.05);
  shoeL.castShadow = true;
  legLGroup.add(shoeL);
  root.add(legLGroup);

  const legRGroup = new THREE.Group();
  legRGroup.position.set(0.13, 0.68, 0);
  const legRMesh = new THREE.Mesh(legGeo, pantsMat);
  legRMesh.position.y = -0.32;
  legRMesh.castShadow = true;
  legRGroup.add(legRMesh);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.22), shoeMat);
  shoeR.position.set(0, -0.65, 0.05);
  shoeR.castShadow = true;
  legRGroup.add(shoeR);
  root.add(legRGroup);

  // Procedural Animation State Tracker
  let animTime = 0;

  function updateAnimation(delta: number, isMoving: boolean, speed: number, poseState: string) {
    animTime += delta * (isMoving ? 10 * speed : 3);

    if (poseState === 'victory') {
      phoneMesh.visible = false;
      armLGroup.rotation.x = -2.4;
      armLGroup.rotation.z = -0.4;
      armRGroup.rotation.x = -2.4;
      armRGroup.rotation.z = 0.4;
      legLGroup.rotation.x = 0;
      legRGroup.rotation.x = 0;
      torsoGroup.position.y = 1.0 + Math.sin(animTime * 2) * 0.08;
      headGroup.rotation.x = -0.2;
      return;
    }

    if (poseState === 'worried') {
      phoneMesh.visible = false;
      armLGroup.rotation.x = -0.8;
      armRGroup.rotation.x = -0.8;
      armLGroup.rotation.z = 0.4;
      armRGroup.rotation.z = -0.4;
      legLGroup.rotation.x = -0.2;
      legRGroup.rotation.x = 0.2;
      torsoGroup.position.y = 0.94;
      return;
    }

    if (poseState === 'phone') {
      phoneMesh.visible = true;
      armRGroup.rotation.x = -1.9;
      armRGroup.rotation.z = -0.4;
      armLGroup.rotation.x = 0;
      armLGroup.rotation.z = 0;
      torsoGroup.position.y = 1.0;
      return;
    }

    phoneMesh.visible = false;

    if (isMoving) {
      const swing = Math.sin(animTime);
      legLGroup.rotation.x = swing * 0.85;
      legRGroup.rotation.x = -swing * 0.85;

      armLGroup.rotation.x = -swing * 0.75;
      armRGroup.rotation.x = swing * 0.75;
      armLGroup.rotation.z = 0;
      armRGroup.rotation.z = 0;

      torsoGroup.position.y = 1.0 + Math.abs(Math.sin(animTime * 2)) * 0.06;
      headGroup.rotation.y = Math.sin(animTime) * 0.08;
    } else {
      const idleBob = Math.sin(animTime * 1.5) * 0.02;
      torsoGroup.position.y = 1.0 + idleBob;
      headGroup.rotation.x = Math.sin(animTime * 0.8) * 0.04;
      headGroup.rotation.y = 0;

      armLGroup.rotation.x = Math.sin(animTime) * 0.05;
      armRGroup.rotation.x = -Math.sin(animTime) * 0.05;
      armLGroup.rotation.z = 0;
      armRGroup.rotation.z = 0;

      legLGroup.rotation.x = 0;
      legRGroup.rotation.x = 0;
    }
  }

  function setOutfitColor(newOutfit: 'cyber_guardian' | 'neon_casual' | 'stealth_jacket') {
    if (newOutfit === 'neon_casual') {
      jacketMat.color.setHex(0xD946EF);
      trimMat.color.setHex(0xFDE047);
      trimMat.emissive.setHex(0xFDE047);
      pantsMat.color.setHex(0x1E1B4B);
    } else if (newOutfit === 'stealth_jacket') {
      jacketMat.color.setHex(0x1E293B);
      trimMat.color.setHex(0x67E8F9);
      trimMat.emissive.setHex(0x67E8F9);
      pantsMat.color.setHex(0x090D16);
    } else {
      jacketMat.color.setHex(0x4B7BFF);
      trimMat.color.setHex(0x67E8F9);
      trimMat.emissive.setHex(0x67E8F9);
      pantsMat.color.setHex(0x11142B);
    }
  }

  return {
    group: root,
    updateAnimation,
    setOutfitColor
  };
}
