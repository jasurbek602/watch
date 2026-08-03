/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111827",
        accent: "#C9A227", // soatlar uchun "oltin" urg'u rangi
      },
    },
  },
  plugins: [],
};
