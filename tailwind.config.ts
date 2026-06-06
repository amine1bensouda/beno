import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        beno: {
          navy: "#001F5B",
          blue: "#0072BC",
          cyan: "#00AEEF",
          purple: "#6A3093",
          lavender: "#9B6DFF",
          green: "#6BBF3E",
          "green-dark": "#4A9E2A",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "beno-gradient": "linear-gradient(135deg, #001F5B 0%, #0072BC 50%, #00AEEF 100%)",
        "beno-purple": "linear-gradient(135deg, #4A1A6B 0%, #6A3093 50%, #9B6DFF 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
