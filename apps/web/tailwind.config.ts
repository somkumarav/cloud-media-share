import type { Config } from "tailwindcss";
import * as tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",
      background: {
        DEFAULT: "#0e1011",
        secondary: "#28282c",
      },
      foreground: {
        DEFAULT: "#e6e6e6",
      },
      accent: {
        DEFAULT: "#173f35",
        foreground: "#68cc55",
        background: "#172217",
      },
      muted: {
        DEFAULT: "#7A7A7A",
        foreground: "#eaa09c",
        background: "#222222",
      },
      destructive: {
        DEFAULT: "#c52828",
        background: "#c5282840",
      },
      caution: {
        DEFAULT: "#f5a623",
        background: "#f5a62340",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },

      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      chart: {
        "1": "hsl(var(--chart-1))",
        "2": "hsl(var(--chart-2))",
        "3": "hsl(var(--chart-3))",
        "4": "hsl(var(--chart-4))",
        "5": "hsl(var(--chart-5))",
      },
    },
    space: {
      "1": ".25rem",
      "2": ".5rem",
      "3": "1rem",
      "4": "1.25rem",
      "5": "1.5rem",
    },
    borderRadius: {
      none: "0rem",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
      xl: "1.25rem",
      full: "1000rem",
    },
    animation: {
      slide: "slide 6s linear infinite",
      spin: "spin 1s linear infinite",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      "fade-in": "fade-in 3000ms ease forwards",
      "top-fade-in": "top-fade-in 1000ms ease forwards",
    },
    keyframes: {
      slide: {
        "0%": { transform: "translateY(115%)", opacity: "0" },
        "15%": { transform: "translateY(0)", opacity: "1" },
        "30%": { transform: "translateY(0)", opacity: "1" },
        "38%": { transform: "translateY(-115%)", opacity: "1" },
        "100%": { transform: "translateY(-115%)", opacity: "0" },
      },
      "top-fade-in": {
        from: { opacity: "0", transform: "translateY(-10px)" },
        to: { opacity: "1", transform: "none" },
      },
      "fade-in": {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
      spin: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
      pulse: {
        "50%": { opacity: "0.5" },
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
