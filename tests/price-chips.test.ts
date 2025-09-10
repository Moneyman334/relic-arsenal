import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Price Chips Functionality', () => {
  let dom, document, window, priceChips;

  beforeEach(async () => {
    // Setup JSDOM environment
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="loadingState"></div>
          <div id="errorState"></div>
          <div id="priceChipsGrid"></div>
          <div id="lastUpdated"></div>
          <div id="activeSentinels"></div>
        </body>
      </html>
    `, { url: 'http://localhost' });
    
    global.document = dom.window.document;
    global.window = dom.window;
    global.fetch = vi.fn();

    // Import the priceChips module
    const { default: priceChipsModule } = await import('../docs/js/price-chips.js');
    priceChips = priceChipsModule;
  });

  it('should initialize DOM elements correctly', () => {
    priceChips.cacheElements();
    
    expect(priceChips.elements.loadingState).toBeTruthy();
    expect(priceChips.elements.errorState).toBeTruthy();
    expect(priceChips.elements.priceChipsGrid).toBeTruthy();
    expect(priceChips.elements.lastUpdated).toBeTruthy();
    expect(priceChips.elements.activeSentinels).toBeTruthy();
  });

  it('should format prices correctly', () => {
    expect(priceChips.formatPrice(1234.56)).toBe('1,234.56');
    expect(priceChips.formatPrice(0.001234)).toBe('0.001234');
    expect(priceChips.formatPrice(42567.89123)).toBe('42,567.89');
  });

  it('should format percentages with proper signs', () => {
    expect(priceChips.formatPercentage(5.67)).toBe('+5.67');
    expect(priceChips.formatPercentage(-3.21)).toBe('-3.21');
    expect(priceChips.formatPercentage(0)).toBe('+0.00');
  });

  it('should determine correct change classes', () => {
    expect(priceChips.getChangeClass(5.5)).toBe('positive');
    expect(priceChips.getChangeClass(-2.3)).toBe('negative');
    expect(priceChips.getChangeClass(0)).toBe('neutral');
  });

  it('should process price data correctly', () => {
    const mockApiData = {
      bitcoin: { usd: 43000, usd_24h_change: 5.5 },
      ethereum: { usd: 2600, usd_24h_change: -2.1 }
    };

    priceChips.processPriceData(mockApiData);

    expect(priceChips.state.priceData.bitcoin).toBeDefined();
    expect(priceChips.state.priceData.bitcoin.price).toBe(43000);
    expect(priceChips.state.priceData.bitcoin.change24h).toBe(5.5);
  });

  it('should create price chip elements with correct classes', () => {
    const mockCrypto = {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 43000,
      change24h: 7.5,
      logo: 'test-logo.png'
    };

    const chipElement = priceChips.createPriceChip(mockCrypto);
    
    expect(chipElement.classList.contains('price-chip')).toBe(true);
    expect(chipElement.classList.contains('extreme-positive')).toBe(true);
    expect(chipElement.innerHTML).toContain('Bitcoin');
    expect(chipElement.innerHTML).toContain('$43,000.00');
    expect(chipElement.innerHTML).toContain('+7.50%');
  });

  it('should apply extreme change styling correctly', () => {
    const extremePositive = {
      id: 'test1',
      name: 'Test Coin',
      symbol: 'TEST',
      price: 100,
      change24h: 8.5,
      logo: 'test.png'
    };

    const extremeNegative = {
      id: 'test2', 
      name: 'Test Coin 2',
      symbol: 'TEST2',
      price: 50,
      change24h: -7.2,
      logo: 'test2.png'
    };

    const normalChange = {
      id: 'test3',
      name: 'Test Coin 3', 
      symbol: 'TEST3',
      price: 25,
      change24h: 2.1,
      logo: 'test3.png'
    };

    const extremePositiveChip = priceChips.createPriceChip(extremePositive);
    const extremeNegativeChip = priceChips.createPriceChip(extremeNegative);
    const normalChip = priceChips.createPriceChip(normalChange);

    expect(extremePositiveChip.classList.contains('extreme-positive')).toBe(true);
    expect(extremeNegativeChip.classList.contains('extreme-negative')).toBe(true);
    expect(normalChip.classList.contains('extreme-positive')).toBe(false);
    expect(normalChip.classList.contains('extreme-negative')).toBe(false);
  });

  it('should handle demo mode initialization', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    priceChips.initDemoMode();

    expect(consoleSpy).toHaveBeenCalledWith('🎭 Entering Demo Mode - Using Mock Data');
    expect(Object.keys(priceChips.state.priceData)).toHaveLength(6);
    expect(priceChips.state.lastUpdate).toBeTruthy();
  });
});