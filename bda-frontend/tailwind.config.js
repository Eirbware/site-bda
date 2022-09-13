/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5BC2EB',
        betterPrimary: '#6FAAD0',
        betterPrimaryShadowed: '#3c86b6'
      }
    },
  },
  plugins: [require("daisyui")]
}
