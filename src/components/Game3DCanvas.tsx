import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createAira3DCharacter } from '../game3d/character3d';
import { build3DCityEnvironment, InteractiveWorldObject, CityEnvironmentId } from '../game3d/city3d';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Hand, MessageSquare, FastForward, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { soundCtrl } from '../utils/sound';
import { speechCtrl } from '../utils/speech';

import { PlayableCharacter, CHARACTERS } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';

interface Game3DCanvasProps {
  missionId: string;
  missionNumber: number;
  environmentName: string;
  nodeIndex: number;
  onReachTrigger: () => void;
  airaPose?: string;
  heroName?: string;
  selectedCharacter?: PlayableCharacter | null;
  forcedEnv?: CityEnvironmentId;
  previewMode?: boolean;
}

export const Game3DCanvas: React.FC<Game3DCanvasProps> = ({
  missionId,
  missionNumber,
  environmentName,
  nodeIndex,
  onReachTrigger,
  airaPose,
  heroName = 'Gyanvi',
  selectedCharacter,
  forcedEnv,
  previewMode = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const virtualMoveRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const triggerFiredRef = useRef<boolean>(false);

  // Nearby interactive object in range
  const [activeInteractive, setActiveInteractive] = useState<InteractiveWorldObject | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<{ speaker: string; text: string } | null>(null);

  // Cinematic opening pan state
  const [cinematicTime, setCinematicTime] = useState<number>(previewMode ? 0 : nodeIndex === 1 ? 5 : 0);
  const isCinematic = cinematicTime > 0;

  // Real-time navigation waypoint guidance
  const [waypointInfo, setWaypointInfo] = useState<{ distance: number; direction: string }>({ distance: 12, direction: 'Ahead' });

  // Refs for animation loop access without stale closure
  const activeInteractiveRef = useRef<InteractiveWorldObject | null>(null);
  activeInteractiveRef.current = activeInteractive;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    triggerFiredRef.current = false;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 360;

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Camera Setup — ISOMETRIC TOP-DOWN (non-negotiable requirement)
    // Orthographic-style perspective: high altitude, angled 60° downward
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 350);

    // 3. Environment & 3D Character
    const env = build3DCityEnvironment(missionNumber, nodeIndex, forcedEnv);
    const settings = storage.getSettings();
    const activeChar =
      selectedCharacter ||
      CHARACTERS.find(c => c.id === settings.characterId) ||
      CHARACTERS[0];
    const character = createAira3DCharacter(settings.outfit || 'cyber_guardian', activeChar);

    // Scale character UP so it's clearly visible from top-down camera
    character.group.scale.setScalar(1.5);

    // Spawn protagonist — on the sidewalk / playable zone
    const startX = nodeIndex === 1 ? (env.environmentId === 'bus_stop' ? 8 : 12) : nodeIndex === 2 ? 0 : -12;
    const startZ = env.environmentId === 'the_alley' ? -1.5 : -6.0;
    character.group.position.set(startX, 0, startZ);
    character.group.rotation.y = -Math.PI / 2;
    env.scene.add(character.group);

    // Player glow indicator beneath character (visible from top-down)
    const glowRingGeo = new THREE.CircleGeometry(0.9, 32);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: parseInt((activeChar.colorHex || '#67E8F9').replace('#', ''), 16),
      transparent: true,
      opacity: 0.5
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.set(startX, 0.03, startZ);
    env.scene.add(glowRing);

    // Outer shadow ring
    const shadowRingGeo = new THREE.CircleGeometry(1.15, 32);
    const shadowRingMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35
    });
    const shadowRing = new THREE.Mesh(shadowRingGeo, shadowRingMat);
    shadowRing.rotation.x = -Math.PI / 2;
    shadowRing.position.set(startX, 0.02, startZ);
    env.scene.add(shadowRing);

    // ISOMETRIC camera initial position:
    // Camera sits at ~22 units above and ~18 units behind, looking at a slight angle
    const isoOffsetY = 22;
    const isoOffsetZ = 16;
    const isoOffsetX = 0;
    if (cinematicTime > 0) {
      // Cinematic: Start far overhead, pan in
      camera.position.set(startX + 30, 35, startZ + 28);
      camera.lookAt(startX, 0, startZ);
    } else {
      camera.position.set(startX + isoOffsetX, isoOffsetY, startZ + isoOffsetZ);
      camera.lookAt(startX, 0, startZ);
    }

    // 4. Movement Keys State
    const keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') keys.up = true;
      if (code === 'KeyS' || code === 'ArrowDown') keys.down = true;
      if (code === 'KeyA' || code === 'ArrowLeft') keys.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') keys.right = true;
      if (code === 'KeyE' || code === 'Space') {
        if (activeInteractiveRef.current) {
          triggerInteract(activeInteractiveRef.current);
        } else {
          onReachTrigger();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') keys.up = false;
      if (code === 'KeyS' || code === 'ArrowDown') keys.down = false;
      if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 5. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Game Loop
    let lastTime = performance.now();
    let animFrameId: number;
    let footstepCounter = 0;
    let currentCinematicRemain = cinematicTime;
    let time = 0;

    const charBoundingBox = new THREE.Box3();
    const charSize = new THREE.Vector3(0.7, 1.8, 0.7);

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta;

      // Update 3D environment (traffic, pedestrians, lights)
      env.update(delta);

      // Handle cinematic countdown
      if (currentCinematicRemain > 0) {
        currentCinematicRemain -= delta;
        if (currentCinematicRemain <= 0) {
          setCinematicTime(0);
        }
      }

      // Movement vector calculation
      let moveX = 0;
      let moveZ = 0;

      if (keys.left) moveX -= 1;
      if (keys.right) moveX += 1;
      if (keys.up) moveZ -= 1;
      if (keys.down) moveZ += 1;

      // Virtual Joystick on touch/mobile
      if (virtualMoveRef.current.x !== 0 || virtualMoveRef.current.y !== 0) {
        moveX = virtualMoveRef.current.x;
        moveZ = virtualMoveRef.current.y;
      }

      const isMoving = (moveX !== 0 || moveZ !== 0) && currentCinematicRemain <= 0;
      const speed = 7.5;

      if (isMoving && !triggerFiredRef.current) {
        const angle = Math.atan2(moveX, moveZ);
        character.group.rotation.y = angle;

        const nextX = character.group.position.x + Math.sin(angle) * speed * delta;
        const nextZ = character.group.position.z + Math.cos(angle) * speed * delta;

        // Footstep audio pulse
        footstepCounter += delta;
        if (footstepCounter > 0.32) {
          soundCtrl.playFootstep();
          footstepCounter = 0;
        }

        // Collision check with world obstacles
        charBoundingBox.setFromCenterAndSize(new THREE.Vector3(nextX, 0.9, nextZ), charSize);
        let collides = false;
        for (const obs of env.obstacles) {
          if (obs.intersectsBox(charBoundingBox)) {
            collides = true;
            break;
          }
        }

        // Clamp to playable world bounds
        const maxBoundZ = env.environmentId === 'the_alley' ? 4 : 12;
        const minBoundZ = env.environmentId === 'the_alley' ? -4 : -12;
        if (!collides && nextX >= -70 && nextX <= 70 && nextZ >= minBoundZ && nextZ <= maxBoundZ) {
          character.group.position.x = nextX;
          character.group.position.z = nextZ;
        }

        // Check proximity to target waypoint beacon
        if (!triggerFiredRef.current && env.triggerBox.intersectsBox(charBoundingBox)) {
          triggerFiredRef.current = true;
          onReachTrigger();
        }
      }

      // Update distance and direction to waypoint beacon
      const dx = env.triggerMesh.position.x - character.group.position.x;
      const dz = env.triggerMesh.position.z - character.group.position.z;
      const dist = Math.round(Math.sqrt(dx * dx + dz * dz));
      const dirText = dx < -1.5 ? '← West' : dx > 1.5 ? 'East →' : 'Directly Ahead';
      if (Math.floor(time * 5) % 3 === 0) {
        setWaypointInfo({ distance: Math.max(1, dist), direction: dirText });
      }

      // Proximity check for interactive world objects (NPCs, shops, route board)
      const playerPos = character.group.position;
      let closestObj: InteractiveWorldObject | null = null;
      let closestDist = Infinity;

      for (const obj of env.interactiveObjects) {
        const dist = playerPos.distanceTo(obj.position);
        if (dist <= obj.radius && dist < closestDist) {
          closestDist = dist;
          closestObj = obj;
        }
      }

      if (closestObj !== activeInteractiveRef.current) {
        setActiveInteractive(closestObj);
        if (closestObj) {
          soundCtrl.playInteractPrompt();
        }
      }

      // Update 3D Character animation states
      character.updateAnimation(delta, isMoving, 1.0, airaPose || 'walk');

      // Sync glow indicator rings to player position
      glowRing.position.x = character.group.position.x;
      glowRing.position.z = character.group.position.z;
      shadowRing.position.x = character.group.position.x;
      shadowRing.position.z = character.group.position.z;

      // Pulse the glow ring with time for visual effect
      const pulseFactor = 0.45 + Math.sin(time * 5) * 0.08;
      glowRingMat.opacity = pulseFactor;

      // ── ISOMETRIC TOP-DOWN CAMERA ──────────────────────────────────────────
      // Camera stays at fixed offset above+behind player, always looking down
      const isoY = 22;
      const isoZ = 16;
      const isoX = 0;

      if (currentCinematicRemain > 0) {
        // Smooth cinematic sweep: far overhead bird's-eye → isometric position
        const progress = 1 - currentCinematicRemain / 5;
        const camX = THREE.MathUtils.lerp(character.group.position.x + 30, character.group.position.x + isoX, progress);
        const camY = THREE.MathUtils.lerp(35, isoY, progress);
        const camZ = THREE.MathUtils.lerp(character.group.position.z + 28, character.group.position.z + isoZ, progress);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(character.group.position.x, 0, character.group.position.z);
      } else {
        // Smooth follow in isometric lock
        const targetCamPos = new THREE.Vector3(
          character.group.position.x + isoX,
          isoY,
          character.group.position.z + isoZ
        );
        camera.position.lerp(targetCamPos, 0.10);
        camera.lookAt(
          character.group.position.x,
          0,
          character.group.position.z
        );
      }

      renderer.render(env.scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [missionId, nodeIndex, forcedEnv]);

  // Touch Virtual Controls
  const handleTouchMove = (vx: number, vy: number) => {
    virtualMoveRef.current = { x: vx, y: vy };
  };

  const handleTouchEnd = () => {
    virtualMoveRef.current = { x: 0, y: 0 };
  };

  const triggerInteract = (obj: InteractiveWorldObject) => {
    soundCtrl.playSelect();
    setActiveDialogue({
      speaker: obj.dialogueSpeaker,
      text: obj.dialogueText
    });
    speechCtrl.speak(`${obj.dialogueSpeaker} says: ${obj.dialogueText}`);
  };

  const skipCinematic = () => {
    soundCtrl.playSelect();
    setCinematicTime(0);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-midnight select-none group">
      {/* Three.js 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-[320px] sm:h-[420px] md:h-[480px] bg-[#04061A]" />

      {/* Cinematic Opening Sequence Banner Overlay (Part C requirement) */}
      {isCinematic && (
        <div className="absolute inset-0 bg-midnight/60 backdrop-blur-sm z-30 flex flex-col justify-between p-6 sm:p-8 animate-fade-in pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-softCyan tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-softCyan animate-ping" />
              <span>CINEMATIC CITY REVEAL // {environmentName.toUpperCase()}</span>
            </span>
            <button
              onClick={skipCinematic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-orbitron font-bold text-white transition active:scale-95"
            >
              <span>SKIP INTRO</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-w-xl mx-auto text-center space-y-2 p-6 rounded-2xl bg-indigoDeep/90 border border-electricBlue/40 shadow-glow-blue">
            <h3 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-wide">
              WELCOME, {heroName.toUpperCase()}
            </h3>
            <p className="text-sm sm:text-base text-softCyan leading-relaxed italic">
              "The city is full of stories. Your choices will shape the journey ahead."
            </p>
            <p className="text-xs text-mutedLavender pt-1">
              Use W/A/S/D to move through the city. Approach the rotating ◈ beacon. Press E or tap INTERACT to talk to NPCs.
            </p>
          </div>

          <div className="text-center text-[11px] font-mono text-mutedLavender">
            Initialising Living Scene Perspective...
          </div>
        </div>
      )}

      {/* Control Tutorial / 3D HUD Overlay */}
      {!isCinematic && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-midnight/85 border border-white/15 backdrop-blur-md text-[11px] font-mono text-softCyan">
            <span className="w-2 h-2 rounded-full bg-successMint animate-pulse" />
            <span>TOP-DOWN · WASD MOVE · APPROACH BEACON (!) · [E] INTERACT</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigoDeep/90 border border-electricBlue/40 backdrop-blur-md text-[11px] font-mono text-white shadow-md">
            <span className="text-softCyan font-bold">WAYPOINT:</span>
            <span className="text-champagneGold font-bold">{waypointInfo.distance}m</span>
            <span className="text-mutedLavender">({waypointInfo.direction})</span>
          </div>
        </div>
      )}

      {/* Active Dialogue Bubble from Interacted World Object */}
      {activeDialogue && (
        <div className="absolute top-12 left-4 right-4 sm:left-12 sm:right-12 z-20 p-4 rounded-xl bg-indigoDeep/95 border-l-4 border-softCyan shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            {selectedCharacter && (
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-midnight/80 border border-softCyan/40 shrink-0 shadow-lg">
                <CharacterPortrait char={selectedCharacter} size={44} headOnly pose="talking" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold font-orbitron text-softCyan block mb-0.5">
                {activeDialogue.speaker}:
              </span>
              <p className="text-xs sm:text-sm text-white italic leading-relaxed">
                {activeDialogue.text}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveDialogue(null)}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-xs text-mutedLavender hover:text-white shrink-0"
          >
            ✕
          </button>
        </div>
      )}


      {/* Proximity Interaction Prompt Banner (Part E requirement) */}
      {activeInteractive && !activeDialogue && !isCinematic && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-electricBlue text-midnight font-orbitron font-bold text-xs tracking-wider shadow-glow-blue border border-cyan-300 animate-bounce cursor-pointer"
          onClick={() => triggerInteract(activeInteractive)}
        >
          <MessageSquare className="w-4 h-4 fill-midnight" />
          <span>{activeInteractive.promptText}</span>
        </div>
      )}

      {/* Touch / On-screen Controls Overlay for Mobile & Tablet */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto sm:opacity-85 sm:hover:opacity-100 transition-opacity">
        {/* 3D 4-Way D-Pad */}
        <div className="grid grid-cols-3 gap-1 bg-midnight/85 p-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
          <div />
          <button
            onMouseDown={() => handleTouchMove(0, -1)}
            onMouseUp={handleTouchEnd}
            onTouchStart={() => handleTouchMove(0, -1)}
            onTouchEnd={handleTouchEnd}
            className="p-2 rounded-lg bg-indigoDeep/90 active:bg-electricBlue border border-white/10 text-white shadow-md active:scale-95 transition flex items-center justify-center"
            aria-label="Move Forward"
          >
            <ArrowUp className="w-4 h-4 text-softCyan" />
          </button>
          <div />
          <button
            onMouseDown={() => handleTouchMove(-1, 0)}
            onMouseUp={handleTouchEnd}
            onTouchStart={() => handleTouchMove(-1, 0)}
            onTouchEnd={handleTouchEnd}
            className="p-2 rounded-lg bg-indigoDeep/90 active:bg-electricBlue border border-white/10 text-white shadow-md active:scale-95 transition flex items-center justify-center"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-4 h-4 text-softCyan" />
          </button>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-softCyan/60" />
          </div>
          <button
            onMouseDown={() => handleTouchMove(1, 0)}
            onMouseUp={handleTouchEnd}
            onTouchStart={() => handleTouchMove(1, 0)}
            onTouchEnd={handleTouchEnd}
            className="p-2 rounded-lg bg-indigoDeep/90 active:bg-electricBlue border border-white/10 text-white shadow-md active:scale-95 transition flex items-center justify-center"
            aria-label="Move Right"
          >
            <ArrowRight className="w-4 h-4 text-softCyan" />
          </button>
          <div />
          <button
            onMouseDown={() => handleTouchMove(0, 1)}
            onMouseUp={handleTouchEnd}
            onTouchStart={() => handleTouchMove(0, 1)}
            onTouchEnd={handleTouchEnd}
            className="p-2 rounded-lg bg-indigoDeep/90 active:bg-electricBlue border border-white/10 text-white shadow-md active:scale-95 transition flex items-center justify-center"
            aria-label="Move Backward"
          >
            <ArrowDown className="w-4 h-4 text-softCyan" />
          </button>
          <div />
        </div>

        {/* Action Button: Interact & Trigger */}
        <div className="flex items-center gap-2 bg-midnight/85 p-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
          {activeInteractive ? (
            <button
              onClick={() => triggerInteract(activeInteractive)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-successMint to-softCyan active:scale-95 hover:shadow-glow-mint border border-emerald-300 font-orbitron font-bold text-xs text-midnight shadow-lg transition"
              aria-label="Interact"
            >
              <MessageSquare className="w-4 h-4" />
              <span>INTERACT</span>
            </button>
          ) : (
            <button
              onClick={() => onReachTrigger()}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-electricBlue to-neonLavender active:scale-95 hover:shadow-glow-blue border border-cyan-300 font-orbitron font-bold text-xs text-white shadow-lg transition"
              aria-label="Assess Situation"
            >
              <Hand className="w-4 h-4 text-softCyan" />
              <span>ASSESS WAYPOINT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
