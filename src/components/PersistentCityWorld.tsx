import React from 'react';

/**
 * PersistentCityWorld — The always-present animated anime city background.
 * This renders behind every screen overlay so the world never disappears.
 * Uses layered SVG + CSS animations to create depth, parallax feeling,
 * and environmental life (fog, lights, reflections, subtle movement).
 */
export const PersistentCityWorld: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* ─────────────────────────────────────────────────────────────
          LAYER 0 — Deep Sky & Moon
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            'linear-gradient(180deg, #04061A 0%, #0B0E2A 30%, #131840 60%, #1C1435 80%, #100E28 100%)'
        }}
      />

      {/* Moon */}
      <div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          top: '7%',
          right: '22%',
          background: 'radial-gradient(circle at 35% 35%, #E8F4FF 0%, #B8D0EF 40%, #7496C9 80%, transparent 100%)',
          boxShadow: '0 0 60px 30px rgba(130, 170, 230, 0.3)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />

      {/* Stars */}
      {[
        [120, 8], [280, 5], [450, 10], [630, 6], [780, 3], [920, 9],
        [60, 15], [380, 12], [540, 7], [700, 14], [850, 11],
        [160, 20], [330, 18], [590, 22], [760, 16], [980, 19]
      ].map(([x, y], i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${x / 10}%`,
            top: `${y}%`,
            width: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
            height: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
            background: i % 4 === 0 ? '#67E8F9' : i % 4 === 1 ? '#A78BFA' : i % 4 === 2 ? '#FDE68A' : '#F8FAFC',
            opacity: 0.6 + (i % 4) * 0.1,
            animation: `pulse ${3 + (i % 5)}s ease-in-out infinite ${i * 0.3}s`
          }}
        />
      ))}

      {/* ─────────────────────────────────────────────────────────────
          LAYER 1 — Distant Skyline (furthest back, darkest)
      ───────────────────────────────────────────────────────────── */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1600 400"
        preserveAspectRatio="xMidYMax slice"
        style={{ height: '65%', opacity: 0.7 }}
      >
        {/* Distant dark skyscraper silhouettes */}
        <path
          d="M0 400 L0 260 L40 260 L40 200 L80 200 L80 260 L120 260 L120 180 L160 180 L160 260 L200 260
             L200 220 L240 220 L240 160 L300 160 L300 240 L360 240 L360 200 L400 200 L400 260
             L440 260 L440 140 L500 140 L500 240 L560 240 L560 200 L620 200 L620 260
             L680 260 L680 180 L720 180 L720 260 L780 260 L780 120 L840 120 L840 260
             L900 260 L900 200 L960 200 L960 260 L1020 260 L1020 160 L1080 160 L1080 260
             L1140 260 L1140 180 L1200 180 L1200 260 L1260 260 L1260 140 L1320 140 L1320 260
             L1380 260 L1380 200 L1440 200 L1440 260 L1500 260 L1500 160 L1560 160 L1560 260
             L1600 260 L1600 400 Z"
          fill="#090D22"
        />
        {/* Glowing windows in distant buildings */}
        {[
          [250, 165, '#A78BFA'], [265, 165, '#67E8F9'],
          [450, 145, '#FDE68A'], [465, 145, '#A78BFA'],
          [790, 125, '#67E8F9'], [805, 125, '#FDE68A'], [820, 125, '#A78BFA'],
          [1090, 165, '#A78BFA'], [1105, 165, '#67E8F9'],
          [1270, 145, '#FDE68A'], [1285, 145, '#A78BFA'],
          [1510, 165, '#67E8F9'], [1525, 165, '#FDE68A']
        ].map(([x, y, color], i) => (
          <rect key={i} x={x} y={y} width={12} height={18} rx={2} fill={color as string} opacity={0.5 + (i % 3) * 0.15} />
        ))}
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 2 — Mid Buildings with lit windows & neon signs
      ───────────────────────────────────────────────────────────── */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1600 500"
        preserveAspectRatio="xMidYMax slice"
        style={{ height: '70%', opacity: 0.85 }}
      >
        <defs>
          <linearGradient id="bldg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12173A" />
            <stop offset="100%" stopColor="#0C1028" />
          </linearGradient>
          <radialGradient id="neonGlow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Left apartment block */}
        <rect x="0" y="150" width="120" height="350" fill="url(#bldg1)" />
        <rect x="15" y="170" width="20" height="28" rx="2" fill="#F59E0B" opacity="0.7" />
        <rect x="45" y="170" width="20" height="28" rx="2" fill="#67E8F9" opacity="0.5" />
        <rect x="75" y="170" width="20" height="28" rx="2" fill="#A78BFA" opacity="0.6" />
        <rect x="15" y="215" width="20" height="28" rx="2" fill="#67E8F9" opacity="0.4" />
        <rect x="45" y="215" width="20" height="28" rx="2" fill="#F59E0B" opacity="0.6" />
        <rect x="75" y="215" width="20" height="28" rx="2" fill="#67E8F9" opacity="0.7" />
        <rect x="15" y="260" width="20" height="28" rx="2" fill="#A78BFA" opacity="0.5" />
        <rect x="75" y="260" width="20" height="28" rx="2" fill="#F59E0B" opacity="0.4" />

        {/* Moonlight Cafe building - left-center */}
        <rect x="100" y="200" width="260" height="300" fill="#161230" stroke="#2A2060" strokeWidth="1.5" />
        <rect x="120" y="300" width="220" height="160" fill="#F59E0B" opacity="0.12" />
        <rect x="130" y="230" width="220" height="36" fill="#100E20" stroke="#F59E0B" strokeWidth="1.5" rx="4" />
        <text x="240" y="254" fill="#FEF08A" fontSize="14" fontFamily="Orbitron,sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="2">MOONLIGHT CAFÉ</text>
        <rect x="140" y="280" width="80" height="100" rx="4" fill="#1C1830" stroke="#3A3060" strokeWidth="1" />
        <rect x="240" y="280" width="80" height="100" rx="4" fill="#1C1830" stroke="#3A3060" strokeWidth="1" />
        <circle cx="180" cy="330" r="30" fill="url(#amberGlow)" opacity="0.8" />
        <circle cx="280" cy="320" r="28" fill="url(#amberGlow)" opacity="0.7" />

        {/* Pharmacy / shop building */}
        <rect x="340" y="220" width="180" height="280" fill="#0F1225" stroke="#1E3060" strokeWidth="1" />
        <rect x="355" y="235" width="150" height="35" fill="#081535" stroke="#4B7BFF" strokeWidth="1.5" rx="3" />
        <text x="430" y="258" fill="#67E8F9" fontSize="12" fontFamily="Orbitron,sans-serif" fontWeight="bold" textAnchor="middle">✚ PHARMACY</text>
        <rect x="360" y="285" width="50" height="70" rx="3" fill="#0D1A35" />
        <rect x="430" y="285" width="50" height="70" rx="3" fill="#0D1A35" />
        <rect x="360" y="285" width="50" height="70" rx="3" fill="#67E8F9" opacity="0.08" />
        <rect x="430" y="285" width="50" height="70" rx="3" fill="#4B7BFF" opacity="0.06" />

        {/* Center-right tall office tower */}
        <rect x="680" y="100" width="150" height="400" fill="url(#bldg1)" />
        {[0, 1, 2, 3, 4, 5, 6].map(row => (
          [0, 1, 2, 3].map(col => (
            <rect
              key={`${row}-${col}`}
              x={698 + col * 35}
              y={120 + row * 50}
              width={24}
              height={32}
              rx={2}
              fill={row % 2 === 0 ? (col % 2 === 0 ? '#A78BFA' : '#67E8F9') : (col % 2 === 0 ? '#FDE68A' : '#A78BFA')}
              opacity={0.3 + (row + col) % 4 * 0.1}
            />
          ))
        ))}

        {/* Right-side apartment complex */}
        <rect x="1100" y="180" width="200" height="320" fill="#0F1228" stroke="#1E1E40" strokeWidth="1" />
        <rect x="1300" y="160" width="140" height="340" fill="#0D1022" stroke="#1A1A38" strokeWidth="1" />
        <rect x="1440" y="200" width="160" height="300" fill="#11142B" stroke="#202050" strokeWidth="1" />
        {[1120, 1155, 1190, 1225, 1260].map((x, i) =>
          [200, 250, 300, 340].map((y, j) => (
            <rect key={`r${i}-${j}`} x={x} y={y} width={22} height={30} rx={2}
              fill={j % 2 === 0 ? '#F59E0B' : '#A78BFA'}
              opacity={0.4 + (i * j) % 4 * 0.1} />
          ))
        )}

        {/* Neon signs on buildings */}
        <rect x="870" y="240" width="100" height="22" rx="4" fill="#0D0E20" stroke="#FF5470" strokeWidth="1.5" />
        <text x="920" y="256" fill="#FF5470" fontSize="10" fontFamily="Orbitron,sans-serif" fontWeight="bold" textAnchor="middle">24H BISTRO</text>
        <circle cx="920" cy="249" r="45" fill="url(#neonGlow1)" opacity="0.15" />

        <rect x="1020" y="200" width="60" height="20" rx="3" fill="#0A0B1E" stroke="#65F5C5" strokeWidth="1" />
        <text x="1050" y="215" fill="#65F5C5" fontSize="9" fontFamily="Orbitron,sans-serif" fontWeight="bold" textAnchor="middle">CITY BUS</text>
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 3 — Street, Pavement, Road
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '32%',
          background: 'linear-gradient(180deg, #0A0D20 0%, #0E1228 40%, #080B18 100%)'
        }}
      />
      {/* Sidewalk divider line */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '29%',
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #4B7BFF 20%, #A78BFA 50%, #4B7BFF 80%, transparent 100%)',
          opacity: 0.5
        }}
      />
      {/* Road dashed lines */}
      <div className="absolute left-0 right-0 flex justify-center gap-16" style={{ bottom: '15%' }}>
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <div key={i} style={{ width: 60, height: 4, background: '#F8FAFC', opacity: 0.15, borderRadius: 2 }} />
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 4 — Streetlights with glowing halos
      ───────────────────────────────────────────────────────────── */}
      {[
        { left: '8%', color: '#FEF08A', intensity: 0.7 },
        { left: '25%', color: '#FDE68A', intensity: 0.6 },
        { left: '45%', color: '#FEF08A', intensity: 0.75 },
        { left: '67%', color: '#FDE68A', intensity: 0.65 },
        { left: '85%', color: '#FEF08A', intensity: 0.7 },
      ].map((lamp, i) => (
        <div key={i} className="absolute" style={{ left: lamp.left, bottom: '30%' }}>
          {/* Pole */}
          <div style={{
            width: 4, height: 120, background: '#334155',
            marginLeft: 14, borderRadius: 2
          }} />
          {/* Lamp head */}
          <div style={{
            width: 32, height: 14, background: '#475569',
            borderRadius: 6, marginTop: -2, position: 'relative', zIndex: 1
          }} />
          {/* Glow halo */}
          <div style={{
            position: 'absolute',
            top: -60, left: -50,
            width: 132, height: 132,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${lamp.color}${Math.round(lamp.intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} />
        </div>
      ))}

      {/* ─────────────────────────────────────────────────────────────
          LAYER 5 — Wet road reflections
      ───────────────────────────────────────────────────────────── */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1600 200" preserveAspectRatio="xMidYMax slice" style={{ height: '28%', opacity: 0.6 }}>
        <ellipse cx="200" cy="130" rx="220" ry="30" fill="#F59E0B" opacity="0.2" />
        <ellipse cx="560" cy="150" rx="180" ry="25" fill="#A78BFA" opacity="0.15" />
        <ellipse cx="900" cy="140" rx="250" ry="35" fill="#67E8F9" opacity="0.12" />
        <ellipse cx="1280" cy="145" rx="200" ry="28" fill="#F59E0B" opacity="0.18" />
        <ellipse cx="1550" cy="135" rx="160" ry="22" fill="#A78BFA" opacity="0.14" />
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 6 — Foreground vegetation / planters
      ───────────────────────────────────────────────────────────── */}
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1600 180" preserveAspectRatio="xMidYMax slice" style={{ height: '26%' }}>
        {/* Flower planters */}
        <rect x="60" y="140" width="180" height="22" rx="4" fill="#1E293B" />
        {[80, 105, 130, 155, 180, 205, 230].map((x, i) => (
          <circle key={i} cx={x} cy={136} r={10}
            fill={i % 3 === 0 ? '#EC4899' : i % 3 === 1 ? '#A855F7' : '#F43F5E'} opacity={0.9} />
        ))}

        <rect x="1360" y="145" width="200" height="22" rx="4" fill="#1E293B" />
        {[1380, 1405, 1430, 1455, 1480, 1505, 1530].map((x, i) => (
          <circle key={i} cx={x} cy={141} r={9}
            fill={i % 3 === 0 ? '#EC4899' : i % 3 === 1 ? '#A855F7' : '#F43F5E'} opacity={0.85} />
        ))}

        {/* Tree silhouettes */}
        <ellipse cx="440" cy="110" rx="55" ry="70" fill="#0D2010" opacity="0.85" />
        <rect x="435" y="145" width="10" height="35" fill="#1A3010" />
        <ellipse cx="1160" cy="100" rx="60" ry="75" fill="#0D2010" opacity="0.9" />
        <rect x="1155" y="145" width="10" height="35" fill="#1A3010" />
        <ellipse cx="760" cy="115" rx="50" ry="65" fill="#0D2010" opacity="0.8" />
        <rect x="755" y="148" width="10" height="32" fill="#1A3010" />
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 7 — Animated Traffic Lights & Moving Elements
      ───────────────────────────────────────────────────────────── */}
      {/* Bus stop shelter */}
      <div
        className="absolute"
        style={{
          right: '28%',
          bottom: '30%',
          width: 140,
          height: 80,
          borderTop: '4px solid #4B7BFF',
          borderLeft: '3px solid #67E8F9',
          borderRight: '3px solid #67E8F9',
          background: 'rgba(75, 123, 255, 0.05)',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <div style={{
          position: 'absolute', top: 10, left: 8,
          background: '#0A0B1E', border: '1px solid #65F5C5',
          borderRadius: 3, padding: '3px 6px',
          fontSize: 9, fontFamily: 'Orbitron,sans-serif',
          color: '#65F5C5', fontWeight: 'bold', letterSpacing: 1
        }}>
          CITY TRANSPORT
        </div>
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          fontSize: 8, fontFamily: 'monospace', color: '#B9B7D6', lineHeight: 1.4
        }}>
          <div style={{ color: '#FDE68A' }}>22 Central  2 min</div>
          <div>45 Lakeview 8 min</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 8 — Atmospheric Fog / Vignette overlays
      ───────────────────────────────────────────────────────────── */}
      {/* Bottom fog / ground haze */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '15%',
          background: 'linear-gradient(0deg, rgba(8,11,24,0.9) 0%, transparent 100%)'
        }}
      />
      {/* Left edge vignette */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: '15%',
          background: 'linear-gradient(90deg, rgba(8,11,24,0.7) 0%, transparent 100%)'
        }}
      />
      {/* Right edge vignette */}
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{
          width: '15%',
          background: 'linear-gradient(270deg, rgba(8,11,24,0.7) 0%, transparent 100%)'
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '12%',
          background: 'linear-gradient(180deg, rgba(4,6,26,0.8) 0%, transparent 100%)'
        }}
      />

      {/* Subtle animated particles / mist */}
      <div className="absolute inset-0" style={{ opacity: 0.3 }}>
        {[
          { left: '15%', animDur: '12s', delay: '0s', size: 3 },
          { left: '35%', animDur: '18s', delay: '3s', size: 2 },
          { left: '55%', animDur: '15s', delay: '6s', size: 4 },
          { left: '72%', animDur: '20s', delay: '1s', size: 2 },
          { left: '88%', animDur: '14s', delay: '4s', size: 3 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: '30%',
              width: p.size,
              height: p.size,
              background: i % 2 === 0 ? '#A78BFA' : '#67E8F9',
              animation: `floatParticle ${p.animDur} ease-in-out infinite ${p.delay}`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatParticle {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          10%  { opacity: 0.7; }
          50%  { transform: translateY(-120px) translateX(20px); opacity: 0.4; }
          90%  { opacity: 0.1; }
          100% { transform: translateY(-240px) translateX(-10px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
