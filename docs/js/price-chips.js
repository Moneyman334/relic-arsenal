/**
 * Price Chips - ChaosKey333 Cosmic Vault
 * Integrates with CoinGecko API for live price and percentage change data
 */

const priceChips = {
    // Configuration
    config: {
        apiBase: 'https://api.coingecko.com/api/v3',
        updateInterval: 60000, // 60 seconds
        extremeChangeThreshold: 5, // 5% for extreme change glow
        maxRetries: 3,
        retryDelay: 2000, // 2 seconds
    },
    
    // Supported cryptocurrencies
    cryptocurrencies: [
        {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
        },
        {
            id: 'ethereum',
            symbol: 'ETH', 
            name: 'Ethereum',
            logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
        },
        {
            id: 'cardano',
            symbol: 'ADA',
            name: 'Cardano',
            logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
        },
        {
            id: 'solana',
            symbol: 'SOL',
            name: 'Solana',
            logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
        },
        {
            id: 'polkadot',
            symbol: 'DOT',
            name: 'Polkadot',
            logo: 'https://assets.coingecko.com/coins/images/12171/small/aJGBjJFU_400x400.jpg'
        },
        {
            id: 'chainlink',
            symbol: 'LINK',
            name: 'Chainlink',
            logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
        }
    ],
    
    // State management
    state: {
        isLoading: false,
        hasError: false,
        lastUpdate: null,
        priceData: {},
        retryCount: 0,
        updateTimer: null
    },

    // DOM elements
    elements: {
        loadingState: null,
        errorState: null,
        priceChipsGrid: null,
        lastUpdated: null,
        activeSentinels: null
    },

    /**
     * Initialize the price chips system
     */
    init() {
        console.log('🔮 Initializing Cosmic Vault Price Chips...');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Check if demo mode is enabled (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === 'true') {
            this.initDemoMode();
            return;
        }
        
        // Start the cosmic ritual
        this.showLoading();
        this.fetchPriceData();
        
        // Set up periodic updates
        this.startPeriodicUpdates();
        
        // Handle window focus/blur for performance
        this.setupFocusHandlers();
    },

    /**
     * Initialize demo mode with mock data
     */
    initDemoMode() {
        console.log('🎭 Entering Demo Mode - Using Mock Data');
        
        // Create mock price data with various scenarios
        const mockData = {
            bitcoin: {
                usd: 43250.67,
                usd_24h_change: 7.42 // Extreme positive
            },
            ethereum: {
                usd: 2567.89,
                usd_24h_change: -2.15 // Normal negative
            },
            cardano: {
                usd: 0.4523,
                usd_24h_change: 12.67 // Extreme positive
            },
            solana: {
                usd: 98.34,
                usd_24h_change: -8.91 // Extreme negative
            },
            polkadot: {
                usd: 6.78,
                usd_24h_change: 1.23 // Normal positive
            },
            chainlink: {
                usd: 14.56,
                usd_24h_change: -0.05 // Nearly neutral
            }
        };
        
        // Process mock data
        this.processPriceData(mockData);
        
        // Render chips
        this.renderPriceChips();
        
        // Update stats
        this.state.lastUpdate = new Date();
        this.updateStats();
        
        // Set up demo periodic updates (with slight variations)
        this.startDemoUpdates();
        
        console.log('✨ Demo Mode Active - Market Sentinels Simulated!');
    },

    /**
     * Start demo updates with slight price variations
     */
    startDemoUpdates() {
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
        }
        
        this.state.updateTimer = setInterval(() => {
            // Add slight random variations to the mock data
            Object.keys(this.state.priceData).forEach(cryptoId => {
                const crypto = this.state.priceData[cryptoId];
                
                // Vary price by ±0.5%
                const priceVariation = (Math.random() - 0.5) * 0.01;
                crypto.price *= (1 + priceVariation);
                
                // Vary change by ±0.2%
                const changeVariation = (Math.random() - 0.5) * 0.4;
                crypto.change24h += changeVariation;
                
                // Keep extreme changes for demo purposes
                if (cryptoId === 'bitcoin' && crypto.change24h < 5) crypto.change24h = 7 + Math.random() * 2;
                if (cryptoId === 'cardano' && crypto.change24h < 5) crypto.change24h = 12 + Math.random() * 3;
                if (cryptoId === 'solana' && crypto.change24h > -5) crypto.change24h = -8 - Math.random() * 3;
            });
            
            // Re-render chips
            this.renderPriceChips();
            this.state.lastUpdate = new Date();
            this.updateStats();
            
            console.log('🎭 Demo data refreshed with cosmic variations...');
        }, 5000); // Update every 5 seconds in demo mode
    },
    cacheElements() {
        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            priceChipsGrid: document.getElementById('priceChipsGrid'),
            lastUpdated: document.getElementById('lastUpdated'),
            activeSentinels: document.getElementById('activeSentinels')
        };
    },

    /**
     * Show loading state
     */
    showLoading() {
        this.state.isLoading = true;
        this.state.hasError = false;
        
        this.elements.loadingState.style.display = 'block';
        this.elements.errorState.style.display = 'none';
        this.elements.priceChipsGrid.style.display = 'none';
    },

    /**
     * Show error state
     */
    showError() {
        this.state.isLoading = false;
        this.state.hasError = true;
        
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'block';
        this.elements.priceChipsGrid.style.display = 'none';
    },

    /**
     * Show price chips
     */
    showPriceChips() {
        this.state.isLoading = false;
        this.state.hasError = false;
        
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'none';
        this.elements.priceChipsGrid.style.display = 'grid';
    },

    /**
     * Fetch price data from CoinGecko API
     */
    async fetchPriceData() {
        try {
            console.log('⚡ Summoning market sentinels from the quantum realm...');
            
            const cryptoIds = this.cryptocurrencies.map(crypto => crypto.id).join(',');
            const url = `${this.config.apiBase}/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true&precision=2`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Process and store the price data
            this.processPriceData(data);
            
            // Render the price chips
            this.renderPriceChips();
            
            // Update state
            this.state.lastUpdate = new Date();
            this.state.retryCount = 0;
            this.updateStats();
            
            console.log('✨ Market sentinels successfully summoned!');
            
        } catch (error) {
            console.error('❌ Failed to summon market sentinels:', error);
            this.handleError(error);
        }
    },

    /**
     * Process raw price data from API
     */
    processPriceData(rawData) {
        this.state.priceData = {};
        
        this.cryptocurrencies.forEach(crypto => {
            const apiData = rawData[crypto.id];
            if (apiData) {
                this.state.priceData[crypto.id] = {
                    ...crypto,
                    price: apiData.usd,
                    change24h: apiData.usd_24h_change || 0
                };
            }
        });
    },

    /**
     * Render price chips in the grid
     */
    renderPriceChips() {
        const grid = this.elements.priceChipsGrid;
        grid.innerHTML = '';
        
        Object.values(this.state.priceData).forEach(crypto => {
            const chipElement = this.createPriceChip(crypto);
            grid.appendChild(chipElement);
        });
        
        this.showPriceChips();
    },

    /**
     * Create a single price chip element
     */
    createPriceChip(crypto) {
        const chip = document.createElement('div');
        chip.className = 'price-chip';
        
        // Determine change direction and styling
        const changeClass = this.getChangeClass(crypto.change24h);
        const isExtreme = Math.abs(crypto.change24h) >= this.config.extremeChangeThreshold;
        
        if (isExtreme) {
            chip.classList.add(crypto.change24h > 0 ? 'extreme-positive' : 'extreme-negative');
        }
        
        // Format price with appropriate decimal places
        const formattedPrice = this.formatPrice(crypto.price);
        
        // Format percentage change
        const formattedChange = this.formatPercentage(crypto.change24h);
        
        chip.innerHTML = `
            <div class="chip-header">
                <img class="chip-logo" src="${crypto.logo}" alt="${crypto.name} logo" onerror="this.style.display='none'">
                <div class="chip-info">
                    <h3>${crypto.name}</h3>
                    <div class="symbol">${crypto.symbol}/USD</div>
                </div>
            </div>
            <div class="price-display">
                <div class="current-price">$${formattedPrice}</div>
                <div class="price-change ${changeClass}">
                    <span class="change-arrow"></span>
                    <span class="change-value">${formattedChange}%</span>
                </div>
            </div>
        `;
        
        return chip;
    },

    /**
     * Get CSS class for change direction
     */
    getChangeClass(change) {
        if (change > 0) return 'positive';
        if (change < 0) return 'negative';
        return 'neutral';
    },

    /**
     * Format price with appropriate precision
     */
    formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        } else {
            return price.toLocaleString('en-US', { 
                minimumFractionDigits: 4, 
                maximumFractionDigits: 6 
            });
        }
    },

    /**
     * Format percentage with sign and precision
     */
    formatPercentage(percentage) {
        const sign = percentage >= 0 ? '+' : '';
        return sign + percentage.toFixed(2);
    },

    /**
     * Handle API errors with retry logic
     */
    async handleError(error) {
        console.error('🌀 Quantum disruption detected:', error.message);
        
        this.state.retryCount++;
        
        if (this.state.retryCount < this.config.maxRetries) {
            console.log(`🔄 Attempting cosmic realignment... (${this.state.retryCount}/${this.config.maxRetries})`);
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
            
            // Retry the fetch
            return this.fetchPriceData();
        }
        
        // Max retries reached, show error state
        this.showError();
        this.state.retryCount = 0;
    },

    /**
     * Update statistics display
     */
    updateStats() {
        if (this.elements.lastUpdated && this.state.lastUpdate) {
            this.elements.lastUpdated.textContent = this.state.lastUpdate.toLocaleTimeString();
        }
        
        if (this.elements.activeSentinels) {
            const count = Object.keys(this.state.priceData).length;
            this.elements.activeSentinels.textContent = count;
        }
    },

    /**
     * Start periodic updates
     */
    startPeriodicUpdates() {
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
        }
        
        this.state.updateTimer = setInterval(() => {
            if (!this.state.isLoading && document.visibilityState === 'visible') {
                console.log('⚡ Refreshing market sentinels...');
                this.fetchPriceData();
            }
        }, this.config.updateInterval);
    },

    /**
     * Setup focus handlers for performance optimization
     */
    setupFocusHandlers() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Refresh data when tab becomes visible
                if (this.state.lastUpdate) {
                    const timeSinceUpdate = Date.now() - this.state.lastUpdate.getTime();
                    if (timeSinceUpdate > this.config.updateInterval) {
                        console.log('👁️ Vault observed - refreshing sentinels...');
                        this.fetchPriceData();
                    }
                }
            }
        });
    },

    /**
     * Cleanup method
     */
    destroy() {
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
            this.state.updateTimer = null;
        }
        
        console.log('🌙 Cosmic vault sealed. Market sentinels dismissed.');
    }
};

// Make priceChips available globally for error retry button
window.priceChips = priceChips;

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    priceChips.destroy();
});

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = priceChips;
}