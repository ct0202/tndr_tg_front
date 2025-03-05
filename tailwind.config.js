/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx}", 
    "./src/components/**/*.{html,js,jsx,tsx}" // Исправленный путь
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#297bff", // Добавляем кастомный цвет с именем "primary"
        gray: '#7e6b6d'
      },
      backgroundColor: {
        primary: "#ed3144", // Добавляем кастомный цвет с именем "primary"

      },
      backgroundImage: {
        buttonGradient: "linear-gradient(123deg, #6aa3ff 0%, #3180ff 100%)",
      },
      boxShadow: {
        custom: "0 2px 2px 0 rgba(139, 146, 159, 0.12), 0 4px 2px 0 rgba(139, 146, 159, 0.07), 0 7px 3px 0 rgba(139, 146, 159, 0.02), inset 0 -5px 11px 0 #b51223, 0 1px 3px 0 rgba(131, 28, 39, 0.25)", // Ваше значение
      },

    },
  },
  plugins: [],
}
