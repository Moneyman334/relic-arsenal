import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock DOM environment
import { JSDOM } from "jsdom";

// Set up DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.CanvasRenderingContext2D = dom.window.CanvasRenderingContext2D;
global.Image = dom.window.Image;

// Mock Canvas API
const mockCanvas = {
  width: 1200,
  height: 630,
  getContext: vi.fn(() => ({
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    setLineDash: vi.fn()
  })),
  toDataURL: vi.fn(() => 'data:image/png;base64,mock-image-data')
};

// Mock createElement to return our mock canvas
const originalCreateElement = global.document.createElement;
global.document.createElement = vi.fn((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas;
  }
  return originalCreateElement.call(document, tagName);
});

// Import modules after DOM setup
let SocialEchoLayer;
let CollectorArchive;

// Mock CollectorArchive for testing
class MockCollectorArchive {
  constructor() {
    this.mockRelic = {
      id: 'test-relic',
      name: 'Test Quantum Relic',
      sigil: '/test/sigil.png',
      lore: 'A test relic from the quantum void, pulsing with mock energy for testing purposes.',
      price: '2.5k',
      priceValue: 2500,
      rarity: 'Epic',
      element: 'Quantum',
      power: 8500,
      discoveryDate: '2024-03-22'
    };
  }

  async getAllRelics() {
    return [this.mockRelic];
  }

  async getRelic(relicId) {
    if (relicId === 'test-relic') {
      return this.mockRelic;
    }
    throw new Error('Relic not found');
  }

  async getMarketStats() {
    return {
      totalRelics: 1,
      averagePrice: 2500,
      minPrice: 2500,
      maxPrice: 2500,
      totalValue: 2500,
      marketTrend: 'ASCENDING'
    };
  }
}

