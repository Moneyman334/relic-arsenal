/**
 * Relic Card Modal - Interactive component for Sentinel Timeline
 * Part of the ChaosKey333 Cosmic Arsenal
 */

class RelicCardModal {
    constructor() {
        this.modal = document.getElementById('relic-modal');
        this.isOpen = false;
        this.currentRelic = null;
        
        // Relic database with cosmic lore and metadata
        this.relicsDB = {
            'quantum-genesis': {
                title: 'Quantum Genesis ⚛️',
                sigil: '⚛️',
                lore: 'A swirling vortex of quantum particles dancing with the first light of cosmic dawn, fractal patterns emerging from the void. This relic embodies the moment when possibility crystallizes into reality.',
                prophecy: 'From the quantum foam shall rise the seeds of infinite realities. Those who possess Genesis hold the power to create worlds with but a thought.',
                basePrice: 333.77,
                verifyUrl: 'https://github.com/Moneyman334/relic-arsenal/blob/main/release-scrolls/v1.7.0.md#quantum-genesis',
                archiveUrl: 'https://github.com/Moneyman334/relic-arsenal/tree/main/docs/cosmic-scripture.md#quantum-dawn-transformation'
            },
            'thunder-apex': {
                title: 'Thunderstorm Apex ⚡',
                sigil: '⚡',
                lore: 'The mighty seventh storm itself—lightning cascading through dimensional rifts, thunder echoing across parallel realities. This relic channels the raw power of cosmic storms.',
                prophecy: 'In rolling thunder lies the voice of eternity. The bearer of this sigil commands the storms that shape reality itself.',
                basePrice: 777.33,
                verifyUrl: 'https://github.com/Moneyman334/relic-arsenal/blob/main/release-scrolls/v1.7.0.md#thunderstorm-apex',
                archiveUrl: 'https://github.com/Moneyman334/relic-arsenal/tree/main/docs/cosmic-scripture.md#seven-storm-prophecy'
            },
            'vault-ascension': {
                title: 'Vault Ascension 👑',
                sigil: '👑',
                lore: 'The ChaosKey333 vault elevated to cosmic prominence, crowned with stellar fire and guarded by quantum sentinels. This relic represents ultimate mastery over chaos.',
                prophecy: 'When the Vault ascends, so too shall its guardians. The crown of chaos awaits those brave enough to claim sovereignty over the infinite.',
                basePrice: 1333.21,
                verifyUrl: 'https://github.com/Moneyman334/relic-arsenal/blob/main/release-scrolls/v1.7.0.md#vault-ascension',
                archiveUrl: 'https://github.com/Moneyman334/relic-arsenal/tree/main/docs/cosmic-scripture.md#vault-eternal'
            },
            'dawn-eternal': {
                title: 'Dawn Eternal 🌅',
                sigil: '🌅',
                lore: 'A magnificent sunrise breaking through quantum storm clouds, illuminating countless parallel realities with golden-purple light. This relic heralds new beginnings.',
                prophecy: 'The dawn that never ends shall illuminate the path to transcendence. Those who witness the eternal sunrise gain sight beyond the veil of reality.',
                basePrice: 2024.88,
                verifyUrl: 'https://github.com/Moneyman334/relic-arsenal/blob/main/release-scrolls/v1.7.0.md#dawn-eternal',
                archiveUrl: 'https://github.com/Moneyman334/relic-arsenal/tree/main/docs/cosmic-scripture.md#infinite-future'
            },
            'sacred-key': {
                title: 'Sacred Key 🔑',
                sigil: '🔑',
                lore: 'The fundamental promise of ChaosKey333 made manifest—every relic is indeed a key that unlocks not just doors, but entire dimensions of possibility.',
                prophecy: 'The Sacred Key opens all locks, breaks all chains, and reveals all hidden truths. Its bearer becomes master of infinite doorways.',
                basePrice: 3333.33,
                verifyUrl: 'https://github.com/Moneyman334/relic-arsenal/tree/main/docs/cosmic-scripture.md#nature-of-relics',
                archiveUrl: 'https://github.com/Moneyman334/relic-arsenal/tree/main/docs/gallery'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupAccessibility();
    }
    
    bindEvents() {
        // Add click handlers to sigil nodes
        document.querySelectorAll('.sigil-node').forEach(node => {
            node.addEventListener('click', (e) => this.handleSigilClick(e));
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleSigilClick(e);
                }
            });
        });
        
        // Modal close handlers
        const closeBtn = document.querySelector('.modal-close');
        closeBtn?.addEventListener('click', () => this.closeModal());
        
