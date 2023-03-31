/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      backgroundImage: {
        "pattern-signUp":
          'url("./src/TailwindImages/scenic-sunrise-mountains.jpg")',
      },
    },
  },
  plugins: [],
};
