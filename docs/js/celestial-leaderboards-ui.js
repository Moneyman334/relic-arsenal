/**
 * Celestial Leaderboards UI Component
 * Handles rendering and user interactions for the leaderboard interface
 */

class CelestialLeaderboardsUI {
    constructor(containerId, leaderboards) {
        this.container = document.getElementById(containerId);
        this.leaderboards = leaderboards;
        this.isVisible = false;
        
        if (!this.container) {
            console.error(`Container element with ID '${containerId}' not found`);
            return;
        }
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        
        // Listen for leaderboard updates
        this.leaderboards.addUpdateListener((leaderboard, stats) => {
            this.updateDisplay(leaderboard, stats);
        });
    }

    render() {
        const stats = this.leaderboards.getStats();
        const leaderboard = this.leaderboards.getLeaderboard();
        
        this.container.innerHTML = `
            <div class="celestial-leaderboards" id="celestialLeaderboards">
                <div class="leaderboard-header">
                    <h1 class="leaderboard-title">⭐ Celestial Leaderboards ⭐</h1>
                    <p class="leaderboard-subtitle">Rally wanderers and spark competition within the Vault</p>
                </div>
                
                <div class="leaderboard-stats">
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalWanderers}</span>
                        <span class="stat-label">Wanderers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalRelics.toLocaleString()}</span>
                        <span class="stat-label">Relics Forged</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalSigils.toLocaleString()}</span>
                        <span class="stat-label">Sigils Collected</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalEchoes.toLocaleString()}</span>
                        <span class="stat-label">Echoes Cast</span>
                    </div>
                </div>
                
                <div class="leaderboard-controls">
                    <button class="cosmic-button" id="simulateActivityBtn">⚡ Simulate Activity</button>
                    <button class="cosmic-button" id="addWandererBtn">➕ Join the Vault</button>
                    <button class="cosmic-button" id="resetLeaderboardBtn">🔄 Reset Demo</button>
                </div>
                
                <div class="wanderer-list" id="wandererList">
                    ${this.renderWandererList(leaderboard)}
                </div>
            </div>
        `;
    }

