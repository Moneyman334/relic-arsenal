/**
 * ⛧⚡👑 ChaosKey333 Vault Integration Tests 👑⚡⛧
 */

import { describe, it, expect } from 'vitest';

describe('Vault Integration', () => {
  it('should have collector mode files present', () => {
    // Test that our main files exist and have expected content
    const fs = require('fs');
    const path = require('path');
    
    // Check HTML exists
    const htmlPath = path.join(__dirname, '..', 'index.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    expect(htmlContent).toContain('ChaosKey333 Vault');
    expect(htmlContent).toContain('collectorModeToggle');
    
    // Check CSS exists
    const cssPath = path.join(__dirname, '..', 'styles', 'vault.css');
    expect(fs.existsSync(cssPath)).toBe(true);
    
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('collector-bar');
    expect(cssContent).toContain('sigil-card');
    
    // Check JavaScript exists
    const jsPath = path.join(__dirname, '..', 'scripts', 'vault.js');
    expect(fs.existsSync(jsPath)).toBe(true);
    
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    expect(jsContent).toContain('VaultCollector');
    expect(jsContent).toContain('toggleCollectorMode');
  });
});