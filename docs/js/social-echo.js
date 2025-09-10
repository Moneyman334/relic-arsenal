/**
 * Social Echo Layer - ChaosKey333 Relic Arsenal
 * Transforms relics into cosmic storms across social realms
 * 
 * "Through quantum tempests, we forge eternity. In rolling thunder, we crown the dawn."
 */

class SocialEchoLayer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.initializeCanvas();
        this.loadCosmicFonts();
    }

    /**
     * Initialize HTML5 Canvas for snapshot generation
     */
    initializeCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1200;
        this.canvas.height = 630; // Social media optimized dimensions
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Load cosmic fonts for the aesthetic
     */
    async loadCosmicFonts() {
        // Load web fonts for cosmic aesthetic
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
            'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap'
        ];
        
        for (const fontLink of fontLinks) {
            if (!document.querySelector(`link[href="${fontLink}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = fontLink;
                document.head.appendChild(link);
            }
        }
    }

    /**
     * Generate a shareable PNG snapshot for a relic
     * @param {Object} relic - Relic data containing sigil, lore, and pricing
     * @returns {Promise<string>} - Data URL of the generated PNG
     */
    async generateSnapshot(relic) {
        const ctx = this.ctx;
        const canvas = this.canvas;

        // Clear canvas with cosmic background
        await this.drawCosmicBackground(ctx, canvas);
        
        // Draw sigil art
        if (relic.sigil) {
            await this.drawSigil(ctx, relic.sigil);
        }

        // Add relic title with cosmic styling
        this.drawTitle(ctx, relic.name || 'Mysterious Relic', canvas.width);

        // Add lore whispers
        if (relic.lore) {
            this.drawLore(ctx, relic.lore, canvas.width, canvas.height);
        }

        // Add pricing from Collector Archive
        if (relic.price) {
            this.drawPricing(ctx, relic.price, canvas.width, canvas.height);
        }

        // Add ChaosKey333 branding
        this.drawBranding(ctx, canvas.width, canvas.height);

        // Add pulsing threads and cosmic effects
        this.drawCosmicEffects(ctx, canvas.width, canvas.height);

        return canvas.toDataURL('image/png');
    }

    /**
     * Draw cosmic background with quantum particles
     */
    async drawCosmicBackground(ctx, canvas) {
        // Create cosmic gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a0a2a');
        gradient.addColorStop(0.7, '#2a1a3a');
        gradient.addColorStop(1, '#0a0a0a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add quantum particles
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 3 + 1;
            const alpha = Math.random() * 0.7 + 0.3;

            ctx.fillStyle = `rgba(138, 43, 226, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add subtle grid pattern
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    /**
     * Draw sigil art on the canvas
     */
    async drawSigil(ctx, sigilPath) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve) => {
                img.onload = () => {
                    const sigilSize = 200;
                    const x = 50;
                    const y = (ctx.canvas.height - sigilSize) / 2;
                    
                    // Add glow effect
                    ctx.shadowColor = '#8a2be2';
                    ctx.shadowBlur = 20;
                    ctx.drawImage(img, x, y, sigilSize, sigilSize);
                    ctx.shadowBlur = 0;
                    
                    resolve();
                };
                img.onerror = () => resolve(); // Continue even if image fails
                img.src = sigilPath;
            });
        } catch (error) {
            console.log('Could not load sigil, using default symbol');
            // Draw default sigil symbol
            this.drawDefaultSigil(ctx);
        }
    }

    /**
     * Draw a default sigil when image loading fails
     */
    drawDefaultSigil(ctx) {
        const x = 125; // Center of 200px width at x=50
        const y = ctx.canvas.height / 2;
        const radius = 75;

        // Outer circle with glow
        ctx.shadowColor = '#8a2be2';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#8a2be2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner thunder bolt
        ctx.fillStyle = '#8a2be2';
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 30);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x - 5, y);
        ctx.lineTo(x + 20, y + 30);
        ctx.lineTo(x - 10, y + 10);
        ctx.lineTo(x + 5, y);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    /**
     * Draw relic title with cosmic styling
     */
    drawTitle(ctx, title, canvasWidth) {
        ctx.font = 'bold 48px Orbitron, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        
        // Add text shadow for depth
        ctx.shadowColor = '#8a2be2';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 5;
        
        const x = 280;
        const y = 100;
        ctx.fillText(title, x, y);
        
        // Add subtitle line
        ctx.font = '24px Space Mono, monospace';
        ctx.fillStyle = '#cccccc';
        ctx.fillText('⚛️⚡👑 ChaosKey333 Relic Arsenal 👑⚡⚛️', x, y + 40);
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draw lore whispers text
     */
    drawLore(ctx, lore, canvasWidth, canvasHeight) {
        ctx.font = '20px Space Mono, monospace';
        ctx.fillStyle = '#e0e0e0';
        ctx.textAlign = 'left';
        
        const x = 280;
        const y = 200;
        const lineHeight = 28;
        const maxWidth = canvasWidth - x - 50;
        
        // Word wrap the lore text
        const words = lore.split(' ');
        let lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        
        // Limit to 8 lines to avoid overflow
        lines = lines.slice(0, 8);
        
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * lineHeight));
        });
    }

    /**
     * Draw pricing information with glow effect
     */
    drawPricing(ctx, price, canvasWidth, canvasHeight) {
        ctx.font = 'bold 32px Orbitron, monospace';
        ctx.fillStyle = '#00ff88';
        ctx.textAlign = 'right';
        
        // Add glow effect
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        
        const text = `⚡ ${price} GLOW`;
        ctx.fillText(text, canvasWidth - 50, canvasHeight - 120);
        
        // Add "LIVE PRICE" subtitle
        ctx.font = '16px Space Mono, monospace';
        ctx.fillStyle = '#cccccc';
        ctx.fillText('LIVE FROM COLLECTOR ARCHIVE', canvasWidth - 50, canvasHeight - 90);
        
        ctx.shadowBlur = 0;
    }

    /**
     * Draw ChaosKey333 branding elements
     */
    drawBranding(ctx, canvasWidth, canvasHeight) {
        // Draw signature at bottom
        ctx.font = 'bold 24px Orbitron, monospace';
        ctx.fillStyle = '#8a2be2';
        ctx.textAlign = 'center';
        
        ctx.shadowColor = '#8a2be2';
        ctx.shadowBlur = 8;
        
        const brandText = '"Through quantum tempests, we forge eternity."';
        ctx.fillText(brandText, canvasWidth / 2, canvasHeight - 30);
        
        ctx.shadowBlur = 0;
    }

    /**
     * Draw pulsing cosmic effects and sigil glyphs
     */
    drawCosmicEffects(ctx, canvasWidth, canvasHeight) {
        // Add corner sigil glyphs
        const glyphs = ['⚛️', '⚡', '👑', '🔑'];
        const positions = [
            [30, 30], [canvasWidth - 30, 30], 
            [30, canvasHeight - 30], [canvasWidth - 30, canvasHeight - 30]
        ];
        
        ctx.font = '32px serif';
        ctx.fillStyle = 'rgba(138, 43, 226, 0.6)';
        
        glyphs.forEach((glyph, index) => {
            const [x, y] = positions[index];
            ctx.fillText(glyph, x, y);
        });

        // Add pulsing border effect
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);
        ctx.setLineDash([]);
    }

    /**
     * Share to X (Twitter) with optimized content
     */
    shareToTwitter(relic, imageDataUrl) {
        const hashtags = this.generateHashtags(relic, 'twitter');
        const description = this.generateDescription(relic, 'twitter');
        
        const tweetText = `${description}\n\n${hashtags}\n\n⚛️⚡👑 ChaosKey333 👑⚡⚛️`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        
        // Note: Twitter doesn't support direct image sharing via URL, 
        // so we'll provide instructions to the user
        this.openShareWindow(url, imageDataUrl, 'Twitter/X');
    }

    /**
     * Share to Instagram (opens Instagram with instructions)
     */
    shareToInstagram(relic, imageDataUrl) {
        const description = this.generateDescription(relic, 'instagram');
        const hashtags = this.generateHashtags(relic, 'instagram');
        
        const caption = `${description}\n\n${hashtags}\n\n⚛️⚡👑 ChaosKey333 👑⚡⚛️`;
        
        // Instagram requires manual upload, so we'll show instructions
        this.showInstagramShareInstructions(imageDataUrl, caption);
    }

    /**
     * Share to TikTok (opens TikTok with instructions)
     */
    shareToTikTok(relic, imageDataUrl) {
        const description = this.generateDescription(relic, 'tiktok');
        const hashtags = this.generateHashtags(relic, 'tiktok');
        
        // TikTok requires manual upload, show instructions
        this.showTikTokShareInstructions(imageDataUrl, description, hashtags);
    }

    /**
     * Generate platform-optimized descriptions
     */
    generateDescription(relic, platform) {
        const descriptions = {
            twitter: `🌌 Behold the ${relic.name}! A cosmic relic from the ChaosKey333 Arsenal, pulsing with quantum energy and ancient wisdom.`,
            instagram: `✨ COSMIC RELIC DISCOVERED ✨\n\n${relic.name} emerges from the quantum depths of the ChaosKey333 Arsenal. Each relic holds the power to unlock new dimensions of possibility.`,
            tiktok: `⚡ QUANTUM DAWN RELIC REVEAL ⚡ The ${relic.name} has awakened! Watch as cosmic energy flows through this ancient artifact from the ChaosKey333 Arsenal.`
        };
        
        return descriptions[platform] || descriptions.twitter;
    }

    /**
     * Generate platform-optimized hashtags
     */
    generateHashtags(relic, platform) {
        const baseHashtags = ['#QuantumDawn', '#ChaosKey333', '#RelicArsenal', '#CosmicAwakening'];
        
        const platformTags = {
            twitter: [...baseHashtags, '#QuantumMystics', '#StormEternal', '#VaultAscendant'],
            instagram: [...baseHashtags, '#CosmicArt', '#DigitalArt', '#NFTArt', '#CryptoArt', '#QuantumMystics', '#StormEternal', '#VaultAscendant', '#CosmicVibes'],
            tiktok: [...baseHashtags, '#CosmicTok', '#QuantumVibes', '#MysticArt', '#CosmicEnergy']
        };
        
        return (platformTags[platform] || platformTags.twitter).join(' ');
    }

    /**
     * Open share window and provide image download
     */
    openShareWindow(url, imageDataUrl, platform) {
        // Open sharing URL
        window.open(url, '_blank', 'width=600,height=400');
        
        // Download image for manual upload
        this.downloadImage(imageDataUrl, `${platform.toLowerCase()}-relic-share.png`);
        
        // Show instructions
        this.showShareInstructions(platform);
    }

    /**
     * Download generated image
     */
    downloadImage(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }

    /**
     * Show Instagram sharing instructions
     */
    showInstagramShareInstructions(imageDataUrl, caption) {
        this.downloadImage(imageDataUrl, 'instagram-relic-share.png');
        
        const modal = this.createShareModal('Instagram', caption, `
            <p>📸 <strong>Instagram Sharing Instructions:</strong></p>
            <ol>
                <li>The relic snapshot has been downloaded to your device</li>
                <li>Open Instagram and create a new post</li>
                <li>Upload the downloaded image</li>
                <li>Copy the caption below and paste it into your post</li>
                <li>Add any additional personal touches</li>
                <li>Share your cosmic relic with the world! ⚡</li>
            </ol>
        `);
        
        document.body.appendChild(modal);
    }

    /**
     * Show TikTok sharing instructions
     */
    showTikTokShareInstructions(imageDataUrl, description, hashtags) {
        this.downloadImage(imageDataUrl, 'tiktok-relic-share.png');
        
        const caption = `${description}\n\n${hashtags}`;
        const modal = this.createShareModal('TikTok', caption, `
            <p>🎵 <strong>TikTok Sharing Instructions:</strong></p>
            <ol>
                <li>The relic snapshot has been downloaded to your device</li>
                <li>Open TikTok and create a new video</li>
                <li>Upload the downloaded image as your video background</li>
                <li>Add cosmic effects, music, and animations</li>
                <li>Copy the caption and hashtags below</li>
                <li>Share your cosmic creation! 🌌</li>
            </ol>
        `);
        
        document.body.appendChild(modal);
    }

    /**
     * Show general sharing instructions
     */
    showShareInstructions(platform) {
        const instructions = {
            'Twitter/X': 'Your tweet window has opened and the image has been downloaded. Upload the image to your tweet manually.',
            'Instagram': 'Please follow the Instagram sharing instructions.',
            'TikTok': 'Please follow the TikTok sharing instructions.'
        };
        
        setTimeout(() => {
            alert(`${platform} Sharing:\n${instructions[platform]}`);
        }, 1000);
    }

    /**
     * Create a modal for sharing instructions
     */
    createShareModal(platform, caption, instructions) {
        const modal = document.createElement('div');
        modal.className = 'social-echo-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Share to ${platform}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${instructions}
                    <div class="caption-container">
                        <label><strong>Caption to copy:</strong></label>
                        <textarea class="caption-text" readonly>${caption}</textarea>
                        <button class="copy-caption-btn">Copy Caption</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles if not already present
        if (!document.querySelector('#social-echo-modal-styles')) {
            this.addModalStyles();
        }

        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const copyBtn = modal.querySelector('.copy-caption-btn');
        const textarea = modal.querySelector('.caption-text');

        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        copyBtn.addEventListener('click', () => {
            textarea.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy Caption', 2000);
        });

        return modal;
    }

    /**
     * Add modal styles to the document
     */
    addModalStyles() {
        const style = document.createElement('style');
        style.id = 'social-echo-modal-styles';
        style.textContent = `
            .social-echo-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .modal-content {
                background: linear-gradient(135deg, #1a0a2a, #2a1a3a);
                border: 2px solid #8a2be2;
                border-radius: 15px;
                padding: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                color: white;
                border-bottom: 1px solid rgba(138, 43, 226, 0.3);
                padding-bottom: 10px;
            }
            
            .modal-header h3 {
                margin: 0;
                font-family: 'Orbitron', monospace;
                color: #8a2be2;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: #8a2be2;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                color: #ffffff;
            }
            
            .modal-body {
                color: #e0e0e0;
                font-family: 'Space Mono', monospace;
            }
            
            .modal-body ol {
                padding-left: 20px;
            }
            
            .caption-container {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(138, 43, 226, 0.3);
            }
            
            .caption-text {
                width: 100%;
                height: 100px;
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid #8a2be2;
                border-radius: 5px;
                color: white;
                padding: 10px;
                font-family: 'Space Mono', monospace;
                font-size: 12px;
                margin-top: 5px;
                resize: vertical;
            }
            
            .copy-caption-btn {
                background: linear-gradient(45deg, #8a2be2, #4b0082);
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                margin-top: 10px;
                transition: all 0.3s ease;
            }
            
            .copy-caption-btn:hover {
                background: linear-gradient(45deg, #9932cc, #6a0dad);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialEchoLayer;
}

// Make available globally for browser use
window.SocialEchoLayer = SocialEchoLayer;