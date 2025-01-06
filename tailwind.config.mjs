/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

const tailwindConfig = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // This is from nextui
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: {
        DEFAULT: "#ffffff",
      },
      purple: {
        lightest: "#892EF7",
        light: "#5330b3",
        DEFAULT: "#5500a2",
        dark: "#1d1b53",
        indigo: "#271ac2",
        blue: "#0800ff",
        black: "#02000b",
      },
      orange: {
        dark: "#6a3c00",
      },
      pink: {
        light: "#ff7ce5",
        DEFAULT: "#da0b5e",
        dark: "#ff16d1",
      },
      gray: {
        darkest: "#191919",
        darker: "#2b2b2b",
        dark: "#3c3c3c",
        DEFAULT: "#a8adb0",
        light: "#e0e6ed",
        lightest: "#f9fafc",
      },
      blue: {
        darkest: "#1f2d3d",
        dark: "#83d7a4",
        DEFAULT: "#38b8df",
        light: "#6FD6F5",
        lightest: "#f9fafc",
      },
      brown: {
        DEFAULT: "#091211",
      },
      black: {
        DEFAULT: "#000000",
        dark: "#000000",
      },
      green: {
        darkest: "#091211",
        dark: "#98CB76",
        DEFAULT: "#98CB76",
        light: "#D3FF76",
        lightest: "#f9fafc",
      },
      Bubbler_One: {
        darkest: "#091211",
        dark: "#98CB76",
        DEFAULT: "#003AFF",
        light: "#003AFF",
        lightest: "#f9fafc",
      },
      red: {
        darkest: "#091211",
        dark: "#98CB76",
        DEFAULT: "#b5281f",
        light: "#003AFF",
        lightest: "#f9fafc",
      },
    },
    extend: {
      colors: {
        default: {
          DEFAULT: "#3c3c3c",
          50: "#294273",
          100: "#080908",//"#091211",
          200: "#3c3c3c",
          300: "#143E25",
          400: "#3f8a7c",
          600: "#98CB76",
          foreground: "#98CB76",
        },
        foreground: {
          DEFAULT: "#98CB76",
          500: "#97c3a9",
        },
        primary: "#83d7a4",
        secondary: "#98CB76",
        content1: "#11181c",
        content2: "#36493c",
        // content3: "#2b3439",
      },
      screens: {
        mid: "1040px",
      },
      spacing: {
        100: "100px", //I added this
      },
      scale: {
        102: "1.02",
        104: "1.04",
        // 70: "0.7",
        // 60: "0.6",
      },
      "@media (min-width: 640px)": {
        ".sm\\:-translate-x-full": {
          transform: "translateX(-100%)",
        },
      },
      transitionProperty: {
        "max-size": "max-width, max-height",
      }, // I added this

      animation: {
        circle_pulse: "circle_pulse_animation 2s infinite",
      }, // I added this
      keyframes: {
        circle_pulse_animation: {
          "0%": { transform: "scale(0.95, 0.95)" },
          "25%": { transform: "scale(0.95, 0.95)" },
          "50%": { transform: "scale(1.2, 1.2)" },
          "100%": { transform: "scale(0.95, 0.95)" },
        }, 
      }, // I added this
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          // ...
        },
        dark: {
          // ...
        },
        // ... custom themes
      },
      // addCommonColors: true,
    }), // from nextui
  ],
};

export default tailwindConfig;