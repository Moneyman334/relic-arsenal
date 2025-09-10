/**
 * ⚡👑 ChaosKey333 Collector Archive - Persistence & Management 👑⚡
 * "Every relic is a key. Every key unlocks eternity."
 */

class CollectorArchive {
    static STORAGE_KEY = 'chaoskey333_collector_archive';
    static VERSION = '1.0.0';

    /**
     * Initialize the collector archive system
     */
    static init() {
        this.ensureStorageIntegrity();
        this.initializeArchiveEventListeners();
        this.updateArchiveDisplay();
    }

    /**
     * Ensure data integrity and handle versioning
     */
    static ensureStorageIntegrity() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        let data = null;

        if (stored) {
            try {
                data = JSON.parse(stored);
                
                // Version migration if needed
                if (!data.version || data.version !== this.VERSION) {
                    data = this.migrateData(data);
                }
            } catch (error) {
                console.warn('Archive data corrupted, initializing fresh archive:', error);
                this.initializeFreshArchive();
                return;
            }
        }

        if (!data) {
            this.initializeFreshArchive();
        }
    }

    /**
     * Initialize a fresh archive
     */
    static initializeFreshArchive() {
        const freshData = {
            version: this.VERSION,
            marked: {},
            metadata: {
                created: new Date().toISOString(),
                totalMarked: 0,
                lastUpdated: new Date().toISOString()
            }
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(freshData));
    }

    /**
     * Migrate data from older versions
     */
    static migrateData(oldData) {
        // Handle migration from older versions
        const newData = {
            version: this.VERSION,
            marked: oldData.marked || {},
            metadata: {
                created: oldData.created || new Date().toISOString(),
                totalMarked: Object.keys(oldData.marked || {}).length,
                lastUpdated: new Date().toISOString(),
                migrated: true,
                previousVersion: oldData.version || 'legacy'
            }
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
        return newData;
    }

    /**
     * Get current archive data
     */
    static getArchiveData() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error parsing archive data:', error);
                this.initializeFreshArchive();
                return this.getArchiveData();
            }
        }
        this.initializeFreshArchive();
        return this.getArchiveData();
    }

    /**
     * Save archive data
     */
    static saveArchiveData(data) {
        data.metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Mark a relic as chosen
     */
    static markRelic(relic) {
        const data = this.getArchiveData();
        
        data.marked[relic.id] = {
            id: relic.id,
            title: relic.title,
            type: relic.type,
            symbol: relic.symbol,
            description: relic.description,
            power: relic.power,
            origin: relic.origin,
            markedAt: new Date().toISOString(),
            notes: '',
            tags: []
        };
        
        data.metadata.totalMarked = Object.keys(data.marked).length;
        this.saveArchiveData(data);
        
        // Update display if archive is currently visible
        if (document.getElementById('archivePanel') && !document.getElementById('archivePanel').classList.contains('hidden')) {
            this.renderArchive();
        }
        
        this.triggerArchiveUpdate();
    }

    /**
     * Unmark a relic
     */
    static unmarkRelic(relicId) {
        const data = this.getArchiveData();
        
        if (data.marked[relicId]) {
            delete data.marked[relicId];
            data.metadata.totalMarked = Object.keys(data.marked).length;
            this.saveArchiveData(data);
            
            // Update display if archive is currently visible
            if (document.getElementById('archivePanel') && !document.getElementById('archivePanel').classList.contains('hidden')) {
                this.renderArchive();
            }
            
            this.triggerArchiveUpdate();
        }
    }

    /**
     * Check if a relic is marked
     */
    static isMarked(relicId) {
        const data = this.getArchiveData();
        return !!data.marked[relicId];
    }

    /**
     * Get count of marked relics
     */
    static getMarkedCount() {
        const data = this.getArchiveData();
        return Object.keys(data.marked).length;
    }

    /**
     * Get all marked relics
     */
    static getMarkedRelics() {
        const data = this.getArchiveData();
        return Object.values(data.marked);
    }

    /**
     * Initialize event listeners for archive functionality
     */
    static initializeArchiveEventListeners() {
        const searchInput = document.getElementById('archiveSearch');
        const sortSelect = document.getElementById('archiveSort');
        const filterSelect = document.getElementById('archiveFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.handleSort());
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.handleFilter());
        }
    }

    /**
     * Render the archive display
     */
    static renderArchive() {
        const archiveGrid = document.getElementById('archiveGrid');
        const emptyState = document.getElementById('emptyArchive');
        const markedRelics = this.getFilteredAndSortedRelics();

        if (markedRelics.length === 0) {
            archiveGrid.innerHTML = '';
            archiveGrid.appendChild(emptyState);
            return;
        }

        archiveGrid.innerHTML = '';
        
        markedRelics.forEach(relic => {
            const archiveItem = this.createArchiveItem(relic);
            archiveGrid.appendChild(archiveItem);
        });
    }

    /**
     * Create an archive item element
     */
    static createArchiveItem(relic) {
        const item = document.createElement('div');
        item.className = 'relic-card archive-item marked';
        item.setAttribute('data-relic-id', relic.id);
        item.setAttribute('data-tooltip', `Marked on: ${new Date(relic.markedAt).toLocaleDateString()} | Power: ${relic.power}`);

        const formattedDate = new Date(relic.markedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        item.innerHTML = `
            <div class="sigil-display sigil-${relic.type}">
                <span class="sigil-symbol">${relic.symbol}</span>
            </div>
            <h3 class="relic-title">${relic.title}</h3>
            <div class="relic-type">${relic.type.charAt(0).toUpperCase() + relic.type.slice(1)} Relic</div>
            <p class="relic-description">${relic.description}</p>
            <div class="archive-meta">
                <span class="marked-date">Chosen: ${formattedDate}</span>
                <button class="unmark-button" 
                        data-relic-id="${relic.id}"
                        onclick="CollectorArchive.unmarkFromArchive('${relic.id}')"
                        title="Remove from collection">
                    🗑️ Remove
                </button>
            </div>
        `;

        return item;
    }

    /**
     * Unmark a relic from the archive view
     */
    static unmarkFromArchive(relicId) {
        const relicData = this.getArchiveData().marked[relicId];
        
        // Show confirmation for removing from archive
        if (confirm(`Remove "${relicData.title}" from your collection?`)) {
            this.unmarkRelic(relicId);
            
            // Update the main relic view if it exists
            const mainRelicElement = document.querySelector(`#relicDisplay [data-relic-id="${relicId}"]`);
            if (mainRelicElement) {
                mainRelicElement.classList.remove('marked');
                const markButton = mainRelicElement.querySelector('.mark-button');
                if (markButton) {
                    markButton.classList.remove('marked');
                    markButton.innerHTML = '⚡ Mark as Chosen';
                }
            }
            
            // Show notification
            if (window.VaultController) {
                VaultController.showNotification(`${relicData.title} removed from your archive`, 'remove');
                VaultController.updateArchiveCount();
            }
        }
    }

    /**
     * Handle search functionality
     */
    static handleSearch() {
        this.renderArchive();
    }

    /**
     * Handle sort functionality
     */
    static handleSort() {
        this.renderArchive();
    }

    /**
     * Handle filter functionality
     */
    static handleFilter() {
        this.renderArchive();
    }

    /**
     * Get filtered and sorted relics
     */
    static getFilteredAndSortedRelics() {
        let relics = this.getMarkedRelics();
        
        // Apply search filter
        const searchTerm = document.getElementById('archiveSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            relics = relics.filter(relic => 
                relic.title.toLowerCase().includes(searchTerm) ||
                relic.description.toLowerCase().includes(searchTerm) ||
                relic.type.toLowerCase().includes(searchTerm) ||
                relic.power.toLowerCase().includes(searchTerm)
            );
        }

        // Apply type filter
        const typeFilter = document.getElementById('archiveFilter')?.value || 'all';
        if (typeFilter !== 'all') {
            relics = relics.filter(relic => relic.type === typeFilter);
        }

        // Apply sort
        const sortBy = document.getElementById('archiveSort')?.value || 'newest';
        relics.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.markedAt) - new Date(a.markedAt);
                case 'oldest':
                    return new Date(a.markedAt) - new Date(b.markedAt);
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });

        return relics;
    }

    /**
     * Update archive display
     */
    static updateArchiveDisplay() {
        // Update count badge
        const countBadge = document.getElementById('archiveCount');
        if (countBadge) {
            countBadge.textContent = this.getMarkedCount();
        }
        
        // Update archive if currently visible
        const archivePanel = document.getElementById('archivePanel');
        if (archivePanel && !archivePanel.classList.contains('hidden')) {
            this.renderArchive();
        }
    }

    /**
     * Trigger archive update event
     */
    static triggerArchiveUpdate() {
        const event = new CustomEvent('archiveUpdated', {
            detail: {
                count: this.getMarkedCount(),
                relics: this.getMarkedRelics()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Export archive data
     */
    static exportArchive() {
        const data = this.getArchiveData();
        const exportData = {
            version: data.version,
            exported: new Date().toISOString(),
            totalRelics: data.metadata.totalMarked,
            relics: Object.values(data.marked)
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chaoskey333-archive-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import archive data
     */
    static importArchive(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // Validate import data
                    if (!importData.relics || !Array.isArray(importData.relics)) {
                        throw new Error('Invalid archive format');
                    }
                    
                    const currentData = this.getArchiveData();
                    let importCount = 0;
                    
                    // Merge imported relics
                    importData.relics.forEach(relic => {
                        if (relic.id && !currentData.marked[relic.id]) {
                            currentData.marked[relic.id] = {
                                ...relic,
                                markedAt: relic.markedAt || new Date().toISOString(),
                                imported: true
                            };
                            importCount++;
                        }
                    });
                    
                    currentData.metadata.totalMarked = Object.keys(currentData.marked).length;
                    this.saveArchiveData(currentData);
                    this.updateArchiveDisplay();
                    
                    resolve({ success: true, imported: importCount });
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Clear entire archive (with confirmation)
     */
    static clearArchive() {
        const count = this.getMarkedCount();
        if (count === 0) {
            alert('Archive is already empty');
            return;
        }
        
        if (confirm(`Are you sure you want to clear your entire archive? This will remove all ${count} marked relics and cannot be undone.`)) {
            this.initializeFreshArchive();
            this.updateArchiveDisplay();
            
            // Update main display
            const markedCards = document.querySelectorAll('.relic-card.marked');
            markedCards.forEach(card => {
                card.classList.remove('marked');
                const button = card.querySelector('.mark-button');
                if (button) {
                    button.classList.remove('marked');
                    button.innerHTML = '⚡ Mark as Chosen';
                }
            });
            
            if (window.VaultController) {
                VaultController.showNotification('Archive cleared successfully', 'remove');
                VaultController.updateArchiveCount();
            }
        }
    }

    /**
     * Get archive statistics
     */
    static getArchiveStats() {
        const data = this.getArchiveData();
        const relics = Object.values(data.marked);
        
        const typeCount = {};
        relics.forEach(relic => {
            typeCount[relic.type] = (typeCount[relic.type] || 0) + 1;
        });
        
        return {
            total: relics.length,
            created: data.metadata.created,
            lastUpdated: data.metadata.lastUpdated,
            typeDistribution: typeCount,
            oldestRelic: relics.length > 0 ? relics.reduce((oldest, relic) => 
                new Date(relic.markedAt) < new Date(oldest.markedAt) ? relic : oldest
            ) : null,
            newestRelic: relics.length > 0 ? relics.reduce((newest, relic) => 
                new Date(relic.markedAt) > new Date(newest.markedAt) ? relic : newest
            ) : null
        };
    }
}

// Initialize the Collector Archive when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CollectorArchive.init();
    
    // Listen for archive update events
    document.addEventListener('archiveUpdated', (e) => {
        console.log('Archive updated:', e.detail);
    });
});

// Export for global access
window.CollectorArchive = CollectorArchive;