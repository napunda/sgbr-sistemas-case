/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#041e49',
        secondary: '#0b57d0',
      },
    },
  },
  plugins: [],
};
