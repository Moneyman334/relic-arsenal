import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      lines: 70,
      functions: 70,
      branches: 60,
      statements: 70,
    },
  },
});