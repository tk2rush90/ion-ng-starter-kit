import colors from "tailwindcss/colors";

const spacingToRem = (value) => {
  return value * 0.25;
};

const spacings = () => {
  const step = 0.5;
  const max = step * 400;

  const spacings = {};

  for (let i = 0.5; i < max; i += step) {
    spacings[i] = spacingToRem(i) + "rem";
  }

  return spacings;
};

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
      brightness: {
        80: 0.8,
        110: 1.1,
        120: 1.2,
      },
      spacing: spacings(),
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
        // primary: colors.blue,
        // secondary: colors.teal,
        // tertiary: colors.violet,
        // warn: colors.amber,
        // error: colors.red,
        // success: colors.emerald,
        kakao: "#FEE500",
        "dark-background": colors.slate[800],
        "dark-text": colors.white,
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
  safelist: [
    {
      pattern:
        /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-((100|300|400|500|900)(\/(5|10|15|20|30))?)/,
      variants: [
        "hover",
        "active",
        "focus",
        "dark:hover",
        "dark:active",
        "dark",
      ],
    },
    {
      pattern: /bg-(black|white)(\/(5|10|15|20|30))?/,
      variants: ["hover", "active", "focus", "dark"],
    },
    {
      pattern: /text-(black|white|current)(\/(5|10|15|20|30))?/,
    },
    {
      pattern:
        /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(300|500|900)(\/(30))?/,
      variants: ["hover", "focus", "has-[:focus]", "dark:focus"],
    },
    {
      pattern:
        /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-500/,
    },
  ],
};
