/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          bg: "#0B0D12",
          surface: "#151922",
          surface2: "#1D2330",
          accent: "#B91C1C",
          "accent-hover": "#DC2626",
          text: "#F5F5F5",
          muted: "#9CA3AF",
          border: "#2B3240",
          success: "#16A34A",
          warning: "#D97706",
          crimson: "#991B1B",
          cctv: "#10B981"
        }
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        display: ["Cinzel", "serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scanline: "scanline 8s linear infinite"
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" }
        }
      }
    },
  },
  plugins: [],
}
