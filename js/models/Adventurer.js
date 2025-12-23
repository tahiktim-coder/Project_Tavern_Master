/**
 * ADVENTURER MODEL
 * Represents a single hero applicant.
 * Using Global Namespace Pattern.
 */

window.GameSystems = window.GameSystems || {};

class Adventurer {
    constructor(data) {
        this.id = data.id || (Date.now() + Math.random().toString(16).slice(2));
        this.name = data.name;
        this.classId = data.classId;
        this.race = data.race || 'human'; // NEW: Store race for portraits

        // HIDDEN STATS (Player cannot see these directly)
        // HIDDEN STATS (Player cannot see these directly)
        this.stats = data.stats || { str: 5, dex: 5, int: 5, wis: 5, cha: 5, vit: 5 };
        this.traits = data.traits || [];

        // NEW: Injury & Death System
        this.injuries = data.injuries || []; // Array of injury objects
        this.isDead = false; // Death flag

        // NEW: Guild Member System
        this.isGuildMember = data.isGuildMember || false;
        this.isCrownRecruit = data.isCrownRecruit || false;
        this.record = data.record || null; // Tracked stats for guild members

        // NEW: Quest History (Detailed service record)
        this.questHistory = data.questHistory || {
            total: 0,
            S: 0, A: 0, B: 0, C: 0, D: 0
        };

        // NEW: Leveling System
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.xpToNextLevel = data.xpToNextLevel || 100;
        // Hidden Potential: 0.8 to 1.2 multiplier for stat growth.
        // If loading data, keep it. If new, generate it.
        this.potential = data.potential || (0.8 + Math.random() * 0.4);

        // VISUAL TAGS (Player SAYS these)
        // Derived from stats + random traits
        this.visuals = [];
        this.generateVisuals();

        // State
        this.isAssigned = false;
        this.currentQuest = null;
    }

    generateVisuals() {
        this.visuals = [];

        // 1. STAT-BASED VISUALS (The "Truth")
        if (this.stats.str >= 8) this.visuals.push("muscles");
        if (this.stats.str < 4) this.visuals.push("scrawny");

        if (this.stats.dex >= 8) this.visuals.push("agile_stance");
        if (this.stats.dex < 4) this.visuals.push("clumsy_posture");

        if (this.stats.vit < 5) this.visuals.push("sickly");

        // 2. TRAIT-BASED VISUALS (The "Clues")
        // Mapping Traits (from adventurerData) to Visual Tells (from mechanics_inspection)

        // Cowardly -> Shaking
        if (this.traits.includes("Cowardly") || this.traits.includes("Nervous")) {
            this.visuals.push("shaking");
        }

        // Greedy/Rich -> Jewelry
        if (this.traits.includes("Greedy") || this.traits.includes("Noble")) {
            this.visuals.push("jewelry");
        }

        // Rookie -> New Armor
        if (this.classId === "squire" || this.traits.includes("Naive")) {
            this.visuals.push("pristine_armor");
        }

        // Poor/Lazy -> Rusty Gear
        if (this.traits.includes("Lazy") || this.traits.includes("Poor")) {
            this.visuals.push("rusty_gear");
        }

        // Magical/Possessed -> Glowing Eyes
        if (this.traits.includes("Possessed") || (this.stats.int > 9)) {
            this.visuals.push("glowing_eyes");
        }

        // Injured -> Bandages
        if (this.stats.currentHp < this.stats.maxHp) {
            this.visuals.push("bandaged");
        }

        // Add a random generic visual if empty, just for flavor
        if (this.visuals.length === 0) {
            this.visuals.push("determined_look");
        }
    }

    gainXp(amount) {
        this.xp += amount;
        let leveledUp = false;
        // Cap level at 20 prevents infinite loops or absurdity
        while (this.xp >= this.xpToNextLevel && this.level < 20) {
            this.xp -= this.xpToNextLevel;
            this.levelUp();
            leveledUp = true;
        }
        return leveledUp;
    }

    levelUp() {
        this.level++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);

        // Stat Growth Logic
        const mult = this.potential || 1.0;
        const growth = { str: 0, dex: 0, int: 0, wis: 0, cha: 0, vit: 0 };

        // Define Class Focus
        switch (this.classId) {
            case 'Warrior': growth.str = 2; growth.vit = 2; break;
            case 'Mage': growth.int = 2; growth.wis = 2; break;
            case 'Rogue': growth.dex = 2; growth.cha = 1; break;
            case 'Cleric': growth.wis = 2; growth.cha = 2; break;
            case 'Ranger': growth.dex = 2; growth.vit = 1; break;
            case 'Paladin': growth.str = 1; growth.wis = 2; break;
            default: // Random spread for unknown classes
                growth.str = 1; growth.dex = 1; growth.int = 1;
        }

        // Apply Growth
        for (const stat in growth) {
            if (growth[stat] > 0) {
                // Formula: Base * Potential * Variance
                const val = growth[stat] * mult * (0.5 + Math.random());
                this.stats[stat] = (this.stats[stat] || 0) + Math.max(1, Math.floor(val));
            } else {
                // Small chance for off-stat growth
                if (Math.random() < 0.15 * mult) {
                    this.stats[stat] = (this.stats[stat] || 0) + 1;
                }
            }
        }
        console.log(`${this.name} leveled up to ${this.level}!`);
    }
}

window.GameSystems.Adventurer = Adventurer;
