import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primaire: {
          50: "#f5f7ff",
          100: "#e6ecff",
          200: "#c5d2ff",
          300: "#9aaeFF",
          400: "#6e80ff",
          500: "#4a5aff",
          600: "#3844db",
          700: "#2c34aa",
          800: "#22287d",
          900: "#1d2261"
        }
      }
    }
  },
  plugins: []
};

export default config;
