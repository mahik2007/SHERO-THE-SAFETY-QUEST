import React from 'react';
import { ArrowLeft, Trophy, Award, Target, Zap, RotateCcw } from 'lucide-react';
import { storage } from '../utils/storage';
import { MISSIONS } from '../../shared/missionsData';
import { soundCtrl } from '../utils/sound';
import { personalizeText } from '../utils/player';

interface ProgressViewProps {
  onBack: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onBack }) => {
  const progress = storage.getProgress();
  const settings = storage.getSettings();
  const heroName = settings.heroName || 'Hero';

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your mission statistics and earned badges?')) {
      storage.resetProgress();
      soundCtrl.playSelect();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-y-auto select-none">
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-[1px] pointer-events-none" />
      {/* Background Ambience overlaid over city world */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-neonLavender/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={() => { soundCtrl.playSelect(); onBack(); }}
          onMouseEnter={() => soundCtrl.playHover()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigoDeep/80 hover:bg-darkViolet text-xs text-mutedLavender hover:text-white transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-wider">
            {heroName.toUpperCase()}'S PROGRESS & BADGES
          </h2>
          <p className="text-xs text-mutedLavender">
            Telemetry, Earned Accolades & Safety Milestones for {heroName}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-dangerRed/80 hover:text-dangerRed transition p-2"
          title="Reset statistics"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Stats</span>
        </button>
      </header>

      {/* Main Stats Grid */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-auto py-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-indigoDeep/80 border border-white/10 text-center">
            <Trophy className="w-6 h-6 text-softCyan mx-auto mb-2" />
            <div className="text-2xl font-black font-orbitron text-white">
              {progress.completedMissionIds.length} / 7
            </div>
            <div className="text-[11px] text-mutedLavender mt-0.5">Missions Cleared</div>
          </div>

          <div className="p-4 rounded-xl bg-indigoDeep/80 border border-white/10 text-center">
            <Award className="w-6 h-6 text-neonLavender mx-auto mb-2" />
            <div className="text-2xl font-black font-orbitron text-white">
              {progress.earnedBadges.length}
            </div>
            <div className="text-[11px] text-mutedLavender mt-0.5">Badges Earned</div>
          </div>

          <div className="p-4 rounded-xl bg-indigoDeep/80 border border-white/10 text-center">
            <Zap className="w-6 h-6 text-successMint mx-auto mb-2" />
            <div className="text-2xl font-black font-orbitron text-white">
              {progress.successfulRuns}
            </div>
            <div className="text-[11px] text-mutedLavender mt-0.5">Successful Runs</div>
          </div>

          <div className="p-4 rounded-xl bg-indigoDeep/80 border border-white/10 text-center">
            <Target className="w-6 h-6 text-dangerRed mx-auto mb-2" />
            <div className="text-2xl font-black font-orbitron text-white">
              {progress.failedRuns}
            </div>
            <div className="text-[11px] text-mutedLavender mt-0.5">Failed Runs (Learnings)</div>
          </div>
        </div>

        {/* Badges Showcase Grid */}
        <div className="p-6 rounded-2xl bg-indigoDeep/80 border border-white/10">
          <h3 className="text-base font-bold font-orbitron text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-neonLavender" />
            <span>Mission Accolades & Badges</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MISSIONS.map(mission => {
              const hasBadge = progress.earnedBadges.some(b => b.missionId === mission.id);

              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                    hasBadge
                      ? 'bg-midnight/80 border-successMint/40 shadow-glow-mint/20'
                      : 'bg-midnight/30 border-white/5 opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      hasBadge ? 'bg-successMint/20 text-successMint' : 'bg-white/5 text-mutedLavender'
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="text-xs font-bold font-orbitron text-white">
                      {mission.badgeName}
                    </div>
                    <div className="text-[11px] text-softCyan mb-1">
                      Mission 0{mission.number}
                    </div>
                    <p className="text-[11px] text-mutedLavender line-clamp-2">
                      {personalizeText(mission.badgeDescription, heroName)}
                    </p>
                    {hasBadge ? (
                      <span className="inline-block mt-2 text-[10px] font-mono text-successMint bg-successMint/10 px-2 py-0.5 rounded">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="inline-block mt-2 text-[10px] font-mono text-mutedLavender bg-white/5 px-2 py-0.5 rounded">
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 text-center text-xs text-mutedLavender/50 border-t border-white/5">
        Local State Persistent Engine // SHERO Statistics
      </footer>
    </div>
  );
};
