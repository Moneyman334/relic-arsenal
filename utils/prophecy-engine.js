import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * ProphecyEngine - Centralized system for managing and fetching prophecy fragments
 * 
 * Features:
 * - Dynamic prophecy loading from lore.json
 * - Fallback system for missing/empty prophecies
 * - Placeholder cycling when no prophecies available
 * - Modular structure for future expansions
 */
export class ProphecyEngine {
  constructor(loreFilePath = null) {
    this.loreFilePath = loreFilePath || join(__dirname, '../docs/lore/prophecies.json');
    this.loreData = null;
    this.placeholderIndex = 0;
    this.isInitialized = false;
    
    // Initialize the engine
    this._initialize();
  }

  /**
   * Initialize the prophecy engine by loading lore data
   * @private
   */
  _initialize() {
    try {
      this._loadLoreData();
      this.isInitialized = true;
    } catch (error) {
      console.warn('ProphecyEngine: Failed to initialize with lore file, using fallback mode');
      this.loreData = null;
      this.isInitialized = true;
    }
  }

  /**
   * Load prophecy data from the lore.json file
   * @private
   */
  _loadLoreData() {
    try {
      const fileContent = readFileSync(this.loreFilePath, 'utf8');
      this.loreData = JSON.parse(fileContent);
      
      if (!this.loreData || typeof this.loreData !== 'object') {
        throw new Error('Invalid lore data structure');
      }
    } catch (error) {
      throw new Error(`Failed to load lore data: ${error.message}`);
    }
  }

  /**
   * Get all available prophecy categories
   * @returns {Array<string>} Array of category names
   */
  getCategories() {
    if (!this.loreData || !this.loreData.categories) {
      return [];
    }
    return Object.keys(this.loreData.categories);
  }

  /**
   * Get prophecies from a specific category
   * @param {string} category - The prophecy category
   * @returns {Array<Object>} Array of prophecy objects
   */
  getPropheciesByCategory(category) {
    if (!this.loreData || !this.loreData.prophecies || !this.loreData.prophecies[category]) {
      return [];
    }
    return this.loreData.prophecies[category];
  }

  /**
   * Get a random prophecy from any category
   * @returns {Object} Random prophecy object with text and metadata
   */
  getRandomProphecy() {
    if (!this.loreData || !this.loreData.prophecies) {
      return this._getPlaceholderProphecy();
    }

    const categories = Object.keys(this.loreData.prophecies);
    if (categories.length === 0) {
      return this._getPlaceholderProphecy();
    }

    // Get all prophecies from all categories
    const allProphecies = [];
    categories.forEach(category => {
      const prophecies = this.loreData.prophecies[category];
      if (Array.isArray(prophecies)) {
        prophecies.forEach(prophecy => {
          allProphecies.push({
            ...prophecy,
            category: category
          });
        });
      }
    });

    if (allProphecies.length === 0) {
      return this._getPlaceholderProphecy();
    }

    const randomIndex = Math.floor(Math.random() * allProphecies.length);
    return allProphecies[randomIndex];
  }

  /**
   * Get a random prophecy from a specific category
   * @param {string} category - The prophecy category
   * @returns {Object} Random prophecy object from the specified category
   */
  getRandomProphecyByCategory(category) {
    const prophecies = this.getPropheciesByCategory(category);
    
    if (prophecies.length === 0) {
      return this._getPlaceholderProphecy();
    }

    const randomIndex = Math.floor(Math.random() * prophecies.length);
    return {
      ...prophecies[randomIndex],
      category: category
    };
  }

  /**
   * Get a prophecy by its specific ID
   * @param {string} id - The prophecy ID
   * @returns {Object|null} Prophecy object or null if not found
   */
  getProphecyById(id) {
    if (!this.loreData || !this.loreData.prophecies) {
      return null;
    }

    // Search through all categories for the prophecy ID
    for (const category of Object.keys(this.loreData.prophecies)) {
      const prophecies = this.loreData.prophecies[category];
      if (Array.isArray(prophecies)) {
        const prophecy = prophecies.find(p => p.id === id);
        if (prophecy) {
          return {
            ...prophecy,
            category: category
          };
        }
      }
    }

    return null;
  }

