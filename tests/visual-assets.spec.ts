import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

describe("ESM Hardening Visual Assets", () => {
  const assetsDir = join(process.cwd(), "assets", "visuals", "esm-hardening");
  
  it("should have the assets directory structure", () => {
    expect(existsSync(assetsDir)).toBe(true);
  });

  it("should contain all required SVG mockup files", () => {
    const requiredSvgFiles = [
      "vault-door_poster.svg",
      "scroll_story.svg", 
      "sigil_feed.svg"
    ];
    
    const files = readdirSync(assetsDir);
    
    requiredSvgFiles.forEach(file => {
      expect(files).toContain(file);
    });
  });

  it("should contain placeholder files with correct naming convention", () => {
    const requiredPlaceholders = [
      "vault-door_poster.png.placeholder",
      "vault-door_poster.webp.placeholder",
      "scroll_story.png.placeholder",
      "scroll_story.webp.placeholder", 
      "sigil_feed.png.placeholder",
      "sigil_feed.webp.placeholder"
    ];
    
    const files = readdirSync(assetsDir);
    
    requiredPlaceholders.forEach(file => {
      expect(files).toContain(file);
    });
  });

  it("should contain documentation files", () => {
    const requiredDocs = [
      "README.md",
      "VISUAL_SPECIFICATIONS.md"
    ];
    
    const files = readdirSync(assetsDir);
    
    requiredDocs.forEach(file => {
      expect(files).toContain(file);
    });
  });

  it("should contain the conversion script", () => {
    const files = readdirSync(assetsDir);
    expect(files).toContain("convert-mockups.sh");
  });
});