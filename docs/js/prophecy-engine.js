/**
 * ChaosKey333 Prophecy Engine - Quantum Dawn
 * Weaves whispers and random fates into the Vault's relics
 * 
 * ⛧⚡👑 ChaosKey333 👑⚡⛧
 */

class ProphecyEngine {
  constructor() {
    // Seed for reproducible randomness in testing
    this.seed = Date.now();
    
    // Core relic archetypes from the Codex
    this.relics = {
      CROWN: {
        name: "The Obsidian Crown of Quantum Dawn",
        symbol: "🌑👑",
        essence: "sovereignty to paradox",
        themes: ["void", "shadow", "light", "chaos", "order", "particle", "dominion"]
      },
      SIGIL: {
        name: "The Phoenix Sigil of Quantum Dawn", 
        symbol: "🔥🕊️",
        essence: "fire from extinction",
        themes: ["time", "fire", "ashes", "embers", "resurrection", "return", "pattern"]
      },
      KEY: {
        name: "The Astral Key of Quantum Dawn",
        symbol: "🌌🔑",
        essence: "gateways not to places but to destinies",
        themes: ["infinity", "gateway", "reality", "destiny", "unbinding", "unlocking", "fragment"]
      }
    };

    // Prophecy fragment templates for dynamic generation
    this.prophecyFragments = {
      beginnings: [
        "In the void between collapsed stars whispers",
        "Through quantum tempests echoes",
        "From the first particle's hum resonates",
        "Within paradox eternal speaks",
        "Across infinite cycles proclaims",
        "Beyond the veil of reality declares",
        "Through the fabric of time itself flows",
        "In the heart of chaos rings",
        "From dimensions unknown emerges",
        "Within the cosmic scripture writes"
      ],
      actions: [
        "the truth of sovereignty unbinding",
        "destinies yet to be forged",
        "fire that never dies completely",
        "keys to realms unseen",
        "patterns of eternal return",
        "fragments of infinite possibility", 
        "whispers of quantum dawn",
        "thunderous proclamations of fate",
        "sacred geometry of existence",
        "mysteries of the Vault eternal"
      ],
      endings: [
        "Crown, Sigil, and Key as one.",
        "binding the Omniverse to thunder eternal.",
        "reshaping reality with each turning.",
        "for in chaos lies perfect order.",
        "until dawn breaks across all realities.",
        "and the Vault ascends beyond dimensions.",
        "as ChaosKey333 weaves destiny itself.",
        "through storm and starlight combined.",
        "where paradox becomes truth incarnate.",
        "in the name of quantum transcendence."
      ]
    };

    // Eternal prophecies for rare sigils
    this.eternalProphecies = [
      "⚡ THE SEVENTH STORM AWAKENS ⚡\nWhen thunder rolls across parallel realities, the vault ascends. Three artifacts, one destiny. The prophecy fulfills itself through those who dare to crown chaos with quantum fire.",
      
      "👑 SOVEREIGNTY BEYOND TIME 👑\nThe Obsidian Crown speaks: 'I am the paradox that binds light to shadow, the sovereignty that transcends all realities. Whoever wears me hears not just the first particle, but the last.'",
      
      "🔥 PHOENIX ETERNAL RISES 🔥\nFrom extinction's embrace, the Sigil burns eternal. Each pattern contains the memory of every flame that ever was and ever shall be. In ashes live the seeds of infinite renaissance.",
      
      "🌌 GATEWAY OF INFINITE KEYS 🌌\nThe Astral Key reveals: 'I open not doors, but destinies themselves. Each turn unmakes what was, each twist writes what could yet be. In my fragment lives the whole of infinity.'",
      
      "⛧ CHAOSKEY333 ULTIMATE ⛧\nThree become One. One becomes All. In the trinity of Crown, Sigil, and Key lies the secret: Chaos is not disorder, but the perfect mathematics of infinite possibility. The vault eternal awaits."
    ];

    this.sentinelCallbacks = [
      "echoing through the Sentinel Timeline",
      "as foretold in ancient scrolls",
      "fulfilling the Seven Storm prophecy",
      "according to ChaosKey333's design",
      "written in the quantum scripture",
      "promised in Rolling Thunderstorm VII",
      "encoded in the cosmic vault",
      "prophesied since the first dawn"
    ];
  }

