import { describe, it, expect, beforeEach } from 'vitest';
import { ProphecyEngine, prophecyEngine, getRandomProphecy, getRandomRelicWhisper } from '../utils/prophecy-engine.js';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

describe("Prophecy Engine", () => {
  let testLoreFile: string;
  let testEngine: ProphecyEngine;
  
  beforeEach(() => {
    // Create a temporary test lore file
    testLoreFile = join(process.cwd(), 'test-prophecies.json');
    
    const testLoreData = {
      meta: {
        version: "1.0.0-test",
        description: "Test prophecy data",
        lastUpdated: "2024-09-10T10:00:00Z"
      },
      categories: {
        test: {
          name: "Test Prophecies",
          description: "Test category for prophecies"
        }
      },
      prophecies: {
        test: [
          {
            id: "test-prophecy-1",
            text: "This is a test prophecy",
            category: "test"
          },
          {
            id: "test-prophecy-2", 
            text: "Another test prophecy",
            category: "test"
          }
        ]
      },
      placeholders: [
        {
          id: "test-placeholder-1",
          text: "Test placeholder prophecy",
          category: "placeholder"
        }
      ]
    };
    
    writeFileSync(testLoreFile, JSON.stringify(testLoreData, null, 2));
    testEngine = new ProphecyEngine(testLoreFile);
  });

  afterEach(() => {
    // Clean up test file
    if (existsSync(testLoreFile)) {
      unlinkSync(testLoreFile);
    }
  });

  describe("Initialization", () => {
    it("initializes successfully with valid lore file", () => {
      expect(testEngine.isInitialized).toBe(true);
      expect(testEngine.loreData).not.toBeNull();
    });

    it("handles missing lore file gracefully", () => {
      const nonExistentFile = join(process.cwd(), 'non-existent.json');
      const fallbackEngine = new ProphecyEngine(nonExistentFile);
      
      expect(fallbackEngine.isInitialized).toBe(true);
      expect(fallbackEngine.loreData).toBeNull();
    });

    it("handles invalid JSON gracefully", () => {
      const invalidJsonFile = join(process.cwd(), 'invalid.json');
      writeFileSync(invalidJsonFile, '{invalid json}');
      
      const invalidEngine = new ProphecyEngine(invalidJsonFile);
      expect(invalidEngine.isInitialized).toBe(true);
      expect(invalidEngine.loreData).toBeNull();
      
      unlinkSync(invalidJsonFile);
    });
  });

  describe("Category Management", () => {
    it("returns available categories", () => {
      const categories = testEngine.getCategories();
      expect(categories).toContain('test');
      expect(categories.length).toBeGreaterThan(0);
    });

    it("returns empty array when no categories available", () => {
      const emptyEngine = new ProphecyEngine('non-existent.json');
      const categories = emptyEngine.getCategories();
      expect(categories).toEqual([]);
    });

    it("gets prophecies by category", () => {
      const prophecies = testEngine.getPropheciesByCategory('test');
      expect(prophecies).toHaveLength(2);
      expect(prophecies[0].id).toBe('test-prophecy-1');
      expect(prophecies[1].id).toBe('test-prophecy-2');
    });

    it("returns empty array for non-existent category", () => {
      const prophecies = testEngine.getPropheciesByCategory('nonexistent');
      expect(prophecies).toEqual([]);
    });
  });

  describe("Random Prophecy Selection", () => {
    it("returns random prophecy", () => {
      const prophecy = testEngine.getRandomProphecy();
      expect(prophecy).toBeDefined();
      expect(prophecy.text).toBeDefined();
      expect(prophecy.id).toBeDefined();
    });

    it("returns random prophecy by category", () => {
      const prophecy = testEngine.getRandomProphecyByCategory('test');
      expect(prophecy).toBeDefined();
      expect(prophecy.category).toBe('test');
      expect(['test-prophecy-1', 'test-prophecy-2']).toContain(prophecy.id);
    });

    it("returns placeholder when category is empty", () => {
      const prophecy = testEngine.getRandomProphecyByCategory('empty');
      expect(prophecy).toBeDefined();
      expect(prophecy.isPlaceholder).toBe(true);
    });
  });

  describe("Prophecy Lookup", () => {
    it("finds prophecy by ID", () => {
      const prophecy = testEngine.getProphecyById('test-prophecy-1');
      expect(prophecy).toBeDefined();
      expect(prophecy?.id).toBe('test-prophecy-1');
      expect(prophecy?.text).toBe('This is a test prophecy');
    });

    it("returns null for non-existent ID", () => {
      const prophecy = testEngine.getProphecyById('nonexistent');
      expect(prophecy).toBeNull();
    });
  });

  describe("Placeholder System", () => {
    it("cycles through placeholders", () => {
      const emptyEngine = new ProphecyEngine('non-existent.json');
      
      const prophecy1 = emptyEngine.getRandomProphecy();
      const prophecy2 = emptyEngine.getRandomProphecy();
      const prophecy3 = emptyEngine.getRandomProphecy();
      const prophecy4 = emptyEngine.getRandomProphecy(); // Should cycle back
      
      expect(prophecy1.isPlaceholder).toBe(true);
      expect(prophecy2.isPlaceholder).toBe(true);
      expect(prophecy3.isPlaceholder).toBe(true);
      expect(prophecy4.isPlaceholder).toBe(true);
      
      // Check that they cycle (first and fourth should be the same)
      expect(prophecy1.id).toBe(prophecy4.id);
    });
  });

  describe("Metadata", () => {
    it("returns correct metadata for initialized engine", () => {
      const metadata = testEngine.getMetadata();
      
      expect(metadata.isInitialized).toBe(true);
      expect(metadata.hasLoreData).toBe(true);
      expect(metadata.loreVersion).toBe('1.0.0-test');
      expect(metadata.categories).toContain('test');
      expect(metadata.prophecyCounts.test).toBe(2);
      expect(metadata.placeholderCount).toBe(1);
    });

    it("returns fallback metadata for uninitialized engine", () => {
      const emptyEngine = new ProphecyEngine('non-existent.json');
      const metadata = emptyEngine.getMetadata();
      
      expect(metadata.isInitialized).toBe(true);
      expect(metadata.hasLoreData).toBe(false);
    });
  });

  describe("Integration with Main Lore File", () => {
    it("default prophecy engine initializes with main lore file", () => {
      expect(prophecyEngine.isInitialized).toBe(true);
    });

    it("convenience functions work", () => {
      const prophecy = getRandomProphecy();
      expect(prophecy).toBeDefined();
      expect(prophecy.text).toBeDefined();
    });

    it("category-specific convenience functions work", () => {
      const relicWhisper = getRandomRelicWhisper();
      expect(relicWhisper).toBeDefined();
      expect(relicWhisper.text).toBeDefined();
    });
  });

  describe("Relic Integration", () => {
    it("finds relic whispers by name", () => {
      // Create test engine with relic data
      const relicLoreFile = join(process.cwd(), 'test-relic-prophecies.json');
      const relicLoreData = {
        categories: { relics: { name: "Relics" } },
        prophecies: {
          relics: [
            {
              id: "crown-whisper",
              text: "The crown whispers of sovereignty...",
              relic: "Obsidian Crown of Quantum Dawn"
            },
            {
              id: "key-whisper", 
              text: "The key unlocks infinite doors...",
              relic: "Astral Key of Quantum Dawn"
            }
          ]
        },
        placeholders: []
      };
      
      writeFileSync(relicLoreFile, JSON.stringify(relicLoreData));
      const relicEngine = new ProphecyEngine(relicLoreFile);
      
      const crownWhispers = relicEngine.getRelicWhispers('Crown');
      expect(crownWhispers).toHaveLength(1);
      expect(crownWhispers[0].relic).toContain('Crown');
      
      const keyWhispers = relicEngine.getRelicWhispers('Key');
      expect(keyWhispers).toHaveLength(1);
      expect(keyWhispers[0].relic).toContain('Key');
      
      unlinkSync(relicLoreFile);
    });
  });

  describe("Error Handling and Robustness", () => {
    it("handles reload gracefully", () => {
      const success = testEngine.reload();
      expect(success).toBe(true);
    });

    it("handles failed reload gracefully", () => {
      const badEngine = new ProphecyEngine('non-existent.json');
      const success = badEngine.reload();
      expect(success).toBe(false);
    });
  });
});