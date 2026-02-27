/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 5s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      fontFamily: {
        // Sans (UI / Web App)
        inter: ['Inter', 'sans-serif'],
        open: ['Open Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],

        // Serif (Blog / Article)
        merri: ['Merriweather', 'serif'],

        // Mono (Code)
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
