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
      "**/context/**",
      "**/docs/**",
    ],
  },
  ...nextVitals.map((config) => ({
    ...config,
    files: [
      "app/**/*.{js,mjs,cjs,ts,tsx}",
      "components/**/*.{js,mjs,cjs,ts,tsx}",
      "lib/**/*.{js,mjs,cjs,ts,tsx}",
      "db/**/*.{js,mjs,cjs,ts,tsx}",
    ],
  })),
  ...nextTs.map((config) => ({
    ...config,
    files: [
      "app/**/*.{js,mjs,cjs,ts,tsx}",
      "components/**/*.{js,mjs,cjs,ts,tsx}",
      "lib/**/*.{js,mjs,cjs,ts,tsx}",
      "db/**/*.{js,mjs,cjs,ts,tsx}",
    ],
  })),
];

export default eslintConfig;
