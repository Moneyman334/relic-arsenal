import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

describe('Vault Access Portal', () => {
  const portalPath = path.join(process.cwd(), 'docs', 'index.html')

  it('should have the vault portal HTML file', () => {
    expect(existsSync(portalPath)).toBe(true)
  })

  it('should contain vault access portal structure', () => {
    const content = readFileSync(portalPath, 'utf8')
    
    // Check for title
    expect(content).toContain('ChaosKey333 Vault Access Portal')
    
    // Check for cryptocurrency cards
    expect(content).toContain('Ethereum (ETH)')
    expect(content).toContain('Bitcoin (BTC)')
    expect(content).toContain('Litecoin (LTC)')
    expect(content).toContain('Solana (SOL)')
    
    // Check for price chips
    expect(content).toContain('price-chip')
    
    // Check for VaultPriceFeed class
    expect(content).toContain('class VaultPriceFeed')
    
    // Check for CoinGecko API integration
    expect(content).toContain('api.coingecko.com')
  })

  it('should include neon glow styling', () => {
    const content = readFileSync(portalPath, 'utf8')
    
    // Check for cosmic background and glow effects
    expect(content).toContain('text-shadow')
    expect(content).toContain('box-shadow')
    expect(content).toContain('linear-gradient')
    expect(content).toContain('@keyframes')
  })

  it('should have proper error handling', () => {
    const content = readFileSync(portalPath, 'utf8')
    
    // Check for fallback mechanisms
    expect(content).toContain('Price Unavailable')
    expect(content).toContain('handleError')
    expect(content).toContain('getMockPrices')
    expect(content).toContain('useMockData')
  })

  it('should include 60-second refresh mechanism', () => {
    const content = readFileSync(portalPath, 'utf8')
    
    // Check for periodic updates
    expect(content).toContain('60000') // 60 seconds in milliseconds
    expect(content).toContain('startPeriodicUpdates')
    expect(content).toContain('setInterval')
  })

  it('should have accessibility features', () => {
    const content = readFileSync(portalPath, 'utf8')
    
    // Check for semantic HTML and status indicators
    expect(content).toContain('status-indicator')
    expect(content).toContain('status-text')
    expect(content).toContain('lang="en"') // Language attribute for screen readers
    expect(content).toContain('meta charset="UTF-8"') // Character encoding
    expect(content).toContain('meta name="viewport"') // Responsive design
  })
})