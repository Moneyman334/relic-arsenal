import { describe, it, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

describe('ChaosKey333 Vault Interface', () => {
  let dom
  let document
  let window

  beforeEach(() => {
    // Read the vault HTML file
    const vaultHtml = fs.readFileSync(
      path.resolve(__dirname, '../docs/vault/index.html'),
      'utf-8'
    )
    
    // Create a JSDOM instance
    dom = new JSDOM(vaultHtml, {
      url: 'http://localhost/',
      pretendToBeVisual: true,
      resources: 'usable',
      runScripts: 'outside-only'
    })
    
    document = dom.window.document
    window = dom.window
  })

  it('should contain the vault title', () => {
    const title = document.querySelector('.vault-title')
    expect(title).toBeTruthy()
    expect(title.textContent).toContain('CHAOS VAULT')
  })

  it('should have four cryptocurrency cards', () => {
    const cards = document.querySelectorAll('.vault-card')
    expect(cards.length).toBe(4)
    
    // Check for specific crypto cards
    expect(document.querySelector('.vault-card.eth')).toBeTruthy()
    expect(document.querySelector('.vault-card.btc')).toBeTruthy()
    expect(document.querySelector('.vault-card.ltc')).toBeTruthy()
    expect(document.querySelector('.vault-card.sol')).toBeTruthy()
  })

  it('should have wallet addresses for each cryptocurrency', () => {
    const ethAddress = document.getElementById('eth-address')
    const btcAddress = document.getElementById('btc-address')
    const ltcAddress = document.getElementById('ltc-address')
    const solAddress = document.getElementById('sol-address')

    expect(ethAddress).toBeTruthy()
    expect(btcAddress).toBeTruthy()
    expect(ltcAddress).toBeTruthy()
    expect(solAddress).toBeTruthy()

    // Check address formats
    expect(ethAddress.textContent.trim()).toMatch(/^0x[a-fA-F0-9]{40}$/)
    expect(btcAddress.textContent.trim()).toMatch(/^bc1[a-z0-9]+$/)
    expect(ltcAddress.textContent.trim()).toMatch(/^ltc1[a-z0-9]+$/)
    expect(solAddress.textContent.trim()).toMatch(/^[1-9A-HJ-NP-Za-km-z]{44}$/)
  })

  it('should have copy buttons for each cryptocurrency', () => {
    const copyButtons = document.querySelectorAll('.copy-btn')
    expect(copyButtons.length).toBe(4)
    
    copyButtons.forEach(button => {
      expect(button.textContent).toContain('Copy Address')
    })
  })

  it('should have QR code containers for each cryptocurrency', () => {
    const qrContainers = document.querySelectorAll('.qr-code')
    expect(qrContainers.length).toBe(4)
    
    expect(document.getElementById('eth-qr')).toBeTruthy()
    expect(document.getElementById('btc-qr')).toBeTruthy()
    expect(document.getElementById('ltc-qr')).toBeTruthy()
    expect(document.getElementById('sol-qr')).toBeTruthy()
  })

  it('should have the ETH alias badge', () => {
    const ethCard = document.querySelector('.vault-card.eth')
    const aliasBadge = ethCard.querySelector('.alias-badge')
    
    expect(aliasBadge).toBeTruthy()
    expect(aliasBadge.textContent).toContain('trillionair99.cb.id')
  })

  it('should have the cosmic quote in footer', () => {
    const quote = document.querySelector('.cosmic-quote')
    expect(quote).toBeTruthy()
    expect(quote.textContent).toContain('Through quantum tempests, we forge eternity')
  })

  it('should include the QR code library script', () => {
    const scripts = document.querySelectorAll('script[src]')
    const qrScript = Array.from(scripts).find(script => 
      script.src.includes('qrcode')
    )
    expect(qrScript).toBeTruthy()
  })

  it('should have proper ChaosKey333 branding elements', () => {
    const title = document.querySelector('title')
    expect(title.textContent).toContain('ChaosKey333 Vault')
    
    const header = document.querySelector('.vault-title')
    expect(header.textContent).toContain('⛧⚡👑')
    
    const subtitle = document.querySelector('.vault-subtitle')
    expect(subtitle.textContent).toContain('Quantum Dawn')
  })
})