/**
 * INSPECTOR SYSTEM
 * Handles the logic of examining an adventurer.
 */

window.GameSystems = window.GameSystems || {};

class Inspector {
    constructor() {
        // No state needed really, just pure logic? 
        // Or maybe we track what has been "revealed" if we want progressive discovery.
    }

    inspect(adventurer) {
        if (!adventurer) return null;

        const visuals = adventurer.visuals;
        const descriptions = [];

        visuals.forEach(tag => {
            const text = window.GameData.VisualTraits[tag];
            if (text) {
                descriptions.push(text);
            }
        });

        if (descriptions.length === 0) {
            descriptions.push("Nothing remarkable stands out.");
        }

        // Add Quest History
        if (adventurer.questHistory) {
            descriptions.push("--- SERVICE RECORD ---");
            descriptions.push(`Total Missions: ${adventurer.questHistory.total}`);
            if (adventurer.questHistory.byRank) {
                const r = adventurer.questHistory.byRank;
                if (r.S > 0) descriptions.push(`Rank S: ${r.S}`);
                if (r.A > 0) descriptions.push(`Rank A: ${r.A}`);
                if (r.B > 0) descriptions.push(`Rank B: ${r.B}`);
                if (r.C > 0) descriptions.push(`Rank C: ${r.C}`);
                if (r.D > 0) descriptions.push(`Rank D: ${r.D}`);
            }
        }

        return {
            name: adventurer.name,
            details: descriptions
        };
    }
}

window.GameSystems.Inspector = Inspector;
