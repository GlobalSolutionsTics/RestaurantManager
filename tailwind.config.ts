import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
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
        medium: "1.5rem",
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
        "blue-light": "#A2E3FF",
        aqua: "#4084A2",
        "danger-light": "#FD3F45",
        danger: "#A4181C",
        "danger-dark": "#701114",
        dark: "#292929",
        "waiting-light": "#FFFD70",
        waiting: "#EFEC00",
        "waiting-dark": "#C1BF15",
        "orange-light": "#FFD9A2",
        orange: "#FFA626",
        "orange-dark": "#D07B00",
        "steel-20": "#CFCFCF",
        "steel-70": "#6C6C6C",
      },
      fontFamily: {
        primary: ["'Alkatra'", "Arial", "sans-serif"],
        secondary: ["'Josefin Sans'", "Arial", "italic"],
      },
      content: {
        space: "' '",
      },
    },
  },
  plugins: [],
  important: true,
};
export default config;
