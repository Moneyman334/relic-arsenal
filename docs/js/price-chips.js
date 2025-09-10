/**
 * Cosmic Vault - Price Chips with Sparklines
 * ChaosKey333 Arsenal
 */

class CosmicVault {
    constructor() {
        this.coins = [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
            { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
            { id: 'solana', symbol: 'SOL', name: 'Solana' },
            { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
            { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' }
        ];
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
        this.rateLimitDelay = 1000; // 1 second between requests
        this.lastRequestTime = 0;
        
        this.init();
    }

    async init() {
        try {
            await this.loadPriceChips();
        } catch (error) {
            this.showError('Failed to initialize Cosmic Vault: ' + error.message);
        }
    }

    async loadPriceChips() {
        const priceGrid = document.querySelector('.price-grid');
        priceGrid.innerHTML = '<div class="loading-message">🔮 Summoning price oracles from the crypto dimensions...</div>';

        try {
            // Rate limiting
            const now = Date.now();
            if (now - this.lastRequestTime < this.rateLimitDelay) {
                await this.delay(this.rateLimitDelay - (now - this.lastRequestTime));
            }

            const priceData = await this.fetchPriceData();
            const historyPromises = this.coins.map(coin => this.fetchHistoricalData(coin.id));
            const historicalData = await Promise.all(historyPromises);

            priceGrid.innerHTML = '';

            this.coins.forEach((coin, index) => {
                const coinData = priceData.find(c => c.id === coin.id);
                const coinHistory = historicalData[index];
                
                if (coinData && coinHistory) {
                    const chipElement = this.createPriceChip(coinData, coinHistory);
                    priceGrid.appendChild(chipElement);
                }
            });

            this.lastRequestTime = Date.now();
        } catch (error) {
            this.showError('Failed to summon price data: ' + error.message);
        }
    }

    async fetchPriceData() {
        const cacheKey = 'price-data';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        const coinIds = this.coins.map(coin => coin.id).join(',');
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('CoinGecko API request failed');
            }
            
            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            
            return data;
        } catch (error) {
            console.warn('Using mock data due to API error:', error.message);
            // Return mock data for testing/demo purposes
            return this.getMockPriceData();
        }
    }

    getMockPriceData() {
        return [
            {
                id: 'bitcoin',
                symbol: 'btc',
                name: 'Bitcoin',
                image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
                current_price: 43250.50,
                price_change_percentage_24h: 2.45
            },
            {
                id: 'ethereum',
                symbol: 'eth',
                name: 'Ethereum',
                image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                current_price: 2680.75,
                price_change_percentage_24h: -1.23
            },
            {
                id: 'cardano',
                symbol: 'ada',
                name: 'Cardano',
                image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
                current_price: 0.485123,
                price_change_percentage_24h: 5.67
            },
            {
                id: 'solana',
                symbol: 'sol',
                name: 'Solana',
                image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
                current_price: 95.42,
                price_change_percentage_24h: -3.21
            },
            {
                id: 'chainlink',
                symbol: 'link',
                name: 'Chainlink',
                image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
                current_price: 14.67,
                price_change_percentage_24h: 1.89
            },
            {
                id: 'polkadot',
                symbol: 'dot',
                name: 'Polkadot',
                image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
                current_price: 7.23,
                price_change_percentage_24h: -0.45
            }
        ];
    }

    async fetchHistoricalData(coinId) {
        const cacheKey = `history-${coinId}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        // Rate limiting for individual coin requests
        await this.delay(100); // Small delay between individual requests

        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Failed to fetch history for ${coinId}, using mock data`);
                return this.getMockHistoricalData(coinId);
            }
            
            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            
            return data;
        } catch (error) {
            console.warn(`Error fetching history for ${coinId}, using mock data:`, error);
            return this.getMockHistoricalData(coinId);
        }
    }

    getMockHistoricalData(coinId) {
        // Generate mock 24-hour price data with realistic fluctuations
        const basePrice = this.getBasePriceForCoin(coinId);
        const points = 24; // 24 hourly data points
        const prices = [];
        
        for (let i = 0; i < points; i++) {
            const timestamp = Date.now() - (points - i) * 60 * 60 * 1000; // Hourly intervals
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const price = basePrice * (1 + variation * (i / points)); // Gradual trend
            prices.push([timestamp, price]);
        }
        
        return { prices };
    }

    getBasePriceForCoin(coinId) {
        const basePrices = {
            'bitcoin': 43000,
            'ethereum': 2700,
            'cardano': 0.48,
            'solana': 95,
            'chainlink': 14.5,
            'polkadot': 7.2
        };
        return basePrices[coinId] || 100;
    }

    createPriceChip(coinData, historicalData) {
        const chip = document.createElement('div');
        chip.className = 'price-chip';
        
        const priceChange = coinData.price_change_percentage_24h || 0;
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const changeIcon = priceChange >= 0 ? '▲' : '▼';
        
        chip.innerHTML = `
            <div class="chip-header">
                <img src="${coinData.image}" alt="${coinData.name}" class="coin-icon" />
                <div class="coin-info">
                    <h3>${coinData.name}</h3>
                    <div class="coin-symbol">${coinData.symbol}</div>
                </div>
            </div>
            <div class="price-display">
                <div class="current-price">$${this.formatPrice(coinData.current_price)}</div>
                <div class="price-change ${changeClass}">
                    ${changeIcon} ${Math.abs(priceChange).toFixed(2)}%
                </div>
            </div>
            <div class="sparkline-container">
                <canvas class="sparkline-canvas" width="280" height="60"></canvas>
                <div class="sparkline-overlay"></div>
            </div>
        `;

        // Draw sparkline after adding to DOM
        setTimeout(() => {
            const canvas = chip.querySelector('.sparkline-canvas');
            if (canvas && historicalData.prices && historicalData.prices.length > 0) {
                this.drawSparkline(canvas, historicalData.prices, priceChange >= 0);
            }
        }, 100);

        return chip;
    }

    drawSparkline(canvas, priceData, isPositive) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (priceData.length < 2) return;

        // Extract prices from [timestamp, price] pairs
        const prices = priceData.map(point => point[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        
        if (priceRange === 0) return;

        // Create points for the line
        const points = prices.map((price, index) => ({
            x: (index / (prices.length - 1)) * width,
            y: height - ((price - minPrice) / priceRange) * height
        }));

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        if (isPositive) {
            gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
            gradient.addColorStop(1, 'rgba(74, 222, 128, 0.05)');
        } else {
            gradient.addColorStop(0, 'rgba(248, 113, 113, 0.3)');
            gradient.addColorStop(1, 'rgba(248, 113, 113, 0.05)');
        }

        // Draw area under curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, height);
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.lineTo(point.x, point.y);
            } else {
                // Smooth curve using quadratic curves
                const prevPoint = points[index - 1];
                const cpx = (prevPoint.x + point.x) / 2;
                ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, (prevPoint.y + point.y) / 2);
            }
        });
        ctx.lineTo(points[points.length - 1].x, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((point, index) => {
            if (index === 0) return;
            const prevPoint = points[index - 1];
            const cpx = (prevPoint.x + point.x) / 2;
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, (prevPoint.y + point.y) / 2);
        });
        
        ctx.strokeStyle = isPositive ? '#4ade80' : '#f87171';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = isPositive ? '#4ade80' : '#f87171';
        ctx.shadowBlur = 8;
        ctx.stroke();
    }

    formatPrice(price) {
        if (price >= 1000) {
            return price.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        } else if (price >= 1) {
            return price.toFixed(4);
        } else {
            return price.toFixed(6);
        }
    }

    showError(message) {
        const priceGrid = document.querySelector('.price-grid');
        priceGrid.innerHTML = `
            <div class="error-message">
                ⚠️ ${message}
                <br><br>
                <button onclick="vault.loadPriceChips()" style="
                    background: rgba(255, 215, 0, 0.2);
                    border: 1px solid #ffd700;
                    color: #ffd700;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">🔄 Retry Summoning</button>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Auto-refresh functionality
    startAutoRefresh(intervalMinutes = 5) {
        setInterval(() => {
            this.loadPriceChips();
        }, intervalMinutes * 60 * 1000);
    }
}

// Initialize the Cosmic Vault when DOM is ready
let vault;
document.addEventListener('DOMContentLoaded', () => {
    vault = new CosmicVault();
    // Start auto-refresh every 5 minutes
    vault.startAutoRefresh(5);
});

// Make vault available globally for error retry
window.vault = vault;