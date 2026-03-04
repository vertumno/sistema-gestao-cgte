import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      colors: {
        // Legacy brand alias
        ifes: {
          green: "#059669",
          soft: "#F0FDF4"
        },
        // Design tokens — mapped from CSS vars
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)"
        },
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          contrast: "var(--primary-contrast)"
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)"
        },
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)"
        },
        warning: {
          DEFAULT: "var(--warning)",
          light: "var(--warning-light)"
        },
        danger: {
          DEFAULT: "var(--danger)",
          light: "var(--danger-light)"
        },
        info: {
          DEFAULT: "var(--info)",
          light: "var(--info-light)"
        }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)"
      }
    }
  },
  plugins: []
};

export default config;
