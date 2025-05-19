import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
        mono: [
          "Source Code Pro",
          "Menlo",
          "Consolas",
          "Courier New",
          "monospace",
        ],
      },
      spacing: {
        18: "4.5rem",
        62: "15.5rem",
        240: "60rem",
      },
      screens: {
        xs: "375px",
        sm: "425px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1600px",
        "4xl": "1920px",
      },
      // Generate colors from https://uicolors.app/create is recommended.
      colors: {
        primary: colors.blue,
        secondary: colors.teal,
        tertiary: colors.violet,
        warn: colors.amber,
        error: colors.red,
        success: colors.emerald,
        kakao: "#FEE500",
      },
      outlineWidth: {
        3: "3px",
      },
      containers: {
        xs: "375px",
        sm: "425px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1600px",
        "4xl": "1920px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
