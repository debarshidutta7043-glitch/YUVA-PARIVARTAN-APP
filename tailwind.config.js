
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme branding matches Yuva Parivartan
        brand: {
          red: '#dc2626',
          orange: '#f97316',
          yellow: '#fbbf24'
        }
      }
    },
  },
  plugins: [],
}
