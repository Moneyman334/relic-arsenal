/**
 * Tests for Celestial Leaderboards functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock localStorage for testing
const localStorageMock = {
    storage: {},
    getItem(key) {
        return this.storage[key] || null;
    },
    setItem(key, value) {
        this.storage[key] = value;
    },
    removeItem(key) {
        delete this.storage[key];
    },
    clear() {
        this.storage = {};
    }
};

// Mock window and localStorage
global.window = { localStorage: localStorageMock };
global.localStorage = localStorageMock;

// Import the CelestialLeaderboards class
const CelestialLeaderboards = require('../docs/js/celestial-leaderboards.js');

describe('Celestial Leaderboards', () => {
    let leaderboards;

    beforeEach(() => {
        localStorageMock.clear();
        leaderboards = new CelestialLeaderboards();
    });

    afterEach(() => {
        localStorageMock.clear();
    });

    describe('Initialization', () => {
        it('should initialize with default wanderers', () => {
            expect(leaderboards.wanderers).toBeDefined();
            expect(leaderboards.wanderers.length).toBeGreaterThan(0);
            expect(leaderboards.wanderers[0].name).toBe('ChaosKey333');
        });

        it('should have correct prestige tiers defined', () => {
            expect(leaderboards.prestigeTiers.BRONZE.threshold).toBe(0);
            expect(leaderboards.prestigeTiers.SILVER.threshold).toBe(100);
            expect(leaderboards.prestigeTiers.GOLD.threshold).toBe(500);
            expect(leaderboards.prestigeTiers.PLATINUM.threshold).toBe(1500);
            expect(leaderboards.prestigeTiers.DIAMOND.threshold).toBe(5000);
            expect(leaderboards.prestigeTiers.ETERNAL.threshold).toBe(15000);
        });
    });

    describe('Score Calculation', () => {
        it('should calculate score correctly', () => {
            const wanderer = {
                relicsForged: 10,
                sigilsCollected: 20,
                echosCast: 30
            };
            
            const score = leaderboards.calculateScore(wanderer);
            expect(score).toBe(10 * 10 + 20 * 5 + 30 * 3); // 100 + 100 + 90 = 290
        });

        it('should handle zero values', () => {
            const wanderer = {
                relicsForged: 0,
                sigilsCollected: 0,
                echosCast: 0
            };
            
            const score = leaderboards.calculateScore(wanderer);
            expect(score).toBe(0);
        });
    });

    describe('Prestige Tiers', () => {
        it('should assign Bronze tier for low scores', () => {
            const wanderer = {
                relicsForged: 1,
                sigilsCollected: 1,
                echosCast: 1
            };
            
            const tier = leaderboards.getPrestigeTier(wanderer);
            expect(tier.name).toBe('Bronze');
        });

        it('should assign Silver tier for qualifying scores', () => {
            const wanderer = {
                relicsForged: 10, // 100 points
                sigilsCollected: 0,
                echosCast: 0
            };
            
            const tier = leaderboards.getPrestigeTier(wanderer);
            expect(tier.name).toBe('Silver');
        });

        it('should assign Gold tier for qualifying scores', () => {
            const wanderer = {
                relicsForged: 50, // 500 points
                sigilsCollected: 0,
                echosCast: 0
            };
            
            const tier = leaderboards.getPrestigeTier(wanderer);
            expect(tier.name).toBe('Gold');
        });

        it('should assign Eternal tier for highest scores', () => {
            const wanderer = {
                relicsForged: 1500, // 15000 points
                sigilsCollected: 0,
                echosCast: 0
            };
            
            const tier = leaderboards.getPrestigeTier(wanderer);
            expect(tier.name).toBe('Eternal');
        });
    });

    describe('Leaderboard Functionality', () => {
        it('should return sorted leaderboard by score', () => {
            // Reset and add test wanderers
            leaderboards.wanderers = [
                { id: '1', name: 'Low', relicsForged: 1, sigilsCollected: 1, echosCast: 1 },
                { id: '2', name: 'High', relicsForged: 100, sigilsCollected: 100, echosCast: 100 },
                { id: '3', name: 'Medium', relicsForged: 10, sigilsCollected: 10, echosCast: 10 }
            ];
            
            const leaderboard = leaderboards.getLeaderboard();
            expect(leaderboard[0].name).toBe('High');
            expect(leaderboard[1].name).toBe('Medium');
            expect(leaderboard[2].name).toBe('Low');
        });

        it('should include score and tier information', () => {
            const leaderboard = leaderboards.getLeaderboard();
            
            expect(leaderboard[0]).toHaveProperty('score');
            expect(leaderboard[0]).toHaveProperty('tier');
            expect(leaderboard[0].tier).toHaveProperty('name');
        });
    });

    describe('Action Tracking', () => {
        beforeEach(() => {
            // Add a test wanderer
            leaderboards.wanderers = [{
                id: 'test_wanderer',
                name: 'Test Wanderer',
                relicsForged: 10,
                sigilsCollected: 5,
                echosCast: 3
            }];
        });

        it('should track relic forged action', () => {
            const initialRelics = leaderboards.wanderers[0].relicsForged;
            
            leaderboards.trackAction('test_wanderer', 'relicForged', 3);
            
            expect(leaderboards.wanderers[0].relicsForged).toBe(initialRelics + 3);
            expect(leaderboards.wanderers[0].lastActivity).toBeDefined();
        });

        it('should track sigil collected action', () => {
            const initialSigils = leaderboards.wanderers[0].sigilsCollected;
            
            leaderboards.trackAction('test_wanderer', 'sigilCollected', 2);
            
            expect(leaderboards.wanderers[0].sigilsCollected).toBe(initialSigils + 2);
        });

        it('should track echo cast action', () => {
            const initialEchoes = leaderboards.wanderers[0].echosCast;
            
            leaderboards.trackAction('test_wanderer', 'echoCast', 1);
            
            expect(leaderboards.wanderers[0].echosCast).toBe(initialEchoes + 1);
        });

        it('should default to amount 1 if not specified', () => {
            const initialRelics = leaderboards.wanderers[0].relicsForged;
            
            leaderboards.trackAction('test_wanderer', 'relicForged');
            
            expect(leaderboards.wanderers[0].relicsForged).toBe(initialRelics + 1);
        });

        it('should handle unknown wanderer gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            
            leaderboards.trackAction('unknown_wanderer', 'relicForged');
            
            expect(consoleSpy).toHaveBeenCalledWith('Wanderer unknown_wanderer not found');
            consoleSpy.mockRestore();
        });

        it('should handle unknown action gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            
            leaderboards.trackAction('test_wanderer', 'unknownAction');
            
            expect(consoleSpy).toHaveBeenCalledWith('Unknown action: unknownAction');
            consoleSpy.mockRestore();
        });
    });

    describe('Wanderer Management', () => {
        it('should add new wanderer', () => {
            const initialCount = leaderboards.wanderers.length;
            const newWanderer = {
                name: 'New Wanderer',
                avatar: '🆕'
            };
            
            const added = leaderboards.addWanderer(newWanderer);
            
            expect(leaderboards.wanderers.length).toBe(initialCount + 1);
            expect(added.name).toBe('New Wanderer');
            expect(added.avatar).toBe('🆕');
            expect(added.id).toBeDefined();
            expect(added.relicsForged).toBe(0);
            expect(added.sigilsCollected).toBe(0);
            expect(added.echosCast).toBe(0);
        });

        it('should get wanderer by ID', () => {
            const wanderer = leaderboards.getWanderer('chaoskey333');
            
            expect(wanderer).toBeDefined();
            expect(wanderer.name).toBe('ChaosKey333');
        });

        it('should return null for unknown wanderer', () => {
            const wanderer = leaderboards.getWanderer('unknown');
            
            expect(wanderer).toBeNull();
        });
    });

    describe('Statistics', () => {
        it('should calculate correct statistics', () => {
            const stats = leaderboards.getStats();
            
            expect(stats.totalWanderers).toBe(leaderboards.wanderers.length);
            expect(stats.totalRelics).toBeGreaterThan(0);
            expect(stats.totalSigils).toBeGreaterThan(0);
            expect(stats.totalEchoes).toBeGreaterThan(0);
            expect(stats.topTier).toBeDefined();
            expect(stats.tierDistribution).toBeDefined();
        });

        it('should handle empty wanderer list', () => {
            leaderboards.wanderers = [];
            
            const stats = leaderboards.getStats();
            
            expect(stats.totalWanderers).toBe(0);
            expect(stats.totalRelics).toBe(0);
            expect(stats.totalSigils).toBe(0);
            expect(stats.totalEchoes).toBe(0);
        });
    });

    describe('Data Persistence', () => {
        it('should save data to localStorage', () => {
            leaderboards.trackAction('chaoskey333', 'relicForged');
            
            const saved = JSON.parse(localStorageMock.getItem(leaderboards.STORAGE_KEY));
            expect(saved).toBeDefined();
            expect(Array.isArray(saved)).toBe(true);
        });

        it('should load data from localStorage', () => {
            const testData = [{ id: 'test', name: 'Test', relicsForged: 100, sigilsCollected: 50, echosCast: 25 }];
            localStorageMock.setItem(leaderboards.STORAGE_KEY, JSON.stringify(testData));
            
            const newLeaderboards = new CelestialLeaderboards();
            
            expect(newLeaderboards.wanderers).toEqual(testData);
        });

        it('should use defaults if localStorage is empty', () => {
            localStorageMock.clear();
            
            const newLeaderboards = new CelestialLeaderboards();
            
            expect(newLeaderboards.wanderers.length).toBeGreaterThan(0);
            expect(newLeaderboards.wanderers[0].name).toBe('ChaosKey333');
        });
    });

    describe('Event Listeners', () => {
        it('should add and notify listeners', () => {
            let notifiedData = null;
            const listener = (leaderboard, stats) => {
                notifiedData = { leaderboard, stats };
            };
            
            leaderboards.addUpdateListener(listener);
            leaderboards.trackAction('chaoskey333', 'relicForged');
            
            expect(notifiedData).toBeDefined();
            expect(Array.isArray(notifiedData.leaderboard)).toBe(true);
            expect(notifiedData.stats).toBeDefined();
        });

        it('should remove listeners', () => {
            let callCount = 0;
            const listener = () => callCount++;
            
            leaderboards.addUpdateListener(listener);
            leaderboards.trackAction('chaoskey333', 'relicForged');
            expect(callCount).toBe(1);
            
            leaderboards.removeUpdateListener(listener);
            leaderboards.trackAction('chaoskey333', 'relicForged');
            expect(callCount).toBe(1); // Should not increment
        });
    });

    describe('Simulation', () => {
        it('should simulate activity', () => {
            const initialStats = leaderboards.getStats();
            
            leaderboards.simulateActivity();
            
            const newStats = leaderboards.getStats();
            
            // Some stat should have increased
            expect(
                newStats.totalRelics > initialStats.totalRelics ||
                newStats.totalSigils > initialStats.totalSigils ||
                newStats.totalEchoes > initialStats.totalEchoes
            ).toBe(true);
        });
    });

    describe('Reset Functionality', () => {
        it('should reset to default data', () => {
            // Modify data
            leaderboards.trackAction('chaoskey333', 'relicForged', 1000);
            
            // Reset
            leaderboards.reset();
            
            // Should be back to defaults
            const chaosKey = leaderboards.getWanderer('chaoskey333');
            expect(chaosKey.relicsForged).toBe(7777); // Default value
        });
    });
});