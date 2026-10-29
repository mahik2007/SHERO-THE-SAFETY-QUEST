import React from 'react';
import { PlayableCharacter } from './CharacterSelectScreen';

export interface CharacterPortraitProps {
  char: PlayableCharacter;
  size?: number;
  pose?: 'idle' | 'selected' | 'talking' | 'happy' | 'worried';
  headOnly?: boolean;
  className?: string;
}

/**
 * High-quality Cute Anime CG Character Face & Portrait Component
 * Adheres to:
 * - Slightly rounded faces with soft cute cheeks and a gentle jawline
 * - Large, expressive anime eyes with detailed dual-color irises, depth gradient, pupil, and star/specular highlights
 * - Fine natural anime lash line & delicate double eyelid crease
 * - Cute small button nose with soft warm shadow
 * - Subtle expressive mouth with lip highlight
 * - Natural soft gradient blush with cute diagonal blush markings
 * - Distinct, recognizable character hairstyles, accessories, and signature color aesthetics:
 *   * Gyanvi: Confident, friendly, observant; long violet hair, purple jacket, backpack
 *   * Aanya: Bold, lively, slightly mischievous; sleek dark bob, teal jacket, sporty neck headphones
 *   * Meera: Gentle, thoughtful, calm; soft wavy indigo hair, lavender cardigan, round glasses
 *   * Riya: Energetic, adventurous, playful; high ponytail, energetic eyes, sporty amber visor & jacket
 *   * Mahima: Sweet, innocent, cute; pastel pink ribbon clips, gentle double bangs, warm tender smile
 */
