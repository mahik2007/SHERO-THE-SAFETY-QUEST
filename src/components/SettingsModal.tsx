import React, { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Volume2, Eye, Shield, Trash2, CheckCircle } from 'lucide-react';
import { storage, AppSettings } from '../utils/storage';
import { soundCtrl } from '../utils/sound';

interface SettingsProps {
  onBack: () => void;
}

export const SettingsModal: React.FC<SettingsProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    storage.saveSettings(updated);
    if (key === 'music' || key === 'sfx') {
      if (!value) soundCtrl.stopBGM();
    }
    soundCtrl.playSelect();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleClearSafeCircle = () => {
    if (window.confirm('Delete all stored Trusted Contacts and Personal Safety Plan from this browser?')) {
      storage.clearSafeCircleData();
      soundCtrl.playSelect();
      alert('SafeCircle personal data deleted from local storage.');
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto select-none">
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm pointer-events-none" />
      <div className="relative z-10 p-6 sm:p-10">
      {/* Top Header */}
      <header className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={() => { soundCtrl.playSelect(); onBack(); }}
          onMouseEnter={() => soundCtrl.playHover()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigoDeep/80 hover:bg-darkViolet text-xs text-mutedLavender hover:text-white transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-wider flex items-center gap-2 justify-center">
            <SettingsIcon className="w-5 h-5 text-softCyan" />
            <span>GAME SETTINGS</span>
          </h2>
          <p className="text-xs text-mutedLavender">Audio, Visuals & Privacy Preferences</p>
        </div>

        <div className="w-16" />
      </header>

      {/* Main Settings Panel */}
      <main className="relative z-10 w-full max-w-2xl mx-auto my-auto py-6 space-y-6">
        {/* Audio Section */}
        <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-orbitron text-softCyan flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>Audio & Sound Effects</span>
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-semibold text-white">Synthesizer Background Ambience</div>
              <div className="text-[11px] text-mutedLavender">Web Audio procedural synth drones</div>
            </div>
            <button
              onClick={() => updateSetting('music', !settings.music)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.music ? 'bg-successMint' : 'bg-white/10'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-midnight absolute top-1 transition-transform ${settings.music ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <div className="text-xs font-semibold text-white">Sound Effects (SFX)</div>
              <div className="text-[11px] text-mutedLavender">Selection, success & hazard cues</div>
            </div>
            <button
              onClick={() => updateSetting('sfx', !settings.sfx)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.sfx ? 'bg-successMint' : 'bg-white/10'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-midnight absolute top-1 transition-transform ${settings.sfx ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <div className="text-xs font-semibold text-white">Spoken Character Dialogue (TTS)</div>
              <div className="text-[11px] text-mutedLavender">Browser Web Speech API voice playback</div>
            </div>
            <button
              onClick={() => updateSetting('voice', !settings.voice)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.voice ? 'bg-successMint' : 'bg-white/10'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-midnight absolute top-1 transition-transform ${settings.voice ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <div className="text-xs font-semibold text-white">Protagonist Display Name</div>
              <div className="text-[11px] text-mutedLavender">Name used across all dialogues, narrations & missions</div>
            </div>
            <input
              type="text"
              value={settings.heroName || ''}
              placeholder="e.g. Gyanvi"
              onChange={e => updateSetting('heroName', e.target.value)}
              className="px-3 py-1 rounded-lg bg-midnight border border-white/20 text-xs font-orbitron text-softCyan focus:outline-none focus:border-softCyan w-36 text-right"
              maxLength={20}
            />
          </div>
        </div>

        {/* Accessibility & Visuals */}
        <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-orbitron text-neonLavender flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Accessibility & Visuals</span>
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-semibold text-white">Reduced Motion</div>
              <div className="text-[11px] text-mutedLavender">Minimizes pulsing and ambient glows</div>
            </div>
            <button
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.reducedMotion ? 'bg-successMint' : 'bg-white/10'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-midnight absolute top-1 transition-transform ${settings.reducedMotion ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <div className="text-xs font-semibold text-white">Dialogue Text Size</div>
              <div className="text-[11px] text-mutedLavender">Adjust readability in scenario cards</div>
            </div>
            <div className="flex gap-1.5">
              {(['normal', 'large'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                    settings.fontSize === size ? 'bg-electricBlue text-midnight font-bold' : 'bg-white/5 text-mutedLavender'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-3">
          <h3 className="text-sm font-bold font-orbitron text-dangerRed flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Data Privacy & Storage Cleanup</span>
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-semibold text-white">Purge SafeCircle Personal Data</div>
              <div className="text-[11px] text-mutedLavender">Clears contacts, plans, and notes permanently</div>
            </div>
            <button
              onClick={handleClearSafeCircle}
              className="px-3.5 py-1.5 rounded-xl bg-dangerRed/20 hover:bg-dangerRed text-dangerRed hover:text-white text-xs font-bold font-orbitron flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="flex items-center justify-center gap-2 text-xs text-successMint font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Settings saved locally.</span>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full max-w-2xl mx-auto pt-4 text-center text-xs text-mutedLavender/50 border-t border-white/5">
        Client Persistence Engine // Settings Active
      </footer>
      </div>
    </div>
  );
};
