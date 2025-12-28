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

        // Get GUILD MEMBERS who are Ready (not injured, not on quest, not dead)
        let guildMembers = [];
        if (window.gameState && window.gameState.persistence && window.gameState.persistence.roster) {
            guildMembers = Array.from(window.gameState.persistence.roster.values()).filter(member => {
                return !member.isDead &&
                    (!member.injuries || member.injuries.length === 0) &&
                    !member.assignedQuest;
            });

            // Mark them as guild members for UI
            guildMembers.forEach(m => m.isGuildMember = true);
            console.log(`Town: ${guildMembers.length} guild members available today.`);
        }

        // Reset Status & Filter Eligible TOWN POOL members
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

        // Shuffle eligible town pool
        for (let i = eligibleIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligibleIds[i], eligibleIds[j]] = [eligibleIds[j], eligibleIds[i]];
        }

        // Calculate how many town visitors to add (4-6 total visitors, including guild)
        const maxVisitors = Math.min(eligibleIds.length + guildMembers.length, 4 + Math.floor(Math.random() * 3));
        const townVisitorsNeeded = Math.max(0, maxVisitors - guildMembers.length);

        // Build queue: GUILD MEMBERS FIRST, then town pool
        this.dailyQueue = [
            ...guildMembers, // These are adventurer objects
            ...eligibleIds.slice(0, townVisitorsNeeded) // These are IDs referencing roster
        ];

        console.log(`Town: ${this.dailyQueue.length} visitors today (${guildMembers.length} guild, ${townVisitorsNeeded} town pool).`);
        return this.dailyQueue.length;
    }

    // Get the next person walking in the door
    getNextVisitor() {
        if (this.dailyQueue.length === 0) return null;

        const next = this.dailyQueue.shift(); // Take from front

        // If it's a guild member (object), return directly
        if (typeof next === 'object' && next.id) {
            return next;
        }

        // Otherwise it's an ID from town pool
        return this.roster.get(next);
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
