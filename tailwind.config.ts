import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"], // Add Raleway as a custom font
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        zoomInOut: {
          '0%, 100%': { transform: 'scale(1)' }, // Start and end at scale 100%
          '50%': { transform: 'scale(1.1)' },    // Scale to 110% at the midpoint
        },
      },
      animation: {
        'zoom-in-out': 'zoomInOut 1s infinite', // Infinite zoom in/out animation
      },
    
    },
  },
  plugins: [],
};
export default config;
