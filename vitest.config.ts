import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      lines: 70, // Increased from 60% toward 80% goal
      functions: 70, // Increased from 60% toward 80% goal
      branches: 60, // Increased from 50% toward 80% goal
      statements: 70, // Increased from 60% toward 80% goal
    },
  },
});