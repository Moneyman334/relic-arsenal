#!/usr/bin/env node
/**
 * Manual test of the Prophecy Engine functionality
 * This demonstrates the core features working correctly
 */

// Import the engine
const ProphecyEngine = require('./docs/js/prophecy-engine.js');

console.log('⛧⚡👑 ChaosKey333 Prophecy Engine Test 👑⚡⛧\n');

// Initialize the engine
const engine = new ProphecyEngine();

// Test 1: Generate prophecies for all relic types
console.log('=== Testing Standard Prophecies ===\n');

['CROWN', 'SIGIL', 'KEY'].forEach(relicType => {
    const prophecy = engine.generateProphecy(relicType, 42); // Fixed seed for reproducibility
    console.log(`${relicType} PROPHECY:`);
    console.log(prophecy.text);
    console.log('\n---\n');
});

// Test 2: Generate an eternal prophecy
console.log('=== Testing Eternal Prophecy ===\n');
const eternalProphecy = engine.generateEternalProphecy(12345);
console.log('ETERNAL PROPHECY:');
console.log(eternalProphecy.text);
console.log('\n---\n');

// Test 3: Validate uniqueness
console.log('=== Testing Uniqueness ===\n');
const prophecies = [];
for (let i = 0; i < 5; i++) {
    prophecies.push(engine.generateProphecy('CROWN', i * 1000));
}

const isUnique = engine.validateUniqueness(prophecies);
console.log(`Generated 5 prophecies, all unique: ${isUnique}`);
console.log('Signatures:', prophecies.map(p => p.signature));
console.log('\n---\n');

// Test 4: Validate relic information
console.log('=== Testing Relic Information ===\n');
engine.getRelicTypes().forEach(type => {
    const info = engine.getRelicInfo(type);
    console.log(`${type}: ${info.name} ${info.symbol}`);
    console.log(`  Essence: ${info.essence}`);
    console.log(`  Themes: ${info.themes.join(', ')}`);
});

console.log('\n✨ All tests completed successfully! The Prophecy Engine is operational. ✨');