import type { Config } from "tailwindcss";
import * as tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      background: {
        DEFAULT: "#08090a",
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
      },
      destructive: {
        DEFAULT: "#91170c",
        foreground: "#eaa09c",
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
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
      xl: "1.25rem",
      full: "1000rem",
    },
    animation: {
      slide: "slide 2.5s linear infinite",
      spin: "spin 1s linear infinite",
    },
    keyframes: {
      slide: {
        "0%": { transform: "translateY(100%)", opacity: "0.1" },
        "15%": { transform: "translateY(0)", opacity: "1" },
        "30%": { transform: "translateY(0)", opacity: "1" },
        "45%": { transform: "translateY(-100%)", opacity: "0.1" },
        "100%": { transform: "translateY(-100%)", opacity: "0" },
      },
      spin: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
