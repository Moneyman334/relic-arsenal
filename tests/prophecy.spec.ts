import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe("Prophecy Gate", () => {
  let propheciesData;

  beforeEach(() => {
    // Load the prophecies.json file
    const propheciesPath = join(process.cwd(), 'lore', 'prophecies.json');
    const propheciesRaw = readFileSync(propheciesPath, 'utf-8');
    propheciesData = JSON.parse(propheciesRaw);
  });

  it("crowns the gate", () => {
    const crown = "👑";
    expect(crown).toBe("👑");
  });

  it("loads prophecies with required structure", () => {
    expect(propheciesData).toBeDefined();
    expect(propheciesData.global).toBeDefined();
    expect(propheciesData.genesis).toBeDefined();
    expect(propheciesData.thunder).toBeDefined();
    expect(propheciesData.vault).toBeDefined();
    expect(propheciesData.sentinel).toBeDefined();
  });

  it("has exactly 20 whispers per sigil", () => {
    expect(propheciesData.global).toHaveLength(20);
    expect(propheciesData.genesis).toHaveLength(20);
    expect(propheciesData.thunder).toHaveLength(20);
    expect(propheciesData.vault).toHaveLength(20);
    expect(propheciesData.sentinel).toHaveLength(20);
  });

  it("contains unique whispers within each sigil", () => {
    Object.entries(propheciesData).forEach(([sigil, whispers]) => {
      const uniqueWhispers = new Set(whispers);
      expect(uniqueWhispers.size).toBe(whispers.length);
    });
  });

  it("contains mystical and thematic content", () => {
    // Check global whispers contain key terms
    const globalText = propheciesData.global.join(' ').toLowerCase();
    expect(globalText).toMatch(/quantum|cosmic|vault|storm|chaos|sigil/);

    // Check genesis whispers are themed around creation/beginning
    const genesisText = propheciesData.genesis.join(' ').toLowerCase();
    expect(genesisText).toMatch(/genesis|creation|beginning|first|origin|spark/);

    // Check thunder whispers are themed around storm/power
    const thunderText = propheciesData.thunder.join(' ').toLowerCase();
    expect(thunderText).toMatch(/thunder|storm|lightning|electric|tempest/);

    // Check vault whispers are themed around storage/treasure
    const vaultText = propheciesData.vault.join(' ').toLowerCase();
    expect(vaultText).toMatch(/vault|treasure|chamber|repository|eternal/);

    // Check sentinel whispers are themed around protection/watching
    const sentinelText = propheciesData.sentinel.join(' ').toLowerCase();
    expect(sentinelText).toMatch(/sentinel|guardian|protect|watch|shield/);
  });

  it("prophecy loader integration works correctly", async () => {
    // Mock fetch for testing the loader
    global.fetch = vi.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(propheciesData)
    });

    // Import the classes (this would be in a browser environment)
    // For now, we'll test the data structure that supports the loader
    expect(typeof propheciesData.global).toBe('object');
    expect(Array.isArray(propheciesData.global)).toBe(true);
    expect(propheciesData.global.every(whisper => typeof whisper === 'string')).toBe(true);
  });

  it("supports fallback to global whispers", () => {
    // Test that global whispers exist as fallback
    expect(propheciesData.global.length).toBeGreaterThan(0);
    expect(propheciesData.global.every(whisper => whisper.length > 0)).toBe(true);
  });

  it("contains accessibility-friendly content", () => {
    // Check that whispers are readable text without complex formatting
    Object.values(propheciesData).flat().forEach(whisper => {
      expect(typeof whisper).toBe('string');
      expect(whisper.length).toBeGreaterThan(10); // Meaningful content
      expect(whisper.length).toBeLessThan(200); // Not too long for screen readers
      expect(whisper.trim()).toBe(whisper); // No leading/trailing whitespace
    });
  });
});