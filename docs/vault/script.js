// Vault Power-Up JavaScript - Copy Functionality & Toast Notifications

class VaultPowerUp {
    constructor() {
        this.init();
    }

    init() {
        this.createToastContainer();
        this.bindCopyButtons();
        this.addCosmicEffects();
        console.log('🔑 Vault Power-Up initialized - ChaosKey333');
    }

    createToastContainer() {
        // Toast container will be created dynamically when needed
    }

    bindCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCopy(e);
            });
        });
    }

    async handleCopy(event) {
        const button = event.target;
        const addressContainer = button.closest('.address-container');
        const addressInput = addressContainer.querySelector('.wallet-address');
        const address = addressInput.value;
        const cryptoType = this.getCryptoType(button);

        try {
            // Modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(address);
            } else {
                // Fallback for older browsers or non-HTTPS
                this.fallbackCopy(addressInput);
            }

            // Update button state
            this.updateButtonState(button, 'success');
            
            // Show toast notification
            this.showToast(`${cryptoType} address copied to clipboard!`, 'success');
            
            // Add cosmic effect
            this.addCopyEffect(button);
            
        } catch (err) {
            console.error('Failed to copy address:', err);
            this.updateButtonState(button, 'error');
            this.showToast('Failed to copy address', 'error');
        }
    }

    fallbackCopy(input) {
        // Create a temporary text area for copying
        const textArea = document.createElement('textarea');
        textArea.value = input.value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    getCryptoType(button) {
        const card = button.closest('.crypto-card');
        const nameElement = card.querySelector('.crypto-name');
        return nameElement.textContent;
    }

    updateButtonState(button, state) {
        const originalText = button.textContent;
        
        if (state === 'success') {
            button.textContent = '✓';
            button.style.background = 'linear-gradient(135deg, #14f195, #00ffff)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        } else if (state === 'error') {
            button.textContent = '✗';
            button.style.background = 'linear-gradient(135deg, #ff4444, #ff6666)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    }

    showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        // Add appropriate styling based on type
        if (type === 'error') {
            toast.style.background = 'linear-gradient(135deg, #ff4444, #ff6666)';
            toast.style.borderColor = '#ff4444';
            toast.style.boxShadow = `
                0 10px 30px rgba(255, 68, 68, 0.3),
                0 0 20px rgba(255, 68, 68, 0.5)
            `;
        }

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 400);
        }, 3000);
    }

    addCopyEffect(button) {
        // Create particle effect on copy
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 6; i++) {
            this.createParticle(centerX, centerY);
        }
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00ffff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.boxShadow = '0 0 10px #00ffff';

        document.body.appendChild(particle);

        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;

        const animation = particle.animate([
            {
                transform: 'translate(0px, 0px) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }

    addCosmicEffects() {
        // Add hover effects to crypto cards
        const cryptoCards = document.querySelectorAll('.crypto-card');
        
        cryptoCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCardGlow(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeCardGlow(card);
            });
        });

        // Add QR code hover effects
        const qrCodes = document.querySelectorAll('.qr-code');
        qrCodes.forEach(qr => {
            qr.addEventListener('click', () => {
                this.pulseQR(qr);
            });
        });
    }

    addCardGlow(card) {
        const cryptoType = card.classList[1]; // eth, btc, ltc, sol
        const colors = {
            eth: '0, 255, 255',
            btc: '255, 149, 0',
            ltc: '191, 187, 187',
            sol: '153, 69, 255'
        };
        
        const color = colors[cryptoType] || '0, 255, 255';
        card.style.borderColor = `rgb(${color})`;
        card.style.boxShadow = `
            0 10px 30px rgba(${color}, 0.4),
            0 0 50px rgba(${color}, 0.2),
            inset 0 0 20px rgba(${color}, 0.1)
        `;
    }

    removeCardGlow(card) {
        card.style.borderColor = '';
        card.style.boxShadow = '';
    }

    pulseQR(qr) {
        qr.style.animation = 'none';
        qr.offsetHeight; // Trigger reflow
        qr.style.animation = 'pulse-glow 0.6s ease-in-out';
        
        setTimeout(() => {
            qr.style.animation = '';
        }, 600);
    }
}

// Utility functions for address generation (placeholder addresses)
const WalletAddresses = {
    ETH: '0x742d35cc6df32b87e3c0a9b8b1d9f4c3d2a8c9b7',
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    LTC: 'ltc1qw4hc8n5gqhxe7k2x9p6t4r8a7v3s6m1b9n4z2',
    SOL: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRU'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VaultPowerUp();
});

// Global function to get wallet addresses (can be used by HTML)
window.getWalletAddress = (crypto) => {
    return WalletAddresses[crypto.toUpperCase()] || '';
};