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
        uniquifier: ["Playfair Display", "serif"],
        fadeIn: "fadeIn 1s ease-out forwards",
        fadeInSlow: "fadeIn 2s ease-out forwards",
        fadeUp: "fadeUp 1s ease-out forwards",
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

        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        rotate: 'rotate 4s linear infinite',
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
        slideScreen: "slideScreen 20s linear infinite",
        fadeIn: "fadeIn 1s ease-out forwards",
        fadeInSlow: "fadeIn 2s ease-out forwards",
        fadeUp: "fadeUp 1s ease-out forwards",
      },
    },
  },
  plugins: [ require('flowbite/plugin')],
}

