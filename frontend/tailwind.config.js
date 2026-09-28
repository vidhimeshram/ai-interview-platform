/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: '#FAF9F6',
        ink: '#1A1A1E',
        teal: {
          DEFAULT: '#2F615C',
          dark: '#234943',
          light: '#4B7D77'
        },
        amber: '#C7862B',
        line: '#E4E1D8'
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
