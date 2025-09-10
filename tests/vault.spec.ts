// tests/vault.spec.ts
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Cosmic Vault', () => {
  it('should have valid HTML structure', () => {
    const vaultHtml = readFileSync(join(process.cwd(), 'docs/vault.html'), 'utf-8');
    const dom = new JSDOM(vaultHtml);
    const document = dom.window.document;

    // Check essential elements exist
    expect(document.title).toBe('⚡ Cosmic Vault - Relic Arsenal');
    expect(document.querySelector('h1')).toBeTruthy();
    expect(document.querySelector('.vault-container')).toBeTruthy();
    expect(document.querySelector('.price-grid')).toBeTruthy();
    expect(document.querySelector('link[href="css/vault.css"]')).toBeTruthy();
    expect(document.querySelector('script[src="js/price-chips.js"]')).toBeTruthy();
  });

  it('should have proper meta tags for responsive design', () => {
    const vaultHtml = readFileSync(join(process.cwd(), 'docs/vault.html'), 'utf-8');
    const dom = new JSDOM(vaultHtml);
    const document = dom.window.document;

    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).toBeTruthy();
    expect(viewport?.getAttribute('content')).toContain('width=device-width');
  });

  it('should have navigation back to arsenal', () => {
    const vaultHtml = readFileSync(join(process.cwd(), 'docs/vault.html'), 'utf-8');
    const dom = new JSDOM(vaultHtml);
    const document = dom.window.document;

    const backLink = document.querySelector('a[href="index.html"]');
    expect(backLink).toBeTruthy();
    expect(backLink?.textContent).toContain('Back to Arsenal');
  });
});