import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("smoke", () => {
  it("adds numbers", () => {
    expect(1 + 1).toBe(2);
  });

  describe("Configuration Validation", () => {
    it("should have valid package.json", () => {
      const packagePath = join(process.cwd(), "package.json");
      expect(existsSync(packagePath)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
      expect(packageJson.name).toBe("relic-arsenal");
      expect(packageJson.version).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.test).toBeDefined();
    });

    it("should have valid vitest configuration", () => {
      const vitestConfigPath = join(process.cwd(), "vitest.config.ts");
      expect(existsSync(vitestConfigPath)).toBe(true);
      
      const configContent = readFileSync(vitestConfigPath, "utf-8");
      expect(configContent).toContain("defineConfig");
      expect(configContent).toContain("coverage");
    });

    it("should have essential project files", () => {
      const essentialFiles = [
        "README.md",
        "CHANGELOG.md",
        ".gitignore",
        "package-lock.json"
      ];
      
      essentialFiles.forEach(file => {
        const filePath = join(process.cwd(), file);
        expect(existsSync(filePath)).toBe(true);
      });
    });

    it("should have tests directory structure", () => {
      const testsDir = join(process.cwd(), "tests");
      expect(existsSync(testsDir)).toBe(true);
      
      const testFiles = ["smoke.test.ts", "runtime.spec.ts", "prophecy.spec.ts"];
      testFiles.forEach(file => {
        const filePath = join(testsDir, file);
        expect(existsSync(filePath)).toBe(true);
      });
    });
  });

  describe("Entry Point Validation", () => {
    it("should handle missing main entry gracefully", () => {
      const packagePath = join(process.cwd(), "package.json");
      const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
      
      // Check if main entry exists, but don't fail if it doesn't (early stage project)
      if (packageJson.main) {
        expect(typeof packageJson.main).toBe("string");
      }
    });

    it("should validate test imports work", () => {
      // This test itself validates that vitest imports work
      expect(describe).toBeDefined();
      expect(it).toBeDefined();
      expect(expect).toBeDefined();
    });
  });
});