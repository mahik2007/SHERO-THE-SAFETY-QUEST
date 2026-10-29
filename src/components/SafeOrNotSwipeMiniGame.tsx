import React, { useState } from 'react';
import { Check, X, Shield, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

export interface CardItem {
  id: string;
  situation: string;
  isSafe: boolean;
  explanation: string;
}

const CARDS: CardItem[] = [
  {
    id: 'c1',
    situation: 'Checking that the cab child-lock is off and the driver matches the photo before getting in.',
    isSafe: true,
    explanation: 'Always verify vehicle and driver identity, and ensure you can exit freely.'
  },
  {
    id: 'c2',
    situation: 'A friendly person in an online game asks you to send your school timetable and uniform photo.',
    isSafe: false,
    explanation: 'Never share personal identifiers, routine schedules, or locations with internet contacts.'
  },
  {
    id: 'c3',
    situation: 'Stepping inside a brightly lit bakery when you notice someone walking too closely behind you.',
    isSafe: true,
    explanation: 'Moving into populated, active commercial spaces immediately deters followers.'
  },
  {
    id: 'c4',
    situation: 'Taking an unlit shortcut through an empty parking garage to save 3 minutes.',
    isSafe: false,
    explanation: 'Saving 3 minutes is never worth losing lighting, escape routes, and witnesses.'
  }
];

export const SafeOrNotSwipeMiniGame: React.FC<{
  onComplete: (score: number) => void;
  onExit: () => void;
}> = ({ onComplete, onExit }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentCard = CARDS[index];

  const handleAnswer = (choiceSafe: boolean) => {
    const isCorrect = choiceSafe === currentCard.isSafe;
    if (isCorrect) {
      soundCtrl.playCorrect();
      setScore((s) => s + 100);
      setFeedback(`Correct! ${currentCard.explanation}`);
    } else {
      soundCtrl.playIncorrect();
      setFeedback(`Careful! ${currentCard.explanation}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 < CARDS.length) {
        setIndex((i) => i + 1);
      } else {
        onComplete(score + (isCorrect ? 100 : 0));
      }
    }, 1600);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#1A1635] border border-white/10 max-w-md mx-auto text-center space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-orbitron font-bold text-[#2EE6A6] uppercase tracking-wider">
          MINI-GAME // SAFE OR NOT SAFE?
        </span>
        <span className="text-xs font-mono text-[#B8B2D9]">
          Card {index + 1} of {CARDS.length}
        </span>
      </div>

      {/* The Scenario Card */}
      <div className="min-h-[160px] flex items-center justify-center p-6 rounded-2xl bg-[#0D0B1E] border-2 border-white/15 shadow-xl relative">
        <p className="text-sm font-medium text-white leading-relaxed">
          "{currentCard.situation}"
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white animate-in fade-in duration-150">
          {feedback}
        </div>
      )}

      {/* Decision Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <button
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5470] to-rose-600 hover:brightness-110 active:scale-95 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>NOT SAFE</span>
        </button>

        <button
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#2EE6A6] to-emerald-500 hover:brightness-110 active:scale-95 text-[#0D0B1E] font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>SAFE ACTION</span>
        </button>
      </div>
    </div>
  );
};
