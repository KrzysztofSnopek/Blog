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
        heart:
          "0 10% 10% 10% rgba(200, 0, 0, 0.5), inset 0 -35px 35px -25px rgba(200, 0, 0, 0.5)",
      },
      dropShadow: {
        "4xl": "0 20px 15px rgba(30, 64, 175, 0.8)",
      },
      minHeight: {
        "1/5": "100px",
      },
      animation: {
        scrollToLeft: "scroll 90s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(calc(-384px * 10))",
          },
        },
      },
      fontFamily: {
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
};
