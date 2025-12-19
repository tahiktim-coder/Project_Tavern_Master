```javascript
import { AdventurerGenerator } from './src/generators/adventurerGenerator.js';
import { Renderer } from './src/systems/Renderer.js';

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas);

// Game Constants
const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 768;

// Set actual canvas size to match resolution
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// State
let gameState = {
    day: 1,
    gold: 100,
    reputation: 50,
    currentAdventurer: null,
    adventurerQueue: []
};

async function init() {
    document.getElementById('debug-console').style.display = 'block'; // Show debug output
    console.log("Guild Master Initializing...");
    await renderer.loadAssets();

    // Generate first adventurer
    startNewDay();

    // Input Handling (Simple click to next day for testing)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            startNewDay();
        }
    });

    gameLoop();
}

function startNewDay() {
    gameState.day++;
    gameState.currentAdventurer = AdventurerGenerator.generate(gameState.day);
    console.log("New Day Started:", gameState.currentAdventurer);
}

function gameLoop() {
    renderer.draw(gameState);
    requestAnimationFrame(gameLoop);
}

// Start
// window.onload = init; // Module is already deferred, just call init
init().catch(e => {
    console.error("FATAL INIT ERROR:", e);
    const consoleEl = document.getElementById('debug-console');
    if (consoleEl) {
        consoleEl.innerHTML += `< div style = "color:red" > INIT ERROR: ${ e.message }</div > `;
    }
});
```
