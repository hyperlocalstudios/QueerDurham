# Hyperlocal Durham: Queer History

A browser-based exploration game celebrating Durham, North Carolina's rich LGBTQ+ history. Players explore pixel-art representations of historic queer spaces through a top-down, Pokemon-style interface.

## Features

- **Top-down exploration**: Navigate Durham's queer history sites with arrow keys or WASD
- **Interactive locations**: Approach buildings to see their names and learn their stories
- **Modular content system**: Easily swap themes and locations each month
- **Mobile-friendly**: Touch controls and responsive design for all devices
- **Lightweight**: Pure HTML/CSS/JavaScript - no heavy frameworks required
- **Educational**: Links to OpenDurham.org for deeper historical context

## How to Play

1. **Move**: Use Arrow Keys or WASD to move your character around the map
2. **Explore**: Walk near buildings to see location pins and reveal their names
3. **Learn**: Click on nearby buildings (or anywhere when a pin appears) to read their history
4. **Discover**: Explore all 17 historic LGBTQ+ sites across Durham

## File Structure

```
QueerDurham/
├── index.html           # Main game page
├── game.js              # Game engine (player, rendering, interactions)
├── locationData.js      # Location content (easily updatable!)
├── styles.css           # Mobile-first responsive styling
├── README.md            # This file
└── assets/
    ├── SitesNoTitle/    # Building images (normal state)
    ├── SitesTitle/      # Building images with titles (hover state)
    └── PlainBuildings/  # Additional assets
```

## Updating Content for New Themes

The game is designed for easy monthly theme updates! Here's how:

### 1. Update Location Data

Edit `locationData.js` to change locations:

```javascript
const LOCATIONS = [
    {
        id: 'unique-id',
        name: 'Location Name',
        image: 'assets/SitesNoTitle/Building.png',
        imageHover: 'assets/SitesTitle/Building_title.png',
        x: 200,  // Position on map
        y: 150,
        description: 'Your 1-3 sentence description here.',
        link: 'https://your-source-url.com'
    },
    // Add more locations...
];
```

### 2. Replace Assets

- Place new building images in `assets/SitesNoTitle/`
- Place titled versions in `assets/SitesTitle/` (with `_title.png` suffix)
- **Important**: Don't resize images - the game preserves aspect ratios automatically

### 3. Adjust Game Config

Modify `GAME_CONFIG` in `locationData.js`:

```javascript
const GAME_CONFIG = {
    canvasWidth: 1024,           // Canvas dimensions
    canvasHeight: 768,
    playerSpeed: 3,              // Movement speed
    interactionRadius: 80,       // Click/interact distance
    hoverRadius: 100,            // Title reveal distance
    pinOffset: -20               // Pin position above buildings
};
```

## Embedding in Your Website

### Option 1: Direct Link
Simply link to `index.html`:
```html
<a href="/path/to/QueerDurham/index.html">Play the Game</a>
```

### Option 2: Iframe Embed
```html
<iframe
    src="/path/to/QueerDurham/index.html"
    width="100%"
    height="800px"
    frameborder="0">
</iframe>
```

### Option 3: Full Integration
Copy all files into your web server and include directly in your page structure.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Local Testing

1. Open `index.html` directly in a browser, or
2. Use a local server (recommended for testing):
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx http-server
   ```
3. Visit `http://localhost:8000`

### Customization Tips

**Change player appearance**: Edit `drawPlayer()` in `game.js`
```javascript
this.player.color = '#FF1493'; // Change color
this.player.size = 16;          // Change size
```

**Modify map background**: Edit `drawBackground()` in `game.js`

**Adjust styling**: Edit `styles.css` for colors, fonts, dialogue box appearance

**Add sound effects**: Integrate Web Audio API in `game.js`

**Add more interactivity**: Extend the `Location` object in `locationData.js` with custom properties

## Technical Details

- **No dependencies**: Pure vanilla JavaScript
- **Canvas-based rendering**: Smooth 60fps gameplay
- **Event-driven architecture**: Easy to extend with new features
- **Responsive design**: Automatically scales for mobile devices
- **Touch-optimized**: Full touch and click support

## Future Enhancement Ideas

- Add mini-map overlay
- Include timeline/era filters
- Add collectible badges for visiting all sites
- Include walking sprite animations
- Add ambient background music
- Create multiple themed maps (by decade, theme, etc.)
- Add quiz/trivia mode

## Credits

**Historical content**: [OpenDurham.org Queer History Tour](https://www.opendurham.org/tours/queer-history-durham)

**Pixel art**: Your custom Durham building assets

**Game development**: Modular browser game framework

## License

This project celebrates Durham's LGBTQ+ history for educational purposes. Please attribute OpenDurham.org when using historical content.

---

Built with care for the Hyperlocal Durham project. Happy exploring! 🏳️‍🌈
