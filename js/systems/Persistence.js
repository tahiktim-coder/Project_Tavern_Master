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

    addToRoster(adventurer) {
        if (!adventurer) return;
        if (!adventurer.id) adventurer.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const data = this._createData(adventurer);
        this.roster.set(data.id, data);
        console.log(`Added to Roster: ${data.name} (Total: ${this.roster.size})`);
    }

    _createData(adventurer) {
        return {
            id: adventurer.id,
            name: adventurer.name,
            classId: adventurer.classId,
            race: adventurer.race || 'human',
            stats: { ...adventurer.stats },
            traits: [...adventurer.traits],
            visuals: adventurer.visuals ? [...adventurer.visuals] : [],
            history: adventurer.history || [],
            isGuildMember: adventurer.isGuildMember || false,
            injuries: adventurer.injuries || []
        };
    }

    saveAdventurer(adventurer, report) {
        if (!adventurer || !adventurer.id) return;

        // Get existing logic or create new
        let data = this.roster.get(adventurer.id);
        if (!data) {
            data = this._createData(adventurer);
        } else {
            // Sync stats/traits
            data.stats = { ...adventurer.stats };
            data.traits = [...adventurer.traits];
            data.isGuildMember = adventurer.isGuildMember;
            data.injuries = adventurer.injuries || [];
        }

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

    setAssigned(id, status) {
        const data = this.roster.get(id);
        if (data) data.isAssigned = status;
    }

    resetDailyState() {
        this.roster.forEach(member => {
            member.isAssigned = false;
        });
        console.log("Daily Roster State Reset (isAssigned = false)");
    }

    getReturningAdventurer() {
        if (this.roster.size === 0) return null;

        // Filter: Must be alive and NOT assigned
        const candidates = Array.from(this.roster.values()).filter(m => !m.isDead && !m.isAssigned);

        if (candidates.length === 0) return null;

        const data = candidates[Math.floor(Math.random() * candidates.length)];
        return data;
    }
}

window.GameSystems.PersistenceManager = PersistenceManager;
