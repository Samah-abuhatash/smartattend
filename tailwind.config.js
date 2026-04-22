/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe8ff',
          200: '#b9d2ff',
          300: '#8bb4ff',
          400: '#5b8eff',
          500: '#3566ff',
          600: '#2349e6',
          700: '#1f3cc2',
          800: '#1d339c',
          900: '#1b2d7f',
          950: '#0f163f',
        },
        ink: {
          950: '#0b1220',
        },
        surface: {
          50: '#f7f8fb',
          100: '#eef1f7',
          200: '#d9dfec',
        },
        accent: {
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(11,18,32,0.10)',
        soft: '0 1px 0 rgba(11,18,32,0.06), 0 10px 25px rgba(11,18,32,0.08)',
      },
    },
  },
  plugins: [],
}

