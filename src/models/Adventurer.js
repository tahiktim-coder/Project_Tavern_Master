export class Adventurer {
    constructor(data) {
        this.id = data.id || "adv_" + Math.floor(Math.random() * 1000000);
        this.name = data.name;
        this.archetype = data.archetype; // "MARTIAL", "ARCANE", etc
        this.classId = data.classId;     // "knight", "rogue"
        this.visualClass = data.visualClass || data.classId; // Fallback to classId if not mapped

        // Stats (The Hidden Variables)
        this.stats = {
            str: data.stats.str,
            dex: data.stats.dex,
            int: data.stats.int,
            vit: data.stats.vit,
            currentHp: data.stats.vit * 10,
            maxHp: data.stats.vit * 10
        };

        // Traits (Visual & Hidden)
        this.traits = data.traits || [];
        this.hiddenTraits = data.hiddenTraits || [];

        // Inventory
        this.equipment = {
            mainHand: data.equipment?.mainHand || null,
            offHand: data.equipment?.offHand || null,
            armor: data.equipment?.armor || null
        };

        // State
        this.status = "IDLE"; // IDLE, ON_QUEST, INJURED, DEAD
        this.history = [];    // List of past quests events
    }

    get isAlive() {
        return this.stats.currentHp > 0;
    }

    takeDamage(amount) {
        this.stats.currentHp = Math.max(0, this.stats.currentHp - amount);
        if (!this.isAlive) {
            this.status = "DEAD";
        }
    }

    heal(amount) {
        if (this.status === "DEAD") return;
        this.stats.currentHp = Math.min(this.stats.maxHp, this.stats.currentHp + amount);
    }

    // Example of a "Check"
    checkStat(statName, difficulty) {
        // Basic check: Stat vs Difficulty
        // Can be expanded with Traits logic
        const roll = Math.random() * 20; // d20
        const statValue = this.stats[statName] || 0;
        return (roll + statValue) >= difficulty;
    }
}
