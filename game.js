// Hyperlocal Durham: Queer History - Game Engine
// Modular exploration game with plug-and-play location system

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        // Canvas size will be set when background loads
        this.canvas.width = GAME_CONFIG.canvasWidth;
        this.canvas.height = GAME_CONFIG.canvasHeight;

        // Player setup
        this.player = {
            x: GAME_CONFIG.canvasWidth / 2,
            y: GAME_CONFIG.canvasHeight / 2,
            size: 40, // Increased size for sprite
            speed: GAME_CONFIG.playerSpeed,
            direction: 'down', // Current facing direction
            isMoving: false,
            animationFrame: 1, // Current animation frame (1-4)
            animationCounter: 0 // Counter for animation timing
        };

        // Trail effect
        this.trail = [];
        this.maxTrailLength = 20;

        // Sprite images
        this.spriteImages = {};
        this.spritesLoaded = false;
        this.loadSprites();

        // Input handling
        this.keys = {};
        this.setupInputHandlers();

        // Location system
        this.locations = [];
        this.loadedImages = new Map();
        this.hoveredLocation = null;
        this.nearbyLocation = null;

        // Pin indicator
        this.pinBounce = 0;

        // Background map
        this.backgroundMap = null;
        this.backgroundMapLoaded = false;
        this.loadBackgroundMap();

        // Location pins
        this.locationPins = [];
        this.locationPinsLoaded = false;
        this.loadLocationPins();

        // Initialize
        this.loadLocations();
        this.gameLoop();
    }

    loadLocationPins() {
        const pinImages = ['locationpin-1.png', 'locationpin-2.png', 'locationpin-3.png'];
        let loadedCount = 0;

        pinImages.forEach(pinFile => {
            const pinImg = new Image();
            pinImg.onload = () => {
                this.locationPins.push(pinImg);
                loadedCount++;
                if (loadedCount === pinImages.length) {
                    this.locationPinsLoaded = true;
                }
            };
            pinImg.src = `assets/${pinFile}`;
        });
    }

    loadSprites() {
        const directions = ['up', 'down', 'left', 'right'];
        const frames = [1, 2, 3, 4];
        let totalSprites = directions.length * frames.length;
        let loadedCount = 0;

        directions.forEach(direction => {
            this.spriteImages[direction] = {};
            frames.forEach(frame => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalSprites) {
                        this.spritesLoaded = true;
                    }
                };
                img.src = `assets/sprite/sprite-${direction}_${frame}.png`;
                this.spriteImages[direction][frame] = img;
            });
        });
    }

    loadBackgroundMap() {
        const bgImage = new Image();
        bgImage.onload = () => {
            this.backgroundMap = bgImage;
            // Scale to 20% while preserving aspect ratio
            this.backgroundMapWidth = bgImage.width * 0.2;
            this.backgroundMapHeight = bgImage.height * 0.2;
            this.backgroundMapLoaded = true;

            // Resize canvas to match background map
            this.canvas.width = this.backgroundMapWidth;
            this.canvas.height = this.backgroundMapHeight;

            // Update player starting position to center of map
            this.player.x = this.backgroundMapWidth / 2;
            this.player.y = this.backgroundMapHeight / 2;

            // Update all location positions that use percentages
            this.locations.forEach(location => {
                this.updateLocationPosition(location);
            });
        };
        bgImage.src = 'assets/BackgroundMap.png';
    }

    setupInputHandlers() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Prevent default scrolling for arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].includes(e.key)) {
                e.preventDefault();
            }

            // Space key for interaction
            if (e.key === ' ' || e.key === 'Spacebar') {
                this.handleSpaceInteraction();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;

            // Prevent default scrolling for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });

        // Touch support for mobile (tap to interact)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleSpaceInteraction();
        });
    }

    loadLocations() {
        // Load all location images
        LOCATIONS.forEach(location => {
            const locationData = {
                ...location,
                normalImage: null,
                hoverImage: null,
                loaded: false,
                hoverTransition: 0 // 0 = normal, 1 = fully hovered (for smooth animation)
            };

            // Load normal image
            const normalImg = new Image();
            normalImg.onload = () => {
                locationData.normalImage = normalImg;
                locationData.width = normalImg.width * GAME_CONFIG.imageScale;
                locationData.height = normalImg.height * GAME_CONFIG.imageScale;

                this.checkLocationLoaded(locationData);
            };
            normalImg.src = location.image;

            // Load hover image (with title)
            const hoverImg = new Image();
            hoverImg.onload = () => {
                locationData.hoverImage = hoverImg;
                this.checkLocationLoaded(locationData);
            };
            hoverImg.src = location.imageHover;

            this.locations.push(locationData);
        });
    }

    updateLocationPosition(locationData) {
        // Convert percentage strings to pixel values based on background map size
        if (this.backgroundMapLoaded && locationData.width && locationData.height) {
            if (typeof locationData.x === 'string' && locationData.x.includes('%')) {
                const percent = parseFloat(locationData.x);
                // Calculate position for center point, then offset by half width to get top-left
                locationData.x = (percent / 100) * this.backgroundMapWidth - (locationData.width / 2);
            }
            if (typeof locationData.y === 'string' && locationData.y.includes('%')) {
                const percent = parseFloat(locationData.y);
                // Calculate position for center point, then offset by half height to get top-left
                locationData.y = (percent / 100) * this.backgroundMapHeight - (locationData.height / 2);
            }
        }
    }

    checkLocationLoaded(locationData) {
        if (locationData.normalImage && locationData.hoverImage) {
            locationData.loaded = true;
        }
    }

    handleInput() {
        if (!this.backgroundMapLoaded) return;

        this.player.isMoving = false;

        // WASD and Arrow key controls
        if (this.keys['w'] || this.keys['arrowup']) {
            this.player.y -= this.player.speed;
            this.player.direction = 'up';
            this.player.isMoving = true;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.player.y += this.player.speed;
            this.player.direction = 'down';
            this.player.isMoving = true;
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.x -= this.player.speed;
            this.player.direction = 'left';
            this.player.isMoving = true;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.player.x += this.player.speed;
            this.player.direction = 'right';
            this.player.isMoving = true;
        }

        // Keep player within canvas bounds
        this.player.x = Math.max(this.player.size / 2, Math.min(this.canvas.width - this.player.size / 2, this.player.x));
        this.player.y = Math.max(this.player.size / 2, Math.min(this.canvas.height - this.player.size / 2, this.player.y));
    }

    handleSpaceInteraction() {
        // Check if near a location and open dialogue
        if (this.nearbyLocation) {
            this.showDialogue(this.nearbyLocation);
        }
    }

    showDialogue(location) {
        const dialogueBox = document.getElementById('dialogue-box');
        const dialogueTitle = document.getElementById('dialogue-title');
        const dialogueText = document.getElementById('dialogue-text');
        const dialogueLink = document.getElementById('dialogue-link');

        dialogueTitle.textContent = location.name;
        dialogueText.textContent = location.description;
        dialogueLink.href = location.link;

        dialogueBox.classList.remove('hidden');

        // Close button handler
        document.getElementById('close-dialogue').onclick = () => {
            dialogueBox.classList.add('hidden');
        };

        // Close on clicking outside
        dialogueBox.onclick = (e) => {
            if (e.target === dialogueBox) {
                dialogueBox.classList.add('hidden');
            }
        };
    }

    checkProximity() {
        this.hoveredLocation = null;
        this.nearbyLocation = null;

        this.locations.forEach(location => {
            if (!location.loaded) return;

            // Calculate the inner 75% area for interaction detection
            const activeAreaScale = 0.75;
            const insetX = location.width * (1 - activeAreaScale) / 2;
            const insetY = location.height * (1 - activeAreaScale) / 2;

            const activeX = location.x + insetX;
            const activeY = location.y + insetY;
            const activeWidth = location.width * activeAreaScale;
            const activeHeight = location.height * activeAreaScale;

            const activeCenterX = activeX + activeWidth / 2;
            const activeCenterY = activeY + activeHeight / 2;

            const distance = Math.hypot(
                this.player.x - activeCenterX,
                this.player.y - activeCenterY
            );

            // Check if close enough to interact
            if (distance < GAME_CONFIG.interactionRadius) {
                this.nearbyLocation = location;
            }

            // Check if close enough to show hover state
            if (distance < GAME_CONFIG.hoverRadius) {
                this.hoveredLocation = location;
            }
        });
    }

    update() {
        this.handleInput();
        this.checkProximity();
        this.pinBounce += 0.1; // Animate the location pin

        // Update hover transitions for all locations
        this.locations.forEach(location => {
            if (this.hoveredLocation === location) {
                // Smoothly transition to hovered state
                location.hoverTransition = Math.min(1, location.hoverTransition + 0.15);
            } else {
                // Smoothly transition back to normal state
                location.hoverTransition = Math.max(0, location.hoverTransition - 0.15);
            }
        });

        // Update sprite animation
        if (this.player.isMoving) {
            this.player.animationCounter++;

            // Add trail position every 2 frames
            if (this.player.animationCounter % 2 === 0) {
                this.trail.unshift({
                    x: this.player.x,
                    y: this.player.y
                });

                // Keep trail at max length
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.pop();
                }
            }

            // Change frame every 8 updates (roughly 8 frames at 60fps)
            if (this.player.animationCounter >= 8) {
                this.player.animationCounter = 0;
                // Cycle through frames 2, 3, 4, then back to 2
                if (this.player.animationFrame === 2) {
                    this.player.animationFrame = 3;
                } else if (this.player.animationFrame === 3) {
                    this.player.animationFrame = 4;
                } else {
                    this.player.animationFrame = 2;
                }
            }
        } else {
            // When not moving, set to neutral position (frame 1)
            this.player.animationFrame = 1;
            this.player.animationCounter = 0;
            // Clear trail when not moving
            this.trail = [];
        }
    }

    drawBackground() {
        if (this.backgroundMapLoaded && this.backgroundMap) {
            // Draw the full background map scaled to 20% of original size
            this.ctx.drawImage(
                this.backgroundMap,
                0,
                0,
                this.backgroundMapWidth,
                this.backgroundMapHeight
            );
        } else {
            // Fallback: Simple grass/ground background while loading
            this.ctx.fillStyle = '#8FBC8F';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Add a subtle grid pattern
            this.ctx.strokeStyle = '#7A9D7A';
            this.ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < this.canvas.width; x += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (let y = 0; y < this.canvas.height; y += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
    }

    drawLocations() {
        // Sort locations by y-position to create depth (top-to-bottom rendering)
        // Locations with higher y values are drawn last (appear in front)
        // Exception: Lambda Youth Network always drawn last to ensure accessibility
        const sortedLocations = [...this.locations].sort((a, b) => {
            if (!a.loaded || !b.loaded) return 0;

            // Always draw Lambda Youth Network last (on top)
            if (a.id === 'lambda-youth') return 1;
            if (b.id === 'lambda-youth') return -1;

            return a.y - b.y;
        });

        sortedLocations.forEach(location => {
            if (!location.loaded) return;

            // Calculate subtle scale effect (1.0 to 1.05)
            const scale = 1 + (location.hoverTransition * 0.05);
            const scaledWidth = location.width * scale;
            const scaledHeight = location.height * scale;

            // Center the scaled image
            const scaledX = location.x - (scaledWidth - location.width) / 2;
            const scaledY = location.y - (scaledHeight - location.height) / 2;

            // Draw normal image
            this.ctx.globalAlpha = 1 - location.hoverTransition;
            this.ctx.drawImage(
                location.normalImage,
                scaledX,
                scaledY,
                scaledWidth,
                scaledHeight
            );

            // Draw hover image on top with transition opacity
            this.ctx.globalAlpha = location.hoverTransition;
            this.ctx.drawImage(
                location.hoverImage,
                scaledX,
                scaledY,
                scaledWidth,
                scaledHeight
            );

            // Reset alpha
            this.ctx.globalAlpha = 1;

            // Draw location pin indicator (always visible)
            // Use custom pinOffset if defined for this location, otherwise use default
            const pinOffset = location.pinOffset !== undefined ? location.pinOffset : GAME_CONFIG.pinOffset;
            this.drawLocationPin(
                location.x + location.width / 2,
                location.y + pinOffset,
                this.nearbyLocation === location,
                location
            );
        });
    }

    drawLocationPin(x, y, isNearby = false, location = null) {
        if (!this.locationPinsLoaded || this.locationPins.length === 0) return;

        // Create unique animation offset for each location based on its ID
        let animationOffset = 0;
        if (location && location.id) {
            // Hash the location ID to get a unique offset for animation timing
            const hash = location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            animationOffset = hash / 100; // Create unique decimal offset
        }

        // Asynchronous bounce - each pin bounces at different phase
        const bounce = Math.sin(this.pinBounce + animationOffset) * 3;
        const pinY = y + bounce;

        // Asynchronous variant cycling - each pin cycles at different speed/phase
        const variantSpeed = 1.5 + (animationOffset % 1) * 0.5; // Speed varies between 1.5 and 2.0
        const pinIndex = Math.floor((this.pinBounce * variantSpeed + animationOffset * 10) / 2) % 3;

        const pinImage = this.locationPins[pinIndex];
        const pinWidth = pinImage.width * 0.15; // Scale pin to 15% of original size
        const pinHeight = pinImage.height * 0.15;

        // Draw pin centered at x, y
        this.ctx.drawImage(
            pinImage,
            x - pinWidth / 2,
            pinY - pinHeight,
            pinWidth,
            pinHeight
        );
    }

    drawTrail() {
        if (this.trail.length === 0) return;

        // Rainbow colors
        const rainbowColors = [
            '#E40303', // Red
            '#FF8C00', // Orange
            '#FFED00', // Yellow
            '#008026', // Green
            '#24408E', // Blue
            '#732982'  // Purple
        ];

        // Draw trail particles from oldest to newest
        this.trail.forEach((position, index) => {
            const alpha = 1 - (index / this.trail.length); // Fade out older particles
            const size = 8 * (1 - index / this.trail.length); // Shrink older particles
            const colorIndex = index % rainbowColors.length;

            this.ctx.globalAlpha = alpha * 0.7; // Make semi-transparent
            this.ctx.fillStyle = rainbowColors[colorIndex];
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1; // Reset alpha
    }

    drawPlayer() {
        if (!this.spritesLoaded) {
            // Fallback: Simple colored square while sprites load
            this.ctx.fillStyle = '#FF1493';
            this.ctx.fillRect(
                this.player.x - this.player.size / 2,
                this.player.y - this.player.size / 2,
                this.player.size,
                this.player.size
            );
            return;
        }

        // Get the appropriate sprite based on direction and animation frame
        const sprite = this.spriteImages[this.player.direction][this.player.animationFrame];

        if (sprite) {
            // Draw sprite centered on player position
            this.ctx.drawImage(
                sprite,
                this.player.x - this.player.size / 2,
                this.player.y - this.player.size / 2,
                this.player.size,
                this.player.size
            );
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawLocations();
        this.drawTrail(); // Draw trail before player so it appears behind
        this.drawPlayer();
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});
