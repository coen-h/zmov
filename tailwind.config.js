/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '450px',
      'sm': '500px',
      'md': '550px',
      'lg': '800px',
      'xl': '1100px',
      '2xl': '1400px',
    },
    extend: {
      // keyframes: {
      //   'siteLoad': {
      //     '0%': { opacity: 0 },
      //     '100%': { opacity: 1 },
      //   },
      // },
      // animation: {
      //   'loaded': 'siteLoad 1.5s ease',
      // },
    },
  },
  plugins: [],
}