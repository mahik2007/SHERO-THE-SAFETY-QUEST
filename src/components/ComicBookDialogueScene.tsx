import React, { useState, useEffect, useRef } from 'react';
import { PlayableCharacter } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';
import { StrangerPortrait, StrangerType } from './StrangerPortrait';
import { Choice } from '../../shared/types';
import { soundCtrl } from '../utils/sound';
import { speechCtrl } from '../utils/speech';
import { Volume2, VolumeX, ChevronRight, RotateCcw, AlertTriangle, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { KitsuSpirit } from './KitsuSpirit';

export interface DialogueLine {
  id: string;
  speakerType: 'stranger' | 'hero' | 'narrator';
  speakerName: string;
  text: string;
  expression?: 'talking' | 'worried' | 'alert' | 'confident' | 'relieved';
}

export interface ComicDialogueSceneProps {
  situation: string;
  strangerSpeaker: string;
  strangerDialogue: string;
  heroInnerThought?: string;
  heroResponseDialogue?: string;
  choices: Choice[];
  selectedCharacter: PlayableCharacter;
  heroName: string;
  onSelectChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  onAdvanceNext: () => void;
  strangerType?: StrangerType;
  isNightEnv?: boolean;
}

/**
 * ComicBookDialogueScene:
 * A high-end visual-novel / anime graphic novel conversation layout.
 * Features:
 * 1. Illustrated stranger portrait on one side with live idle/breathing and lip sync.
 * 2. Illustrated player chosen character on the other side.
 * 3. Comic speech bubbles with directional tail pointers directly anchored to active speaker.
 * 4. Step-by-step turn sequence (Stranger speaks -> Player responds -> Decision choices -> Reaction & Explanation).
 * 5. Full keyboard support (1/2/3 or A/B/C for choices, Space/Enter to continue).
 * 6. Native browser speech synthesis with speaker-differentiated voice pitches.
 */
export const ComicBookDialogueScene: React.FC<ComicDialogueSceneProps> = ({
  situation,
  strangerSpeaker,
  strangerDialogue,
  heroInnerThought,
  heroResponseDialogue,
  choices,
  selectedCharacter,
  heroName,
  onSelectChoice,
  selectedChoice,
  onAdvanceNext,
  strangerType = 'cap_hoodie',
  isNightEnv = true
}) => {
  // Determine standard player response if not supplied
  const resolvedHeroResponse =
    heroResponseDialogue ||
    `"No, thank you. I'm waiting for someone and I'm fine right here."`;

  // Multi-step conversation panels:
  // 0: Stranger speaks first
  // 1: Hero responds verbally
  // 2: Safety Decision Question & 3 Choices
  // 3: Explanation & Outcome (after choice selected)
  const [panelStep, setPanelStep] = useState<number>(0);
  const [isSpeakingActive, setIsSpeakingActive] = useState<boolean>(false);
  const [isKitsuOpen, setIsKitsuOpen] = useState<boolean>(false);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // If a choice is already made, move to feedback step
  useEffect(() => {
    if (selectedChoice) {
      setPanelStep(3);
    }
  }, [selectedChoice]);

  // Clean up any pending speech timers on unmount
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      speechCtrl.stop();
    };
  }, []);

  // Voice narration triggers per panel step
  const speakCurrentTurn = (step: number) => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechCtrl.stop();

    if (step === 0) {
      // Stranger speaks
      const cleanStrangerLine = strangerDialogue.replace(/^["']|["']$/g, '');
      const voiceText = `${strangerSpeaker} says: ${cleanStrangerLine}`;
      setIsSpeakingActive(true);
      speechCtrl.speak(voiceText, 0.95, 0.85); // Deeper, slightly slower stranger pitch

      // Estimate speech duration for subtle mouth animation
      const duration = Math.min(Math.max(cleanStrangerLine.length * 65, 2200), 7000);
      speechTimeoutRef.current = setTimeout(() => {
        setIsSpeakingActive(false);
      }, duration);
    } else if (step === 1) {
      // Hero responds
      const cleanHeroLine = resolvedHeroResponse.replace(/^["']|["']$/g, '');
      const voiceText = `${heroName} says: ${cleanHeroLine}`;
      setIsSpeakingActive(true);
      speechCtrl.speak(voiceText, 1.05, 1.2); // Bright feminine hero pitch

      const duration = Math.min(Math.max(cleanHeroLine.length * 65, 2000), 6000);
      speechTimeoutRef.current = setTimeout(() => {
        setIsSpeakingActive(false);
      }, duration);
    } else if (step === 2) {
      setIsSpeakingActive(false);
      speechCtrl.speak('What is the safest thing to do in this situation?', 1.0, 1.0);
    } else if (step === 3 && selectedChoice) {
      setIsSpeakingActive(false);
      const outcomeText = selectedChoice.isCorrect
        ? `Safe choice! ${selectedChoice.feedback}`
        : `Unsafe decision. ${selectedChoice.feedback}`;
      speechCtrl.speak(outcomeText, 1.0, 1.05);
    }
  };

  // Trigger speech when panel step changes
  useEffect(() => {
    speakCurrentTurn(panelStep);
  }, [panelStep]);

  // Keyboard navigation: Enter/Space to proceed, 1/2/3 or A/B/C for choices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (panelStep === 0) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          soundCtrl.playSelect();
          setPanelStep(1);
        }
      } else if (panelStep === 1) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          soundCtrl.playSelect();
          setPanelStep(2);
        }
      } else if (panelStep === 2 && !selectedChoice) {
        if (['1', 'a', 'A'].includes(e.key) && choices[0]) {
          e.preventDefault();
          onSelectChoice(choices[0]);
        } else if (['2', 'b', 'B'].includes(e.key) && choices[1]) {
          e.preventDefault();
          onSelectChoice(choices[1]);
        } else if (['3', 'c', 'C'].includes(e.key) && choices[2]) {
          e.preventDefault();
          onSelectChoice(choices[2]);
        }
      } else if (panelStep === 3) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (selectedChoice?.isCorrect) {
            onAdvanceNext();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panelStep, selectedChoice, choices, onSelectChoice, onAdvanceNext]);

  const isStrangerTurn = panelStep === 0;
  const isHeroTurn = panelStep === 1;
  const isDecisionTurn = panelStep === 2;
  const isExplanationTurn = panelStep === 3;

  return (
    <div className="w-full rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-gradient-to-b from-midnight/95 via-[#0D1226]/95 to-midnight/95 backdrop-blur-md p-4 sm:p-6 transition-all duration-300">
      {/* ── TOP COMIC STRIP HEADER ─────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-cyan-300">
            {panelStep === 0 && 'Encounter Sequence // Turn 1: Stranger Speaks'}
            {panelStep === 1 && `Encounter Sequence // Turn 2: ${heroName} Responds`}
            {panelStep === 2 && 'Critical Safety Decision Required'}
            {panelStep === 3 && (selectedChoice?.isCorrect ? 'Decision Validated — Safe Choice' : 'Critical Warning — Hazard Identified')}
          </span>
        </div>

        {/* Audio Replay & Controls */}
        <div className="flex items-center gap-2">
          {/* Kitsu Gut Feeling Spirit Companion */}
          <KitsuSpirit
            hintText={heroInnerThought || (choices.find(c => c.isCorrect)?.educationalTip)}
            isOpen={isKitsuOpen}
            onToggle={() => {
              soundCtrl.playSelect();
              if (!isKitsuOpen && hintsLeft > 0) {
                setHintsLeft(h => h - 1);
              }
              setIsKitsuOpen(!isKitsuOpen);
            }}
            hintsRemaining={hintsLeft}
          />

          <button
            type="button"
            onClick={() => {
              soundCtrl.playSelect();
              speakCurrentTurn(panelStep);
            }}
            title="Replay Spoken Dialogue"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-cyan-500/20 border border-white/15 text-cyan-300 text-xs font-semibold transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Replay Voice</span>
          </button>
        </div>
      </div>

      {/* ── MAIN GRAPHIC NOVEL STAGE ───────────────────────────── */}
      <div className="relative min-h-[310px] sm:min-h-[350px] flex flex-col justify-between">
        {/* UPPER ROW: STRANGER (LEFT) & PLAYER CHARACTER (RIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* LEFT: STRANGER PORTRAIT */}
          <div
            className={`md:col-span-4 flex flex-col items-center md:items-start transition-all duration-300 ${
              isStrangerTurn ? 'opacity-100 scale-105 drop-shadow-[0_0_18px_rgba(245,158,11,0.35)]' : 'opacity-65 filter brightness-75 scale-95'
            }`}
          >
            {/* Speaker Tag */}
            <div className="flex items-center gap-2 mb-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-orbitron font-bold">
              <span className={`w-2 h-2 rounded-full ${isStrangerTurn ? 'bg-amber-400 animate-pulse' : 'bg-amber-600'}`} />
              <span>{strangerSpeaker}</span>
              {isStrangerTurn && isSpeakingActive && (
                <span className="text-[10px] text-amber-200 animate-pulse">● Speaking</span>
              )}
            </div>

            {/* Illustrated Stranger Portrait */}
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-amber-500/20 via-transparent to-black/40 border border-amber-500/30 overflow-hidden">
              <StrangerPortrait
                type={strangerType}
                speakerName={strangerSpeaker}
                size={180}
                isTalking={isStrangerTurn && isSpeakingActive}
              />
            </div>
          </div>

          {/* MIDDLE: COMIC SPEECH BUBBLE AREA */}
          <div className="md:col-span-4 flex flex-col items-center justify-center my-2 md:my-0">
            {/* PANEL 1: Stranger Speaks */}
            {isStrangerTurn && (
              <div className="relative w-full p-4 sm:p-5 rounded-2xl bg-white text-slate-900 border-2 border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-200">
                {/* Speech Bubble Pointer Left */}
                <div
                  className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-white drop-shadow-[-2px_0_1px_rgba(0,0,0,0.5)]"
                />
                <span className="text-[11px] font-bold font-orbitron text-amber-700 tracking-wider block mb-1 uppercase">
                  {strangerSpeaker}
                </span>
                <p className="font-comic text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {strangerDialogue}
                </p>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => {
                      soundCtrl.playSelect();
                      setPanelStep(1);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-orbitron font-bold text-xs uppercase shadow transition cursor-pointer"
                  >
                    <span>Listen & Respond</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PANEL 2: Player Character Responds */}
            {isHeroTurn && (
              <div className="relative w-full p-4 sm:p-5 rounded-2xl bg-white text-slate-900 border-2 border-cyan-600 shadow-[0_8px_24px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-200">
                {/* Speech Bubble Pointer Right */}
                <div
                  className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] border-l-white drop-shadow-[2px_0_1px_rgba(0,0,0,0.5)]"
                />
                <span className="text-[11px] font-bold font-orbitron text-cyan-700 tracking-wider block mb-1 uppercase">
                  {heroName} ({selectedCharacter.name})
                </span>
                <p className="font-comic text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {resolvedHeroResponse}
                </p>
                {heroInnerThought && (
                  <p className="mt-2 text-xs italic text-slate-500 border-t border-slate-200 pt-1.5">
                    💭 Thought: "{heroInnerThought}"
                  </p>
                )}
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => {
                      soundCtrl.playSelect();
                      setPanelStep(2);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-orbitron font-bold text-xs uppercase shadow-glow-cyan transition cursor-pointer"
                  >
                    <span>Assess Choices</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PANEL 3 & 4 Placeholder in center */}
            {(isDecisionTurn || isExplanationTurn) && (
              <div className="text-center p-3 rounded-xl bg-midnight/60 border border-white/10">
                <span className="text-xs font-mono text-cyan-300">
                  {isDecisionTurn ? '⚡ Select your action below' : '◈ Review outcome below'}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: PLAYER SELECTED CHARACTER PORTRAIT */}
          <div
            className={`md:col-span-4 flex flex-col items-center md:items-end transition-all duration-300 ${
              isHeroTurn ? 'opacity-100 scale-105 drop-shadow-[0_0_18px_rgba(103,232,249,0.35)]' : 'opacity-65 filter brightness-75 scale-95'
            }`}
          >
            {/* Speaker Tag */}
            <div className="flex items-center gap-2 mb-1 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-orbitron font-bold">
              <span className={`w-2 h-2 rounded-full ${isHeroTurn ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-600'}`} />
              <span>{heroName} ({selectedCharacter.name})</span>
              {isHeroTurn && isSpeakingActive && (
                <span className="text-[10px] text-cyan-200 animate-pulse">● Speaking</span>
              )}
            </div>

            {/* Illustrated Player Character Portrait */}
            <div
              className="relative rounded-2xl p-1 border overflow-hidden"
              style={{
                borderColor: `${selectedCharacter.colorHex}60`,
                background: `radial-gradient(circle at 50% 30%, ${selectedCharacter.colorHex}25, transparent 70%)`
              }}
            >
              <CharacterPortrait
                char={selectedCharacter}
                size={180}
                pose={isHeroTurn ? 'talking' : isExplanationTurn && selectedChoice?.isCorrect ? 'happy' : 'worried'}
              />
            </div>
          </div>
        </div>

        {/* ── LOWER SECTION: DECISION OR EXPLANATION PANEL ────── */}
        {/* PANEL 3: 3 Clear, Well-Spaced Safety Decisions */}
        {isDecisionTurn && (
          <div className="mt-5 pt-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <span className="text-xs font-orbitron font-bold text-red-400 uppercase tracking-wider block">
                  Encounter Prompt
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  What is the safest thing to do in this situation?
                </h4>
              </div>
            </div>

            {/* The 3 Choice Buttons */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {choices.map((choice, index) => {
                const choiceColors = [
                  'hover:border-emerald-400 hover:from-emerald-950/60',
                  'hover:border-cyan-400 hover:from-cyan-950/60',
                  'hover:border-rose-400 hover:from-rose-950/60'
                ];
                const badgeColors = [
                  'bg-emerald-500 text-white',
                  'bg-cyan-500 text-white',
                  'bg-rose-500 text-white'
                ];

                return (
                  <button
                    key={choice.id}
                    onClick={() => {
                      soundCtrl.playSelect();
                      onSelectChoice(choice);
                    }}
                    onMouseEnter={() => soundCtrl.playHover()}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 to-slate-900/90 border border-white/15 ${choiceColors[index % 3]} transition-all duration-200 flex items-start gap-3.5 group cursor-pointer shadow-md hover:scale-[1.01]`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg ${badgeColors[index % 3]} flex items-center justify-center font-orbitron font-bold text-xs shrink-0 shadow`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-100 group-hover:text-white transition leading-relaxed pt-0.5">
                      {choice.text}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-mono text-slate-400 text-center pt-1">
              Keyboard shortcut: Press <span className="text-cyan-300 font-bold">1</span>, <span className="text-cyan-300 font-bold">2</span>, or <span className="text-cyan-300 font-bold">3</span> to choose.
            </p>
          </div>
        )}

        {/* PANEL 4: Choice Outcome & Educational Explanation */}
        {isExplanationTurn && selectedChoice && (
          <div className="mt-5 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                selectedChoice.isCorrect
                  ? 'bg-gradient-to-br from-emerald-950/70 via-indigo-950/80 to-midnight border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                  : 'bg-gradient-to-br from-rose-950/70 via-indigo-950/80 to-midnight border-rose-400/50 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {selectedChoice.isCorrect ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-orbitron font-bold text-sm sm:text-base text-emerald-300 uppercase tracking-wide">
                      Safety Protocol Validated — Excellent Decision!
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span className="font-orbitron font-bold text-sm sm:text-base text-rose-300 uppercase tracking-wide">
                      Hazard Identified — Vulnerable Decision
                    </span>
                  </>
                )}
              </div>

              {/* Character Reaction / Explanation Dialogue */}
              <p className="text-sm sm:text-base text-white leading-relaxed mb-3">
                {selectedChoice.feedback}
              </p>

              {/* Safety Rule / Educational Takeaway */}
              {selectedChoice.educationalTip && (
                <div className="p-3 rounded-xl bg-midnight/80 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300 mb-4">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300">Core Safety Rule: </span>
                    <span>{selectedChoice.educationalTip}</span>
                  </div>
                </div>
              )}

              {/* Progression Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    soundCtrl.playSelect();
                    setPanelStep(2);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Review Options</span>
                </button>

                {selectedChoice.isCorrect ? (
                  <button
                    onClick={() => {
                      soundCtrl.playSelect();
                      onAdvanceNext();
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
                  >
                    <span>Continue Mission</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundCtrl.playSelect();
                      setPanelStep(2);
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
                  >
                    <span>Try Again Safely</span>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

