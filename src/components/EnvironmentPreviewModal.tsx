import React from 'react';
import { X, Play, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Game3DCanvas } from './Game3DCanvas';
import { CityEnvironmentId } from '../game3d/city3d';
import { soundCtrl } from '../utils/sound';

interface EnvironmentPreviewModalProps {
  environmentId: CityEnvironmentId;
  title: string;
  subtitle: string;
  description: string;
  heroName: string;
  onEnterMission: () => void;
  onClose: () => void;
}

export const EnvironmentPreviewModal: React.FC<EnvironmentPreviewModalProps> = ({
  environmentId,
  title,
  subtitle,
  description,
  heroName,
  onEnterMission,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-midnight/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-4xl rounded-3xl bg-indigoDeep/95 border border-white/20 shadow-2xl p-6 sm:p-8 flex flex-col gap-5 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electricBlue/20 border border-electricBlue/40 text-[10px] font-orbitron font-bold text-softCyan uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>3D LIVING WORLD EXPLORATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-wide">
              {title}
            </h2>
            <p className="text-xs text-mutedLavender mt-0.5">{subtitle}</p>
          </div>

          <button
            onClick={() => {
              soundCtrl.playSelect();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-mutedLavender hover:text-white transition"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Viewport Layer */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl">
          <Game3DCanvas
            missionId="preview"
            missionNumber={
              environmentId === 'bus_stop' ? 1 : environmentId === 'the_alley' ? 2 : environmentId === 'city_intersection' ? 3 : 4
            }
            environmentName={title}
            nodeIndex={1}
            onReachTrigger={() => {}}
            heroName={heroName}
            forcedEnv={environmentId}
            previewMode={true}
          />
        </div>

        {/* Bottom Details & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-mutedLavender max-w-lg leading-relaxed">
            {description}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundCtrl.playSelect();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-xs text-mutedLavender hover:text-white transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                soundCtrl.playVictory();
                onEnterMission();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-electricBlue via-neonLavender to-softCyan hover:shadow-glow-blue font-orbitron font-bold text-xs uppercase tracking-wider text-midnight active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-midnight" />
              <span>ENTER MISSION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
