import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Volume2, Sparkles } from 'lucide-react';
import { soundCtrl } from '../utils/sound';
import { speechCtrl } from '../utils/speech';
import { storage } from '../utils/storage';
import { SheroLogo } from './SheroLogo';

interface NameEntryScreenProps {
  onConfirmName: (name: string) => void;
  onBack: () => void;
}

const SUGGESTED_NAMES = ['Gyanvi', 'Aanya', 'Meera', 'Riya', 'Mahima'];

export const NameEntryScreen: React.FC<NameEntryScreenProps> = ({ onConfirmName, onBack }) => {
  const settings = storage.getSettings();
  const [heroName, setHeroName] = useState(settings.heroName || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Floating text animation state
  const [glowPhase, setGlowPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setGlowPhase(p => (p + 1) % 100), 80);
    return () => clearInterval(id);
  }, []);

  const handleTestSpeech = () => {
    const name = heroName.trim() || 'Hero';
    speechCtrl.speak(`Welcome to SHERO, ${name}! Every choice shapes your journey.`);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = heroName.trim();
    if (!clean || clean.length < 2) {
      setErrorMsg('Please enter at least 2 characters for your name.');
      return;
    }
    if (clean.length > 20) {
      setErrorMsg('Name must be 20 characters or fewer.');
      return;
    }
    if (!/^[A-Za-z\s'-]+$/.test(clean)) {
      setErrorMsg('Please use only letters, spaces, hyphens, or apostrophes.');
      return;
    }

    setSubmitted(true);
    soundCtrl.playVictory();
    storage.saveSettings({ ...settings, heroName: clean });

    // Brief success animation before advancing
    setTimeout(() => {
      onConfirmName(clean);
    }, 800);
  };

  const glowOpacity = 0.5 + Math.sin(glowPhase / 16) * 0.3;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      {/* Overlay over the persistent city world */}
      <div className="absolute inset-0 bg-midnight/60 backdrop-blur-[2px]" />

      {/* Content card */}
      <div
        className="relative z-10 w-full max-w-lg animate-fade-in"
        style={{
          animation: 'fadeSlideUp 0.5s ease-out'
        }}
      >
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Glow ring behind card */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `0 0 80px 20px rgba(167,139,250,${glowOpacity * 0.3})`,
            transition: 'box-shadow 0.3s ease'
          }}
        />

        <div className="relative rounded-3xl bg-indigoDeep/95 border border-neonLavender/30 shadow-2xl p-7 sm:p-9 flex flex-col gap-6 backdrop-blur-md">
          {/* Close / back button */}
          <button
            type="button"
            onClick={() => { soundCtrl.playSelect(); onBack(); }}
            className="absolute top-4 right-4 text-mutedLavender hover:text-white text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <SheroLogo size="sm" showSubtitle={false} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electricBlue/15 border border-electricBlue/30 text-xs font-orbitron font-bold text-softCyan tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HEROINE AWAKENING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white tracking-wide leading-tight">
              Every hero has a name.
            </h2>
            <p className="text-sm text-mutedLavender">
              What should we call you?
            </p>
          </div>

          {/* Animated city silhouette mini-visual */}
          <div
            className="rounded-2xl overflow-hidden flex items-end justify-center relative"
            style={{
              background: 'linear-gradient(180deg, #04061A 0%, #0B0E2A 60%, #0F1228 100%)',
              height: 90
            }}
          >
            {/* Mini skyline */}
            <svg viewBox="0 0 400 80" width="100%" height="80" preserveAspectRatio="xMidYMax slice">
              <path d="M0 80 L0 50 L15 50 L15 38 L30 38 L30 50 L50 50 L50 28 L70 28 L70 55 L100 55 L100 35 L120 35 L120 55 L160 55 L160 25 L190 25 L190 55 L230 55 L230 38 L255 38 L255 55 L300 55 L300 30 L330 30 L330 55 L370 55 L370 40 L400 40 L400 80 Z" fill="#090D22" opacity="0.9" />
              {/* Glow windows */}
              {[52, 70, 165, 185, 305, 325].map((x, i) => (
                <rect key={i} x={x} y={i % 2 === 0 ? 32 : 44} width={12} height={16} rx={2}
                  fill={i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#67E8F9' : '#FDE68A'} opacity={0.6} />
              ))}
              {/* Ground */}
              <rect x="0" y="72" width="400" height="8" fill="#0A0D20" />
              <line x1="0" y1="72" x2="400" y2="72" stroke="#4B7BFF" strokeWidth="1" opacity="0.5" />
            </svg>

            {/* Floating name text preview */}
            {heroName.trim() && (
              <div
                className="absolute top-2 right-3 text-xs font-orbitron font-bold text-softCyan bg-midnight/80 px-2 py-1 rounded-lg border border-softCyan/30"
                style={{ opacity: glowOpacity }}
              >
                {heroName.trim()}, your journey begins tonight.
              </div>
            )}
          </div>

          {/* Name input form */}
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-orbitron font-semibold text-mutedLavender uppercase tracking-wider">
                Your Name / Callsign:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={heroName}
                  onChange={e => { setHeroName(e.target.value); setErrorMsg(''); }}
                  maxLength={20}
                  placeholder="Enter your name (e.g. Gyanvi, Aanya…)"
                  autoFocus
                  disabled={submitted}
                  className="w-full px-4 py-3.5 rounded-xl bg-midnight/80 border border-white/20 focus:border-softCyan focus:ring-1 focus:ring-softCyan text-sm font-orbitron text-white placeholder-mutedLavender/40 outline-none transition"
                />
                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-mutedLavender pointer-events-none" />
              </div>
              {errorMsg && (
                <p className="text-xs text-dangerRed font-medium">{errorMsg}</p>
              )}
              <div className="text-[11px] text-mutedLavender/60 flex justify-between">
                <span>2–20 characters, letters only</span>
                <span className={heroName.length > 18 ? 'text-dangerRed' : ''}>{heroName.length}/20</span>
              </div>
            </div>

            {/* Quick-pick suggested names */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-mutedLavender uppercase tracking-wider">
                Or choose a character name:
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_NAMES.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { soundCtrl.playSelect(); setHeroName(n); setErrorMsg(''); }}
                    className="px-3 py-1.5 rounded-lg border text-xs font-orbitron font-bold transition"
                    style={{
                      background: heroName === n ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                      borderColor: heroName === n ? '#A78BFA' : 'rgba(255,255,255,0.12)',
                      color: heroName === n ? '#A78BFA' : '#B9B7D6'
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Voice test */}
              <button
                type="button"
                onClick={handleTestSpeech}
                onMouseEnter={() => soundCtrl.playHover()}
                title="Hear your name"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-electricBlue/20 border border-white/10 hover:border-softCyan text-mutedLavender hover:text-softCyan transition"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Continue */}
              <button
                type="submit"
                disabled={submitted}
                onMouseEnter={() => soundCtrl.playHover()}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-electricBlue via-neonLavender to-softCyan hover:shadow-glow-blue font-orbitron font-bold text-xs uppercase tracking-wider text-midnight active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitted ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-midnight border-t-transparent animate-spin" />
                    <span>Welcome, {heroName}!</span>
                  </>
                ) : (
                  <>
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-[11px] text-mutedLavender/50">
            Your name personalizes dialogue, missions, and your final SHERO report.
          </p>
        </div>
      </div>
    </div>
  );
};
