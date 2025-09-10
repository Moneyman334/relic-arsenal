/**
 * Collector Archive API - Mock Backend for Relic Data
 * ChaosKey333 Relic Arsenal
 * 
 * Provides dynamic metadata, lore, and pricing for relics
 */

class CollectorArchive {
    constructor() {
        this.relics = this.initializeRelicDatabase();
        this.priceUpdateInterval = null;
        this.startPriceUpdates();
    }

    /**
     * Initialize the relic database with sample data
     */
    initializeRelicDatabase() {
        return {
            'quantum-genesis-sigil': {
                id: 'quantum-genesis-sigil',
                name: 'Quantum Genesis Sigil',
                sigil: '../assets/social/sigil-of-thunder/sample_sigil.md', // Placeholder path
                lore: 'Born from the first quantum storm, this sigil pulses with primordial energy. It whispers secrets of creation across dimensional barriers, drawing power from the infinite void between realities.',
                basePrice: 2500,
                rarity: 'Cosmic',
                element: 'Quantum',
                power: 9500,
                discoveryDate: '2024-01-15'
            },
            'rolling-thunder-emblem': {
                id: 'rolling-thunder-emblem',
                name: 'Rolling Thunder VII Emblem',
                sigil: '../assets/banners/rolling-thunderstorm-vii-emblem.png',
                lore: 'The sacred emblem of the Seventh Storm, forged in the crucible of cosmic transformation. Thunder echoes through its crystalline core, promising power to those who can harness its electric fury.',
                basePrice: 3750,
                rarity: 'Legendary',
                element: 'Thunder',
                power: 12000,
                discoveryDate: '2024-03-21'
            },
            'vault-ascendant-crown': {
                id: 'vault-ascendant-crown',
                name: 'Vault Ascendant Crown',
                sigil: '../assets/banners/cosmic-vault-ascension.png',
                lore: 'Crowned with stellar fire and quantum light, this relic represents the ultimate ascension of the ChaosKey333 vault. It grants dominion over cosmic forces and the ability to bend reality to one\'s will.',
                basePrice: 5000,
                rarity: 'Mythic',
                element: 'Crown',
                power: 15000,
                discoveryDate: '2024-03-22'
            },
            'blazing-triptych-fragment': {
                id: 'blazing-triptych-fragment',
                name: 'Blazing Triptych Fragment',
                sigil: '../assets/banners/blazing-triptych-composite.png',
                lore: 'A fragment of the great triptych that chronicles the quantum dawn. Each piece contains a different aspect of the cosmic awakening - genesis, storm, and ascension united in perfect harmony.',
                basePrice: 1800,
                rarity: 'Epic',
                element: 'Composite',
                power: 7500,
                discoveryDate: '2024-03-20'
            },
            'quantum-dawn-master': {
                id: 'quantum-dawn-master',
                name: 'Quantum Dawn Master Relic',
                sigil: '../assets/banners/quantum-dawn-master.png',
                lore: 'The master relic of the Quantum Dawn era, containing the concentrated essence of all cosmic storms. It serves as a beacon for lost travelers between dimensions and a key to unlock infinite possibilities.',
                basePrice: 7500,
                rarity: 'Transcendent',
                element: 'Master',
                power: 20000,
                discoveryDate: '2024-03-22'
            },
            'stellar-crown-key': {
                id: 'stellar-crown-key',
                name: 'Stellar Crown Key',
                sigil: '../assets/banners/stellar-crown.png',
                lore: 'Forged from collapsed starlight and quantum dreams, this key opens pathways to crowned dimensions. Each use transforms both the key and its wielder, ascending them closer to cosmic royalty.',
                basePrice: 4200,
                rarity: 'Royal',
                element: 'Star',
                power: 11500,
                discoveryDate: '2024-03-19'
            },
            'dimensional-lightning-shard': {
                id: 'dimensional-lightning-shard',
                name: 'Dimensional Lightning Shard',
                sigil: '../assets/banners/dimensional-lightning.png',
                lore: 'Crystallized lightning that tore through the fabric of space-time itself. This shard contains the raw power to bridge dimensions and conduct energy between parallel realities.',
                basePrice: 3100,
                rarity: 'Legendary',
                element: 'Lightning',
                power: 9800,
                discoveryDate: '2024-03-18'
            },
            'quantum-particle-vortex': {
                id: 'quantum-particle-vortex',
                name: 'Quantum Particle Vortex',
                sigil: '../assets/banners/quantum-particle-vortex.png',
                lore: 'A swirling maelstrom of quantum particles frozen in eternal dance. This vortex serves as both a power source and a window into the fundamental nature of reality itself.',
                basePrice: 2800,
                rarity: 'Cosmic',
                element: 'Vortex',
                power: 8900,
                discoveryDate: '2024-03-17'
            }
        };
    }

    /**
     * Start dynamic price updates to simulate market activity
     */
    startPriceUpdates() {
        this.priceUpdateInterval = setInterval(() => {
            this.updatePrices();
        }, 30000); // Update every 30 seconds
    }

