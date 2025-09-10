// ⛧⚡👑 ChaosKey333 Vault Access Script 👑⚡⛧

class VaultManager {
    constructor() {
        this.chains = {
            doge: {
                name: 'Dogecoin',
                symbol: 'DOGE',
                address: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
                apiId: 'dogecoin',
                color: '#c2a633',
                explorer: 'https://dogechain.info/address/',
                sparklineData: []
            },
            bch: {
                name: 'Bitcoin Cash',
                symbol: 'BCH',
                address: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                apiId: 'bitcoin-cash',
                color: '#4caf50',
                explorer: 'https://blockchair.com/bitcoin-cash/address/',
                sparklineData: []
            },
            xrp: {
                name: 'XRP',
                symbol: 'XRP',
                address: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
                apiId: 'ripple',
                color: '#2196f3',
                explorer: 'https://xrpcharts.ripple.com/#/accounts/',
                sparklineData: []
            }
        };
        
        this.priceUpdateInterval = null;
        this.sparklineUpdateInterval = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeQRCodeErrorHandling();
        await this.loadInitialPrices();
        this.startPriceUpdates();
        this.initializeSparklines();
        this.addQuantumParticles();
        console.log('🔑 Vault Access initialized - The chains are forged!');
    }

    setupEventListeners() {
        // Copy button functionality
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const address = e.currentTarget.dataset.address;
                const chain = e.currentTarget.dataset.chain;
                this.copyToClipboard(address, chain, e.currentTarget);
            });
        });

        // Add hover effects to panels
        document.querySelectorAll('.chain-panel').forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                this.enhancePanel(panel, true);
            });
            panel.addEventListener('mouseleave', () => {
                this.enhancePanel(panel, false);
            });
        });

        // Add click effects to explorer buttons
        document.querySelectorAll('.explorer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.flashSuccess(e.currentTarget);
            });
        });
    }

    initializeQRCodeErrorHandling() {
        document.querySelectorAll('.chain-qr').forEach(img => {
            img.addEventListener('error', () => {
                // Create a placeholder QR code if image fails to load
                this.createQRPlaceholder(img);
            });
        });
    }

    createQRPlaceholder(imgElement) {
        const placeholder = document.createElement('div');
        placeholder.className = 'qr-placeholder';
        placeholder.style.cssText = `
            width: 200px;
            height: 200px;
            border: 2px solid currentColor;
            border-radius: var(--cosmic-radius);
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(45deg, #1a0933, #0a0a0a);
            font-size: 3rem;
            animation: placeholderPulse 2s ease-in-out infinite;
        `;
        placeholder.innerHTML = '🔑';
        
        imgElement.parentNode.replaceChild(placeholder, imgElement);
        
        // Add placeholder animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes placeholderPulse {
                0%, 100% { opacity: 0.7; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }

    async copyToClipboard(address, chain, button) {
        try {
            await navigator.clipboard.writeText(address);
            
            // Visual feedback
            const originalText = button.querySelector('.copy-text').textContent;
            const originalIcon = button.querySelector('.copy-icon').textContent;
            
            button.querySelector('.copy-text').textContent = 'COPIED!';
            button.querySelector('.copy-icon').textContent = '✅';
            button.classList.add('copied', 'success-flash');
            
            // Reset after delay
            setTimeout(() => {
                button.querySelector('.copy-text').textContent = originalText;
                button.querySelector('.copy-icon').textContent = originalIcon;
                button.classList.remove('copied', 'success-flash');
            }, 2000);
            
            console.log(`🔑 ${chain} address copied to clipboard`);
        } catch (err) {
            console.error('Failed to copy address:', err);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(address, button);
        }
    }

    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            button.classList.add('success-flash');
            setTimeout(() => button.classList.remove('success-flash'), 600);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }

    async loadInitialPrices() {
        const chainIds = Object.values(this.chains).map(chain => chain.apiId).join(',');
        
        try {
            // Add loading state
            Object.keys(this.chains).forEach(chainKey => {
                const priceElement = document.getElementById(`${chainKey}-price`);
                priceElement.classList.add('loading');
            });

            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${chainIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
            );
            
            if (!response.ok) throw new Error('Failed to fetch prices');
            
            const data = await response.json();
            
            Object.keys(this.chains).forEach(chainKey => {
                const chain = this.chains[chainKey];
                const priceData = data[chain.apiId];
                
                if (priceData) {
                    this.updatePriceDisplay(chainKey, priceData.usd, priceData.usd_24h_change || 0);
                }
                
                // Remove loading state
                const priceElement = document.getElementById(`${chainKey}-price`);
                priceElement.classList.remove('loading');
            });
            
            console.log('💰 Initial prices loaded successfully');
        } catch (error) {
            console.error('Failed to load prices:', error);
            this.showPriceError();
        }
    }

    updatePriceDisplay(chainKey, price, change) {
        const priceElement = document.getElementById(`${chainKey}-price`);
        const changeElement = document.getElementById(`${chainKey}-change`);
        
        if (priceElement) {
            const priceValue = priceElement.querySelector('.price-value');
            if (priceValue) {
                priceValue.textContent = price.toFixed(price < 1 ? 6 : 2);
            }
        }
        
        if (changeElement) {
            const changePercent = change.toFixed(2);
            changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
            changeElement.className = 'price-change ' + (changePercent >= 0 ? 'positive' : 'negative');
        }

        // Add price data to sparkline data
        const chain = this.chains[chainKey];
        if (chain) {
            chain.sparklineData.push(price);
            if (chain.sparklineData.length > 24) {
                chain.sparklineData.shift(); // Keep only last 24 data points
            }
        }
    }

    showPriceError() {
        Object.keys(this.chains).forEach(chainKey => {
            const priceElement = document.getElementById(`${chainKey}-price`);
            const priceValue = priceElement.querySelector('.price-value');
            const changeElement = document.getElementById(`${chainKey}-change`);
            
            priceValue.textContent = 'N/A';
            changeElement.textContent = '--';
            priceElement.classList.remove('loading');
        });
    }

    startPriceUpdates() {
        // Update prices every 60 seconds
        this.priceUpdateInterval = setInterval(() => {
            this.loadInitialPrices();
        }, 60000);
    }

    initializeSparklines() {
        Object.keys(this.chains).forEach(chainKey => {
            const canvas = document.getElementById(`${chainKey}-sparkline`);
            if (canvas) {
                // Generate some initial mock data for demonstration
                const chain = this.chains[chainKey];
                const basePrice = Math.random() * 100;
                for (let i = 0; i < 24; i++) {
                    const variation = (Math.random() - 0.5) * 0.1;
                    chain.sparklineData.push(basePrice * (1 + variation));
                }
                
                this.drawSparkline(chainKey);
            }
        });

        // Update sparklines every 30 seconds
        this.sparklineUpdateInterval = setInterval(() => {
            this.updateSparklines();
        }, 30000);
    }

    drawSparkline(chainKey) {
        const canvas = document.getElementById(`${chainKey}-sparkline`);
        const chain = this.chains[chainKey];
        
        if (!canvas || !chain.sparklineData.length) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        const data = chain.sparklineData;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sparkline
        ctx.strokeStyle = chain.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = chain.color;
        
        ctx.beginPath();
        data.forEach((price, index) => {
            const x = (index / (data.length - 1)) * canvas.width;
            const y = canvas.height - ((price - min) / range) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Add glow effect
        ctx.strokeStyle = chain.color + '40';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    updateSparklines() {
        Object.keys(this.chains).forEach(chainKey => {
            const chain = this.chains[chainKey];
            // Add some random variation to simulate price movement
            if (chain.sparklineData.length > 0) {
                const lastPrice = chain.sparklineData[chain.sparklineData.length - 1];
                const variation = (Math.random() - 0.5) * 0.05;
                const newPrice = lastPrice * (1 + variation);
                
                chain.sparklineData.push(newPrice);
                if (chain.sparklineData.length > 24) {
                    chain.sparklineData.shift();
                }
                
                this.drawSparkline(chainKey);
            }
        });
    }

    enhancePanel(panel, isHovering) {
        const panelGlow = panel.querySelector('.panel-glow');
        if (panelGlow) {
            panelGlow.style.opacity = isHovering ? '0.9' : '0.6';
            panelGlow.style.transform = isHovering ? 'scale(1.02)' : 'scale(1)';
        }
    }

    flashSuccess(element) {
        element.classList.add('success-flash');
        setTimeout(() => {
            element.classList.remove('success-flash');
        }, 600);
    }

    addQuantumParticles() {
        const background = document.querySelector('.cosmic-background');
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #00ffff;
                border-radius: 50%;
                box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff;
                animation: quantumFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            
            background.appendChild(particle);
        }
    }

    // Cleanup method
    destroy() {
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
        }
        if (this.sparklineUpdateInterval) {
            clearInterval(this.sparklineUpdateInterval);
        }
    }
}

// Initialize the Vault Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.vaultManager = new VaultManager();
});

// Handle page visibility changes to pause/resume updates
document.addEventListener('visibilitychange', () => {
    if (window.vaultManager) {
        if (document.hidden) {
            // Pause updates when tab is hidden
            window.vaultManager.destroy();
        } else {
            // Resume updates when tab becomes visible
            window.vaultManager = new VaultManager();
        }
    }
});

// Console art for the cosmic experience
console.log(`
⛧⚡👑 ChaosKey333 Vault Access 👑⚡⛧

  ╔══════════════════════════════════════╗
  ║           VAULT INITIALIZED          ║
  ║                                      ║
  ║  🔑 Multi-Chain Arsenal Portal 🔑    ║
  ║                                      ║
  ║  Through quantum tempests,           ║
  ║  we forge eternity.                  ║
  ╚══════════════════════════════════════╝

Available chains:
• DOGECOIN (🐕) - The People's Currency
• BITCOIN CASH (💰) - Peer-to-Peer Electronic Cash  
• XRP LEDGER (💎) - Digital Asset for Global Payments

The vault is sealed. The chains are forged.
`);

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultManager;
}