import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        body: "var(--background)",
        surface: "var(--surface)",
        ink: "var(--text)",
        "ink-soft": "var(--text-soft)",
        border: "var(--border)",
        sky: {
          DEFAULT: "#0284c7",
          dark: "#075985",
          light: "#38bdf8",
        },
        accent: "#0284c7",
        amber: "#f59e0b",
        lime: "#84cc16",
        violet: "#8b5cf6",
        mint: "#14b8a6",
        coral: "#f43f5e",
        pink: "#c026d3",
        cream: "#fef3c7",
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        brand: "28px",
        "brand-sm": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
