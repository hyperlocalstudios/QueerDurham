// Hyperlocal Durham: Queer History - Game Engine
// Modular exploration game with plug-and-play location system

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        // Canvas size will be set when background loads
        this.canvas.width = GAME_CONFIG.canvasWidth;
        this.canvas.height = GAME_CONFIG.canvasHeight;

        // Image loading tracking
        this.totalImagesToLoad = 0;
        this.imagesLoaded = 0;

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

        // Object system
        this.objects = [];
        this.nearbyObject = null;
        this.isAcquiringObject = false;
        this.acquisitionState = null;
        this.acquireSprite = null;
        this.acquireSpriteLoaded = false;

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

        // Bust sprite for character dialogue
        this.bustSprite = null;
        this.bustSpriteLoaded = false;
        this.loadBustSprite();

        // Initialize dialogue box with bust sprite once loaded
        this.initializeDialogueBox();

        // Load acquire sprite
        this.loadAcquireSprite();

        // Initialize
        this.loadLocations();
        this.loadObjects();
        this.gameLoop();
    }

    loadLocationPins() {
        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

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
            pinImg.onerror = () => {
                console.error(`Failed to load pin: ${basePath}assets/${pinFile}`);
            };
            pinImg.src = `${basePath}assets/${pinFile}`;
        });
    }

    loadBustSprite() {
        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

        const bustImg = new Image();
        bustImg.onload = () => {
            this.bustSprite = bustImg;
            this.bustSpriteLoaded = true;
            console.log('Bust sprite loaded successfully');
            // Update the dialogue box with the loaded sprite
            this.updateBustSprite();
        };
        bustImg.onerror = () => {
            console.error(`Failed to load bust sprite: ${basePath}assets/bustsprite/bust-sprite_bull-neutral.png`);
        };
        bustImg.src = `${basePath}assets/bustsprite/bust-sprite_bull-neutral.png`;
        console.log('Loading bust sprite from:', bustImg.src);
    }

    initializeDialogueBox() {
        // Set up the permanent dialogue box once DOM is ready
        const charDialogue = document.getElementById('character-dialogue');
        if (charDialogue && this.bustSpriteLoaded && this.bustSprite) {
            this.updateBustSprite();
        }
    }

    updateBustSprite() {
        const bustElement = document.querySelector('.character-bust');
        if (bustElement && this.bustSpriteLoaded && this.bustSprite) {
            const bustWidth = 120;
            const aspectRatio = this.bustSprite.height / this.bustSprite.width;
            const bustHeight = bustWidth * aspectRatio;

            bustElement.style.backgroundImage = `url('${this.bustSprite.src}')`;
            bustElement.style.width = `${bustWidth}px`;
            bustElement.style.height = `${bustHeight}px`;
            console.log('Updated bust sprite in dialogue box');
        }
    }

    loadAcquireSprite() {
        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

        const acquireImg = new Image();
        acquireImg.onload = () => {
            this.acquireSprite = acquireImg;
            this.acquireSpriteLoaded = true;
            console.log('Acquire sprite loaded successfully');
        };
        acquireImg.onerror = () => {
            console.error(`Failed to load acquire sprite: ${basePath}assets/Sprite/sprite-acquire.png`);
        };
        acquireImg.src = `${basePath}assets/Sprite/sprite-acquire.png`;
    }

    loadSprites() {
        const directions = ['up', 'down', 'left', 'right'];
        const frames = [1, 2, 3, 4];
        let totalSprites = directions.length * frames.length;
        let loadedCount = 0;

        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

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
                img.onerror = () => {
                    console.error(`Failed to load sprite: ${basePath}assets/Sprite/sprite-${direction}_${frame}.png`);
                };
                img.src = `${basePath}assets/Sprite/sprite-${direction}_${frame}.png`;
                this.spriteImages[direction][frame] = img;
            });
        });
    }

    loadBackgroundMap() {
        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

        this.totalImagesToLoad++;
        const bgImage = new Image();
        bgImage.onload = () => {
            this.backgroundMap = bgImage;
            // Scale to 20% while preserving aspect ratio
            this.backgroundMapWidth = bgImage.width * 0.2;
            this.backgroundMapHeight = bgImage.height * 0.2;
            this.backgroundMapLoaded = true;
            this.imagesLoaded++;

            console.log(`Background map loaded (${this.imagesLoaded}/${this.totalImagesToLoad})`);

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

            // Update all object positions that use percentages
            this.objects.forEach(object => {
                this.updateObjectPosition(object);
            });
        };
        bgImage.onerror = () => {
            console.error(`Failed to load background map: ${basePath}assets/BackgroundMap.png`);
            this.retryImageLoad(bgImage, `${basePath}assets/BackgroundMap.png`, 'Background Map');
        };
        bgImage.src = `${basePath}assets/BackgroundMap.png`;
    }

    retryImageLoad(img, src, name, attempt = 1, maxAttempts = 3) {
        if (attempt >= maxAttempts) {
            console.error(`Failed to load ${name} after ${maxAttempts} attempts`);
            return;
        }

        console.log(`Retrying ${name} (attempt ${attempt + 1}/${maxAttempts})...`);
        setTimeout(() => {
            img.onerror = () => {
                this.retryImageLoad(img, src, name, attempt + 1, maxAttempts);
            };
            img.src = src + '?retry=' + attempt;
        }, 1000 * attempt); // Exponential backoff: 1s, 2s, 3s
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
        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

        // Load all location images
        LOCATIONS.forEach(location => {
            const locationData = {
                ...location,
                normalImage: null,
                hoverImage: null,
                loaded: false,
                hoverTransition: 0 // 0 = normal, 1 = fully hovered (for smooth animation)
            };

            this.totalImagesToLoad += 2; // Normal + hover image

            // Load normal image
            const normalImg = new Image();
            normalImg.onload = () => {
                locationData.normalImage = normalImg;
                locationData.width = normalImg.width * GAME_CONFIG.imageScale;
                locationData.height = normalImg.height * GAME_CONFIG.imageScale;
                this.imagesLoaded++;
                console.log(`Loaded ${location.name} normal (${this.imagesLoaded}/${this.totalImagesToLoad})`);

                this.checkLocationLoaded(locationData);
            };
            normalImg.onerror = () => {
                console.error(`Failed to load location image: ${basePath}${location.image}`);
                this.retryImageLoad(normalImg, `${basePath}${location.image}`, `${location.name} (normal)`);
            };
            normalImg.src = `${basePath}${location.image}`;

            // Load hover image (with title)
            const hoverImg = new Image();
            hoverImg.onload = () => {
                locationData.hoverImage = hoverImg;
                this.imagesLoaded++;
                console.log(`Loaded ${location.name} hover (${this.imagesLoaded}/${this.totalImagesToLoad})`);
                this.checkLocationLoaded(locationData);
            };
            hoverImg.onerror = () => {
                console.error(`Failed to load hover image: ${basePath}${location.imageHover}`);
                this.retryImageLoad(hoverImg, `${basePath}${location.imageHover}`, `${location.name} (hover)`);
            };
            hoverImg.src = `${basePath}${location.imageHover}`;

            this.locations.push(locationData);
        });
    }

    loadObjects() {
        if (typeof OBJECTS === 'undefined') {
            console.log('No objects defined');
            return;
        }

        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

        OBJECTS.forEach(object => {
            const objectData = {
                ...object,
                image1Loaded: null,
                image2Loaded: null,
                loaded: false,
                animationFrame: 1, // Toggle between 1 and 2
                animationCounter: 0
            };

            // Load first image state
            const img1 = new Image();
            img1.onload = () => {
                objectData.image1Loaded = img1;
                objectData.width = img1.width * GAME_CONFIG.objectScale;
                objectData.height = img1.height * GAME_CONFIG.objectScale;
                this.checkObjectLoaded(objectData);
            };
            img1.onerror = () => {
                console.error(`Failed to load object image: ${basePath}${object.image1}`);
            };
            img1.src = `${basePath}${object.image1}`;

            // Load second image state
            const img2 = new Image();
            img2.onload = () => {
                objectData.image2Loaded = img2;
                this.checkObjectLoaded(objectData);
            };
            img2.onerror = () => {
                console.error(`Failed to load object image: ${basePath}${object.image2}`);
            };
            img2.src = `${basePath}${object.image2}`;

            this.objects.push(objectData);
        });
    }

    checkObjectLoaded(objectData) {
        if (objectData.image1Loaded && objectData.image2Loaded) {
            objectData.loaded = true;
            // Update position if percentage-based
            this.updateObjectPosition(objectData);
        }
    }

    updateObjectPosition(objectData) {
        if (this.backgroundMapLoaded && objectData.width && objectData.height) {
            if (typeof objectData.x === 'string' && objectData.x.includes('%')) {
                const percent = parseFloat(objectData.x);
                objectData.x = (percent / 100) * this.backgroundMapWidth - (objectData.width / 2);
            }
            if (typeof objectData.y === 'string' && objectData.y.includes('%')) {
                const percent = parseFloat(objectData.y);
                objectData.y = (percent / 100) * this.backgroundMapHeight - (objectData.height / 2);
            }
        }
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
        // If acquisition animation is in wait phase (step 3), skip to end
        if (this.isAcquiringObject && this.acquisitionState && this.acquisitionState.animationStep === 3) {
            this.acquisitionState.animationStep = 4;
            return;
        }

        // Check if a button is visible and can be triggered
        const charDialogue = document.getElementById('character-dialogue');
        const learnMoreBtn = charDialogue ? charDialogue.querySelector('.learn-more-btn') : null;

        // If button is visible, trigger it with space bar
        if (learnMoreBtn && learnMoreBtn.style.display === 'block') {
            learnMoreBtn.click();
            return;
        }

        // Otherwise, check if near an object first (objects have priority)
        if (this.nearbyObject && !this.nearbyObject.collected) {
            this.showObjectDialogue(this.nearbyObject);
        }
        // Otherwise check if near a location
        else if (this.nearbyLocation) {
            // Show the character dialogue first
            this.showCharacterDialogue(this.nearbyLocation);
        }
    }

    showObjectDialogue(object) {
        console.log('showObjectDialogue called for:', object.name);

        const charDialogue = document.getElementById('character-dialogue');
        if (!charDialogue) return;

        const textElement = charDialogue.querySelector('.character-text');
        const learnMoreBtn = charDialogue.querySelector('.learn-more-btn');

        // Update text with object dialogue
        textElement.textContent = object.dialogue;

        // Update button text
        learnMoreBtn.textContent = object.buttonText;

        // Show the button
        learnMoreBtn.style.display = 'block';

        // Add event listener to collect the object
        learnMoreBtn.onclick = () => {
            this.acquireObject(object);
        };

        console.log('Object dialogue shown');
    }

    showCharacterDialogue(location) {
        console.log('showCharacterDialogue called for:', location.name);

        const charDialogue = document.getElementById('character-dialogue');
        if (!charDialogue) return;

        const textElement = charDialogue.querySelector('.character-text');
        const learnMoreBtn = charDialogue.querySelector('.learn-more-btn');

        // Update text with location dialogue
        textElement.textContent = location.dialogue || "Hmm, this place looks interesting...";

        // Update button text to "Investigate..."
        learnMoreBtn.textContent = "Investigate...";

        // Show the "Learn More" button
        learnMoreBtn.style.display = 'block';

        // Add event listener to "Learn More" button
        learnMoreBtn.onclick = () => {
            this.showDialogue(location);
        };

        console.log('Character dialogue updated for location');
    }

    acquireObject(object) {
        console.log('Acquiring object:', object.name);

        // Mark object as collected
        object.collected = true;
        this.isAcquiringObject = true;

        // Store acquisition animation state
        this.acquisitionState = {
            object: object,
            animationStep: 0, // 0=spin, 1=pose, 2=float, 3=wait, 4=done
            spinDirection: 0, // 0=down, 1=right, 2=up, 3=left
            spinCounter: 0,
            poseCounter: 0,
            floatCounter: 0,
            floatY: 0,
            linesOpacity: 0,
            waitCounter: 0
        };

        console.log('Starting acquisition animation');
    }

    updateAcquisitionAnimation() {
        const state = this.acquisitionState;
        const directions = ['down', 'right', 'up', 'left'];

        // Step 0: Spin through all directions
        if (state.animationStep === 0) {
            state.spinCounter++;
            if (state.spinCounter >= 8) { // 8 frames per direction
                state.spinCounter = 0;
                state.spinDirection++;

                if (state.spinDirection >= 4) {
                    // Done spinning, move to pose
                    state.animationStep = 1;
                    state.spinDirection = 0;
                }
            }
            // Update player direction during spin
            this.player.direction = directions[state.spinDirection];
        }
        // Step 1: Show acquire pose
        else if (state.animationStep === 1) {
            state.poseCounter++;
            if (state.poseCounter >= 10) { // Hold pose for 10 frames
                state.animationStep = 2;

                // Update dialogue to show acquire message
                const charDialogue = document.getElementById('character-dialogue');
                if (charDialogue) {
                    const textElement = charDialogue.querySelector('.character-text');
                    const learnMoreBtn = charDialogue.querySelector('.learn-more-btn');
                    textElement.textContent = state.object.acquireMessage;
                    learnMoreBtn.style.display = 'none';
                }
            }
        }
        // Step 2: Float object up with emanating lines
        else if (state.animationStep === 2) {
            state.floatCounter++;
            state.floatY = Math.min(25, state.floatY + (25 / 30)); // Float up 25 pixels over 30 frames
            state.linesOpacity = Math.min(1, state.linesOpacity + (1 / 30));

            if (state.floatCounter >= 30) { // Float for 30 frames
                state.animationStep = 3;
            }
        }
        // Step 3: Wait with message visible (300 frames / 5 seconds)
        else if (state.animationStep === 3) {
            state.waitCounter++;
            if (state.waitCounter >= 300) { // 5 seconds at 60fps
                state.animationStep = 4;
            }
        }
        // Step 4: Done
        else if (state.animationStep === 4) {
            this.isAcquiringObject = false;
            this.acquisitionState = null;
            this.resetDialogue();
        }
    }


    resetDialogue() {
        const charDialogue = document.getElementById('character-dialogue');
        if (!charDialogue) return;

        const textElement = charDialogue.querySelector('.character-text');
        const learnMoreBtn = charDialogue.querySelector('.learn-more-btn');

        // Reset to default instructions
        textElement.textContent = 'I can use Arrow Keys or WASD to move and press SPACE to interact with objects.';

        // Hide the "Learn More" button
        learnMoreBtn.style.display = 'none';
    }

    showDialogue(location) {
        const basePath = window.location.pathname.includes('/QueerDurham/')
            ? '/QueerDurham/'
            : './';

        const dialogueBox = document.getElementById('dialogue-box');
        const dialogueTitle = document.getElementById('dialogue-title');
        const dialogueImage = document.getElementById('dialogue-image');
        const dialogueAddress = document.getElementById('dialogue-address');
        const dialogueCharacteristics = document.getElementById('dialogue-characteristics');
        const dialoguePreviewText = document.getElementById('dialogue-preview-text');
        const dialogueLink = document.getElementById('dialogue-link');

        // Section 1: Title, image, and address
        dialogueTitle.textContent = location.name;
        dialogueImage.src = `${basePath}${location.imageHover}`;
        dialogueImage.alt = location.name;
        dialogueAddress.textContent = location.address || '';

        // Section 2: Characteristics icons
        dialogueCharacteristics.innerHTML = ''; // Clear previous icons
        if (location.characteristics && location.characteristics.length > 0) {
            location.characteristics.forEach(characteristic => {
                const icon = document.createElement('img');
                icon.src = `${basePath}assets/legend/icon_${characteristic}.png`;
                icon.alt = characteristic;
                icon.title = characteristic.charAt(0).toUpperCase() + characteristic.slice(1);
                dialogueCharacteristics.appendChild(icon);
            });
            dialogueCharacteristics.style.display = 'flex';
        } else {
            dialogueCharacteristics.style.display = 'none';
        }

        // Section 3: Preview text and link
        const fullText = location.previewText || location.description;
        const words = fullText.split(' ');

        // Clear previous content
        dialoguePreviewText.innerHTML = '';

        if (words.length > 100) {
            // Text exceeds 100 words, add see more/less functionality
            const first100Words = words.slice(0, 100).join(' ');

            const textSpan = document.createElement('span');
            textSpan.textContent = first100Words + '... ';

            const toggleLink = document.createElement('span');
            toggleLink.className = 'see-more-toggle';
            toggleLink.textContent = 'See more';

            let isExpanded = false;
            toggleLink.onclick = () => {
                if (isExpanded) {
                    textSpan.textContent = first100Words + '... ';
                    toggleLink.textContent = 'See more';
                    isExpanded = false;
                } else {
                    textSpan.textContent = fullText + ' ';
                    toggleLink.textContent = 'See less';
                    isExpanded = true;
                }
            };

            dialoguePreviewText.appendChild(textSpan);
            dialoguePreviewText.appendChild(toggleLink);
        } else {
            // Text is 100 words or less, show all
            dialoguePreviewText.textContent = fullText;
        }

        dialogueLink.href = location.link;

        dialogueBox.classList.remove('hidden');

        // Close button handler
        document.getElementById('close-dialogue').onclick = () => {
            dialogueBox.classList.add('hidden');
            this.resetDialogue();
        };

        // Close on clicking outside
        dialogueBox.onclick = (e) => {
            if (e.target === dialogueBox) {
                dialogueBox.classList.add('hidden');
                this.resetDialogue();
            }
        };
    }

    checkProximity() {
        this.hoveredLocation = null;
        this.nearbyLocation = null;
        this.nearbyObject = null;

        // Check objects first (they have priority)
        this.objects.forEach(object => {
            if (!object.loaded || object.collected) return;

            const objectCenterX = object.x + object.width / 2;
            const objectCenterY = object.y + object.height / 2;

            const distance = Math.hypot(
                this.player.x - objectCenterX,
                this.player.y - objectCenterY
            );

            if (distance < GAME_CONFIG.interactionRadius) {
                this.nearbyObject = object;
            }
        });

        // Only check locations if no object is nearby
        if (!this.nearbyObject) {
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
    }

    update() {
        // Update acquisition animation if active
        if (this.isAcquiringObject && this.acquisitionState) {
            this.updateAcquisitionAnimation();
        }

        this.handleInput();

        // Store previous nearby location and object to detect changes
        const previousNearbyLocation = this.nearbyLocation;
        const previousNearbyObject = this.nearbyObject;

        this.checkProximity();
        this.pinBounce += 0.1; // Animate the location pin

        // Reset dialogue if player moved away from both location and object
        if (!this.nearbyLocation && !this.nearbyObject && (previousNearbyLocation || previousNearbyObject)) {
            this.resetDialogue();
        }

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

        // Update object animations (toggle between states)
        this.objects.forEach(object => {
            if (!object.loaded || object.collected) return;

            object.animationCounter++;
            if (object.animationCounter >= 30) { // Toggle every 30 frames
                object.animationCounter = 0;
                object.animationFrame = object.animationFrame === 1 ? 2 : 1;
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

    drawObjects() {
        this.objects.forEach(object => {
            if (!object.loaded || object.collected) return;

            // Get the current animation frame image
            const img = object.animationFrame === 1 ? object.image1Loaded : object.image2Loaded;

            if (img) {
                // Add hover animation when player is nearby
                let yOffset = 0;
                let scale = 1;
                if (this.nearbyObject === object) {
                    // Bounce animation using pinBounce counter
                    yOffset = Math.sin(this.pinBounce * 2) * 5;
                    // Subtle scale pulse
                    scale = 1 + Math.sin(this.pinBounce * 2) * 0.1;
                }

                const scaledWidth = object.width * scale;
                const scaledHeight = object.height * scale;
                const scaledX = object.x - (scaledWidth - object.width) / 2;
                const scaledY = object.y - (scaledHeight - object.height) / 2 + yOffset;

                this.ctx.drawImage(
                    img,
                    scaledX,
                    scaledY,
                    scaledWidth,
                    scaledHeight
                );
            }
        });
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

        // If in acquisition animation step 1 (pose), show acquire sprite
        if (this.isAcquiringObject && this.acquisitionState && this.acquisitionState.animationStep === 1) {
            if (this.acquireSpriteLoaded && this.acquireSprite) {
                this.ctx.drawImage(
                    this.acquireSprite,
                    this.player.x - this.player.size / 2,
                    this.player.y - this.player.size / 2,
                    this.player.size,
                    this.player.size
                );
            }
            return;
        }

        // Normal player rendering (including spin during step 0)
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

        // If in acquisition animation step 2+ (float), draw floating object
        if (this.isAcquiringObject && this.acquisitionState && this.acquisitionState.animationStep >= 2) {
            this.drawFloatingObject();
        }
    }

    drawFloatingObject() {
        const state = this.acquisitionState;
        const object = state.object;

        // Draw golden emanating lines
        if (state.linesOpacity > 0) {
            this.ctx.globalAlpha = state.linesOpacity;
            this.ctx.strokeStyle = '#FFD700'; // Golden color
            this.ctx.lineWidth = 2;

            const centerX = this.player.x;
            const centerY = this.player.y - state.floatY - 20;

            // Draw radiating lines
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const length = 15 + Math.sin(this.pinBounce) * 5; // Pulsing effect

                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(
                    centerX + Math.cos(angle) * length,
                    centerY + Math.sin(angle) * length
                );
                this.ctx.stroke();
            }

            this.ctx.globalAlpha = 1;
        }

        // Draw the object image floating above player
        if (object && object.image1Loaded) {
            const floatX = this.player.x - object.width / 2;
            const floatY = this.player.y - state.floatY - object.height - 10;

            this.ctx.drawImage(
                object.image1Loaded,
                floatX,
                floatY,
                object.width,
                object.height
            );
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawLocations();
        this.drawObjects(); // Draw objects after locations
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
