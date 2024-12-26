/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        newsreader: ['Newsreader', 'serif'],
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
        'gradient-dark': 'linear-gradient(to bottom, #000000, #1a1a1a)',
      },
    },
  },
  plugins: [],
}