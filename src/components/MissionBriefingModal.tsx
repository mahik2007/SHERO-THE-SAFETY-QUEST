import React from 'react';
import { Compass, ShieldCheck, MapPin, Eye, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Mission } from '../../shared/types';
import { PlayableCharacter } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';
import { soundCtrl } from '../utils/sound';

interface MissionBriefingModalProps {
  mission: Mission;
  character: PlayableCharacter;
  playerName: string;
  onStart: () => void;
  onBack: () => void;
}

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  mission,
  character,
  playerName,
  onStart,
  onBack
}) => {
  const displayName = playerName?.trim() || character.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md select-none animate-fade-in text-white">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#11142B]/95 border border-white/20 shadow-2xl p-6 sm:p-8 flex flex-col gap-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-midnight font-bold font-orbitron"
              style={{ background: character.colorHex }}
            >
              0{mission.number}
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-softCyan block">
                MISSION BRIEFING & ROUTE OBJECTIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white">
                {mission.title}
              </h2>
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-orbitron font-bold"
            style={{
              background: `${character.colorHex}15`,
              borderColor: `${character.colorHex}40`,
              color: character.colorHex
            }}
          >
            <span>{character.signatureEmoji}</span>
            <span>{character.name}</span>
          </div>
        </div>

        {/* Situation & Destination Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Situation Box */}
          <div className="p-4 rounded-2xl bg-midnight/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-softCyan uppercase">
              <Eye className="w-4 h-4 text-softCyan" />
              <span>Current Situation</span>
            </div>
            <p className="text-xs sm:text-sm text-[#B9B7D6] leading-relaxed">
              {mission.summary.replace(/\bAira\b/g, displayName)}
            </p>
          </div>

          {/* Goal & Destination */}
          <div className="p-4 rounded-2xl bg-midnight/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-neonLavender uppercase">
              <MapPin className="w-4 h-4 text-neonLavender" />
              <span>Target Destination</span>
            </div>
            <div className="text-sm font-bold text-white">
              {mission.environmentName}
            </div>
            <p className="text-xs text-[#B9B7D6] leading-relaxed">
              Objective: {mission.learningGoal}
            </p>
          </div>
        </div>

        {/* Route Visual Guidance */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-midnight/90 to-indigoDeep/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-orbitron">
            <span className="text-softCyan font-bold uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Interactive Path Preview (3 Waypoints)</span>
            </span>
            <span className="text-mutedLavender font-mono">Difficulty: {mission.difficulty}</span>
          </div>

          {/* 3 Step Visual Waypoints */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="font-orbitron font-bold text-softCyan text-[11px] mb-1">NODE 01</div>
              <div className="text-[11px] text-white">Assess Setting</div>
              <div className="text-[10px] text-mutedLavender">Identify initial encounter</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="font-orbitron font-bold text-neonLavender text-[11px] mb-1">NODE 02</div>
              <div className="text-[11px] text-white">Public Safety</div>
              <div className="text-[10px] text-mutedLavender">Move to verified shelter</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="font-orbitron font-bold text-successMint text-[11px] mb-1">NODE 03</div>
              <div className="text-[11px] text-white">Safe Transit</div>
              <div className="text-[10px] text-mutedLavender">Verified departure</div>
            </div>
          </div>
        </div>

        {/* Controls Instructions Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B9B7D6]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-midnight font-mono text-softCyan font-bold">W / A / S / D</span>
            <span>Move protagonist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-midnight font-mono text-softCyan font-bold">E / Tap</span>
            <span>Interact with NPCs & Waypoint</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-midnight font-mono text-softCyan font-bold">A / B / C</span>
            <span>Make safety decisions</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              soundCtrl.playSelect();
              onBack();
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-orbitron text-mutedLavender hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
          >
            ← Change Mission
          </button>

          <button
            onClick={() => {
              soundCtrl.playVictory();
              onStart();
            }}
            className="px-8 py-3.5 rounded-xl font-orbitron font-extrabold text-xs uppercase tracking-wider text-midnight active:scale-95 transition flex items-center gap-2 shadow-glow-blue cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #67E8F9, ${character.colorHex})`
            }}
          >
            <Play className="w-4 h-4 fill-midnight" />
            <span>ENTER MISSION 0{mission.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
