/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1.5s ease-in-out infinite'
      },
      keyframes: {
        blink: {
          '0%': { opacity: 0 },
          '10%': { opacity: 0.2 },
          '20%': { opacity: 0.4 },
          '30%': { opacity: 0.6 },
          '40%': { opacity: 1 },
          '50%': { opacity: 1 },
          '60%': { opacity: 1 },
          '70%': { opacity: 0.6 },
          '80%': { opacity: 0.3 },
          '90%': { opacity: 0 },
          '100%': { opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
