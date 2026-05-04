/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#4a4a4a',
          700: '#333333',
          800: '#262626', // Charcoal Stone
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        pearl: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5', // Pearl White
          300: '#e5e5e5',
          400: '#d4d4d4',
          500: '#a3a3a3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
        },
        background: '#f5f5f5', // Pearl White
        surface: '#ffffff',
        primary: '#262626', // Charcoal Stone
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        nexed: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(38, 38, 38, 0.1)',
        'charcoal': '0 10px 20px rgba(38, 38, 38, 0.15)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.1)',
      },
      backgroundImage: {
        'charcoal-gradient': 'linear-gradient(135deg, #262626 0%, #4a4a4a 100%)',
        'pearl-gradient': 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
      }
    },
  },
  plugins: [],
}
