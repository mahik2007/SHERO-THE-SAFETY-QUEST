import React from 'react';
import { ArrowLeft, Lock, CheckCircle2, Play, Trophy, Sparkles } from 'lucide-react';
import { MISSIONS } from '../../shared/missionsData';
import { Mission } from '../../shared/types';
import { storage } from '../utils/storage';
import { soundCtrl } from '../utils/sound';
import { personalizeText } from '../utils/player';

interface MissionSelectProps {
  onSelectMission: (mission: Mission) => void;
  onBack: () => void;
}

export const MissionSelectWorld: React.FC<MissionSelectProps> = ({
  onSelectMission,
  onBack
}) => {
  const progress = storage.getProgress();
  const settings = storage.getSettings();
  const heroName = settings.heroName || 'Hero';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 bg-midnight/80 select-none overflow-y-auto backdrop-blur-[1px]">
      {/* Semi-transparent cinematic overlay — lets PersistentCityWorld show through */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft color tones that blend with city world behind */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/85 via-midnight/70 to-midnight/90" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-indigoDeep/60 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-electricBlue/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-darkViolet/20 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
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
            <span>MISSION SELECTION WORLD</span>
            <Sparkles className="w-4 h-4 text-softCyan" />
          </h2>
          <p className="text-xs text-mutedLavender">
            Protagonist: <span className="font-orbitron font-bold text-softCyan">{heroName}</span> // Complete each scenario to unlock the next operation
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-darkViolet/80 border border-neonLavender/30 text-neonLavender flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-softCyan" />
          <span>{progress.completedMissionIds.length} / 7 Completed</span>
        </div>
      </header>

      {/* 7 Illustrated Mission Cards Grid */}
      <main className="relative z-10 w-full max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MISSIONS.map(mission => {
            const isUnlocked = progress.unlockedMissionIds.includes(mission.id);
            const isCompleted = progress.completedMissionIds.includes(mission.id);
            const bestScore = progress.highScores[mission.id] || 0;

            return (
              <div
                key={mission.id}
                className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  !isUnlocked
                    ? 'bg-indigoDeep/30 border-white/5 opacity-60'
                    : isCompleted
                    ? 'bg-gradient-to-b from-indigoDeep/90 to-darkViolet/80 border-successMint/40 shadow-glow-mint/30 hover:scale-[1.02]'
                    : 'bg-gradient-to-b from-indigoDeep/90 to-darkViolet/90 border-electricBlue/40 shadow-glow-blue/40 hover:scale-[1.02]'
                }`}
              >
                {/* Visual Header Banner */}
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-orbitron font-extrabold text-xs px-2.5 py-1 rounded-full bg-white/10 text-softCyan tracking-wider">
                      MISSION 0{mission.number}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-successMint bg-successMint/10 px-2 py-0.5 rounded-md border border-successMint/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-mutedLavender bg-white/5 px-2 py-0.5 rounded-md">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-softCyan bg-electricBlue/20 px-2 py-0.5 rounded-md border border-electricBlue/40">
                        Ready
                      </span>
                    )}
                  </div>

                  {/* Title and Environment */}
                  <h3 className="text-lg font-bold font-orbitron text-white group-hover:text-softCyan transition">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-softCyan/90 font-medium mt-0.5">
                    {mission.environmentName}
                  </p>
                </div>

                {/* Scenario Summary */}
                <div className="px-5 py-2">
                  <p className="text-xs text-mutedLavender leading-relaxed line-clamp-3">
                    {personalizeText(mission.summary, heroName)}
                  </p>

                  {/* Badge & Difficulty Tags */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-darkViolet text-neonLavender font-mono">
                      {mission.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-mutedLavender">
                      Badge: {mission.badgeName}
                    </span>
                    {bestScore > 0 && (
                      <span className="ml-auto text-successMint font-mono font-semibold">
                        Best: {bestScore} pts
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-3">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundCtrl.playSelect();
                        onSelectMission(mission);
                      }}
                      onMouseEnter={() => soundCtrl.playHover()}
                      className={`w-full py-2.5 px-4 rounded-xl font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition ${
                        isCompleted
                          ? 'bg-successMint/20 hover:bg-successMint/30 text-successMint border border-successMint/40'
                          : 'bg-electricBlue hover:bg-electricBlue/90 text-midnight shadow-glow-blue'
                      }`}
                    >
                      <Play className={`w-3.5 h-3.5 ${isCompleted ? 'fill-successMint' : 'fill-midnight'}`} />
                      <span>{isCompleted ? 'REPLAY MISSION' : 'START MISSION'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 text-mutedLavender/50 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Mission 0{mission.number - 1} to Unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-6xl mx-auto pt-6 text-center text-xs text-mutedLavender/60 border-t border-white/5">
        SHERO Safety Engine // Real-time Mission State Active
      </footer>
    </div>
  );
};
