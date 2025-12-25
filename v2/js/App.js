
// Import modules from the existing codebase (Backwards Compatibility)
// We go up two levels to reach 'src'
import { AdventurerGenerator } from '../../src/generators/adventurerGenerator.js';

class App {
    constructor() {
        this.state = {
            day: 1,
            gold: 100,
            crownFavor: 50,
            townPop: 50,
            currentCard: null
        };

        // DOM Elements
        this.elStack = document.getElementById('card-stack');
        this.elDossier = document.getElementById('dossier-overlay');

        // Initialize
        this.init();
    }

    init() {
        console.log("Guild Master V2 Initializing...");

        // Hook up Buttons
        document.getElementById('btn-reject').addEventListener('click', () => this.handleSwipe(false));
        document.getElementById('btn-accept').addEventListener('click', () => this.handleSwipe(true));

        // Hook up Dossier Close
        document.getElementById('btn-close-dossier').addEventListener('click', () => {
            this.elDossier.classList.add('hidden');
        });

        // Load First Card
        this.drawNextCard();
    }

    // --- GAME LOGIC ---

    drawNextCard() {
        // 1. Generate Data (Using your EXISTING logic)
        const adventurer = AdventurerGenerator.generate(this.state.day);

        // 2. Add some "V2 Exclusive" data (Backstory)
        adventurer.backstory = this.generateBackstory(adventurer);

        this.state.currentCard = adventurer;

        // 3. Render
        this.renderCard(adventurer);
    }

    handleSwipe(accepted) {
        const cardEl = document.querySelector('.game-card');
        if (!cardEl) return;

        // 1. Visual Animation
        cardEl.classList.add(accepted ? 'swipe-right' : 'swipe-left');

        // 2. Logic (Simulated for now)
        if (accepted) {
            console.log("Recruited:", this.state.currentCard.name);
            // Deduct Gold? Add to Roster? (To Implement)
        } else {
            console.log("Dismissed:", this.state.currentCard.name);
        }

        // 3. Wait for animation then remove
        setTimeout(() => {
            cardEl.remove();
            // Draw next
            this.drawNextCard();
        }, 300);
    }

    // --- RENDERING ---

    renderCard(data) {
        this.elStack.innerHTML = ''; // Clear previous

        const card = document.createElement('div');
        card.className = 'game-card';

        // Click to Inspect
        card.addEventListener('click', () => this.openDossier(data));

        // Construct HTML
        // Note: We use relative paths for images too
        const portraitPath = `../assets/portraits/${data.classId}/human_warrior.png`; // Placeholder logic, ideally use proper mapper

        // Fix: Use the portrait logic from AdventurerGenerator if available, or fallback
        // For prototype, we'll try to guess based on classId
        let imgName = 'human_warrior';
        if (['mage', 'scholar'].includes(data.classId)) imgName = 'elf_mage';
        if (['rogue', 'thief'].includes(data.classId)) imgName = 'human_rogue';

        // We will just assume a placeholder for now to prove it works
        const imgSrc = `../assets/portraits/${data.classId}/${imgName}.png`;

        // Simple fallback
        const safeImg = `../assets/counter_view.png`;

        card.innerHTML = `
            <div class="card-image" style="background-image: url('${safeImg}');">
                <div class="card-header">
                    <div class="card-name">${data.name}</div>
                    <div class="card-title">Lvl ${data.level || 1} ${data.classId}</div>
                    <div class="card-title" style="font-size: 0.7em; color: #aaa;">${data.race}</div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-tags">
                   ${data.traits.map(t => `<span class="tag trait">${t}</span>`).join('')}
                </div>
                <div class="card-quote">
                    "${data.backstory.short}"
                </div>
            </div>
        `;

        this.elStack.appendChild(card);
    }

    openDossier(data) {
        const body = document.getElementById('dossier-body');
        body.innerHTML = `
            <h2>${data.name}</h2>
            <p><strong>Race:</strong> ${data.race} | <strong>Class:</strong> ${data.classId}</p>
            <hr>
            <h3>Origin</h3>
            <p>${data.backstory.long}</p>
            <hr>
            <h3>Stats</h3>
            <ul>
                <li>Strength: ${data.stats.str}</li>
                <li>Intellect: ${data.stats.int}</li>
                <li>Dexterity: ${data.stats.dex}</li>
                <li>Vitality: ${data.stats.vit}</li>
            </ul>
        `;
        this.elDossier.classList.remove('hidden');
    }

    // --- HELPERS ---

    generateBackstory(adventurer) {
        const origins = [
            "was found in a basket by the river.",
            "served in the King's army but deserted.",
            "is looking for the six-fingered man who killed their father.",
            "owes a lot of money to the wrong people."
        ];
        const randOrigin = origins[Math.floor(Math.random() * origins.length)];

        return {
            short: "I need gold, fast.",
            long: `${adventurer.name} ${randOrigin} It has been a hard life, and this guild is the last hope before things get desperate.`
        };
    }
}

// Start
new App();
