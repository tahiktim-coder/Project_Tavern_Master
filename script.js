const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

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
    adventurerQueue: []
};

function init() {
    console.log("Guild Master Initializing...");
    // Placeholder: Draw something to prove it works
    ctx.fillStyle = "#3e3e3e";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#ffffff";
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText("Guild Master - Day " + gameState.day, 20, 40);
    
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("Waiting for adventurers...", SCREEN_WIDTH/2 - 150, SCREEN_HEIGHT/2);

    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    // Update
    // Draw
}

// Start
window.onload = init;
