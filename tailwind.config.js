export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#bdd1ff',
          300: '#93b2ff',
          400: '#6389ff',
          500: '#2f6bff',
          600: '#1e56f0',
          700: '#1743d1',
          800: '#1839a9',
          900: '#1a3585',
        },
        ink: {
          DEFAULT: '#0f1729',
          700: '#334155',
          500: '#64748b',
        },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
