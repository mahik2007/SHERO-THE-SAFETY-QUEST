import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Settings,
  Info,
  ChevronDown,
  Building2,
  MessageSquare,
  ShieldAlert,
  GitBranch,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SheroLogo } from './SheroLogo';
import { HeroCinematicVisual } from './HeroCinematicVisual';
import { Skyline3DBackground } from './Skyline3DBackground';
import { EnvironmentArtVisual, EnvironmentType } from './EnvironmentArtVisual';
import { EnvironmentPreviewModal } from './EnvironmentPreviewModal';
import { CityEnvironmentId } from '../game3d/city3d';
import { soundCtrl } from '../utils/sound';
import { storage } from '../utils/storage';

interface TitleScreenProps {
  onPlay: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  onOpenMissions?: () => void;
  onOpenHowToPlay?: () => void;
  onStartSpecificMission?: (missionNumber: number) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onPlay,
  onOpenSettings,
  onOpenCredits,
  onOpenMissions,
  onOpenHowToPlay,
  onStartSpecificMission
}) => {
  const [isMuted, setIsMuted] = useState(soundCtrl.getMuted());
  const heroName = storage.getSettings().heroName?.trim() || 'Heroine';

  // State for active 3D environment preview modal
  const [previewEnv, setPreviewEnv] = useState<{
    id: CityEnvironmentId;
    title: string;
    subtitle: string;
    description: string;
    missionNumber: number;
  } | null>(null);

  const handleToggleAudio = () => {
    const muted = soundCtrl.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundCtrl.playSelect();
      soundCtrl.startAmbientBGM();
    }
  };

  const handlePlayClick = () => {
    soundCtrl.playSelect();
    if (!isMuted) {
      soundCtrl.startAmbientBGM();
    }
    onPlay();
  };

  const scrollToExploration = () => {
    soundCtrl.playSelect();
    const target = document.getElementById('world-exploration');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Environment definitions for World Exploration Section
  const environments = [
    {
      id: 'city_streets' as CityEnvironmentId,
      type: 'city_streets' as EnvironmentType,
      title: 'City Streets',
      subtitle: 'Bustling Evening Shopping Avenues',
      description: 'Explore, observe, stay aware. Navigate bustling evening avenues, identify verified safe havens like Moonlight Café, and handle subtle crowd dynamics.',
      missionNumber: 1
    },
    {
      id: 'bus_stop' as CityEnvironmentId,
      type: 'bus_stop' as EnvironmentType,
      title: 'The Bus Stop',
      subtitle: 'Transit Shelter & Commuter Hub',
      description: 'People, choices, real situations. Recognize boundary violations, position near illuminated staffed zones, and verify public transit arrival protocols.',
      missionNumber: 1
    },
    {
      id: 'the_alley' as CityEnvironmentId,
      type: 'the_alley' as EnvironmentType,
      title: 'The Alley',
      subtitle: 'Narrow Urban Night Corridor',
      description: 'Be alert, trust your instincts. Spot intentional tracking early, verify foot cadence, and redirect toward open commercial storefronts.',
      missionNumber: 2
    },
    {
      id: 'city_intersection' as CityEnvironmentId,
      type: 'city_intersection' as EnvironmentType,
      title: 'City Intersection',
      subtitle: 'Multi-lane Urban Crossings',
      description: 'Stay calm, make the right choice. Cross safely, verify rideshare vehicles and license plates, and navigate complex urban crossings with monitored telemetry.',
      missionNumber: 3
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-midnight/60 backdrop-blur-[2px] select-none overflow-x-hidden text-[#F8FAFC]">
      {/* =========================================================================
          PART A — SECTION 3: CINEMATIC NAVIGATION BAR
      ========================================================================= */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-midnight/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Left: SHERO Logo with Butterfly Motif */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <SheroLogo size="sm" showSubtitle={false} />
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide text-mutedLavender">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-softCyan transition text-white"
          >
            Home
          </button>
          <button
            onClick={scrollToExploration}
            className="hover:text-softCyan transition"
          >
            Explore
          </button>
          {onOpenMissions && (
            <button
              onClick={() => { soundCtrl.playSelect(); onOpenMissions(); }}
              className="hover:text-softCyan transition"
            >
              Missions
            </button>
          )}
          {onOpenHowToPlay && (
            <button
              onClick={() => { soundCtrl.playSelect(); onOpenHowToPlay(); }}
              className="hover:text-softCyan transition"
            >
              How to Play
            </button>
          )}
          <button
            onClick={() => { soundCtrl.playSelect(); onOpenSettings(); }}
            className="hover:text-softCyan transition"
          >
            Settings
          </button>
        </div>

        {/* Right: Audio Toggle & PLAY NOW Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAudio}
            onMouseEnter={() => soundCtrl.playHover()}
            className="p-2 rounded-xl bg-indigoDeep/80 hover:bg-darkViolet border border-white/15 text-mutedLavender hover:text-white transition"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-dangerRed" /> : <Volume2 className="w-4 h-4 text-successMint" />}
          </button>

          <button
            onClick={handlePlayClick}
            onMouseEnter={() => soundCtrl.playHover()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-electricBlue to-neonLavender hover:shadow-glow-blue font-orbitron font-bold text-xs uppercase tracking-wider text-midnight active:scale-95 transition cursor-pointer"
          >
            PLAY NOW
          </button>
        </div>
      </nav>

      {/* =========================================================================
          PART A — SECTION 2: HERO SECTION (SHERO TITLE SCREEN)
      ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12 overflow-hidden">
        {/* Layer 1: Three.js 3D Skyline & Moving Highway Traffic */}
        <Skyline3DBackground />

        {/* Layer 2: HeroCinematicVisual (Moonlight Café street scene, anime heroine looking back with backpack) */}
        <HeroCinematicVisual heroName={heroName} />

        {/* Layer 3: Central Hero Content & Responsive Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto my-auto pt-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Main Title & Action Center (Left Column) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11142B]/85 border border-[#829A88]/50 backdrop-blur-md text-xs font-semibold text-[#BAE6FD] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="font-orbitron font-medium tracking-wide">Interactive Anime Safety Adventure</span>
              </div>

              {/* Title with Butterfly Logo */}
              <div className="flex flex-col items-start min-w-0">
                <SheroLogo size="hero" showSubtitle={true} />
              </div>

              {/* Tagline & Supporting Copy */}
              <div className="space-y-3 max-w-xl">
                <p className="text-xl sm:text-2xl font-bold font-orbitron text-white tracking-wide leading-snug">
                  “Every choice shapes your journey.”
                </p>
                <p className="text-sm sm:text-base text-[#B9B7D6] leading-relaxed">
                  Explore the city. Trust your instincts. Make your choices. Discover the power of staying aware in realistic, living environments.
                </p>
              </div>

              {/* Two Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                {/* PLAY NOW BUTTON */}
                <button
                  onClick={handlePlayClick}
                  onMouseEnter={() => soundCtrl.playHover()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-electricBlue via-neonLavender to-softCyan hover:shadow-glow-blue hover:scale-[1.02] active:scale-95 text-midnight font-orbitron font-extrabold text-sm sm:text-base tracking-wider flex items-center justify-center gap-3 transition cursor-pointer shadow-md"
                >
                  <span>PLAY NOW</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* EXPLORE THE WORLD BUTTON */}
                <button
                  onClick={scrollToExploration}
                  onMouseEnter={() => soundCtrl.playHover()}
                  className="px-7 py-3.5 rounded-2xl bg-[#11142B]/80 hover:bg-[#20133F] border border-white/20 hover:border-[#67E8F9] text-white font-orbitron font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer shadow-sm hover:shadow-glow-cyan"
                >
                  <Compass className="w-4 h-4 text-softCyan" />
                  <span>EXPLORE THE WORLD</span>
                </button>
              </div>
            </div>

            {/* Right Column: 5 Feature Badges (Dedicated, Non-Overlapping Layout) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5 justify-center max-w-md w-full ml-auto">
              {[
                { icon: Building2, title: 'Real City Environments', desc: 'Populated streets, transit stops & alleys' },
                { icon: MessageSquare, title: 'Interactive Story', desc: 'Full-voice dialogue & living pedestrians' },
                { icon: ShieldAlert, title: 'Safety Missions', desc: '7 real-world situational challenges' },
                { icon: GitBranch, title: 'Meaningful Choices', desc: 'Deterministic 3-option safety outcomes' },
                { icon: Users, title: 'For a Safer Tomorrow', desc: 'Situational boundary & defense skills' }
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#11142B]/80 border border-white/10 hover:border-neonLavender/40 backdrop-blur-md flex items-center gap-3.5 shadow-sm transition-transform hover:translate-x-1"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#20133F] flex items-center justify-center text-softCyan border border-white/10 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold font-orbitron text-white truncate">
                        {badge.title}
                      </div>
                      <div className="text-[11px] text-[#B9B7D6] truncate">
                        {badge.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll to Explore Indicator */}
        <div
          onClick={scrollToExploration}
          className="relative z-10 mx-auto pt-6 flex flex-col items-center gap-1 cursor-pointer text-mutedLavender hover:text-softCyan transition animate-bounce"
        >
          <span className="text-[11px] font-orbitron tracking-widest uppercase">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* =========================================================================
          PART B: WORLD EXPLORATION SECTION (ONE CITY. DIFFERENT CHOICES.)
      ========================================================================= */}
      <section id="world-exploration" className="relative z-10 w-full py-20 px-6 sm:px-12 bg-midnight/95 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softCyan/10 border border-softCyan/30 text-xs font-mono font-bold text-softCyan tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>FOUR LIVING ENVIRONMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-orbitron text-white tracking-wide">
              ONE CITY. DIFFERENT CHOICES.
            </h2>
            <p className="text-sm sm:text-base text-mutedLavender max-w-2xl mx-auto">
              Step into a living city. Face real situations. Learn, choose, and grow into a braver, more aware self.
            </p>
          </div>

          {/* Feature Banner: "A SAFER TOMORROW BEGINS WITH A BRAVER YOU." */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigoDeep via-darkViolet to-indigoDeep border border-neonLavender/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black font-orbitron text-white">
                A SAFER TOMORROW BEGINS WITH A BRAVER YOU.
              </h3>
              <p className="text-xs sm:text-sm text-softCyan">
                Explore real situations. Make the right choices. Discover your strength.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center shrink-0">
              <div className="px-4 py-2 rounded-xl bg-midnight/70 border border-white/10">
                <div className="text-lg font-bold font-orbitron text-softCyan">7</div>
                <div className="text-[10px] text-mutedLavender uppercase">Missions</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-midnight/70 border border-white/10">
                <div className="text-lg font-bold font-orbitron text-neonLavender">21</div>
                <div className="text-[10px] text-mutedLavender uppercase">Scenarios</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-midnight/70 border border-white/10">
                <div className="text-lg font-bold font-orbitron text-successMint">3D</div>
                <div className="text-[10px] text-mutedLavender uppercase">Living World</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-midnight/70 border border-white/10">
                <div className="text-lg font-bold font-orbitron text-electricBlue">100%</div>
                <div className="text-[10px] text-mutedLavender uppercase">Deterministic</div>
              </div>
            </div>
          </div>

          {/* The Four Detailed Environment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {environments.map((env) => (
              <div
                key={env.id}
                className="group relative rounded-3xl bg-indigoDeep/80 border border-white/15 hover:border-softCyan/50 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-glow-cyan/20 flex flex-col justify-between"
              >
                {/* Visual Artwork Thumbnail */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden">
                  <EnvironmentArtVisual type={env.type} showOverlayTags={true} />
                </div>

                {/* Content & Actions */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-orbitron text-white group-hover:text-softCyan transition">
                      {env.title}
                    </h3>
                    <p className="text-xs font-semibold text-softCyan mt-0.5 font-mono">
                      {env.subtitle}
                    </p>
                    <p className="text-xs text-mutedLavender mt-2 leading-relaxed">
                      {env.description}
                    </p>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        soundCtrl.playSelect();
                        setPreviewEnv(env);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-orbitron font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-softCyan" />
                      <span>PREVIEW 3D WORLD</span>
                    </button>

                    <button
                      onClick={() => {
                        soundCtrl.playVictory();
                        if (onStartSpecificMission) {
                          onStartSpecificMission(env.missionNumber);
                        } else {
                          onPlay();
                        }
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-electricBlue to-neonLavender hover:shadow-glow-blue text-xs font-orbitron font-bold text-midnight uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-midnight" />
                      <span>ENTER MISSION</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER NAVIGATION & CREDITS
      ========================================================================= */}
      <footer className="relative z-10 w-full py-8 px-6 sm:px-12 border-t border-white/10 bg-midnight text-center text-xs text-mutedLavender space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button
            onClick={() => { soundCtrl.playSelect(); onOpenSettings(); }}
            className="hover:text-white flex items-center gap-1.5 transition"
          >
            <Settings className="w-3.5 h-3.5 text-softCyan" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => { soundCtrl.playSelect(); onOpenCredits(); }}
            className="hover:text-white flex items-center gap-1.5 transition"
          >
            <Info className="w-3.5 h-3.5 text-neonLavender" />
            <span>Credits & Safety Resources</span>
          </button>
          {onOpenHowToPlay && (
            <button
              onClick={() => { soundCtrl.playSelect(); onOpenHowToPlay(); }}
              className="hover:text-white flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-successMint" />
              <span>How to Play Guide</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-mutedLavender/50">
          SHERO: The Safety Quest // Full-Stack Interactive Educational Safety Engine
        </p>
      </footer>

      {/* Interactive 3D Environment Preview Modal */}
      {previewEnv && (
        <EnvironmentPreviewModal
          environmentId={previewEnv.id}
          title={previewEnv.title}
          subtitle={previewEnv.subtitle}
          description={previewEnv.description}
          heroName={heroName}
          onEnterMission={() => {
            const num = previewEnv.missionNumber;
            setPreviewEnv(null);
            if (onStartSpecificMission) {
              onStartSpecificMission(num);
            } else {
              onPlay();
            }
          }}
          onClose={() => setPreviewEnv(null)}
        />
      )}
    </div>
  );
};
