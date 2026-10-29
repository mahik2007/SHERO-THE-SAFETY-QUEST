import React from 'react';
import { ArrowLeft, Info, Heart, Shield, Award } from 'lucide-react';
import { soundCtrl } from '../utils/sound';

interface CreditsProps {
  onBack: () => void;
}

export const CreditsModal: React.FC<CreditsProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto select-none">
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm pointer-events-none" />
      <div className="relative z-10 p-6 sm:p-10">
      {/* Top Header */}
      <header className="relative z-10 w-full max-w-3xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={() => { soundCtrl.playSelect(); onBack(); }}
          onMouseEnter={() => soundCtrl.playHover()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigoDeep/80 hover:bg-darkViolet text-xs text-mutedLavender hover:text-white transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-wider flex items-center gap-2 justify-center">
            <Info className="w-5 h-5 text-neonLavender" />
            <span>CREDITS & ACKNOWLEDGMENTS</span>
          </h2>
          <p className="text-xs text-mutedLavender">Origins, Safety Frameworks & Standards</p>
        </div>

        <div className="w-16" />
      </header>

      {/* Main Credits Content */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-6 space-y-4">
        <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-2">
          <h3 className="text-sm font-bold font-orbitron text-softCyan flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Project Mission & Development</span>
          </h3>
          <p className="text-xs sm:text-sm text-white leading-relaxed">
            <strong>SHERO: The Safety Quest</strong> was engineered as a high-impact interactive anime game designed to empower young adults with actionable personal safety knowledge, active bystander capabilities, and digital hygiene.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-2">
          <h3 className="text-sm font-bold font-orbitron text-neonLavender flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Pedagogical Frameworks Referenced</span>
          </h3>
          <ul className="text-xs text-mutedLavender space-y-1.5 list-disc list-inside">
            <li><strong>The 5Ds of Bystander Intervention:</strong> Distract, Delegate, Document, Delay, Direct (Hollaback! / Right To Be).</li>
            <li><strong>Transit Safety Protocols:</strong> 4-point verification standards for public rideshare safety.</li>
            <li><strong>Statutory Indian Emergency Infrastructure:</strong> National Emergency 112 (MHA), 1091 Women Helpline, 181 Women Helpline Scheme, 1930 Cybercrime Portal, and UGC SAKSHAM (POSH regulations).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-indigoDeep/80 border border-white/10 space-y-2">
          <h3 className="text-sm font-bold font-orbitron text-successMint flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>Privacy-First Philosophy</span>
          </h3>
          <p className="text-xs text-mutedLavender leading-relaxed">
            All SafeCircle personal safety data, contacts, and check-in sessions are strictly held inside local device storage and are never tracked or logged remotely.
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-3xl mx-auto pt-4 text-center text-xs text-mutedLavender/50 border-t border-white/5">
        SHERO: The Safety Quest // Built with React, TypeScript & Express
      </footer>
      </div>
    </div>
  );
};
