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

        return {
            name: adventurer.name,
            details: descriptions
        };
    }
}

window.GameSystems.Inspector = Inspector;
