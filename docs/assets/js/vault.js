/**
 * ⚡👑 ChaosKey333 Relic Vault - Main Controller 👑⚡
 * "Through quantum tempests, we forge eternity. In rolling thunder, we crown the dawn."
 */

class RelicVault {
    constructor() {
        this.relics = this.initializeRelics();
        this.currentView = 'relics';
        this.tooltip = document.getElementById('tooltip');
        
        this.initializeEventListeners();
        this.renderRelics();
        this.showLoadingIndicator();
        
        // Simulate vault awakening
        setTimeout(() => {
            this.hideLoadingIndicator();
            this.playWelcomeAnimation();
        }, 1500);
    }

    /**
     * Initialize the sacred relic collection based on the cosmic lore
     */
    initializeRelics() {
        return [
            {
                id: 'quantum-genesis',
                title: 'Quantum Genesis',
                type: 'quantum',
                symbol: '⚛️',
                description: 'Swirling quantum particles dancing with cosmic dawn light, fractal patterns emerging from the primordial void.',
                power: 'Dimensional Transcendence',
                origin: 'Blazing Triptych - Left Panel'
            },
            {
                id: 'rolling-thunderstorm',
                title: 'Rolling Thunderstorm VII',
                type: 'thunder',
                symbol: '⚡',
                description: 'The mighty seventh storm—lightning cascading through dimensional rifts, thunder echoing across parallel realities.',
                power: 'Storm Mastery',
                origin: 'Blazing Triptych - Center Panel'
            },
            {
                id: 'vault-ascendant',
                title: 'Vault Ascendant',
                type: 'crown',
                symbol: '👑',
                description: 'The ChaosKey333 vault elevated to cosmic prominence, crowned with stellar fire and guarded by quantum sentinels.',
                power: 'Vault Sovereignty',
                origin: 'Blazing Triptych - Right Panel'
            },
            {
                id: 'cosmic-dawn-master',
                title: 'Cosmic Dawn Master',
                type: 'dawn',
                symbol: '🌅',
                description: 'The magnificent master banner showcasing the full cosmic awakening of the seventh storm.',
                power: 'Dawn Awakening',
                origin: 'Quantum Dawn Collection'
            },
            {
                id: 'stellar-crown',
                title: 'Stellar Crown',
                type: 'crown',
                symbol: '⭐',
                description: 'The cosmic crown of the ascended vault, forged from stellar fire and quantum essence.',
                power: 'Stellar Dominion',
                origin: 'Sacred Regalia'
            },
            {
                id: 'dimensional-lightning',
                title: 'Dimensional Lightning',
                type: 'thunder',
                symbol: '🌩️',
                description: 'Lightning tearing through space-time itself, bridging infinite realities with raw cosmic power.',
                power: 'Reality Rending',
                origin: 'Storm Arsenal'
            },
            {
                id: 'quantum-particle-vortex',
                title: 'Quantum Particle Vortex',
                type: 'quantum',
                symbol: '🌀',
                description: 'Dancing quantum particles forming a cosmic herald of infinite possibilities and dimensional gateways.',
                power: 'Infinity Channeling',
                origin: 'Particle Collection'
            },
            {
                id: 'dawn-herald',
                title: 'Dawn Herald',
                type: 'dawn',
                symbol: '🎺',
                description: 'The cosmic trumpet that announces the arrival of new storms and the awakening of sleeping vaults.',
                power: 'Storm Summoning',
                origin: 'Herald Archive'
            },
            {
                id: 'chaos-key',
                title: 'The Chaos Key',
                type: 'crown',
                symbol: '🔑',
                description: 'The fundamental key that unlocks all vaults and breaks all skies. The ultimate relic of ChaosKey333.',
                power: 'Universal Access',
                origin: 'Prime Artifact'
            },
            {
                id: 'thunder-sigil',
                title: 'Thunder Sigil',
                type: 'thunder',
                symbol: '🔯',
                description: 'Sacred geometric pattern channeling the raw essence of cosmic storms across infinite dimensions.',
                power: 'Storm Binding',
                origin: 'Sigil Collection'
            },
            {
                id: 'quantum-mirror',
                title: 'Quantum Mirror',
                type: 'quantum',
                symbol: '🪞',
                description: 'Reflects infinite possibilities across parallel realities, showing what was, is, and could be.',
                power: 'Reality Sight',
                origin: 'Reflection Vault'
            },
            {
                id: 'dawn-crystal',
                title: 'Dawn Crystal',
                type: 'dawn',
                symbol: '💎',
                description: 'Crystallized essence of the first light, holding the power to illuminate the darkest cosmic voids.',
                power: 'Light Bearer',
                origin: 'Crystal Archive'
            }
        ];
    }

