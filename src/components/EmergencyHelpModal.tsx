import React, { useState } from 'react';
import { Phone, Shield, Heart, X, AlertCircle, Coffee } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

export interface HelplineItem {
  number: string;
  name: string;
  description: string;
  badge: string;
}

export const HELPLINES: HelplineItem[] = [
  {
    number: '112',
    name: 'National Emergency',
    description: 'All-in-one police, medical, fire & disaster response.',
    badge: 'Immediate'
  },
  {
    number: '1091',
    name: 'Women Helpline',
    description: 'Police emergency assistance dedicated for women & girls.',
    badge: '24/7 Police'
  },
  {
    number: '181',
    name: 'Women Helpline (Domestic)',
    description: 'Confidential support, shelter & legal guidance.',
    badge: 'Support'
  },
  {
    number: '1098',
    name: 'Childline',
    description: 'Free emergency phone outreach service for children.',
    badge: 'Under 18'
  },
  {
    number: '1930',
    name: 'National Cyber Crime',
    description: 'Report online harassment, stalkers, scams & fake profiles.',
    badge: 'Cyber Safety'
  }
];

export const EmergencyHelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [showBreakScreen, setShowBreakScreen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D0B1E] border-2 border-[#FF4D8D]/60 shadow-[0_0_40px_rgba(255,77,141,0.3)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#FF4D8D]/20 via-[#7C5CFF]/20 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF4D8D]/20 border border-[#FF4D8D] flex items-center justify-center text-[#FF4D8D] shadow-lg">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron font-black text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                <span>GET HELP NOW</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-500/40">
                  India Helplines
                </span>
              </h2>
              <p className="text-[11px] text-[#B8B2D9]">Direct emergency telephone lines. Always free.</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundCtrl.playSelect();
              setShowBreakScreen(false);
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Essential Disclosures */}
        <div className="px-5 pt-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">If you are in immediate danger, call 112 right now.</p>
              <p className="text-[11px] text-amber-300/80">This game is for educational training only. Never hesitate to call official responders.</p>
            </div>
          </div>
        </div>

        {/* Content Body: Either Helpline List or Take-a-Break Screen */}
        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {!showBreakScreen ? (
            <>
              {HELPLINES.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1635] hover:bg-[#251E4E] border border-white/10 hover:border-[#FF4D8D] transition group shadow-md"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-extrabold text-base text-[#2EE6A6] group-hover:text-white transition">
                        {item.number}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-[#B8B2D9]">
                        {item.badge}
                      </span>
                    </div>
                    <div className="font-medium text-xs text-white">{item.name}</div>
                    <div className="text-[11px] text-[#B8B2D9]">{item.description}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#2EE6A6]/20 group-hover:bg-[#2EE6A6] text-[#2EE6A6] group-hover:text-[#0D0B1E] font-orbitron font-bold text-xs uppercase tracking-wider shrink-0 transition flex items-center gap-1.5 ml-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </div>
                </a>
              ))}
            </>
          ) : (
            <div className="p-6 text-center space-y-4 rounded-xl bg-[#1A1635] border border-white/10">
              <div className="w-14 h-14 rounded-full bg-[#7C5CFF]/20 text-[#7C5CFF] mx-auto flex items-center justify-center">
                <Coffee className="w-7 h-7" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">Breathe In, Breathe Out</h3>
              <p className="text-xs text-[#B8B2D9] leading-relaxed max-w-sm mx-auto">
                Safety training can sometimes bring up big emotions. That is completely normal.
                Take a sip of water, relax your shoulders, and rest for a few minutes.
              </p>
              <div className="p-3 rounded-lg bg-[#2EE6A6]/10 border border-[#2EE6A6]/30 text-xs text-[#2EE6A6] font-medium">
                You are brave, you are strong, and you are in control.
              </div>
              <button
                onClick={() => setShowBreakScreen(false)}
                className="px-4 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#7C5CFF]/90 text-white font-orbitron font-bold text-xs uppercase tracking-wider"
              >
                Back to Helplines
              </button>
            </div>
          )}
        </div>

        {/* Footer with Victim Support Guarantee and Break Button */}
        <div className="p-4 bg-[#090815] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-[#FFC857] font-medium">
            <Heart className="w-4 h-4 text-[#FF4D8D] shrink-0" />
            <span>Remember: It is never the victim's fault.</span>
          </div>
          <button
            onClick={() => {
              soundCtrl.playSelect();
              setShowBreakScreen(!showBreakScreen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#B8B2D9] hover:text-white transition cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>{showBreakScreen ? 'View Helplines' : 'Take a Break'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
