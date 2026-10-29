import React, { useRef } from 'react';
import { Award, Download, CheckCircle, Shield, Star, Heart } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

export interface SafetyCertificateProps {
  heroName: string;
  score: number;
  completedMissions: number;
  onClose: () => void;
}

export const SafetyCertificateModal: React.FC<SafetyCertificateProps> = ({
  heroName,
  score,
  completedMissions,
  onClose
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    soundCtrl.playVictory();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0B1E] border-2 border-[#FFC857] shadow-[0_0_50px_rgba(255,200,87,0.3)] overflow-hidden">
        {/* Printable Certificate Area */}
        <div
          ref={certRef}
          className="p-6 sm:p-10 bg-gradient-to-br from-[#1A1635] via-[#0D0B1E] to-[#141029] border-8 border-double border-[#FFC857]/40 rounded-xl m-3 sm:m-4 text-center relative"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-[#FFC857] text-xl">✦</div>
          <div className="absolute top-3 right-3 text-[#FFC857] text-xl">✦</div>
          <div className="absolute bottom-3 left-3 text-[#FFC857] text-xl">✦</div>
          <div className="absolute bottom-3 right-3 text-[#FFC857] text-xl">✦</div>

          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFC857]/20 border-2 border-[#FFC857] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,200,87,0.5)]">
            <Award className="w-9 h-9 text-[#FFC857]" />
          </div>

          <span className="text-[11px] font-orbitron font-extrabold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
            OFFICIAL RECOGNITION
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-orbitron text-white tracking-wider mb-2">
            SAFETY HERO CERTIFICATE
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B2D9] max-w-md mx-auto mb-5">
            This certificate verifies exemplary mastery in personal safety, situational awareness, and boundary defense.
          </p>

          <div className="my-4 py-3 px-6 rounded-2xl bg-[#0D0B1E]/80 border border-white/10 max-w-sm mx-auto shadow-inner">
            <span className="text-[11px] font-mono text-[#B8B2D9] block uppercase">Awarded To</span>
            <span className="text-2xl sm:text-3xl font-black font-orbitron text-[#2EE6A6] tracking-wide">
              {heroName.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-[#B8B2D9] leading-relaxed max-w-lg mx-auto mb-6">
            For demonstrating courage, sharp intuition, and the ability to make calm, safe choices during critical real-world situations.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6 pt-3 border-t border-white/10">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-[#B8B2D9] block">Score</span>
              <span className="text-base font-bold font-orbitron text-[#FFC857]">{score} pts</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-[#B8B2D9] block">Missions</span>
              <span className="text-base font-bold font-orbitron text-[#2EE6A6]">{completedMissions}/8</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-[#B8B2D9] block">Date</span>
              <span className="text-[11px] font-bold font-orbitron text-white mt-1 block">{currentDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#FF4D8D] font-medium italic">
            <Heart className="w-3.5 h-3.5 fill-[#FF4D8D]" />
            <span>"Your gut feeling is your greatest superpower."</span>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="p-4 bg-[#090815] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              soundCtrl.playSelect();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron font-bold text-xs uppercase"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFC857] to-amber-500 hover:from-[#FFC857] hover:to-amber-400 text-[#0D0B1E] font-orbitron font-extrabold text-xs uppercase tracking-wider shadow-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>Print / Save Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
