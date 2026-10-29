import React, { useState } from 'react';
import { Check, ChevronRight, Star, Shield, Zap, Heart, Eye, Compass } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

export interface PlayableCharacter {
  id: string;
  name: string;
  title: string;
  personality: string;
  traits: string[];
  color: string;          // tailwind accent color class fragment
  colorHex: string;       // for inline styles
  glowHex: string;
  bgGradient: string;
  borderColor: string;
  hairColor: string;
  jacketColor: string;
  signatureEmoji: string;
  description: string;
}

export const CHARACTERS: PlayableCharacter[] = [
  {
    id: 'gyanvi',
    name: 'Gyanvi',
    title: 'The Explorer',
    personality: 'Curious, observant, resourceful, and independent.',
    traits: ['Curious', 'Confident', 'Observant'],
    color: 'neonLavender',
    colorHex: '#A78BFA',
    glowHex: 'rgba(167,139,250,0.4)',
    bgGradient: 'linear-gradient(135deg, #1E1040 0%, #2D1B69 50%, #1A1035 100%)',
    borderColor: '#A78BFA',
    hairColor: '#1E1638',
    jacketColor: '#6D28D9',
    signatureEmoji: '🔮',
    description: 'Long dark hair with violet sheen. Purple jacket, backpack, practical sneakers. Always watching, always ready.'
  },
  {
    id: 'aanya',
    name: 'Aanya',
    title: 'The Bold One',
    personality: 'Bold, independent, assertive, and decisive.',
    traits: ['Bold', 'Independent', 'Fearless'],
    color: 'softCyan',
    colorHex: '#67E8F9',
    glowHex: 'rgba(103,232,249,0.4)',
    bgGradient: 'linear-gradient(135deg, #0F2A35 0%, #164E4E 50%, #0D2530 100%)',
    borderColor: '#0D9488',
    hairColor: '#1A1A2E',
    jacketColor: '#0F766E',
    signatureEmoji: '⚡',
    description: 'Short black bob. Teal jacket, dark jeans, sporty shoes. Headphones ready. Never backs down from a challenge.'
  },
  {
    id: 'meera',
    name: 'Meera',
    title: 'The Thoughtful One',
    personality: 'Analytical, calm, empathetic, and observant.',
    traits: ['Analytical', 'Calm', 'Empathetic'],
    color: 'mutedLavender',
    colorHex: '#C4B5FD',
    glowHex: 'rgba(196,181,253,0.4)',
    bgGradient: 'linear-gradient(135deg, #1C1835 0%, #2D2050 50%, #181530 100%)',
    borderColor: '#8B5CF6',
    hairColor: '#2D1B69',
    jacketColor: '#5B21B6',
    signatureEmoji: '🔬',
    description: 'Wavy hair, lavender cardigan, glasses. Thoughtful expression. Processes every situation with calm precision.'
  },
  {
    id: 'riya',
    name: 'Riya',
    title: 'The Adventurer',
    personality: 'Energetic, adventurous, courageous, and proactive.',
    traits: ['Energetic', 'Adventurous', 'Quick-Thinker'],
    color: 'successMint',
    colorHex: '#FBBF24',
    glowHex: 'rgba(251,191,36,0.4)',
    bgGradient: 'linear-gradient(135deg, #1C1200 0%, #3D2800 50%, #1A1100 100%)',
    borderColor: '#D97706',
    hairColor: '#1C0A00',
    jacketColor: '#B45309',
    signatureEmoji: '🌟',
    description: 'High ponytail, mustard-yellow jacket, cargo trousers. Ready for anything. Runs toward challenges, not away.'
  },
  {
    id: 'mahima',
    name: 'Mahima',
    title: 'The Sweet One',
    personality: 'Kind, supportive, optimistic, and emotionally perceptive.',
    traits: ['Kind', 'Supportive', 'Optimistic'],
    color: 'dangerRed',
    colorHex: '#F9A8D4',
    glowHex: 'rgba(249,168,212,0.4)',
    bgGradient: 'linear-gradient(135deg, #2A1020 0%, #4C1D35 50%, #250F1D 100%)',
    borderColor: '#EC4899',
    hairColor: '#3D1A28',
    jacketColor: '#BE185D',
    signatureEmoji: '🌸',
    description: 'Cute hair clips and ribbons. Pastel-pink cardigan, cream outfit. Warm smile that lights up every room she enters.'
  }
];

import { CharacterPortrait } from './CharacterPortrait';
export { CharacterPortrait };


const traitIconMap: Record<string, React.FC<any>> = {
  'Curious': Compass,
  'Confident': Star,
  'Observant': Eye,
  'Bold': Zap,
  'Independent': Shield,
  'Fearless': Star,
  'Analytical': Star,
  'Calm': Heart,
  'Empathetic': Heart,
  'Energetic': Zap,
  'Adventurous': Compass,
  'Quick-Thinker': Star,
  'Kind': Heart,
  'Supportive': Shield,
  'Optimistic': Star,
};

interface CharacterSelectScreenProps {
  onSelectCharacter: (character: PlayableCharacter) => void;
  onBack: () => void;
  playerName: string;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  onSelectCharacter,
  onBack,
  playerName
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('gyanvi');

  const selectedChar = CHARACTERS.find(c => c.id === selectedId) || CHARACTERS[0];

