import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 18px 40px rgba(86, 208, 255, 0.2)"
      },
      colors: {
        brand: {
          50: "#eefbff",
          100: "#d7f6ff",
          200: "#b2edff",
          300: "#7fe0ff",
          400: "#56d0ff",
          500: "#32b0eb",
          600: "#248cc0",
          700: "#226f99",
          800: "#245d7d",
          900: "#224e68"
        }
      }
    }
  },
  plugins: []
};

export default config;
