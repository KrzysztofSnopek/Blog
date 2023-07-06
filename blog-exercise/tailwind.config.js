/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  theme: {
    extend: {
      backgroundImage: {
        "pattern-main": "url('./Styling/mountains.jpg')",
      },
      boxShadow: {
        "inner-top-bottom":
          "inset 0 85px 60px -25px rgba(0, 0, 0, 1), inset 0 -85px 60px -25px rgba(0, 0, 0, 1)",
      },
      minHeight: {
        "1/5": "100px",
      },
    },
  },
  plugins: [],
};
