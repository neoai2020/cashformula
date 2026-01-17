import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Elegant dark palette
        navy: {
          950: '#0c0a1d',
          900: '#110e24',
          800: '#19162d',
          700: '#231f3d',
          600: '#2e2a4d',
          500: '#4a4570',
          400: '#6b6590',
          300: '#9590b0',
        },
        // Soft violet - primary accent
        violet: {
          light: '#c4b5fd',
          DEFAULT: '#a78bfa',
          dark: '#8b5cf6',
        },
        // Soft indigo
        indigo: {
          light: '#a5b4fc',
          DEFAULT: '#818cf8',
          dark: '#6366f1',
        },
        // Soft teal
        teal: {
          light: '#5eead4',
          DEFAULT: '#2dd4bf',
          dark: '#14b8a6',
        },
        // Soft rose
        rose: {
          light: '#f9a8d4',
          DEFAULT: '#f472b6',
          dark: '#ec4899',
        },
        // Emerald for success
        cash: {
          green: '#34d399',
          lime: '#a3e635',
          emerald: '#10b981',
        },
        // Backwards compatibility - map to new elegant colors
        gold: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        neon: {
          cyan: '#2dd4bf',
          'cyan-dark': '#14b8a6',
          'cyan-light': '#5eead4',
        },
        pink: {
          neon: '#f472b6',
          hot: '#ec4899',
          light: '#f9a8d4',
        },
        purple: {
          neon: '#818cf8',
          electric: '#6366f1',
          light: '#a5b4fc',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient': 
          'radial-gradient(at 0% 0%, rgba(167, 139, 250, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(129, 140, 248, 0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(45, 212, 191, 0.04) 0px, transparent 50%)',
        'card-shine': 'linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, transparent 50%, rgba(129, 140, 248, 0.03) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'ticker': 'ticker 25s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'glow': {
          '0%': { boxShadow: '0 4px 20px rgba(167, 139, 250, 0.15)' },
          '100%': { boxShadow: '0 6px 28px rgba(167, 139, 250, 0.25)' },
        },
      },
      boxShadow: {
        'glow': '0 4px 20px rgba(167, 139, 250, 0.2)',
        'glow-lg': '0 8px 32px rgba(167, 139, 250, 0.25)',
        'glow-teal': '0 4px 20px rgba(45, 212, 191, 0.2)',
        'glow-rose': '0 4px 20px rgba(244, 114, 182, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(167, 139, 250, 0.05)',
        // Legacy support
        'neon': '0 4px 20px rgba(167, 139, 250, 0.2)',
        'neon-lg': '0 8px 32px rgba(167, 139, 250, 0.25)',
        'neon-pink': '0 4px 20px rgba(244, 114, 182, 0.2)',
        'neon-purple': '0 4px 20px rgba(129, 140, 248, 0.2)',
        'neon-green': '0 4px 20px rgba(52, 211, 153, 0.2)',
        'gold': '0 4px 20px rgba(167, 139, 250, 0.2)',
        'gold-lg': '0 8px 32px rgba(167, 139, 250, 0.25)',
        'inner-gold': 'inset 0 0 20px rgba(167, 139, 250, 0.05)',
        'inner-neon': 'inset 0 0 20px rgba(167, 139, 250, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
