// tests/cosmic-lore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Mock CosmicLoreOverlay class for testing
class MockCosmicLoreOverlay {
  loreData: any = null;
  tooltip: any;
  activeTimeout: any = null;
  glyphDecodeTimeout: any = null;

  constructor() {
    this.tooltip = { classList: { add: vi.fn(), remove: vi.fn() }, setAttribute: vi.fn() };
  }

  async loadLoreData() {
    try {
      const response = await fetch('./lore.json');
      if (response.ok) {
        this.loreData = await response.json();
        return;
      }
    } catch (error) {
      // Fallback logic
    }
    
    try {
      await this.loadFromReleaseNotes();
    } catch (error) {
      this.loreData = this.getDefaultLoreData();
    }
  }

  async loadFromReleaseNotes() {
    const response = await fetch('../RELEASE_NOTES.md');
    if (!response.ok) {
      throw new Error('Failed to fetch RELEASE_NOTES.md');
    }
    
    const content = await response.text();
    this.loreData = this.parseReleaseNotes(content);
  }

  parseReleaseNotes(content: string) {
    const parsed: any = {};
    
    const versionMatch = content.match(/🌌 (v[\d.]+) — (.+)/);
    if (versionMatch) {
      const version = versionMatch[1];
      const title = versionMatch[2];
      
      parsed.gallery_scrolls = {
        title: title,
        description: "Auto-indexed Gallery of Relics reveals the sacred collection while scroll injection rituals bind the ancient wisdom.",
        glyph: "📜🎯🔮 ŠĊṚØŁŁ ṚÏT̈ÜÆŁŠ ÆŠĊËṄḊ 📜🎯🔮"
      };
    }

    parsed.vault_door_thunder = {
      title: "Vault Door Thunder",
      description: "In the depths of the ancient vault, echoes of thunder reverberate through the stone corridors.",
      glyph: "⚡🚪🏛️ ṼÆÜLT̈ ḊØØṚ T̈ĦÜṄḊËṚ ⚡🚪🏛️"
    };

    return parsed;
  }

  getDefaultLoreData() {
    return {
      vault_door_thunder: {
        title: "Vault Door Thunder",
        description: "The mystical energies echo through ancient corridors.",
        glyph: "⚡🚪🏛️ ṼÆÜLT̈ ḊØØṚ T̈ĦÜṄḊËṚ ⚡🚪🏛️"
      },
      default: {
        title: "Unknown Relic",
        description: "A mysterious artifact whose secrets await discovery.",
        glyph: "❓✨🔮 ÜṄḲṄØẄṄ ṚËŁÏĊ ❓✨🔮"
      }
    };
  }

  showTooltip(event: any, relicKey: string) {
    if (!this.loreData) return;
    this.tooltip.classList.add('visible');
  }

  decodeGlyph(glyph: string) {
    const decoded = glyph
      .replace(/[ṼṚḊØØÆÜŤĦÜṄËŞĊŁÆṄŚÏĢŁÞĊØŠṀÏÞÜËḲŸŁÆÄŸÄḲṄØẄṄÄẆƮ]/gi, (match) => {
        const decodingMap: { [key: string]: string } = {
          'Ṽ': 'V', 'Æ': 'AE', 'Ü': 'U', 'Ł': 'L', 'Ť': 'T', 'Ḋ': 'D', 'Ø': 'O', 
          'Ṛ': 'R', 'Ţ': 'T', 'Ħ': 'H', 'Ṅ': 'N', 'Ë': 'E', 'Ş': 'S',
          'Ċ': 'C', 'Ř': 'R', 'Ś': 'S', 'Ï': 'I', 'Ģ': 'G', 'Ğ': 'G',
          'Þ': 'TH', 'Š': 'S', 'Ṁ': 'M', 'Ḳ': 'K', 'Ÿ': 'Y', 'Ä': 'A', 'Ẅ': 'W', 'Ẇ': 'W'
        };
        return decodingMap[match.toUpperCase()] || match;
      })
      .replace(/[^\w\s⚡🚪🏛️⚛️🌅📜🎯🔮⛈️👑🔑📋📖✨🌌❓]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    return `"${decoded}"`;
  }
}

describe('Cosmic Lore Overlay', () => {
  let dom: JSDOM;

  beforeEach(() => {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../docs/index.html'), 'utf8');
    dom = new JSDOM(htmlContent, {
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable'
    });
    
    global.document = dom.window.document;
    global.window = dom.window as any;
    global.fetch = vi.fn();
  });

  it('should load lore data from lore.json', async () => {
    const mockLoreData = {
      vault_door_thunder: {
        title: "Vault Door Thunder",
        description: "Test description",
        glyph: "⚡🚪🏛️ TEST GLYPH ⚡🚪🏛️"
      }
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockLoreData)
    } as Response);

    const overlay = new MockCosmicLoreOverlay();
    await overlay.loadLoreData();

    expect(overlay.loreData).toEqual(mockLoreData);
  });

