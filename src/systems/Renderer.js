export class Renderer {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.assets = {};
        this.isLoaded = false;
    }

    async loadAssets() {
        // Simple asset loader
        const imagePaths = {
            'bg_main': 'assets/main_menu_bg.png',
            // Placeholder for body parts - we will use colored rects until we have assets
        };

        const promises = Object.keys(imagePaths).map(key => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = imagePaths[key];
                img.onload = () => {
                    this.assets[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load asset: ${key}`);
                    // Resolve anyway to not block game, just missing asset
                    resolve();
                };
            });
        });

        await Promise.all(promises);
        this.isLoaded = true;
        console.log("Renderer: All Assets Loaded");
    }

    draw(gameState) {
        if (!this.isLoaded) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw Background
        if (this.assets['bg_main']) {
            this.ctx.drawImage(this.assets['bg_main'], 0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = "#3e3e3e";
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // 2. Draw Current Adventurer (if any)
        // Since we don't have body parts yet, we draw a Placeholder "Card"
        const hero = gameState.currentAdventurer;
        if (hero) {
            this.drawAdventurerPlaceholder(hero);
        }
    }

    drawAdventurerPlaceholder(hero) {
        const cx = this.width / 2;
        const cy = this.height / 2 + 50;

        // Silhouette
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(cx - 100, cy - 200, 200, 400);

        // Name Tag
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "20px 'Press Start 2P'";
        this.ctx.textAlign = "center";
        this.ctx.fillText(hero.name, cx, cy - 220);

        // Stats Block
        this.ctx.font = "12px 'Press Start 2P'";
        this.ctx.fillText(`STR: ${hero.stats.str}`, cx, cy + 240);
        this.ctx.fillText(`INT: ${hero.stats.int}`, cx, cy + 260);
        this.ctx.fillText(`Trait: ${hero.traits[0] || 'None'}`, cx, cy + 280);
    }
}
