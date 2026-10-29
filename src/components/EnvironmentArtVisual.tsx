import React from 'react';

export type EnvironmentType = 'city_streets' | 'bus_stop' | 'the_alley' | 'city_intersection';

interface EnvironmentArtVisualProps {
  type: EnvironmentType;
  className?: string;
  showOverlayTags?: boolean;
}

export const EnvironmentArtVisual: React.FC<EnvironmentArtVisualProps> = ({
  type,
  className = '',
  showOverlayTags = true
}) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-midnight select-none shadow-2xl ${className}`}>
      {/* 1. CITY STREETS (Moonlight Café, Pharmacy, Planters, Pedestrians) */}
      {type === 'city_streets' && (
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyCity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B0F2A" />
              <stop offset="60%" stopColor="#1B173E" />
              <stop offset="100%" stopColor="#301A4A" />
            </linearGradient>
            <radialGradient id="cafeGlow" cx="40%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#080B18" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pharmacyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#080B18" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wetRoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111528" />
              <stop offset="40%" stopColor="#1E2340" />
              <stop offset="100%" stopColor="#0A0D1D" />
            </linearGradient>
          </defs>

          {/* Sky & Distant Towers */}
          <rect width="800" height="450" fill="url(#skyCity)" />
          {/* Skyline Silhouettes */}
          <path d="M 0 240 L 40 220 L 70 220 L 90 160 L 150 160 L 160 230 L 250 230 L 270 120 L 330 120 L 350 220 L 480 220 L 510 140 L 580 140 L 600 230 L 700 230 L 730 180 L 800 180 L 800 450 L 0 450 Z" fill="#0D1026" />

          {/* Tower Windows */}
          <g fill="#A78BFA" opacity="0.6">
            <rect x="280" y="135" width="8" height="12" rx="1" />
            <rect x="295" y="135" width="8" height="12" rx="1" />
            <rect x="280" y="155" width="8" height="12" rx="1" />
            <rect x="295" y="155" width="8" height="12" rx="1" fill="#67E8F9" />
            <rect x="525" y="155" width="10" height="14" rx="1" fill="#FBBF24" />
            <rect x="545" y="155" width="10" height="14" rx="1" />
          </g>

          {/* Moonlight Café Storefront (Left) */}
          <g>
            {/* Café Building Body */}
            <rect x="40" y="160" width="300" height="180" fill="#1C1832" stroke="#473A66" strokeWidth="2" />
            {/* Warm Interior Glow */}
            <rect x="55" y="210" width="270" height="120" fill="url(#cafeGlow)" opacity="0.85" rx="6" />
            <rect x="60" y="215" width="260" height="110" fill="#78350F" opacity="0.3" stroke="#F59E0B" strokeWidth="1.5" rx="4" />
            {/* Café Sign */}
            <rect x="80" y="180" width="210" height="26" fill="#18132B" stroke="#F59E0B" strokeWidth="1" rx="4" />
            <text x="185" y="198" fill="#FDE68A" fontSize="13" fontFamily="Orbitron, sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              MOONLIGHT CAFÉ
            </text>
            {/* Café tables & patrons inside */}
            <circle cx="110" cy="275" r="9" fill="#FDE68A" opacity="0.7" />
            <circle cx="150" cy="275" r="9" fill="#FDE68A" opacity="0.6" />
            <circle cx="230" cy="275" r="9" fill="#FDE68A" opacity="0.7" />
            <circle cx="270" cy="275" r="9" fill="#FDE68A" opacity="0.8" />
          </g>

          {/* 24/7 Pharmacy Storefront (Right Center) */}
          <g>
            <rect x="360" y="180" width="220" height="160" fill="#152238" stroke="#10B981" strokeWidth="1.5" />
            <rect x="375" y="230" width="190" height="100" fill="url(#pharmacyGlow)" opacity="0.7" rx="4" />
            {/* Glowing Green Cross */}
            <rect x="380" y="193" width="24" height="24" fill="#064E3B" rx="3" />
            <path d="M 390 196 L 394 196 L 394 201 L 399 201 L 399 205 L 394 205 L 394 210 L 390 210 L 390 205 L 385 205 L 385 201 L 390 201 Z" fill="#10B981" />
            <text x="415" y="210" fill="#6EE7B7" fontSize="13" fontFamily="Orbitron, sans-serif" fontWeight="bold" letterSpacing="2">
              PHARMACY
            </text>
          </g>

          {/* Wet Road Surface & Curb */}
          <rect x="0" y="330" width="800" height="120" fill="url(#wetRoad)" />
          {/* Sidewalk border */}
          <line x1="0" y1="330" x2="800" y2="330" stroke="#4B5563" strokeWidth="4" />

          {/* Wet Asphalt Light Reflections */}
          <ellipse cx="200" cy="380" rx="90" ry="12" fill="#F59E0B" opacity="0.35" />
          <ellipse cx="460" cy="370" rx="70" ry="9" fill="#10B981" opacity="0.3" />
          <ellipse cx="650" cy="390" rx="80" ry="10" fill="#EF4444" opacity="0.4" />

          {/* Flower Planter Boxes with Magenta/Pink Flowers */}
          <g>
            <rect x="40" y="315" width="120" height="18" fill="#1F2937" rx="3" stroke="#4B5563" />
            <circle cx="55" cy="312" r="5" fill="#EC4899" />
            <circle cx="70" cy="310" r="6" fill="#A855F7" />
            <circle cx="85" cy="313" r="5" fill="#EC4899" />
            <circle cx="100" cy="311" r="6" fill="#F43F5E" />
            <circle cx="115" cy="312" r="5" fill="#EC4899" />
            <circle cx="130" cy="310" r="6" fill="#A855F7" />
            <circle cx="145" cy="313" r="5" fill="#EC4899" />
          </g>

          {/* Streetlamps with warm light */}
          <g>
            <line x1="345" y1="170" x2="345" y2="330" stroke="#6B7280" strokeWidth="4" />
            <circle cx="345" cy="170" r="16" fill="#FDE68A" opacity="0.85" />
            <circle cx="345" cy="170" r="35" fill="#F59E0B" opacity="0.25" />
          </g>

          {/* Moving Car Headlights (Right side) */}
          <g>
            <rect x="620" y="340" width="90" height="40" rx="8" fill="#1E293B" stroke="#475569" />
            <circle cx="635" cy="365" r="5" fill="#EF4444" />
            <circle cx="695" cy="365" r="5" fill="#EF4444" />
            <polygon points="710,355 790,345 800,410 710,380" fill="#FDE047" opacity="0.3" />
          </g>
        </svg>
      )}

      {/* 2. THE BUS STOP (Shelter, Line 22 Digital Sign, Waiting Commuters, Bus with Headlights) */}
      {type === 'bus_stop' && (
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyBus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#060919" />
              <stop offset="50%" stopColor="#141838" />
              <stop offset="100%" stopColor="#251E4E" />
            </linearGradient>
            <linearGradient id="busHeadlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#FDE047" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#080B18" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Night Sky & Towers */}
          <rect width="800" height="450" fill="url(#skyBus)" />
          <path d="M 0 250 L 50 230 L 100 230 L 140 160 L 220 160 L 240 250 L 400 250 L 430 180 L 520 180 L 540 260 L 660 260 L 700 150 L 780 150 L 800 200 L 800 450 L 0 450 Z" fill="#0A0E23" />

          {/* Road Surface */}
          <rect x="0" y="320" width="800" height="130" fill="#0F1326" />
          <line x1="0" y1="320" x2="800" y2="320" stroke="#374151" strokeWidth="3" />

          {/* Painted "BUS" Road Marking */}
          <text x="320" y="390" fill="#4B5563" fontSize="42" fontFamily="Orbitron, sans-serif" fontWeight="900" letterSpacing="12" opacity="0.6">
            BUS
          </text>

          {/* Bus Stop Shelter (Left Side) */}
          <g>
            {/* Shelter Curved Roof */}
            <path d="M 50 160 Q 200 135 320 155 L 310 170 Q 200 150 60 175 Z" fill="#3B82F6" opacity="0.9" />
            {/* Supporting Steel Pillars */}
            <line x1="80" y1="170" x2="80" y2="325" stroke="#94A3B8" strokeWidth="4" />
            <line x1="290" y1="165" x2="290" y2="325" stroke="#94A3B8" strokeWidth="4" />
            {/* Glass Back Panel */}
            <rect x="85" y="175" width="200" height="145" fill="#1E293B" opacity="0.6" rx="4" stroke="#67E8F9" strokeWidth="1" />
            {/* Shelter Interior Bench */}
            <rect x="100" y="270" width="170" height="12" fill="#334155" rx="3" />

            {/* Glowing City Transport Digital Schedule Board */}
            <rect x="105" y="180" width="130" height="60" fill="#090D1A" stroke="#F59E0B" strokeWidth="1.5" rx="4" />
            <text x="115" y="196" fill="#FBBF24" fontSize="10" fontFamily="Orbitron, sans-serif" fontWeight="bold">
              City Transport
            </text>
            <text x="115" y="210" fill="#67E8F9" fontSize="8" fontFamily="mono">
              22 Central Stn  2 min
            </text>
            <text x="115" y="222" fill="#E2E8F0" fontSize="8" fontFamily="mono">
              45 Lakeview     7 min
            </text>
            <text x="115" y="234" fill="#E2E8F0" fontSize="8" fontFamily="mono">
              78 University  12 min
            </text>

            {/* Waiting Commuter Silhouettes */}
            <circle cx="140" cy="255" r="8" fill="#CBD5E1" />
            <rect x="133" y="264" width="14" height="24" rx="3" fill="#1E293B" />
            <circle cx="210" cy="245" r="9" fill="#F8FAFC" />
            <rect x="202" y="255" width="16" height="36" rx="4" fill="#3B82F6" />
          </g>

          {/* Arriving City Transit Bus (Line 22) */}
          <g>
            {/* Bus Body */}
            <rect x="420" y="200" width="240" height="135" rx="12" fill="#1E1B4B" stroke="#4338CA" strokeWidth="2" />
            {/* Route Header Board */}
            <rect x="470" y="208" width="140" height="22" fill="#020617" stroke="#F59E0B" strokeWidth="1" rx="3" />
            <text x="540" y="223" fill="#FBBF24" fontSize="11" fontFamily="Orbitron, sans-serif" fontWeight="bold" textAnchor="middle">
              22 Central Station
            </text>
            {/* Windshield */}
            <rect x="445" y="235" width="190" height="55" fill="#38BDF8" opacity="0.4" rx="4" stroke="#67E8F9" strokeWidth="1" />
            {/* Driver Silhouette */}
            <circle cx="480" cy="260" r="10" fill="#CBD5E1" />

            {/* Powerful Headlights */}
            <circle cx="455" cy="305" r="9" fill="#FEF08A" />
            <circle cx="625" cy="305" r="9" fill="#FEF08A" />
            {/* Light Beams on Road */}
            <polygon points="455,305 320,430 420,440 465,310" fill="url(#busHeadlight)" opacity="0.6" />
            <polygon points="625,305 520,440 680,440 635,310" fill="url(#busHeadlight)" opacity="0.6" />
          </g>
        </svg>
      )}

      {/* 3. THE ALLEY (Brick Walls, Warm Lanterns, Wet Reflections, Dumpsters, AC Units) */}
      {type === 'the_alley' && (
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#080B18" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="alleyWet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F1424" />
              <stop offset="40%" stopColor="#192036" />
              <stop offset="100%" stopColor="#0A0D18" />
            </linearGradient>
          </defs>

          {/* Narrow Sky between high rises */}
          <rect width="800" height="450" fill="#080B18" />
          <polygon points="350,0 450,0 480,220 320,220" fill="#171A36" />

          {/* Left Brick Wall & Building Perspective */}
          <polygon points="0,0 350,180 350,450 0,450" fill="#2A1B18" stroke="#451A03" strokeWidth="1" />
          {/* Brick Line Details */}
          <g stroke="#3D241E" strokeWidth="1" opacity="0.7">
            <line x1="0" y1="80" x2="350" y2="200" />
            <line x1="0" y1="140" x2="350" y2="230" />
            <line x1="0" y1="200" x2="350" y2="260" />
            <line x1="0" y1="260" x2="350" y2="290" />
            <line x1="0" y1="320" x2="350" y2="330" />
          </g>

          {/* Right Brick Building */}
          <polygon points="800,0 450,180 450,450 800,450" fill="#241824" stroke="#3B1D3B" strokeWidth="1" />
          <g stroke="#381D33" strokeWidth="1" opacity="0.7">
            <line x1="800" y1="80" x2="450" y2="200" />
            <line x1="800" y1="140" x2="450" y2="230" />
            <line x1="800" y1="200" x2="450" y2="260" />
            <line x1="800" y1="260" x2="450" y2="290" />
          </g>

          {/* Air Conditioning Units with Vents */}
          <g>
            <rect x="140" y="110" width="60" height="45" fill="#374151" stroke="#6B7280" rx="3" />
            <circle cx="170" cy="132" r="14" fill="#1F2937" stroke="#9CA3AF" />
            <rect x="620" y="140" width="55" height="40" fill="#374151" stroke="#6B7280" rx="3" />
            <circle cx="647" cy="160" r="12" fill="#1F2937" stroke="#9CA3AF" />
          </g>

          {/* Wet Narrow Alley Floor */}
          <polygon points="320,220 480,220 540,450 260,450" fill="url(#alleyWet)" />

          {/* Amber Wall Lantern (Left Wall) */}
          <g>
            <circle cx="180" cy="180" r="60" fill="url(#lanternGlow)" />
            <rect x="172" y="170" width="16" height="24" fill="#F59E0B" rx="2" stroke="#78350F" />
            <path d="M 165 168 L 195 168 L 180 160 Z" fill="#27272A" />
          </g>

          {/* Amber Wall Lantern (Right Wall) */}
          <g>
            <circle cx="560" cy="200" r="50" fill="url(#lanternGlow)" />
            <rect x="553" y="192" width="14" height="20" fill="#F59E0B" rx="2" />
          </g>

          {/* Rain Puddles & Wet Ground Mirror Reflections */}
          <ellipse cx="380" cy="360" rx="70" ry="14" fill="#F59E0B" opacity="0.4" />
          <ellipse cx="430" cy="410" rx="90" ry="16" fill="#FBBF24" opacity="0.3" />

          {/* Dumpster & Trash Bags (Left foreground) */}
          <g>
            <polygon points="120,330 220,320 230,390 130,400" fill="#047857" stroke="#064E3B" strokeWidth="2" />
            {/* Dumpster Lid */}
            <polygon points="115,330 225,320 220,312 110,322" fill="#064E3B" />
            {/* Trash bags */}
            <circle cx="105" cy="385" r="16" fill="#18181B" />
            <circle cx="85" cy="390" r="14" fill="#27272A" />
          </g>
        </svg>
      )}

      {/* 4. THE CITY INTERSECTION (Crossroad, Zebra Crossings, Traffic Signals, Skylines) */}
      {type === 'city_intersection' && (
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyInter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B0E28" />
              <stop offset="60%" stopColor="#1B1745" />
              <stop offset="100%" stopColor="#2E1C4D" />
            </linearGradient>
          </defs>

          {/* Sky with Moon & Neon Clouds */}
          <rect width="800" height="450" fill="url(#skyInter)" />
          <circle cx="660" cy="80" r="18" fill="#F8FAFC" />
          <circle cx="660" cy="80" r="30" fill="#67E8F9" opacity="0.2" />

          {/* Illuminated Towers and High Rises */}
          <g fill="#0E1332">
            <rect x="60" y="100" width="70" height="220" />
            <rect x="150" y="140" width="85" height="180" />
            <rect x="255" y="80" width="90" height="240" />
            <rect x="560" y="110" width="75" height="210" />
            <rect x="655" y="70" width="100" height="250" />
          </g>

          {/* Neon Window Grids on Skyscrapers */}
          <g fill="#67E8F9" opacity="0.6">
            <rect x="75" y="120" width="8" height="6" />
            <rect x="95" y="120" width="8" height="6" fill="#A78BFA" />
            <rect x="75" y="140" width="8" height="6" />
            <rect x="270" y="100" width="10" height="8" fill="#FDE047" />
            <rect x="290" y="100" width="10" height="8" />
            <rect x="670" y="90" width="10" height="8" fill="#F43F5E" />
            <rect x="690" y="90" width="10" height="8" fill="#67E8F9" />
          </g>

          {/* Intersection Multi-Lane Asphalt */}
          <rect x="0" y="270" width="800" height="180" fill="#0C1022" />

          {/* Zebra Pedestrian Crossings */}
          <g fill="#F8FAFC" opacity="0.8">
            <rect x="140" y="320" width="40" height="10" rx="1" />
            <rect x="200" y="320" width="40" height="10" rx="1" />
            <rect x="260" y="320" width="40" height="10" rx="1" />
            <rect x="320" y="320" width="40" height="10" rx="1" />
            <rect x="380" y="320" width="40" height="10" rx="1" />
            <rect x="440" y="320" width="40" height="10" rx="1" />
            <rect x="500" y="320" width="40" height="10" rx="1" />
            <rect x="560" y="320" width="40" height="10" rx="1" />
          </g>

          {/* Traffic Signal Post with operating lights */}
          <g>
            <line x1="680" y1="180" x2="680" y2="330" stroke="#475569" strokeWidth="5" />
            <line x1="680" y1="190" x2="620" y2="190" stroke="#475569" strokeWidth="4" />
            <rect x="600" y="175" width="22" height="45" fill="#0F172A" rx="4" stroke="#64748B" />
            {/* Red Light */}
            <circle cx="611" cy="183" r="4.5" fill="#EF4444" className="animate-pulse" />
            {/* Amber Light */}
            <circle cx="611" cy="197" r="4.5" fill="#78350F" />
            {/* Green Light */}
            <circle cx="611" cy="211" r="4.5" fill="#065F46" />
          </g>

          {/* Moving Cars / Autorickshaw at Crossroad */}
          <g>
            {/* Sedan car */}
            <rect x="420" y="340" width="110" height="44" rx="8" fill="#1E293B" stroke="#4B7BFF" />
            <circle cx="445" cy="378" r="8" fill="#0F172A" />
            <circle cx="505" cy="378" r="8" fill="#0F172A" />
            {/* Headlights */}
            <circle cx="423" cy="355" r="4" fill="#FEF08A" />
            <polygon points="420,355 330,340 320,390 420,370" fill="#FEF08A" opacity="0.35" />

            {/* Auto-rickshaw (Right) */}
            <rect x="660" y="345" width="60" height="50" rx="6" fill="#15803D" stroke="#FACC15" strokeWidth="2" />
            <rect x="660" y="345" width="60" height="15" fill="#FACC15" />
            <circle cx="675" cy="392" r="7" fill="#020617" />
            <circle cx="705" cy="392" r="7" fill="#020617" />
          </g>
        </svg>
      )}

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/30 pointer-events-none" />

      {/* Optional Top Tag */}
      {showOverlayTags && (
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-midnight/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-softCyan uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-softCyan animate-ping" />
          <span>
            {type === 'city_streets'
              ? 'City Streets // Shopping Hub'
              : type === 'bus_stop'
              ? 'Transit Hub // Bus Stop'
              : type === 'the_alley'
              ? 'Urban Alley // Night Corridor'
              : 'Intersection // Urban Crossing'}
          </span>
        </div>
      )}
    </div>
  );
};
