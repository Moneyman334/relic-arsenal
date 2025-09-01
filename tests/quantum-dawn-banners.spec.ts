import { describe, test, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

describe("Quantum Dawn VII Banner System", () => {
  const bannerBasePath = join(projectRoot, "assets", "banners", "quantum-dawn-vii");

  test("banner directory structure exists", () => {
    // Check main directories
    expect(existsSync(bannerBasePath)).toBe(true);
    expect(existsSync(join(bannerBasePath, "triptych"))).toBe(true);
    expect(existsSync(join(bannerBasePath, "social-media"))).toBe(true);
    expect(existsSync(join(bannerBasePath, "crops"))).toBe(true);
    
    // Check subdirectories
    expect(existsSync(join(bannerBasePath, "social-media", "twitter"))).toBe(true);
    expect(existsSync(join(bannerBasePath, "social-media", "instagram"))).toBe(true);
    expect(existsSync(join(bannerBasePath, "social-media", "linkedin"))).toBe(true);
    expect(existsSync(join(bannerBasePath, "crops", "stories"))).toBe(true);
  });

  test("required banner files exist", () => {
    const requiredFiles = [
      "triptych/quantum-dawn-vii-triptych.svg",
      "social-media/twitter/quantum-dawn-vii-twitter.svg", 
      "social-media/instagram/quantum-dawn-vii-instagram.svg",
      "social-media/linkedin/quantum-dawn-vii-linkedin.svg",
      "crops/stories/quantum-dawn-vii-stories.svg",
      "BANNER_METADATA.md"
    ];

    requiredFiles.forEach(file => {
      const filePath = join(bannerBasePath, file);
      expect(existsSync(filePath)).toBe(true);
      
      // Check file is not empty
      const stats = statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  test("SVG banners contain required elements", () => {
    const svgFiles = [
      "triptych/quantum-dawn-vii-triptych.svg",
      "social-media/twitter/quantum-dawn-vii-twitter.svg",
      "social-media/instagram/quantum-dawn-vii-instagram.svg",
      "social-media/linkedin/quantum-dawn-vii-linkedin.svg", 
      "crops/stories/quantum-dawn-vii-stories.svg"
    ];

    svgFiles.forEach(file => {
      const filePath = join(bannerBasePath, file);
      const content = readFileSync(filePath, "utf-8");
      
      // Check SVG structure
      expect(content).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(content).toMatch(/<svg[^>]*>/);
      expect(content).toMatch(/<\/svg>$/);
      
      // Check for relic references (emojis or text)
      const hasObsidianCrown = content.includes("🌑👑") || content.includes("OBSIDIAN CROWN");
      const hasPhoenixSigil = content.includes("🔥🕊️") || content.includes("PHOENIX SIGIL");
      const hasAstralKey = content.includes("🌌🔑") || content.includes("ASTRAL KEY");
      
      expect(hasObsidianCrown).toBe(true);
      expect(hasPhoenixSigil).toBe(true); 
      expect(hasAstralKey).toBe(true);
      
      // Check for gradient definitions
      expect(content).toMatch(/<defs>/);
      expect(content).toMatch(/gradient/i);
    });
  });

  test("banner metadata contains required content", () => {
    const metadataPath = join(bannerBasePath, "BANNER_METADATA.md");
    const content = readFileSync(metadataPath, "utf-8");
    
    // Check for required sections
    expect(content).toMatch(/# Quantum Dawn VII/);
    expect(content).toMatch(/## Banner Specifications/);
    expect(content).toMatch(/## Alt-Text Descriptions/);
    expect(content).toMatch(/## Ceremonial Captions/);
    
    // Check for ceremonial proclamation
    expect(content).toMatch(/Crown forged in shadow, Sigil reborn in flame, Key carved from infinity/);
    
    // Check for all three relics referenced
    expect(content).toMatch(/Obsidian Crown/);
    expect(content).toMatch(/Phoenix Sigil/);
    expect(content).toMatch(/Astral Key/);
    
    // Check for platform-specific sections
    expect(content).toMatch(/Twitter/);
    expect(content).toMatch(/Instagram/);
    expect(content).toMatch(/LinkedIn/);
  });

  test("release scroll exists with proper content", () => {
    const scrollPath = join(projectRoot, "release-scrolls", "v1.3.0.md");
    expect(existsSync(scrollPath)).toBe(true);
    
    const content = readFileSync(scrollPath, "utf-8");
    
    // Check release scroll structure
    expect(content).toMatch(/# Release Scroll v1\.3\.0/);
    expect(content).toMatch(/Quantum Dawn VII/);
    expect(content).toMatch(/Trinity Eternal/);
    
    // Check for banner references
    expect(content).toMatch(/Triptych Banner/);
    expect(content).toMatch(/Social Media/);
    
    // Check for ceremonial content
    expect(content).toMatch(/Crown forged in shadow/);
    expect(content).toMatch(/Sigil reborn in flame/);
    expect(content).toMatch(/Key carved from infinity/);
  });

  test("codex integration is complete", () => {
    const codexPath = join(projectRoot, "codex.md");
    const content = readFileSync(codexPath, "utf-8");
    
    // Check for banner integration
    expect(content).toMatch(/!\[Quantum Dawn VII Triptych\]/);
    expect(content).toMatch(/assets\/banners\/quantum-dawn-vii\/triptych/);
    
    // Check for enhanced relic descriptions
    expect(content).toMatch(/Visual Essence/);
    expect(content).toMatch(/Ceremonial Invocation/);
    
    // Check for trinity eternal section
    expect(content).toMatch(/Trinity Eternal/);
    expect(content).toMatch(/Visual Manifestations/);
  });

  test("README gallery section is updated", () => {
    const readmePath = join(projectRoot, "README.md");
    const content = readFileSync(readmePath, "utf-8");
    
    // Check gallery section exists and is populated
    expect(content).toMatch(/## 🖼️ Gallery of Relics/);
    expect(content).toMatch(/Quantum Dawn VII - Trinity Eternal/);
    expect(content).toMatch(/Master Triptych/);
    expect(content).toMatch(/Social Media Manifestations/);
    
    // Check for banner links
    expect(content).toMatch(/assets\/banners\/quantum-dawn-vii/);
    
    // Should no longer say "Coming Soon"
    expect(content).not.toMatch(/Gallery of Relics \(Coming Soon\)/);
  });
});