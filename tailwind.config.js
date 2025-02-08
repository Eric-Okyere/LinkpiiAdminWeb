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
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        slideScreen: {
          "0%": { transform: "translateX(100vw)" }, // Start off-screen to the right
          "100%": { transform: "translateX(-100vw)" }, // Move completely off-screen to the left
        },

      },
      animation: {
        rotate: 'rotate 4s linear infinite',
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
        slideScreen: "slideScreen 20s linear infinite",
      },
    },
  },
  plugins: [ require('flowbite/plugin')],
}

