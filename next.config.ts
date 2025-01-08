import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['src'],
    rules: {
      semi: ['error', 'always'],
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
};

export default nextConfig;