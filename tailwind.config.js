/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dream: {
          bg: '#0a0a1a',
          surface: '#12122a',
          border: '#1e1e3a',
          accent: '#6366f1',
          text: '#e2e8f0',
          muted: '#64748b',
          glow: '#818cf8',
        }
      }
    },
  },
  plugins: [],
}
