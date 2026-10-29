import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Shield, AlertTriangle, Gamepad2, Star } from 'lucide-react';
import { soundCtrl } from '../utils/sound';
import { storage } from '../utils/storage';

interface HowToPlayProps {
  onBack: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
  const heroName = storage.getSettings().heroName || 'your protagonist';

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto select-none">
      <div className="absolute inset-0 bg-midnight/78 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 flex flex-col min-h-full">
        {/* Top Header */}
        <header className="w-full max-w-3xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
          <button
            onClick={() => { soundCtrl.playSelect(); onBack(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigoDeep/80 hover:bg-darkViolet text-xs text-mutedLavender hover:text-white transition border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Main Menu</span>
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-wider flex items-center gap-2 justify-center">
              <BookOpen className="w-5 h-5 text-softCyan" />
              <span>HOW TO PLAY</span>
            </h2>
            <p className="text-xs text-mutedLavender">Gameplay Mechanics, 3-Choice Logic & Progression</p>
          </div>

          <div className="w-20" />
        </header>

        {/* Content */}
        <main className="w-full max-w-3xl mx-auto py-6 space-y-4 flex-1">
          <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold font-orbitron text-softCyan flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>1. Core Mission Structure</span>
            </h3>
            <p className="text-xs sm:text-sm text-white leading-relaxed">
              SHERO features 7 sequential fictional training scenarios. Each scenario places protagonist <span className="text-softCyan font-bold">{heroName}</span> in a real-world safety dilemma with three choices per decision point.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold font-orbitron text-successMint flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>2. Exactly Three Choices, One Winning Solution</span>
            </h3>
            <p className="text-xs sm:text-sm text-white leading-relaxed">
              At every decision node, you are presented with exactly 3 tactical options. One choice represents situational awareness, boundary protection, or safe de-escalation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold font-orbitron text-dangerRed flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>3. Strict Survival State Machine</span>
            </h3>
            <p className="text-xs sm:text-sm text-white leading-relaxed">
              An incorrect choice immediately terminates the run into Game Over with an educational explanation. A failed run never unlocks subsequent missions. You must restart the mission from the beginning to reach victory!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold font-orbitron text-neonLavender flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span>4. Controls</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-mutedLavender">
              <div className="flex items-center gap-2"><span className="font-mono text-softCyan bg-midnight px-2 py-0.5 rounded">W/A/S/D</span> Move character</div>
              <div className="flex items-center gap-2"><span className="font-mono text-softCyan bg-midnight px-2 py-0.5 rounded">E / Space</span> Interact / Assess</div>
              <div className="flex items-center gap-2"><span className="font-mono text-softCyan bg-midnight px-2 py-0.5 rounded">Mouse</span> Select choices & menus</div>
              <div className="flex items-center gap-2"><span className="font-mono text-softCyan bg-midnight px-2 py-0.5 rounded">Esc</span> Pause game</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold font-orbitron text-softCyan flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>5. Scoring & Progression</span>
            </h3>
            <p className="text-xs sm:text-sm text-white leading-relaxed">
              Earn points for mission objectives (+100), safety decisions (+50), NPC interactions (+10), and optional tips (+15). Complete missions to unlock badges, advance your SHERO level, and build your final safety report.
            </p>
          </div>
        </main>

        <footer className="w-full max-w-3xl mx-auto pt-4 text-center text-xs text-mutedLavender/50 border-t border-white/5">
          SHERO Safety Education Handbook
        </footer>
      </div>
    </div>
  );
};