    /**
     * Stop price updates
     */
    stopPriceUpdates() {
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
            this.priceUpdateInterval = null;
        }
    }

    /**
     * Update prices with realistic market fluctuations
     */
    updatePrices() {
        Object.keys(this.relics).forEach(relicId => {
            const relic = this.relics[relicId];
            const fluctuation = (Math.random() - 0.5) * 0.1; // ±10% fluctuation
            const newPrice = Math.round(relic.basePrice * (1 + fluctuation));
            relic.currentPrice = Math.max(newPrice, Math.round(relic.basePrice * 0.7)); // Minimum 70% of base price
        });
    }

    /**
     * Get all available relics
     */
    async getAllRelics() {
        // Simulate API delay
        await this.delay(100);
        return Object.values(this.relics);
    }

    /**
     * Get a specific relic by ID
     */
    async getRelic(relicId) {
        await this.delay(100);
        const relic = this.relics[relicId];
        if (!relic) {
            throw new Error(`Relic not found: ${relicId}`);
        }
        
        return {
            ...relic,
            price: this.formatPrice(relic.currentPrice || relic.basePrice),
            priceValue: relic.currentPrice || relic.basePrice,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Search relics by name or properties
     */
    async searchRelics(query) {
        await this.delay(150);
        const searchTerm = query.toLowerCase();
        const results = Object.values(this.relics).filter(relic => 
            relic.name.toLowerCase().includes(searchTerm) ||
            relic.lore.toLowerCase().includes(searchTerm) ||
            relic.element.toLowerCase().includes(searchTerm) ||
            relic.rarity.toLowerCase().includes(searchTerm)
        );
        
        return results.map(relic => ({
            ...relic,
            price: this.formatPrice(relic.currentPrice || relic.basePrice),
            priceValue: relic.currentPrice || relic.basePrice,
            lastUpdated: new Date().toISOString()
        }));
    }

    /**
     * Get relics by rarity level
     */
    async getRelicsByRarity(rarity) {
        await this.delay(100);
        const filtered = Object.values(this.relics).filter(relic => 
            relic.rarity.toLowerCase() === rarity.toLowerCase()
        );
        
        return filtered.map(relic => ({
            ...relic,
            price: this.formatPrice(relic.currentPrice || relic.basePrice),
            priceValue: relic.currentPrice || relic.basePrice,
            lastUpdated: new Date().toISOString()
        }));
    }

    /**
     * Get market statistics
     */
    async getMarketStats() {
        await this.delay(200);
        const relics = Object.values(this.relics);
        const prices = relics.map(r => r.currentPrice || r.basePrice);
        
        return {
            totalRelics: relics.length,
            averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            totalValue: prices.reduce((a, b) => a + b, 0),
            lastUpdated: new Date().toISOString(),
            marketTrend: this.getMarketTrend()
        };
    }

    /**
     * Get a random featured relic
     */
    async getFeaturedRelic() {
        const relics = await this.getAllRelics();
        const featured = relics[Math.floor(Math.random() * relics.length)];
        return this.getRelic(featured.id);
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (price >= 1000) {
            return (price / 1000).toFixed(1) + 'k';
        }
        return price.toString();
    }

    /**
     * Get current market trend
     */
    getMarketTrend() {
        const trends = ['ASCENDING', 'STABLE', 'VOLATILE', 'SURGING'];
        return trends[Math.floor(Math.random() * trends.length)];
    }

    /**
     * Simulate API delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Add a new relic (for future expansion)
     */
    async addRelic(relicData) {
        await this.delay(100);
        const id = relicData.id || this.generateRelicId(relicData.name);
        
        this.relics[id] = {
            id,
            discoveryDate: new Date().toISOString().split('T')[0],
            basePrice: relicData.basePrice || 1000,
            ...relicData
        };
        
        return this.relics[id];
    }

    /**
     * Generate a unique relic ID from name
     */
    generateRelicId(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Get relic discovery timeline
     */
    async getDiscoveryTimeline() {
        await this.delay(100);
        const relics = Object.values(this.relics);
        return relics
            .sort((a, b) => new Date(a.discoveryDate) - new Date(b.discoveryDate))
            .map(relic => ({
                id: relic.id,
                name: relic.name,
                discoveryDate: relic.discoveryDate,
                rarity: relic.rarity,
                element: relic.element
            }));
    }

    /**
     * Get price history for a relic (simulated)
     */
    async getPriceHistory(relicId, days = 7) {
        await this.delay(150);
        const relic = this.relics[relicId];
        if (!relic) {
            throw new Error(`Relic not found: ${relicId}`);
        }

        const history = [];
        const currentPrice = relic.currentPrice || relic.basePrice;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Simulate price history with some variance
            const variance = (Math.random() - 0.5) * 0.15; // ±15%
            const price = Math.round(relic.basePrice * (1 + variance));
            
            history.push({
                date: date.toISOString().split('T')[0],
                price: Math.max(price, Math.round(relic.basePrice * 0.6)),
                formattedPrice: this.formatPrice(price)
            });
        }
        
        // Make sure the last entry matches current price
        history[history.length - 1].price = currentPrice;
        history[history.length - 1].formattedPrice = this.formatPrice(currentPrice);
        
        return history;
    }
}

// Initialize price fluctuations on load
const collectorArchive = new CollectorArchive();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CollectorArchive, collectorArchive };
}

// Make available globally for browser use
window.CollectorArchive = CollectorArchive;
window.collectorArchive = collectorArchive;