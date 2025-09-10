/**
 * Prophecy Loader - Client-side prophecy caching and serving system
 * Manages whisper delivery for different sigils with fallback support
 */
class ProphecyLoader {
  constructor() {
    this.prophecies = null;
    this.cache = new Map();
    this.recentWhispers = new Set();
    this.maxRecentWhispers = 10; // Prevent repeats in short cycles
  }

  /**
   * Load prophecies from the lore repository
   * @returns {Promise<Object>} The prophecies data
   */
  async loadProphecies() {
    if (this.prophecies) {
      return this.prophecies;
    }

    try {
      const response = await fetch('../lore/prophecies.json');
      if (!response.ok) {
        throw new Error(`Failed to load prophecies: ${response.statusText}`);
      }
      this.prophecies = await response.json();
      return this.prophecies;
    } catch (error) {
      console.warn('Failed to load prophecies from lore, using fallback:', error);
      // Fallback prophecies in case the file can't be loaded
      this.prophecies = {
        global: ['The ancient whispers guide those who seek.'],
        genesis: ['From the first spark, possibilities emerge.'],
        thunder: ['Thunder speaks with cosmic authority.'],
        vault: ['The eternal vault recognizes worthy souls.'],
        sentinel: ['The guardian watches over your journey.']
      };
      return this.prophecies;
    }
  }

  /**
   * Get a random whisper from the specified sigil pool or global fallback
   * @param {string} sigil - The sigil type (genesis, thunder, vault, sentinel)
   * @returns {Promise<string>} A prophecy whisper
   */
  async getWhisper(sigil = null) {
    await this.loadProphecies();

    let pool = this.prophecies.global;
    
    // Try to get sigil-specific pool first
    if (sigil && this.prophecies[sigil] && this.prophecies[sigil].length > 0) {
      pool = this.prophecies[sigil];
    }

    // Filter out recently shown whispers to prevent immediate repeats
    const availableWhispers = pool.filter(whisper => !this.recentWhispers.has(whisper));
    
    // If all whispers were recently shown, clear the recent set and use full pool
    const finalPool = availableWhispers.length > 0 ? availableWhispers : pool;
    
    // Select random whisper
    const randomIndex = Math.floor(Math.random() * finalPool.length);
    const selectedWhisper = finalPool[randomIndex];

    // Track recent whispers
    this.recentWhispers.add(selectedWhisper);
    if (this.recentWhispers.size > this.maxRecentWhispers) {
      const firstItem = this.recentWhispers.values().next().value;
      this.recentWhispers.delete(firstItem);
    }

    return selectedWhisper;
  }

  /**
   * Get multiple whispers from a sigil pool
   * @param {string} sigil - The sigil type
   * @param {number} count - Number of whispers to retrieve
   * @returns {Promise<Array<string>>} Array of prophecy whispers
   */
  async getMultipleWhispers(sigil = null, count = 3) {
    const whispers = [];
    const usedInThisRequest = new Set();
    
    for (let i = 0; i < count; i++) {
      await this.loadProphecies();
      
      let pool = this.prophecies.global;
      if (sigil && this.prophecies[sigil] && this.prophecies[sigil].length > 0) {
        pool = this.prophecies[sigil];
      }

      // Filter out whispers already used in this request and recently shown
      const availableWhispers = pool.filter(whisper => 
        !usedInThisRequest.has(whisper) && !this.recentWhispers.has(whisper)
      );
      
      const finalPool = availableWhispers.length > 0 ? availableWhispers : 
        pool.filter(whisper => !usedInThisRequest.has(whisper));
      
      if (finalPool.length === 0) break; // No more unique whispers available
      
      const randomIndex = Math.floor(Math.random() * finalPool.length);
      const selectedWhisper = finalPool[randomIndex];
      
      whispers.push(selectedWhisper);
      usedInThisRequest.add(selectedWhisper);
      this.recentWhispers.add(selectedWhisper);
    }

    // Maintain recent whispers limit
    while (this.recentWhispers.size > this.maxRecentWhispers) {
      const firstItem = this.recentWhispers.values().next().value;
      this.recentWhispers.delete(firstItem);
    }

    return whispers;
  }

