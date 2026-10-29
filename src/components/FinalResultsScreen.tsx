import React, { useState, useEffect } from 'react';
import {
  Trophy, Star, Shield, RotateCcw, ArrowRight,
  Award, Sparkles, TrendingUp, CheckCircle, BookOpen
} from 'lucide-react';
import { storage } from '../utils/storage';
import { soundCtrl } from '../utils/sound';
import type { PlayableCharacter } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';

interface FinalResultsProps {
  playerName: string;
  selectedCharacter: PlayableCharacter | null;
  onPlayAgain: () => void;
  onReturnMenu: () => void;
}

const LEVEL_THRESHOLDS = [
  { min: 0,    label: 'New Explorer',          color: '#B9B7D6' },
  { min: 500,  label: 'Alert Observer',         color: '#67E8F9' },
  { min: 1500, label: 'Smart Navigator',        color: '#A78BFA' },
  { min: 3000, label: 'Confident Decision-Maker', color: '#FBBF24' },
  { min: 5000, label: 'SHERO Champion',         color: '#65F5C5' },
];

function getLevel(totalScore: number) {
  let level = LEVEL_THRESHOLDS[0];
  for (const l of LEVEL_THRESHOLDS) {
    if (totalScore >= l.min) level = l;
  }
  return level;
}

const SAFETY_TIPS = [
  'Always stay in well-lit, populated areas when waiting for transit.',
  'Share your live location with a trusted contact when commuting late.',
  'Trust your instincts — if something feels wrong, act on that feeling.',
  'Position yourself near transit staff or cashier counters when alone.',
  'Board through front doors and sit near the driver on public transport.',
  'Never share real-time location on public social media.',
  'Memorize key emergency numbers and keep them accessible.',
  'Identify safe havens — 24H pharmacies, staffed cafes, transit offices.',
];

