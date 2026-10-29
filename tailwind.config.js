/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#080B18',
        indigoDeep: '#11142B',
        darkViolet: '#20133F',
        electricBlue: '#4B7BFF',
        neonLavender: '#A78BFA',
        softCyan: '#67E8F9',
        mutedLavender: '#B9B7D6',
        dangerRed: '#FF5470',
        successMint: '#65F5C5',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(75, 123, 255, 0.45)',
        'glow-lavender': '0 0 25px rgba(167, 139, 250, 0.45)',
        'glow-cyan': '0 0 25px rgba(103, 232, 249, 0.45)',
        'glow-danger': '0 0 25px rgba(255, 84, 112, 0.45)',
        'glow-mint': '0 0 25px rgba(101, 245, 197, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'fade-slide-up': 'fadeSlideUp 0.5s ease-out both',
        shimmer: 'shimmer 4s linear infinite',
      }
    },
  },
  plugins: [],
}