export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  char,
  size = 200,
  pose = 'idle',
  headOnly = false,
  className = ''
}) => {
  const charId = char.id || 'gyanvi';

  // Character specific eye colors & iris accents
  const eyeColors: Record<string, { top: string; mid: string; bot: string; glow: string }> = {
    gyanvi: { top: '#1E1035', mid: '#7C3AED', bot: '#A78BFA', glow: '#C4B5FD' },
    aanya: { top: '#082F3B', mid: '#0D9488', bot: '#22D3EE', glow: '#A5F3FC' },
    meera: { top: '#1E1B4B', mid: '#6366F1', bot: '#A5B4FC', glow: '#E0E7FF' },
    riya: { top: '#451A03', mid: '#D97706', bot: '#FBBF24', glow: '#FDE68A' },
    mahima: { top: '#4A044E', mid: '#DB2777', bot: '#F472B6', glow: '#FBCFE8' }
  };
  const eye = eyeColors[charId] || eyeColors.gyanvi;

  // Eyebrow and mouth expressions
  const isHappy = pose === 'happy' || pose === 'selected';
  const isWorried = pose === 'worried';
  const isTalking = pose === 'talking';

  const viewBox = headOnly ? '38 22 84 92' : '0 0 160 260';
  const height = headOnly ? size : size * 1.3;

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={height}
      className={className}
      style={{
        display: 'block',
        margin: '0 auto',
        filter: pose === 'selected' ? `drop-shadow(0 0 14px ${char.colorHex}80)` : 'none'
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for rich Anime CG shading */}
        <radialGradient id={`faceSkin-${charId}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF7F2" />
          <stop offset="65%" stopColor="#FDE3D2" />
          <stop offset="100%" stopColor="#F9CBBA" />
        </radialGradient>

        <radialGradient id={`neckShadow-${charId}`} cx="50%" cy="10%" r="70%">
          <stop offset="0%" stopColor="#E2A995" />
          <stop offset="100%" stopColor="#FDE3D2" />
        </radialGradient>

        <radialGradient id={`cheekBlush-${charId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FB7185" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#FDA4AF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`irisGrad-${charId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={eye.top} />
          <stop offset="45%" stopColor={eye.mid} />
          <stop offset="85%" stopColor={eye.bot} />
          <stop offset="100%" stopColor={eye.glow} />
        </linearGradient>

        <linearGradient id={`hairShine-${charId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={char.colorHex} stopOpacity="0" />
          <stop offset="35%" stopColor={char.colorHex} stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="65%" stopColor={char.colorHex} stopOpacity="0.8" />
          <stop offset="100%" stopColor={char.colorHex} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`jacketGrad-${charId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={char.jacketColor} />
          <stop offset="100%" stopColor="#0B0918" />
        </linearGradient>
      </defs>

      {!headOnly && (
        <g id="body-layer">
          {/* Ground glow */}
          <ellipse cx="80" cy="248" rx="55" ry="9" fill={char.colorHex} opacity="0.3" />

          {/* Legs */}
          <path d="M 62 170 L 58 248 L 72 248 L 76 170 Z" fill="#151928" />
          <path d="M 84 170 L 88 248 L 102 248 L 98 170 Z" fill="#151928" />

          {/* Sneakers with character trim */}
          <path d="M 53 245 L 75 245 L 76 253 L 51 253 Z" fill="#F8FAFC" />
          <rect x="57" y="247" width="11" height="3" rx="1.5" fill={char.colorHex} />
          <path d="M 84 245 L 106 245 L 107 253 L 82 253 Z" fill="#F8FAFC" />
          <rect x="88" y="247" width="11" height="3" rx="1.5" fill={char.colorHex} />

          {/* Torso Jacket */}
          <path
            d="M 46 102 L 114 102 L 119 174 L 41 174 Z"
            fill={`url(#jacketGrad-${charId})`}
            stroke={char.borderColor}
            strokeWidth="1.5"
          />

          {/* Inner shirt with character neon accent */}
          <polygon points="72,102 88,102 83,142 77,142" fill={char.colorHex} opacity="0.5" />
          <polygon points="75,102 85,102 82,130 78,130" fill="#FFFFFF" opacity="0.75" />

          {/* Arms & Character-Specific Props */}
          {charId === 'aanya' ? (
            <g>
              <path d="M 46 108 L 29 154 L 39 157 L 56 108 Z" fill={char.jacketColor} />
              <path d="M 114 108 L 131 154 L 121 157 L 104 108 Z" fill={char.jacketColor} />
              <circle cx="34" cy="157" r="4.5" fill="#FDE3D2" />
              <circle cx="126" cy="157" r="4.5" fill="#FDE3D2" />
              {/* Sporty Headphones around neck */}
              <path d="M 58 116 C 53 110 53 104 60 101 L 100 101 C 107 104 107 110 102 116" stroke={char.colorHex} strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="56" cy="112" r="6" fill="#0E1726" stroke={char.colorHex} strokeWidth="2" />
              <circle cx="104" cy="112" r="6" fill="#0E1726" stroke={char.colorHex} strokeWidth="2" />
            </g>
          ) : charId === 'gyanvi' ? (
            <g>
              <path d="M 46 108 L 31 158 L 41 161 L 56 108 Z" fill={char.jacketColor} />
              <path d="M 114 108 L 120 158 L 110 160 L 104 108 Z" fill={char.jacketColor} />
              <circle cx="36" cy="161" r="4.5" fill="#FDE3D2" />
              <circle cx="115" cy="160" r="4.5" fill="#FDE3D2" />
              {/* Backpack straps */}
              <path d="M 54 105 C 57 140 56 168 57 172" stroke={char.colorHex} strokeWidth="2.8" fill="none" />
              <path d="M 106 105 C 103 140 104 168 103 172" stroke={char.colorHex} strokeWidth="2.8" fill="none" />
              <rect x="52" y="135" width="5" height="7" rx="1" fill="#FFFFFF" opacity="0.8" />
              <rect x="103" y="135" width="5" height="7" rx="1" fill="#FFFFFF" opacity="0.8" />
            </g>
          ) : charId === 'meera' ? (
            <g>
              <path d="M 46 108 L 33 162 L 43 164 L 56 108 Z" fill={char.jacketColor} />
              <path d="M 114 108 L 122 154 L 112 157 L 104 108 Z" fill={char.jacketColor} />
              <circle cx="38" cy="164" r="4.5" fill="#FDE3D2" />
              <circle cx="117" cy="157" r="4.5" fill="#FDE3D2" />
              {/* Soft cardigan buttons */}
              <circle cx="80" cy="120" r="2.5" fill={char.colorHex} />
              <circle cx="80" cy="138" r="2.5" fill={char.colorHex} />
              <circle cx="80" cy="156" r="2.5" fill={char.colorHex} />
            </g>
          ) : charId === 'riya' ? (
            <g>
              <path d="M 46 108 L 28 148 L 38 152 L 56 108 Z" fill={char.jacketColor} />
              <path d="M 114 108 L 132 146 L 122 150 L 104 108 Z" fill={char.jacketColor} />
              <circle cx="33" cy="152" r="4.5" fill="#FDE3D2" />
              <circle cx="127" cy="150" r="4.5" fill="#FDE3D2" />
              {/* Sporty utility pocket */}
              <rect x="88" y="125" width="16" height="18" rx="2" fill="#78350F" stroke={char.borderColor} strokeWidth="1" />
            </g>
          ) : (
            // Mahima
            <g>
              <path d="M 46 108 L 35 160 L 45 162 L 56 108 Z" fill={char.jacketColor} />
              <path d="M 114 108 L 118 156 L 108 158 L 104 108 Z" fill={char.jacketColor} />
              <circle cx="40" cy="162" r="4.5" fill="#FDE3D2" />
              <circle cx="113" cy="158" r="4.5" fill="#FDE3D2" />
              {/* Cute heart pouch bag */}
              <rect x="108" y="146" width="18" height="22" rx="4" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1" />
              <path d="M 114 146 C 114 140 120 140 120 146" stroke="#F472B6" strokeWidth="2" fill="none" />
              <circle cx="117" cy="156" r="3" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}
        </g>
      )}

      {/* ── BACK HAIR LAYER ────────────────────────────────── */}
      {charId === 'gyanvi' && (
        // Long flowing dark hair with gentle volume
        <g>
          <path
            d="M 44 55 C 38 95 32 145 46 175 C 54 165 58 135 62 105 C 72 135 90 168 104 175 C 118 145 116 95 114 55 Z"
            fill={char.hairColor}
          />
          <path
            d="M 40 75 C 34 115 36 150 48 168 C 44 140 46 105 52 75 Z"
            fill="#3B1C5A"
            opacity="0.8"
          />
        </g>
      )}

      {charId === 'aanya' && (
        // Sleek anime bob with sharp tapered ends
        <path
          d="M 48 50 C 42 75 42 100 46 116 C 54 108 66 102 78 102 C 90 102 102 108 112 116 C 116 100 116 75 110 50 Z"
          fill={char.hairColor}
        />
      )}

      {charId === 'meera' && (
        // Wavy gentle shoulder locks
        <path
          d="M 42 50 C 34 85 32 125 40 156 C 48 148 54 125 58 95 C 64 125 74 150 88 156 C 102 148 112 125 116 95 C 122 125 124 148 126 154 C 132 125 130 85 118 50 Z"
          fill={char.hairColor}
        />
      )}

      {charId === 'riya' && (
        // Energetic high ponytail
        <g>
          {/* Ponytail plume bounding out */}
          <path
            d="M 80 24 C 84 10 94 4 104 2 C 112 6 116 16 114 26 C 108 34 94 38 84 32 Z"
            fill={char.hairColor}
          />
          <path
            d="M 94 10 C 102 12 106 18 104 26"
            stroke={char.colorHex}
            strokeWidth="2"
            fill="none"
            opacity="0.85"
          />
        </g>
      )}

      {charId === 'mahima' && (
        // Cute soft curls with twin ribbon loops
        <g>
          <path
            d="M 44 52 C 36 90 34 135 44 160 C 52 152 56 128 62 95 C 68 128 80 152 92 160 C 104 152 108 128 114 95 C 120 128 124 152 128 158 C 134 135 132 90 124 52 Z"
            fill={char.hairColor}
          />
          {/* Soft cute ribbons peaking out */}
          <circle cx="48" cy="48" r="4.5" fill="#F472B6" />
          <circle cx="112" cy="48" r="4.5" fill="#F472B6" />
        </g>
      )}

      {/* ── NECK & CHIN SHADOW ─────────────────────────────── */}
      <rect x="73" y="86" width="14" height="22" rx="3" fill={`url(#neckShadow-${charId})`} />
      {/* Subtle chin cast shadow on neck */}
      <path d="M 72 88 Q 80 96 88 88 L 88 86 L 72 86 Z" fill="#E2A995" opacity="0.6" />

      {/* ── FACE BASE (Polished, cute, slightly rounded with soft cheeks) ── */}
      <path
        d="M 52 54 C 50 78 54 94 65 101 C 72 105 80 106 88 105 C 99 101 106 88 108 64 C 109 46 99 30 80 30 C 61 30 53 44 52 54 Z"
        fill={`url(#faceSkin-${charId})`}
        stroke="#E8B09F"
        strokeWidth="0.8"
      />

      {/* Cute Jawline & Ear Accents */}
      <path d="M 49 65 C 47 62 47 72 51 74 Z" fill="#FDE3D2" stroke="#E8B09F" strokeWidth="0.6" />
      <path d="M 109 65 C 111 62 111 72 107 74 Z" fill="#FDE3D2" stroke="#E8B09F" strokeWidth="0.6" />

      {/* Soft Rosy Anime Cheeks (Blush) */}
      <ellipse cx="60" cy="77" rx="10" ry="6" fill={`url(#cheekBlush-${charId})`} />
      <ellipse cx="100" cy="77" rx="10" ry="6" fill={`url(#cheekBlush-${charId})`} />
      {/* Cute micro anime blush marks (slash lines) */}
      <g stroke="#FB7185" strokeWidth="1" strokeLinecap="round" opacity="0.65">
        <line x1="56" y1="78" x2="59" y2="75" />
        <line x1="60" y1="78" x2="63" y2="75" />
        <line x1="97" y1="78" x2="100" y2="75" />
        <line x1="101" y1="78" x2="104" y2="75" />
      </g>

      {/* ── CUTE, SMALL NOSE & MOUTH ──────────────────────── */}
      {/* Small delicate anime nose */}
      <circle cx="80" cy="78" r="1.1" fill="#EA580C" opacity="0.45" />
      <path d="M 79 77 Q 80.5 78.5 80 79.5" stroke="#E19480" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* Cute youthful anime mouth */}
      {isHappy ? (
        // Sweet open smile with rosy inner tone
        <g>
          <path d="M 74 88 Q 80 96 86 88 Z" fill="#FB7185" stroke="#BE123C" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 76 89 Q 80 92 84 89" fill="#FFF1F2" />
        </g>
      ) : isTalking ? (
        // Expressive talking mouth
        <g>
          <path d="M 75 87 Q 80 94 85 87 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.2" />
          <ellipse cx="80" cy="89" rx="2.5" ry="1.5" fill="#FFE4E6" />
        </g>
      ) : isWorried ? (
        // Gentle, soft worried mouth
        <path d="M 75 90 Q 80 86 85 90" stroke="#E11D48" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        // Cute gentle confident closed smile
        <g>
          <path d="M 74 88 Q 80 92.5 86 88" stroke="#E11D48" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <ellipse cx="80" cy="90.5" rx="1.5" ry="0.6" fill="#FDA4AF" opacity="0.8" />
        </g>
      )}

      {/* ── LARGE EXPRESSIVE ANIME EYES ───────────────────── */}
      {/* LEFT EYE */}
      <g id="left-eye">
        {/* Double eyelid crease */}
        <path d="M 58 56 Q 66 53 73 57" stroke="#A76050" strokeWidth="0.9" fill="none" opacity="0.65" strokeLinecap="round" />

        {/* Outer White / Sclera with soft top shadow */}
        <ellipse cx="65" cy="67" rx="8" ry="10" fill="#FFFFFF" />
        <path d="M 57 65 Q 65 62 73 65 L 73 62 Q 65 59 57 62 Z" fill="#E2E8F0" opacity="0.85" />

        {/* Rich Dual-Color Iris with CG Depth */}
        <ellipse cx="65" cy="67.5" rx="6.5" ry="8.8" fill={`url(#irisGrad-${charId})`} />

        {/* Deep Pupil */}
        <ellipse cx="65" cy="67" rx="3.5" ry="5.2" fill="#0A0915" />

        {/* Inner Iris Radiance Rim */}
        <path
          d="M 60 70 Q 65 75 70 70"
          stroke={eye.glow}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Primary Specular Star Highlight (Top-Right) */}
        <ellipse cx="62.5" cy="63.5" rx="2.6" ry="3.2" fill="#FFFFFF" transform="rotate(-15 62.5 63.5)" />

        {/* Secondary Catchlight Sparkle (Bottom-Left) */}
        <circle cx="67.5" cy="71" r="1.4" fill="#FFFFFF" opacity="0.9" />
        <circle cx="63.5" cy="72" r="0.8" fill="#FFFFFF" opacity="0.75" />

        {/* Polished Anime Eyelash Line with delicate flutter shapes */}
        <path
          d="M 55 64 Q 62 57 73 62"
          stroke="#0F172A"
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Upper Lash flicks */}
        <path d="M 55 63 Q 52 61 54 58" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 57 61 Q 56 58 58 56" stroke="#0F172A" strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* Subtle Lower Eyelash */}
        <path d="M 60 75 Q 65 77 70 75" stroke="#1E293B" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* RIGHT EYE */}
      <g id="right-eye">
        {/* Double eyelid crease */}
        <path d="M 87 57 Q 94 53 102 56" stroke="#A76050" strokeWidth="0.9" fill="none" opacity="0.65" strokeLinecap="round" />

        {/* Outer White / Sclera with soft top shadow */}
        <ellipse cx="95" cy="67" rx="8" ry="10" fill="#FFFFFF" />
        <path d="M 87 65 Q 95 62 103 65 L 103 62 Q 95 59 87 62 Z" fill="#E2E8F0" opacity="0.85" />

        {/* Rich Dual-Color Iris with CG Depth */}
        <ellipse cx="95" cy="67.5" rx="6.5" ry="8.8" fill={`url(#irisGrad-${charId})`} />

        {/* Deep Pupil */}
        <ellipse cx="95" cy="67" rx="3.5" ry="5.2" fill="#0A0915" />

        {/* Inner Iris Radiance Rim */}
        <path
          d="M 90 70 Q 95 75 100 70"
          stroke={eye.glow}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Primary Specular Star Highlight (Top-Right) */}
        <ellipse cx="92.5" cy="63.5" rx="2.6" ry="3.2" fill="#FFFFFF" transform="rotate(-15 92.5 63.5)" />

        {/* Secondary Catchlight Sparkle (Bottom-Left) */}
        <circle cx="97.5" cy="71" r="1.4" fill="#FFFFFF" opacity="0.9" />
        <circle cx="93.5" cy="72" r="0.8" fill="#FFFFFF" opacity="0.75" />

        {/* Polished Anime Eyelash Line with delicate flutter shapes */}
        <path
          d="M 87 62 Q 98 57 105 64"
          stroke="#0F172A"
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Upper Lash flicks */}
        <path d="M 105 63 Q 108 61 106 58" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 103 61 Q 104 58 102 56" stroke="#0F172A" strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* Subtle Lower Eyelash */}
        <path d="M 90 75 Q 95 77 100 75" stroke="#1E293B" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── EYEBROWS (Personality-tailored) ────────────────── */}
      {charId === 'aanya' ? (
        // Bold, confident, slight mischievous arch
        <g stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d={isWorried ? 'M 58 53 Q 66 50 72 54' : 'M 57 51 Q 65 46 73 50'} />
          <path d={isWorried ? 'M 88 54 Q 94 50 102 53' : 'M 87 50 Q 95 46 103 51'} />
        </g>
      ) : charId === 'meera' ? (
        // Gentle, calm, thoughtful soft brows
        <g stroke="#261A4E" strokeWidth="1.8" fill="none" strokeLinecap="round">
          <path d={isWorried ? 'M 58 52 Q 65 49 72 53' : 'M 58 52 Q 65 48 72 51'} />
          <path d={isWorried ? 'M 88 53 Q 95 49 102 52' : 'M 88 51 Q 95 48 102 52'} />
        </g>
      ) : charId === 'riya' ? (
        // Energetic, upbeat, courageous brows
        <g stroke="#1F0D00" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d={isWorried ? 'M 58 52 Q 66 50 72 53' : 'M 57 50 Q 65 45 73 49'} />
          <path d={isWorried ? 'M 88 53 Q 94 50 102 52' : 'M 87 49 Q 95 45 103 50'} />
        </g>
      ) : charId === 'mahima' ? (
        // Sweet, innocent, gentle rounded brows
        <g stroke="#3D1A28" strokeWidth="1.9" fill="none" strokeLinecap="round">
          <path d={isWorried ? 'M 59 53 Q 66 50 72 54' : 'M 58 52 Q 65 48 71 52'} />
          <path d={isWorried ? 'M 88 54 Q 94 50 101 53' : 'M 89 52 Q 95 48 102 52'} />
        </g>
      ) : (
        // Gyanvi: Confident, observant, intelligent
        <g stroke="#141028" strokeWidth="2.1" fill="none" strokeLinecap="round">
          <path d={isWorried ? 'M 58 53 Q 66 50 72 54' : 'M 57 51 Q 65 47 73 51'} />
          <path d={isWorried ? 'M 88 54 Q 94 50 102 53' : 'M 87 51 Q 95 47 103 51'} />
        </g>
      )}

      {/* ── MEERA'S SIGNATURE GLASSES ──────────────────────── */}
      {charId === 'meera' && (
        <g>
          {/* Left Lens */}
          <ellipse cx="65" cy="67" rx="10.5" ry="11.5" fill="none" stroke="#FDE047" strokeWidth="1.6" />
          <path d="M 56 61 Q 62 58 72 61" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Right Lens */}
          <ellipse cx="95" cy="67" rx="10.5" ry="11.5" fill="none" stroke="#FDE047" strokeWidth="1.6" />
          <path d="M 86 61 Q 92 58 102 61" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Bridge */}
          <path d="M 75.5 67 Q 80 65 84.5 67" stroke="#FDE047" strokeWidth="1.8" fill="none" />
          {/* Temple arms */}
          <line x1="54.5" y1="67" x2="49" y2="65" stroke="#FDE047" strokeWidth="1.5" />
          <line x1="105.5" y1="67" x2="111" y2="65" stroke="#FDE047" strokeWidth="1.5" />
        </g>
      )}

      {/* ── FRONT HAIR BANGS & STYLES (Source of truth) ────── */}
      {charId === 'aanya' ? (
        // Sharp sleek anime bob with stylish modern bangs
        <g>
          <path
            d="M 50 42 C 54 62 60 74 65 62 C 70 75 76 76 82 60 C 88 74 96 68 100 58 C 104 68 110 58 112 42 C 106 20 54 20 50 42 Z"
            fill={char.hairColor}
          />
          {/* Side framing locks */}
          <path d="M 46 44 C 44 65 45 84 52 94 C 54 84 53 66 52 46 Z" fill={char.hairColor} />
          <path d="M 114 44 C 116 65 115 84 108 94 C 106 84 107 66 108 46 Z" fill={char.hairColor} />
          {/* Anime Hair Shine Halo */}
          <ellipse cx="80" cy="36" rx="28" ry="4" fill={`url(#hairShine-${charId})`} />
        </g>
      ) : charId === 'riya' ? (
        // Sporty bangs with energetic visor cap
        <g>
          {/* Bangs */}
          <path
            d="M 52 45 C 56 64 62 72 67 60 C 72 73 80 72 85 58 C 88 68 95 62 98 48 C 102 60 108 52 110 45 C 106 24 56 24 52 45 Z"
            fill={char.hairColor}
          />
          {/* Sporty visor / cap */}
          <path
            d="M 48 36 C 60 26 100 26 112 36 L 118 42 C 100 38 60 38 42 42 Z"
            fill="#D97706"
            stroke="#FBBF24"
            strokeWidth="1.2"
          />
          <path d="M 52 34 C 64 26 96 26 108 34" stroke="#FDE68A" strokeWidth="1.5" fill="none" />
          <ellipse cx="80" cy="38" rx="24" ry="3" fill={`url(#hairShine-${charId})`} />
        </g>
      ) : charId === 'mahima' ? (
        // Sweet double bangs with cute ribbon barrettes
        <g>
          {/* Soft rounded curtain bangs */}
          <path
            d="M 48 44 C 52 66 58 76 64 64 C 70 76 78 76 84 62 C 90 75 98 68 102 54 C 106 66 112 56 114 44 C 108 22 54 22 48 44 Z"
            fill={char.hairColor}
          />
          {/* Side framing soft curls */}
          <path d="M 46 48 C 42 70 44 95 50 102 C 54 92 52 72 50 48 Z" fill={char.hairColor} />
          <path d="M 114 48 C 118 70 116 95 110 102 C 106 92 108 72 110 48 Z" fill={char.hairColor} />
          {/* Cute pastel pink ribbon barrettes */}
          <g>
            <rect x="52" y="44" width="12" height="6.5" rx="2.5" fill="#F472B6" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="58" cy="47.2" r="1.5" fill="#FFFFFF" />
            <rect x="96" y="44" width="12" height="6.5" rx="2.5" fill="#F472B6" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="102" cy="47.2" r="1.5" fill="#FFFFFF" />
          </g>
          <ellipse cx="80" cy="36" rx="26" ry="4" fill={`url(#hairShine-${charId})`} />
        </g>
      ) : charId === 'meera' ? (
        // Gentle wavy bangs
        <g>
          <path
            d="M 48 45 C 52 66 58 78 64 65 C 70 78 78 78 84 64 C 90 76 98 68 102 54 C 106 66 112 56 114 45 C 108 22 54 22 48 45 Z"
            fill={char.hairColor}
          />
          {/* Side wavy curls framing cheek */}
          <path d="M 44 48 C 40 72 42 98 48 108 C 52 96 50 74 48 50 Z" fill={char.hairColor} />
          <path d="M 116 48 C 120 72 118 98 112 108 C 108 96 110 74 112 50 Z" fill={char.hairColor} />
          <ellipse cx="80" cy="36" rx="28" ry="4" fill={`url(#hairShine-${charId})`} />
        </g>
      ) : (
        // Gyanvi: Distinct long dark hair with violet sheen & neat anime bangs
        <g>
          <path
            d="M 48 44 C 52 66 58 78 64 64 C 70 78 78 78 84 64 C 90 77 98 70 102 54 C 106 66 112 56 114 44 C 108 22 54 22 48 44 Z"
            fill={char.hairColor}
          />
          {/* Side straight locks */}
          <path d="M 44 48 C 40 72 41 98 47 110 C 51 98 49 74 48 50 Z" fill={char.hairColor} />
          <path d="M 116 48 C 120 72 119 98 113 110 C 109 98 111 74 112 50 Z" fill={char.hairColor} />
          {/* Violet Sheen Highlight Stream */}
          <ellipse cx="80" cy="35" rx="28" ry="4.5" fill={`url(#hairShine-${charId})`} />
          <path d="M 46 65 Q 43 90 48 105" stroke="#A78BFA" strokeWidth="1.5" fill="none" opacity="0.75" />
          <path d="M 114 65 Q 117 90 112 105" stroke="#A78BFA" strokeWidth="1.5" fill="none" opacity="0.75" />
        </g>
      )}

      {/* Signature luminous hair strand highlights */}
      <path
        d="M 64 64 L 66 71 L 68 64 Z"
        fill={char.colorHex}
        opacity="0.8"
      />
      <path
        d="M 84 64 L 86 71 L 88 64 Z"
        fill={char.colorHex}
        opacity="0.8"
      />
    </svg>
  );
};