        // Close modal on overlay click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    setupAccessibility() {
        // Make sigil nodes focusable
        document.querySelectorAll('.sigil-node').forEach(node => {
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.setAttribute('aria-label', `Open ${node.dataset.relic} relic details`);
        });
    }
    
    handleSigilClick(event) {
        const relicId = event.currentTarget.dataset.relic;
        if (relicId && this.relicsDB[relicId]) {
            this.openModal(relicId);
        }
    }
    
    async openModal(relicId) {
        if (this.isOpen) return;
        
        this.currentRelic = relicId;
        const relic = this.relicsDB[relicId];
        
        if (!relic) {
            console.error('Relic not found:', relicId);
            return;
        }
        
        // Populate modal content
        this.populateModalContent(relic);
        
        // Show modal with smooth transition
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.modal.classList.add('active');
        });
        
        this.isOpen = true;
        
        // Focus management for accessibility
        const firstFocusable = this.modal.querySelector('.modal-close');
        firstFocusable?.focus();
        
        // Fetch live price data
        this.fetchLivePricing(relicId);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    populateModalContent(relic) {
        // Update modal elements
        document.getElementById('modal-sigil').textContent = relic.sigil;
        document.getElementById('modal-title').textContent = relic.title;
        document.getElementById('modal-lore').textContent = relic.lore;
        document.getElementById('modal-prophecy').textContent = relic.prophecy;
        
        // Set initial price
        document.getElementById('modal-price').textContent = `${relic.basePrice} CHAOS`;
        
        // Update links
        const verifyLink = document.getElementById('modal-verify-link');
        const archiveLink = document.getElementById('modal-archive-link');
        
        if (verifyLink) {
            verifyLink.href = relic.verifyUrl;
        }
        if (archiveLink) {
            archiveLink.href = relic.archiveUrl;
        }
    }
    
    async fetchLivePricing(relicId) {
        const priceElement = document.getElementById('modal-price');
        if (!priceElement) return;
        
        try {
            // Simulate dynamic pricing with cosmic fluctuations
            const relic = this.relicsDB[relicId];
            const basePrice = relic.basePrice;
            
            // Add some cosmic chaos to the pricing
            const fluctuation = (Math.random() - 0.5) * 0.1; // ±10% variation
            const cosmicFactor = Math.sin(Date.now() / 1000000) * 0.05; // Time-based cosmic influence
            const finalPrice = basePrice * (1 + fluctuation + cosmicFactor);
            
            // Simulate network delay for realism
            await this.delay(800 + Math.random() * 1200);
            
            if (this.currentRelic === relicId && this.isOpen) {
                priceElement.textContent = `${finalPrice.toFixed(2)} CHAOS`;
                priceElement.style.animation = 'sigilPulse 0.5s ease-out';
            }
            
        } catch (error) {
            console.warn('Failed to fetch live pricing:', error);
            priceElement.textContent = 'Price Oracle Offline';
        }
    }
    
    closeModal() {
        if (!this.isOpen) return;
        
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Wait for animation to complete
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.isOpen = false;
            this.currentRelic = null;
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to the clicked sigil node
            const activeRelic = document.querySelector(`[data-relic="${this.currentRelic}"]`);
            activeRelic?.focus();
            
        }, 400); // Match CSS transition duration
    }
    
    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // API integration methods for future expansion
    async connectToCollectorArchive() {
        // Future integration with Collector Archive API
        console.log('Connecting to Collector Archive...');
    }
    
    async connectToBroadcastLayer() {
        // Future integration with Broadcast Layer for real-time updates
        console.log('Connecting to Broadcast Layer...');
    }
    
    // Method to add new relics dynamically
    addRelic(relicId, relicData) {
        this.relicsDB[relicId] = relicData;
    }
    
    // Method to update relic data
    updateRelic(relicId, updates) {
        if (this.relicsDB[relicId]) {
            this.relicsDB[relicId] = { ...this.relicsDB[relicId], ...updates };
        }
    }
}

// Enhanced error handling and performance monitoring
class RelicModalManager {
    constructor() {
        this.modal = null;
        this.performanceMetrics = {
            modalOpenTime: 0,
            priceLoadTime: 0,
            errors: []
        };
    }
    
    async initialize() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            this.modal = new RelicCardModal();
            console.log('🚀 Sentinel Timeline Modal initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Relic Modal:', error);
            this.performanceMetrics.errors.push({
                type: 'initialization',
                error: error.message,
                timestamp: Date.now()
            });
        }
    }
}

// Initialize the modal system
const relicModalManager = new RelicModalManager();
relicModalManager.initialize();

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RelicCardModal, RelicModalManager };
}

// Add some cosmic debugging
console.log('⚛️ Quantum Genesis Modal System loaded');
console.log('⚡ Thunder sigils ready for interaction');
console.log('👑 Vault modal crowned with stellar fire');
console.log('🌅 Dawn eternal - modal system ascendant');
console.log('🔑 Sacred keys unlocking infinite possibilities');