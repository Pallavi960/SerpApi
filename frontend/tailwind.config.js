/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          400: '#818cf8',
          600: '#1e3a5f',
          700: '#162d4a',
          800: '#0f2035',
          900: '#0B1220',
          950: '#060d18',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0B1220 0%, #0f2035 50%, #162d4a 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 40%, rgba(11,18,32,0.95) 100%)',
        'cyan-glow':     'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-cyan':  '0 0 40px rgba(34,211,238,0.15)',
        'glow-navy':  '0 8px 40px rgba(11,18,32,0.3)',
        'card-hover': '0 20px 60px rgba(11,18,32,0.15)',
        'premium':    '0 4px 24px rgba(11,18,32,0.08)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'fade-up':     'fadeUp 0.6s ease-out forwards',
        'fade-in':     'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
