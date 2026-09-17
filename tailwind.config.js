/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Redesign typography: Manrope (body) + Outfit (display/headings),
        // self-hosted via @fontsource - see index.css imports and main.jsx.
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Outfit", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        // Kept for any screen still referencing the old font utility.
        uniquifier: ["Playfair Display", "serif"],
      },
      colors: {
        // Brand - primary gold. brand-600 is the main action color:
        // buttons, active nav states, links, prices.
        brand: {
          50: "#fdf7e9",
          100: "#fbebc2",
          200: "#f6d787",
          300: "#f0bd4d",
          400: "#e8a324",
          500: "#cf8814",
          600: "#ab6c0f",
          700: "#855312",
          800: "#6c4315",
          900: "#593815",
          950: "#331e09",
        },
        // Accent - a second, warmer gold for things that should pop against
        // the primary gold (the floating post FAB, an active favorite heart).
        accent: {
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fde08a",
          300: "#fbc94d",
          400: "#f7b022",
          500: "#ed9810",
          600: "#cc7909",
          700: "#a35b0c",
          800: "#854912",
          900: "#6e3d13",
        },
        // Ink - true neutral black/gray (no blue cast), pairs with gold for
        // the gold-and-black look. ink-50 is the page background, ink-950
        // is used for full-bleed dark surfaces - never brand-950 for that.
        ink: {
          50: "#f7f7f6",
          100: "#eeeeec",
          200: "#dcdcd8",
          300: "#bdbdb7",
          400: "#96968e",
          500: "#75756e",
          600: "#5c5c56",
          700: "#474742",
          800: "#2f2f2b",
          900: "#1a1a17",
          950: "#0c0c0a",
        },
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(12, 12, 10, 0.10), 0 1px 2px rgba(12, 12, 10, 0.05)",
        card: "0 12px 28px -10px rgba(12, 12, 10, 0.18), 0 2px 6px -2px rgba(12, 12, 10, 0.07)",
        "card-hover": "0 22px 44px -14px rgba(12, 12, 10, 0.28), 0 4px 10px -2px rgba(12, 12, 10, 0.12)",
        glow: "0 0 0 1px rgba(232, 163, 36, 0.18), 0 10px 28px -8px rgba(232, 163, 36, 0.42)",
      },
      borderRadius: {
        xl2: "1.5rem",
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

