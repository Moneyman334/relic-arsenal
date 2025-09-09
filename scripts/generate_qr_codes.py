#!/usr/bin/env python3
"""
QR Code Generator for Relic Arsenal Vault Access
Generates QR codes for cryptocurrency addresses to support the vault on-chain.
"""

import qrcode
import os
from pathlib import Path

# Cryptocurrency addresses for the Vault Access panel
CRYPTO_ADDRESSES = {
    'BTC': 'bc1q36344jakgqsxxus0mrfnvw2gnl4ml820k0y7uq',
    'ETH': '0x4497e02255490d0bdFAC5Cc597c7b5cA24393872',
    'SOL': '2FotTKtQsH2JorHgAJT8b3wXUXWtmQh77LtpKyAkfFDt',
    'LTC': 'ltc1qa6za3tlu8gpvc4zjyz4e4pkn30r996krctmrtm',
    'DOGE': 'DBMH263oHaaLkn1ecDV74bHDWiqD7TUQoz'
}

def generate_qr_codes():
    """Generate QR codes for all cryptocurrency addresses."""
    
    # Get the repository root directory
    repo_root = Path(__file__).parent.parent
    qr_dir = repo_root / 'docs' / 'img' / 'qr'
    
    # Create QR directory if it doesn't exist
    qr_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Generating QR codes in: {qr_dir}")
    
    for crypto, address in CRYPTO_ADDRESSES.items():
        print(f"Generating QR code for {crypto}: {address}")
        
        # Create QR code with high error correction
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=8,
            border=4,
        )
        qr.add_data(address)
        qr.make(fit=True)
        
        # Create image with high contrast
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save with lowercase filename
        filename = f"{crypto.lower()}_qr.png"
        filepath = qr_dir / filename
        img.save(filepath)
        print(f"Saved: {filepath}")
    
    print(f"\nSuccessfully generated {len(CRYPTO_ADDRESSES)} QR codes!")
    print("QR codes are ready for the Vault Access panel.")

if __name__ == "__main__":
    generate_qr_codes()