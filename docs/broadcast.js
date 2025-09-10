/**
 * Vault Broadcast Layer JavaScript
 * Handles countdown timer, ticker animation, and data loading
 */
class VaultBroadcast {
  constructor() {
    this.broadcastData = null;
    this.countdownInterval = null;
    this.init();
  }

  async init() {
    await this.loadBroadcastData();
    this.createBroadcastBar();
    this.startCountdown();
    this.initializeAccessibility();
  }

  async loadBroadcastData() {
    try {
      // Try loading from broadcast.json first
      const response = await fetch('./broadcast.json');
      if (response.ok) {
        this.broadcastData = await response.json();
        return;
      }
    } catch (error) {
      console.warn('Failed to load broadcast.json, falling back to RELEASE_NOTES.md');
    }

    // Fallback to parsing RELEASE_NOTES.md
    await this.parseFallbackData();
  }

  async parseFallbackData() {
    try {
      const response = await fetch('./RELEASE_NOTES.md');
      if (!response.ok) {
        throw new Error('Failed to load RELEASE_NOTES.md');
      }
      
      const content = await response.text();
      
      // Extract version and title from the first line
      const versionMatch = content.match(/🌌\s*(.+?)(?:\n|$)/);
      const title = versionMatch ? versionMatch[1].trim() : 'Latest Release';
      
      // Extract the quote for ticker
      const quoteMatch = content.match(/⚡\s*"(.+?)"/);
      const quote = quoteMatch ? `⚡ "${quoteMatch[1]}"` : '⚡ "Unlock the Vault. Break the Sky."';
      
      // Create fallback data
      this.broadcastData = {
        next_drop: {
          title: title,
          at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          cta: {
            label: 'Explore the Vault',
            link: './README.md'
          }
        },
        ticker: [
          quote,
          '🌌 Gallery & Scroll Upgrades activated',
          '⛧ Sacred verification rituals completed',
          '👑 ChaosKey333 mysteries await',
          '🔑 "Through quantum tempests, we forge eternity"'
        ]
      };
    } catch (error) {
      console.error('Failed to parse fallback data:', error);
      
      // Ultimate fallback with static data
      this.broadcastData = {
        next_drop: {
          title: 'Next Cosmic Event',
          at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          cta: {
            label: 'Enter the Vault',
            link: './'
          }
        },
        ticker: [
          '⚡ "Unlock the Vault. Break the Sky."',
          '🌌 ChaosKey333 Relic Arsenal',
          '👑 Where chaos meets cosmos, legends are born'
        ]
      };
    }
  }

  createBroadcastBar() {
    // Check if broadcast bar already exists
    if (document.querySelector('.broadcast-bar')) {
      return;
    }

    const broadcastBar = document.createElement('div');
    broadcastBar.className = 'broadcast-bar';
    broadcastBar.setAttribute('role', 'banner');
    broadcastBar.setAttribute('aria-label', 'Vault broadcast announcements');

    broadcastBar.innerHTML = `
      <div class="broadcast-countdown" aria-live="polite" aria-label="Countdown to next drop">
        <span class="countdown-label">Next Drop:</span>
        <span class="countdown-timer" id="countdown-timer" aria-describedby="countdown-description">--:--:--</span>
        <span id="countdown-description" class="sr-only">Time remaining until ${this.broadcastData.next_drop.title}</span>
      </div>
      
      <div class="broadcast-ticker-container" aria-label="Announcement ticker">
        <div class="broadcast-ticker" id="broadcast-ticker" aria-live="off">
          ${this.createTickerContent()}
        </div>
      </div>
      
      <a href="${this.broadcastData.next_drop.cta.link}" 
         class="broadcast-cta" 
         aria-label="${this.broadcastData.next_drop.cta.label} - ${this.broadcastData.next_drop.title}">
        ${this.broadcastData.next_drop.cta.label}
      </a>
    `;

    // Insert at the beginning of the body
    document.body.insertBefore(broadcastBar, document.body.firstChild);
  }

  createTickerContent() {
    // Duplicate ticker items for seamless loop
    const tickerItems = this.broadcastData.ticker.map(item => 
      `<span class="ticker-item">${item}</span>`
    ).join('');
    
    return tickerItems + tickerItems; // Duplicate for seamless scrolling
  }

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const dropTime = new Date(this.broadcastData.next_drop.at).getTime();
      const distance = dropTime - now;

      const timer = document.getElementById('countdown-timer');
      if (!timer) return;

      if (distance < 0) {
        timer.textContent = 'LIVE';
        timer.className = 'countdown-timer countdown-live';
        timer.setAttribute('aria-label', 'Event is now live');
        
        // Update description
        const description = document.getElementById('countdown-description');
        if (description) {
          description.textContent = `${this.broadcastData.next_drop.title} is now live`;
        }
        
        clearInterval(this.countdownInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeString;
      if (days > 0) {
        timeString = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      timer.textContent = timeString;
      timer.setAttribute('aria-label', `${timeString} remaining until ${this.broadcastData.next_drop.title}`);
    };

    // Update immediately, then every second
    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  initializeAccessibility() {
    // Add screen reader only class for invisible content
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(srOnlyStyle);

    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 4px;
    `;
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
      skipLink.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
      skipLink.classList.add('sr-only');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark if it doesn't exist
    const mainContent = document.querySelector('main') || document.querySelector('#main-content');
    if (!mainContent) {
      const body = document.body;
      const mainElement = document.createElement('main');
      mainElement.id = 'main-content';
      
      // Move all existing body content to main
      while (body.children.length > 0 && !body.children[0].classList.contains('broadcast-bar')) {
        if (body.children[0] === skipLink) {
          body.removeChild(body.children[0]);
          continue;
        }
        mainElement.appendChild(body.children[0]);
      }
      
      body.appendChild(mainElement);
    }
  }

  // Method to refresh broadcast data (for live updates)
  async refresh() {
    await this.loadBroadcastData();
    
    // Update ticker content
    const ticker = document.getElementById('broadcast-ticker');
    if (ticker) {
      ticker.innerHTML = this.createTickerContent();
    }

    // Update CTA
    const cta = document.querySelector('.broadcast-cta');
    if (cta) {
      cta.href = this.broadcastData.next_drop.cta.link;
      cta.textContent = this.broadcastData.next_drop.cta.label;
      cta.setAttribute('aria-label', 
        `${this.broadcastData.next_drop.cta.label} - ${this.broadcastData.next_drop.title}`);
    }

    // Restart countdown with new data
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.startCountdown();
  }

  // Cleanup method
  destroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}

// Initialize the broadcast system when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.vaultBroadcast = new VaultBroadcast();
  });
} else {
  window.vaultBroadcast = new VaultBroadcast();
}

// Auto-refresh every 5 minutes to check for updates
setInterval(() => {
  if (window.vaultBroadcast) {
    window.vaultBroadcast.refresh();
  }
}, 5 * 60 * 1000);