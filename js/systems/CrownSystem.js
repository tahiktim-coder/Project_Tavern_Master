/**
 * CROWN SYSTEM
 * Handles the 7-day visitation cycle of the Royal Messenger.
 * Manages Reputation and assigns/evaluates Mandatory Quests.
 */

window.GameSystems = window.GameSystems || {};

class CrownSystem {
    constructor() {
        this.nextVisitDay = 7;
    }

    /**
     * Checks if the Messenger should appear today.
     * Called at the start of a New Day.
     * @param {Object} gameState 
     * @returns {Object|null} Event details if visit triggers, else null
     */
    checkDaily(gameState) {
        if (!gameState.crown) return null;

        // VISITATION DAY
        if (gameState.day === gameState.crown.nextVisitDay) {
            return this.handleVisit(gameState);
        }

        // CHECK DEADLINE (If active quest expired)
        if (gameState.crown.activeQuest) {
            const q = gameState.crown.activeQuest;
            if (q.deadlineDay && gameState.day > q.deadlineDay) {
                // Failed by Time
                return {
                    type: "CROWN_FAILURE",
                    reason: "Time Expired",
                    penalty: 10 // Reputation Hit
                };
            }
        }

        return null;
    }

    handleVisit(gameState) {
        const events = [];
        const crown = gameState.crown;

        // 1. EVALUATE PREVIOUS QUEST
        if (crown.activeQuest) {
            const q = crown.activeQuest;
            let success = false;

            // Logic to check success based on Type
            if (q.type === 'TALENT_SCOUT') {
                // Check using derived stats from Roster (Safer)
                let currentProgress = q.progress || 0;
                if (q.targetRecruitId && gameState.persistence) {
                    const heroData = gameState.persistence.roster.get(q.targetRecruitId);
                    if (heroData && heroData.questHistory) {
                        currentProgress = heroData.questHistory.total || 0;
                    }
                }
                const targetNum = (q.target && q.target.requiredWins) ? q.target.requiredWins : 3;
                if (currentProgress >= targetNum) success = true;
            } else if (q.type === 'MANDATE') {
                if (q.status === 'COMPLETED') success = true;
            }

            if (success) {
                gameState.reputation = Math.min(100, gameState.reputation + 10);
                events.push({ type: 'EVALUATION', result: 'SUCCESS', msg: "The Crown is pleased." });
            } else {
                gameState.reputation = Math.max(0, gameState.reputation - 10);
                events.push({ type: 'EVALUATION', result: 'FAILURE', msg: "Disappointing." });
            }
            crown.activeQuest = null; // Clear old quest
        }

        // 2. ASSIGN NEW QUEST
        const newQuest = this.generateQuest(gameState);
        crown.activeQuest = newQuest;
        crown.nextVisitDay += 7; // Schedule next visit

        if (newQuest) {
            events.push({ type: 'ASSIGNMENT', quest: newQuest });
        }

        return {
            type: "MESSENGER_VISIT",
            events: events
        };
    }

    generateQuest(gameState) {
        // PERMANENTLY DISABLED (User Request: "Get rid of all crown related stuff")
        // We will rebuild this system ONLY during the Scripted Intro phase.
        return null;
    }
}

window.GameSystems.CrownSystem = CrownSystem;