  /**
   * Get relic whispers for a specific relic
   * @param {string} relicName - Name of the relic
   * @returns {Array<Object>} Array of whispers for the relic
   */
  getRelicWhispers(relicName) {
    const relicProphecies = this.getPropheciesByCategory('relics');
    return relicProphecies.filter(prophecy => 
      prophecy.relic && prophecy.relic.toLowerCase().includes(relicName.toLowerCase())
    );
  }

  /**
   * Get a cycling placeholder prophecy (fallback mechanism)
   * @private
   * @returns {Object} Placeholder prophecy object
   */
  _getPlaceholderProphecy() {
    const defaultPlaceholders = [
      {
        id: 'default-placeholder-1',
        text: 'The ancient whispers grow silent... more prophecies shall emerge from the cosmic void...',
        category: 'placeholder',
        isPlaceholder: true
      },
      {
        id: 'default-placeholder-2',
        text: 'In quantum silence, new prophecies gather like storm clouds on reality\'s horizon...',
        category: 'placeholder',
        isPlaceholder: true
      },
      {
        id: 'default-placeholder-3',
        text: 'The vault\'s mysteries deepen... patience, guardian, for revelation comes to those who wait...',
        category: 'placeholder',
        isPlaceholder: true
      }
    ];

    // Use lore placeholders if available, otherwise use defaults
    let placeholders = defaultPlaceholders;
    if (this.loreData && this.loreData.placeholders && Array.isArray(this.loreData.placeholders)) {
      placeholders = this.loreData.placeholders.map(p => ({
        ...p,
        isPlaceholder: true
      }));
    }

    // Cycle through placeholders
    const placeholder = placeholders[this.placeholderIndex % placeholders.length];
    this.placeholderIndex++;

    return placeholder;
  }

  /**
   * Get prophecy engine metadata
   * @returns {Object} Engine metadata and statistics
   */
  getMetadata() {
    const metadata = {
      isInitialized: this.isInitialized,
      hasLoreData: !!this.loreData,
      loreFilePath: this.loreFilePath
    };

    if (this.loreData) {
      metadata.loreVersion = this.loreData.meta?.version || 'unknown';
      metadata.lastUpdated = this.loreData.meta?.lastUpdated || 'unknown';
      metadata.categories = Object.keys(this.loreData.categories || {});
      
      // Count prophecies in each category
      metadata.prophecyCounts = {};
      if (this.loreData.prophecies) {
        Object.keys(this.loreData.prophecies).forEach(category => {
          metadata.prophecyCounts[category] = this.loreData.prophecies[category].length;
        });
      }
      
      metadata.placeholderCount = this.loreData.placeholders?.length || 0;
    }

    return metadata;
  }

  /**
   * Reload the lore data (useful for dynamic updates)
   * @returns {boolean} Success status
   */
  reload() {
    try {
      this._loadLoreData();
      return true;
    } catch (error) {
      console.warn('ProphecyEngine: Failed to reload lore data');
      return false;
    }
  }
}

// Export a default instance for convenience
export const prophecyEngine = new ProphecyEngine();

// Export individual functions for specific use cases
export const getRandomProphecy = () => prophecyEngine.getRandomProphecy();
export const getRandomRelicWhisper = () => prophecyEngine.getRandomProphecyByCategory('relics');
export const getRandomStormProphecy = () => prophecyEngine.getRandomProphecyByCategory('storms');
export const getRandomVaultMystery = () => prophecyEngine.getRandomProphecyByCategory('vault');
export const getRandomQuantumProphecy = () => prophecyEngine.getRandomProphecyByCategory('quantum');