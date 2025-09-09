/**
 * Vault Access Panel Tests
 * Tests for the cryptocurrency QR code generation and HTML structure
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Vault Access Panel', () => {
  const docsPath = join(process.cwd(), 'docs');
  const qrPath = join(docsPath, 'img', 'qr');
  
  it('should have all required QR code files', () => {
    const expectedQrFiles = [
      'btc_qr.png',
      'eth_qr.png', 
      'sol_qr.png',
      'ltc_qr.png',
      'doge_qr.png'
    ];
    
    for (const file of expectedQrFiles) {
      const filepath = join(qrPath, file);
      expect(existsSync(filepath), `QR code file should exist: ${file}`).toBe(true);
    }
  });
  
  it('should have updated index.html with vault access panel', () => {
    const indexPath = join(docsPath, 'index.html');
    expect(existsSync(indexPath), 'index.html should exist').toBe(true);
    
    const content = readFileSync(indexPath, 'utf-8');
    
    // Check for key elements
    expect(content).toContain('Vault Access - Support On-Chain');
    expect(content).toContain('Bitcoin (BTC)');
    expect(content).toContain('Ethereum (ETH)');  
    expect(content).toContain('Solana (SOL)');
    expect(content).toContain('Litecoin (LTC)');
    expect(content).toContain('Dogecoin (DOGE)');
    
    // Check for addresses
    expect(content).toContain('bc1q36344jakgqsxxus0mrfnvw2gnl4ml820k0y7uq');
    expect(content).toContain('0x4497e02255490d0bdFAC5Cc597c7b5cA24393872');
    expect(content).toContain('trillionair99.cb.id'); // ETH alias
    expect(content).toContain('2FotTKtQsH2JorHgAJT8b3wXUXWtmQh77LtpKyAkfFDt');
    expect(content).toContain('ltc1qa6za3tlu8gpvc4zjyz4e4pkn30r996krctmrtm');
    expect(content).toContain('DBMH263oHaaLkn1ecDV74bHDWiqD7TUQoz');
    
    // Check for safety warnings
    expect(content).toContain('Safety First - Chain-Specific Transactions');
    expect(content).toContain('CRITICAL');
    
    // Check for QR code references
    expect(content).toContain('./img/qr/btc_qr.png');
    expect(content).toContain('./img/qr/eth_qr.png');
    expect(content).toContain('./img/qr/sol_qr.png');
    expect(content).toContain('./img/qr/ltc_qr.png');
    expect(content).toContain('./img/qr/doge_qr.png');
    
    // Check for copy functionality
    expect(content).toContain('copyAddress');
    expect(content).toContain('Copy BTC Address');
    expect(content).toContain('Copy ETH Address');
    expect(content).toContain('Copy ETH Alias');
  });
  
  it('should have QR code generation script', () => {
    const scriptPath = join(process.cwd(), 'scripts', 'generate_qr_codes.py');
    expect(existsSync(scriptPath), 'QR code generation script should exist').toBe(true);
    
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('qrcode');
    expect(content).toContain('CRYPTO_ADDRESSES');
    expect(content).toContain('bc1q36344jakgqsxxus0mrfnvw2gnl4ml820k0y7uq');
  });
});