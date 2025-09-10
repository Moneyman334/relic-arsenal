/**
 * Eternal Sigil Forge - Main Application Logic
 * Empowers wanderers to craft personalized relic variations
 */

class EternalSigilForge {
    constructor() {
        this.currentRelic = {
            id: null,
            name: 'Unnamed Relic',
            color: '#ff6b35',
            symbol: '⚛️',
            glowIntensity: 50,
            lore: 'An artifact of unknown origin...',
            createdAt: null
        };
        
        this.storageKey = 'eternal-sigil-archive';
        this.activePanel = 'forge';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadArchive();
        this.updatePreview();
        this.generateNewRelicId();
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchPanel(e.target.id.replace('-tab', '')));
        });

        // Forge controls
        document.getElementById('relic-title').addEventListener('input', (e) => {
            this.currentRelic.name = e.target.value || 'Unnamed Relic';
            this.updatePreview();
        });

        document.getElementById('color-picker').addEventListener('input', (e) => {
            this.currentRelic.color = e.target.value;
            this.updatePreview();
        });

        // Color presets
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.currentRelic.color = color;
                document.getElementById('color-picker').value = color;
                this.updatePreview();
            });
        });

        // Glow intensity
        document.getElementById('glow-intensity').addEventListener('input', (e) => {
            this.currentRelic.glowIntensity = parseInt(e.target.value);
            document.getElementById('glow-value').textContent = `${e.target.value}%`;
            this.updatePreview();
        });

        // Symbol selection
        document.querySelectorAll('.symbol-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.symbol-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentRelic.symbol = e.target.dataset.symbol;
                this.updatePreview();
            });
        });

        // Lore inscription
        const loreInput = document.getElementById('relic-inscription');
        loreInput.addEventListener('input', (e) => {
            this.currentRelic.lore = e.target.value || 'An artifact of unknown origin...';
            document.getElementById('lore-count').textContent = e.target.value.length;
            this.updatePreview();
        });

        // Forge actions
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreviewModal());
        document.getElementById('save-relic').addEventListener('click', () => this.saveRelic());
        document.getElementById('reset-forge').addEventListener('click', () => this.resetForge());

        // Archive controls
        document.getElementById('search-archive').addEventListener('input', (e) => {
            this.searchArchive(e.target.value);
        });
        
        document.getElementById('clear-archive').addEventListener('click', () => {
            this.clearArchive();
        });

        // NFT bridge (placeholder)
        document.getElementById('nft-mint').addEventListener('click', () => {
            this.showNFTDialog();
        });
    }

    switchPanel(panelName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`${panelName}-tab`).classList.add('active');

        // Update panels
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${panelName}-panel`).classList.add('active');

        this.activePanel = panelName;

        // Refresh archive if switching to it
        if (panelName === 'archive') {
            this.renderArchive();
        }
    }

    updatePreview() {
        const relicCore = document.getElementById('relic-core');
        const relicSymbol = relicCore.querySelector('.relic-symbol');
        const relicName = document.getElementById('relic-name');
        const relicLore = document.getElementById('relic-lore');

        // Update CSS custom properties for dynamic styling
        relicCore.style.setProperty('--relic-color', this.currentRelic.color);
        relicCore.style.setProperty('--glow-intensity', this.currentRelic.glowIntensity / 100);

        // Update content
        relicSymbol.textContent = this.currentRelic.symbol;
        relicName.textContent = this.currentRelic.name;
        relicLore.textContent = this.currentRelic.lore;
        relicName.style.color = this.currentRelic.color;
    }

    generateNewRelicId() {
        this.currentRelic.id = `relic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    saveRelic() {
        if (!this.validateRelic()) {
            return;
        }

        const relicToSave = {
            ...this.currentRelic,
            createdAt: new Date().toISOString()
        };

        let archive = this.getArchive();
        archive.push(relicToSave);
        
        localStorage.setItem(this.storageKey, JSON.stringify(archive));
        
        this.showSaveConfirmation();
        this.resetForge();
        
        // If we're on the archive panel, refresh it
        if (this.activePanel === 'archive') {
            this.renderArchive();
        }
    }

    validateRelic() {
        if (!this.currentRelic.name || this.currentRelic.name === 'Unnamed Relic') {
            this.showNotification('Please give your relic a unique name!', 'warning');
            return false;
        }

        if (this.currentRelic.name.length < 3) {
            this.showNotification('Relic name must be at least 3 characters long!', 'warning');
            return false;
        }

        return true;
    }

    resetForge() {
        // Reset form inputs
        document.getElementById('relic-title').value = '';
        document.getElementById('color-picker').value = '#ff6b35';
        document.getElementById('glow-intensity').value = '50';
        document.getElementById('glow-value').textContent = '50%';
        document.getElementById('relic-inscription').value = '';
        document.getElementById('lore-count').textContent = '0';

        // Reset symbol selection
        document.querySelectorAll('.symbol-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.symbol-btn[data-symbol="⚛️"]').classList.add('active');

        // Reset current relic
        this.currentRelic = {
            id: null,
            name: 'Unnamed Relic',
            color: '#ff6b35',
            symbol: '⚛️',
            glowIntensity: 50,
            lore: 'An artifact of unknown origin...',
            createdAt: null
        };

        this.generateNewRelicId();
        this.updatePreview();
    }

    getArchive() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    loadArchive() {
        this.renderArchive();
    }

    renderArchive() {
        const archiveGrid = document.getElementById('archive-grid');
        const archive = this.getArchive();

        if (archive.length === 0) {
            archiveGrid.innerHTML = `
                <div class="empty-archive">
                    <p>No relics forged yet. Visit the Forge to create your first relic!</p>
                </div>
            `;
            return;
        }

        archiveGrid.innerHTML = archive.map((relic, index) => `
            <div class="archive-item" data-relic-id="${relic.id}">
                <div class="archive-relic">
                    <div class="relic-core" style="--relic-color: ${relic.color}; --glow-intensity: ${relic.glowIntensity / 100}">
                        <div class="relic-symbol">${relic.symbol}</div>
                        <div class="relic-glow"></div>
                    </div>
                </div>
                <h4>${relic.name}</h4>
                <p class="relic-lore">${relic.lore}</p>
                <div class="relic-meta">
                    <small>${this.formatDate(relic.createdAt)}</small>
                    <button class="delete-relic" onclick="forge.deleteRelic('${relic.id}')" title="Delete Relic">🗑️</button>
                </div>
            </div>
        `).join('');

        // Add click listeners for loading relics
        document.querySelectorAll('.archive-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-relic')) {
                    this.loadRelicToForge(item.dataset.relicId);
                }
            });
        });
    }

    searchArchive(query) {
        const items = document.querySelectorAll('.archive-item');
        const searchLower = query.toLowerCase();

        items.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const lore = item.querySelector('.relic-lore').textContent.toLowerCase();
            
            if (name.includes(searchLower) || lore.includes(searchLower)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    loadRelicToForge(relicId) {
        const archive = this.getArchive();
        const relic = archive.find(r => r.id === relicId);
        
        if (!relic) {
            this.showNotification('Relic not found!', 'error');
            return;
        }

        // Load relic data into forge
        this.currentRelic = { ...relic };
        
        // Update form inputs
        document.getElementById('relic-title').value = relic.name;
        document.getElementById('color-picker').value = relic.color;
        document.getElementById('glow-intensity').value = relic.glowIntensity;
        document.getElementById('glow-value').textContent = `${relic.glowIntensity}%`;
        document.getElementById('relic-inscription').value = relic.lore;
        document.getElementById('lore-count').textContent = relic.lore.length;

        // Update symbol selection
        document.querySelectorAll('.symbol-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-symbol="${relic.symbol}"]`).classList.add('active');

        // Switch to forge panel
        this.switchPanel('forge');
        this.updatePreview();

        this.showNotification(`Loaded "${relic.name}" into the forge!`, 'success');
    }

    deleteRelic(relicId) {
        if (!confirm('Are you sure you want to destroy this relic? This action cannot be undone!')) {
            return;
        }

        let archive = this.getArchive();
        archive = archive.filter(relic => relic.id !== relicId);
        localStorage.setItem(this.storageKey, JSON.stringify(archive));
        
        this.renderArchive();
        this.showNotification('Relic has been destroyed!', 'success');
    }

    clearArchive() {
        if (!confirm('Are you sure you want to clear your entire archive? This will destroy all your forged relics!')) {
            return;
        }

        localStorage.removeItem(this.storageKey);
        this.renderArchive();
        this.showNotification('Archive cleared!', 'success');
    }

    showPreviewModal() {
        // Create a temporary modal for full preview
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.1); padding: 3rem; border-radius: 20px; text-align: center; border: 2px solid rgba(255, 107, 53, 0.5);">
                <div style="display: flex; justify-content: center; margin-bottom: 2rem;">
                    <div class="relic-core" style="--relic-color: ${this.currentRelic.color}; --glow-intensity: ${this.currentRelic.glowIntensity / 100}; width: 200px; height: 200px;">
                        <div class="relic-symbol" style="font-size: 5rem;">${this.currentRelic.symbol}</div>
                        <div class="relic-glow"></div>
                    </div>
                </div>
                <h2 style="color: ${this.currentRelic.color}; margin-bottom: 1rem; font-size: 2rem;">${this.currentRelic.name}</h2>
                <p style="color: #b0b0b0; max-width: 400px; line-height: 1.5;">${this.currentRelic.lore}</p>
                <button id="close-preview" class="action-btn secondary" style="margin-top: 2rem;">Close Preview</button>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('close-preview').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showSaveConfirmation() {
        this.showNotification(`"${this.currentRelic.name}" has been forged and sealed in your archive!`, 'success');
    }

    showNFTDialog() {
        this.showNotification('NFT Bridge feature is coming soon! Stay tuned for blockchain integration.', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'linear-gradient(45deg, #27ae60, #2ecc71)' : 
                         type === 'warning' ? 'linear-gradient(45deg, #f39c12, #e67e22)' :
                         type === 'error' ? 'linear-gradient(45deg, #e74c3c, #c0392b)' :
                         'linear-gradient(45deg, #3498db, #2980b9)'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            font-weight: 600;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // Export functionality for potential NFT integration
    exportRelic(relicId) {
        const archive = this.getArchive();
        const relic = archive.find(r => r.id === relicId);
        
        if (!relic) {
            this.showNotification('Relic not found!', 'error');
            return null;
        }

        return {
            ...relic,
            metadata: {
                platform: 'EternalSigilForge',
                version: '1.0.0',
                exportedAt: new Date().toISOString()
            }
        };
    }

    // Import functionality
    importRelic(relicData) {
        try {
            const newRelic = {
                ...relicData,
                id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString()
            };

            let archive = this.getArchive();
            archive.push(newRelic);
            localStorage.setItem(this.storageKey, JSON.stringify(archive));
            
            this.renderArchive();
            this.showNotification(`Imported "${newRelic.name}" successfully!`, 'success');
            
            return true;
        } catch (error) {
            this.showNotification('Failed to import relic data!', 'error');
            return false;
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the Eternal Sigil Forge when the page loads
let forge;
document.addEventListener('DOMContentLoaded', () => {
    forge = new EternalSigilForge();
    
    // Make forge globally accessible for event handlers
    window.forge = forge;
    
    console.log('⚡ Eternal Sigil Forge initialized! ⚡');
    console.log('🔮 Ready to forge cosmic relics! 🔮');
});