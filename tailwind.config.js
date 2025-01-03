/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');
export default withMT({
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './index.html'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      gray: {
        100: '#F2F4F6', //sidebar bg
        200: '#E0E8F0', //sidebar selected
        300: '#DDDDDD', //stroke
        400: '#A1A4AF', //sidebar gray text
        500: '#4E5968',
      },
      black_default: '#313544',
      red: { 100: '#FF7A73', 200: '#F04452' },
      blue: {
        100: '#88AAFD',
        200: '#0046FF',
      },
      defaultText: '#4C526B',
      yellow: {
        200: '#FFCD4A'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'Arial', 'sans-serif'],
      },
      backgroundSize: {
        small: '50%',
        medium: '75%',
        large: '100%',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        slideUp: 'slideUp 0.8s ease-out',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
});
