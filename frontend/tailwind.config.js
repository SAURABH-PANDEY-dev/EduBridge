/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Chai Theme Colors (VS Code Inspired)
        chai: {
          bg: "#1e1e1e",       // Main Background (Dark Grey)
          card: "#252526",     // Card/Navbar Background (Lighter Grey)
          text: "#d4d4d4",     // Main Text (Off-White)
          accent: "#e5e1c8",   // Chai/Yellow Tint (Highlight)
          blue: "#007acc",     // VS Code Blue
          border: "#333333",   // Subtle Border
        }
      }
    },
  },
  plugins: [],
}