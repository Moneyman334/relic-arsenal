# 🎨 ESM Hardening Visual Assets

This directory contains visual mockups for the three relics of ESM glory: the Vault Door, Scroll, and Sigil. These assets are designed to represent the power, sovereignty, and discipline of ESM (ECMAScript Modules) hardening in the Node.js ecosystem.

## 📁 Directory Structure

```
assets/visuals/esm-hardening/
├── README.md                           # This file
├── VISUAL_SPECIFICATIONS.md            # Detailed design specifications
├── convert-mockups.sh                  # Script to convert SVG to PNG/WebP
├── .gitkeep                           # Ensures directory is tracked in git
│
├── vault-door_poster.svg              # Source SVG for Vault Door
├── vault-door_poster.png.placeholder  # Placeholder for PNG version
├── vault-door_poster.webp.placeholder # Placeholder for WebP version
│
├── scroll_story.svg                   # Source SVG for Scroll
├── scroll_story.png.placeholder       # Placeholder for PNG version
├── scroll_story.webp.placeholder      # Placeholder for WebP version
│
├── sigil_feed.svg                     # Source SVG for Sigil
├── sigil_feed.png.placeholder         # Placeholder for PNG version
└── sigil_feed.webp.placeholder        # Placeholder for WebP version
```

## 🏛️ The Three Relics

### 1. Vault Door (vault-door_poster.*)
**Theme**: Sovereignty and Security
- **Visual**: Colossal vault glowing neon-gold, etched with `type: "module"`
- **Effects**: Lightning crackling around door, Node 18 shards breaking at base
- **Use**: Poster and social media crops

### 2. Scroll (scroll_story.*)
**Theme**: Discipline and Wisdom
- **Visual**: Ancient scroll unfurling mid-storm with glowing runes
- **Text**: `import { discipline } from "chaos"`
- **Effects**: Edges burn with radiant fire
- **Use**: Story format content

### 3. Sigil (sigil_feed.*)
**Theme**: Unity and Infinite Power
- **Visual**: ChaosKey333 sigil suspended in stormlight
- **Effects**: Fractal circuits pulsing Node 20/22 energy, crown of infinity
- **Use**: Feed and profile content

## 🔧 Generating Final Assets

### Prerequisites
To convert SVG mockups to final PNG and WebP formats, you'll need:
- **Inkscape** (for SVG to PNG conversion)
- **WebP tools** (for PNG to WebP conversion)

### Quick Setup (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install inkscape webp
```

### Quick Setup (macOS)
```bash
brew install inkscape webp
```

### Generate Assets
Run the conversion script:
```bash
./convert-mockups.sh
```

This will create:
- High-resolution PNG files (300 DPI, 1-3MB)
- Web-optimized WebP files (quality 85, 150-300KB)

## 🎨 Design Guidelines

### Color Palette
- **Divine Gold**: #FFD700, #FFA500, #FF8C00
- **Electric Energy**: #00FFFF, #00FF88, #00BFFF  
- **Mystical Fire**: #FF4500, #FF6B35
- **Storm Elements**: #1a1a2e, #16213e, #3730A3, #818CF8
- **Ancient Parchment**: #F4E4BC, #D2B48C, #8B7355

### Typography
- **Code Elements**: Monospace fonts ('Courier New', 'Roboto Mono')
- **Mystical Text**: Decorative serif ('Uncial Antiqua', 'Cinzel')
- **Modern UI**: Clean sans-serif ('Roboto', 'Arial')

### Dimensions
All mockups are designed at **1200x800px** (3:2 aspect ratio) for optimal social media sharing and web display.

## 🔮 Usage Examples

### Web Integration
```html
<!-- High-quality display -->
<img src="assets/visuals/esm-hardening/vault-door_poster.png" 
     alt="ESM Vault Door - Type Module" 
     width="1200" height="800">

<!-- Optimized loading -->
<picture>
  <source srcset="assets/visuals/esm-hardening/vault-door_poster.webp" type="image/webp">
  <img src="assets/visuals/esm-hardening/vault-door_poster.png" 
       alt="ESM Vault Door - Type Module" 
       loading="lazy">
</picture>
```

### Social Media
- **Twitter/X Cards**: Use PNG versions for maximum compatibility
- **LinkedIn Posts**: WebP versions for faster loading
- **GitHub README**: Either format, consider file size for repository

## 📝 Customization

The SVG source files can be modified to:
- Adjust colors and effects
- Change text content
- Resize for different aspect ratios
- Add animation elements

For major modifications, refer to `VISUAL_SPECIFICATIONS.md` for detailed design guidelines.

## ⚡ ChaosKey333 Creed

These visuals embody the three pillars of the ChaosKey333 philosophy:

1. **Crown the Vault** – Every relic is a key (Vault Door)
2. **Forge the Storm** – Collaborate, iterate, ascend (Scroll)  
3. **Honor the Scrolls** – Every artifact tells a prophecy (Sigil)

> "You always got to keep dripping so wet!" — ChaosKey333

---

*Part of the ChaosKey333 Relic Arsenal* 🐦‍⬛⚡👑