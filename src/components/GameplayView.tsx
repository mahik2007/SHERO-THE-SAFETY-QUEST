import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  RotateCcw,
  Trophy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Sparkles,
  ArrowRight,
  MapPin,
  Navigation,
  Compass,
  Eye
} from 'lucide-react';
import { Mission, Choice } from '../../shared/types';
import { Game3DCanvas } from './Game3DCanvas';
import { soundCtrl } from '../utils/sound';
import { speechCtrl } from '../utils/speech';
import { storage } from '../utils/storage';
import { MISSIONS } from '../../shared/missionsData';
import {
  personalizeText,
  getScenarioEntryPrompt,
  getDecisionPrompt,
  getMissionCompletionMessage,
  getGameOverMessage
} from '../utils/player';
import type { PlayableCharacter } from './CharacterSelectScreen';
import { CharacterPortrait } from './CharacterPortrait';
import { ComicBookDialogueScene } from './ComicBookDialogueScene';

interface GameplayViewProps {
  mission: Mission;
  selectedCharacter?: PlayableCharacter | null;
  onExit: () => void;
  onNextMission?: (nextMission: Mission) => void;
}

type RunState = 'traversing' | 'decision_prompt' | 'feedback_correct' | 'lost' | 'victory';

export const GameplayView: React.FC<GameplayViewProps> = ({
  mission,
  selectedCharacter,
  onExit,
  onNextMission
}) => {
  const settings = storage.getSettings();
  const heroName = settings.heroName || 'Hero';
  const charColor = selectedCharacter?.colorHex || '#67E8F9';
  const charEmoji = selectedCharacter?.signatureEmoji || '⚡';

  const [currentNodeId, setCurrentNodeId] = useState<string>(mission.startNodeId);
  const [runState, setRunState] = useState<RunState>('traversing');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundCtrl.getMuted());
  const [isVoiceOn, setIsVoiceOn] = useState<boolean>(speechCtrl.getVoiceEnabled());

  // CRITICAL BUG FIX: Reset node and run state whenever a different mission is passed/selected
  useEffect(() => {
    setCurrentNodeId(mission.startNodeId);
    setSelectedChoice(null);
    setScore(0);
    setRunState('traversing');
    setIsProcessing(false);
  }, [mission.id, mission.startNodeId]);

  const currentNode = mission.nodes[currentNodeId];
  const isFinalMission = mission.number === 7;

  // Next mission object if available
  const nextMission = MISSIONS.find(m => m.number === mission.number + 1);

  const handleToggleSound = () => {
    const muted = soundCtrl.toggleMute();
    setIsMuted(muted);
    if (!muted) soundCtrl.playSelect();
  };

  const handleToggleVoice = () => {
    const voice = speechCtrl.toggleVoice();
    setIsVoiceOn(voice);
    if (voice) {
      speechCtrl.speak('Voice enabled.');
    }
  };

  // Speak dialogue when reaching decision prompt
  const handleReachTrigger = () => {
    soundCtrl.playSelect();
    setRunState('decision_prompt');

    if (currentNode.dialogue) {
      const personalizedSpeaker = personalizeText(currentNode.speaker, heroName);
      const personalizedDialogue = personalizeText(currentNode.dialogue, heroName);
      const spokenText = `${personalizedSpeaker} says: ${personalizedDialogue}`;
      speechCtrl.speak(spokenText);
    }
  };

  // 1. Confirm run active & validate selected choice
  const handleSelectChoice = (choice: Choice) => {
    if (runState !== 'decision_prompt' || isProcessing) return;
    setIsProcessing(true);
    setSelectedChoice(choice);

    if (choice.isCorrect) {
      soundCtrl.playCorrect();
      const updatedScore = score + 350;
      setScore(updatedScore);
      setRunState('feedback_correct');
      setIsProcessing(false);
    } else {
      soundCtrl.playIncorrect();
      setRunState('lost');
      setIsProcessing(false);

      // Record failed run to local storage & server asynchronously
      storage.recordRunResult(mission.id, false, score);
      fetch('/api/game-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          score,
          status: 'lost',
          decisionsCompleted: currentNode.decisionNumber - 1
        })
      }).catch(() => {});
    }
  };

  // 2. Advance to next decision node or victory
  const handleAdvance = () => {
    if (!selectedChoice || !selectedChoice.isCorrect) return;

    soundCtrl.playSelect();
    const nextNodeId = currentNode.winningNextNodeId;

    if (nextNodeId === 'VICTORY') {
      soundCtrl.playVictory();
      setRunState('victory');
      const finalScore = score + 500; // Bonus for completing mission
      setScore(finalScore);

      // Record victory in client storage & unlock next mission
      storage.recordRunResult(
        mission.id,
        true,
        finalScore,
        nextMission?.id,
        { badgeName: mission.badgeName, missionId: mission.id }
      );

      // Persist to backend SQLite
      fetch('/api/game-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          score: finalScore,
          status: 'completed',
          decisionsCompleted: 3
        })
      }).catch(() => {});
    } else if (nextNodeId && mission.nodes[nextNodeId]) {
      setCurrentNodeId(nextNodeId);
      setSelectedChoice(null);
      setRunState('traversing'); // Transition back to 2D Phaser world traversal
    }
  };

  // 3. Restart mission from the very beginning
  const handleRestartMission = () => {
    soundCtrl.playSelect();
    setCurrentNodeId(mission.startNodeId);
    setSelectedChoice(null);
    setScore(0);
    setRunState('traversing');
    setIsProcessing(false);
  };

  // Determine Aira visual pose based on current state
  const airaPose =
    runState === 'victory'
      ? 'victory'
      : runState === 'lost'
      ? 'worried'
      : runState === 'feedback_correct'
      ? 'relieved'
      : runState === 'decision_prompt'
      ? 'alert'
      : 'walk';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-midnight/90 select-none overflow-y-auto">
      {/* Top HUD Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { soundCtrl.playSelect(); onExit(); }}
              onMouseEnter={() => soundCtrl.playHover()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigoDeep/80 hover:bg-darkViolet border border-white/10 text-xs text-mutedLavender hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit</span>
            </button>
            {/* Character identity badge with cute anime face avatar */}
            {selectedCharacter && (
              <div
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-orbitron font-bold backdrop-blur-md"
                style={{
                  background: `${charColor}15`,
                  border: `1px solid ${charColor}50`,
                  color: charColor
                }}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-midnight/80 border border-white/20 flex items-center justify-center shrink-0">
                  <CharacterPortrait char={selectedCharacter} size={28} headOnly />
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{charEmoji}</span>
                  <span className="text-white">{heroName}</span>
                  <span className="text-mutedLavender font-normal hidden sm:inline">·</span>
                  <span className="hidden sm:inline">{selectedCharacter.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Center Progress Tracker */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-orbitron font-bold text-softCyan tracking-wider uppercase">
              MISSION 0{mission.number} // {mission.title}
            </div>
            {runState !== 'victory' && runState !== 'lost' && (
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                      step < currentNode.decisionNumber
                        ? 'bg-successMint'
                        : step === currentNode.decisionNumber
                        ? 'bg-electricBlue animate-pulse'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
                <span className="text-[11px] font-mono text-mutedLavender ml-1">
                  Node {currentNode.decisionNumber}/3
                </span>
              </div>
            )}
          </div>

          {/* Score, Voice & Sound Controls */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-lg bg-indigoDeep border border-white/10 text-xs font-mono font-bold text-softCyan">
              SCORE: {score}
            </div>
            <button
              onClick={handleToggleVoice}
              onMouseEnter={() => soundCtrl.playHover()}
              className={`px-2.5 py-1 rounded-lg border text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
                isVoiceOn
                  ? 'bg-electricBlue/30 border-cyan-400 text-softCyan shadow-glow-cyan'
                  : 'bg-indigoDeep hover:bg-darkViolet border-white/10 text-mutedLavender'
              }`}
              title="Toggle Spoken Character Dialogue"
            >
              <span>VOICE</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isVoiceOn ? 'bg-successMint animate-pulse' : 'bg-dangerRed'}`} />
            </button>
            <button
              onClick={handleToggleSound}
              onMouseEnter={() => soundCtrl.playHover()}
              className="p-1.5 rounded-lg bg-indigoDeep hover:bg-darkViolet border border-white/10 text-mutedLavender hover:text-white transition"
              aria-label="Sound Toggle"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-dangerRed" /> : <Volume2 className="w-4 h-4 text-successMint" />}
            </button>
          </div>
        </div>

        {/* Dynamic Route Guidance Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-indigoDeep/80 border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-3.5 h-3.5 text-softCyan shrink-0" />
            <span className="text-mutedLavender">Destination:</span>
            <span className="font-bold text-softCyan">{mission.environmentName}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Navigation className="w-3.5 h-3.5 text-successMint shrink-0" />
            <span className="text-mutedLavender">Objective:</span>
            <span className="font-medium text-white">{mission.learningGoal}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-mutedLavender ml-auto">
            <span className="w-2 h-2 rounded-full bg-electricBlue animate-pulse" />
            <span>Target: Beacon ◈</span>
          </div>
        </div>
      </header>

      {/* Main Narrative & Decision Center */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-auto py-4">
        {/* Visual Scene Canvas: Three.js 3D Game Layer */}
        <Game3DCanvas
          missionId={mission.id}
          missionNumber={mission.number}
          environmentName={mission.environmentName}
          nodeIndex={currentNode.decisionNumber}
          onReachTrigger={handleReachTrigger}
          airaPose={airaPose}
          heroName={heroName}
          selectedCharacter={selectedCharacter}
        />

        {/* State: 3D Traversal Mode (Moving to the Trigger Point) */}
        {runState === 'traversing' && (
          <div className="mt-4 p-5 rounded-2xl bg-indigoDeep/90 border border-electricBlue/40 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-orbitron font-bold text-softCyan uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-electricBlue animate-ping" />
                <span>3D PATROL & SCENARIO NAVIGATION // NODE 0{currentNode.decisionNumber}</span>
              </div>
              <p className="text-sm text-white font-medium">
                {getScenarioEntryPrompt(heroName, mission.number, mission.environmentName)}
              </p>
              <p className="text-xs text-mutedLavender">
                Controls: Use <span className="font-mono text-softCyan">W / A / S / D</span> to move, <span className="font-mono text-softCyan">E</span> or on-screen button to interact.
              </p>
            </div>
            <button
              onClick={handleReachTrigger}
              onMouseEnter={() => soundCtrl.playHover()}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-electricBlue to-neonLavender hover:shadow-glow-blue font-orbitron font-bold text-xs text-white uppercase tracking-wider active:scale-95 transition cursor-pointer"
            >
              APPROACH SITUATION
            </button>
          </div>
        )}

        {/* State: Decision Prompt Encountered — Animated Comic-Book Graphic Novel Conversation */}
        {runState === 'decision_prompt' && (
          <div className="mt-4">
            <ComicBookDialogueScene
              situation={personalizeText(currentNode.situation, heroName)}
              strangerSpeaker={personalizeText(currentNode.speaker, heroName)}
              strangerDialogue={personalizeText(currentNode.dialogue, heroName)}
              heroInnerThought={currentNode.airaThought ? personalizeText(currentNode.airaThought, heroName) : undefined}
              heroResponseDialogue={
                currentNode.heroResponseDialogue
                  ? personalizeText(currentNode.heroResponseDialogue, heroName)
                  : undefined
              }
              strangerType={currentNode.strangerType || 'cap_hoodie'}
              choices={currentNode.choices}
              selectedCharacter={
                selectedCharacter || {
                  id: 'gyanvi',
                  name: 'Gyanvi',
                  title: 'The Explorer',
                  personality: 'Curious, observant, resourceful',
                  traits: ['Curious', 'Confident', 'Observant'],
                  color: 'neonLavender',
                  colorHex: '#A78BFA',
                  glowHex: 'rgba(167,139,250,0.4)',
                  bgGradient: 'linear-gradient(135deg, #1E1040 0%, #2D1B69 50%, #1A1035 100%)',
                  borderColor: '#A78BFA',
                  hairColor: '#1E1638',
                  jacketColor: '#6D28D9',
                  signatureEmoji: '🔮',
                  description: 'Explorer'
                }
              }
              heroName={heroName}
              onSelectChoice={handleSelectChoice}
              selectedChoice={null}
              onAdvanceNext={handleAdvance}
              isNightEnv={mission.number === 1 || mission.number === 2}
            />
          </div>
        )}

        {/* State: Correct Choice Feedback */}
        {runState === 'feedback_correct' && selectedChoice && (
          <div className="mt-4 p-6 rounded-2xl bg-indigoDeep/95 border border-successMint/50 shadow-glow-mint backdrop-blur-md">
            <div className="flex items-center gap-3 text-successMint font-orbitron font-bold text-base sm:text-lg mb-2">
              <CheckCircle className="w-6 h-6 text-successMint" />
              <span>DECISION VALIDATED — WELL DONE, {heroName.toUpperCase()}!</span>
            </div>

            <p className="text-sm text-white leading-relaxed mb-3">
              {personalizeText(selectedChoice.feedback, heroName)}
            </p>

            <div className="p-3.5 rounded-xl bg-midnight/70 border border-successMint/30 flex items-start gap-3 text-xs text-mutedLavender mb-5">
              <Lightbulb className="w-5 h-5 text-softCyan shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-softCyan">Safety Rule: </span>
                {personalizeText(selectedChoice.educationalTip, heroName)}
              </div>
            </div>

            <button
              onClick={handleAdvance}
              onMouseEnter={() => soundCtrl.playHover()}
              className="w-full py-3 px-6 rounded-xl bg-successMint hover:bg-successMint/90 text-midnight font-orbitron font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-mint transition cursor-pointer"
            >
              <span>CONTINUE STORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* State: Game Over (Immediate on Incorrect Choice) */}
        {runState === 'lost' && selectedChoice && (
          <div className="mt-4 p-6 rounded-2xl bg-indigoDeep/95 border border-dangerRed/60 shadow-glow-danger backdrop-blur-md text-center">
            <div className="w-14 h-14 rounded-full bg-dangerRed/20 text-dangerRed mx-auto flex items-center justify-center mb-3">
              <XCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black font-orbitron text-dangerRed tracking-widest mb-1">
              GAME OVER — {heroName.toUpperCase()}
            </h2>
            <div className="text-xs text-mutedLavender font-orbitron mb-4">
              {getGameOverMessage(heroName)}
            </div>

            <div className="max-w-xl mx-auto p-4 rounded-xl bg-midnight/80 border border-dangerRed/30 text-left mb-6">
              <div className="text-xs font-bold text-dangerRed uppercase mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Why this choice was hazardous:</span>
              </div>
              <p className="text-xs sm:text-sm text-white mb-3">
                {personalizeText(selectedChoice.feedback, heroName)}
              </p>
              <div className="p-2.5 rounded-lg bg-darkViolet/40 text-xs text-softCyan border border-neonLavender/20">
                <span className="font-bold">Key Learning: </span>
                {personalizeText(selectedChoice.educationalTip, heroName)}
              </div>
            </div>

            <div className="text-xs text-mutedLavender mb-6 font-mono">
              Score Earned Before Incident: <span className="text-white font-bold">{score} pts</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestartMission}
                onMouseEnter={() => soundCtrl.playHover()}
                className="py-3 px-6 rounded-xl bg-electricBlue hover:bg-electricBlue/90 text-midnight font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-glow-blue transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESTART MISSION</span>
              </button>
              <button
                onClick={() => { soundCtrl.playSelect(); onExit(); }}
                onMouseEnter={() => soundCtrl.playHover()}
                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>RETURN TO MISSIONS</span>
              </button>
            </div>
          </div>
        )}

        {/* State: Victory & Campaign Completion */}
        {runState === 'victory' && (
          <div className="mt-4 p-6 sm:p-8 rounded-2xl bg-indigoDeep/95 border border-successMint/60 shadow-glow-mint backdrop-blur-md text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-successMint/20 text-successMint flex items-center justify-center animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              {selectedCharacter && (
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-glow-mint border-2 border-successMint/80"
                  style={{ background: `${selectedCharacter.colorHex}25` }}
                >
                  <CharacterPortrait char={selectedCharacter} size={64} headOnly pose="happy" />
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-successMint tracking-widest mb-1">
              {isFinalMission ? 'CAMPAIGN COMPLETED!' : getMissionCompletionMessage(heroName)}
            </h2>
            <p className="text-sm font-semibold text-softCyan mb-4">
              {personalizeText(mission.victoryEnding.title, heroName)}
            </p>


            <div className="max-w-xl mx-auto p-4 rounded-xl bg-midnight/80 border border-successMint/30 text-left mb-6">
              <p className="text-xs sm:text-sm text-white mb-3 leading-relaxed">
                {personalizeText(mission.victoryEnding.description, heroName)}
              </p>
              <div className="p-3 rounded-lg bg-darkViolet/50 text-xs text-softCyan border border-successMint/20">
                <span className="font-bold">Core Takeaway: </span>
                {personalizeText(mission.victoryEnding.takeaway, heroName)}
              </div>
            </div>

            {/* Badge Awarded Panel */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-gradient-to-r from-darkViolet to-indigoDeep border border-neonLavender/40 flex items-center gap-4 mb-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-neonLavender/20 text-neonLavender flex items-center justify-center shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-neonLavender uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>BADGE UNLOCKED</span>
                </div>
                <div className="text-sm font-bold font-orbitron text-white">
                  {mission.badgeName}
                </div>
                <div className="text-xs text-mutedLavender">
                  {personalizeText(mission.badgeDescription, heroName)}
                </div>
              </div>
            </div>

            <div className="text-sm text-mutedLavender mb-6 font-mono">
              Final Mission Score: <span className="text-successMint font-bold text-base">{score} pts</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isFinalMission && nextMission && onNextMission && (
                <button
                  onClick={() => {
                    soundCtrl.playSelect();
                    onNextMission(nextMission);
                  }}
                  onMouseEnter={() => soundCtrl.playHover()}
                  className="py-3 px-6 rounded-xl bg-successMint hover:bg-successMint/90 text-midnight font-orbitron font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-glow-mint transition cursor-pointer"
                >
                  <span>NEXT MISSION: 0{nextMission.number}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleRestartMission}
                onMouseEnter={() => soundCtrl.playHover()}
                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REPLAY MISSION</span>
              </button>
              <button
                onClick={() => { soundCtrl.playSelect(); onExit(); }}
                onMouseEnter={() => soundCtrl.playHover()}
                className="py-3 px-6 rounded-xl bg-indigoDeep hover:bg-darkViolet border border-white/20 text-mutedLavender hover:text-white font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>RETURN TO MAP</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 text-center text-[11px] text-mutedLavender/50 border-t border-white/5">
        Strict Deterministic Safety Engine // No AI-guessed outcomes
      </footer>
    </div>
  );
};
