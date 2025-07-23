/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        gray: {
          100: '#E0E0E0', // طوسی روشن
          400: '#BDBDBD', // طوسی متوسط
          700: '#424242', // طوسی تیره
        },
      },
    },
  },
  plugins: [],
};