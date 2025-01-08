import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript"],
    rules: {
      semi: ["error", "always"],
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "@next/next/no-html-link-for-pages": "off",

    },
  }),
];

export default eslintConfig;
