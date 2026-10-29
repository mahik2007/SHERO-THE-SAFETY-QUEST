import React, { useState } from 'react';
import { User, Sparkles, Check, Volume2, Shield } from 'lucide-react';
import { soundCtrl } from '../utils/sound';
import { speechCtrl } from '../utils/speech';
import { storage } from '../utils/storage';
import { CHARACTERS } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';

interface CharacterCreatorModalProps {
  onStartAdventure: (heroName: string) => void;
  onClose?: () => void;
}

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  onStartAdventure,
  onClose
}) => {
  const settings = storage.getSettings();
  const [heroName, setHeroName] = useState<string>(settings.heroName || '');
  const [outfit, setOutfit] = useState<'cyber_guardian' | 'neon_casual' | 'stealth_jacket'>(
    settings.outfit || 'cyber_guardian'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleTestSpeech = () => {
    soundCtrl.playSelect();
    const name = heroName.trim() || 'Hero';
    speechCtrl.speak(`Welcome to SHERO, ${name}! Stay alert and trust your instincts.`);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = heroName.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Please enter a protagonist name with at least 2 characters.');
      return;
    }
    if (cleanName.length > 20) {
      setErrorMsg('Protagonist name should not exceed 20 characters.');
      return;
    }

    soundCtrl.playVictory();
    storage.saveSettings({
      ...settings,
      heroName: cleanName,
      outfit
    });
    speechCtrl.speak(`Welcome to the safety quest, ${cleanName}!`);
    onStartAdventure(cleanName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-indigoDeep/95 border border-white/20 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electricBlue/20 border border-electricBlue/40 text-xs font-orbitron font-bold text-softCyan tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-softCyan" />
            <span>HEROINE AWAKENING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white tracking-wide">
            What should we call you, hero?
          </h2>
          <p className="text-xs sm:text-sm text-mutedLavender">
            Enter your name to personalize your adventure. Characters and dialogues will address you directly!
          </p>
        </div>

        {/* Character Avatar Preview */}
        <div className="flex flex-col items-center justify-center py-2">
          {(() => {
            const matchingChar =
              CHARACTERS.find(c => c.name.toLowerCase() === heroName.trim().toLowerCase()) ||
              CHARACTERS.find(c => c.id === settings.characterId) ||
              CHARACTERS[0];

            return (
              <div
                className="relative w-28 h-28 rounded-2xl border-2 flex items-center justify-center shadow-2xl overflow-hidden group p-1"
                style={{
                  background: matchingChar.bgGradient,
                  borderColor: matchingChar.borderColor,
                  boxShadow: `0 0 25px ${matchingChar.glowHex}`
                }}
              >
                {/* Ambient character glow */}
                <div className="absolute inset-0 bg-radial from-white/10 to-transparent" />

                {/* Polished Cute Anime CG Character Face Portrait */}
                <CharacterPortrait char={matchingChar} size={90} headOnly pose="happy" />
              </div>
            );
          })()}

          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm font-orbitron font-bold text-softCyan tracking-wide">
              {heroName.trim() || 'Your Heroine'}
            </span>
            <button
              type="button"
              onClick={handleTestSpeech}
              title="Test Voice Pronunciation"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-electricBlue border border-white/15 text-mutedLavender hover:text-white transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleConfirm} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-orbitron font-semibold text-mutedLavender uppercase tracking-wider">
              Protagonist Name / Callsign:
            </label>
            <div className="relative">
              <input
                type="text"
                value={heroName}
                onChange={e => {
                  setHeroName(e.target.value);
                  setErrorMsg('');
                }}
                maxLength={20}
                placeholder="Enter preferred protagonist name (e.g. Gyanvi)"
                className="w-full px-4 py-3 rounded-xl bg-midnight/80 border border-white/20 focus:border-softCyan focus:ring-1 focus:ring-softCyan text-sm font-orbitron text-white placeholder-mutedLavender/40 outline-none transition"
              />
              <User className="absolute right-3.5 top-3.5 w-4 h-4 text-mutedLavender pointer-events-none" />
            </div>
            {errorMsg && (
              <p className="text-xs text-dangerRed font-medium">{errorMsg}</p>
            )}
          </div>

          {/* Outfit / Preset Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-orbitron font-semibold text-mutedLavender uppercase tracking-wider">
              Outfit Style Preset:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cyber_guardian', label: 'Guardian Blue', border: 'border-electricBlue' },
                { id: 'neon_casual', label: 'Neon Lavender', border: 'border-fuchsia-400' },
                { id: 'stealth_jacket', label: 'Stealth Navy', border: 'border-slate-500' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundCtrl.playSelect();
                    setOutfit(opt.id as any);
                  }}
                  className={`p-2 rounded-xl text-center border text-xs font-mono transition flex flex-col items-center gap-1 ${
                    outfit === opt.id
                      ? `${opt.border} bg-white/10 text-white font-bold ring-1 ring-softCyan`
                      : 'border-white/10 text-mutedLavender hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/15 text-xs text-mutedLavender hover:text-white transition"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-electricBlue via-neonLavender to-softCyan hover:shadow-glow-blue font-orbitron font-bold text-xs uppercase tracking-wider text-midnight active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>START ADVENTURE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
