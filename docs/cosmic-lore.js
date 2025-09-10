/**
 * Cosmic Lore Overlay - Interactive JavaScript
 * Handles sigil interactions, tooltip display, and glyph decoding animations
 */

class CosmicLoreOverlay {
    constructor() {
        this.loreData = null;
        this.tooltip = document.getElementById('lore-overlay');
        this.activeTimeout = null;
        this.glyphDecodeTimeout = null;
        
        this.init();
    }

    async init() {
        await this.loadLoreData();
        this.setupEventListeners();
    }

    async loadLoreData() {
        try {
            // Try to load from lore.json first
            const response = await fetch('./lore.json');
            if (response.ok) {
                this.loreData = await response.json();
                console.log('Lore data loaded from lore.json');
                return;
            }
        } catch (error) {
            console.warn('Failed to load lore.json, falling back to RELEASE_NOTES.md');
        }

        // Fallback to parsing RELEASE_NOTES.md
        try {
            await this.loadFromReleaseNotes();
        } catch (error) {
            console.error('Failed to load lore data from both sources:', error);
            // Use default fallback data
            this.loreData = this.getDefaultLoreData();
        }
    }

    async loadFromReleaseNotes() {
        const response = await fetch('../RELEASE_NOTES.md');
        if (!response.ok) {
            throw new Error('Failed to fetch RELEASE_NOTES.md');
        }
        
        const content = await response.text();
        this.loreData = this.parseReleaseNotes(content);
        console.log('Lore data parsed from RELEASE_NOTES.md');
    }

    parseReleaseNotes(content) {
        // Parse the RELEASE_NOTES.md content to extract lore fragments
        const parsed = {};
        
        // Extract version and features from RELEASE_NOTES.md
        const versionMatch = content.match(/🌌 (v[\d.]+) — (.+)/);
        if (versionMatch) {
            const version = versionMatch[1];
            const title = versionMatch[2];
            
            parsed.gallery_scrolls = {
                title: title,
                description: "Auto-indexed Gallery of Relics reveals the sacred collection while scroll injection rituals bind the ancient wisdom.",
                glyph: "📜🎯🔮 ŠĊṚØŁŁ ṚÏT̈ÜÆŁŠ ÆŠĊËṄḊ 📜🎯🔮"
            };
        }

        // Add other default entries for relics mentioned in the repo
        parsed.vault_door_thunder = {
            title: "Vault Door Thunder",
            description: "In the depths of the ancient vault, echoes of thunder reverberate through the stone corridors.",
            glyph: "⚡🚪🏛️ ṼÆÜLT̈ ḊØØṚ T̈ĦÜṄḊËṚ ⚡🚪🏛️"
        };

        parsed.quantum_dawn = {
            title: "Rolling Thunderstorm VII: Quantum Dawn",
            description: "The Seventh Rolling Thunderstorm awakens—Quantum Dawn marks the convergence of prophecy and reality.",
            glyph: "⚛️🌅⚡ QÜÆṄT̈ÜṀ ḊÆẄṄ ÆẄÆḲËṄŠ ⚛️🌅⚡"
        };

        parsed.sigil_of_thunder = {
            title: "Sigil of Thunder",
            description: "Sacred emblems representing the power of rolling thunderstorms across dimensions.",
            glyph: "⛈️⚡👑 ŠÏĢÏŁ ØḞ T̈ĦÜṄḊËṚ ĊṚØẄṄŠ ⛈️⚡👑"
        };

        parsed.chaos_key_playbook = {
            title: "ChaosKey333 Launch Timing Playbook",
            description: "The sacred scrolls containing launch timing strategies and cosmic scripture.",
            glyph: "🔑⚡📋 ĊĦÆØŠ ḲËỲ PŁÆỲḂØØḲ 🔑⚡📋"
        };

        parsed.cosmic_scripture = {
            title: "The Cosmic Scripture",
            description: "Sacred lore containing the Seven Storm Prophecy and the mysteries of the Vault Eternal.",
            glyph: "📖✨🌌 ĊØŠṀÏĊ ŠĊṚÏÞT̈ÜṚË ËT̈ËṚṄÆŁ 📖✨🌌"
        };

        return parsed;
    }

    getDefaultLoreData() {
        return {
            vault_door_thunder: {
                title: "Vault Door Thunder",
                description: "The mystical energies echo through ancient corridors, marking the beginning of our cosmic journey.",
                glyph: "⚡🚪🏛️ ṼÆÜLT̈ ḊØØṚ T̈ĦÜṄḊËṚ ⚡🚪🏛️"
            },
            quantum_dawn: {
                title: "Quantum Dawn",
                description: "Where reality bends to cosmic will and infinite possibilities unfold before us.",
                glyph: "⚛️🌅⚡ QÜÆṄT̈ÜṀ ḊÆẄṄ ÆẄÆḲËṄŠ ⚛️🌅⚡"
            },
            default: {
                title: "Unknown Relic",
                description: "A mysterious artifact whose secrets await discovery in the cosmic vault.",
                glyph: "❓✨🔮 ÜṄḲṄØẄṄ ṚËŁÏĊ ÆẄÆİT̈Š ❓✨🔮"
            }
        };
    }

