export const ADVENTURER_DATA = {
    archetypes: {
        MARTIAL: {
            name: "Martial",
            classes: [
                { id: "knight", name: "Knight-Errant", traits: ["Honorbound", "Arrogant"], stats: { str: [8, 10], int: [2, 5], dex: [4, 6] } },
                { id: "barbarian", name: "Barbarian", traits: ["Battle-Rage", "Illiterate"], stats: { str: [9, 10], int: [1, 3], dex: [5, 7] } },
                { id: "mercenary", name: "Mercenary", traits: ["Greedy", "Pragmatic"], stats: { str: [6, 8], int: [4, 6], dex: [5, 7] } },
                { id: "pit_fighter", name: "Pit Fighter", traits: ["Sadist", "Showman"], stats: { str: [7, 9], int: [2, 4], dex: [7, 9] } },
                { id: "guard", name: "Town Guard", traits: ["Lazy", "Corrupt"], stats: { str: [5, 7], int: [3, 5], dex: [4, 6] } },
                { id: "ronin", name: "Ronin", traits: ["Wanderer", "Disciplined"], stats: { str: [7, 9], int: [4, 6], dex: [8, 10] } }
            ]
        },
        ARCANE: {
            name: "Arcane",
            classes: [
                { id: "battle_mage", name: "Battle Mage", traits: ["Pyromaniac", "Short-Tempered"], stats: { str: [4, 6], int: [8, 10], dex: [4, 6] } },
                { id: "scholar", name: "Scholar", traits: ["Cowardly", "Curious"], stats: { str: [2, 4], int: [9, 10], dex: [3, 5] } },
                { id: "necromancer", name: "Necromancer", traits: ["Outcast", "Creepy"], stats: { str: [3, 5], int: [8, 10], dex: [3, 5] } },
                { id: "illusionist", name: "Illusionist", traits: ["Liar", "Kleptomaniac"], stats: { str: [3, 5], int: [7, 9], dex: [8, 10] } },
                { id: "elementalist", name: "Elementalist", traits: ["Volatile", "Connected"], stats: { str: [4, 6], int: [7, 9], dex: [5, 7] } },
                { id: "hedge_wizard", name: "Hedge Wizard", traits: ["Helpful", "Unlicensed"], stats: { str: [3, 5], int: [5, 7], dex: [4, 6] } }
            ]
        },
        CUNNING: {
            name: "Cunning",
            classes: [
                { id: "rogue", name: "Rogue", traits: ["Greedy", "Traitor"], stats: { str: [3, 5], int: [5, 7], dex: [8, 10] } },
                { id: "ranger", name: "Ranger", traits: ["Loner", "Nature-Lover"], stats: { str: [5, 7], int: [4, 6], dex: [8, 10] } },
                { id: "bard", name: "Bard", traits: ["Drunk", "Flirtatious"], stats: { str: [3, 5], int: [6, 8], dex: [7, 9] } },
                { id: "assassin", name: "Assassin", traits: ["Cold-Blooded", "Contract_Killer"], stats: { str: [5, 7], int: [6, 8], dex: [9, 10] } },
                { id: "treasure_hunter", name: "Treasure Hunter", traits: ["Obsessive", "Unlucky"], stats: { str: [4, 6], int: [5, 8], dex: [7, 9] } },
                { id: "spy", name: "Spy", traits: ["Double Agent", "Paranoid"], stats: { str: [4, 6], int: [8, 10], dex: [6, 8] } }
            ]
        },
        DIVINE: {
            name: "Divine",
            classes: [
                { id: "cleric", name: "Cleric", traits: ["Zealot", "Pacifist"], stats: { str: [5, 7], int: [7, 9], dex: [3, 5] } },
                { id: "paladin", name: "Paladin", traits: ["Lawful Stupid", "Judgemental"], stats: { str: [8, 10], int: [4, 6], dex: [4, 6] } },
                { id: "druid", name: "Druid", traits: ["Feral", "Territorial"], stats: { str: [5, 7], int: [6, 8], dex: [6, 8] } },
                { id: "monk", name: "Monk", traits: ["Vow of Silence", "Disciplined"], stats: { str: [7, 9], int: [6, 8], dex: [9, 10] } },
                { id: "cultist", name: "Cultist", traits: ["Insane", "Doomed"], stats: { str: [4, 6], int: [5, 7], dex: [5, 7] } }
            ]
        }
    },
    hiddenTraits: [
        { id: "drunk", name: "Drunk", effect: "stats_down", value: 0.5 },
        { id: "coward", name: "Cowardly", effect: "flee_chance", value: 0.8 },
        { id: "gambler", name: "Gambler", effect: "gold_demand_variance", value: 2.0 }
    ]
};
