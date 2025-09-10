/**
 * Prophecy Engine - Mystical whisper system for relic cards
 * Handles prophecy loading and display for sigil-specific relic cards
 */
class ProphecyEngine {
  constructor() {
    this.prophecies = null;
    this.initialized = false;
    this.whisperIntervals = new Map();
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const response = await fetch('../lore/prophecies.json');
      this.prophecies = await response.json();
      this.initialized = true;
      this.startWhispering();
    } catch (error) {
      console.warn('Prophecy Engine: Could not load prophecies, using fallback whispers', error);
      this.prophecies = {
        global: ["The vault whispers of mysteries unknown..."],
        sigils: {}
      };
      this.initialized = true;
      this.startWhispering();
    }
  }

  getRandomProphecy(sigil = null) {
    if (!this.prophecies) return "The whispers are silent...";
    
    // Try to get sigil-specific prophecy first
    if (sigil && this.prophecies.sigils && this.prophecies.sigils[sigil]) {
      const sigilProphecies = this.prophecies.sigils[sigil];
      return sigilProphecies[Math.floor(Math.random() * sigilProphecies.length)];
    }
    
    // Fallback to global prophecies
    if (this.prophecies.global && this.prophecies.global.length > 0) {
      const globalProphecies = this.prophecies.global;
      return globalProphecies[Math.floor(Math.random() * globalProphecies.length)];
    }
    
    return "The cosmos holds its secrets close...";
  }

  startWhispering() {
    const relicCards = document.querySelectorAll('[data-prophecy-card]');
    
    relicCards.forEach(card => {
      const sigil = card.getAttribute('data-sigil');
      const prophecyElement = card.querySelector('[data-prophecy] span[aria-live]');
      
      if (prophecyElement) {
        // Initial prophecy
        this.updateProphecy(prophecyElement, sigil);
        
        // Set up interval for new prophecies every 8-12 seconds
        const interval = setInterval(() => {
          this.updateProphecy(prophecyElement, sigil);
        }, 8000 + Math.random() * 4000); // Random between 8-12 seconds
        
        this.whisperIntervals.set(card, interval);
      }
    });
  }

  updateProphecy(element, sigil) {
    const prophecy = this.getRandomProphecy(sigil);
    element.textContent = prophecy;
    
    // Add a subtle fade effect
    element.style.opacity = '0.7';
    setTimeout(() => {
      element.style.opacity = '1';
    }, 100);
  }

  stopWhispering() {
    this.whisperIntervals.forEach(interval => clearInterval(interval));
    this.whisperIntervals.clear();
  }

  restart() {
    this.stopWhispering();
    if (this.initialized) {
      this.startWhispering();
    }
  }
}

// Initialize the Prophecy Engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.prophecyEngine = new ProphecyEngine();
  window.prophecyEngine.initialize();
});

// Export for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProphecyEngine;
}