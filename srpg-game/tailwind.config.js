/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#2C1810',
        'plains': '#4CAF50',
        'town': '#8D6E63',
        'city': '#757575',
        'ui-bg': '#3E2723',
        'cream': '#FFF8E1',
      },
      fontFamily: {
        'game': ['Noto Sans JP', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}