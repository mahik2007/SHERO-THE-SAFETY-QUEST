import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { QuestScene, QuestSceneInitData } from '../game/QuestScene';
import { CharacterPaletteData } from '../game/airaSpritesheet';
import { ArrowLeft, ArrowRight, ArrowUp, Hand, Smartphone } from 'lucide-react';

interface PhaserGameCanvasProps {
  missionId: string;
  missionNumber: number;
  environmentName: string;
  nodeIndex: number;
  onReachTrigger: () => void;
  airaPose?: string;
  heroName?: string;
  allowDirectMove?: boolean;
  selectedCharacter?: CharacterPaletteData | null;
}

export const PhaserGameCanvas: React.FC<PhaserGameCanvasProps> = ({
  missionId,
  missionNumber,
  environmentName,
  nodeIndex,
  onReachTrigger,
  airaPose,
  heroName,
  selectedCharacter
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 340,
      backgroundColor: '#080B18',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [QuestScene]
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Start QuestScene with initial parameters
    game.scene.start('QuestScene', {
      missionId,
      missionNumber,
      environmentName,
      nodeIndex,
      onReachTrigger,
      heroName: heroName || 'Gyanvi',
      character: selectedCharacter || null
    } as QuestSceneInitData);

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [missionId, nodeIndex]);

  // Sync character pose when decision outcome changes
  useEffect(() => {
    if (airaPose) {
      window.dispatchEvent(new CustomEvent('shero_set_pose', { detail: { pose: airaPose } }));
    }
  }, [airaPose]);

  // Touch controls dispatchers
  const handleTouchMove = (vx: number, vy: number) => {
    window.dispatchEvent(new CustomEvent('shero_virtual_move', { detail: { vx, vy } }));
  };

  const handleTouchEnd = () => {
    window.dispatchEvent(new CustomEvent('shero_virtual_move', { detail: { vx: 0, vy: 0 } }));
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-midnight select-none group">
      {/* Phaser Canvas Container */}
      <div ref={containerRef} className="w-full h-72 sm:h-80 md:h-[340px] flex items-center justify-center bg-midnight" />

      {/* Control Tutorial / HUD Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-midnight/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-softCyan pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-successMint animate-pulse" />
        <span>ISOMETRIC 2.5D: [W/A/S/D / ARROWS] TO EXPLORE | APPROACH NPC OR TRIGGER (!)</span>
      </div>

      {/* Touch / On-screen Controls Overlay for Mobile & Tablet */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto sm:opacity-75 sm:hover:opacity-100 transition-opacity">
        {/* Isometric 4-Way D-Pad */}
        <div className="grid grid-cols-3 gap-1 bg-midnight/80 p-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
          <div />
          <button
            onMouseDown={() => handleTouchMove(0, -1)}
            onMouseUp={handleTouchEnd}
            onTouchStart={() => handleTouchMove(0, -1)}
            onTouchEnd={handleTouchEnd}
            className="p-2 rounded-lg bg-indigoDeep/90 active:bg-electricBlue border border-white/10 text-white shadow-md active:scale-95 transition flex items-center justify-center"
            aria-label="Move Up"
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
            aria-label="Move Down"
          >
            <ArrowUp className="w-4 h-4 text-softCyan rotate-180" />
          </button>
          <div />
        </div>

        {/* Action Pad: Interact & Trigger */}
        <div className="flex items-center gap-2 bg-midnight/80 p-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
          <button
            onClick={() => onReachTrigger()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-electricBlue to-neonLavender active:scale-95 hover:shadow-glow-blue border border-cyan-300 font-orbitron font-bold text-xs text-white shadow-lg transition"
            aria-label="Interact"
          >
            <Hand className="w-4 h-4 text-softCyan" />
            <span>INTERACT / ASSESS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