describe("Social Echo Layer", () => {
  beforeEach(async () => {
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Clear all mocks
    vi.clearAllMocks();

    // Dynamically import the modules
    const socialEchoModule = await import("../docs/js/social-echo.js");
    SocialEchoLayer = socialEchoModule.default || global.SocialEchoLayer;

    // Set up global mock archive
    global.window.collectorArchive = new MockCollectorArchive();
    global.collectorArchive = global.window.collectorArchive;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("SocialEchoLayer Class", () => {
    it("should initialize with canvas and context", () => {
      const socialEcho = new SocialEchoLayer();
      
      expect(socialEcho).toBeDefined();
      expect(socialEcho.canvas).toBeDefined();
      expect(socialEcho.ctx).toBeDefined();
      expect(socialEcho.canvas.width).toBe(1200);
      expect(socialEcho.canvas.height).toBe(630);
    });

    it("should load cosmic fonts on initialization", () => {
      const socialEcho = new SocialEchoLayer();
      
      // Check if font links were attempted to be created
      expect(document.createElement).toHaveBeenCalled();
    });

    it("should generate snapshot for a relic", async () => {
      const socialEcho = new SocialEchoLayer();
      const mockRelic = {
        name: 'Test Quantum Sigil',
        sigil: '/test/sigil.png',
        lore: 'Test lore for the quantum sigil.',
        price: '2.5k'
      };

      const snapshot = await socialEcho.generateSnapshot(mockRelic);
      
      expect(snapshot).toBe('data:image/png;base64,mock-image-data');
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    });

    it("should draw cosmic background", async () => {
      const socialEcho = new SocialEchoLayer();
      const mockCtx = mockCanvas.getContext();
      
      await socialEcho.drawCosmicBackground(mockCtx, mockCanvas);
      
      expect(mockCtx.createLinearGradient).toHaveBeenCalled();
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 1200, 630);
    });

    it("should draw default sigil when image fails", () => {
      const socialEcho = new SocialEchoLayer();
      const mockCtx = mockCanvas.getContext();
      
      socialEcho.drawDefaultSigil(mockCtx);
      
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });

    it("should draw title with cosmic styling", () => {
      const socialEcho = new SocialEchoLayer();
      const mockCtx = mockCanvas.getContext();
      
      socialEcho.drawTitle(mockCtx, 'Test Relic Title', 1200);
      
      expect(mockCtx.fillText).toHaveBeenCalledWith('Test Relic Title', 280, 100);
      expect(mockCtx.fillText).toHaveBeenCalledWith('⚛️⚡👑 ChaosKey333 Relic Arsenal 👑⚡⚛️', 280, 140);
    });

    it("should draw lore with word wrapping", () => {
      const socialEcho = new SocialEchoLayer();
      const mockCtx = mockCanvas.getContext();
      const longLore = 'This is a very long lore text that should be wrapped across multiple lines to fit within the canvas boundaries and display properly.';
      
      socialEcho.drawLore(mockCtx, longLore, 1200, 630);
      
      expect(mockCtx.fillText).toHaveBeenCalled();
      expect(mockCtx.measureText).toHaveBeenCalled();
    });

    it("should draw pricing information", () => {
      const socialEcho = new SocialEchoLayer();
      const mockCtx = mockCanvas.getContext();
      
      socialEcho.drawPricing(mockCtx, '2.5k', 1200, 630);
      
      expect(mockCtx.fillText).toHaveBeenCalledWith('⚡ 2.5k GLOW', 1150, 510);
    });

    it("should generate platform-optimized descriptions", () => {
      const socialEcho = new SocialEchoLayer();
      const mockRelic = { name: 'Test Relic' };
      
      const twitterDesc = socialEcho.generateDescription(mockRelic, 'twitter');
      const instagramDesc = socialEcho.generateDescription(mockRelic, 'instagram');
      const tiktokDesc = socialEcho.generateDescription(mockRelic, 'tiktok');
      
      expect(twitterDesc).toContain('Test Relic');
      expect(instagramDesc).toContain('Test Relic');
      expect(tiktokDesc).toContain('Test Relic');
      expect(twitterDesc).not.toBe(instagramDesc);
      expect(instagramDesc).not.toBe(tiktokDesc);
    });

    it("should generate platform-optimized hashtags", () => {
      const socialEcho = new SocialEchoLayer();
      const mockRelic = { name: 'Test Relic' };
      
      const twitterTags = socialEcho.generateHashtags(mockRelic, 'twitter');
      const instagramTags = socialEcho.generateHashtags(mockRelic, 'instagram');
      const tiktokTags = socialEcho.generateHashtags(mockRelic, 'tiktok');
      
      expect(twitterTags).toContain('#QuantumDawn');
      expect(twitterTags).toContain('#ChaosKey333');
      expect(instagramTags).toContain('#CosmicArt');
      expect(tiktokTags).toContain('#CosmicTok');
    });
  });

  describe("CollectorArchive Mock", () => {
    it("should provide relic data", async () => {
      const archive = new MockCollectorArchive();
      const relics = await archive.getAllRelics();
      
      expect(relics).toHaveLength(1);
      expect(relics[0].name).toBe('Test Quantum Relic');
      expect(relics[0].id).toBe('test-relic');
    });

    it("should get specific relic by ID", async () => {
      const archive = new MockCollectorArchive();
      const relic = await archive.getRelic('test-relic');
      
      expect(relic.name).toBe('Test Quantum Relic');
      expect(relic.price).toBe('2.5k');
    });

    it("should throw error for non-existent relic", async () => {
      const archive = new MockCollectorArchive();
      
      await expect(archive.getRelic('non-existent')).rejects.toThrow('Relic not found');
    });

    it("should provide market statistics", async () => {
      const archive = new MockCollectorArchive();
      const stats = await archive.getMarketStats();
      
      expect(stats.totalRelics).toBe(1);
      expect(stats.averagePrice).toBe(2500);
      expect(stats.marketTrend).toBe('ASCENDING');
    });
  });

  describe("Integration Tests", () => {
    it("should generate snapshot with real relic data", async () => {
      const socialEcho = new SocialEchoLayer();
      const archive = new MockCollectorArchive();
      const relic = await archive.getRelic('test-relic');
      
      const snapshot = await socialEcho.generateSnapshot(relic);
      
      expect(snapshot).toBe('data:image/png;base64,mock-image-data');
    });

    it("should handle missing sigil gracefully", async () => {
      const socialEcho = new SocialEchoLayer();
      const relicWithoutSigil = {
        name: 'Sigil-less Relic',
        lore: 'A relic without a sigil.',
        price: '1k'
      };
      
      const snapshot = await socialEcho.generateSnapshot(relicWithoutSigil);
      
      expect(snapshot).toBe('data:image/png;base64,mock-image-data');
    });
  });

  describe("Error Handling", () => {
    it("should handle canvas context errors", () => {
      // Mock a failing canvas
      const failingCanvas = {
        ...mockCanvas,
        getContext: vi.fn(() => null)
      };
      
      document.createElement = vi.fn((tagName) => {
        if (tagName === 'canvas') return failingCanvas;
        return originalCreateElement.call(document, tagName);
      });
      
      expect(() => new SocialEchoLayer()).not.toThrow();
    });

    it("should handle empty relic data", async () => {
      const socialEcho = new SocialEchoLayer();
      const emptyRelic = {};
      
      const snapshot = await socialEcho.generateSnapshot(emptyRelic);
      
      expect(snapshot).toBe('data:image/png;base64,mock-image-data');
    });
  });

  describe("UI Integration", () => {
    it("should create modal for sharing instructions", () => {
      const socialEcho = new SocialEchoLayer();
      const modal = socialEcho.createShareModal('Instagram', 'Test caption', '<p>Test instructions</p>');
      
      expect(modal.className).toBe('social-echo-modal');
      expect(modal.innerHTML).toContain('Instagram');
      expect(modal.innerHTML).toContain('Test caption');
    });

    it("should add modal styles to document", () => {
      const socialEcho = new SocialEchoLayer();
      socialEcho.addModalStyles();
      
      const styles = document.querySelector('#social-echo-modal-styles');
      expect(styles).toBeTruthy();
      expect(styles.tagName).toBe('STYLE');
    });
  });
});