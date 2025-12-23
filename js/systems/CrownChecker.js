/**
 * CROWN CHECKER SYSTEM
 * Handles validation and completion logic for Crown Quests.
 * Separated from Resolution.js for clarity and robustness.
 * 
 * RESPONSIBILITIES:
 * 1. Validate if a completed quest matches the active Crown Quest.
 * 2. Update the status/progress of the Crown Quest.
 * 3. Save changes to persistence.
 */

window.GameSystems = window.GameSystems || {};

class CrownChecker {

    /**
     * Main entry point to check if the active Crown Quest should progress/complete.
     * @param {Object} gameState - The global game state
     * @param {Object} quest - The quest that was just completed
     * @param {Object} adventurer - The adventurer who completed it
     * @param {String} result - 'SUCCESS', 'MIXED', or 'FAILURE'
     */
    static check(gameState, quest, adventurer, result) {
        // Safety Checks
        if (!gameState || !gameState.crown || !gameState.crown.activeQuest) return;

        const cQuest = gameState.crown.activeQuest;

        // Ignore if already completed or failed
        if (cQuest.status === 'COMPLETED' || cQuest.status === 'FAILED') return;

        console.log("CrownChecker: Evaluating Quest for Crown Progress...", cQuest.type);

        if (cQuest.type === 'TALENT_SCOUT') {
            this.checkTalentScout(gameState, cQuest, adventurer, result);
        }
    }

    /**
     * TALENT SCOUT LOGIC:
     * - Requires specific recruit (or any Crown Recruit fallback) to complete 3 quests.
     */
    static checkTalentScout(gameState, cQuest, adventurer, result) {
        // REQUIREMENT: Must be a pass
        if (result !== 'SUCCESS' && result !== 'MIXED') return;

        let shouldIncrement = false;

        // Case: Relaxed Matching (Any Crown Recruit counts)
        // This solves "only counts for one adventurer" confusion.
        // It also ensures simpler progression.
        if (adventurer.isCrownRecruit) {
            shouldIncrement = true;
        }

        if (shouldIncrement) {
            // Update Progress
            // We increment the quest's internal progress counter
            let currentProgress = (cQuest.progress || 0) + 1;
            cQuest.progress = currentProgress;

            console.log(`CrownChecker: Talent Scout Progress ${currentProgress}/3`);

            if (currentProgress >= 3) {
                cQuest.status = 'COMPLETED';
                window.alert("SYSTEM: Crown Talent Scout Mission COMPLETED!");
            }

            // Force Save Global State
            if (gameState.persistence) {
                gameState.persistence.saveGlobal(gameState);
            }
        }
    }
}

// Expose to Global Scope
window.GameSystems.CrownChecker = CrownChecker;