    setupEventListeners() {
        const sigils = document.querySelectorAll('.sigil');
        
        sigils.forEach(sigil => {
            const container = sigil.closest('.sigil-container');
            const relicKey = container.dataset.relic;
            
            // Mouse events
            sigil.addEventListener('mouseenter', (e) => this.showTooltip(e, relicKey));
            sigil.addEventListener('mouseleave', () => this.hideTooltip());
            sigil.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
            
            // Touch events for mobile
            sigil.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showTooltip(e.touches[0], relicKey);
            });
            
            // Keyboard events for accessibility
            sigil.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showTooltip(e, relicKey);
                }
            });
            
            sigil.addEventListener('blur', () => this.hideTooltip());
        });

        // Hide tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sigil') && !e.target.closest('.lore-tooltip')) {
                this.hideTooltip();
            }
        });

        // Hide tooltip on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideTooltip();
            }
        });
    }

    showTooltip(event, relicKey) {
        if (!this.loreData) return;
        
        clearTimeout(this.activeTimeout);
        
        const relic = this.loreData[relicKey] || this.loreData.default || {
            title: "Unknown Relic",
            description: "A mysterious artifact whose secrets await discovery.",
            glyph: "❓✨🔮 ÜṄḲṄØẄṄ ṚËŁÏĊ ❓✨🔮"
        };
        
        // Populate tooltip content
        this.tooltip.querySelector('.lore-title').textContent = relic.title;
        this.tooltip.querySelector('.lore-description').textContent = relic.description;
        this.tooltip.querySelector('.glyph-encoded').textContent = relic.glyph;
        this.tooltip.querySelector('.glyph-decoded').textContent = this.decodeGlyph(relic.glyph);
        
        // Reset glyph animation state
        const glyphContainer = this.tooltip.querySelector('.glyph-container');
        glyphContainer.classList.remove('decoding');
        
        // Position tooltip
        this.updateTooltipPosition(event);
        
        // Show tooltip
        this.tooltip.classList.add('visible');
        this.tooltip.setAttribute('aria-hidden', 'false');
        
        // Start glyph decoding animation after a delay
        clearTimeout(this.glyphDecodeTimeout);
        this.glyphDecodeTimeout = setTimeout(() => {
            glyphContainer.classList.add('decoding');
        }, 1000);
    }

    hideTooltip() {
        clearTimeout(this.activeTimeout);
        clearTimeout(this.glyphDecodeTimeout);
        
        this.activeTimeout = setTimeout(() => {
            this.tooltip.classList.remove('visible');
            this.tooltip.setAttribute('aria-hidden', 'true');
            
            // Reset glyph animation state
            const glyphContainer = this.tooltip.querySelector('.glyph-container');
            glyphContainer.classList.remove('decoding');
        }, 100);
    }

    updateTooltipPosition(event) {
        if (!this.tooltip.classList.contains('visible')) return;
        
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let x = event.clientX || event.pageX || 0;
        let y = (event.clientY || event.pageY || 0) - tooltipRect.height - 20;
        
        // Adjust horizontal position if tooltip would go off-screen
        if (x + tooltipRect.width > viewportWidth - 20) {
            x = viewportWidth - tooltipRect.width - 20;
        }
        if (x < 20) {
            x = 20;
        }
        
        // Adjust vertical position if tooltip would go off-screen
        if (y < 20) {
            y = (event.clientY || event.pageY || 0) + 20;
        }
        
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    decodeGlyph(glyph) {
        // Decode the glyph text by removing special characters and converting to readable format
        const decoded = glyph
            .replace(/[ṼṚḊØØÆÜŤĦÜṄËŞĊŁÆṄŚÏĢŁÞĊØŠṀÏÞÜËḲŸŁÆÄŸÄḲṄØẄṄÄẆƮ]/gi, (match) => {
                const decodingMap = {
                    'Ṽ': 'V', 'Æ': 'AE', 'Ü': 'U', 'Ł': 'L', 'Ť': 'T', 'Ḋ': 'D', 'Ø': 'O', 
                    'Ṛ': 'R', 'Ţ': 'T', 'Ħ': 'H', 'Ṅ': 'N', 'Ë': 'E', 'Ṛ': 'R', 'Ş': 'S',
                    'Ċ': 'C', 'Ř': 'R', 'Ł': 'L', 'Ś': 'S', 'Ï': 'I', 'Ģ': 'G', 'Ğ': 'G',
                    'Þ': 'TH', 'Š': 'S', 'Ṁ': 'M', 'Ï': 'I', 'Þ': 'TH', 'Ţ': 'T', 'Ü': 'U',
                    'Ë': 'E', 'Ḳ': 'K', 'Ÿ': 'Y', 'Ł': 'L', 'Æ': 'AE', 'Ä': 'A', 'Ẅ': 'W',
                    'Ä': 'A', 'Ḳ': 'K', 'Ṅ': 'N', 'Ø': 'O', 'Ẅ': 'W', 'Ṅ': 'N', 'Ä': 'A',
                    'Ẇ': 'W', 'Æ': 'AE', 'Ï': 'I', 'Ţ': 'T'
                };
                return decodingMap[match.toUpperCase()] || match;
            })
            .replace(/[^\w\s⚡🚪🏛️⚛️🌅📜🎯🔮⛈️👑🔑📋📖✨🌌❓]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
            
        return `"${decoded}"`;
    }
}

// Initialize the overlay when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CosmicLoreOverlay();
});

// Export for potential use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmicLoreOverlay;
}