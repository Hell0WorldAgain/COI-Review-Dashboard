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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        status: {
          active: '#3b82f6',
          expired: '#ef4444',
          rejected: '#ef4444',
          expiring: '#f97316',
          notProcessed: '#93c5fd',
        }
      }
    },
  },
  plugins: [],
}
