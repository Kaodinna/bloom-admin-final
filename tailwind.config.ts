import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9973A',
          light: '#E8C97A',
          dim: '#F5EDD8',
        },
        cream: {
          DEFAULT: '#F8F4EE',
          dark: '#EDE7DC',
          darker: '#E4DDD2',
        },
        brown: '#6B4F2A',
        ink: {
          DEFAULT: '#1C1510',
          mid: '#4A3D30',
          soft: '#8A7965',
          xs: '#B0A496',
        },
        ivory: '#FFFCF8',
        sage: {
          DEFAULT: '#2D6B4A',
          light: '#E8F2EC',
        },
        teal: {
          DEFAULT: '#1F7A7A',
          light: '#E0F4F4',
        },
        rust: {
          DEFAULT: '#B85C38',
          light: '#F5E8E2',
        },
        violet: {
          DEFAULT: '#6A4C8A',
          light: '#EDE6F5',
        },
        azure: {
          DEFAULT: '#2B5FA0',
          light: '#E4EDF8',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(28,21,16,.06), 0 4px 16px rgba(28,21,16,.07)',
        md: '0 8px 40px rgba(28,21,16,.13)',
        gold: '0 4px 24px rgba(201,151,58,.18)',
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        sm: '8px',
      },
      animation: {
        'fade-up': 'fadeUp 0.2s ease',
        'pulse-dot': 'pulseDot 2s infinite',
        'slide-in': 'slideIn 0.28s ease',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(7px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(45,107,74,.4)' },
          '50%':       { opacity: '.7', boxShadow: '0 0 0 5px rgba(45,107,74,0)' },
        },
        slideIn: {
          from: { transform: 'translateX(110px)', opacity: '0' },
          to:   { transform: 'translateX(0)',     opacity: '1' },
        },
      },
      width: { sidebar: '238px' },
    },
  },
  plugins: [],
}

export default config
