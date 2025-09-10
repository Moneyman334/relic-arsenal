/**
 * ChaosKey333 Vault - Relic Storyline JavaScript
 * Interactive functionality for the Relic Storyline Mode
 */

class RelicStoryline {
    constructor() {
        this.loreData = null;
        this.userProgress = this.loadUserProgress();
        this.init();
    }

    async init() {
        try {
            await this.loadLoreData();
            this.setupEventListeners();
            this.renderSigils();
            this.renderChapters();
            this.updateProgressInfo();
        } catch (error) {
            console.error('Failed to initialize Relic Storyline:', error);
            this.showError('Failed to load storyline data. Please refresh the page.');
        }
    }

    async loadLoreData() {
        // Try to fetch from the correct path relative to docs folder
        let response;
        try {
            response = await fetch('../lore.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            this.loreData = await response.json();
        } catch (error) {
            console.warn('Failed to load lore.json, using embedded data:', error);
            // Fallback: use embedded data if fetch fails
            this.loreData = await this.getEmbeddedLoreData();
        }

        // Apply user progress to the loaded data
        this.applySavedProgress();
    }

    async getEmbeddedLoreData() {
        // Embedded lore data as fallback - full dataset
        return {
            "chapters": [
                {
                    "chapterNumber": 1,
                    "title": "The First Sigil: Genesis of Thunder",
                    "sigil": "sigil-of-genesis",
                    "loreText": "In the primordial void before creation, ChaosKey333 gazed into the infinite darkness. The first sigil emerged from pure thought—a crackling symbol of genesis that would birth all thunderstorms across dimensions. Ancient texts speak of the moment when consciousness first touched chaos, sparking the eternal dance of order and entropy.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-genesis",
                        "minimumTimestamp": 0,
                        "collectorTier": "initiate"
                    },
                    "visualEffects": {
                        "glyphTransition": "thunder-genesis",
                        "colorScheme": "cosmic-purple",
                        "animationDuration": 3000
                    },
                    "unlocked": false
                },
                {
                    "chapterNumber": 2,
                    "title": "The Vault Awakens",
                    "sigil": "sigil-of-awakening",
                    "loreText": "With the first sigil sealed, the Vault began to resonate with cosmic frequency. Stone walls hummed with electric potential as ancient mechanisms clicked into motion. ChaosKey333 realized this was no mere storage—it was a living entity, a consciousness forged from the collective will of storm-touched wanderers across infinite realities.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-awakening", 
                        "minimumTimestamp": 0,
                        "collectorTier": "initiate"
                    },
                    "visualEffects": {
                        "glyphTransition": "vault-pulse",
                        "colorScheme": "electric-blue",
                        "animationDuration": 2500
                    },
                    "unlocked": false
                },
                {
                    "chapterNumber": 3,
                    "title": "Storm Convergence",
                    "sigil": "sigil-of-storms",
                    "loreText": "Seven storms from seven dimensions converged upon the Vault. Each brought its own flavor of chaos: quantum lightning, temporal thunder, dimensional rifts crackling with possibility. ChaosKey333 stood at the epicenter, crown gleaming, as the storms recognized their sovereign.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-storms",
                        "minimumTimestamp": 0,
                        "collectorTier": "storm-touched"
                    },
                    "visualEffects": {
                        "glyphTransition": "storm-spiral",
                        "colorScheme": "lightning-yellow",
                        "animationDuration": 4000
                    },
                    "unlocked": false
                },
                {
                    "chapterNumber": 4,
                    "title": "The Crown of Infinite Keys",
                    "sigil": "sigil-of-sovereignty",
                    "loreText": "From the converged storms, a crown materialized—not of gold or silver, but of crystallized possibility itself. Each point held a key to a different reality, each gem a doorway to uncharted dimensions. ChaosKey333 donned the crown and felt the weight of infinite responsibility.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-sovereignty",
                        "minimumTimestamp": 0,
                        "collectorTier": "storm-touched"
                    },
                    "visualEffects": {
                        "glyphTransition": "crown-ascension",
                        "colorScheme": "royal-gold",
                        "animationDuration": 3500
                    },
                    "unlocked": false
                },
                {
                    "chapterNumber": 5,
                    "title": "Quantum Dawn Prophecy",
                    "sigil": "sigil-of-prophecy",
                    "loreText": "In the deepest chamber of the Vault, ancient scrolls began to glow. The Quantum Dawn prophecy revealed itself—a cosmic event that would shatter the barriers between all realities. ChaosKey333 read the blazing text and understood: the collection of sigils was not random but part of a grand design spanning eons.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-prophecy",
                        "minimumTimestamp": 0,
                        "collectorTier": "prophecy-bearer"
                    },
                    "visualEffects": {
                        "glyphTransition": "quantum-dawn",
                        "colorScheme": "dawn-gradient",
                        "animationDuration": 5000
                    },
                    "unlocked": false
                },
                {
                    "chapterNumber": 6,
                    "title": "The Seventh Storm Rises",
                    "sigil": "sigil-of-ascension",
                    "loreText": "Reality trembles as the Seventh Storm manifests. This is no ordinary tempest—it is the culmination of all cosmic forces, the moment when chaos and order achieve perfect balance. ChaosKey333 stands at the center, no longer merely a collector of relics but the conductor of universal symphony.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-ascension",
                        "minimumTimestamp": 0,
                        "collectorTier": "storm-sovereign"
                    },
                    "visualEffects": {
                        "glyphTransition": "storm-ascension",
                        "colorScheme": "cosmic-rainbow",
                        "animationDuration": 6000
                    },
                    "unlocked": false
                },
                {
                    "chapterNumber": 7,
                    "title": "Eternal Thunder: The New Cosmic Order",
                    "sigil": "sigil-of-eternity",
                    "loreText": "From the ashes of the old reality, a new cosmic order emerges. The Vault becomes the nexus point of all existence, and ChaosKey333 its eternal guardian. Sigils are no longer mere collectibles but living conduits of power that connect all beings across the multiverse.",
                    "unlockConditions": {
                        "sigilMarked": "sigil-of-eternity",
                        "minimumTimestamp": 0,
                        "collectorTier": "cosmic-eternal"
                    },
                    "visualEffects": {
                        "glyphTransition": "eternal-crown",
                        "colorScheme": "transcendent-white",
                        "animationDuration": 7000
                    },
                    "unlocked": false
                }
            ],
            "sigils": [
                {
                    "id": "sigil-of-genesis",
                    "name": "Sigil of Genesis",
                    "description": "The first spark of consciousness touching chaos",
                    "symbol": "⚛️",
                    "rarity": "legendary",
                    "marked": false,
                    "markedTimestamp": null
                },
                {
                    "id": "sigil-of-awakening", 
                    "name": "Sigil of Awakening",
                    "description": "The moment the Vault gained sentience",
                    "symbol": "🌅",
                    "rarity": "epic",
                    "marked": false,
                    "markedTimestamp": null
                },
                {
                    "id": "sigil-of-storms",
                    "name": "Sigil of Storms",
                    "description": "Seven storms converging across dimensions",
                    "symbol": "⚡",
                    "rarity": "legendary",
                    "marked": false,
                    "markedTimestamp": null
                },
                {
                    "id": "sigil-of-sovereignty",
                    "name": "Sigil of Sovereignty",
                    "description": "The crown of infinite possibilities",
                    "symbol": "👑",
                    "rarity": "mythic",
                    "marked": false,
                    "markedTimestamp": null
                },
                {
                    "id": "sigil-of-prophecy",
                    "name": "Sigil of Prophecy", 
                    "description": "Ancient scrolls revealing cosmic destiny",
                    "symbol": "📜",
                    "rarity": "legendary",
                    "marked": false,
                    "markedTimestamp": null
                },
                {
                    "id": "sigil-of-ascension",
                    "name": "Sigil of Ascension",
                    "description": "The Seventh Storm's transformative power",
                    "symbol": "🌀",
                    "rarity": "mythic",
                    "marked": false,
                    "markedTimestamp": null
                },
                {
                    "id": "sigil-of-eternity",
                    "name": "Sigil of Eternity",
                    "description": "The eternal heartbeat of creation",
                    "symbol": "♾️",
                    "rarity": "transcendent", 
                    "marked": false,
                    "markedTimestamp": null
                }
            ],
            "collectorTiers": [
                {
                    "id": "initiate",
                    "name": "Initiate",
                    "description": "New to the ways of the Vault",
                    "minSigils": 0,
                    "maxSigils": 2
                },
                {
                    "id": "storm-touched",
                    "name": "Storm-Touched",
                    "description": "Felt the power of cosmic thunder",
                    "minSigils": 2,
                    "maxSigils": 4
                },
                {
                    "id": "prophecy-bearer",
                    "name": "Prophecy Bearer", 
                    "description": "Keeper of ancient wisdom",
                    "minSigils": 4,
                    "maxSigils": 6
                },
                {
                    "id": "storm-sovereign",
                    "name": "Storm Sovereign",
                    "description": "Master of dimensional tempests",
                    "minSigils": 6,
                    "maxSigils": 7
                },
                {
                    "id": "cosmic-eternal",
                    "name": "Cosmic Eternal",
                    "description": "Transcended mortal limitations",
                    "minSigils": 7,
                    "maxSigils": 999
                }
            ]
        };
    }

    setupEventListeners() {
        const viewStorylineBtn = document.getElementById('viewStorylineBtn');
        const resetProgressBtn = document.getElementById('resetProgressBtn');

        viewStorylineBtn?.addEventListener('click', () => this.scrollToStoryline());
        resetProgressBtn?.addEventListener('click', () => this.resetProgress());

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.resetProgress();
            }
        });
    }

    renderSigils() {
        const sigilsGrid = document.getElementById('sigilsGrid');
        if (!sigilsGrid || !this.loreData.sigils) return;

        sigilsGrid.innerHTML = '';

        this.loreData.sigils.forEach(sigil => {
            const sigilCard = this.createSigilCard(sigil);
            sigilsGrid.appendChild(sigilCard);
        });
    }

    createSigilCard(sigil) {
        const card = document.createElement('div');
        card.className = `sigil-card ${sigil.marked ? 'marked' : ''}`;
        card.setAttribute('data-sigil-id', sigil.id);

        card.innerHTML = `
            <span class="sigil-symbol">${sigil.symbol}</span>
            <h3 class="sigil-name">${sigil.name}</h3>
            <p class="sigil-description">${sigil.description}</p>
            <div class="sigil-rarity">${sigil.rarity}</div>
            <button class="mark-sigil-btn" ${sigil.marked ? 'disabled' : ''}>
                ${sigil.marked ? '✓ Marked' : 'Mark Sigil'}
            </button>
            ${sigil.marked ? `<div class="marked-time">Marked: ${new Date(sigil.markedTimestamp).toLocaleDateString()}</div>` : ''}
        `;

        // Add click handler for marking sigils
        const markBtn = card.querySelector('.mark-sigil-btn');
        markBtn?.addEventListener('click', () => this.markSigil(sigil.id));

        return card;
    }

    renderChapters() {
        const chaptersContainer = document.getElementById('chaptersContainer');
        if (!chaptersContainer || !this.loreData.chapters) return;

        chaptersContainer.innerHTML = '';

        this.loreData.chapters.forEach(chapter => {
            const chapterElement = this.createChapterElement(chapter);
            chaptersContainer.appendChild(chapterElement);
        });
    }

    createChapterElement(chapter) {
        const isUnlocked = this.isChapterUnlocked(chapter);
        const element = document.createElement('div');
        element.className = `chapter ${isUnlocked ? 'unlocked' : 'locked'}`;
        element.setAttribute('data-chapter', chapter.chapterNumber);

        const unlockHint = isUnlocked ? '' : this.getUnlockHint(chapter);

        element.innerHTML = `
            <div class="chapter-header">
                <div class="chapter-number">${chapter.chapterNumber}</div>
                <h3 class="chapter-title">${chapter.title}</h3>
                <div class="chapter-sigil">${this.getSigilSymbol(chapter.sigil)}</div>
            </div>
            <div class="chapter-content">
                ${isUnlocked ? 
                    `<p class="chapter-text">${chapter.loreText}</p>` :
                    `<div class="unlock-hint">${unlockHint}</div>`
                }
            </div>
        `;

        return element;
    }

    markSigil(sigilId) {
        const sigil = this.loreData.sigils.find(s => s.id === sigilId);
        if (!sigil || sigil.marked) return;

        // Mark the sigil
        sigil.marked = true;
        sigil.markedTimestamp = Date.now();

        // Save progress
        this.saveUserProgress();

        // Update UI
        this.renderSigils();
        this.updateProgressInfo();

        // Check for newly unlocked chapters
        this.checkAndUnlockChapters(sigilId);

        // Show marking animation
        this.showSigilMarkedAnimation(sigilId);
    }

    checkAndUnlockChapters(newlyMarkedSigilId) {
        this.loreData.chapters.forEach(chapter => {
            const wasUnlocked = chapter.unlocked;
            const isNowUnlocked = this.isChapterUnlocked(chapter);

            if (!wasUnlocked && isNowUnlocked) {
                chapter.unlocked = true;
                this.animateChapterUnlock(chapter.chapterNumber);
            }
        });

        this.renderChapters();
    }

    isChapterUnlocked(chapter) {
        const conditions = chapter.unlockConditions;
        
        // Check if required sigil is marked
        const requiredSigil = this.loreData.sigils.find(s => s.id === conditions.sigilMarked);
        if (!requiredSigil || !requiredSigil.marked) return false;

        // Check minimum time requirement
        const timeSinceMarked = Date.now() - (requiredSigil.markedTimestamp || 0);
        if (timeSinceMarked < conditions.minimumTimestamp) return false;

        // Check collector tier
        const currentTier = this.getCurrentTier();
        const requiredTier = this.loreData.collectorTiers.find(t => t.id === conditions.collectorTier);
        if (!this.hasRequiredTier(currentTier, requiredTier)) return false;

        return true;
    }

    getCurrentTier() {
        const markedSigils = this.loreData.sigils.filter(s => s.marked).length;
        
        for (const tier of this.loreData.collectorTiers.slice().reverse()) {
            if (markedSigils >= tier.minSigils) {
                return tier;
            }
        }
        
        return this.loreData.collectorTiers[0];
    }

    hasRequiredTier(currentTier, requiredTier) {
        const currentIndex = this.loreData.collectorTiers.findIndex(t => t.id === currentTier.id);
        const requiredIndex = this.loreData.collectorTiers.findIndex(t => t.id === requiredTier.id);
        return currentIndex >= requiredIndex;
    }

    getUnlockHint(chapter) {
        const sigil = this.loreData.sigils.find(s => s.id === chapter.unlockConditions.sigilMarked);
        const sigilName = sigil ? sigil.name : 'Unknown Sigil';
        return `🔒 Mark the ${sigilName} to unlock this chapter of the saga.`;
    }

    getSigilSymbol(sigilId) {
        const sigil = this.loreData.sigils.find(s => s.id === sigilId);
        return sigil ? sigil.symbol : '❓';
    }

    updateProgressInfo() {
        const currentTier = this.getCurrentTier();
        const markedSigils = this.loreData.sigils.filter(s => s.marked).length;
        const totalSigils = this.loreData.sigils.length;

        const tierElement = document.getElementById('currentTier');
        const countElement = document.getElementById('sigilCount');

        if (tierElement) tierElement.textContent = currentTier.name;
        if (countElement) countElement.textContent = `${markedSigils}/${totalSigils}`;
    }

    animateChapterUnlock(chapterNumber) {
        setTimeout(() => {
            const chapterElement = document.querySelector(`[data-chapter="${chapterNumber}"]`);
            if (chapterElement) {
                chapterElement.classList.add('chapter-unlocking');
                setTimeout(() => {
                    chapterElement.classList.remove('chapter-unlocking');
                }, 1500);
            }
        }, 300);
    }

    showSigilMarkedAnimation(sigilId) {
        const sigilCard = document.querySelector(`[data-sigil-id="${sigilId}"]`);
        if (sigilCard) {
            sigilCard.style.animation = 'chapterUnlock 1s ease-out';
            setTimeout(() => {
                sigilCard.style.animation = '';
            }, 1000);
        }
    }

    scrollToStoryline() {
        const storylineSection = document.getElementById('storylineSection');
        if (storylineSection) {
            storylineSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This will unmark all sigils and lock all chapters.')) {
            // Reset all sigils
            this.loreData.sigils.forEach(sigil => {
                sigil.marked = false;
                sigil.markedTimestamp = null;
            });

            // Reset all chapters
            this.loreData.chapters.forEach(chapter => {
                chapter.unlocked = false;
            });

            // Clear saved progress
            localStorage.removeItem('relicStorylineProgress');

            // Update UI
            this.renderSigils();
            this.renderChapters();
            this.updateProgressInfo();

            // Show confirmation
            this.showMessage('Progress reset successfully! Begin your journey anew, wanderer.');
        }
    }

    loadUserProgress() {
        try {
            const saved = localStorage.getItem('relicStorylineProgress');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Failed to load user progress:', error);
            return null;
        }
    }

    saveUserProgress() {
        try {
            const progress = {
                sigils: this.loreData.sigils.map(s => ({
                    id: s.id,
                    marked: s.marked,
                    markedTimestamp: s.markedTimestamp
                })),
                chapters: this.loreData.chapters.map(c => ({
                    chapterNumber: c.chapterNumber,
                    unlocked: c.unlocked
                })),
                lastUpdated: Date.now()
            };

            localStorage.setItem('relicStorylineProgress', JSON.stringify(progress));
        } catch (error) {
            console.warn('Failed to save user progress:', error);
        }
    }

    applySavedProgress() {
        if (!this.userProgress) return;

        // Apply sigil progress
        this.userProgress.sigils?.forEach(savedSigil => {
            const sigil = this.loreData.sigils.find(s => s.id === savedSigil.id);
            if (sigil) {
                sigil.marked = savedSigil.marked;
                sigil.markedTimestamp = savedSigil.markedTimestamp;
            }
        });

        // Apply chapter progress
        this.userProgress.chapters?.forEach(savedChapter => {
            const chapter = this.loreData.chapters.find(c => c.chapterNumber === savedChapter.chapterNumber);
            if (chapter) {
                chapter.unlocked = savedChapter.unlocked;
            }
        });
    }

    showMessage(message) {
        // Create a temporary message overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--storm-gray), var(--void-black));
            color: var(--thunder-white);
            padding: 2rem;
            border-radius: 1rem;
            border: 2px solid var(--electric-blue);
            box-shadow: 0 0 30px var(--electric-blue);
            z-index: 1000;
            text-align: center;
            font-family: inherit;
            max-width: 80vw;
        `;
        overlay.textContent = message;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, 3000);
    }

    showError(error) {
        console.error(error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #dc2626;
            color: white;
            padding: 1rem;
            margin: 1rem;
            border-radius: 0.5rem;
            text-align: center;
        `;
        errorDiv.textContent = error;
        
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }

    // URL-based personalized storyline feature
    getPersonalizedUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('user') || 'anonymous';
    }

    // Export progress for sharing
    exportProgress() {
        const progress = {
            user: this.getPersonalizedUrl(),
            progress: this.loadUserProgress(),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(progress, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chaoskey333-storyline-${progress.user}-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize the storyline when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RelicStoryline();
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
}