/**
 * EVENT SYSTEM
 * Handles random daily events that affect the guild.
 */

window.GameSystems = window.GameSystems || {};

class EventManager {
    constructor() {
        this.currentEvent = null;

        this.pool = [
            {
                id: 'donation',
                title: 'Grateful Villager',
                description: 'A villager saved by your guild left a donation.',
                type: 'GOOD',
                effect: (gameState) => {
                    const amount = 20;
                    if (gameState.economy) {
                        gameState.economy.addGold(amount);
                        return `Gained ${amount} Gold.`;
                    }
                    return null;
                }
            },
            {
                id: 'tax',
                title: 'Local Tax',
                description: 'The local lord collects taxes from the guild.',
                type: 'BAD',
                effect: (gameState) => {
                    const amount = 15;
                    if (gameState.economy) {
                        gameState.economy.spendGold(amount); // Might go negative? Economy allows it?
                        return `Lost ${amount} Gold.`;
                    }
                    return null;
                }
            },
            {
                id: 'festival',
                title: 'Town Festival',
                description: 'The town is celebrating. Morale is high!',
                type: 'GOOD',
                effect: (gameState) => {
                    // Flavor only for now 
                    return "No special effect.";
                }
            },
            {
                id: 'storm',
                title: 'Heavy Rain',
                description: 'Muddy roads make travel difficult today.',
                type: 'BAD',
                effect: (gameState) => {
                    return "No special effect.";
                }
            },
            {
                id: 'merchant',
                title: 'Traveling Merchant',
                description: 'A merchant sets up a stall near the guild.',
                type: 'NEUTRAL',
                effect: (gameState) => {
                    return "Items available soon!";
                }
            }
        ];
    }

    rollEvent(gameState) {
        this.currentEvent = null;

        // Force Event for Debugging (User reported it not working)
        // if (Math.random() > 0.4) {
        //    return null;
        // }

        const template = this.pool[Math.floor(Math.random() * this.pool.length)];

        // Execute Effect immediately?
        // Or wait until Player accepts? 
        // For Ledger, we usually show what HAPPENED overnight.
        // So execute immediately.

        let resultParams = "";
        if (template.effect) {
            const res = template.effect(gameState);
            if (res) resultParams = res;
        }

        this.currentEvent = {
            ...template,
            resolvedResult: resultParams
        };

        return this.currentEvent;
    }
}

window.GameSystems.EventManager = EventManager;
