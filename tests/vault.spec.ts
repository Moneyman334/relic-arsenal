// tests/vault.spec.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Vault Implementation', () => {
  let vaultHtml: string;
  let vaultCss: string;
  let vaultJs: string;

  beforeAll(() => {
    // Read the vault files
    vaultHtml = readFileSync(join(__dirname, '../docs/vault/index.html'), 'utf-8');
    vaultCss = readFileSync(join(__dirname, '../docs/css/vault.css'), 'utf-8');
    vaultJs = readFileSync(join(__dirname, '../docs/vault/vault.js'), 'utf-8');
  });

  it('should have proper HTML structure', () => {
    expect(vaultHtml).toContain('THE SACRED VAULT');
    expect(vaultHtml).toContain('price-chips-grid');
    expect(vaultHtml).toContain('tooltip');
    
    // Check for each cryptocurrency
    expect(vaultHtml).toContain('data-coin="bitcoin"');
    expect(vaultHtml).toContain('data-coin="ethereum"');
    expect(vaultHtml).toContain('data-coin="solana"');
    expect(vaultHtml).toContain('data-coin="cardano"');
    expect(vaultHtml).toContain('data-coin="polygon"');
    expect(vaultHtml).toContain('data-coin="chainlink"');
  });

  it('should have cosmic-themed CSS', () => {
    expect(vaultCss).toContain(':root');
    expect(vaultCss).toContain('--cosmic-black');
    expect(vaultCss).toContain('--quantum-purple');
    expect(vaultCss).toContain('--stellar-gold');
    
    // Check for tooltip styles
    expect(vaultCss).toContain('.tooltip');
    expect(vaultCss).toContain('.price-chip');
    expect(vaultCss).toContain(':hover');
    
    // Check for responsive design
    expect(vaultCss).toContain('@media (max-width: 768px)');
    expect(vaultCss).toContain('@media (max-width: 480px)');
  });

  it('should have JavaScript functionality', () => {
    expect(vaultJs).toContain('class VaultOracle');
    expect(vaultJs).toContain('coingecko.com');
    expect(vaultJs).toContain('useDemoData');
    
    // Check for tooltip functionality
    expect(vaultJs).toContain('showTooltip');
    expect(vaultJs).toContain('hideTooltip');
    
    // Check for explorer links
    expect(vaultJs).toContain('explorer');
    expect(vaultJs).toContain('etherscan');
    expect(vaultJs).toContain('solscan');
  });

  it('should have proper coin configurations', () => {
    expect(vaultJs).toContain('bitcoin');
    expect(vaultJs).toContain('ethereum');
    expect(vaultJs).toContain('solana');
    expect(vaultJs).toContain('cardano');
    expect(vaultJs).toContain('matic-network');
    expect(vaultJs).toContain('chainlink');
  });

  it('should have error handling', () => {
    expect(vaultJs).toContain('try {');
    expect(vaultJs).toContain('catch');
    expect(vaultJs).toContain('fetchWithRetry');
    expect(vaultJs).toContain('retryAttempts');
  });

  it('should include accessibility features', () => {
    expect(vaultCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(vaultCss).toContain('@media (prefers-contrast: high)');
  });
});