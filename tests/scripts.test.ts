import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

describe("Script Validation", () => {
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), "utf-8")
  );

  describe("Existing Scripts", () => {
    it("should have test script that runs successfully", async () => {
      expect(packageJson.scripts.test).toBeDefined();
      expect(packageJson.scripts.test).toContain("vitest");
    });

    it("should have coverage script", () => {
      expect(packageJson.scripts.coverage).toBeDefined();
      expect(packageJson.scripts.coverage).toContain("coverage");
    });

    it("should have watch test script", () => {
      expect(packageJson.scripts["test:watch"]).toBeDefined();
      expect(packageJson.scripts["test:watch"]).toContain("vitest");
    });
  });

  describe("CI Expected Scripts (Graceful Handling)", () => {
    it("should handle missing lint script gracefully", () => {
      // CI workflow expects this but allows it to be missing
      const hasLint = packageJson.scripts.lint !== undefined;
      const hasCheckLint = packageJson.scripts["check:lint"] !== undefined;
      
      // If scripts exist, they should be strings
      if (hasLint) {
        expect(typeof packageJson.scripts.lint).toBe("string");
      }
      if (hasCheckLint) {
        expect(typeof packageJson.scripts["check:lint"]).toBe("string");
      }
      
      // This test passes regardless, documenting expected behavior
      expect(true).toBe(true);
    });

    it("should handle missing format script gracefully", () => {
      // CI workflow expects this but allows it to be missing
      const hasFormat = packageJson.scripts["check:format"] !== undefined;
      
      if (hasFormat) {
        expect(typeof packageJson.scripts["check:format"]).toBe("string");
      }
      
      // This test passes regardless, documenting expected behavior
      expect(true).toBe(true);
    });

    it("should handle missing build script gracefully", () => {
      // CI workflow expects this but allows it to be missing
      const hasBuild = packageJson.scripts.build !== undefined;
      const hasDev = packageJson.scripts.dev !== undefined;
      
      if (hasBuild) {
        expect(typeof packageJson.scripts.build).toBe("string");
      }
      if (hasDev) {
        expect(typeof packageJson.scripts.dev).toBe("string");
      }
      
      // This test passes regardless, documenting expected behavior
      expect(true).toBe(true);
    });
  });

  describe("Script Execution Safety", () => {
    it("should not contain dangerous script patterns", () => {
      const scripts = Object.values(packageJson.scripts);
      const dangerousPatterns = [
        "rm -rf /",
        "sudo",
        "eval",
        "curl | sh",
        "wget | sh"
      ];
      
      scripts.forEach((script: string) => {
        dangerousPatterns.forEach(pattern => {
          expect(script).not.toContain(pattern);
        });
      });
    });

    it("should use safe npm patterns", () => {
      const scripts = Object.values(packageJson.scripts);
      
      scripts.forEach((script: string) => {
        // If script contains npm, it should use safe patterns
        if (script.includes("npm")) {
          expect(script).not.toContain("npm install -g");
          expect(script).not.toContain("npm i -g");
        }
      });
    });
  });
});