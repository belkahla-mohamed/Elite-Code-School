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
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
          light: "#60a5fa",
        },
        accent: "#2563eb",
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
        brand: "20px",
        "brand-sm": "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.05), 0 4px 16px -4px rgb(15 23 42 / 0.08)",
        "card-hover": "0 2px 4px rgb(15 23 42 / 0.06), 0 12px 28px -6px rgb(15 23 42 / 0.14)",
        brand: "0 8px 20px -6px rgb(37 99 235 / 0.35)",
      },
    },
  },
  safelist: [
    "from-lime", "to-emerald",
    "from-sky", "to-cyan",
    "from-amber", "to-orange",
    "from-violet", "to-purple",
  ],
  plugins: [],
};

export default config;
