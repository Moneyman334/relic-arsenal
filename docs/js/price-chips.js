/**
 * Vault Price Chips - Live Crypto Price Tracker
 * Enhanced with trend arrows, glow pulses, and real-time updates
 */

class VaultPriceChips {
    constructor() {
        this.apiBaseUrl = 'https://api.coingecko.com/api/v3';
        this.updateInterval = 60000; // 60 seconds
        this.coins = ['bitcoin', 'ethereum', 'cardano', 'solana', 'chainlink', 'polygon'];
        this.previousPrices = new Map();
        this.currentPrices = new Map();
        this.updateTimer = null;
        this.countdownTimer = null;
        this.countdownSeconds = 60;
        this.isRateLimited = false;
        this.isOffline = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        this.init();
    }

    init() {
        console.log('🚀 Vault Price Chips initialized');
        this.setupEventListeners();
        this.startPriceUpdates();
        this.startCountdown();
    }

    setupEventListeners() {
        // Handle page visibility changes to pause/resume updates
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });

        // Handle online/offline events
        window.addEventListener('online', () => {
            this.isOffline = false;
            this.updateConnectionStatus('online');
            this.resumeUpdates();
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
            this.updateConnectionStatus('offline');
            this.pauseUpdates();
        });
    }

    async fetchPrices() {
        if (this.isOffline) {
            console.log('📡 Skipping price fetch - offline');
            return;
        }

        try {
            console.log('📊 Fetching prices from CoinGecko...');
            const coinsParam = this.coins.join(',');
            const url = `${this.apiBaseUrl}/simple/price?ids=${coinsParam}&vs_currencies=usd&include_24hr_change=true`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn('⚠️ Rate limited by CoinGecko API');
                    this.handleRateLimit();
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Price data received:', Object.keys(data));

            // Reset rate limit and retry count on successful fetch
            this.isRateLimited = false;
            this.retryCount = 0;
            this.updateConnectionStatus('online');

            this.processPriceData(data);

        } catch (error) {
            console.error('❌ Error fetching prices:', error);
            this.handleFetchError(error);
        }
    }

    processPriceData(data) {
        // Store previous prices before updating
        this.previousPrices = new Map(this.currentPrices);

        // Update current prices
        for (const [coin, priceData] of Object.entries(data)) {
            this.currentPrices.set(coin, {
                price: priceData.usd,
                change24h: priceData.usd_24h_change || 0,
                timestamp: Date.now()
            });
        }

        // Update UI for each coin
        this.coins.forEach(coin => {
            this.updatePriceChip(coin);
        });

        // Update last update time
        this.updateLastUpdateTime();
    }

    updatePriceChip(coin) {
        const chipElement = document.querySelector(`[data-coin="${coin}"]`);
        if (!chipElement) return;

        const currentData = this.currentPrices.get(coin);
        const previousData = this.previousPrices.get(coin);

        if (!currentData) {
            console.warn(`No data available for ${coin}`);
            return;
        }

        // Update price value
        const priceElement = chipElement.querySelector('.price-value');
        const formattedPrice = this.formatPrice(currentData.price);
        priceElement.textContent = `$${formattedPrice}`;

        // Update 24h change
        const changeElement = chipElement.querySelector('.price-change');
        const changeValue = currentData.change24h;
        const formattedChange = changeValue >= 0 
            ? `+${changeValue.toFixed(2)}%` 
            : `${changeValue.toFixed(2)}%`;
        
        changeElement.textContent = formattedChange;
        changeElement.className = `price-change ${changeValue >= 0 ? 'positive' : 'negative'}`;

        // Determine trend and update arrow
        const trendArrow = chipElement.querySelector('.trend-arrow');
        let trendDirection = 'neutral';
        
        if (previousData && previousData.price !== currentData.price) {
            if (currentData.price > previousData.price) {
                trendDirection = 'up';
                trendArrow.textContent = '▲';
                trendArrow.className = 'trend-arrow up';
                this.addGlowPulse(chipElement, 'up');
            } else if (currentData.price < previousData.price) {
                trendDirection = 'down';
                trendArrow.textContent = '▼';
                trendArrow.className = 'trend-arrow down';
                this.addGlowPulse(chipElement, 'down');
            }
            
            console.log(`📈 ${coin.toUpperCase()}: ${this.formatPrice(previousData.price)} → ${formattedPrice} (${trendDirection})`);
        } else {
            // Neutral/idle state
            trendArrow.textContent = '●';
            trendArrow.className = 'trend-arrow neutral';
            chipElement.className = chipElement.className.replace(/pulse-(up|down)/g, '').trim() + ' idle';
        }

        // Remove loading state
        chipElement.classList.remove('loading');

        // Handle rate-limited or offline states
        if (this.isRateLimited) {
            chipElement.classList.add('rate-limited');
        } else {
            chipElement.classList.remove('rate-limited');
        }

        if (this.isOffline) {
            chipElement.classList.add('offline');
        } else {
            chipElement.classList.remove('offline');
        }
    }

    addGlowPulse(element, direction) {
        // Remove any existing pulse classes
        element.classList.remove('pulse-up', 'pulse-down', 'idle');
        
        // Add new pulse class
        element.classList.add(`pulse-${direction}`);
        
        // Remove pulse class after animation completes
        setTimeout(() => {
            element.classList.remove(`pulse-${direction}`);
            element.classList.add('idle');
        }, 1000);
    }

    formatPrice(price) {
        if (price >= 1000) {
            return price.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        } else if (price >= 1) {
            return price.toFixed(2);
        } else if (price >= 0.01) {
            return price.toFixed(4);
        } else {
            return price.toFixed(6);
        }
    }

    handleRateLimit() {
        this.isRateLimited = true;
        this.updateConnectionStatus('rate-limited');
        
        // Apply rate-limited styling to all chips
        document.querySelectorAll('.price-chip').forEach(chip => {
            chip.classList.add('rate-limited');
        });

        // Increase update interval when rate limited
        const rateLimitedInterval = this.updateInterval * 2;
        console.log(`⏰ Switching to rate-limited interval: ${rateLimitedInterval / 1000}s`);
        
        this.stopUpdates();
        this.updateTimer = setTimeout(() => {
            this.startPriceUpdates();
        }, rateLimitedInterval);
    }

    handleFetchError(error) {
        this.retryCount++;
        console.error(`❌ Fetch error (attempt ${this.retryCount}/${this.maxRetries}):`, error);

        if (this.retryCount >= this.maxRetries) {
            console.log('🔄 Max retries reached, switching to offline mode');
            this.isOffline = true;
            this.updateConnectionStatus('offline');
            
            // Apply offline styling to all chips
            document.querySelectorAll('.price-chip').forEach(chip => {
                chip.classList.add('offline');
            });
        } else {
            // Retry with exponential backoff
            const retryDelay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
            console.log(`🔄 Retrying in ${retryDelay / 1000}s...`);
            
            setTimeout(() => {
                this.fetchPrices();
            }, retryDelay);
        }
    }

    startPriceUpdates() {
        console.log('▶️ Starting price updates');
        this.fetchPrices(); // Initial fetch
        
        this.updateTimer = setInterval(() => {
            this.fetchPrices();
            this.resetCountdown();
        }, this.updateInterval);
    }

    stopUpdates() {
        console.log('⏸️ Stopping price updates');
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }

    pauseUpdates() {
        console.log('⏸️ Pausing updates (page hidden)');
        this.stopUpdates();
    }

    resumeUpdates() {
        console.log('▶️ Resuming updates (page visible)');
        if (!this.updateTimer) {
            this.startPriceUpdates();
            this.startCountdown();
        }
    }

    startCountdown() {
        this.countdownTimer = setInterval(() => {
            this.countdownSeconds--;
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.textContent = this.countdownSeconds;
            }

            if (this.countdownSeconds <= 0) {
                this.resetCountdown();
            }
        }, 1000);
    }

    resetCountdown() {
        this.countdownSeconds = this.updateInterval / 1000;
    }

    updateConnectionStatus(status) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (statusIndicator && statusText) {
            statusIndicator.className = `status-indicator ${status}`;
            
            const statusMessages = {
                online: 'Online',
                offline: 'Offline',
                'rate-limited': 'Rate Limited'
            };
            
            statusText.textContent = statusMessages[status] || 'Unknown';
        }
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.querySelector('.last-update');
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            lastUpdateElement.textContent = `Last update: ${timeString}`;
        }
    }

    // Public method to manually refresh prices
    refresh() {
        console.log('🔄 Manual refresh requested');
        this.stopUpdates();
        this.startPriceUpdates();
        this.startCountdown();
    }

    // Public method to get current price data
    getCurrentPrices() {
        return Object.fromEntries(this.currentPrices);
    }

    // Public method to toggle between different update intervals
    setUpdateInterval(seconds) {
        if (seconds < 10) {
            console.warn('⚠️ Update interval cannot be less than 10 seconds');
            return;
        }
        
        this.updateInterval = seconds * 1000;
        console.log(`⏰ Update interval changed to ${seconds}s`);
        
        this.stopUpdates();
        this.startPriceUpdates();
        this.startCountdown();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM loaded, initializing Vault Price Chips...');
    
    // Create global instance
    window.vaultPriceChips = new VaultPriceChips();
    
    // Add some debug methods to window for testing
    window.vaultDebug = {
        refresh: () => window.vaultPriceChips.refresh(),
        getPrices: () => window.vaultPriceChips.getCurrentPrices(),
        setInterval: (seconds) => window.vaultPriceChips.setUpdateInterval(seconds)
    };
    
    console.log('✅ Vault Price Chips ready! Debug methods available via window.vaultDebug');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.vaultPriceChips) {
        window.vaultPriceChips.stopUpdates();
    }
});