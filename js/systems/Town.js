/**
 * TOWN SYSTEM
 * Manages the pool of available adventurers in the town.
 * This replaces the infinite random generation with a persistent "Deck" of characters.
 */

window.GameSystems = window.GameSystems || {};

class TownManager {
    constructor() {
        this.roster = new Map(); // id -> Adventurer
        this.dailyQueue = [];    // Array of AdvIDs coming today
    }

    // Called at Start of Game (and maybe Start of Week)
    generateWeeklyPool(day) {
        this.roster.clear();
        console.log("Town: Generating new weekly pool...");

        // Generate 12-15 Locals
        const count = 12 + Math.floor(Math.random() * 4);

        // Resolve Generator
        const Generator = window.GameSystems.AdventurerGenerator || window.AdventurerGenerator || AdventurerGenerator;

        if (!Generator) {
            console.error("Town: Critical Error - AdventurerGenerator not found!");
            return;
        }

        for (let i = 0; i < count; i++) {
            const adv = Generator.generate(day);
            this.roster.set(adv.id, adv);
        }
        console.log(`Town: Generated ${this.roster.size} villagers.`);
    }

    // Called at Start of Each Day
    generateDailyQueue() {
        // Safety: If pool is empty (e.g. loaded save mid-week), generate it
        if (this.roster.size === 0) {
            console.warn("Town: Roster empty. Generating Emergency Pool.");
            this.generateWeeklyPool(1);
        }

        // Reset Status & Filter Eligible
        const eligibleIds = [];
        const deadIds = [];

        for (const [id, adv] of this.roster.entries()) {
            adv.isAssigned = false; // Reset daily status

            if (adv.isDead) {
                deadIds.push(id);
                continue;
            }

            // Injury Check: If injured, they stay home to recover
            if (adv.injuries && adv.injuries.length > 0) {
                console.log(`Town: ${adv.name} is recovering and will not visit today.`);
                continue;
            }

            eligibleIds.push(id);
        }

        // Cleanup Dead
        deadIds.forEach(id => {
            this.roster.delete(id);
            console.log(`Town: Removed dead adventurer ${id} from pool.`);
        });

        this.dailyQueue = [];

        // Shuffle eligible
        for (let i = eligibleIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligibleIds[i], eligibleIds[j]] = [eligibleIds[j], eligibleIds[i]];
        }

        // Pick 4-6 to visit today
        const maxVisitors = Math.min(eligibleIds.length, 4 + Math.floor(Math.random() * 3));
        this.dailyQueue = eligibleIds.slice(0, maxVisitors);

        console.log(`Town: ${this.dailyQueue.length} adventurers visiting today.`);
        return this.dailyQueue.length;
    }

    // Get the next person walking in the door
    getNextVisitor() {
        if (this.dailyQueue.length === 0) return null;

        const id = this.dailyQueue.shift(); // Take from front
        return this.roster.get(id);
    }

    // Called when Hired (Remove from Town Roster)
    recruit(id) {
        if (this.roster.has(id)) {
            this.roster.delete(id);
            console.log(`Town: Member ${id} hired. Left town pool.`);
        }
    }

    // Called if they die or leave town
    remove(id) {
        this.roster.delete(id);
    }
}

window.GameSystems.TownManager = TownManager;
