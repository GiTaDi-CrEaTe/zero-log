/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hacker: '#00ff00',
        void: '#0a0a0a',
      }
    },
  },
  plugins: [],
}