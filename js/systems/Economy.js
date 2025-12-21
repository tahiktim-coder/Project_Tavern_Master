/**
 * ECONOMY SYSTEM
 * Tracks Gold, Reputation, and Daily Expenses.
 * Using Global Namespace Pattern
 */

window.GameSystems = window.GameSystems || {};

class EconomyManager {
    constructor(initialGold = 50) {
        this.gold = initialGold;
        this.reputation = 10;
        this.dailyExpense = 20; // Rent/Upkeep
    }

    addGold(amount) {
        this.gold += amount;
        console.log(`Gold changed by ${amount}. Total: ${this.gold}`);
    }

    processDailyUpkeep() {
        this.gold -= this.dailyExpense;
        console.log(`Paid daily upkeep: ${this.dailyExpense}`);
        return {
            paid: this.dailyExpense,
            bankrupt: this.gold < 0
        };
    }
}

window.GameSystems.EconomyManager = EconomyManager;
