import type { Config } from "tailwindcss";

export default {
  content: { relative: true, files: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"] },
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#050505", 2: "#0D0D0D", 3: "#141414", 4: "#1B1B1B" },
        brand: { DEFAULT: "#0756C9", bright: "#168AFF", glow: "#7CC4FF", deep: "#03306F" },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem" },
      boxShadow: {
        glow: "0 0 0 1px rgba(22,138,255,.25), 0 12px 40px -12px rgba(22,138,255,.45)",
        card: "0 1px 0 0 rgba(255,255,255,.05) inset, 0 20px 50px -30px rgba(0,0,0,.9)",
      },
      keyframes: {
        shine: { "0%": { transform: "translateX(-120%) skewX(-20deg)" }, "100%": { transform: "translateX(220%) skewX(-20deg)" } },
        pulseRing: { "0%": { transform: "scale(.9)", opacity: ".7" }, "100%": { transform: "scale(1.6)", opacity: "0" } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
      },
      animation: {
        shine: "shine 1.1s ease forwards",
        pulseRing: "pulseRing 2.2s cubic-bezier(.2,.6,.3,1) infinite",
        scan: "scan 3.5s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