    /**
     * Initialize event listeners for the vault interface
     */
    initializeEventListeners() {
        // Navigation buttons
        document.getElementById('showAllRelics').addEventListener('click', () => this.showRelics());
        document.getElementById('showArchive').addEventListener('click', () => this.showArchive());

        // Window resize handler for responsive layout
        window.addEventListener('resize', () => this.adjustLayout());

        // Tooltip system
        document.addEventListener('mouseover', (e) => this.handleTooltip(e));
        document.addEventListener('mouseout', (e) => this.hideTooltip(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Render all relics in the main display
     */
    renderRelics() {
        const relicGrid = document.getElementById('relicGrid');
        relicGrid.innerHTML = '';

        this.relics.forEach(relic => {
            const relicElement = this.createRelicElement(relic);
            relicGrid.appendChild(relicElement);
        });
    }

    /**
     * Create a relic card element
     */
    createRelicElement(relic) {
        const card = document.createElement('div');
        card.className = 'relic-card';
        card.setAttribute('data-relic-id', relic.id);
        card.setAttribute('data-tooltip', `Power: ${relic.power} | Origin: ${relic.origin}`);

        const isMarked = CollectorArchive.isMarked(relic.id);
        if (isMarked) {
            card.classList.add('marked');
        }

        card.innerHTML = `
            <div class="sigil-display sigil-${relic.type}">
                <span class="sigil-symbol">${relic.symbol}</span>
            </div>
            <h3 class="relic-title">${relic.title}</h3>
            <div class="relic-type">${relic.type.charAt(0).toUpperCase() + relic.type.slice(1)} Relic</div>
            <p class="relic-description">${relic.description}</p>
            <button class="mark-button ${isMarked ? 'marked' : ''}" 
                    data-relic-id="${relic.id}"
                    onclick="VaultController.toggleMark('${relic.id}')">
                ${isMarked ? '👑 Chosen' : '⚡ Mark as Chosen'}
            </button>
        `;

        // Add hover effects for desktop
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => this.animateRelicHover(card, true));
            card.addEventListener('mouseleave', () => this.animateRelicHover(card, false));
        }

        return card;
    }

    /**
     * Toggle mark status for a relic
     */
    toggleMark(relicId) {
        const relic = this.relics.find(r => r.id === relicId);
        if (!relic) return;

        const isCurrentlyMarked = CollectorArchive.isMarked(relicId);
        const relicElement = document.querySelector(`[data-relic-id="${relicId}"]`);
        const markButton = relicElement.querySelector('.mark-button');

        if (isCurrentlyMarked) {
            // Unmark the relic
            CollectorArchive.unmarkRelic(relicId);
            relicElement.classList.remove('marked');
            markButton.classList.remove('marked');
            markButton.innerHTML = '⚡ Mark as Chosen';
            this.showNotification(`${relic.title} removed from your archive`, 'remove');
        } else {
            // Mark the relic
            CollectorArchive.markRelic(relic);
            relicElement.classList.add('marked');
            markButton.classList.add('marked');
            markButton.innerHTML = '👑 Chosen';
            this.showNotification(`${relic.title} added to your collection!`, 'add');
            this.playChosenAnimation(relicElement);
        }

        // Update archive count
        this.updateArchiveCount();
        
        // Refresh archive if currently viewing it
        if (this.currentView === 'archive') {
            this.refreshArchive();
        }
    }

    /**
     * Switch to relics view
     */
    showRelics() {
        this.currentView = 'relics';
        document.getElementById('relicDisplay').classList.remove('hidden');
        document.getElementById('archivePanel').classList.add('hidden');
        
        // Update navigation
        document.getElementById('showAllRelics').classList.add('active');
        document.getElementById('showArchive').classList.remove('active');
    }

    /**
     * Switch to archive view
     */
    showArchive() {
        this.currentView = 'archive';
        document.getElementById('relicDisplay').classList.add('hidden');
        document.getElementById('archivePanel').classList.remove('hidden');
        
        // Update navigation
        document.getElementById('showAllRelics').classList.remove('active');
        document.getElementById('showArchive').classList.add('active');
        
        // Refresh archive display
        this.refreshArchive();
    }

    /**
     * Refresh the archive display
     */
    refreshArchive() {
        // This will be handled by CollectorArchive class
        if (window.CollectorArchive) {
            CollectorArchive.renderArchive();
        }
    }

    /**
     * Update the archive count badge
     */
    updateArchiveCount() {
        const count = CollectorArchive.getMarkedCount();
        const badge = document.getElementById('archiveCount');
        badge.textContent = count;
        
        // Animate the badge update
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }

    /**
     * Show notification
     */
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'add' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    /**
     * Play chosen animation
     */
    playChosenAnimation(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'chosenPulse 0.8s ease-in-out';
        }, 10);
    }

    /**
     * Animate relic hover effects
     */
    animateRelicHover(card, isEntering) {
        const sigil = card.querySelector('.sigil-display');
        if (isEntering) {
            sigil.style.transform = 'scale(1.1) rotate(5deg)';
        } else {
            sigil.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    /**
     * Handle tooltip display
     */
    handleTooltip(e) {
        const element = e.target.closest('[data-tooltip]');
        if (element) {
            const tooltipText = element.getAttribute('data-tooltip');
            this.tooltip.textContent = tooltipText;
            this.tooltip.classList.add('show');
            
            const rect = element.getBoundingClientRect();
            this.tooltip.style.left = rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2) + 'px';
            this.tooltip.style.top = rect.top - this.tooltip.offsetHeight - 10 + 'px';
        }
    }

    /**
     * Hide tooltip
     */
    hideTooltip(e) {
        if (!e.target.closest('[data-tooltip]')) {
            this.tooltip.classList.remove('show');
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(e) {
        switch(e.key) {
            case '1':
                this.showRelics();
                break;
            case '2':
                this.showArchive();
                break;
            case 'Escape':
                if (this.currentView === 'archive') {
                    this.showRelics();
                }
                break;
        }
    }

    /**
     * Adjust layout for responsive design
     */
    adjustLayout() {
        // Trigger re-layout for responsive adjustments
        const isMobile = window.innerWidth <= 768;
        const relicCards = document.querySelectorAll('.relic-card');
        
        relicCards.forEach(card => {
            if (isMobile) {
                // Remove hover listeners on mobile
                card.style.transform = '';
            }
        });
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    /**
     * Play welcome animation
     */
    playWelcomeAnimation() {
        const title = document.querySelector('.vault-title');
        title.style.animation = 'none';
        setTimeout(() => {
            title.style.animation = 'thunderPulse 2s ease-in-out infinite';
        }, 100);
    }
}

// CSS for chosen animation
const chosenAnimationCSS = `
@keyframes chosenPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 30px var(--thunder-gold); }
    100% { transform: scale(1); }
}
`;

// Inject the animation CSS
const style = document.createElement('style');
style.textContent = chosenAnimationCSS;
document.head.appendChild(style);

// Initialize the vault when DOM is loaded
let VaultController;

document.addEventListener('DOMContentLoaded', () => {
    VaultController = new RelicVault();
    
    // Update archive count on initial load
    setTimeout(() => {
        VaultController.updateArchiveCount();
    }, 100);
});