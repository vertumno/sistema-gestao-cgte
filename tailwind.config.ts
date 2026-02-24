import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ifes: {
          green: "#1a5632",
          soft: "#f0faf4"
        }
      }
    }
  },
  plugins: []
};

export default config;
