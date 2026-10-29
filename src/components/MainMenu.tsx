import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Compass,
  ShieldAlert,
  BarChart2,
  HelpCircle,
  Settings,
  Info,
  ArrowLeft,
  Volume2,
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import { SheroLogo } from './SheroLogo';
import { soundCtrl } from '../utils/sound';
import { storage } from '../utils/storage';
import { Skyline3DBackground } from './Skyline3DBackground';

interface MainMenuProps {
  onContinue: () => void;
  onNewAdventure: () => void;
  onChooseMission: () => void;
  onOpenSafeCircle: () => void;
  onOpenProgress: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  onReturnTitle: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onContinue,
  onNewAdventure,
  onChooseMission,
  onOpenSafeCircle,
  onOpenProgress,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenCredits,
  onReturnTitle
}) => {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [isMuted, setIsMuted] = useState(soundCtrl.getMuted());
  const progress = storage.getProgress();
  const hasExistingProgress = progress.completedMissionIds.length > 0 || progress.totalRuns > 0;

  const handleToggleMute = () => {
    const muted = soundCtrl.toggleMute();
    setIsMuted(muted);
    if (!muted) soundCtrl.playSelect();
  };

  const confirmNewAdventure = () => {
    storage.resetProgress();
    setShowNewGameModal(false);
    soundCtrl.playSelect();
    onNewAdventure();
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 bg-midnight/80 backdrop-blur-sm select-none overflow-y-auto">
      {/* 3D Animated Skyline Background */}
      <Skyline3DBackground />

      {/* Background Anime Ambience Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/70 to-midnight/90" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-electricBlue/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neonLavender/15 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { soundCtrl.playSelect(); onReturnTitle(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigoDeep/80 hover:bg-darkViolet text-xs text-mutedLavender hover:text-white transition border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Title Screen</span>
          </button>
        </div>

        <SheroLogo size="sm" showSubtitle={false} />

        <button
          onClick={handleToggleMute}
          onMouseEnter={() => soundCtrl.playHover()}
          className="p-2 rounded-lg bg-indigoDeep/80 hover:bg-darkViolet border border-white/10 text-mutedLavender hover:text-white transition"
          aria-label="Sound Toggle"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-dangerRed" /> : <Volume2 className="w-4 h-4 text-successMint" />}
        </button>
      </header>

      {/* Center Grid of Real Navigation Menu Buttons */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black font-orbitron tracking-wider text-white">
            MISSION COMMAND DECK
          </h2>
          <p className="text-xs sm:text-sm text-mutedLavender mt-1">
            Choose your next tactical safety operation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Continue Adventure */}
          {hasExistingProgress ? (
            <button
              onClick={() => { soundCtrl.playSelect(); onContinue(); }}
              onMouseEnter={() => soundCtrl.playHover()}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-electricBlue/20 to-indigoDeep border border-electricBlue/50 hover:border-electricBlue hover:shadow-glow-blue transition group text-left"
            >
              <div className="p-3 rounded-lg bg-electricBlue/30 text-softCyan group-hover:scale-110 transition">
                <Play className="w-6 h-6 fill-softCyan" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-orbitron group-hover:text-softCyan transition">
                  CONTINUE ADVENTURE
                </div>
                <div className="text-xs text-mutedLavender">
                  Resume last unlocked scenario
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => { soundCtrl.playSelect(); onNewAdventure(); }}
              onMouseEnter={() => soundCtrl.playHover()}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-electricBlue/20 to-indigoDeep border border-electricBlue/50 hover:border-electricBlue hover:shadow-glow-blue transition group text-left"
            >
              <div className="p-3 rounded-lg bg-electricBlue/30 text-softCyan group-hover:scale-110 transition">
                <Play className="w-6 h-6 fill-softCyan" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-orbitron group-hover:text-softCyan transition">
                  NEW ADVENTURE
                </div>
                <div className="text-xs text-mutedLavender">
                  Begin from Mission 1: The Last Bus
                </div>
              </div>
            </button>
          )}

          {/* New Adventure Button (or reset when progress exists) */}
          {hasExistingProgress && (
            <button
              onClick={() => {
                soundCtrl.playSelect();
                setShowNewGameModal(true);
              }}
              onMouseEnter={() => soundCtrl.playHover()}
              className="flex items-center gap-4 p-4 rounded-xl bg-indigoDeep/60 hover:bg-darkViolet/80 border border-white/10 hover:border-dangerRed/50 transition group text-left"
            >
              <div className="p-3 rounded-lg bg-dangerRed/20 text-dangerRed group-hover:scale-110 transition">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-orbitron group-hover:text-dangerRed transition">
                  NEW ADVENTURE
                </div>
                <div className="text-xs text-mutedLavender">
                  Reset progress & restart campaign
                </div>
              </div>
            </button>
          )}

          {/* Choose Your Mission (World Map) */}
          <button
            onClick={() => { soundCtrl.playSelect(); onChooseMission(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="flex items-center gap-4 p-4 rounded-xl bg-indigoDeep/60 hover:bg-darkViolet/80 border border-white/10 hover:border-neonLavender/50 hover:shadow-glow-lavender transition group text-left"
          >
            <div className="p-3 rounded-lg bg-neonLavender/20 text-neonLavender group-hover:scale-110 transition">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-orbitron group-hover:text-neonLavender transition">
                CHOOSE YOUR MISSION
              </div>
              <div className="text-xs text-mutedLavender">
                Browse 7 illustrated scenario worlds
              </div>
            </div>
          </button>

          {/* SafeCircle Toolkit */}
          <button
            onClick={() => { soundCtrl.playSelect(); onOpenSafeCircle(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="flex items-center gap-4 p-4 rounded-xl bg-indigoDeep/60 hover:bg-darkViolet/80 border border-white/10 hover:border-successMint/50 hover:shadow-glow-mint transition group text-left"
          >
            <div className="p-3 rounded-lg bg-successMint/20 text-successMint group-hover:scale-110 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-orbitron group-hover:text-successMint transition">
                SAFECIRCLE TOOLKIT
              </div>
              <div className="text-xs text-mutedLavender">
                Contacts, Emergency 112, Safety Plan
              </div>
            </div>
          </button>

          {/* My Progress & Badges */}
          <button
            onClick={() => { soundCtrl.playSelect(); onOpenProgress(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="flex items-center gap-4 p-4 rounded-xl bg-indigoDeep/60 hover:bg-darkViolet/80 border border-white/10 hover:border-softCyan/50 transition group text-left"
          >
            <div className="p-3 rounded-lg bg-softCyan/20 text-softCyan group-hover:scale-110 transition">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-orbitron group-hover:text-softCyan transition">
                MY PROGRESS & BADGES
              </div>
              <div className="text-xs text-mutedLavender">
                {progress.completedMissionIds.length} / 7 Missions Cleared
              </div>
            </div>
          </button>

          {/* How to Play */}
          <button
            onClick={() => { soundCtrl.playSelect(); onOpenHowToPlay(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="flex items-center gap-4 p-4 rounded-xl bg-indigoDeep/60 hover:bg-darkViolet/80 border border-white/10 hover:border-mutedLavender transition group text-left"
          >
            <div className="p-3 rounded-lg bg-white/10 text-mutedLavender group-hover:scale-110 transition">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-orbitron group-hover:text-white transition">
                HOW TO PLAY
              </div>
              <div className="text-xs text-mutedLavender">
                Rules, 3 choices, survival logic
              </div>
            </div>
          </button>
        </div>
      </main>

      {/* Bottom Settings & Credits Navigation */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto flex justify-center gap-6 pt-4 border-t border-white/5">
        <button
          onClick={() => { soundCtrl.playSelect(); onOpenSettings(); }}
          onMouseEnter={() => soundCtrl.playHover()}
          className="flex items-center gap-2 text-xs text-mutedLavender hover:text-white transition py-1 px-3"
        >
          <Settings className="w-4 h-4 text-softCyan" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => { soundCtrl.playSelect(); onOpenCredits(); }}
          onMouseEnter={() => soundCtrl.playHover()}
          className="flex items-center gap-2 text-xs text-mutedLavender hover:text-white transition py-1 px-3"
        >
          <Info className="w-4 h-4 text-neonLavender" />
          <span>Credits</span>
        </button>
      </footer>

      {/* Confirmation Modal for Resetting Adventure */}
      {showNewGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-indigoDeep border border-dangerRed/40 shadow-glow-danger text-center">
            <div className="w-12 h-12 rounded-full bg-dangerRed/20 text-dangerRed mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-orbitron mb-2">
              Start New Adventure?
            </h3>
            <p className="text-xs sm:text-sm text-mutedLavender mb-6">
              This will reset your completed mission progress and lock later missions. You will restart from Mission 1.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowNewGameModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmNewAdventure}
                className="px-4 py-2 rounded-xl bg-dangerRed hover:bg-dangerRed/80 text-xs font-semibold text-white transition shadow-lg"
              >
                Confirm & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
