// ================================================
// MOBILE APP CONTROLLER
// Connects new DOM UI to existing game logic
// ================================================

class MobileApp {
    constructor() {
        this.state = {
            day: 1,
            gold: 100,
            currentCharacter: null,
            quests: [],
            selectedQuest: null,
            roster: []
        };

        // Cache DOM elements
        this.el = {
            goldValue: document.getElementById('gold-value'),
            charName: document.getElementById('char-name'),
            charTitle: document.getElementById('char-title'),
            charPortrait: document.getElementById('char-portrait-img'),
            charTraits: document.getElementById('char-traits'),
            charQuote: document.getElementById('char-quote'),
            contractsGrid: document.getElementById('contracts-grid'),

            btnHire: document.getElementById('btn-hire'),
            btnDismiss: document.getElementById('btn-dismiss'),
            btnEndDay: document.getElementById('btn-end-day'),
            btnRoster: document.getElementById('btn-roster'),

            overlayDossier: document.getElementById('overlay-dossier'),
            overlayContract: document.getElementById('overlay-contract'),

            characterCard: document.getElementById('character-card')
        };

        this.init();
    }

    init() {
        console.log('🎮 Mobile App Initializing...');

        // Set up event listeners
        this.setupEventListeners();

        // Load first character
        this.loadNewCharacter();

        // Load quests
        this.loadQuests();

        console.log('✅ Mobile App Ready');
    }

