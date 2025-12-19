/**
 * RESOLUTION SYSTEM
 * Calculates the outcome of a quest assignment.
 * Using Global Namespace Pattern
 */

window.GameSystems = window.GameSystems || {};

class ResolutionManager {
    static resolve(quest, adventurer) {
        console.log(`resolving quest: ${quest.title} for ${adventurer.name}`);

        let log = [];
        let score = 0;
        let risk = 0;

        // 1. BASE STAT CHECK
        // Simple logic: Does the class match the quest type?
        // (Real logic would use hidden stats vs requirements, but we start simple)

        // Example: Monster Hunts leverage Strength & Vit
        if (quest.type === 'HUNT') {
            score += adventurer.stats.str * 2;
            score += adventurer.stats.vit;
            if (adventurer.classId.includes('knight') || adventurer.classId.includes('barbarian')) {
                score += 20; // Bonus for fighter classes
                log.push("Class Match: Fighter (+20)");
            }
        }
        // Example: Escorts leverage Charisma & Vit
        else if (quest.type === 'ESCORT') {
            score += (adventurer.stats.int || 5) * 2; // Using Int as proxy for 'smart handling' for now
            if (adventurer.classId.includes('paladin') || adventurer.classId.includes('cleric')) {
                score += 20;
                log.push("Class Match: Protector (+20)");
            }
        }

        // 2. CHECK VISUAL TRAITS
        // This is the core mechanic: The PLAYER should have seen these
        // TODO: Implement trait matching once traits are fully populated

        // 3. DETERMINE OUTCOME
        // Random variance
        let roll = Math.random() * 100;
        let total = score + roll;

        // Thresholds (Arbitrary for now)
        let result = "UNKNOWN";
        let flavorText = "";

        if (total > 150) {
            result = "SUCCESS";
            flavorText = "The guild cheers! The mission was a complete success.";
            // Calculate Reward (simple for now)
            adventurer.economyRef.addGold(50);
        } else if (total > 80) {
            result = "MIXED";
            flavorText = "They returned, but barely. Some gold was lost.";
            adventurer.economyRef.addGold(10);
        } else {
            result = "FAILURE";
            flavorText = "Disaster. The quest failed miserably.";
            // No reward
        }

        // 3.5 PERSISTENCE SAVE
        // If the system exists, save this adventurer's state
        if (window.gameState && window.gameState.persistence) {
            window.gameState.persistence.saveAdventurer(adventurer, {
                questTitle: quest.title,
                result: result
            });
        }

        // 4. RETURN RESULT (No Alert)
        // usage: gameState.activeReport = result;
        return {
            result,
            score,
            log,
            questTitle: quest.title,
            adventurerName: adventurer.name,
            flavorText
        };
    }
}

window.GameSystems.ResolutionManager = ResolutionManager;
