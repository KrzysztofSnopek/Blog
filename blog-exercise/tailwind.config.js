/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  theme: {
    extend: {
      backgroundImage: {
        "pattern-main": "url('./Styling/ink.jpg')",
      },
      boxShadow: {
        "inner-top-bottom":
          "inset 0 85px 60px -25px rgba(0, 0, 0, 1), inset 0 -85px 60px -25px rgba(0, 0, 0, 1)",
        heart:
          "0 10% 10% 10% rgba(200, 0, 0, 0.5), inset 0 -35px 35px -25px rgba(200, 0, 0, 0.5)",
      },
      dropShadow: {
        "4xl": "0 10px 15px rgba(147, 197, 253, 0.8)",
      },
      minHeight: {
        "1/5": "100px",
      },
      animation: {
        scrollToLeft: "scroll 90s linear infinite",
        fillNav: "fill 2s cubic-bezier(0.175, 0.885, 0.32, 1) forwards",
      },
      transitionProperty: {
        nav: "0.8s all linear",
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
        fill: {
          "0%": {
            width: "0%",
            height: "5px",
            left: "50%",
          },
          "50%": {
            width: "100%",
            height: "5px",
            left: "0",
          },
          "100%": {
            width: "100%",
            height: "100%",
            left: "0",
          },
        },
      },
      fontFamily: {
        body: ["Nunito"],
      },
      scale: {
        "-1": "-1",
      },
    },
  },
  plugins: [],
};
