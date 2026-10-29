import React from 'react';

export type StrangerType = 'cap_hoodie' | 'bearded' | 'sunglasses';

export interface StrangerPortraitProps {
  type?: StrangerType;
  speakerName?: string;
  size?: number;
  isTalking?: boolean;
  className?: string;
}

/**
 * Animated Graphic-Novel Style Stranger & NPC Portrait Component
 * Designed directly matching the provided style reference:
 * - Stranger 1 ('cap_hoodie'): Youthful stranger with baseball cap worn backwards/forwards, dark hooded jacket, suspicious sideways glance, sly smirk
 * - Stranger 2 ('bearded'): Mature bearded stranger, disheveled dark hair, olive utility jacket, persistent intense stare
 * - Stranger 3 ('sunglasses'): Stranger with dark retro sunglasses, tailored dark jacket, stern subtle frown
 *
 * Includes SVG idle breathing, natural eye blinking, subtle speaking mouth movement,
 * and high-fidelity anime/comic cel-shading.
 */
export const StrangerPortrait: React.FC<StrangerPortraitProps> = ({
  type = 'cap_hoodie',
  speakerName = 'Stranger',
  size = 220,
  isTalking = false,
  className = ''
}) => {
  // Infer type based on speaker name if not explicitly set
  let resolvedType: StrangerType = type;
  const lowerName = speakerName.toLowerCase();
  if (lowerName.includes('driver') || lowerName.includes('clerk') || lowerName.includes('staff')) {
    resolvedType = 'bearded';
  } else if (lowerName.includes('shadow') || lowerName.includes('sunglass') || lowerName.includes('man in')) {
    resolvedType = 'sunglasses';
  }

  const idSuffix = `${resolvedType}-${Math.floor(size)}`;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shading gradients */}
          <linearGradient id={`strangerSkin-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5D0B5" />
            <stop offset="60%" stopColor="#E2AC8A" />
            <stop offset="100%" stopColor="#C48464" />
          </linearGradient>

          <linearGradient id={`strangerShadow-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B37252" />
            <stop offset="100%" stopColor="#8C4E32" />
          </linearGradient>

          <linearGradient id={`jacketDark-${idSuffix}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2A303C" />
            <stop offset="50%" stopColor="#1E232A" />
            <stop offset="100%" stopColor="#13171C" />
          </linearGradient>

          <linearGradient id={`capGrad-${idSuffix}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          <linearGradient id={`ambientRim-${idSuffix}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
          </linearGradient>

          {/* SVG Keyframe animations for subtle breathing, blinking & talking */}
          <style>{`
            @keyframes strangerBreathe {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-2px); }
            }
            @keyframes strangerBlink {
              0%, 92%, 100% { transform: scaleY(1); }
              96% { transform: scaleY(0.1); }
            }
            @keyframes strangerTalk {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.7) translateY(-0.5px); }
            }
            .stranger-breathe {
              animation: strangerBreathe 4.5s ease-in-out infinite;
              transform-origin: 100px 180px;
            }
            .stranger-eye {
              animation: strangerBlink 5.2s ease-in-out infinite;
              transform-origin: 100px 92px;
            }
            .stranger-mouth-talking {
              animation: strangerTalk 0.22s ease-in-out infinite alternate;
              transform-origin: 102px 124px;
            }
          `}</style>
        </defs>

        {/* Ambient Back Glow */}
        <circle cx="100" cy="110" r="85" fill={`url(#ambientRim-${idSuffix})`} filter="blur(16px)" opacity="0.4" />

        {/* Outer Character Body Group with Breathing Animation */}
        <g className="stranger-breathe">
          {/* ========================================================= */}
          {/* 1. STRANGER VARIANT A: Baseball Cap + Hoodie (Reference 1) */}
          {/* ========================================================= */}
          {resolvedType === 'cap_hoodie' && (
            <g id="variant-cap-hoodie">
              {/* Dark Hoodie & Shoulders */}
              <path
                d="M 28 230 C 30 190 52 165 74 156 L 82 188 L 118 188 L 126 156 C 148 165 170 190 172 230 Z"
                fill={`url(#jacketDark-${idSuffix})`}
                stroke="#0F172A"
                strokeWidth="2.5"
              />
              {/* Inner dark t-shirt / hood cavity */}
              <path d="M 82 168 Q 100 195 118 168 Z" fill="#0B0F17" />
              <path d="M 72 155 Q 100 175 128 155" stroke="#475569" strokeWidth="2" fill="none" />
              {/* Zipper / drawstrings */}
              <line x1="100" y1="172" x2="100" y2="230" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,2" />

              {/* Neck with shadow */}
              <path d="M 86 130 L 86 165 C 93 170 107 170 114 165 L 114 130 Z" fill={`url(#strangerShadow-${idSuffix})`} />

              {/* Jaw & Face Outline */}
              <path
                d="M 68 88 C 66 122 80 148 100 152 C 120 148 134 122 132 88 C 132 58 68 58 68 88 Z"
                fill={`url(#strangerSkin-${idSuffix})`}
                stroke="#6B3419"
                strokeWidth="1.2"
              />

              {/* Subtle Stubble / 5 o'clock shadow around jaw */}
              <path
                d="M 78 120 C 85 144 115 144 122 120 C 114 132 86 132 78 120 Z"
                fill="#8C4E32"
                opacity="0.25"
              />

              {/* Ears */}
              <ellipse cx="66" cy="98" rx="6" ry="11" fill={`url(#strangerSkin-${idSuffix})`} stroke="#6B3419" strokeWidth="1" />
              <ellipse cx="134" cy="98" rx="6" ry="11" fill={`url(#strangerSkin-${idSuffix})`} stroke="#6B3419" strokeWidth="1" />

              {/* Hair strands peeking out under cap */}
              <path d="M 66 78 Q 62 94 65 106 Q 70 96 70 84 Z" fill="#1C1917" />
              <path d="M 134 78 Q 138 94 135 106 Q 130 96 130 84 Z" fill="#1C1917" />
              <path d="M 72 74 Q 82 86 90 76 Q 80 70 72 74 Z" fill="#1C1917" />
              <path d="M 112 76 Q 120 86 128 74 Q 120 70 112 76 Z" fill="#1C1917" />

              {/* Eyes & Eyebrows (Realistic Comic Style) */}
              <g className="stranger-eye">
                {/* Thick Sharp Eyebrows (slanting with suspicious focus) */}
                <path d="M 74 80 Q 86 77 94 82" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 126 80 Q 114 77 106 82" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* Eye whites */}
                <path d="M 76 90 Q 85 85 93 91 Q 85 96 76 90 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="0.8" />
                <path d="M 124 90 Q 115 85 107 91 Q 115 96 124 90 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="0.8" />

                {/* Amber/Brown Irises looking slightly toward the player */}
                <circle cx="86" cy="90.5" r="3.2" fill="#78350F" />
                <circle cx="86" cy="90.5" r="1.6" fill="#1C1917" />
                <circle cx="87" cy="89.5" r="0.8" fill="#FFFFFF" />

                <circle cx="114" cy="90.5" r="3.2" fill="#78350F" />
                <circle cx="114" cy="90.5" r="1.6" fill="#1C1917" />
                <circle cx="115" cy="89.5" r="0.8" fill="#FFFFFF" />
              </g>

              {/* Nose with realistic bridge and nostril shading */}
              <path d="M 100 85 L 97 106 L 102 108 L 105 106" stroke="#9A3412" strokeWidth="1.2" fill="none" />
              <ellipse cx="96" cy="107" rx="1.5" ry="1" fill="#7C2D12" opacity="0.6" />
              <ellipse cx="104" cy="107" rx="1.5" ry="1" fill="#7C2D12" opacity="0.6" />

              {/* Mouth with Smirk / Subtle Animated Mouth Pose */}
              <g className={isTalking ? 'stranger-mouth-talking' : ''}>
                {isTalking ? (
                  <path
                    d="M 88 122 Q 98 128 112 121 Q 102 129 88 122 Z"
                    fill="#451A03"
                    stroke="#78350F"
                    strokeWidth="1.2"
                  />
                ) : (
                  <path
                    d="M 88 122 Q 98 123 112 120"
                    stroke="#78350F"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                {/* Lower lip shadow */}
                <path d="M 94 127 Q 101 129 108 127" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
              </g>

              {/* Cap Crown & Curved Brim */}
              <path
                d="M 64 64 C 64 36 80 26 100 26 C 120 26 136 36 136 64 C 136 70 64 70 64 64 Z"
                fill={`url(#capGrad-${idSuffix})`}
                stroke="#0F172A"
                strokeWidth="2"
              />
              {/* Cap Brim (curved over brow) */}
              <path
                d="M 58 64 C 74 68 126 68 142 64 C 146 72 136 78 100 78 C 64 78 54 72 58 64 Z"
                fill="#1E293B"
                stroke="#0F172A"
                strokeWidth="1.8"
              />
              <path d="M 62 66 Q 100 73 138 66" stroke="#475569" strokeWidth="1" fill="none" opacity="0.6" />
              {/* Cap Button / Eyelet */}
              <circle cx="100" cy="27" r="2.5" fill="#475569" />
            </g>
          )}

          {/* ========================================================= */}
          {/* 2. STRANGER VARIANT B: Full Beard + Utility Jacket (Ref 2) */}
          {/* ========================================================= */}
          {resolvedType === 'bearded' && (
            <g id="variant-bearded">
              {/* Utility / Denim Jacket */}
              <path
                d="M 28 230 C 30 190 52 165 74 156 L 82 188 L 118 188 L 126 156 C 148 165 170 190 172 230 Z"
                fill="#27272A"
                stroke="#18181B"
                strokeWidth="2.5"
              />
              {/* Sherpa / Collar Flaps */}
              <path d="M 68 155 L 86 185 L 94 165 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="1.5" />
              <path d="M 132 155 L 114 185 L 106 165 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="1.5" />
              <path d="M 88 168 Q 100 195 112 168 Z" fill="#09090B" />

              {/* Neck */}
              <path d="M 86 130 L 86 165 C 93 170 107 170 114 165 L 114 130 Z" fill={`url(#strangerShadow-${idSuffix})`} />

              {/* Head / Skin */}
              <path
                d="M 68 88 C 66 122 80 148 100 152 C 120 148 134 122 132 88 C 132 54 68 54 68 88 Z"
                fill={`url(#strangerSkin-${idSuffix})`}
                stroke="#6B3419"
                strokeWidth="1.2"
              />

              {/* Disheveled Wavy Dark Hair */}
              <path
                d="M 62 76 C 58 48 74 24 100 24 C 126 24 142 48 138 76 C 144 65 140 45 130 35 C 118 20 82 20 70 35 C 60 45 56 65 62 76 Z"
                fill="#18181B"
              />
              {/* Hair clumps on forehead */}
              <path d="M 70 55 Q 85 70 82 50 Q 95 72 105 48 Q 115 70 125 54" stroke="#18181B" strokeWidth="5" fill="none" strokeLinecap="round" />

              {/* Ears */}
              <ellipse cx="66" cy="98" rx="6" ry="11" fill={`url(#strangerSkin-${idSuffix})`} stroke="#6B3419" strokeWidth="1" />
              <ellipse cx="134" cy="98" rx="6" ry="11" fill={`url(#strangerSkin-${idSuffix})`} stroke="#6B3419" strokeWidth="1" />

              {/* Eyes & Intense Brow */}
              <g className="stranger-eye">
                <path d="M 74 81 Q 85 79 94 84" stroke="#09090B" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                <path d="M 126 81 Q 115 79 106 84" stroke="#09090B" strokeWidth="3.2" strokeLinecap="round" fill="none" />

                <path d="M 76 91 Q 85 86 93 92 Q 85 97 76 91 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="0.8" />
                <path d="M 124 91 Q 115 86 107 92 Q 115 97 124 91 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="0.8" />

                <circle cx="86" cy="91.5" r="3.2" fill="#3B2516" />
                <circle cx="86" cy="91.5" r="1.5" fill="#09090B" />
                <circle cx="87" cy="90.5" r="0.8" fill="#FFFFFF" />

                <circle cx="114" cy="91.5" r="3.2" fill="#3B2516" />
                <circle cx="114" cy="91.5" r="1.5" fill="#09090B" />
                <circle cx="115" cy="90.5" r="0.8" fill="#FFFFFF" />
              </g>

              {/* Nose */}
              <path d="M 100 84 L 96 106 L 102 108 L 105 106" stroke="#9A3412" strokeWidth="1.4" fill="none" />

              {/* Full Neat Beard & Mustache (matches reference 2) */}
              <path
                d="M 68 106 C 68 138 78 158 100 160 C 122 158 132 138 132 106 C 130 114 125 120 120 118 C 114 116 108 114 100 116 C 92 114 86 116 80 118 C 75 120 70 114 68 106 Z"
                fill="#1C1917"
                stroke="#09090B"
                strokeWidth="1.2"
              />
              {/* Mustache */}
              <path
                d="M 84 115 Q 100 118 100 115 Q 100 118 116 115 Q 100 124 84 115 Z"
                fill="#292524"
              />

              {/* Speaking Mouth inside beard opening */}
              <g className={isTalking ? 'stranger-mouth-talking' : ''}>
                {isTalking ? (
                  <ellipse cx="100" cy="126" rx="6" ry="3.5" fill="#451A03" stroke="#1C1917" strokeWidth="1" />
                ) : (
                  <line x1="94" y1="126" x2="106" y2="126" stroke="#57534E" strokeWidth="2" strokeLinecap="round" />
                )}
              </g>
            </g>
          )}

          {/* ========================================================= */}
          {/* 3. STRANGER VARIANT C: Dark Sunglasses + Tailored (Ref 3) */}
          {/* ========================================================= */}
          {resolvedType === 'sunglasses' && (
            <g id="variant-sunglasses">
              {/* Tailored Coat */}
              <path
                d="M 28 230 C 30 190 52 165 74 156 L 82 188 L 118 188 L 126 156 C 148 165 170 190 172 230 Z"
                fill="#18181B"
                stroke="#09090B"
                strokeWidth="2.5"
              />
              <path d="M 80 156 L 90 200 L 100 175 L 110 200 L 120 156 Z" fill="#27272A" />

              {/* Neck */}
              <path d="M 86 130 L 86 165 C 93 170 107 170 114 165 L 114 130 Z" fill={`url(#strangerShadow-${idSuffix})`} />

              {/* Head / Face */}
              <path
                d="M 68 88 C 66 122 80 148 100 152 C 120 148 134 122 132 88 C 132 54 68 54 68 88 Z"
                fill={`url(#strangerSkin-${idSuffix})`}
                stroke="#6B3419"
                strokeWidth="1.2"
              />

              {/* Styled Wavy Side-Part Hair */}
              <path
                d="M 60 76 C 58 45 70 26 100 24 C 130 22 144 45 140 76 C 135 52 125 36 100 36 C 75 36 65 52 60 76 Z"
                fill="#1C1917"
              />
              <path d="M 75 42 Q 95 32 120 44 Q 135 52 135 70" stroke="#1C1917" strokeWidth="6" fill="none" strokeLinecap="round" />

              {/* Trimmed Goatee Stubble */}
              <path
                d="M 88 134 C 92 148 108 148 112 134 C 106 142 94 142 88 134 Z"
                fill="#292524"
                opacity="0.8"
              />

              {/* Nose */}
              <path d="M 100 90 L 97 106 L 103 108 L 105 106" stroke="#9A3412" strokeWidth="1.3" fill="none" />

              {/* Cool Dark Retro Round Sunglasses */}
              <g>
                {/* Bridge */}
                <line x1="93" y1="89" x2="107" y2="89" stroke="#09090B" strokeWidth="2.5" />
                {/* Left Lens */}
                <circle cx="84" cy="91" r="10" fill="#09090B" stroke="#27272A" strokeWidth="2" />
                <path d="M 77 87 L 85 83 L 83 95 L 75 93 Z" fill="#60A5FA" opacity="0.35" />
                {/* Right Lens */}
                <circle cx="116" cy="91" r="10" fill="#09090B" stroke="#27272A" strokeWidth="2" />
                <path d="M 109 87 L 117 83 L 115 95 L 107 93 Z" fill="#60A5FA" opacity="0.35" />
              </g>

              {/* Mouth with Stern Line / Animated Pose */}
              <g className={isTalking ? 'stranger-mouth-talking' : ''}>
                {isTalking ? (
                  <path d="M 91 123 Q 100 128 109 123 Q 100 129 91 123 Z" fill="#3B1D0E" stroke="#78350F" strokeWidth="1.2" />
                ) : (
                  <path d="M 91 123 Q 100 125 109 123" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                )}
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

