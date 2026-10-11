import { defineConfig } from "eslint/config";
import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["playwright-report/", "test-results/", "blob-report/"],
  },
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ["tests/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
  },
]);
