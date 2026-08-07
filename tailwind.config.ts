import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tailwind is used for layout, colors are handled via CSS variables
        bg: "var(--bg)",
        "bg-pulse": "var(--bg-pulse)",
        surface: "var(--surface)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
      },
      fontFamily: {
        mono: ["var(--font-dm-mono)"],
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
