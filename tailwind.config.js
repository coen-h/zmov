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
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgb(15, 11, 9) 50%, rgba(0, 0, 0, 1) 97%, rgba(0, 0, 0, 0) 100%)',
      },
    },
  },
  plugins: [],
}