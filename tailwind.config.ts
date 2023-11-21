import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        sm: "1rem",
      },
      height: {
        normal: "4rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        small: "0.75rem",
      },
      colors: {
        enabled: "#E9E9E9",
        "enabled-dark": "#D9D9D9",
        "enabled-light": "#F4F4F4",
        gray: "#A8A8A8",
        "success-light": "#1BC200",
        success: "#1EB706",
        "success-dark": "#106D01",
        "blue-dark": "#204278",
        blue: "#0B9CDA",
        aqua: "#4084A2",
        danger: "#A4181C",
        "danger-dark": "#701114",
      },
      fontFamily: {
        primary: ["'Jost'", "Arial", "sans-serif"],
        secondary: ["'Josefin Sans'", "Arial", "italic"],
      },
      content: {
        space: "' '",
      },
    },
  },
  plugins: [],
};
export default config;