    renderWandererList(leaderboard) {
        if (leaderboard.length === 0) {
            return `
                <div class="leaderboard-empty">
                    <div class="empty-icon">🌌</div>
                    <p>No wanderers have entered the Vault yet...</p>
                    <p>Be the first to forge your legend!</p>
                </div>
            `;
        }

        return leaderboard.map((wanderer, index) => {
            const rank = index + 1;
            const tierClass = `tier-${wanderer.tier.name.toLowerCase()}`;
            const topThreeClass = rank <= 3 ? 'top-3' : '';
            
            return `
                <div class="wanderer-card ${tierClass}" style="--tier-color: ${wanderer.tier.color}">
                    <div class="wanderer-rank ${topThreeClass}">#${rank}</div>
                    <div class="wanderer-avatar">${wanderer.avatar}</div>
                    <div class="wanderer-info">
                        <h3 class="wanderer-name">${wanderer.name}</h3>
                        <div class="wanderer-tier">${wanderer.tier.name} Wanderer</div>
                        <div class="wanderer-stats">
                            <div class="wanderer-stat">
                                <span class="wanderer-stat-icon">🏺</span>
                                <span>${wanderer.relicsForged.toLocaleString()} relics</span>
                            </div>
                            <div class="wanderer-stat">
                                <span class="wanderer-stat-icon">🔮</span>
                                <span>${wanderer.sigilsCollected.toLocaleString()} sigils</span>
                            </div>
                            <div class="wanderer-stat">
                                <span class="wanderer-stat-icon">📡</span>
                                <span>${wanderer.echosCast.toLocaleString()} echoes</span>
                            </div>
                        </div>
                    </div>
                    <div class="wanderer-score">
                        <span class="wanderer-score-label">Total Score</span>
                        ${wanderer.score.toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }

    bindEvents() {
        // Simulate activity button
        const simulateBtn = document.getElementById('simulateActivityBtn');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => {
                this.simulateActivity();
            });
        }

        // Add wanderer button
        const addBtn = document.getElementById('addWandererBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddWandererDialog();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('resetLeaderboardBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset the leaderboard to demo data?')) {
                    this.leaderboards.reset();
                    this.showNotification('Leaderboard reset to demo data', 'success');
                }
            });
        }
    }

    simulateActivity() {
        this.leaderboards.simulateActivity();
        this.showNotification('Cosmic energies surge through the Vault! 🌟', 'success');
    }

    showAddWandererDialog() {
        const name = prompt('Enter wanderer name:');
        if (name && name.trim()) {
            const avatars = ['👑', '⚡', '🗝️', '🌟', '🔮', '⭐', '💫', '🌙', '☄️', '🔥'];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            
            const newWanderer = this.leaderboards.addWanderer({
                name: name.trim(),
                avatar: randomAvatar
            });
            
            this.showNotification(`${newWanderer.name} has joined the Vault! Welcome, wanderer! ${randomAvatar}`, 'success');
        }
    }

    updateDisplay(leaderboard, stats) {
        // Update stats
        const statElements = this.container.querySelectorAll('.stat-value');
        if (statElements.length >= 4) {
            statElements[0].textContent = stats.totalWanderers;
            statElements[1].textContent = stats.totalRelics.toLocaleString();
            statElements[2].textContent = stats.totalSigils.toLocaleString();
            statElements[3].textContent = stats.totalEchoes.toLocaleString();
        }

        // Update wanderer list
        const wandererList = document.getElementById('wandererList');
        if (wandererList) {
            wandererList.innerHTML = this.renderWandererList(leaderboard);
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.celestial-notification');
        existing.forEach(el => el.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `celestial-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
            background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 
                       type === 'error' ? 'linear-gradient(45deg, #f44336, #d32f2f)' : 
                       'linear-gradient(45deg, #2196F3, #1976D2)'};
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }

    toggle() {
        const leaderboardEl = document.getElementById('celestialLeaderboards');
        if (leaderboardEl) {
            this.isVisible = !this.isVisible;
            leaderboardEl.style.display = this.isVisible ? 'block' : 'none';
        }
    }

    show() {
        const leaderboardEl = document.getElementById('celestialLeaderboards');
        if (leaderboardEl) {
            this.isVisible = true;
            leaderboardEl.style.display = 'block';
        }
    }

    hide() {
        const leaderboardEl = document.getElementById('celestialLeaderboards');
        if (leaderboardEl) {
            this.isVisible = false;
            leaderboardEl.style.display = 'none';
        }
    }
}

// Sentinel Timeline Integration
class SentinelTimeline {
    constructor(leaderboards) {
        this.leaderboards = leaderboards;
        this.events = [];
        this.listeners = [];
    }

    /**
     * Track an event in the Sentinel Timeline
     * @param {string} wandererId - Wanderer ID
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Additional event data
     */
    trackEvent(wandererId, eventType, eventData = {}) {
        const event = {
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            wandererId,
            eventType,
            eventData,
            timestamp: Date.now()
        };

        this.events.unshift(event); // Add to beginning
        
        // Keep only last 100 events
        if (this.events.length > 100) {
            this.events = this.events.slice(0, 100);
        }

        // Update leaderboard based on event
        this.processEventForLeaderboard(event);
        
        // Notify listeners
        this.notifyListeners(event);
        
        return event;
    }

    processEventForLeaderboard(event) {
        switch (event.eventType) {
            case 'relic_forged':
                this.leaderboards.trackAction(event.wandererId, 'relicForged', event.eventData.amount || 1);
                break;
            case 'sigil_collected':
                this.leaderboards.trackAction(event.wandererId, 'sigilCollected', event.eventData.amount || 1);
                break;
            case 'echo_cast':
                this.leaderboards.trackAction(event.wandererId, 'echoCast', event.eventData.amount || 1);
                break;
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    notifyListeners(event) {
        this.listeners.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in sentinel timeline listener:', error);
            }
        });
    }

    getRecentEvents(limit = 10) {
        return this.events.slice(0, limit);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CelestialLeaderboardsUI, SentinelTimeline };
}

// Global instances for browser usage
if (typeof window !== 'undefined') {
    window.CelestialLeaderboardsUI = CelestialLeaderboardsUI;
    window.SentinelTimeline = SentinelTimeline;
}