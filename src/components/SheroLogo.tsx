import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
}

export const SheroLogo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, className = '' }) => {
  const isHero = size === 'hero';
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        {/* Main Title: SHERO with integrated glowing butterfly */}
        <div className="relative flex items-center">
          <span
            className={`font-black tracking-[0.18em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-neonLavender to-softCyan drop-shadow-[0_0_25px_rgba(167,139,250,0.65)] ${
              isHero
                ? 'text-5xl sm:text-7xl font-orbitron'
                : isLg
                ? 'text-4xl sm:text-5xl font-orbitron'
                : isSm
                ? 'text-xl sm:text-2xl font-orbitron'
                : 'text-3xl font-orbitron'
            }`}
          >
            SHER
          </span>

          {/* Letter 'O' with Butterfly Silhouette Halo */}
          <span className="relative inline-flex items-center justify-center">
            <span
              className={`font-black tracking-[0.18em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-softCyan to-neonLavender drop-shadow-[0_0_25px_rgba(167,139,250,0.65)] ${
                isHero
                  ? 'text-5xl sm:text-7xl font-orbitron'
                  : isLg
                  ? 'text-4xl sm:text-5xl font-orbitron'
                  : isSm
                  ? 'text-xl sm:text-2xl font-orbitron'
                  : 'text-3xl font-orbitron'
              }`}
            >
              O
            </span>

            {/* Glowing Butterfly Emblem Perched on 'O' */}
            <svg
              className={`absolute -top-3 sm:-top-5 -right-2 sm:-right-4 drop-shadow-[0_0_12px_rgba(192,132,252,0.9)] animate-pulse ${
                isHero
                  ? 'w-7 h-7 sm:w-10 sm:h-10'
                  : isLg
                  ? 'w-6 h-6 sm:w-8 sm:h-8'
                  : isSm
                  ? 'w-4 h-4'
                  : 'w-5 h-5'
              }`}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="butterflyGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#67E8F9" />
                </linearGradient>
              </defs>
              {/* Left Wing Top */}
              <path
                d="M 20 20 C 14 10 5 12 6 20 C 7 24 14 23 20 20 Z"
                fill="url(#butterflyGlow)"
                opacity="0.95"
              />
              {/* Left Wing Bottom */}
              <path
                d="M 20 22 C 14 26 8 32 12 34 C 16 35 18 28 20 22 Z"
                fill="url(#butterflyGlow)"
                opacity="0.8"
              />
              {/* Right Wing Top */}
              <path
                d="M 20 20 C 26 10 35 12 34 20 C 33 24 26 23 20 20 Z"
                fill="url(#butterflyGlow)"
                opacity="0.95"
              />
              {/* Right Wing Bottom */}
              <path
                d="M 20 22 C 26 26 32 32 28 34 C 24 35 22 28 20 22 Z"
                fill="url(#butterflyGlow)"
                opacity="0.8"
              />
              {/* Body */}
              <ellipse cx="20" cy="22" rx="1.5" ry="6" fill="#F8FAFC" />
              {/* Antennae */}
              <path d="M 19 16 Q 16 11 13 12" stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 21 16 Q 24 11 27 12" stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* Subtitle */}
      {showSubtitle && (
        <div className="mt-1 sm:mt-2 flex items-center justify-center gap-3">
          <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent via-softCyan to-transparent opacity-80" />
          <span
            className={`tracking-[0.32em] font-bold uppercase text-softCyan font-orbitron drop-shadow-[0_0_8px_rgba(103,232,249,0.5)] ${
              isHero ? 'text-xs sm:text-sm' : isSm ? 'text-[8px]' : 'text-[10px] sm:text-xs'
            }`}
          >
            THE SAFETY QUEST
          </span>
          <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent via-softCyan to-transparent opacity-80" />
        </div>
      )}
    </div>
  );
};
