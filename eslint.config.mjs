import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/.drizzle/**",
      "**/node_modules/**",
      "**/next-env.d.ts",
      "**/.agents/**",
      "**/context/**/*.md",
      "**/docs/**",
    ],
  },
  ...nextVitals.map((config) => ({
    ...config,
    files: [
      "app/**/*.{js,mjs,cjs,jsx,ts,tsx}",
      "components/**/*.{js,mjs,cjs,jsx,ts,tsx}",
      "lib/**/*.{js,mjs,cjs,jsx,ts,tsx}",
      "db/**/*.{js,mjs,cjs,jsx,ts,tsx}",
      "constants/**/*.{js,mjs,cjs,jsx,ts,tsx}",
      "context/**/*.{js,mjs,cjs,jsx,ts,tsx}",
    ],
  })),
  ...nextTs.map((config) => ({
    ...config,
    files: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "db/**/*.{ts,tsx}",
      "constants/**/*.{ts,tsx}",
      "context/**/*.{ts,tsx}",
    ],
  })),
];

export default eslintConfig;
