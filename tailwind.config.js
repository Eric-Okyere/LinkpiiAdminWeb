/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily:{
        uniquifier: ["Playfair Display", "serif"]
      }
    },
  },
  plugins: [ require('flowbite/plugin')],
}

