/**
 * Social Echo UI Components
 * Interactive interface for the Social Echo Layer
 */

class SocialEchoUI {
    constructor() {
        this.socialEcho = new SocialEchoLayer();
        this.collectorArchive = window.collectorArchive;
        this.currentRelic = null;
        this.initializeUI();
    }

    /**
     * Initialize the UI components
     */
    async initializeUI() {
        this.addCosmicStyles();
        await this.createRelicGallery();
        this.createShareInterface();
        this.bindEvents();
    }

    /**
     * Add cosmic styling for the UI
     */
    addCosmicStyles() {
        if (document.querySelector('#social-echo-styles')) return;

        const style = document.createElement('style');
        style.id = 'social-echo-styles';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

            .social-echo-container {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2a 30%, #2a1a3a 70%, #0a0a0a 100%);
                min-height: 100vh;
                padding: 20px;
                font-family: 'Space Mono', monospace;
                color: #e0e0e0;
                position: relative;
                overflow-x: hidden;
            }

            .social-echo-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                    radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(138, 43, 226, 0.08) 0%, transparent 50%);
                pointer-events: none;
            }

            .cosmic-header {
                text-align: center;
                margin-bottom: 40px;
                position: relative;
                z-index: 1;
            }

            .cosmic-header h1 {
                font-family: 'Orbitron', monospace;
                font-size: 3rem;
                font-weight: 900;
                background: linear-gradient(45deg, #8a2be2, #4b0082, #00ff88);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 10px;
                text-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
                animation: pulseGlow 3s ease-in-out infinite alternate;
            }

            @keyframes pulseGlow {
                from { text-shadow: 0 0 20px rgba(138, 43, 226, 0.5); }
                to { text-shadow: 0 0 30px rgba(138, 43, 226, 0.8), 0 0 40px rgba(138, 43, 226, 0.3); }
            }

            .cosmic-subtitle {
                font-size: 1.2rem;
                color: #cccccc;
                margin-bottom: 5px;
            }

            .cosmic-motto {
                font-style: italic;
                color: #8a2be2;
                font-size: 0.9rem;
            }

            .relic-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
                position: relative;
                z-index: 1;
            }

            .relic-card {
                background: rgba(26, 10, 42, 0.8);
                border: 2px solid rgba(138, 43, 226, 0.3);
                border-radius: 15px;
                padding: 20px;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .relic-card:hover {
                border-color: #8a2be2;
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(138, 43, 226, 0.3);
            }

            .relic-card.selected {
                border-color: #00ff88;
                background: rgba(42, 26, 58, 0.9);
                box-shadow: 0 0 25px rgba(138, 43, 226, 0.5);
            }

            .relic-card::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(138, 43, 226, 0.1), transparent);
                transform: rotate(45deg);
                transition: all 0.5s;
                opacity: 0;
            }

            .relic-card:hover::before {
                animation: shimmer 1.5s ease-in-out;
                opacity: 1;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }

            .relic-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }

            .relic-icon {
                font-size: 2rem;
                margin-right: 15px;
                filter: drop-shadow(0 0 10px rgba(138, 43, 226, 0.6));
            }

            .relic-title {
                font-family: 'Orbitron', monospace;
                font-size: 1.3rem;
                font-weight: 700;
                color: #ffffff;
                margin: 0;
            }

            .relic-rarity {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: bold;
                text-transform: uppercase;
                margin-left: 10px;
            }

            .rarity-cosmic { background: linear-gradient(45deg, #8a2be2, #4b0082); }
            .rarity-legendary { background: linear-gradient(45deg, #ff6b35, #f7931e); }
            .rarity-mythic { background: linear-gradient(45deg, #ff1744, #e91e63); }
            .rarity-epic { background: linear-gradient(45deg, #673ab7, #9c27b0); }
            .rarity-transcendent { background: linear-gradient(45deg, #00ff88, #00bcd4); }
            .rarity-royal { background: linear-gradient(45deg, #ffd700, #ffb300); }

            .relic-lore {
                color: #cccccc;
                font-size: 0.9rem;
                line-height: 1.4;
                margin: 10px 0;
                max-height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .relic-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(138, 43, 226, 0.3);
            }

            .relic-price {
                font-family: 'Orbitron', monospace;
                font-size: 1.1rem;
                font-weight: 700;
                color: #00ff88;
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            }

            .relic-power {
                font-size: 0.9rem;
                color: #8a2be2;
            }

            .share-interface {
                background: rgba(16, 8, 32, 0.9);
                border: 2px solid rgba(138, 43, 226, 0.5);
                border-radius: 20px;
                padding: 30px;
                margin-top: 30px;
                text-align: center;
                position: relative;
                z-index: 1;
            }

            .share-interface h2 {
                font-family: 'Orbitron', monospace;
                color: #8a2be2;
                margin-bottom: 20px;
                font-size: 1.8rem;
            }

            .share-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin: 20px 0;
                flex-wrap: wrap;
            }

            .share-btn {
                padding: 15px 25px;
                border: none;
                border-radius: 50px;
                font-family: 'Orbitron', monospace;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                min-width: 150px;
            }

            .share-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
            }

            .share-btn-twitter {
                background: linear-gradient(45deg, #1da1f2, #0d8bd9);
                color: white;
            }

            .share-btn-instagram {
                background: linear-gradient(45deg, #e4405f, #fd1d1d, #fcb045);
                color: white;
            }

            .share-btn-tiktok {
                background: linear-gradient(45deg, #ff0050, #000000);
                color: white;
            }

            .share-btn-generate {
                background: linear-gradient(45deg, #8a2be2, #4b0082);
                color: white;
            }

            .share-btn:not(:disabled):hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 20px rgba(138, 43, 226, 0.4);
            }

            .relic-preview {
                margin: 20px 0;
                text-align: center;
            }

            .relic-preview img {
                max-width: 400px;
                width: 100%;
                height: auto;
                border: 2px solid #8a2be2;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
            }

            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(138, 43, 226, 0.3);
                border-top: 2px solid #8a2be2;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .market-stats {
                background: rgba(26, 10, 42, 0.6);
                border: 1px solid rgba(138, 43, 226, 0.3);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                gap: 10px;
            }

            .stat-item {
                text-align: center;
                min-width: 100px;
            }

            .stat-value {
                font-family: 'Orbitron', monospace;
                font-size: 1.2rem;
                font-weight: 700;
                color: #00ff88;
            }

            .stat-label {
                font-size: 0.8rem;
                color: #cccccc;
                text-transform: uppercase;
            }

            @media (max-width: 768px) {
                .cosmic-header h1 { font-size: 2rem; }
                .relic-gallery { grid-template-columns: 1fr; }
                .share-buttons { flex-direction: column; align-items: center; }
                .market-stats { flex-direction: column; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Create the relic gallery interface
     */
    async createRelicGallery() {
        const container = document.createElement('div');
        container.className = 'social-echo-container';
        container.innerHTML = `
            <div class="cosmic-header">
                <h1>⚛️⚡👑 Social Echo Layer 👑⚡⚛️</h1>
                <div class="cosmic-subtitle">Transform Relics into Cosmic Storms</div>
                <div class="cosmic-motto">"Through quantum tempests, we forge eternity."</div>
            </div>
            
            <div class="market-stats" id="market-stats">
                <div class="stat-item">
                    <div class="stat-value" id="total-relics">-</div>
                    <div class="stat-label">Relics</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="avg-price">-</div>
                    <div class="stat-label">Avg Price</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="market-trend">-</div>
                    <div class="stat-label">Trend</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="total-value">-</div>
                    <div class="stat-label">Total Value</div>
                </div>
            </div>

            <div class="relic-gallery" id="relic-gallery">
                <div class="loading-spinner"></div>
                Loading cosmic relics from the Collector Archive...
            </div>

            <div class="share-interface">
                <h2>🌌 Relic Snapshot Generator 🌌</h2>
                <p>Select a relic above to generate shareable cosmic snapshots</p>
                
                <div class="relic-preview" id="relic-preview" style="display: none;">
                    <img id="preview-image" alt="Relic Snapshot Preview">
                </div>

                <div class="share-buttons">
                    <button class="share-btn share-btn-generate" id="generate-btn" disabled>
                        <span class="btn-text">✨ Generate Snapshot</span>
                    </button>
                    <button class="share-btn share-btn-twitter" id="twitter-btn" disabled>
                        🐦 Share to X
                    </button>
                    <button class="share-btn share-btn-instagram" id="instagram-btn" disabled>
                        📸 Share to Instagram
                    </button>
                    <button class="share-btn share-btn-tiktok" id="tiktok-btn" disabled>
                        🎵 Share to TikTok
                    </button>
                </div>

                <div id="share-status" style="margin-top: 15px; color: #cccccc;"></div>
            </div>
        `;

        // Replace existing content or append to body
        const existingContainer = document.querySelector('.social-echo-container');
        if (existingContainer) {
            existingContainer.replaceWith(container);
        } else {
            document.body.appendChild(container);
        }

        await this.loadRelicGallery();
        await this.loadMarketStats();
    }

    /**
     * Load and display relics in the gallery
     */
    async loadRelicGallery() {
        const gallery = document.getElementById('relic-gallery');
        
        try {
            const relics = await this.collectorArchive.getAllRelics();
            gallery.innerHTML = '';

            for (const relic of relics) {
                const relicData = await this.collectorArchive.getRelic(relic.id);
                const card = this.createRelicCard(relicData);
                gallery.appendChild(card);
            }
        } catch (error) {
            gallery.innerHTML = `
                <div style="text-align: center; color: #ff6b6b; padding: 40px;">
                    ⚠️ Error loading relics from Collector Archive<br>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }

    /**
     * Create a relic card element
     */
    createRelicCard(relic) {
        const card = document.createElement('div');
        card.className = 'relic-card';
        card.dataset.relicId = relic.id;
        
        const rarityClass = `rarity-${relic.rarity.toLowerCase()}`;
        const icon = this.getRelicIcon(relic.element);

        card.innerHTML = `
            <div class="relic-header">
                <div class="relic-icon">${icon}</div>
                <div>
                    <h3 class="relic-title">${relic.name}</h3>
                    <span class="relic-rarity ${rarityClass}">${relic.rarity}</span>
                </div>
            </div>
            <div class="relic-lore">${relic.lore}</div>
            <div class="relic-stats">
                <div class="relic-price">⚡ ${relic.price} GLOW</div>
                <div class="relic-power">Power: ${relic.power.toLocaleString()}</div>
            </div>
        `;

        card.addEventListener('click', () => this.selectRelic(relic, card));
        return card;
    }

    /**
     * Get appropriate icon for relic element
     */
    getRelicIcon(element) {
        const icons = {
            Quantum: '⚛️',
            Thunder: '⚡',
            Crown: '👑',
            Composite: '🌀',
            Master: '🔑',
            Star: '⭐',
            Lightning: '🌩️',
            Vortex: '🌪️'
        };
        return icons[element] || '✨';
    }

    /**
     * Select a relic for snapshot generation
     */
    selectRelic(relic, cardElement) {
        // Remove selection from other cards
        document.querySelectorAll('.relic-card.selected').forEach(card => {
            card.classList.remove('selected');
        });

        // Select current card
        cardElement.classList.add('selected');
        this.currentRelic = relic;

        // Enable generate button
        const generateBtn = document.getElementById('generate-btn');
        generateBtn.disabled = false;

        // Update status
        const status = document.getElementById('share-status');
        status.textContent = `Selected: ${relic.name} - Ready to generate snapshot`;
        status.style.color = '#00ff88';
    }

    /**
     * Load and display market statistics
     */
    async loadMarketStats() {
        try {
            const stats = await this.collectorArchive.getMarketStats();
            
            document.getElementById('total-relics').textContent = stats.totalRelics;
            document.getElementById('avg-price').textContent = `${(stats.averagePrice / 1000).toFixed(1)}k`;
            document.getElementById('market-trend').textContent = stats.marketTrend;
            document.getElementById('total-value').textContent = `${Math.round(stats.totalValue / 1000)}k`;
        } catch (error) {
            console.error('Failed to load market stats:', error);
        }
    }

    /**
     * Create share interface and bind events
     */
    createShareInterface() {
        // Interface is already created in createRelicGallery
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        const generateBtn = document.getElementById('generate-btn');
        const twitterBtn = document.getElementById('twitter-btn');
        const instagramBtn = document.getElementById('instagram-btn');
        const tiktokBtn = document.getElementById('tiktok-btn');

        generateBtn.addEventListener('click', () => this.generateSnapshot());
        twitterBtn.addEventListener('click', () => this.shareToTwitter());
        instagramBtn.addEventListener('click', () => this.shareToInstagram());
        tiktokBtn.addEventListener('click', () => this.shareToTikTok());

        // Auto-refresh market stats every 30 seconds
        setInterval(() => this.loadMarketStats(), 30000);
    }

    /**
     * Generate snapshot for selected relic
     */
    async generateSnapshot() {
        if (!this.currentRelic) return;

        const generateBtn = document.getElementById('generate-btn');
        const btnText = generateBtn.querySelector('.btn-text');
        const status = document.getElementById('share-status');
        const preview = document.getElementById('relic-preview');
        const previewImg = document.getElementById('preview-image');

        // Show loading state
        btnText.innerHTML = '<div class="loading-spinner"></div>Generating...';
        generateBtn.disabled = true;
        status.textContent = 'Generating cosmic snapshot...';
        status.style.color = '#8a2be2';

        try {
            // Generate snapshot
            const dataUrl = await this.socialEcho.generateSnapshot(this.currentRelic);
            
            // Show preview
            previewImg.src = dataUrl;
            preview.style.display = 'block';
            
            // Enable share buttons
            document.getElementById('twitter-btn').disabled = false;
            document.getElementById('instagram-btn').disabled = false;
            document.getElementById('tiktok-btn').disabled = false;

            status.textContent = 'Snapshot generated! Ready to share across social realms.';
            status.style.color = '#00ff88';

        } catch (error) {
            status.textContent = `Error generating snapshot: ${error.message}`;
            status.style.color = '#ff6b6b';
            console.error('Snapshot generation error:', error);
        } finally {
            // Reset button
            btnText.textContent = '✨ Generate Snapshot';
            generateBtn.disabled = false;
        }
    }

    /**
     * Share to Twitter/X
     */
    shareToTwitter() {
        if (!this.currentRelic) return;
        
        const previewImg = document.getElementById('preview-image');
        if (previewImg.src) {
            this.socialEcho.shareToTwitter(this.currentRelic, previewImg.src);
        }
    }

    /**
     * Share to Instagram
     */
    shareToInstagram() {
        if (!this.currentRelic) return;
        
        const previewImg = document.getElementById('preview-image');
        if (previewImg.src) {
            this.socialEcho.shareToInstagram(this.currentRelic, previewImg.src);
        }
    }

    /**
     * Share to TikTok
     */
    shareToTikTok() {
        if (!this.currentRelic) return;
        
        const previewImg = document.getElementById('preview-image');
        if (previewImg.src) {
            this.socialEcho.shareToTikTok(this.currentRelic, previewImg.src);
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for dependencies to load
    if (window.SocialEchoLayer && window.collectorArchive) {
        new SocialEchoUI();
    } else {
        // Wait and retry
        setTimeout(() => {
            if (window.SocialEchoLayer && window.collectorArchive) {
                new SocialEchoUI();
            } else {
                console.error('Social Echo Layer dependencies not loaded');
            }
        }, 1000);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialEchoUI;
}

window.SocialEchoUI = SocialEchoUI;