  const handleConfirm = () => {
    soundCtrl.playVictory();
    onSelectCharacter(selectedChar);
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-y-auto">
      {/* Translucent overlay so the city world is visible through */}
      <div className="absolute inset-0 bg-midnight/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={() => { soundCtrl.playSelect(); onBack(); }}
            className="absolute left-4 top-6 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigoDeep/80 border border-white/10 text-xs text-mutedLavender hover:text-white transition"
          >
            ← Back
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-darkViolet/80 border border-neonLavender/40 text-xs font-orbitron font-bold text-neonLavender tracking-widest mb-3">
            ✦ CHOOSE YOUR CHARACTER ✦
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-orbitron text-white tracking-wide">
            SELECT YOUR SHERO
          </h2>
          <p className="text-sm text-mutedLavender mt-1">
            {playerName ? `${playerName}, each story is unique, but the courage is the same.` : 'Each story is unique, but the courage is the same.'}
          </p>
          <div className="mt-1 text-xs italic text-neonLavender/70">
            "Different Stories. Same Strength."
          </div>
        </div>

        {/* Character Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {CHARACTERS.map((char) => {
            const isSelected = selectedId === char.id;
            const isHovered = hoveredId === char.id;

            return (
              <div
                key={char.id}
                className="relative cursor-pointer flex flex-col items-center rounded-2xl transition-all duration-300"
                style={{
                  background: char.bgGradient,
                  border: `2px solid ${isSelected ? char.borderColor : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isSelected ? `0 0 30px ${char.glowHex}, inset 0 0 20px ${char.glowHex}` :
                             isHovered ? `0 0 20px ${char.glowHex}` : 'none',
                  transform: isSelected ? 'scale(1.04) translateY(-4px)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                  padding: '16px 12px 12px'
                }}
                onClick={() => {
                  soundCtrl.playSelect();
                  setSelectedId(char.id);
                }}
                onMouseEnter={() => { soundCtrl.playHover(); setHoveredId(char.id); }}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-midnight"
                    style={{ background: char.borderColor }}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                )}

                {/* Signature emoji badge */}
                <div className="text-xl mb-1">{char.signatureEmoji}</div>

                {/* Character portrait */}
                <div className="mb-3">
                  <CharacterPortrait char={char} size={110} pose={isSelected ? 'selected' : 'idle'} />
                </div>

                {/* Name & title */}
                <div className="text-center">
                  <div
                    className="text-base font-black font-orbitron tracking-wide"
                    style={{ color: char.colorHex }}
                  >
                    {char.name.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-mutedLavender font-semibold mt-0.5">
                    {char.title}
                  </div>
                </div>

                {/* Traits */}
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {char.traits.map((trait) => {
                    const Icon = traitIconMap[trait] || Star;
                    return (
                      <span
                        key={trait}
                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono"
                        style={{
                          background: `${char.colorHex}18`,
                          border: `1px solid ${char.colorHex}40`,
                          color: char.colorHex
                        }}
                      >
                        <Icon className="w-2.5 h-2.5" />
                        {trait}
                      </span>
                    );
                  })}
                </div>

                {/* Select button */}
                <button
                  className="mt-3 w-full py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all"
                  style={{
                    background: isSelected
                      ? `linear-gradient(90deg, ${char.borderColor}, ${char.colorHex})`
                      : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#080B18' : char.colorHex,
                    border: `1px solid ${char.borderColor}`,
                  }}
                >
                  {isSelected ? '✓ SELECTED' : 'SELECT'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected character details panel */}
        <div
          className="rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center gap-6"
          style={{
            background: selectedChar.bgGradient,
            border: `1.5px solid ${selectedChar.borderColor}`,
            boxShadow: `0 0 40px ${selectedChar.glowHex}`
          }}
        >
          {/* Large portrait */}
          <div className="shrink-0">
            <CharacterPortrait char={selectedChar} size={140} pose="selected" />
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{selectedChar.signatureEmoji}</span>
              <div>
                <h3
                  className="text-2xl font-black font-orbitron"
                  style={{ color: selectedChar.colorHex }}
                >
                  {selectedChar.name}
                </h3>
                <div className="text-sm text-mutedLavender font-semibold">{selectedChar.title}</div>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed mb-3">
              {selectedChar.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedChar.traits.map(trait => {
                const Icon = traitIconMap[trait] || Star;
                return (
                  <span
                    key={trait}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-orbitron font-bold"
                    style={{
                      background: `${selectedChar.colorHex}20`,
                      border: `1px solid ${selectedChar.borderColor}`,
                      color: selectedChar.colorHex
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {trait}
                  </span>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-mutedLavender italic">
              "{selectedChar.personality}"
            </p>
          </div>

          {/* Confirm button */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={handleConfirm}
              onMouseEnter={() => soundCtrl.playHover()}
              className="px-8 py-3.5 rounded-xl font-orbitron font-extrabold text-sm tracking-wider flex items-center gap-2.5 transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${selectedChar.borderColor}, ${selectedChar.colorHex})`,
                color: '#080B18',
                boxShadow: `0 0 25px ${selectedChar.glowHex}`
              }}
            >
              <span>CONTINUE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="text-[10px] text-mutedLavender text-center">
              Start Your Adventure
            </div>
          </div>
        </div>

        {/* Animation previews row (decorative) */}
        <div
          className="rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4"
          style={{ background: 'rgba(17,20,43,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="text-xs font-orbitron font-bold text-mutedLavender uppercase tracking-widest shrink-0">
            Character Animations Preview
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            {['Idle', 'Walking', 'Talking', 'Alert', 'Victory'].map((anim, i) => (
              <div key={anim} className="shrink-0 flex flex-col items-center gap-1">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${selectedChar.colorHex}12`,
                    border: `1px solid ${selectedChar.borderColor}30`
                  }}
                >
                  <CharacterPortrait char={selectedChar} size={42} />
                </div>
                <span className="text-[9px] text-mutedLavender">{anim}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
