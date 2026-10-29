import React from 'react';

export interface KitsuSpiritProps {
  hintText?: string;
  isOpen: boolean;
  onToggle: () => void;
  hintsRemaining: number;
}

export const KitsuSpirit: React.FC<KitsuSpiritProps> = ({
  hintText,
  isOpen,
  onToggle,
  hintsRemaining
}) => {
  return (
    <div className="relative inline-block select-none">
      {/* Floating Kitsu Spirit Icon */}
      <button
        type="button"
        onClick={onToggle}
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/40 border border-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.35)] transition cursor-pointer"
        title="Tap Kitsu for your Gut Feeling hint!"
      >
        <span className="text-lg animate-bounce">🦊</span>
        <div className="text-left">
          <div className="text-[10px] font-orbitron font-extrabold text-amber-300 leading-tight">
            KITSU
          </div>
          <div className="text-[9px] text-amber-200/80 font-mono">
            {hintsRemaining > 0 ? `${hintsRemaining} hints` : 'Intuition'}
          </div>
        </div>
      </button>

      {/* Popover Gut Feeling Cloud */}
      {isOpen && (
        <div className="absolute top-12 left-0 sm:left-auto sm:right-0 w-72 p-4 rounded-2xl bg-gradient-to-b from-[#1A1635] to-[#0D0B1E] border-2 border-amber-400/70 shadow-[0_12px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in zoom-in-95 duration-200 text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-400/20">
            <span className="font-orbitron font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <span>✨</span>
              <span>Gut Feeling Whisper</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400/80">Trust Your Gut</span>
          </div>

          <p className="text-xs text-slate-100 leading-relaxed italic">
            "{hintText || 'Always move towards well-lit public places and never hesitate to trust what your instincts are telling you.'}"
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-300/80">
            <span>Kitsu is always with you</span>
            <button
              onClick={onToggle}
              className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
