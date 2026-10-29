import React, { useState } from 'react';
import { FastForward, ArrowRight, RotateCcw, Shield, Sparkles, Compass } from 'lucide-react';
import { PlayableCharacter } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';
import { Mission } from '../../shared/types';
import { soundCtrl } from '../utils/sound';
import { speechCtrl } from '../utils/speech';

interface CharacterIntroModalProps {
  character: PlayableCharacter;
  playerName: string;
  mission: Mission;
  onComplete: () => void;
  onSkip: () => void;
}

export const CharacterIntroModal: React.FC<CharacterIntroModalProps> = ({
  character,
  playerName,
  mission,
  onComplete,
  onSkip
}) => {
  const [step, setStep] = useState<number>(0);
  const displayName = playerName?.trim() || character.name;

  const introSteps = [
    {
      title: 'MEET YOUR HEROINE',
      speaker: character.name,
      pose: 'happy' as const,
      badge: `${character.title} // ${character.signatureEmoji}`,
      dialogue: `Hi, I'm ${character.name}! You're taking on this adventure with me. Together, we're going to navigate the city safely, rely on our instincts, and protect our boundaries.`,
      narration: `${displayName} steps into the shoes of ${character.name} — ${character.personality.toLowerCase()}`
    },
    {
      title: 'MISSION CALLSIGN & ROLE',
      speaker: character.name,
      pose: 'talking' as const,
      badge: `MISSION 0${mission.number} // ${mission.title.toUpperCase()}`,
      dialogue: `Our destination tonight is ${mission.environmentName}. Our mission: ${mission.learningGoal}`,
      narration: `Remember: never doubt your gut feeling. Situational awareness and moving toward verified public spaces will always keep you safe.`
    },
    {
      title: 'READY TO PATROL',
      speaker: character.name,
      pose: 'selected' as const,
      badge: 'CONTROLS // EXPLORATION & CHOICES',
      dialogue: `Use WASD or the on-screen D-pad to move through the streets. When you encounter a situation or NPC, investigate calmly and make the safest choice!`,
      narration: `Every decision has real consequences. Think before you act, ${displayName}!`
    }
  ];

  const currentStepData = introSteps[step];

  const handleNext = () => {
    soundCtrl.playSelect();
    if (step < introSteps.length - 1) {
      setStep(s => s + 1);
      speechCtrl.speak(`${currentStepData.speaker}: ${introSteps[step + 1].dialogue}`);
    } else {
      soundCtrl.playVictory();
      onComplete();
    }
  };

  const handleReplayVoice = () => {
    soundCtrl.playSelect();
    speechCtrl.speak(`${currentStepData.speaker}: ${currentStepData.dialogue}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md select-none animate-fade-in">
      {/* Container Card */}
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#11142B]/95 border-2 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-white"
        style={{
          borderColor: character.borderColor,
          boxShadow: `0 0 40px ${character.glowHex}, 0 20px 50px rgba(0,0,0,0.8)`
        }}
      >
        {/* Top Controls: Header + Skip */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-orbitron font-bold flex items-center gap-1.5"
              style={{
                background: `${character.colorHex}20`,
                border: `1px solid ${character.colorHex}50`,
                color: character.colorHex
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentStepData.title}</span>
            </span>
          </div>

          <button
            onClick={() => {
              soundCtrl.playSelect();
              onSkip();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-orbitron text-mutedLavender hover:text-white transition cursor-pointer"
            title="Skip Intro sequence"
          >
            <span>Skip Intro</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Character Visual & Story Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Character Anime Portrait Card */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl border-2 flex items-center justify-center overflow-hidden shadow-2xl p-2"
              style={{
                background: character.bgGradient,
                borderColor: character.borderColor,
                boxShadow: `0 0 30px ${character.glowHex}`
              }}
            >
              <CharacterPortrait char={character} size={150} pose={currentStepData.pose} />
            </div>

            <div className="mt-3 text-center">
              <div
                className="font-orbitron font-black text-sm tracking-wider uppercase"
                style={{ color: character.colorHex }}
              >
                {character.name} {character.signatureEmoji}
              </div>
              <div className="text-[11px] text-mutedLavender mt-0.5">
                {displayName !== character.name ? `Player: ${displayName}` : character.title}
              </div>
            </div>
          </div>

          {/* Dialogue & Narrative Panel */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div
                className="text-xs font-mono font-bold tracking-wider"
                style={{ color: character.colorHex }}
              >
                {currentStepData.badge}
              </div>

              {/* Speech Bubble */}
              <div className="p-4 rounded-2xl bg-midnight/80 border border-white/15 relative shadow-inner">
                <p className="text-sm sm:text-base text-white leading-relaxed italic">
                  "{currentStepData.dialogue}"
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-mutedLavender/70 pt-2 border-t border-white/5">
                  <span>Voice dialogue ready</span>
                  <button
                    onClick={handleReplayVoice}
                    className="text-[11px] text-softCyan hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replay Voice</span>
                  </button>
                </div>
              </div>

              {/* Context / Objective */}
              <p className="text-xs text-mutedLavender leading-relaxed">
                {currentStepData.narration}
              </p>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 pt-2">
              {introSteps.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 28 : 8,
                    background: i === step ? character.colorHex : 'rgba(255,255,255,0.2)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => {
              if (step > 0) {
                soundCtrl.playSelect();
                setStep(s => s - 1);
              }
            }}
            disabled={step === 0}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron transition ${
              step === 0
                ? 'opacity-30 cursor-not-allowed text-mutedLavender'
                : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl font-orbitron font-extrabold text-xs uppercase tracking-wider text-midnight active:scale-95 transition flex items-center gap-2 cursor-pointer shadow-lg"
            style={{
              background: `linear-gradient(90deg, ${character.colorHex}, #67E8F9)`
            }}
          >
            <span>{step === introSteps.length - 1 ? 'BEGIN MISSION' : 'CONTINUE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
