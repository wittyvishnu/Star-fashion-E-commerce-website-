/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-mixed': '0 0 10px red, 0 0 20px orange,0 0 26px orange',
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
        sans: ['Roboto', 'sans-serif'],
        // cur:  [ "Cedarville Cursive","cursive"],
      },
    },
  },
  plugins: [],
}