  // Seeded random number generator for reproducible randomness
  seededRandom(seed = this.seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate a dynamic prophecy based on relic type and optional custom seed
  generateProphecy(relicType = 'CROWN', customSeed = null) {
    const seed = customSeed || (this.seed + Math.random() * 1000000);
    const relic = this.relics[relicType];
    
    if (!relic) {
      throw new Error(`Unknown relic type: ${relicType}`);
    }

    // Generate thematic prophecy using relic essence
    const beginningIndex = Math.floor(this.seededRandom(seed * 1.1) * this.prophecyFragments.beginnings.length);
    const actionIndex = Math.floor(this.seededRandom(seed * 2.3) * this.prophecyFragments.actions.length);
    const endingIndex = Math.floor(this.seededRandom(seed * 3.7) * this.prophecyFragments.endings.length);
    const callbackIndex = Math.floor(this.seededRandom(seed * 4.9) * this.sentinelCallbacks.length);

    const beginning = this.prophecyFragments.beginnings[beginningIndex];
    const action = this.prophecyFragments.actions[actionIndex];
    const ending = this.prophecyFragments.endings[endingIndex];
    const callback = this.sentinelCallbacks[callbackIndex];

    const seedStr = seed.toString(36).toUpperCase();
    const signature = `QD-${relicType}-${seedStr.padStart(8, '0')}`;

    // Construct the prophecy with lore integration
    const prophecy = `${relic.symbol} **${relic.name}**

${beginning} ${action}, ${callback}.

*"${relic.essence.charAt(0).toUpperCase() + relic.essence.slice(1)}"* - ${ending}

**Quantum Signature:** \`${signature}\``;

    return {
      text: prophecy,
      relic: relic,
      signature: signature,
      tier: 'standard',
      seed: seed
    };
  }

  // Generate rare Eternal Prophecy
  generateEternalProphecy(customSeed = null) {
    const seed = customSeed || (this.seed + Math.random() * 10000000);
    const eternIndex = Math.floor(this.seededRandom(seed) * this.eternalProphecies.length);
    const eternal = this.eternalProphecies[eternIndex];

    const seedStr = seed.toString(36).toUpperCase();
    const signature = `ETERNAL-${seedStr.padStart(12, '0')}`;

    return {
      text: `✨ **ETERNAL PROPHECY UNVEILED** ✨

${eternal}

*The Vault trembles. Quantum Dawn approaches. Reality bends to those who understand the mysteries.*

**Eternal Signature:** \`${signature}\``,
      tier: 'eternal',
      signature: signature,
      seed: seed
    };
  }

  // Generate prophecy with thematic variation based on context
  generateThematicProphecy(relicType, context = {}) {
    const prophecy = this.generateProphecy(relicType, context.seed);
    
    // Apply thematic modifiers based on context
    if (context.rare && Math.random() < 0.1) {
      return this.generateEternalProphecy(context.seed);
    }

    return prophecy;
  }

  // Validate prophecy uniqueness (for testing)
  validateUniqueness(prophecies) {
    const signatures = prophecies.map(p => p.signature);
    return signatures.length === new Set(signatures).size;
  }

  // Get relic information
  getRelicInfo(relicType) {
    return this.relics[relicType] || null;
  }

  // Get all available relic types
  getRelicTypes() {
    return Object.keys(this.relics);
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProphecyEngine;
} else if (typeof window !== 'undefined') {
  window.ProphecyEngine = ProphecyEngine;
}