/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        monoton: ["Monoton", "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
