import type { Config } from "tailwindcss";

// Helper function to create an object with px values
const createPxValues = (count: number) => {
  return Object.fromEntries(
    Array.from({ length: count + 1 }, (_, i) => [`${i}`, `${i}px`])
  );
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderWidth: createPxValues(10),
      fontSize: createPxValues(100),
      lineHeight: createPxValues(100),
      minWidth: createPxValues(200),
      minHeight: createPxValues(200),
      maxWidth: createPxValues(2000),
      maxHeight: createPxValues(2000),
      spacing: createPxValues(2000),
      width: createPxValues(2000), // 이 부분 추가
      height: createPxValues(2000), // 이 부분 추가
      borderRadius: createPxValues(200),
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        main: "var(--main)",
        "main-10": "var(--main-10)",
        black: "var(--black)",
        white: "var(--white)",
        "grayscale-100": "var(--grayscale-100)",
        "grayscale-300": "var(--grayscale-300)",
        "grayscale-500": "var(--grayscale-500)",
        "grayscale-800": "var(--grayscale-800)",
      },
      screens: {
        "max-sm": { max: "639px" }, // `sm` 이하의 화면
        "max-md": { max: "767px" }, // `md` 이하의 화면
        "max-lg": { max: "1023px" }, // `lg` 이하의 화면
        "max-xl": { max: "1279px" }, // `xl` 이하의 화면
      },
    },
  },
  plugins: [],
};

export default config;
