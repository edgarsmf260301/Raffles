/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#cf010b',
        secondary: '#ffffff',
        gray: {
          DEFAULT: '#aaaaaa', // Definir el color gris por defecto
          500: '#aaaaaa', // Asegurarse de que el color gris 500 esté definido
        },
        black: '#000000',
        red: {
          600: '#ff0000',
        },
      },
      boxShadow: {
        'gray-500/50': '0 4px 6px -1px rgba(170, 170, 170, 0.5)',
      },
    },
  },
  plugins: [],
};