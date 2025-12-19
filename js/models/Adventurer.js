/**
 * ADVENTURER MODEL
 * Represents a single hero applicant.
 * Using Global Namespace Pattern.
 */

window.GameSystems = window.GameSystems || {};

class Adventurer {
    constructor(data) {
        this.id = Date.now() + Math.random().toString(16).slice(2);
        this.name = data.name;
        this.classId = data.classId;

        // HIDDEN STATS (Player cannot see these directly)
        // HIDDEN STATS (Player cannot see these directly)
        this.stats = data.stats || { str: 5, dex: 5, int: 5, wis: 5, cha: 5, vit: 5 };
        this.traits = data.traits || [];

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
            this.visuals.push("neutral");
        }
    }
}

window.GameSystems.Adventurer = Adventurer;
