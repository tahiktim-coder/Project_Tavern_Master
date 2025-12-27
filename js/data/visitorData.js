/**
 * VISITOR DATA
 * Definitions for all Morning Visitor events
 */

window.VisitorData = {
    GUARD: {
        id: "guard_bribe",
        name: "Royal Guard",
        title: "A Royal Guard blocks your entrance",
        dialogue: "A guard in royal livery stands at your door, hand outstretched.\n\n\"The Captain sent me. He's noticed... irregularities in your ledger. For a small donation, I could overlook them.\"",
        portrait: null, // TODO: Add portrait asset
        choices: [
            {
                text: "Pay Bribe (20 G)",
                cost: 20,
                effect: "crown_rep",
                value: 1,
                resultText: "The guard pockets the coins with a smirk. \"Pleasure doing business.\""
            },
            {
                text: "Refuse",
                cost: 0,
                effect: "crown_rep",
                value: -2,
                resultText: "The guard narrows his eyes. \"The Crown will remember this.\""
            }
        ],
        trigger: {
            type: "day", // Scripted trigger
            value: 2
        }
    },

    // Future visitors can be added here
    // WIDOW: { ... },
    // BARD: { ... },
    // etc.
};