  /**
   * Get available sigils
   * @returns {Promise<Array<string>>} Array of available sigil names
   */
  async getAvailableSigils() {
    await this.loadProphecies();
    return Object.keys(this.prophecies).filter(key => key !== 'global');
  }

  /**
   * Check if a specific sigil has whispers available
   * @param {string} sigil - The sigil to check
   * @returns {Promise<boolean>} Whether the sigil has whispers
   */
  async hasSigilWhispers(sigil) {
    await this.loadProphecies();
    return !!(this.prophecies[sigil] && this.prophecies[sigil].length > 0);
  }

  /**
   * Clear the recent whispers cache (useful for testing or manual reset)
   */
  clearRecentWhispers() {
    this.recentWhispers.clear();
  }

  /**
   * Get prophecy statistics
   * @returns {Promise<Object>} Statistics about loaded prophecies
   */
  async getStats() {
    await this.loadProphecies();
    const stats = {
      totalSigils: 0,
      totalWhispers: 0,
      sigilCounts: {},
      recentWhispersCount: this.recentWhispers.size
    };

    for (const [sigil, whispers] of Object.entries(this.prophecies)) {
      stats.sigilCounts[sigil] = whispers.length;
      stats.totalWhispers += whispers.length;
      if (sigil !== 'global') {
        stats.totalSigils++;
      }
    }

    return stats;
  }
}

/**
 * Prophecy Engine - Main interface for prophecy interactions
 */
class ProphecyEngine {
  constructor() {
    this.loader = new ProphecyLoader();
    this.currentElement = null;
    this.autoRefreshInterval = null;
  }

  /**
   * Initialize the prophecy engine with a target element
   * @param {string|HTMLElement} element - Target element or selector
   */
  async initialize(element) {
    if (typeof element === 'string') {
      this.currentElement = document.querySelector(element);
    } else {
      this.currentElement = element;
    }

    if (!this.currentElement) {
      console.warn('ProphecyEngine: No target element found');
      return;
    }

    // Set up accessibility attributes
    this.currentElement.setAttribute('aria-live', 'polite');
    this.currentElement.setAttribute('aria-label', 'Prophecy whisper');
    
    // Initial whisper
    await this.showWhisper();
  }

  /**
   * Display a whisper in the target element
   * @param {string} sigil - Optional sigil to use
   * @returns {Promise<string>} The displayed whisper
   */
  async showWhisper(sigil = null) {
    if (!this.currentElement) {
      console.warn('ProphecyEngine: No target element initialized');
      return '';
    }

    try {
      const whisper = await this.loader.getWhisper(sigil);
      
      // Add fade effect for smooth transitions
      this.currentElement.style.opacity = '0';
      
      setTimeout(() => {
        this.currentElement.textContent = whisper;
        this.currentElement.style.opacity = '1';
      }, 200);

      return whisper;
    } catch (error) {
      console.error('ProphecyEngine: Failed to show whisper:', error);
      this.currentElement.textContent = 'The whispers are silent for now...';
      return '';
    }
  }

  /**
   * Set up automatic whisper refresh
   * @param {number} intervalMs - Refresh interval in milliseconds
   * @param {string} sigil - Optional sigil to use for all refreshes
   */
  startAutoRefresh(intervalMs = 30000, sigil = null) {
    this.stopAutoRefresh();
    
    this.autoRefreshInterval = setInterval(async () => {
      await this.showWhisper(sigil);
    }, intervalMs);
  }

  /**
   * Stop automatic whisper refresh
   */
  stopAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  /**
   * Get the prophecy loader instance for direct access
   * @returns {ProphecyLoader} The loader instance
   */
  getLoader() {
    return this.loader;
  }
}

// Create global instance
window.ProphecyEngine = ProphecyEngine;
window.ProphecyLoader = ProphecyLoader;

// Auto-initialize if there's a prophecy element on page load
document.addEventListener('DOMContentLoaded', async () => {
  const prophecyElement = document.querySelector('.prophecy-whisper, #prophecy-whisper');
  if (prophecyElement) {
    const engine = new ProphecyEngine();
    await engine.initialize(prophecyElement);
    
    // Set up click-to-refresh
    prophecyElement.addEventListener('click', async () => {
      await engine.showWhisper();
    });
    
    prophecyElement.style.cursor = 'pointer';
    prophecyElement.title = 'Click for a new whisper';
  }
});