/**
 * PERSISTENCE SYSTEM
 * Handles the saving and retrieving of adventurers to simulate a living world.
 */

window.GameSystems = window.GameSystems || {};

class PersistenceManager {
    constructor() {
        this.roster = new Map(); // key: id, value: adventurerData
        this.maxHistory = 50;
    }

    saveAdventurer(adventurer, report) {
        if (!adventurer || !adventurer.id) return;

        // Clone data to avoid reference issues
        const data = {
            id: adventurer.id,
            name: adventurer.name,
            classId: adventurer.classId,
            stats: { ...adventurer.stats },
            traits: [...adventurer.traits],
            history: adventurer.history || []
        };

        // Update based on Result
        data.history.push({
            day: window.gameState ? window.gameState.day : 0, // Hacky access to global day
            quest: report.questTitle,
            result: report.result
        });

        // apply CONSEQUENCES
        if (report.result === "FAILURE") {
            // Chance to gain a negative trait or injury
            if (Math.random() > 0.5) {
                // Add a visual scar/trait
                if (!data.traits.includes("Injured")) {
                    data.traits.push("Injured");
                    // Assuming Adventurer.js will map "Injured" to "bandaged" eventually
                    // Or we manually add visual tags here if we store visuals?
                    // Better to rely on traits regenerating visuals on load.

                    // Decrease stats
                    data.stats.str = Math.max(1, data.stats.str - 2);
                    data.stats.dex = Math.max(1, data.stats.dex - 2);
                    data.stats.currentHp = Math.floor(data.stats.maxHp / 2) || 5; // Start half health next time
                }
            } else {
                if (!data.traits.includes("Cowardly")) {
                    data.traits.push("Cowardly"); // Traumatized
                }
            }
        } else if (report.result === "SUCCESS") {
            // Chance to gain stats
            if (Math.random() > 0.7) {
                data.stats.str += 1;
                // Maybe become Arrogant?
                if (!data.traits.includes("Arrogant") && Math.random() > 0.8) {
                    data.traits.push("Arrogant");
                }
            }
        }

        this.roster.set(data.id, data);

        // Prune if too big (keep recent ones)
        if (this.roster.size > this.maxHistory) {
            const firstKey = this.roster.keys().next().value;
            this.roster.delete(firstKey);
        }

        console.log(`Saved Adventurer: ${data.name} (Roster Size: ${this.roster.size})`);
    }

    getReturningAdventurer() {
        if (this.roster.size === 0) return null;

        // 30% chance to return someone? OR logic handled by caller?
        // Let's just return a random one if asked.
        const keys = Array.from(this.roster.keys());
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const data = this.roster.get(randomKey);

        // Don't return if they "Died" (we haven't implemented death yet, but if HP <= 0?)
        if (data.stats.currentHp <= 0) return null; // Assume dead

        return data; // Return the raw data to be fed into Adventurer constructor
    }
}

window.GameSystems.PersistenceManager = PersistenceManager;
