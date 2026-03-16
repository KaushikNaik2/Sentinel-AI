/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0e1a",
          secondary: "#0f1629",
          tertiary: "#1a2235",
          hover: "#1e2a42",
        },
        accent: {
          green: "#00ff88",
          cyan: "#00d4ff",
          purple: "#7c3aed",
          orange: "#ff6b35",
          red: "#ff3b5c",
        },
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          tertiary: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in",
      },
    },
  },
  plugins: [],
};
