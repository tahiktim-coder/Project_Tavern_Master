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

        // NEW: Level & XP
        descriptions.push(`Level: ${adventurer.level || 1}`);
        descriptions.push(`XP: ${adventurer.xp || 0} / ${adventurer.xpToNextLevel || 100}`);
        descriptions.push("----------------");

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

    // Display adventurer details via modal UI (not alert!)
    show(adventurer) {
        const data = this.inspect(adventurer);
        if (!data) {
            console.warn("No adventurer to inspect!");
            return;
        }

        // Format the details for display
        const message = `=== ${data.name} ===\n\n${data.details.join('\n')}`;

        // Display in modal instead of alert
        const modal = document.getElementById('inspector-modal');
        const content = document.getElementById('inspector-content');
        const closeBtn = document.getElementById('btn-close-inspector');

        if (!modal || !content) {
            // Fallback to alert if modal doesn't exist
            alert(message);
            return;
        }

        content.textContent = message;
        modal.classList.remove('hidden');

        // Close button handler
        closeBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }
}

window.GameSystems.Inspector = Inspector;
