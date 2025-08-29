import { describe, it, expect } from "vitest";
import { __filename, __dirname } from "../utils/esm-paths.js";

describe("ESM Path Helpers", () => {
  it("should provide __filename equivalent", () => {
    expect(__filename).toBeDefined();
    expect(typeof __filename).toBe("string");
    expect(__filename).toMatch(/esm-paths\.js$/);
  });

  it("should provide __dirname equivalent", () => {
    expect(__dirname).toBeDefined();
    expect(typeof __dirname).toBe("string");
    expect(__dirname).toMatch(/utils$/);
  });
});