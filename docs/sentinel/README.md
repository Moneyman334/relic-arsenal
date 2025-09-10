# 🚀 Sentinel Timeline - Interactive Relic Cards

Welcome to the Sentinel Timeline, where wanderers can delve deeper into the Vault's secrets through Interactive Relic Cards.

## ✨ Features

### 🎯 Interactive Sigil Nodes
- Click any sigil node on the timeline to reveal its cosmic secrets
- Each relic contains rich lore, ancient prophecies, and dynamic metadata
- Smooth cosmic transitions with fade, zoom, and pulse effects

### 🌟 Relic Database
The timeline features five legendary relics:

- **⚛️ Quantum Genesis** - The moment when possibility crystallizes into reality
- **⚡ Thunderstorm Apex** - The mighty seventh storm channeling raw cosmic power  
- **👑 Vault Ascension** - Ultimate mastery over chaos and cosmic prominence
- **🌅 Dawn Eternal** - The sunrise that illuminates infinite parallel realities
- **🔑 Sacred Key** - The fundamental promise that unlocks all dimensions

### 📱 Responsive Design
- Desktop: Grid layout with hover animations
- Mobile: Single-column stacked layout
- Tablets: Adaptive grid that scales between layouts

### ♿ Accessibility
- Full keyboard navigation support
- ARIA labels and screen reader compatibility
- High contrast mode support
- Reduced motion preferences respected

## 🛠 Technical Architecture

### File Structure
```
docs/
├── sentinel/
│   └── index.html          # Main timeline page
├── css/
│   └── vault.css          # Cosmic styling with animations
└── js/
    └── relic-card-modal.js # Interactive modal component
```

### Core Components

#### RelicCardModal Class
- Handles modal opening/closing with smooth transitions
- Dynamic price fetching with cosmic fluctuations
- Integration with GitHub-based verification links
- Extensible relic database for future expansion

#### Cosmic Styling
- CSS custom properties for consistent theming
- Keyframe animations for sigil pulsing and glowing
- Responsive grid system with CSS Grid
- Backdrop filters for glass-morphism effects

## 🧪 Testing

The implementation includes comprehensive tests:
- 10 test cases covering modal functionality
- DOM interaction testing with JSDOM
- Accessibility verification
- Error handling validation

Run tests: `npm test`

## 🌐 Deployment

The Sentinel Timeline deploys automatically to GitHub Pages when changes are made to the `docs/` directory. Access the live version at your GitHub Pages URL.

## 🔮 Future Enhancements

### Planned Integrations
- **Collector Archive API** - Real-time relic metadata sync
- **Broadcast Layer** - Live updates and community features
- **External Price Oracle** - Enhanced dynamic pricing
- **3D Sigil Rendering** - WebGL-powered cosmic visualizations

### Additional Features
- Relic comparison tool
- Timeline filtering and search
- Community relic submissions
- Achievement system for relic discovery

## 🎨 Customization

### Adding New Relics
Add new entries to the `relicsDB` object in `relic-card-modal.js`:

```javascript
'new-relic-id': {
    title: 'Relic Name 🔥',
    sigil: '🔥',
    lore: 'Your cosmic lore here...',
    prophecy: 'Ancient prophecy text...',
    basePrice: 999.99,
    verifyUrl: 'https://github.com/...',
    archiveUrl: 'https://github.com/...'
}
```

Then add the corresponding HTML sigil node to `index.html`.

### Styling Customization
Modify CSS custom properties in `vault.css` for theming:
- `--quantum-purple`: Primary accent color
- `--thunder-gold`: Secondary accent color  
- `--cosmic-gradient`: Background gradients
- `--pulse-glow`: Animation glow effects

## 📚 Cosmic Scripture Integration

The Interactive Relic Cards draw their lore and prophecies from the existing cosmic scripture in the repository, maintaining consistency with the ChaosKey333 mythology while expanding the interactive experience.

*"Through quantum tempests, we forge eternity. In rolling thunder, we crown the dawn."*
— The Seventh Scroll