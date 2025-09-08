/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'main-background': '#fafafa',
        'button-color': '#0775BA',
      }
    },
  },
  plugins: [],
}
