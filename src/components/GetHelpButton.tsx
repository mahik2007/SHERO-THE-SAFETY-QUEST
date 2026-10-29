import React from 'react';
import { Phone, HeartHandshake } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

export interface GetHelpButtonProps {
  onClick: () => void;
  className?: string;
  compact?: boolean;
}

export const GetHelpButton: React.FC<GetHelpButtonProps> = ({
  onClick,
  className = '',
  compact = false
}) => {
  return (
    <button
      onClick={() => {
        soundCtrl.playSelect();
        onClick();
      }}
      onMouseEnter={() => soundCtrl.playHover()}
      className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#FF5470] hover:brightness-110 active:scale-95 text-white font-orbitron font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,77,141,0.4)] border border-white/20 transition cursor-pointer z-30 ${className}`}
      title="Access Emergency Helplines (112, 1091, 181, 1098, 1930)"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      <Phone className="w-3.5 h-3.5" />
      <span>{compact ? 'HELP' : 'GET HELP NOW'}</span>
    </button>
  );
};