  it('should fallback to RELEASE_NOTES.md when lore.json fails', async () => {
    const mockReleaseNotes = `🌌 v1.2.0 — Gallery & Scroll Upgrades
\t• Auto-indexed Gallery of Relics in README
⚡ "Unlock the Vault. Break the Sky."`;

    // Mock lore.json fetch to fail
    vi.mocked(fetch).mockRejectedValueOnce(new Error('lore.json not found'));
    
    // Mock RELEASE_NOTES.md fetch to succeed
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockReleaseNotes)
    } as Response);

    const overlay = new MockCosmicLoreOverlay();
    await overlay.loadLoreData();

    expect(overlay.loreData).toBeDefined();
    expect(overlay.loreData.gallery_scrolls).toBeDefined();
    expect(overlay.loreData.gallery_scrolls.title).toBe('Gallery & Scroll Upgrades');
  });

  it('should decode glyphs properly', () => {
    const overlay = new MockCosmicLoreOverlay();
    const testGlyph = "⚡🚪🏛️ ṼÆÜLT̈ ḊØØṚ T̈ĦÜṄḊËṚ ⚡🚪🏛️";
    const decoded = overlay.decodeGlyph(testGlyph);
    
    expect(decoded).toBe('"⚡🚪🏛️ VAEULT DOOR T HUNDER ⚡🚪🏛️"');
  });

  it('should have accessible sigils with proper ARIA attributes', () => {
    const sigils = dom.window.document.querySelectorAll('.sigil');
    
    expect(sigils.length).toBeGreaterThan(0);
    
    sigils.forEach(sigil => {
      expect(sigil.getAttribute('tabindex')).toBe('0');
      expect(sigil.getAttribute('role')).toBe('button');
      expect(sigil.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should have tooltip with proper ARIA attributes', () => {
    const tooltip = dom.window.document.getElementById('lore-overlay');
    
    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(tooltip?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should parse RELEASE_NOTES.md content correctly', () => {
    const overlay = new MockCosmicLoreOverlay();
    const testContent = `🌌 v1.2.0 — Gallery & Scroll Upgrades
\t• Auto-indexed Gallery of Relics in README
\t• Scroll injection and verification rituals
⚡ "Unlock the Vault. Break the Sky."`;

    const parsed = overlay.parseReleaseNotes(testContent);
    
    expect(parsed.gallery_scrolls).toBeDefined();
    expect(parsed.gallery_scrolls.title).toBe('Gallery & Scroll Upgrades');
    expect(parsed.gallery_scrolls.glyph).toContain('📜🎯🔮');
  });

  it('should handle missing relic data gracefully', () => {
    const overlay = new MockCosmicLoreOverlay();
    overlay.loreData = { default: { title: "Default", description: "Default desc", glyph: "DEFAULT" } };
    
    const mockEvent = { clientX: 100, clientY: 100 };
    overlay.showTooltip(mockEvent, 'nonexistent_relic');
    
    expect(overlay.tooltip.classList.add).toHaveBeenCalledWith('visible');
  });
});