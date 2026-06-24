import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        "ink-soft": "#5F6572",
        surface: "#F6FBFF",
        accent: "#12AEEA",
        sky: "#12AEEA",
        "sky-dark": "#0786B8",
        cyan: "#61D7F7",
        amber: "#FFB31A",
        lime: "#75D64B",
        violet: "#8B5CF6",
        mint: "#2DD4BF",
        coral: "#FF6D8E",
        pink: "#C12A91",
        cream: "#FFF4DD"
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      borderRadius: {
        brand: "28px",
        "brand-sm": "16px"
      },
      boxShadow: {
        glow: "none",
        card: "none",
        soft: "none"
      }
    }
  },
  plugins: []
};

export default config;
