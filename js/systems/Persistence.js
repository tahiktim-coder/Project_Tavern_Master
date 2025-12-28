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

    removeFromRoster(id) {
        if (this.roster.has(id)) {
            const name = this.roster.get(id).name;
            this.roster.delete(id);
            console.log(`[Persistence] Fired/Removed: ${name} (ID: ${id})`);
            return true;
        }
        return false;
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
            questHistory: adventurer.questHistory || { total: 0, S: 0, A: 0, B: 0, C: 0, D: 0 },
            isGuildMember: adventurer.isGuildMember || false,
            isCrownRecruit: adventurer.isCrownRecruit || false,
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
            data.isCrownRecruit = adventurer.isCrownRecruit;
            data.injuries = adventurer.injuries || [];
            data.questHistory = adventurer.questHistory || data.questHistory;
        }

        // Update based on Result
        data.history.push({
            day: window.gameState ? window.gameState.day : 0, // Hacky access to global day
            quest: report.questTitle,
            result: report.result
        });

        // CONSEQUENCES are now handled by ResolutionManager.js before calling this.
        // We only save the updated state here.

        // Ensure traits/stats are saved
        if (!data.traits) data.traits = [];
        if (!data.injuries) data.injuries = [];

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
        if (data) {
            data.isAssigned = status;
            this.roster.set(id, data); // Explicitly ensure map is updated
            console.log(`Persistence: Set Assigned ${status} for ${data.name} (ID: ${id})`);
        } else {
            console.warn(`Persistence: Could not find member ${id} to assign.`);
        }
    }

    resetDailyState() {
        this.roster.forEach(adv => {
            // CRITICAL FIX: Clear quest assignment so guild members become available again
            adv.isAssigned = false;
            adv.assignedQuest = null;
            adv.currentQuest = null;

            // Healing Logic
            if (adv.injuries && adv.injuries.length > 0) {
                adv.injuries.forEach(inj => {
                    // Only heal temporary injuries
                    if (inj.duration !== undefined && inj.duration > 0) inj.duration--;
                });
                // Remove healed injuries (duration 0). Keep permanent (-1).
                adv.injuries = adv.injuries.filter(inj => inj.duration !== 0);

                if (adv.injuries.length === 0) adv.traits = adv.traits.filter(t => t !== 'Injured');
            }
        });
        console.log("Persistence: Daily Roster Reset (Quests cleared, Healing Applied, Perm Injuries Kept)");
    }

    getReturningAdventurer() {
        // Filter: Not Dead, Not Assigned, Not Injured, Not Seen Today
        const currentDay = window.gameState ? window.gameState.day : 0;
        const candidates = Array.from(this.roster.values()).filter(m =>
            !m.isDead &&
            !m.isAssigned &&
            (!m.injuries || m.injuries.length === 0) &&
            (m.lastSeenDay !== currentDay)
        );

        console.log(`Persistence: Found ${candidates.length} candidates for return.`);

        if (candidates.length === 0) return null;

        const idx = Math.floor(Math.random() * candidates.length);
        const data = candidates[idx];
        return data; // Returns DATA object.
    }

    // --- GLOBAL SAVE/LOAD (New) ---
    saveGlobal(gameState) {
        if (!gameState) return;
        const data = {
            day: gameState.day,
            gold: gameState.economy ? gameState.economy.gold : 0,
            reputation: gameState.reputation,
            crown: gameState.crown,
            roster: Array.from(this.roster.entries())
        };
        localStorage.setItem('tavernMasterSave', JSON.stringify(data));
        console.log("Game Saved to LocalStorage");
    }

    loadGlobal() {
        const raw = localStorage.getItem('tavernMasterSave');
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            // Restore Roster Map
            if (data.roster) {
                this.roster = new Map(data.roster);
            }
            return data;
        } catch (e) {
            console.error("Failed to load save:", e);
            return null;
        }
    }
}

window.GameSystems.PersistenceManager = PersistenceManager;
