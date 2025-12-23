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

        if (cQuest.type === 'MANDATE') {
            this.checkMandate(gameState, cQuest, quest, result);
        } else if (cQuest.type === 'TALENT_SCOUT') {
            this.checkTalentScout(gameState, cQuest, adventurer, result);
        }
    }

    /**
     * MANDATE LOGIC:
     * - Requires ANY hero to complete the specific quest.
     * - Completion = Quest Done (Success or Mixed covers it).
     */
    static checkMandate(gameState, cQuest, quest, result) {
        // REQUIREMENT: Must be a pass (Success or Mixed)
        if (result !== 'SUCCESS' && result !== 'MIXED') return;

        // OMNI-MATCHING LOGIC (To handle potential reference/ID mismatches)
        // 1. Reference Match (Are they the same object in memory?)
        const isRefMatch = (quest === cQuest);

        // 2. ID Match (Loose String comparison)
        const isIdMatch = (String(quest.id) === String(cQuest.id));

        // 3. Title Match (Normalized: trimmed, lowercase)
        const qTitle = (quest.title || "").trim().toLowerCase();
        const cTitle = (cQuest.title || "").trim().toLowerCase();
        // Ensure title is not empty string match
        const isTitleMatch = (qTitle === cTitle && qTitle.length > 0);

        // 4. Type Match (Is the completed quest explicitly tagged as 'MANDATE'?)
        const isTypeMatch = (quest.type === 'MANDATE');

        console.log(`CrownChecker: Mandate Check. Ref=${isRefMatch}, ID=${isIdMatch}, Title=${isTitleMatch}, Type=${isTypeMatch}`);

        // If ANY of these match, we assume it's the intended quest.
        // (Mandates are unique, so risk of false positive is near zero).
        if (isRefMatch || isIdMatch || isTitleMatch || isTypeMatch) {
            cQuest.status = 'COMPLETED';
            console.log("CrownChecker: Mandate COMPLETED.");

            // Visual Feedback for User (Debugging/Confirmation)
            const matchedBy = [
                isRefMatch ? 'REF' : null,
                isIdMatch ? 'ID' : null,
                isTitleMatch ? 'TITLE' : null,
                isTypeMatch ? 'TYPE' : null
            ].filter(Boolean).join(',');

            window.alert(`SYSTEM: Crown Mandate Verified & Completed!\n(Matched by: ${matchedBy})`);

            // Force Save Global State
            if (gameState.persistence) {
                gameState.persistence.saveGlobal(gameState);
            }
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

        // Case A: ID Tracking (Best) - Matches the specific hero recruited for this task
        if (cQuest.targetRecruitId) {
            if (adventurer.id === cQuest.targetRecruitId) {
                shouldIncrement = true;
            }
        }
        // Case B: Tag Tracking (Fallback) - Any hero tagged as a 'Crown Recruit'
        else if (adventurer.isCrownRecruit) {
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
