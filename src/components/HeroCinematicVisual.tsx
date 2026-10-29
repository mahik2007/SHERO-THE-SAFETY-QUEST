import React from 'react';

interface HeroCinematicVisualProps {
  heroName?: string;
}

export const HeroCinematicVisual: React.FC<HeroCinematicVisualProps> = ({ heroName = 'Gyanvi' }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* 1. Architectural Daylight & Morning Sky Canvas Layer */}
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Architectural Daylight & Sky Gradients */}
          <linearGradient id="skyAtmosphere" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBE5F7" />
            <stop offset="35%" stopColor="#E4F0FB" />
            <stop offset="70%" stopColor="#F7F6F2" />
            <stop offset="100%" stopColor="#EDEAE1" />
          </linearGradient>

          <radialGradient id="sunlightAura" cx="65%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FEF3C7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F5F3ED" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="moonlightCafeAura" cx="35%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#EDEAE1" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lampGlowWarm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.7" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="busHeadlightBeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="carHeadlightBeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#BAE6FD" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
          </linearGradient>

          {/* Clean architectural natural stone pavement */}
          <linearGradient id="naturalPavement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="40%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Ambient Sky */}
        <rect width="1600" height="900" fill="url(#skyAtmosphere)" />
        <rect width="1600" height="900" fill="url(#sunlightAura)" opacity="0.6" />

        {/* Distant Cyber Skyline & Skyscrapers */}
        <g opacity="0.85">
          <path
            d="M 0 480 L 100 450 L 160 450 L 200 320 L 320 320 L 350 470 L 520 470 L 560 220 L 680 220 L 720 460 L 900 460 L 950 280 L 1080 280 L 1120 470 L 1300 470 L 1350 180 L 1480 180 L 1520 450 L 1600 450 L 1600 900 L 0 900 Z"
            fill="#090D22"
          />
          {/* Distant glowing windows */}
          <g fill="#A78BFA" opacity="0.5">
            <rect x="580" y="240" width="16" height="24" rx="2" />
            <rect x="610" y="240" width="16" height="24" rx="2" fill="#67E8F9" />
            <rect x="580" y="280" width="16" height="24" rx="2" />
            <rect x="980" y="300" width="18" height="26" rx="2" fill="#FDE047" />
            <rect x="1010" y="300" width="18" height="26" rx="2" />
            <rect x="1380" y="200" width="20" height="30" rx="2" fill="#67E8F9" />
            <rect x="1420" y="200" width="20" height="30" rx="2" />
          </g>
        </g>

        {/* Midground Left: Moonlight Café Storefront */}
        <g>
          {/* Café Exterior Wall */}
          <rect x="0" y="320" width="460" height="320" fill="#18152D" stroke="#3A2D58" strokeWidth="2" />
          {/* Warm Interior Glow */}
          <rect x="40" y="400" width="380" height="220" fill="url(#moonlightCafeAura)" opacity="0.95" rx="8" />
          <rect x="50" y="410" width="360" height="200" fill="#78350F" opacity="0.25" stroke="#F59E0B" strokeWidth="2" rx="6" />

          {/* Café Signboard with warm glowing text */}
          <rect x="70" y="350" width="320" height="42" fill="#130F24" stroke="#F59E0B" strokeWidth="1.5" rx="6" />
          <text
            x="230"
            y="378"
            fill="#FEF08A"
            fontSize="20"
            fontFamily="Orbitron, sans-serif"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="3"
          >
            MOONLIGHT CAFÉ
          </text>

          {/* Indoor Customers and Warm Hanging Lamps */}
          <circle cx="120" cy="510" r="16" fill="#FDE68A" opacity="0.75" />
          <circle cx="180" cy="510" r="16" fill="#FDE68A" opacity="0.65" />
          <circle cx="280" cy="510" r="18" fill="#FDE68A" opacity="0.8" />
          <circle cx="340" cy="510" r="17" fill="#FDE68A" opacity="0.7" />
          {/* Hanging pendant lamps inside */}
          <line x1="140" y1="410" x2="140" y2="445" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="140" cy="450" r="8" fill="#FEF08A" />
          <line x1="300" y1="410" x2="300" y2="445" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="300" cy="450" r="8" fill="#FEF08A" />
        </g>

        {/* Clean Paved Street Pavement */}
        <rect x="0" y="620" width="1600" height="280" fill="url(#naturalPavement)" />
        <line x1="0" y1="620" x2="1600" y2="620" stroke="#94A3B8" strokeWidth="3" />

        {/* Warm Street Lamp in Center/Left */}
        <g>
          <line x1="480" y1="360" x2="480" y2="620" stroke="#64748B" strokeWidth="6" />
          <circle cx="480" cy="360" r="90" fill="url(#lampGlowWarm)" />
          <circle cx="480" cy="360" r="16" fill="#FEF08A" />
        </g>

        {/* Natural Stone Architectural Ground Highlights */}
        <ellipse cx="230" cy="720" rx="180" ry="24" fill="#F59E0B" opacity="0.18" />
        <ellipse cx="500" cy="690" rx="140" ry="18" fill="#FBBF24" opacity="0.18" />
        <ellipse cx="1100" cy="730" rx="220" ry="26" fill="#BAE6FD" opacity="0.22" />
        <ellipse cx="1320" cy="740" rx="160" ry="20" fill="#CBD5E1" opacity="0.2" />

        {/* Flower Planter Boxes (Magenta & Lavender Blossoms) */}
        <g>
          <rect x="50" y="595" width="220" height="28" fill="#1E293B" rx="4" stroke="#475569" />
          {[70, 95, 120, 145, 170, 195, 220, 245].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={590 + (i % 2) * 4}
              r={9}
              fill={i % 3 === 0 ? '#EC4899' : i % 3 === 1 ? '#A855F7' : '#F43F5E'}
              opacity="0.9"
            />
          ))}
        </g>

        {/* Right Side: City Transit Line 22 Bus Arriving */}
        <g transform="translate(1050, 430)">
          {/* Bus Body */}
          <rect x="0" y="0" width="340" height="190" rx="16" fill="#1E1B4B" stroke="#4338CA" strokeWidth="3" />
          {/* Route Board */}
          <rect x="60" y="12" width="220" height="32" fill="#020617" stroke="#F59E0B" strokeWidth="1.5" rx="4" />
          <text x="170" y="34" fill="#FBBF24" fontSize="15" fontFamily="Orbitron, sans-serif" fontWeight="bold" textAnchor="middle">
            22 Central Station
          </text>
          {/* Windshield */}
          <rect x="25" y="52" width="285" height="75" fill="#38BDF8" opacity="0.45" rx="6" stroke="#67E8F9" strokeWidth="1.5" />
          <circle cx="85" cy="85" r="14" fill="#E2E8F0" opacity="0.8" />

          {/* Headlights */}
          <circle cx="45" cy="155" r="14" fill="#FFFFFF" />
          <circle cx="285" cy="155" r="14" fill="#FFFFFF" />
        </g>

        {/* Bus Headlight Beams illuminating the wet avenue */}
        <polygon points="1095,585 750,780 920,800 1120,590" fill="url(#busHeadlightBeam)" opacity="0.75" />
        <polygon points="1335,585 1100,800 1350,820 1355,590" fill="url(#busHeadlightBeam)" opacity="0.75" />

        {/* Moving Sedan Car (Midground right) */}
        <g transform="translate(900, 520)">
          <rect x="0" y="0" width="130" height="55" rx="10" fill="#1E293B" stroke="#38BDF8" />
          <circle cx="25" cy="48" r="10" fill="#020617" />
          <circle cx="105" cy="48" r="10" fill="#020617" />
          <circle cx="10" cy="24" r="6" fill="#FEF08A" />
          <polygon points="10,24 -120,60 -100,120 15,35" fill="url(#carHeadlightBeam)" opacity="0.6" />
        </g>

        {/* Ambient Mist & Rain Particle Streams */}
        <g opacity="0.35">
          <line x1="200" y1="200" x2="160" y2="280" stroke="#67E8F9" strokeWidth="1" />
          <line x1="450" y1="180" x2="410" y2="260" stroke="#FBBF24" strokeWidth="1" />
          <line x1="800" y1="220" x2="760" y2="300" stroke="#A78BFA" strokeWidth="1" />
          <line x1="1200" y1="190" x2="1160" y2="270" stroke="#67E8F9" strokeWidth="1" />
          <line x1="1450" y1="240" x2="1410" y2="320" stroke="#FDE68A" strokeWidth="1" />
        </g>

        {/* 2. PROTAGONIST HEROINE: High-fidelity Anime Illustration (Dedicated Sidewalk Promenade) */}
        {/* Rendered as in reference image: Dark hair with violet sheen, stylish jacket, backpack, looking over her shoulder */}
        <g transform="translate(500, 245) scale(0.92)">
          {/* Subtle Ground Shadow */}
          <ellipse cx="220" cy="580" rx="120" ry="24" fill="#000000" opacity="0.35" />

          {/* Backpack Layer (Behind torso, on back) */}
          <path
            d="M 120 280 C 100 280 85 330 90 440 C 95 490 140 500 170 490 L 160 300 Z"
            fill="#1E1B4B"
            stroke="#4338CA"
            strokeWidth="3"
          />
          {/* Backpack Straps & Neon Cyan Buckles */}
          <path d="M 160 300 C 170 340 180 380 175 420" stroke="#67E8F9" strokeWidth="4" fill="none" />
          <rect x="170" y="360" width="10" height="14" rx="2" fill="#67E8F9" />

          {/* Torso & Stylish Casual Jacket (Dark midnight fabric with violet/amber highlights) */}
          {/* Back & Shoulder Turn */}
          <path
            d="M 150 250 C 180 230 250 235 290 270 C 310 320 305 450 280 500 C 230 520 170 510 140 480 Z"
            fill="#18132B"
            stroke="#6366F1"
            strokeWidth="2.5"
          />
          {/* Warm Amber Rim Light on Jacket from Café Light */}
          <path
            d="M 150 250 C 160 300 155 420 140 480"
            stroke="#F59E0B"
            strokeWidth="4"
            fill="none"
            opacity="0.8"
          />

          {/* Jacket Collar & Neck */}
          <path d="M 210 210 L 245 210 L 250 250 L 205 250 Z" fill="#FED7AA" />
          <path d="M 190 230 C 220 220 270 225 285 255 L 260 265 L 180 250 Z" fill="#2E234D" stroke="#A78BFA" strokeWidth="2" />

          {/* Anime Head & Expressive Face (Looking back over right shoulder — Cute Youthful Anime CG Face) */}
          {/* Face Contour with soft cheeks and gentle jawline */}
          <path
            d="M 214 155 C 212 195 228 228 255 233 C 278 231 296 205 296 155 C 296 120 275 108 255 108 C 235 108 214 120 214 155 Z"
            fill="#FFF1E8"
            stroke="#F0BAA8"
            strokeWidth="1.2"
          />
          {/* Gentle shading on jaw and neck */}
          <path d="M 226 215 Q 255 235 284 215 Q 255 228 226 215 Z" fill="#E8A994" opacity="0.6" />

          {/* Warm café light reflection on cheek */}
          <ellipse cx="230" cy="180" rx="12" ry="16" fill="#FBBF24" opacity="0.18" />

          {/* Soft Youthful Anime Rosy Blush */}
          <ellipse cx="232" cy="182" rx="10" ry="6" fill="#FB7185" opacity="0.45" />
          <ellipse cx="276" cy="183" rx="10" ry="6" fill="#FB7185" opacity="0.45" />
          {/* Cute micro blush marks */}
          <g stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
            <line x1="228" y1="183" x2="231" y2="180" />
            <line x1="233" y1="183" x2="236" y2="180" />
            <line x1="272" y1="184" x2="275" y2="181" />
            <line x1="277" y1="184" x2="280" y2="181" />
          </g>

          {/* Large Expressive Anime Eyes (Rich CG Dual-Color Irises with Star & Specular Highlights) */}
          <g>
            {/* Left Eye */}
            <path d="M 231 151 Q 239 146 248 151" stroke="#A76050" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
            <ellipse cx="240" cy="166" rx="9" ry="12.5" fill="#FFFFFF" />
            <ellipse cx="240" cy="166.5" rx="7.2" ry="10.8" fill="#4C1D95" />
            <ellipse cx="240" cy="167" rx="5.5" ry="8" fill="#8B5CF6" />
            <ellipse cx="240.5" cy="168" rx="3.5" ry="5" fill="#C4B5FD" opacity="0.9" />
            <ellipse cx="240" cy="166.5" rx="3.2" ry="4.8" fill="#0A0915" />
            {/* Specular Catchlights */}
            <ellipse cx="237" cy="161.5" rx="3.2" ry="3.8" fill="#FFFFFF" transform="rotate(-15 237 161.5)" />
            <circle cx="243.5" cy="170" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="238" cy="171.5" r="1" fill="#67E8F9" opacity="0.8" />
            {/* Eyelash line with delicate flick */}
            <path d="M 229 162 Q 239 152 250 160" stroke="#0F172A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M 229 161 Q 225 159 227 155" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 234 176 Q 240 178 246 176" stroke="#1E293B" strokeWidth="1.2" fill="none" opacity="0.65" />

            {/* Right Eye */}
            <path d="M 264 152 Q 272 147 281 152" stroke="#A76050" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
            <ellipse cx="272" cy="166" rx="9" ry="12.5" fill="#FFFFFF" />
            <ellipse cx="272" cy="166.5" rx="7.2" ry="10.8" fill="#4C1D95" />
            <ellipse cx="272" cy="167" rx="5.5" ry="8" fill="#8B5CF6" />
            <ellipse cx="272.5" cy="168" rx="3.5" ry="5" fill="#C4B5FD" opacity="0.9" />
            <ellipse cx="272" cy="166.5" rx="3.2" ry="4.8" fill="#0A0915" />
            {/* Specular Catchlights */}
            <ellipse cx="269" cy="161.5" rx="3.2" ry="3.8" fill="#FFFFFF" transform="rotate(-15 269 161.5)" />
            <circle cx="275.5" cy="170" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="270" cy="171.5" r="1" fill="#67E8F9" opacity="0.8" />
            {/* Eyelash line with delicate flick */}
            <path d="M 262 160 Q 273 152 284 162" stroke="#0F172A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M 284 161 Q 288 159 286 155" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 266 176 Q 272 178 278 176" stroke="#1E293B" strokeWidth="1.2" fill="none" opacity="0.65" />

            {/* Soft, expressive anime eyebrows */}
            <path d="M 231 145 Q 241 140 251 146" stroke="#2E1065" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M 263 146 Q 273 140 283 145" stroke="#2E1065" strokeWidth="2.4" fill="none" strokeLinecap="round" />

            {/* Small delicate button nose */}
            <circle cx="256" cy="182" r="1.2" fill="#EA580C" opacity="0.5" />
            <path d="M 255 181 Q 256.5 182.5 256 183.5" stroke="#F97316" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Gentle, confident anime smile */}
            <path d="M 251 196 Q 257 200.5 264 196" stroke="#BE123C" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="257.5" cy="198.5" rx="2" ry="0.8" fill="#FDA4AF" opacity="0.8" />
          </g>


          {/* Hair: Voluminous Anime Hair with Violet Sheen & Highlights */}
          {/* Hair Back */}
          <path
            d="M 195 140 C 170 200 160 300 180 380 C 200 420 220 380 230 330 C 250 350 280 410 320 380 C 350 320 330 200 300 130 Z"
            fill="#1E1638"
          />
          {/* Violet Highlights Stream */}
          <path
            d="M 180 180 C 165 240 170 320 185 360 C 190 320 195 260 205 200 Z"
            fill="#8B5CF6"
            opacity="0.75"
          />
          {/* Front Bangs & Side Strands framing the face */}
          <path
            d="M 215 125 C 220 160 230 175 235 155 C 240 180 250 185 255 160 C 265 185 285 170 295 120 C 285 95 210 95 215 125 Z"
            fill="#2D1E50"
          />
          {/* Soft Hair Lighting from Café */}
          <path d="M 210 115 Q 230 100 260 105" stroke="#FDE047" strokeWidth="2.5" fill="none" opacity="0.6" />
          <path d="M 265 106 Q 290 115 300 135" stroke="#A78BFA" strokeWidth="2.5" fill="none" opacity="0.8" />
        </g>
      </svg>

      {/* 3. Cinematic Film Vignette & Lighting Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight/70 via-transparent to-midnight/60 pointer-events-none" />
    </div>
  );
};
