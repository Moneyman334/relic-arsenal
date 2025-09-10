// ⛧⚡👑 ChaosKey333 Sentinel Timeline - Living Cosmic Narrative 👑⚡⛧

import { 
  getUnifiedTimeline, 
  filterByType, 
  simulateRealtimeUpdate,
  collectorArchive,
  broadcastLayer,
  loreOverlay 
} from '../data/cosmic-archives.js';

class SentinelTimeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.events = [];
    this.filteredEvents = [];
    this.currentFilter = 'all';
    this.isLoading = false;
    this.pageSize = 10;
    this.currentPage = 0;
    this.expandedNodes = new Set();
    
    // Real-time update simulation
    this.realtimeInterval = null;
    this.realtimeEnabled = true;
    
    this.init();
  }
  
  async init() {
    this.createTimelineStructure();
    await this.loadInitialData();
    this.attachEventListeners();
    this.startRealtimeUpdates();
    this.render();
  }
  
  createTimelineStructure() {
    this.container.innerHTML = `
      <div class="sentinel-timeline">
        <header class="timeline-header">
          <h1 class="timeline-title">⛧ Sentinel Timeline ⛧</h1>
          <p class="timeline-subtitle">The Living Cosmic Narrative of ChaosKey333</p>
        </header>
        
        <div class="timeline-filters">
          <button class="filter-button active" data-filter="all">
            🌌 All Events
          </button>
          <button class="filter-button" data-filter="collector-mark">
            ⚡ Collector Marks
          </button>
          <button class="filter-button" data-filter="broadcast">
            📡 Broadcasts
          </button>
          <button class="filter-button" data-filter="lore-whisper">
            🔮 Lore Whispers
          </button>
        </div>
        
        <div class="timeline-track">
          <div class="timeline-thread"></div>
          <div class="timeline-nodes"></div>
        </div>
        
        <div class="timeline-loading" style="display: none;">
          <div class="cosmic-spinner"></div>
          <p>Channeling cosmic energies...</p>
        </div>
      </div>
    `;
    
    this.nodesContainer = this.container.querySelector('.timeline-nodes');
    this.loadingIndicator = this.container.querySelector('.timeline-loading');
  }
  
  async loadInitialData() {
    this.showLoading();
    
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.events = getUnifiedTimeline();
    this.filteredEvents = this.events;
    
    this.hideLoading();
  }
  
  attachEventListeners() {
    // Filter buttons
    const filterButtons = this.container.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter);
      });
    });
    
    // Infinite scroll
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 100));
    
    // Node interactions will be attached dynamically
  }
  
  handleFilterChange(filter) {
    // Update active filter button
    const filterButtons = this.container.querySelectorAll('.filter-button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.container.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    this.currentFilter = filter;
    this.currentPage = 0;
    
    // Apply filter
    if (filter === 'all') {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = filterByType(this.events, filter);
    }
    
    this.render();
  }
  
  handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    // Check if near bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadMoreEvents();
    }
  }
  
  loadMoreEvents() {
    if (this.isLoading) return;
    
    const totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    if (this.currentPage >= totalPages - 1) return;
    
    this.currentPage++;
    this.renderPage(this.currentPage);
  }
  
  render() {
    this.nodesContainer.innerHTML = '';
    this.currentPage = 0;
    this.renderPage(0);
  }
  
  renderPage(page) {
    const startIndex = page * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageEvents = this.filteredEvents.slice(startIndex, endIndex);
    
    pageEvents.forEach((event, index) => {
      const node = this.createTimelineNode(event, startIndex + index);
      this.nodesContainer.appendChild(node);
    });
    
    // Animate new nodes
    this.animateNewNodes();
  }
  
  createTimelineNode(event, index) {
    const node = document.createElement('div');
    node.className = 'timeline-node';
    node.dataset.eventId = event.id;
    node.dataset.eventType = event.type;
    
    const formattedTime = this.formatTimestamp(event.timestamp);
    const sigil = this.getSigil(event);
    
    node.innerHTML = `
      <div class="node-anchor ${event.type}"></div>
      <div class="node-content" tabindex="0">
        <div class="node-type ${event.type}">${this.getTypeLabel(event.type)}</div>
        <h3 class="node-title">${sigil} ${event.title}</h3>
        <div class="node-timestamp">${formattedTime}</div>
        <p class="node-description">${event.description}</p>
        ${this.generateMetadataDisplay(event)}
      </div>
    `;
    
    // Attach node-specific event listeners
    const nodeContent = node.querySelector('.node-content');
    const nodeAnchor = node.querySelector('.node-anchor');
    
    [nodeContent, nodeAnchor].forEach(element => {
      element.addEventListener('click', () => this.toggleNodeExpansion(event.id));
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleNodeExpansion(event.id);
        }
      });
    });
    
    return node;
  }
  
  getSigil(event) {
    if (event.sigil) return event.sigil;
    
    const sigilMap = {
      'collector-mark': '⚡',
      'broadcast': '📡',
      'lore-whisper': '🔮'
    };
    
    return sigilMap[event.type] || '🌌';
  }
  
  getTypeLabel(type) {
    const labels = {
      'collector-mark': 'Collector Mark',
      'broadcast': 'Broadcast',
      'lore-whisper': 'Lore Whisper'
    };
    
    return labels[type] || 'Unknown';
  }
  
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  generateMetadataDisplay(event) {
    if (!event.metadata) return '';
    
    let metadataHtml = '<div class="node-metadata" style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7;">';
    
    if (event.type === 'collector-mark') {
      metadataHtml += `
        <div>Power Level: ${event.metadata.power_level || 'Unknown'}</div>
        <div>Rarity: ${event.metadata.rarity || 'Common'}</div>
        <div>Blessing: ${event.metadata.blessing || 'None'}</div>
      `;
    } else if (event.type === 'broadcast') {
      metadataHtml += `
        <div>Urgency: ${event.metadata.urgency || 'Normal'}</div>
        <div>Type: ${event.metadata.broadcast_type || 'General'}</div>
      `;
    } else if (event.type === 'lore-whisper') {
      metadataHtml += `
        <div>Cryptic Level: ${event.metadata.cryptic_level || 'Low'}</div>
        <div>Prophet: ${event.metadata.prophet || 'Unknown'}</div>
      `;
    }
    
    metadataHtml += '</div>';
    return metadataHtml;
  }
  
  toggleNodeExpansion(eventId) {
    const node = this.container.querySelector(`[data-event-id="${eventId}"]`);
    const nodeContent = node.querySelector('.node-content');
    
    if (this.expandedNodes.has(eventId)) {
      this.expandedNodes.delete(eventId);
      nodeContent.classList.remove('node-expanded');
    } else {
      this.expandedNodes.add(eventId);
      nodeContent.classList.add('node-expanded');
    }
  }
  
  startRealtimeUpdates() {
    if (!this.realtimeEnabled) return;
    
    // Simulate real-time updates every 30-60 seconds
    this.realtimeInterval = setInterval(() => {
      this.addRealtimeEvent();
    }, 30000 + Math.random() * 30000);
  }
  
  addRealtimeEvent() {
    const newEvent = simulateRealtimeUpdate();
    
    // Add to the beginning of the events array
    this.events.unshift(newEvent);
    
    // Update filtered events if needed
    if (this.currentFilter === 'all' || this.currentFilter === newEvent.type) {
      this.filteredEvents.unshift(newEvent);
      
      // Add the new node at the beginning
      const node = this.createTimelineNode(newEvent, 0);
      node.style.opacity = '0';
      node.style.transform = 'translateY(-20px)';
      
      this.nodesContainer.insertBefore(node, this.nodesContainer.firstChild);
      
      // Animate in
      setTimeout(() => {
        node.style.transition = 'all 0.5s ease';
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }, 100);
      
      // Show notification
      this.showRealtimeNotification(newEvent);
    }
  }
  
  showRealtimeNotification(event) {
    const notification = document.createElement('div');
    notification.className = 'realtime-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--cosmic-glow);
      color: var(--void-black);
      padding: 1rem;
      border-radius: var(--cosmic-radius);
      box-shadow: var(--storm-shadow);
      z-index: 1000;
      max-width: 300px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 0.5rem;">
        ${this.getSigil(event)} New ${this.getTypeLabel(event.type)}
      </div>
      <div style="font-size: 0.9rem;">
        ${event.title}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
  }
  
  animateNewNodes() {
    const newNodes = this.nodesContainer.querySelectorAll('.timeline-node:not(.animated)');
    
    newNodes.forEach((node, index) => {
      node.classList.add('animated');
      node.style.opacity = '0';
      node.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        node.style.transition = 'all 0.5s ease';
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  showLoading() {
    this.isLoading = true;
    this.loadingIndicator.style.display = 'block';
  }
  
  hideLoading() {
    this.isLoading = false;
    this.loadingIndicator.style.display = 'none';
  }
  
  // Utility function for throttling scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  
  // Public methods for external control
  destroy() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  pauseRealtimeUpdates() {
    this.realtimeEnabled = false;
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
      this.realtimeInterval = null;
    }
  }
  
  resumeRealtimeUpdates() {
    this.realtimeEnabled = true;
    this.startRealtimeUpdates();
  }
  
  addCustomEvent(event) {
    this.events.unshift(event);
    if (this.currentFilter === 'all' || this.currentFilter === event.type) {
      this.render();
    }
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the timeline page
  const timelineContainer = document.getElementById('sentinel-timeline-container');
  if (timelineContainer) {
    window.sentinelTimeline = new SentinelTimeline('sentinel-timeline-container');
  }
});

// Export for potential external use
export default SentinelTimeline;