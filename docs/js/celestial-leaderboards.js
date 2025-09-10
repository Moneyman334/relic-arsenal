/**
 * Celestial Leaderboards - Track wanderers and spark competition within the Vault
 * Manages leaderboard data, prestige tiers, and real-time updates
 */

class CelestialLeaderboards {
    constructor() {
        this.STORAGE_KEY = 'celestial_leaderboards_data';
        this.prestigeTiers = {
            BRONZE: { name: 'Bronze', threshold: 0, color: '#CD7F32', glow: '#CD7F32' },
            SILVER: { name: 'Silver', threshold: 100, color: '#C0C0C0', glow: '#E8E8E8' },
            GOLD: { name: 'Gold', threshold: 500, color: '#FFD700', glow: '#FFF700' },
            PLATINUM: { name: 'Platinum', threshold: 1500, color: '#E5E4E2', glow: '#F5F5DC' },
            DIAMOND: { name: 'Diamond', threshold: 5000, color: '#B9F2FF', glow: '#87CEEB' },
            ETERNAL: { name: 'Eternal', threshold: 15000, color: '#9370DB', glow: '#DDA0DD' }
        };
        this.wanderers = this.loadData();
        this.listeners = [];
    }

    /**
     * Load leaderboard data from localStorage
     * @returns {Array} Array of wanderer objects
     */
    loadData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getDefaultWanderers();
        } catch (error) {
            console.error('Failed to load leaderboard data:', error);
            return this.getDefaultWanderers();
        }
    }

    /**
     * Save leaderboard data to localStorage
     */
    saveData() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wanderers));
            this.notifyListeners();
        } catch (error) {
            console.error('Failed to save leaderboard data:', error);
        }
    }

    /**
     * Get default wanderers for initial state
     * @returns {Array} Array of default wanderer objects
     */
    getDefaultWanderers() {
        return [
            {
                id: 'chaoskey333',
                name: 'ChaosKey333',
                relicsForged: 7777,
                sigilsCollected: 3333,
                echosCast: 1234,
                joinDate: Date.now() - (365 * 24 * 60 * 60 * 1000), // 1 year ago
                avatar: '👑'
            },
            {
                id: 'vaultkeeper',
                name: 'VaultKeeper',
                relicsForged: 2500,
                sigilsCollected: 1800,
                echosCast: 890,
                joinDate: Date.now() - (200 * 24 * 60 * 60 * 1000),
                avatar: '🗝️'
            },
            {
                id: 'stormweaver',
                name: 'StormWeaver',
                relicsForged: 1800,
                sigilsCollected: 1200,
                echosCast: 650,
                joinDate: Date.now() - (150 * 24 * 60 * 60 * 1000),
                avatar: '⚡'
            }
        ];
    }

    /**
     * Calculate total score for a wanderer
     * @param {Object} wanderer - Wanderer object
     * @returns {number} Total score
     */
    calculateScore(wanderer) {
        return (wanderer.relicsForged * 10) + 
               (wanderer.sigilsCollected * 5) + 
               (wanderer.echosCast * 3);
    }

    /**
     * Determine prestige tier for a wanderer
     * @param {Object} wanderer - Wanderer object
     * @returns {Object} Tier information
     */
    getPrestigeTier(wanderer) {
        const score = this.calculateScore(wanderer);
        const tiers = Object.values(this.prestigeTiers).reverse();
        
        for (const tier of tiers) {
            if (score >= tier.threshold) {
                return tier;
            }
        }
        
        return this.prestigeTiers.BRONZE;
    }

    /**
     * Get wanderers sorted by score (leaderboard order)
     * @returns {Array} Sorted array of wanderers with tier information
     */
    getLeaderboard() {
        return this.wanderers
            .map(wanderer => ({
                ...wanderer,
                score: this.calculateScore(wanderer),
                tier: this.getPrestigeTier(wanderer)
            }))
            .sort((a, b) => b.score - a.score);
    }

    /**
     * Track a new action for a wanderer
     * @param {string} wandererId - Wanderer ID
     * @param {string} action - Action type ('relicForged', 'sigilCollected', 'echoCast')
     * @param {number} amount - Amount to add (default: 1)
     */
    trackAction(wandererId, action, amount = 1) {
        const wanderer = this.wanderers.find(w => w.id === wandererId);
        if (!wanderer) {
            console.warn(`Wanderer ${wandererId} not found`);
            return;
        }

        switch (action) {
            case 'relicForged':
                wanderer.relicsForged += amount;
                break;
            case 'sigilCollected':
                wanderer.sigilsCollected += amount;
                break;
            case 'echoCast':
                wanderer.echosCast += amount;
                break;
            default:
                console.warn(`Unknown action: ${action}`);
                return;
        }

        wanderer.lastActivity = Date.now();
        this.saveData();
    }

    /**
     * Add a new wanderer to the leaderboard
     * @param {Object} wandererData - Wanderer data object
     */
    addWanderer(wandererData) {
        const newWanderer = {
            id: wandererData.id || `wanderer_${Date.now()}`,
            name: wandererData.name || 'Anonymous Wanderer',
            relicsForged: wandererData.relicsForged || 0,
            sigilsCollected: wandererData.sigilsCollected || 0,
            echosCast: wandererData.echosCast || 0,
            joinDate: Date.now(),
            avatar: wandererData.avatar || '🌟',
            lastActivity: Date.now()
        };

        this.wanderers.push(newWanderer);
        this.saveData();
        return newWanderer;
    }

    /**
     * Get wanderer by ID
     * @param {string} wandererId - Wanderer ID
     * @returns {Object|null} Wanderer object or null if not found
     */
    getWanderer(wandererId) {
        return this.wanderers.find(w => w.id === wandererId) || null;
    }

    /**
     * Get leaderboard statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        const leaderboard = this.getLeaderboard();
        const totalWanderers = leaderboard.length;
        
        if (totalWanderers === 0) {
            return {
                totalWanderers: 0,
                totalRelics: 0,
                totalSigils: 0,
                totalEchoes: 0,
                topTier: this.prestigeTiers.BRONZE,
                tierDistribution: {}
            };
        }

        const totalRelics = leaderboard.reduce((sum, w) => sum + w.relicsForged, 0);
        const totalSigils = leaderboard.reduce((sum, w) => sum + w.sigilsCollected, 0);
        const totalEchoes = leaderboard.reduce((sum, w) => sum + w.echosCast, 0);
        const topTier = leaderboard[0].tier;

        // Calculate tier distribution
        const tierDistribution = {};
        Object.values(this.prestigeTiers).forEach(tier => {
            tierDistribution[tier.name] = 0;
        });
        
        leaderboard.forEach(wanderer => {
            tierDistribution[wanderer.tier.name]++;
        });

        return {
            totalWanderers,
            totalRelics,
            totalSigils,
            totalEchoes,
            topTier,
            tierDistribution
        };
    }

    /**
     * Add listener for leaderboard updates
     * @param {Function} callback - Callback function to call on updates
     */
    addUpdateListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove update listener
     * @param {Function} callback - Callback function to remove
     */
    removeUpdateListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Notify all listeners of updates
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.getLeaderboard(), this.getStats());
            } catch (error) {
                console.error('Error in leaderboard listener:', error);
            }
        });
    }

    /**
     * Reset leaderboard data (for testing/demo purposes)
     */
    reset() {
        this.wanderers = this.getDefaultWanderers();
        this.saveData();
    }

    /**
     * Simulate activity for demo purposes
     */
    simulateActivity() {
        const actions = ['relicForged', 'sigilCollected', 'echoCast'];
        const wandererIds = this.wanderers.map(w => w.id);
        
        // Generate random activity
        for (let i = 0; i < 5; i++) {
            const randomWanderer = wandererIds[Math.floor(Math.random() * wandererIds.length)];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const randomAmount = Math.floor(Math.random() * 5) + 1;
            
            this.trackAction(randomWanderer, randomAction, randomAmount);
        }
    }
}

// Export for use in other modules or testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CelestialLeaderboards;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.CelestialLeaderboards = CelestialLeaderboards;
}