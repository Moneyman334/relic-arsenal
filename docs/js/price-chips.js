/**
 * Price Chips - ChaosKey333 Vault Access Portal
 * Real-time cryptocurrency price fetching with CoinGecko API
 */

class VaultPriceChips {
    constructor() {
        this.apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
        this.coins = {
            'ethereum': 'ethereum',
            'bitcoin': 'bitcoin',
            'litecoin': 'litecoin',
            'solana': 'solana'
        };
        this.refreshInterval = 60000; // 60 seconds
        this.statusIndicator = null;
        this.intervalId = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        this.init();
    }

    init() {
        console.log('🔑 Initializing Vault Price Chips...');
        this.createStatusIndicator();
        this.fetchPrices();
        this.startAutoRefresh();
        
        // Add error handling for network connectivity
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored - resuming price updates');
            this.updateStatus('Reconnected - Updating prices...', 'online');
            this.fetchPrices();
        });
        
        window.addEventListener('offline', () => {
            console.log('📡 Connection lost - prices will update when reconnected');
            this.updateStatus('Offline - Prices cached', 'error');
        });
    }

    createStatusIndicator() {
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.className = 'status-indicator';
        this.statusIndicator.textContent = 'Initializing Vault...';
        document.body.appendChild(this.statusIndicator);
    }

    updateStatus(message, type = '') {
        if (this.statusIndicator) {
            this.statusIndicator.textContent = message;
            this.statusIndicator.className = `status-indicator ${type}`;
        }
    }

    async fetchPrices() {
        try {
            this.updateStatus('⚡ Updating prices...', '');
            
            const coinIds = Object.values(this.coins).join(',');
            const response = await fetch(
                `${this.apiUrl}?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('💎 Price data received:', data);
            
            this.updatePriceChips(data);
            this.updateStatus('🟢 Live prices active', 'online');
            this.retryCount = 0; // Reset retry count on success
            
        } catch (error) {
            console.error('❌ Error fetching prices:', error);
            this.handleError(error);
        }
    }

    updatePriceChips(priceData) {
        const priceChips = document.querySelectorAll('.price-chip[data-coin]');
        
        priceChips.forEach(chip => {
            const coinDataKey = chip.dataset.coin;
            const coinId = this.coins[coinDataKey];
            
            if (coinId && priceData[coinId]) {
                const price = priceData[coinId].usd;
                const change24h = priceData[coinId].usd_24h_change;
                
                // Format price based on value
                let formattedPrice;
                if (price >= 1000) {
                    formattedPrice = `$${price.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`;
                } else if (price >= 1) {
                    formattedPrice = `$${price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;
                } else {
                    formattedPrice = `$${price.toFixed(4)}`;
                }
                
                // Add 24h change indicator
                const changeSymbol = change24h > 0 ? '↗' : change24h < 0 ? '↘' : '→';
                const changeColor = change24h > 0 ? '#00ff00' : change24h < 0 ? '#ff4444' : '#ffffff';
                
                chip.innerHTML = `
                    ${formattedPrice} 
                    <span style="color: ${changeColor}; font-size: 0.8em;">
                        ${changeSymbol} ${Math.abs(change24h).toFixed(1)}%
                    </span>
                `;
                
                // Remove loading and error classes
                chip.classList.remove('loading', 'error');
                
                // Add subtle animation on update
                chip.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    chip.style.transform = 'scale(1)';
                }, 200);
                
            } else {
                this.setPriceChipError(chip, 'Data unavailable');
            }
        });
    }

    setPriceChipError(chip, fallbackText = '—') {
        chip.textContent = fallbackText;
        chip.classList.remove('loading');
        chip.classList.add('error');
    }

    handleError(error) {
        console.error('🚨 Price fetch failed:', error.message);
        
        // Update all price chips to show error state
        const priceChips = document.querySelectorAll('.price-chip[data-coin]');
        priceChips.forEach(chip => {
            if (!chip.textContent.includes('$')) {
                // Only show error if there's no cached price
                this.setPriceChipError(chip, '— —');
            }
        });

        // Implement exponential backoff for retries
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            const retryDelay = Math.pow(2, this.retryCount) * 1000; // 2s, 4s, 8s
            
            this.updateStatus(`⚠️ Retrying in ${retryDelay/1000}s... (${this.retryCount}/${this.maxRetries})`, 'error');
            
            setTimeout(() => {
                this.fetchPrices();
            }, retryDelay);
        } else {
            this.updateStatus('❌ Price updates unavailable', 'error');
            // Reset retry count after 5 minutes to allow fresh attempts
            setTimeout(() => {
                this.retryCount = 0;
            }, 300000);
        }
    }

    startAutoRefresh() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            console.log('🔄 Auto-refreshing prices...');
            this.fetchPrices();
        }, this.refreshInterval);

        console.log(`⏰ Auto-refresh started (every ${this.refreshInterval/1000} seconds)`);
    }

    stopAutoRefresh() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('⏹️ Auto-refresh stopped');
        }
    }

    // Method to manually refresh prices
    refresh() {
        console.log('🔧 Manual refresh triggered');
        this.fetchPrices();
    }

    // Cleanup method
    destroy() {
        this.stopAutoRefresh();
        if (this.statusIndicator) {
            this.statusIndicator.remove();
        }
        console.log('🧹 Vault Price Chips destroyed');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded - Starting Vault Price Chips system');
    
    // Add loading state to all price chips initially
    const priceChips = document.querySelectorAll('.price-chip[data-coin]');
    priceChips.forEach(chip => {
        chip.textContent = 'Loading...';
        chip.classList.add('loading');
    });
    
    // Initialize the price chip system
    window.vaultPriceChips = new VaultPriceChips();
    
    // Add manual refresh capability (for testing)
    window.refreshPrices = () => window.vaultPriceChips.refresh();
    
    console.log('💎 Vault Access Portal initialized - ChaosKey333');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.vaultPriceChips) {
        window.vaultPriceChips.destroy();
    }
});