/**
 * ChaosKey333 Vault - Sacred Price Oracle System
 * Integrates live price data with cosmic wisdom and blockchain portal links
 */

class VaultOracle {
    constructor() {
        this.apiBaseUrl = 'https://api.coingecko.com/api/v3';
        this.lastFetchTime = 0;
        this.fetchCooldown = 10000; // 10 seconds between API calls
        this.tooltip = document.getElementById('tooltip');
        this.retryAttempts = 3;
        this.retryDelay = 2000;
        
        // Cryptocurrency configuration with explorer mappings
        this.coinConfig = {
            'bitcoin': {
                name: 'Bitcoin',
                symbol: 'BTC',
                icon: '₿',
                coinGeckoId: 'bitcoin',
                explorer: {
                    name: 'Blockchain.info',
                    baseUrl: 'https://www.blockchain.com/btc/address/'
                }
            },
            'ethereum': {
                name: 'Ethereum',
                symbol: 'ETH',
                icon: '♦',
                coinGeckoId: 'ethereum',
                explorer: {
                    name: 'Etherscan',
                    baseUrl: 'https://etherscan.io/'
                }
            },
            'solana': {
                name: 'Solana',
                symbol: 'SOL',
                icon: '◎',
                coinGeckoId: 'solana',
                explorer: {
                    name: 'Solscan',
                    baseUrl: 'https://solscan.io/'
                }
            },
            'cardano': {
                name: 'Cardano',
                symbol: 'ADA',
                icon: '₳',
                coinGeckoId: 'cardano',
                explorer: {
                    name: 'CardanoScan',
                    baseUrl: 'https://cardanoscan.io/'
                }
            },
            'polygon': {
                name: 'Polygon',
                symbol: 'MATIC',
                icon: '⬢',
                coinGeckoId: 'matic-network',
                explorer: {
                    name: 'PolygonScan',
                    baseUrl: 'https://polygonscan.com/'
                }
            },
            'chainlink': {
                name: 'Chainlink',
                symbol: 'LINK',
                icon: '🔗',
                coinGeckoId: 'chainlink',
                explorer: {
                    name: 'Etherscan',
                    baseUrl: 'https://etherscan.io/'
                }
            }
        };
        
        this.init();
    }

    async init() {
        console.log('🔮 Initializing Sacred Vault Oracle...');
        this.setupEventListeners();
        await this.fetchAllPriceData();
        
        // Set up periodic updates every 30 seconds
        setInterval(() => {
            this.fetchAllPriceData();
        }, 30000);
    }

    setupEventListeners() {
        const priceChips = document.querySelectorAll('.price-chip');
        
        priceChips.forEach(chip => {
            // Click event for explorer links
            chip.addEventListener('click', (e) => {
                const coinId = chip.dataset.coin;
                const config = this.coinConfig[coinId];
                if (config && config.explorer) {
                    window.open(config.explorer.baseUrl, '_blank');
                }
            });

            // Hover events for tooltips
            chip.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, chip);
            });

