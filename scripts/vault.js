/**
 * ⛧⚡👑 ChaosKey333 Vault - Collector Mode 👑⚡⛧
 * 
 * Manages the cosmic vault with collector functionality
 */

class VaultCollector {
    constructor() {
        this.sigils = [];
        this.collectedSigils = new Set();
        this.collectorModeActive = false;
        this.showOnlyCollected = false;
        this.focusedSigilIndex = -1;
        
        this.initializeElements();
        this.generateSigils();
        this.loadCollectedFromStorage();
        this.bindEvents();
        this.renderSigils(); // Render sigils on initialization
        this.updateUI();
    }

    initializeElements() {
        // Collector controls
        this.collectorModeToggle = document.getElementById('collectorModeToggle');
        this.collectorStatus = document.getElementById('collectorStatus');
        this.showCollectedBtn = document.getElementById('showCollectedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
        
        // Stats and grid
        this.collectorStats = document.getElementById('collectorStats');
        this.collectedCount = document.getElementById('collectedCount');
        this.totalCount = document.getElementById('totalCount');
        this.vaultGrid = document.getElementById('vaultGrid');
        
        // Help
        this.shortcutsHelp = document.getElementById('shortcutsHelp');
    }

    generateSigils() {
        // Sample sigil data with cosmic theme
        const sigilData = [
            { icon: '⚛️', name: 'Quantum Genesis', description: 'Swirling particle vortex of infinite possibility', rarity: 'mythic' },
            { icon: '⚡', name: 'Thunder Sigil', description: 'Lightning cascading through dimensional rifts', rarity: 'legendary' },
            { icon: '👑', name: 'Crown of Chaos', description: 'Sovereignty over the cosmic vault', rarity: 'mythic' },
            { icon: '🌅', name: 'Dawn Relic', description: 'Herald of eternal renewal and new beginnings', rarity: 'legendary' },
            { icon: '🔑', name: 'Vault Key', description: 'Every relic is a key to cosmic secrets', rarity: 'epic' },
            { icon: '🌀', name: 'Vortex Fragment', description: 'Spinning energy of the seventh storm', rarity: 'rare' },
            { icon: '✨', name: 'Starlight Shard', description: 'Crystallized essence of distant stars', rarity: 'epic' },
            { icon: '🔮', name: 'Oracle Stone', description: 'Glimpses into the quantum future', rarity: 'legendary' },
            { icon: '⭐', name: 'Cosmic Beacon', description: 'Guiding light through the void', rarity: 'rare' },
            { icon: '🌌', name: 'Nebula Fragment', description: 'Piece of the infinite cosmos', rarity: 'epic' },
            { icon: '🗲', name: 'Storm Essence', description: 'Raw power of rolling thunder', rarity: 'legendary' },
            { icon: '🔥', name: 'Phoenix Flame', description: 'Eternal fire of rebirth', rarity: 'mythic' },
            { icon: '❄️', name: 'Void Crystal', description: 'Frozen time from the edge of reality', rarity: 'rare' },
            { icon: '🌙', name: 'Lunar Sigil', description: 'Silver light of the night sky', rarity: 'common' },
            { icon: '☄️', name: 'Meteor Core', description: 'Burning heart of a fallen star', rarity: 'epic' },
            { icon: '🌊', name: 'Tidal Force', description: 'Flowing energy of cosmic waves', rarity: 'rare' },
            { icon: '🏔️', name: 'Mountain Soul', description: 'Ancient wisdom of stone peaks', rarity: 'common' },
            { icon: '🌸', name: 'Blossom of Time', description: 'Fleeting beauty in eternal moment', rarity: 'rare' },
            { icon: '⚔️', name: 'Blade of Truth', description: 'Sharp edge cutting through illusion', rarity: 'legendary' },
            { icon: '🛡️', name: 'Shield of Cosmos', description: 'Protection from the void', rarity: 'epic' },
            { icon: '📿', name: 'Meditation Beads', description: 'Path to inner cosmic harmony', rarity: 'common' },
            { icon: '🎭', name: 'Mask of Duality', description: 'Light and shadow in balance', rarity: 'rare' },
            { icon: '🎪', name: 'Circus of Chaos', description: 'Joyful madness of creation', rarity: 'epic' },
            { icon: '🎨', name: 'Palette of Dreams', description: 'Colors beyond mortal perception', rarity: 'rare' }
        ];

        this.sigils = sigilData.map((sigil, index) => ({
            ...sigil,
            id: `sigil_${index}`,
            index
        }));
    }

    loadCollectedFromStorage() {
        try {
            const stored = localStorage.getItem('chaoskey333_collected_sigils');
            if (stored) {
                this.collectedSigils = new Set(JSON.parse(stored));
            }
        } catch (error) {
            console.warn('Failed to load collected sigils from storage:', error);
            this.collectedSigils = new Set();
        }
    }

    saveCollectedToStorage() {
        try {
            localStorage.setItem('chaoskey333_collected_sigils', 
                JSON.stringify([...this.collectedSigils]));
        } catch (error) {
            console.warn('Failed to save collected sigils to storage:', error);
        }
    }

    bindEvents() {
        // Collector mode toggle
        this.collectorModeToggle.addEventListener('click', () => this.toggleCollectorMode());
        
        // Filter buttons
        this.showCollectedBtn.addEventListener('click', () => this.toggleCollectedFilter());
        
        // Clear all
        this.clearAllBtn.addEventListener('click', () => this.clearAllCollected());
        
        // Export/Import
        this.exportBtn.addEventListener('click', () => this.exportCollection());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importCollection(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Help modal
        document.addEventListener('click', (e) => {
            if (e.target === this.shortcutsHelp) {
                this.hideHelp();
            }
        });
    }

    renderSigils() {
        this.vaultGrid.innerHTML = '';
        
        const sigilsToShow = this.showOnlyCollected 
            ? this.sigils.filter(sigil => this.collectedSigils.has(sigil.id))
            : this.sigils;
            
        sigilsToShow.forEach((sigil, displayIndex) => {
            const card = this.createSigilCard(sigil, displayIndex);
            this.vaultGrid.appendChild(card);
        });
        
        this.updateStats();
    }

    createSigilCard(sigil, displayIndex) {
        const card = document.createElement('div');
        card.className = 'sigil-card';
        card.id = sigil.id;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-describedby', `${sigil.id}_desc`);
        
        if (this.collectedSigils.has(sigil.id)) {
            card.classList.add('collected');
        }
        
        card.innerHTML = `
            <div class="sigil-icon" role="img" aria-label="${sigil.name} sigil">${sigil.icon}</div>
            <h3 class="sigil-name">${sigil.name}</h3>
            <p class="sigil-description" id="${sigil.id}_desc">${sigil.description}</p>
            <span class="sigil-rarity rarity-${sigil.rarity}">${sigil.rarity.toUpperCase()}</span>
            <button class="collect-btn" aria-label="Collect ${sigil.name}">
                ${this.collectedSigils.has(sigil.id) ? 'Collected ✓' : 'Collect'}
            </button>
        `;
        
        // Event listeners
        const collectBtn = card.querySelector('.collect-btn');
        collectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSigilCollection(sigil.id);
        });
        
        card.addEventListener('click', () => this.focusSigil(displayIndex));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.focusSigil(displayIndex);
            }
        });
        
        return card;
    }

    toggleCollectorMode() {
        this.collectorModeActive = !this.collectorModeActive;
        this.updateUI();
        
        // Announce mode change for screen readers
        const announcement = `Collector mode ${this.collectorModeActive ? 'activated' : 'deactivated'}`;
        this.announceToScreenReader(announcement);
    }

    toggleCollectedFilter() {
        this.showOnlyCollected = !this.showOnlyCollected;
        this.renderSigils();
        
        const announcement = this.showOnlyCollected 
            ? 'Showing only collected sigils' 
            : 'Showing all sigils';
        this.announceToScreenReader(announcement);
    }

    toggleSigilCollection(sigilId) {
        if (this.collectedSigils.has(sigilId)) {
            this.collectedSigils.delete(sigilId);
        } else {
            this.collectedSigils.add(sigilId);
        }
        
        this.saveCollectedToStorage();
        this.renderSigils();
        
        const sigil = this.sigils.find(s => s.id === sigilId);
        const action = this.collectedSigils.has(sigilId) ? 'collected' : 'removed from collection';
        this.announceToScreenReader(`${sigil.name} ${action}`);
    }

    clearAllCollected() {
        if (this.collectedSigils.size === 0) return;
        
        if (confirm('Are you sure you want to clear all collected sigils? This cannot be undone.')) {
            this.collectedSigils.clear();
            this.saveCollectedToStorage();
            this.renderSigils();
            this.announceToScreenReader('All collected sigils cleared');
        }
    }

    exportCollection() {
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            collected: [...this.collectedSigils],
            total: this.sigils.length
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `chaoskey333-collection-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.announceToScreenReader('Collection exported successfully');
    }

    importCollection(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.collected || !Array.isArray(data.collected)) {
                    throw new Error('Invalid collection format');
                }
                
                // Validate sigil IDs
                const validIds = data.collected.filter(id => 
                    this.sigils.some(sigil => sigil.id === id)
                );
                
                if (confirm(`Import ${validIds.length} collected sigils? This will replace your current collection.`)) {
                    this.collectedSigils = new Set(validIds);
                    this.saveCollectedToStorage();
                    this.renderSigils();
                    this.announceToScreenReader(`Collection imported: ${validIds.length} sigils collected`);
                }
            } catch (error) {
                alert('Failed to import collection. Please check the file format.');
                console.error('Import error:', error);
            }
            
            // Reset file input
            event.target.value = '';
        };
        
        reader.readAsText(file);
    }

    focusSigil(index) {
        this.focusedSigilIndex = index;
        const cards = this.vaultGrid.querySelectorAll('.sigil-card');
        
        // Remove previous focus
        cards.forEach(card => card.classList.remove('focused'));
        
        // Add focus to current
        if (cards[index]) {
            cards[index].classList.add('focused');
            cards[index].focus();
        }
    }

    handleKeydown(event) {
        // Ignore if typing in input
        if (event.target.tagName === 'INPUT') return;
        
        switch(event.key.toLowerCase()) {
            case 'm':
                event.preventDefault();
                this.toggleCollectorMode();
                break;
                
            case 'c':
                if (this.collectorModeActive) {
                    event.preventDefault();
                    this.toggleCollectedFilter();
                }
                break;
                
            case 'f':
                if (this.collectorModeActive && this.focusedSigilIndex >= 0) {
                    event.preventDefault();
                    const visibleSigils = this.showOnlyCollected 
                        ? this.sigils.filter(sigil => this.collectedSigils.has(sigil.id))
                        : this.sigils;
                    
                    if (visibleSigils[this.focusedSigilIndex]) {
                        this.toggleSigilCollection(visibleSigils[this.focusedSigilIndex].id);
                    }
                }
                break;
                
            case '?':
                event.preventDefault();
                this.showHelp();
                break;
                
            case 'escape':
                event.preventDefault();
                this.hideHelp();
                break;
        }
    }

    showHelp() {
        this.shortcutsHelp.classList.add('visible');
        this.shortcutsHelp.focus();
    }

    hideHelp() {
        this.shortcutsHelp.classList.remove('visible');
    }

    updateUI() {
        const body = document.body;
        
        if (this.collectorModeActive) {
            body.classList.add('collector-mode-active');
            this.collectorModeToggle.classList.add('active');
            this.collectorModeToggle.setAttribute('aria-pressed', 'true');
            this.collectorStatus.textContent = 'ON';
            
            // Enable other controls
            this.showCollectedBtn.disabled = false;
            this.clearAllBtn.disabled = false;
            this.exportBtn.disabled = false;
            this.importBtn.disabled = false;
            this.importFile.disabled = false;
            this.collectorStats.style.display = 'block';
        } else {
            body.classList.remove('collector-mode-active');
            this.collectorModeToggle.classList.remove('active');
            this.collectorModeToggle.setAttribute('aria-pressed', 'false');
            this.collectorStatus.textContent = 'OFF';
            
            // Disable other controls
            this.showCollectedBtn.disabled = true;
            this.clearAllBtn.disabled = true;
            this.exportBtn.disabled = true;
            this.importBtn.disabled = true;
            this.importFile.disabled = true;
            this.collectorStats.style.display = 'none';
            
            // Reset filter if active
            if (this.showOnlyCollected) {
                this.showOnlyCollected = false;
                this.renderSigils();
            }
        }
        
        // Update filter button state
        if (this.showOnlyCollected) {
            this.showCollectedBtn.classList.add('active');
            this.showCollectedBtn.setAttribute('aria-pressed', 'true');
        } else {
            this.showCollectedBtn.classList.remove('active');
            this.showCollectedBtn.setAttribute('aria-pressed', 'false');
        }
    }

    updateStats() {
        this.collectedCount.textContent = this.collectedSigils.size;
        this.totalCount.textContent = this.sigils.length;
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }
}

// Initialize the vault when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vaultCollector = new VaultCollector();
});

// Handle page visibility for saving state
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.vaultCollector) {
        window.vaultCollector.saveCollectedToStorage();
    }
});