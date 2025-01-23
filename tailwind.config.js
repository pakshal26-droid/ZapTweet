/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif',],
        anek:["Anek Latin"],
        oswald:["Oswald"],
        caladea:["Caladea"]
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: null,
            a: {
              color: null,
              '&:hover': {
                color: null,
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}