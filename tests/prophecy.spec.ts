import ProphecyEngine from '../docs/js/prophecy-engine.js';

describe("Prophecy Gate", () => {
  it("crowns the gate", () => {
    const crown = "👑";
    expect(crown).toBe("👑");
  });
});

describe("Prophecy Engine", () => {
  let engine;

  beforeEach(() => {
    engine = new ProphecyEngine();
  });

  it("initializes with correct relic archetypes", () => {
    expect(engine.getRelicTypes()).toContain("CROWN");
    expect(engine.getRelicTypes()).toContain("SIGIL"); 
    expect(engine.getRelicTypes()).toContain("KEY");
  });

  it("generates prophecies for each relic type", () => {
    const crownProphecy = engine.generateProphecy("CROWN", 12345);
    const sigilProphecy = engine.generateProphecy("SIGIL", 12345);
    const keyProphecy = engine.generateProphecy("KEY", 12345);

    expect(crownProphecy.text).toContain("🌑👑");
    expect(crownProphecy.text).toContain("Obsidian Crown");
    expect(crownProphecy.signature).toMatch(/^QD-CROWN-[A-Z0-9]+$/);

    expect(sigilProphecy.text).toContain("🔥🕊️");
    expect(sigilProphecy.text).toContain("Phoenix Sigil");
    expect(sigilProphecy.signature).toMatch(/^QD-SIGIL-[A-Z0-9]+$/);

    expect(keyProphecy.text).toContain("🌌🔑");
    expect(keyProphecy.text).toContain("Astral Key");
    expect(keyProphecy.signature).toMatch(/^QD-KEY-[A-Z0-9]+$/);
  });

  it("ensures prophecy uniqueness with different seeds", () => {
    const prophecies = [];
    for (let i = 0; i < 10; i++) {
      prophecies.push(engine.generateProphecy("CROWN", i * 1000));
    }

    expect(engine.validateUniqueness(prophecies)).toBe(true);
  });

  it("generates reproducible prophecies with same seed", () => {
    const seed = 42;
    const prophecy1 = engine.generateProphecy("CROWN", seed);
    const prophecy2 = engine.generateProphecy("CROWN", seed);

    expect(prophecy1.signature).toBe(prophecy2.signature);
    expect(prophecy1.text).toBe(prophecy2.text);
  });

  it("generates eternal prophecies", () => {
    const eternalProphecy = engine.generateEternalProphecy(99999);
    
    expect(eternalProphecy.tier).toBe("eternal");
    expect(eternalProphecy.text).toContain("ETERNAL PROPHECY UNVEILED");
    expect(eternalProphecy.signature).toMatch(/^ETERNAL-[A-Z0-9]+$/);
  });

  it("integrates lore callbacks in standard prophecies", () => {
    const prophecy = engine.generateProphecy("CROWN", 12345);
    
    // Should contain sentinel timeline callbacks
    const containsCallback = engine.sentinelCallbacks.some(callback => 
      prophecy.text.includes(callback)
    );
    expect(containsCallback).toBe(true);
  });

  it("throws error for invalid relic type", () => {
    expect(() => {
      engine.generateProphecy("INVALID");
    }).toThrow("Unknown relic type: INVALID");
  });

  it("gets relic information correctly", () => {
    const crownInfo = engine.getRelicInfo("CROWN");
    
    expect(crownInfo.name).toBe("The Obsidian Crown of Quantum Dawn");
    expect(crownInfo.symbol).toBe("🌑👑");
    expect(crownInfo.essence).toBe("sovereignty to paradox");
    expect(crownInfo.themes).toContain("void");
  });

  it("generates thematic prophecies with context", () => {
    const prophecy = engine.generateThematicProphecy("CROWN", { seed: 54321 });
    
    expect(prophecy.relic.name).toContain("Crown");
    expect(prophecy.tier).toBe("standard");
  });
});