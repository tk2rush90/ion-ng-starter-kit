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

const hexToRgb = (hex) => {
  let r = 0,
    g = 0,
    b = 0;

  // 3자리 또는 6자리 헥스 코드 처리
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  return `${r} ${g} ${b}`;
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
        foreground: "rgb(var(--ion-text-color-rgb) / <alpha-value>)",
        background: "rgb(var(--ion-background-color-rgb) / <alpha-value>)",
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
    // TailwindCSS 테마 관련 값 CSS 변수로 내보내는 플러그인
    ({ addBase, theme }) => {
      addBase({
        ":root": {
          "--tw-white": colors.white,
          "--tw-black": colors.black,
          "--tw-slate-800": colors.slate["800"],
          "--tw-white-rgb": hexToRgb(colors.white),
          "--tw-black-rgb": hexToRgb(colors.black),
          "--tw-slate-800-rgb": hexToRgb(colors.slate["800"]),
        },
      });
    },
  ],
  safelist: [
    {
      pattern:
        /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-((100|300|400|500|600|900)(\/(5|10|15|20|30))?)/,
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
        /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(300|500)/,
      variants: ["dark"],
    },
  ],
};
