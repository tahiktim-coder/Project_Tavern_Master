/**
 * VISITOR SYSTEM
 * Manages morning visitor events that appear before adventurer recruitment
 */

window.GameSystems = window.GameSystems || {};

class VisitorSystem {
    constructor() {
        this.visitedToday = false;
    }

    // Check if a visitor should appear on this day
    checkForVisitor(day) {
        console.log(`Visitor: Checking for visitor on Day ${day}...`);

        // Guard appears on Day 2
        if (day === 2) {
            console.log("Visitor: Guard will visit today.");
            return window.VisitorData.GUARD;
        }

        // Future: Add random visitor logic here
        // const randomChance = Math.random();
        // if (randomChance < 0.3) { return randomVisitor(); }

        console.log("Visitor: No visitor today.");
        return null;
    }

    // Apply the effects of a visitor choice
    applyChoice(choice, gameState) {
        console.log(`Visitor: Applying choice: ${choice.text}`);

        // Deduct cost
        if (choice.cost > 0) {
            if (gameState.economy.gold < choice.cost) {
                console.error("Visitor: Not enough gold for this choice!");
                return false;
            }
            gameState.economy.gold -= choice.cost;
            console.log(`Visitor: Paid ${choice.cost}G. New balance: ${gameState.economy.gold}G`);
        }

        // Apply effects
        switch (choice.effect) {
            case "crown_rep":
                gameState.crownReputation = (gameState.crownReputation || 0) + choice.value;
                console.log(`Visitor: Crown Reputation changed by ${choice.value}. New: ${gameState.crownReputation}`);
                break;
            case "town_rep":
                gameState.townReputation = (gameState.townReputation || 0) + choice.value;
                console.log(`Visitor: Town Reputation changed by ${choice.value}. New: ${gameState.townReputation}`);
                break;
            // Add more effect types as needed
        }

        return true;
    }

    // Reset daily flag
    resetDaily() {
        this.visitedToday = false;
    }
}

window.GameSystems.VisitorSystem = VisitorSystem;
