/**
 * Tests for Relic Card Modal component
 * Part of the Interactive Relic Cards feature for Sentinel Timeline
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock DOM environment for testing
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <div id="relic-modal" class="modal-overlay" aria-hidden="true">
    <div class="modal-container">
      <button class="modal-close">&times;</button>
      <div class="modal-content">
        <div class="sigil-display">
          <div class="sigil-glow" id="modal-sigil"></div>
        </div>
        <div class="relic-details">
          <h2 id="modal-title"></h2>
          <p id="modal-lore"></p>
          <p id="modal-prophecy"></p>
          <span id="modal-price"></span>
          <a id="modal-verify-link" href="#"></a>
          <a id="modal-archive-link" href="#"></a>
        </div>
      </div>
    </div>
  </div>
  <div class="sigil-node" data-relic="quantum-genesis"></div>
</body>
</html>
`);

// Set global DOM
global.document = dom.window.document;
global.window = dom.window;
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0));

// Import the module after setting up DOM
const { RelicCardModal } = await import('../docs/js/relic-card-modal.js');

describe('Relic Card Modal', () => {
  let modal;

  beforeEach(() => {
    // Reset DOM state
    document.getElementById('relic-modal').classList.remove('active');
    document.getElementById('relic-modal').style.display = 'none';
    document.body.style.overflow = '';
    
    modal = new RelicCardModal();
  });

  it('should initialize with correct default state', () => {
    expect(modal.isOpen).toBe(false);
    expect(modal.currentRelic).toBe(null);
    expect(modal.modal).toBeTruthy();
  });

  it('should have relic database with all expected relics', () => {
    expect(modal.relicsDB).toBeDefined();
    expect(modal.relicsDB['quantum-genesis']).toBeDefined();
    expect(modal.relicsDB['thunder-apex']).toBeDefined();
    expect(modal.relicsDB['vault-ascension']).toBeDefined();
    expect(modal.relicsDB['dawn-eternal']).toBeDefined();
    expect(modal.relicsDB['sacred-key']).toBeDefined();
  });

  it('should populate modal content correctly', () => {
    const testRelic = modal.relicsDB['quantum-genesis'];
    modal.populateModalContent(testRelic);

    expect(document.getElementById('modal-sigil').textContent).toBe('⚛️');
    expect(document.getElementById('modal-title').textContent).toBe('Quantum Genesis ⚛️');
    expect(document.getElementById('modal-lore').textContent).toContain('quantum particles');
    expect(document.getElementById('modal-prophecy').textContent).toContain('quantum foam');
    expect(document.getElementById('modal-price').textContent).toBe('333.77 CHAOS');
  });

  it('should set accessibility attributes on sigil nodes', () => {
    const sigilNode = document.querySelector('.sigil-node');
    expect(sigilNode.getAttribute('tabindex')).toBe('0');
    expect(sigilNode.getAttribute('role')).toBe('button');
    expect(sigilNode.getAttribute('aria-label')).toContain('quantum-genesis');
  });

  it('should handle opening modal with valid relic', async () => {
    await modal.openModal('quantum-genesis');
    
    expect(modal.isOpen).toBe(true);
    expect(modal.currentRelic).toBe('quantum-genesis');
    expect(document.getElementById('modal-title').textContent).toBe('Quantum Genesis ⚛️');
  });

  it('should handle invalid relic gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    await modal.openModal('invalid-relic');
    
    expect(modal.isOpen).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Relic not found:', 'invalid-relic');
    
    consoleSpy.mockRestore();
  });

  it('should close modal and reset state', () => {
    // Simulate opened state
    modal.isOpen = true;
    modal.currentRelic = 'quantum-genesis';
    modal.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    modal.closeModal();
    
    expect(modal.modal.classList.contains('active')).toBe(false);
    expect(modal.modal.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have correct relic data structure', () => {
    const relic = modal.relicsDB['quantum-genesis'];
    
    expect(relic).toHaveProperty('title');
    expect(relic).toHaveProperty('sigil');
    expect(relic).toHaveProperty('lore');
    expect(relic).toHaveProperty('prophecy');
    expect(relic).toHaveProperty('basePrice');
    expect(relic).toHaveProperty('verifyUrl');
    expect(relic).toHaveProperty('archiveUrl');
    
    expect(typeof relic.basePrice).toBe('number');
    expect(relic.verifyUrl).toContain('github.com');
    expect(relic.archiveUrl).toContain('github.com');
  });

  it('should handle dynamic pricing calculation', async () => {
    const basePrice = 333.77;
    modal.relicsDB['test-relic'] = { basePrice };
    
    // Mock the fetchLivePricing method to avoid actual network calls
    const originalFetch = modal.fetchLivePricing;
    modal.fetchLivePricing = vi.fn().mockResolvedValue(undefined);
    
    await modal.openModal('quantum-genesis');
    
    // The price should start with base price
    expect(document.getElementById('modal-price').textContent).toBe('333.77 CHAOS');
    
    modal.fetchLivePricing = originalFetch;
  });

  it('should have cosmic scripture integration', () => {
    Object.values(modal.relicsDB).forEach(relic => {
      expect(relic.lore).toBeTruthy();
      expect(relic.prophecy).toBeTruthy();
      expect(relic.lore.length).toBeGreaterThan(50);
      expect(relic.prophecy.length).toBeGreaterThan(30);
    });
  });
});