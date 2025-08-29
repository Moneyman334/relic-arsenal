import { describe, it, expect } from "vitest";
import { __dirname, __filename } from "../utils/esm-paths.js";
import { basename } from "node:path";

describe("esm-paths helpers", () => {
  it("exposes __filename and __dirname", () => {
    expect(__filename).toMatch(/esm-paths\.(js|ts)$/);
    expect(basename(__dirname)).toBe("utils");
  });
});