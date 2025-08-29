import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      lines: 60,
      functions: 60,
      branches: 50,
      statements: 60,
    },
  },
});