export const FinalResultsScreen: React.FC<FinalResultsProps> = ({
  playerName,
  selectedCharacter,
  onPlayAgain,
  onReturnMenu
}) => {
  const progress = storage.getProgress();
  const totalScore = Object.values(progress.highScores).reduce((a, b) => a + b, 0);
  const level = getLevel(totalScore);
  const safetyScore = Math.min(100, Math.round(
    (progress.successfulRuns / Math.max(progress.totalRuns, 1)) * 100
  ));
  const missionsCompleted = progress.completedMissionIds.length;
  const badgesEarned = progress.earnedBadges.length;

  // Animated score counter
  const [displayScore, setDisplayScore] = useState(0);
  const [displaySafety, setDisplaySafety] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    soundCtrl.playVictory();
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    let start = 0;
    const step = Math.ceil(totalScore / 60);
    const id = setInterval(() => {
      start = Math.min(start + step, totalScore);
      setDisplayScore(start);
      if (start >= totalScore) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [showContent, totalScore]);

  useEffect(() => {
    if (!showContent) return;
    let s = 0;
    const id = setInterval(() => {
      s = Math.min(s + 2, safetyScore);
      setDisplaySafety(s);
      if (s >= safetyScore) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [showContent, safetyScore]);

  const starRating = Math.min(5, Math.round(missionsCompleted / 1.4));

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto">
      {/* Semi-transparent overlay preserving city world */}
      <div className="absolute inset-0 bg-midnight/75 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        {/* ── HERO HEADER ── */}
        <div
          className="text-center mb-8 p-6 sm:p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #11142B 0%, #20133F 50%, #11142B 100%)',
            border: '1.5px solid rgba(167,139,250,0.4)',
            boxShadow: '0 0 60px rgba(101,245,197,0.2)'
          }}
        >
          {/* Animated trophy */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0F2815, #065F46)',
                boxShadow: '0 0 40px rgba(101,245,197,0.5)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Trophy className="w-12 h-12 text-successMint" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-successMint/10 border border-successMint/30 text-xs font-orbitron font-bold text-successMint tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOURNEY COMPLETE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-orbitron text-white tracking-wide mb-2">
            {missionsCompleted >= 5 ? 'CAMPAIGN COMPLETED!' : 'YOUR SAFETY QUEST'}
          </h1>
          <p className="text-lg font-orbitron text-successMint">
            {playerName ? `${playerName}, your story continues.` : 'Your story continues.'}
          </p>
          {selectedCharacter && (
            <div className="flex flex-col items-center justify-center mt-3 mb-2">
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden p-1 shadow-2xl border-2 flex items-center justify-center"
                style={{
                  background: selectedCharacter.bgGradient,
                  borderColor: selectedCharacter.borderColor,
                  boxShadow: `0 0 25px ${selectedCharacter.glowHex}`
                }}
              >
                <CharacterPortrait char={selectedCharacter} size={92} headOnly pose="happy" />
              </div>
              <p className="text-sm text-mutedLavender mt-2">
                Heroine: <span className="text-white font-bold">{selectedCharacter.name}</span> — {selectedCharacter.title}
              </p>
            </div>
          )}


          {/* Star rating */}
          <div className="flex justify-center gap-2 mt-4">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                className="w-7 h-7"
                fill={i <= starRating ? '#FBBF24' : 'transparent'}
                stroke={i <= starRating ? '#FBBF24' : '#374151'}
              />
            ))}
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: Trophy,
              label: 'Total Score',
              value: displayScore.toLocaleString(),
              sub: 'points earned',
              color: '#65F5C5',
              bg: 'rgba(101,245,197,0.08)',
              border: 'rgba(101,245,197,0.25)'
            },
            {
              icon: Shield,
              label: 'Safety Awareness',
              value: `${displaySafety}%`,
              sub: 'decision accuracy',
              color: '#67E8F9',
              bg: 'rgba(103,232,249,0.08)',
              border: 'rgba(103,232,249,0.25)'
            },
            {
              icon: CheckCircle,
              label: 'Missions Done',
              value: `${missionsCompleted}/7`,
              sub: 'scenarios cleared',
              color: '#A78BFA',
              bg: 'rgba(167,139,250,0.08)',
              border: 'rgba(167,139,250,0.25)'
            },
            {
              icon: Award,
              label: 'Badges Earned',
              value: badgesEarned.toString(),
              sub: 'achievements unlocked',
              color: '#FBBF24',
              bg: 'rgba(251,191,36,0.08)',
              border: 'rgba(251,191,36,0.25)'
            }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-4 flex flex-col items-center text-center gap-2"
                style={{ background: stat.bg, border: `1.5px solid ${stat.border}` }}
              >
                <Icon className="w-7 h-7" style={{ color: stat.color }} />
                <div className="text-2xl font-black font-orbitron" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-mutedLavender uppercase tracking-wider">{stat.label}</div>
                <div className="text-[9px] text-mutedLavender/60">{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── LEVEL & XP ── */}
        <div
          className="rounded-2xl p-5 mb-6 flex items-center gap-4"
          style={{ background: '#11142B', border: '1.5px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${level.color}18`, border: `2px solid ${level.color}` }}
          >
            <TrendingUp className="w-7 h-7" style={{ color: level.color }} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-mono text-mutedLavender uppercase tracking-wider mb-0.5">Current Level</div>
            <div className="text-xl font-black font-orbitron" style={{ color: level.color }}>
              {level.label}
            </div>
            <div className="mt-2 w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (totalScore / 6000) * 100)}%`,
                  background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`
                }}
              />
            </div>
            <div className="text-[10px] text-mutedLavender mt-0.5">
              {totalScore.toLocaleString()} XP total
              {totalScore < 5000 && ` · ${(5000 - totalScore).toLocaleString()} to SHERO Champion`}
            </div>
          </div>
        </div>

        {/* ── BADGES ── */}
        {progress.earnedBadges.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: '#11142B', border: '1.5px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-neonLavender" />
              <h3 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider">
                Badges Unlocked
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {progress.earnedBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(167,139,250,0.1)',
                    border: '1px solid rgba(167,139,250,0.3)'
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-neonLavender/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-neonLavender" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-orbitron text-neonLavender">{badge.badgeName}</div>
                    <div className="text-[9px] text-mutedLavender">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SAFETY TIPS LEARNED ── */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: '#11142B', border: '1.5px solid rgba(103,232,249,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-softCyan" />
            <h3 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider">
              Key Safety Lessons Encountered
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAFETY_TIPS.slice(0, Math.max(4, missionsCompleted * 2)).map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(103,232,249,0.05)', border: '1px solid rgba(103,232,249,0.1)' }}
              >
                <CheckCircle className="w-3.5 h-3.5 text-softCyan shrink-0 mt-0.5" />
                <p className="text-[11px] text-mutedLavender leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FINAL MESSAGE ── */}
        <div
          className="rounded-2xl p-6 mb-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #0A1A0F, #0D2010)',
            border: '1.5px solid rgba(101,245,197,0.3)'
          }}
        >
          <p className="text-sm sm:text-base text-white leading-relaxed font-medium">
            "Your journey is complete.{' '}
            <span className="text-successMint">Awareness, confidence, and informed choices</span> can help you navigate challenging situations."
          </p>
          <p className="text-xs text-mutedLavender mt-3 italic">
            This score reflects your in-game decisions and is presented as an educational result, not a real-world safety assessment.
          </p>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { soundCtrl.playSelect(); onPlayAgain(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-electricBlue to-neonLavender hover:shadow-glow-blue font-orbitron font-bold text-xs tracking-wider text-midnight flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => { soundCtrl.playSelect(); onReturnMenu(); }}
            onMouseEnter={() => soundCtrl.playHover()}
            className="py-3.5 px-8 rounded-xl bg-white/8 hover:bg-white/12 border border-white/20 font-orbitron font-bold text-xs tracking-wider text-white flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>RETURN TO MENU</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-mutedLavender/40 mt-6">
          SHERO: The Safety Quest // Progress persisted locally // Thank you for playing
        </p>
      </div>
    </div>
  );
};
