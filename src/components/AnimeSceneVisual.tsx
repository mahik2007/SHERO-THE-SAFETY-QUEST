import React from 'react';

interface AnimeSceneProps {
  environmentName: string;
  airaPose?: 'standing' | 'worried' | 'alert' | 'relieved' | 'victory' | 'running';
  dangerLevel?: 'safe' | 'warning' | 'critical';
  heroName?: string;
}

export const AnimeSceneVisual: React.FC<AnimeSceneProps> = ({
  environmentName,
  airaPose = 'standing',
  dangerLevel = 'safe',
  heroName
}) => {
  // Atmosphere lighting based on danger level
  const auraColor =
    dangerLevel === 'critical'
      ? 'from-dangerRed/25 to-transparent'
      : dangerLevel === 'warning'
      ? 'from-amber-500/20 to-transparent'
      : 'from-electricBlue/20 to-transparent';

  return (
    <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-midnight select-none">
      {/* Background Layer with animated city gradient and neon towers */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080B18" />
            <stop offset="50%" stopColor="#11142B" />
            <stop offset="100%" stopColor="#20133F" />
          </linearGradient>

          <linearGradient id="glowWindow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4B7BFF" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="cyberGrid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0" />
            <stop offset="100%" stopColor="#4B7BFF" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="streetlightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#67E8F9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#11142B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1000" height="500" fill="url(#skyGrad)" />

        {/* Cyber Stars / Night Dust */}
        <g opacity="0.6">
          <circle cx="120" cy="45" r="1.5" fill="#67E8F9" />
          <circle cx="280" cy="80" r="1.2" fill="#F8FAFC" />
          <circle cx="450" cy="30" r="2" fill="#A78BFA" />
          <circle cx="670" cy="65" r="1.5" fill="#F8FAFC" />
          <circle cx="890" cy="40" r="1.8" fill="#67E8F9" />
          <circle cx="780" cy="110" r="1.2" fill="#A78BFA" />
        </g>

        {/* Distant Skyline Silhouettes */}
        <path
          d="M 0 350 L 50 310 L 90 310 L 110 270 L 160 270 L 170 330 L 220 330 L 240 240 L 300 240 L 320 340 L 400 340 L 430 220 L 490 220 L 510 320 L 600 320 L 640 260 L 710 260 L 730 350 L 800 350 L 840 210 L 910 210 L 940 330 L 1000 330 L 1000 500 L 0 500 Z"
          fill="#0B0E23"
          opacity="0.85"
        />

        {/* Midground Illuminated Towers with anime neon windows */}
        <g opacity="0.75">
          <rect x="120" y="290" width="30" height="60" fill="url(#glowWindow)" opacity="0.6" rx="2" />
          <rect x="250" y="260" width="35" height="80" fill="url(#glowWindow)" opacity="0.5" rx="2" />
          <rect x="445" y="240" width="30" height="100" fill="url(#glowWindow)" opacity="0.8" rx="2" />
          <rect x="660" y="280" width="40" height="70" fill="url(#glowWindow)" opacity="0.6" rx="2" />
          <rect x="860" y="230" width="35" height="110" fill="url(#glowWindow)" opacity="0.8" rx="2" />
        </g>

        {/* Environment-Specific Features */}
        {environmentName.includes('Bus Stop') && (
          <g>
            {/* Bus Shelter & Illuminated roof */}
            <path d="M 50 250 L 280 230 L 280 245 L 50 265 Z" fill="#4B7BFF" opacity="0.9" />
            <line x1="70" y1="260" x2="70" y2="430" stroke="#67E8F9" strokeWidth="4" />
            <line x1="260" y1="245" x2="260" y2="430" stroke="#67E8F9" strokeWidth="4" />
            <rect x="75" y="265" width="180" height="140" fill="#20133F" opacity="0.4" rx="4" />
            {/* Neon Transit Sign */}
            <rect x="80" y="275" width="80" height="25" fill="#11142B" rx="3" stroke="#65F5C5" strokeWidth="1" />
            <text x="88" y="292" fill="#65F5C5" fontSize="12" fontFamily="Orbitron" fontWeight="bold">LINE 42</text>
            <circle cx="680" cy="220" r="60" fill="url(#streetlightGlow)" />
            <line x1="680" y1="220" x2="680" y2="430" stroke="#B9B7D6" strokeWidth="3" />
          </g>
        )}

        {environmentName.includes('Urban Sidewalk') && (
          <g>
            {/* Streetlights and Bistro Neon */}
            <circle cx="220" cy="200" r="70" fill="url(#streetlightGlow)" />
            <line x1="220" y1="200" x2="220" y2="440" stroke="#B9B7D6" strokeWidth="4" />
            <rect x="680" y="270" width="180" height="90" fill="#20133F" stroke="#65F5C5" strokeWidth="2" rx="4" />
            <text x="700" y="320" fill="#65F5C5" fontSize="18" fontFamily="Orbitron" fontWeight="bold">24H BISTRO</text>
            <circle cx="790" cy="200" r="70" fill="url(#streetlightGlow)" opacity="0.7" />
          </g>
        )}

        {environmentName.includes('Rideshare') && (
          <g>
            {/* Curbside pickup sign and road lines */}
            <rect x="180" y="280" width="120" height="35" fill="#11142B" stroke="#4B7BFF" strokeWidth="2" rx="6" />
            <text x="195" y="303" fill="#67E8F9" fontSize="13" fontFamily="Orbitron" fontWeight="bold">RIDESHARE BAY</text>
            <line x1="240" y1="315" x2="240" y2="440" stroke="#4B7BFF" strokeWidth="3" />
            {/* Car silhouette */}
            <path d="M 640 370 Q 700 320 780 320 Q 860 320 900 370 L 920 410 L 620 410 Z" fill="#11142B" stroke="#4B7BFF" strokeWidth="2" />
            <circle cx="670" cy="410" r="18" fill="#20133F" stroke="#67E8F9" strokeWidth="3" />
            <circle cx="870" cy="410" r="18" fill="#20133F" stroke="#67E8F9" strokeWidth="3" />
          </g>
        )}

        {environmentName.includes('Social Gathering') && (
          <g>
            {/* Party lights and strings */}
            <path d="M 50 150 Q 250 200 500 160 Q 750 200 950 140" fill="none" stroke="#FF5470" strokeWidth="2" strokeDasharray="6,12" />
            <circle cx="150" cy="175" r="8" fill="#FF5470" />
            <circle cx="320" cy="180" r="8" fill="#65F5C5" />
            <circle cx="500" cy="160" r="8" fill="#67E8F9" />
            <circle cx="680" cy="185" r="8" fill="#A78BFA" />
            <circle cx="840" cy="155" r="8" fill="#4B7BFF" />
            {/* Exit glow door */}
            <rect x="750" y="260" width="80" height="150" fill="#11142B" stroke="#65F5C5" strokeWidth="3" rx="4" />
            <text x="765" y="285" fill="#65F5C5" fontSize="14" fontFamily="Orbitron" fontWeight="bold">EXIT</text>
          </g>
        )}

        {environmentName.includes('Digital') && (
          <g>
            {/* Matrix / Cyber Grid lines */}
            <path d="M 0 400 L 1000 400 M 0 430 L 1000 430 M 0 460 L 1000 460 M 0 490 L 1000 490" stroke="#4B7BFF" strokeWidth="1" opacity="0.4" />
            <line x1="200" y1="360" x2="100" y2="500" stroke="#A78BFA" strokeWidth="1" opacity="0.3" />
            <line x1="400" y1="360" x2="350" y2="500" stroke="#A78BFA" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="360" x2="650" y2="500" stroke="#A78BFA" strokeWidth="1" opacity="0.3" />
            <line x1="800" y1="360" x2="900" y2="500" stroke="#A78BFA" strokeWidth="1" opacity="0.3" />
            {/* Floating Cyber Shields */}
            <polygon points="780,240 820,260 820,310 780,335 740,310 740,260" fill="#20133F" stroke="#67E8F9" strokeWidth="2" opacity="0.8" />
            <text x="765" y="295" fill="#67E8F9" fontSize="12" fontFamily="Orbitron">MFA</text>
          </g>
        )}

        {environmentName.includes('Corridor') && (
          <g>
            {/* Perspective hallway pillars */}
            <polygon points="150,150 250,220 250,450 150,490" fill="#11142B" stroke="#4B7BFF" strokeWidth="1" />
            <polygon points="850,150 750,220 750,450 850,490" fill="#11142B" stroke="#4B7BFF" strokeWidth="1" />
            {/* Student Support Office Door */}
            <rect x="380" y="240" width="140" height="170" fill="#20133F" stroke="#A78BFA" strokeWidth="2" rx="4" />
            <text x="395" y="270" fill="#A78BFA" fontSize="11" fontFamily="Orbitron" fontWeight="bold">STUDENT SUPPORT</text>
            <text x="430" y="290" fill="#65F5C5" fontSize="10" fontFamily="sans-serif">ICC ROOM 104</text>
          </g>
        )}

        {environmentName.includes('Metro Plaza') && (
          <g>
            {/* Central plaza columns and Emergency Help Point */}
            <rect x="720" y="230" width="45" height="180" fill="#FF5470" rx="4" />
            <circle cx="742" cy="260" r="12" fill="#F8FAFC" />
            <text x="736" y="265" fill="#FF5470" fontSize="14" fontWeight="bold">SOS</text>
            <text x="725" y="320" fill="#F8FAFC" fontSize="9" fontFamily="Orbitron" transform="rotate(-90 735,320)">HELP POINT</text>
            {/* Metro overhead sign */}
            <rect x="250" y="200" width="220" height="40" fill="#11142B" stroke="#67E8F9" strokeWidth="2" rx="4" />
            <text x="270" y="225" fill="#67E8F9" fontSize="14" fontFamily="Orbitron" fontWeight="bold">METRO PLATFORM 3</text>
          </g>
        )}

        {/* Foreground Ground / Pavement */}
        <polygon points="0,420 1000,420 1000,500 0,500" fill="#0E1226" />
        <line x1="0" y1="420" x2="1000" y2="420" stroke="#4B7BFF" strokeWidth="2" opacity="0.7" />

        {/* PROTAGONIST: Aira - Original Layered Anime Vector Illustration */}
        <g transform="translate(390, 180)">
          {/* Subtle Ground Shadow */}
          <ellipse cx="60" cy="240" rx="55" ry="12" fill="#000000" opacity="0.6" />

          {/* Hair back layer (Distinct dark hair with violet highlights) */}
          <path
            d="M 25 70 C 15 120 10 180 20 210 C 35 220 50 200 55 170 C 65 170 80 210 100 200 C 110 170 105 120 95 70 Z"
            fill="#181230"
          />
          <path
            d="M 22 90 C 18 130 18 170 28 190 C 32 170 35 140 38 110 Z"
            fill="#7C3AED"
            opacity="0.8"
          />

          {/* Body & Clothing: Modern casual jacket and anime silhouette */}
          {/* Legs / Jeans */}
          <path d="M 45 180 L 42 235 L 54 235 L 56 180 Z" fill="#1E293B" />
          <path d="M 64 180 L 66 235 L 78 235 L 75 180 Z" fill="#1E293B" />
          {/* Sneakers with electric blue accents */}
          <path d="M 38 233 L 55 233 L 56 240 L 36 240 Z" fill="#F8FAFC" />
          <rect x="42" y="235" width="8" height="3" fill="#4B7BFF" />
          <path d="M 64 233 L 81 233 L 83 240 L 63 240 Z" fill="#F8FAFC" />
          <rect x="68" y="235" width="8" height="3" fill="#4B7BFF" />

          {/* Jacket / Torso */}
          <path
            d="M 35 110 L 85 110 L 92 185 L 28 185 Z"
            fill="#20133F"
            stroke="#4B7BFF"
            strokeWidth="1.5"
          />
          {/* Inner shirt with mint/lavender trim */}
          <polygon points="50,110 70,110 65,160 55,160" fill="#65F5C5" opacity="0.9" />

          {/* Arms according to pose */}
          {airaPose === 'worried' || airaPose === 'alert' ? (
            /* Hands near chest holding smartphone */
            <g>
              <path d="M 30 115 L 48 145 L 55 140 L 40 115 Z" fill="#20133F" />
              <path d="M 90 115 L 72 145 L 65 140 L 80 115 Z" fill="#20133F" />
              {/* Anime Smartphone glowing */}
              <rect x="52" y="130" width="16" height="26" rx="3" fill="#080B18" stroke="#67E8F9" strokeWidth="1.5" />
              <rect x="55" y="134" width="10" height="18" rx="1" fill="#4B7BFF" />
            </g>
          ) : airaPose === 'victory' ? (
            /* Arms raised triumphantly */
            <g>
              <path d="M 35 115 L 15 75 L 24 70 L 45 110 Z" fill="#20133F" />
              <path d="M 85 115 L 105 75 L 96 70 L 75 110 Z" fill="#20133F" />
              {/* Hands */}
              <circle cx="18" cy="72" r="5" fill="#FED7AA" />
              <circle cx="102" cy="72" r="5" fill="#FED7AA" />
            </g>
          ) : (
            /* Standing casual with phone in one hand */
            <g>
              <path d="M 35 115 L 28 165 L 36 165 L 45 115 Z" fill="#20133F" />
              <path d="M 85 115 L 88 150 L 78 150 L 75 115 Z" fill="#20133F" />
              <rect x="76" y="145" width="10" height="18" rx="2" fill="#080B18" stroke="#A78BFA" strokeWidth="1" />
            </g>
          )}

          {/* Anime Head & Face (Cute Youthful Anime CG Style) */}
          {/* Neck */}
          <rect x="54" y="93" width="12" height="18" fill="#FDE3D2" />
          <path d="M 54 94 Q 60 99 66 94 Z" fill="#E8A994" opacity="0.6" />

          {/* Face Contour with soft cheeks and gentle jawline */}
          <path
            d="M 39 58 C 38 84 46 103 60 105 C 74 103 82 84 81 58 C 81 38 72 32 60 32 C 48 32 39 38 39 58 Z"
            fill="#FFF1E8"
            stroke="#F0BAA8"
            strokeWidth="0.8"
          />

          {/* Soft anime cheek blush with cute diagonal marks */}
          <ellipse cx="48" cy="78" rx="8" ry="4.5" fill="#FB7185" opacity="0.45" />
          <ellipse cx="72" cy="78" rx="8" ry="4.5" fill="#FB7185" opacity="0.45" />
          <line x1="45" y1="78" x2="48" y2="76" stroke="#F43F5E" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          <line x1="49" y1="78" x2="52" y2="76" stroke="#F43F5E" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          <line x1="68" y1="78" x2="71" y2="76" stroke="#F43F5E" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          <line x1="72" y1="78" x2="75" y2="76" stroke="#F43F5E" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />

          {/* Anime Eyes (Large expressive eyes with violet/cyan shine, catchlight & lashes) */}
          {/* Left Eye */}
          <g>
            <path d="M 44 60 Q 49 57 55 60" stroke="#A76050" strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" />
            <ellipse cx="49" cy="69" rx="5.5" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="49" cy="69.5" rx="4.5" ry="6.5" fill="#4C1D95" />
            <ellipse cx="49" cy="70" rx="3.5" ry="4.8" fill="#8B5CF6" />
            <ellipse cx="49" cy="71" rx="2.4" ry="2.5" fill="#67E8F9" opacity="0.9" />
            <ellipse cx="49" cy="69.5" rx="2" ry="3" fill="#0A0915" />
            <ellipse cx="47.5" cy="66.5" rx="1.8" ry="2.2" fill="#FFFFFF" />
            <circle cx="51" cy="72" r="0.9" fill="#FFFFFF" opacity="0.85" />
            <path d="M 43 65 Q 48 59 55 64" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 43 65 Q 41 63 42 61" stroke="#0F172A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Right Eye */}
          <g>
            <path d="M 65 60 Q 71 57 76 60" stroke="#A76050" strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" />
            <ellipse cx="71" cy="69" rx="5.5" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="71" cy="69.5" rx="4.5" ry="6.5" fill="#4C1D95" />
            <ellipse cx="71" cy="70" rx="3.5" ry="4.8" fill="#8B5CF6" />
            <ellipse cx="71" cy="71" rx="2.4" ry="2.5" fill="#67E8F9" opacity="0.9" />
            <ellipse cx="71" cy="69.5" rx="2" ry="3" fill="#0A0915" />
            <ellipse cx="69.5" cy="66.5" rx="1.8" ry="2.2" fill="#FFFFFF" />
            <circle cx="73" cy="72" r="0.9" fill="#FFFFFF" opacity="0.85" />
            <path d="M 65 64 Q 72 59 77 65" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 77 65 Q 79 63 78 61" stroke="#0F172A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Eyelashes & Brows */}
          <path d="M 43 54 Q 49 50 55 54" stroke="#2E1065" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M 65 54 Q 71 50 77 54" stroke="#2E1065" strokeWidth="1.6" fill="none" strokeLinecap="round" />

          {/* Small button nose */}
          <circle cx="60" cy="78" r="0.9" fill="#EA580C" opacity="0.5" />

          {/* Small gentle mouth */}
          {airaPose === 'victory' || airaPose === 'relieved' ? (
            <path d="M 56 86 Q 60 91 64 86" stroke="#BE123C" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          ) : airaPose === 'worried' || airaPose === 'alert' ? (
            <ellipse cx="60" cy="86" rx="2.2" ry="2" fill="#BE123C" />
          ) : (
            <path d="M 56 87 Q 60 89.5 64 87" stroke="#BE123C" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          )}


          {/* Front Hair Bangs with violet signature tips */}
          <path
            d="M 38 50 C 42 75 48 85 52 75 C 56 85 62 88 66 74 C 70 82 78 72 82 50 C 80 32 40 32 38 50 Z"
            fill="#20133F"
          />
          <path d="M 48 70 L 52 75 L 53 68 Z" fill="#A78BFA" />
          <path d="M 64 68 L 66 74 L 68 67 Z" fill="#A78BFA" />
        </g>
      </svg>

      {/* Atmospheric Vignette & Mood Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${auraColor} pointer-events-none`} />

      {/* Top Banner Tag for Environment */}
      <div className="absolute top-3 left-4 flex items-center gap-2 bg-midnight/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium tracking-wide text-softCyan">
        <span className="w-2 h-2 rounded-full bg-softCyan animate-ping" />
        {environmentName}
      </div>

      {/* Protagonist Status Indicator */}
      <div className="absolute top-3 right-4 flex items-center gap-2 bg-midnight/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold">
        <span className="text-mutedLavender">{heroName || 'Hero'}:</span>
        <span
          className={`uppercase font-mono text-[11px] ${
            airaPose === 'victory' || airaPose === 'relieved'
              ? 'text-successMint'
              : airaPose === 'alert' || airaPose === 'worried'
              ? 'text-dangerRed'
              : 'text-neonLavender'
          }`}
        >
          {airaPose}
        </span>
      </div>
    </div>
  );
};