    setupEventListeners() {
        // Main Actions
        this.el.btnHire.addEventListener('click', () => this.handleHire());
        this.el.btnDismiss.addEventListener('click', () => this.handleDismiss());
        this.el.btnEndDay.addEventListener('click', () => this.handleEndDay());

        // Character Card - Open Dossier
        this.el.characterCard.addEventListener('click', () => this.openDossier());

        // Overlay Close Buttons
        document.querySelectorAll('.overlay-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.overlay').classList.add('hidden');
            });
        });

        // Roster Button
        this.el.btnRoster.addEventListener('click', () => this.openRoster());
    }

    // ========================================
    // CHARACTER LOADING
    // ========================================

    loadNewCharacter() {
        // Use existing AdventurerGenerator
        if (window.GameSystems && window.GameSystems.AdventurerGenerator) {
            this.state.currentCharacter = window.GameSystems.AdventurerGenerator.generate(this.state.day);
        } else {
            console.warn('⚠️ AdventurerGenerator not found, using fallback');
            this.state.currentCharacter = this.createFallbackCharacter();
        }

        this.renderCharacter();
    }

    createFallbackCharacter() {
        return {
            name: "Test Hero",
            classId: "warrior",
            race: "human",
            level: 1,
            traits: ["Brave", "Strong"],
            stats: { str: 8, int: 4, dex: 5, vit: 7 },
            equipment: { mainHand: "Iron Sword", armor: "Leather Armor" }
        };
    }

    renderCharacter() {
        const char = this.state.currentCharacter;

        // Name & Title
        this.el.charName.textContent = char.name;
        this.el.charTitle.textContent = `Level ${char.level || 1} ${char.classId} (${char.race})`;

        // Portrait (fallback to placeholder)
        const portraitPath = `assets/portraits/${char.race}_${char.classId}.png`;
        this.el.charPortrait.src = portraitPath;
        this.el.charPortrait.onerror = () => {
            this.el.charPortrait.src = 'assets/counter_view.png'; // Fallback
        };

        // Traits
        this.el.charTraits.innerHTML = '';
        if (char.traits && char.traits.length > 0) {
            char.traits.forEach(trait => {
                const pill = document.createElement('span');
                pill.className = 'trait-pill';
                pill.textContent = trait;
                this.el.charTraits.appendChild(pill);
            });
        }

        // Quote (generate simple one for now)
        this.el.charQuote.textContent = this.generateQuote(char);
    }

    generateQuote(char) {
        const quotes = [
            "I need gold, fast.",
            "This better be worth my time.",
            "Point me to the work.",
            "I've seen worse odds.",
            "Let's get this over with."
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // ========================================
    // QUEST LOADING
    // ========================================

    loadQuests() {
        // Use existing quest data
        if (window.GameData && window.GameData.quests) {
            const allQuests = window.GameData.quests;
            const numQuests = 3 + Math.floor(Math.random() * 4); // 3-6 quests
            this.state.quests = this.shuffleArray([...allQuests]).slice(0, numQuests);
        } else {
            console.warn('⚠️ Quest data not found, using fallback');
            this.state.quests = this.createFallbackQuests();
        }

        this.renderQuests();
    }

    createFallbackQuests() {
        return [
            { title: "Goblin Camp", req: "STR", gold: 60, description: "Heavy fighting expected." },
            { title: "Rats in Cellar", req: "DEX", gold: 40, description: "Quick job, easy money." },
            { title: "Escort Merchant", req: "VIT", gold: 80, description: "Keep the merchant safe." }
        ];
    }

    renderQuests() {
        this.el.contractsGrid.innerHTML = '';

        this.state.quests.forEach((quest, index) => {
            const card = document.createElement('div');
            card.className = 'quest-card';
            card.dataset.questIndex = index;

            card.innerHTML = `
                <div class="quest-info">
                    <div class="quest-title">${quest.title || quest.name}</div>
                    <div class="quest-req">Req: ${quest.req || quest.difficulty || 'STR'}</div>
                </div>
                <div class="quest-reward">${quest.gold || quest.reward || 50} G</div>
            `;

            card.addEventListener('click', () => this.openContractDetail(quest));

            this.el.contractsGrid.appendChild(card);
        });
    }

    // ========================================
    // ACTIONS
    // ========================================

    handleHire() {
        console.log('💼 Hiring:', this.state.currentCharacter.name);

        // Add to roster
        this.state.roster.push(this.state.currentCharacter);

        // Deduct gold
        this.state.gold -= 100;
        this.updateGoldDisplay();

        // Load next character
        this.loadNewCharacter();

        // Show feedback (future: add toast notification)
        console.log('✅ Recruited!');
    }

    handleDismiss() {
        console.log('❌ Dismissing:', this.state.currentCharacter.name);

        // Load next character
        this.loadNewCharacter();
    }

    handleEndDay() {
        console.log('🌙 Ending Day', this.state.day);

        // Future: Process quests, show results
        this.state.day++;

        // Reload everything for next day
        this.loadNewCharacter();
        this.loadQuests();
    }

    // ========================================
    // OVERLAYS
    // ========================================

    openDossier() {
        const char = this.state.currentCharacter;

        // Populate dossier
        document.getElementById('dossier-name').textContent = char.name;
        document.getElementById('dossier-subtitle').textContent =
            `Level ${char.level || 1} ${char.classId} (${char.race})`;

        // Origin
        document.getElementById('dossier-origin').textContent =
            this.generateOrigin(char);

        // Attributes
        const attrList = document.getElementById('dossier-attributes');
        attrList.innerHTML = `
            <li>Strength: ${char.stats.str}</li>
            <li>Intellect: ${char.stats.int}</li>
            <li>Dexterity: ${char.stats.dex}</li>
            <li>Vitality: ${char.stats.vit}</li>
        `;

        // Equipment
        const equipList = document.getElementById('dossier-equipment');
        equipList.innerHTML = `
            <li>Main: ${char.equipment.mainHand || 'None'}</li>
            <li>Armor: ${char.equipment.armor || 'None'}</li>
        `;

        // Show overlay
        this.el.overlayDossier.classList.remove('hidden');
    }

    generateOrigin(char) {
        const origins = {
            warrior: "Trained in the art of combat from a young age.",
            mage: "Studied at the arcane academy before seeking fortune.",
            rogue: "Survived the streets through cunning and agility.",
            cleric: "Devoted to helping others and spreading faith."
        };
        return origins[char.classId] || "A mysterious past shrouds this adventurer.";
    }

    openContractDetail(quest) {
        document.getElementById('contract-title').textContent = quest.title || quest.name;
        document.getElementById('contract-flavor').textContent =
            quest.description || "A dangerous task awaits.";
        document.getElementById('contract-req').textContent = quest.req || 'STR';
        document.getElementById('contract-reward').textContent =
            `${quest.gold || quest.reward} G`;

        document.getElementById('overlay-contract').classList.remove('hidden');
    }

    openRoster() {
        console.log('📋 Opening Roster:', this.state.roster);
        // Future: Implement roster view
        alert('Roster: ' + this.state.roster.length + ' members');
    }

    // ========================================
    // UTILITIES
    // ========================================

    updateGoldDisplay() {
        this.el.goldValue.textContent = this.state.gold;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// ================================================
// INITIALIZE
// ================================================

window.addEventListener('DOMContentLoaded', () => {
    window.mobileApp = new MobileApp();
});
