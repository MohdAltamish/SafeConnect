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
        // Design.md §2 — Color Palette
        primary: {
          DEFAULT: "#6D2E46",
          dark: "#4A1F30",
        },
        secondary: "#2F3C7E",
        surface: {
          DEFAULT: "#FFFFFF",
          tint: "#FBF5F7",
        },
        border: "#E4CBD3",
        "text-primary": "#2B2320",
        "text-muted": "#6E6265",
        success: "#2E7D5B",
        warning: "#B8860B",
        neutral: "#6E6265",
        danger: "#A23B3B",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        form: "640px",
        dashboard: "1280px",
      },
      minHeight: {
        tap: "44px",
      },
    },
  },
  plugins: [],
};
export default config;
