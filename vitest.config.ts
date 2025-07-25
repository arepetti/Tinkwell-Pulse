/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    include: ["./src/**/*.test.{ts,tsx}"],
    exclude: ["**/*.spec.{ts,tsx}"],
  },
});