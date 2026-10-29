import React, { useState } from 'react';
import { Volume2, Mic, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

export interface MiniGameProps {
  onComplete: (scoreEarned: number) => void;
  onExit: () => void;
}

export const ShoutPowerMiniGame: React.FC<MiniGameProps> = ({ onComplete, onExit }) => {
  const [power, setPower] = useState<number>(0);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [released, setReleased] = useState<boolean>(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const startCharging = () => {
    if (released) return;
    setIsCharging(true);
    soundCtrl.playSelect();
    intervalRef.current = setInterval(() => {
      setPower((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          return 100;
        }
        return prev + 4;
      });
    }, 60);
  };

  const stopCharging = () => {
    if (!isCharging || released) return;
    setIsCharging(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setReleased(true);
    soundCtrl.playCorrect();
  };

  return (
    <div className="p-6 rounded-2xl bg-[#1A1635] border border-white/10 max-w-lg mx-auto text-center space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-orbitron font-bold text-[#FF4D8D] uppercase tracking-wider">
          MINI-GAME // SHOUT POWER
        </span>
        <button
          onClick={onExit}
          className="text-xs font-mono text-[#B8B2D9] hover:text-white"
        >
          Skip
        </button>
      </div>

      <div>
        <h3 className="text-lg font-orbitron font-bold text-white mb-1">
          Say "NO!" with Full Confidence
        </h3>
        <p className="text-xs text-[#B8B2D9] max-w-sm mx-auto">
          Hold down the button to build your confidence meter, then release to deliver a loud, clear boundary refusal!
        </p>
      </div>

      {/* Meter Bar */}
      <div className="w-full bg-[#0D0B1E] rounded-full h-8 p-1 border border-white/15 relative overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2EE6A6] via-[#FFC857] to-[#FF4D8D] transition-all duration-75"
          style={{ width: `${power}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center font-orbitron font-black text-xs text-white drop-shadow">
          {power}% POWER
        </span>
      </div>

      {!released ? (
        <button
          onMouseDown={startCharging}
          onMouseUp={stopCharging}
          onTouchStart={startCharging}
          onTouchEnd={stopCharging}
          className={`w-40 h-40 mx-auto rounded-full flex flex-col items-center justify-center gap-1 font-orbitron font-black text-xl uppercase tracking-wider shadow-2xl transition cursor-pointer select-none ${
            isCharging
              ? 'scale-110 bg-[#FF4D8D] text-white shadow-[0_0_50px_rgba(255,77,141,0.8)] animate-pulse'
              : 'bg-gradient-to-br from-[#7C5CFF] to-[#1A1635] text-white hover:border-[#FF4D8D] border-2 border-white/20'
          }`}
        >
          <Volume2 className="w-8 h-8" />
          <span>HOLD "NO!"</span>
          <span className="text-[10px] font-mono font-normal">Press & Hold</span>
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-[#2EE6A6]/20 border border-[#2EE6A6] text-white">
            <h4 className="font-orbitron font-bold text-base text-[#2EE6A6]">LOUD & CLEAR!</h4>
            <p className="text-xs mt-1">
              {power >= 70
                ? 'Your voice carried across the whole street. A confident "NO!" alerts everyone around you and stops boundary pushers immediately.'
                : 'Good attempt! Remember: Never whisper when someone violates your personal space. Clear and firm keeps you safe.'}
            </p>
          </div>
          <button
            onClick={() => onComplete(power >= 70 ? 300 : 150)}
            className="w-full py-3 rounded-xl bg-[#2EE6A6] text-[#0D0B1E] font-orbitron font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
          >
            Claim +{power >= 70 ? 300 : 150} Points
          </button>
        </div>
      )}
    </div>
  );
};