            chip.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            chip.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });
        });
    }

    async fetchAllPriceData() {
        const now = Date.now();
        if (now - this.lastFetchTime < this.fetchCooldown) {
            console.log('⏳ Cooldown active, skipping fetch...');
            return;
        }

        this.lastFetchTime = now;
        console.log('🌌 Fetching cosmic price data...');

        const coinIds = Object.values(this.coinConfig).map(config => config.coinGeckoId).join(',');
        const url = `${this.apiBaseUrl}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`;

        try {
            const response = await this.fetchWithRetry(url);
            const data = await response.json();
            
            console.log('✨ Price data received:', data);
            this.updatePriceChips(data);
        } catch (error) {
            console.error('💥 Failed to fetch price data, using cosmic demo data...', error);
            this.useDemoData();
        }
    }

    useDemoData() {
        console.log('🎭 Activating demo mode with cosmic price simulations...');
        
        // Generate realistic demo data
        const demoData = {
            'bitcoin': {
                usd: 43250.75,
                usd_24h_change: 2.34,
                last_updated_at: Math.floor(Date.now() / 1000) - 120
            },
            'ethereum': {
                usd: 2650.40,
                usd_24h_change: -1.87,
                last_updated_at: Math.floor(Date.now() / 1000) - 90
            },
            'solana': {
                usd: 98.76,
                usd_24h_change: 5.23,
                last_updated_at: Math.floor(Date.now() / 1000) - 180
            },
            'cardano': {
                usd: 0.4567,
                usd_24h_change: -0.89,
                last_updated_at: Math.floor(Date.now() / 1000) - 150
            },
            'matic-network': {
                usd: 0.8934,
                usd_24h_change: 3.45,
                last_updated_at: Math.floor(Date.now() / 1000) - 210
            },
            'chainlink': {
                usd: 14.67,
                usd_24h_change: 1.23,
                last_updated_at: Math.floor(Date.now() / 1000) - 135
            }
        };

        this.updatePriceChips(demoData);
        
        // Add demo indicator
        const subtitle = document.querySelector('.vault-subtitle');
        if (subtitle && !subtitle.textContent.includes('Demo Mode')) {
            subtitle.innerHTML += '<br><em>🎭 Demo Mode: Simulated cosmic price data</em>';
        }
    }

    async fetchWithRetry(url, attempts = this.retryAttempts) {
        for (let i = 0; i < attempts; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response;
            } catch (error) {
                console.warn(`Attempt ${i + 1} failed:`, error.message);
                if (i === attempts - 1) throw error;
                await this.delay(this.retryDelay * (i + 1));
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updatePriceChips(priceData) {
        Object.entries(this.coinConfig).forEach(([coinKey, config]) => {
            const chip = document.querySelector(`[data-coin="${coinKey}"]`);
            const coinData = priceData[config.coinGeckoId];
            
            if (!chip || !coinData) {
                console.warn(`⚠️ Missing data for ${coinKey}`);
                return;
            }

            this.updateSingleChip(chip, coinData, config);
        });
    }

    updateSingleChip(chip, coinData, config) {
        const currentPrice = chip.querySelector('.current-price');
        const priceChange = chip.querySelector('.price-change');
        
        // Remove loading state
        chip.classList.remove('loading');
        
        // Update price
        const price = coinData.usd;
        const formattedPrice = this.formatCurrency(price);
        currentPrice.innerHTML = formattedPrice;
        
        // Update price change
        const change24h = coinData.usd_24h_change;
        const formattedChange = this.formatPercentage(change24h);
        const changeClass = change24h >= 0 ? 'positive' : 'negative';
        
        priceChange.innerHTML = `24h: ${formattedChange}`;
        priceChange.className = `price-change ${changeClass}`;
        
        // Calculate realistic high/low based on current price and 24h change
        const changeRatio = Math.abs(change24h) / 100;
        const volatilityMultiplier = 1.2; // Add some extra volatility for more realistic high/low
        const high24h = change24h >= 0 
            ? price 
            : price * (1 + changeRatio * volatilityMultiplier);
        const low24h = change24h >= 0 
            ? price * (1 - changeRatio * volatilityMultiplier)
            : price;
        
        // Store data for tooltip
        chip.dataset.priceData = JSON.stringify({
            high24h: high24h,
            low24h: low24h,
            lastUpdated: coinData.last_updated_at || Date.now() / 1000,
            currentPrice: price,
            change24h: change24h
        });
        
        console.log(`📊 Updated ${config.name}: ${formattedPrice} (${formattedChange})`);
    }

    formatCurrency(value) {
        if (value >= 1) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        } else if (value >= 0.01) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            }).format(value);
        } else {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 6,
                maximumFractionDigits: 8
            }).format(value);
        }
    }

    formatPercentage(value) {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    }

    showTooltip(event, chip) {
        const priceData = chip.dataset.priceData;
        if (!priceData) return;

        try {
            const data = JSON.parse(priceData);
            
            // Update tooltip content
            document.getElementById('tooltip-high').textContent = this.formatCurrency(data.high24h);
            document.getElementById('tooltip-low').textContent = this.formatCurrency(data.low24h);
            document.getElementById('tooltip-updated').textContent = this.formatTimestamp(data.lastUpdated);
            
            // Show tooltip
            this.tooltip.classList.add('visible');
            this.updateTooltipPosition(event);
        } catch (error) {
            console.error('Failed to show tooltip:', error);
        }
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    updateTooltipPosition(event) {
        if (!this.tooltip.classList.contains('visible')) return;
        
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = event.pageX - tooltipRect.width / 2;
        let top = event.pageY - tooltipRect.height - 10;
        
        // Keep tooltip within viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        
        if (top < 10) {
            top = event.pageY + 10;
        }
        
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        } else if (diffMinutes < 1440) {
            return `${Math.floor(diffMinutes / 60)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    handleApiError() {
        const priceChips = document.querySelectorAll('.price-chip');
        priceChips.forEach(chip => {
            chip.classList.remove('loading');
            const currentPrice = chip.querySelector('.current-price');
            const priceChange = chip.querySelector('.price-change');
            
            currentPrice.innerHTML = '<span class="error-message">Oracle Disrupted</span>';
            priceChange.innerHTML = '<span class="error-message">Cosmic interference detected</span>';
        });
    }
}

// Additional CSS for footer styling
const additionalCSS = `
.vault-footer {
    text-align: center;
    margin-top: 3rem;
    padding: 2rem 0;
    border-top: 1px solid rgba(106, 27, 154, 0.3);
    color: var(--thunder-silver);
    opacity: 0.8;
}

.vault-footer p {
    margin-bottom: 0.5rem;
}

.vault-footer a {
    color: var(--stellar-gold);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.vault-footer a:hover {
    color: var(--plasma-cyan);
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}
`;

// Add additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the Vault Oracle when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔑 ChaosKey333 Vault Loading...');
    new VaultOracle();
});

// Handle visibility change to pause/resume updates
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🌙 Vault Oracle entering dormant state...');
    } else {
        console.log('🌅 Vault Oracle awakening...');
    }
});