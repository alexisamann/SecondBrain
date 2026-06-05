import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        mist: "#F6F4EF",
        paper: "#FFFDF8",
        sage: "#6E7F70",
        clay: "#B86F52"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
