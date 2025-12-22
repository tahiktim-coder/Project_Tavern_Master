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

        events.push({ type: 'ASSIGNMENT', quest: newQuest });

        return {
            type: "MESSENGER_VISIT",
            events: events
        };
    }

    generateQuest(gameState) {
        // FIRST VISIT: TALENT SCOUT
        // If Roster is small (e.g. < 3) or it's early Game
        // Logic: specific override for first time? 
        // User requested: "First quest would be 1 new member"

        // Let's implement randomness later. For now, strict sequence or random.
        // We'll use a simple flag or check turn count.

        if (gameState.day <= 7) {
            return {
                id: `crown_${gameState.day}_talent`,
                type: 'TALENT_SCOUT',
                title: "Royal Decree: Expansion",
                description: "The town is in dire need of permanent protectors. Recruit a new Guild Member and ensure they survive 3 quests.",
                rank: 'B',
                target: { requiredWins: 3 },
                progress: 0,
                deadlineDay: gameState.day + 7,
                isCrownQuest: true
            };
        } else {
            // STANDARD MANDATE (Placeholder for regular high-dif quest)
            return {
                id: `crown_${gameState.day}_mandate`,
                type: 'MANDATE',
                title: "Royal Mandate: Beast Hunt",
                description: "A dangerous beast threatens the trade routes. Eradicate it.",
                rank: 'A',
                target: { type: 'HUNT' },
                status: 'PENDING',
                deadlineDay: gameState.day + 7,
                isCrownQuest: true
            };
        }
    }
}

window.GameSystems.CrownSystem = CrownSystem;
