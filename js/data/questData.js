/**
 * QUEST DATA REGISTRY
 * Converted from quests_registry.md
 * Using Global Namespace Pattern for local execution (Step 1 Implementation)
 */

window.GameData = window.GameData || {};

window.GameData.Quests = [
    // 1. Monster Hunts
    {
        id: "hunt_rats",
        title: "Rats in the Cellar",
        type: "HUNT",
        rank: "F",
        desc: "Large rats have invested the Inn's basement.",
        enemy_type: "Beast (Swarm)",
        environment: "Indoors",
        requirements: { tags: ["any_weapon"] },
        hazard: "Disease Risk (Low VIT characters get sick)",
        rewards: { gold: 10, rep: 2 }
    },
    {
        id: "hunt_wolves",
        title: "The Howling Woods",
        type: "HUNT",
        rank: "D",
        desc: "A pack of wolves is terrorizing the outskirts.",
        enemy_type: "Beast (Pack)",
        environment: "Forest (Night)",
        requirements: { tags: ["aoe", "cleave"] },
        hazard: "Ambush: They flank the party.",
        rewards: { gold: 25, rep: 5 }
    },
    {
        id: "hunt_golems",
        title: "Golems of the Quarry",
        type: "HUNT",
        rank: "C",
        desc: "Stone constructs have gone rogue.",
        enemy_type: "Construct",
        environment: "Rocky Quarry",
        requirements: { tags: ["blunt_weapon"] },
        hazard: "Edged weapons break. Magic reflects.",
        rewards: { gold: 50, rep: 10 }
    },
    {
        id: "hunt_witch",
        title: "The Swamp Witch",
        type: "HUNT",
        rank: "B",
        desc: "A witch is brewing poisons in the marsh.",
        enemy_type: "Humanoid (Mage)",
        environment: "Poison Swamp",
        requirements: { tags: ["poison_resist"] },
        hazard: "Charms male adventurers (INT check).",
        rewards: { gold: 100, rep: 20 }
    },
    {
        id: "hunt_dragon",
        title: "Crimson Dragon",
        type: "HUNT",
        rank: "S",
        desc: "A legendary beast awakens in the volcano.",
        enemy_type: "Dragon",
        environment: "Volcano",
        requirements: { tags: ["fire_immune"] },
        hazard: "Breath Weapon: Instant death without resist.",
        rewards: { gold: 1000, rep: 100 }
    },

    // 2. Escort Missions
    {
        id: "escort_merchant",
        title: "Merchant to Market",
        type: "ESCORT",
        rank: "E",
        client: "Fat Merchant",
        destination: "Next Town",
        risk: "Low",
        twist: "He walks very slow. Requires Patience.",
        rewards: { gold: 15, rep: 3 }
    },
    {
        id: "escort_princess",
        title: "The Runaway Princess",
        type: "ESCORT",
        rank: "B",
        client: "Hooded Girl",
        destination: "The Docks",
        risk: "High (Royal Guards)",
        twist: "Guards aren't monsters. Paladins might refuse.",
        rewards: { gold: 200, rep: 15 }
    },

    // 3. Retrieval
    {
        id: "retrieve_herb",
        title: "Rare Herb Gathering",
        type: "RETRIEVAL",
        rank: "D",
        item: "Sun-Bloom",
        location: "Cliffside",
        best_class: ["Ranger", "Druid"],
        hazard: "Falling hazard. Heavy Armor = Death.",
        rewards: { gold: 30, rep: 5 }
    },
    {
        id: "retrieve_locket",
        title: "The Stolen Locket",
        type: "RETRIEVAL",
        rank: "C",
        item: "Gold Locket",
        location: "Thief Hideout",
        best_class: ["Rogue"],
        hazard: "Traps everywhere. Combat = Failure.",
        rewards: { gold: 60, rep: 8 }
    },

    // 4. Mysteries
    {
        id: "mystery_mill",
        title: "The Haunted Mill",
        type: "MYSTERY",
        rank: "D",
        phenomenon: "Ghost noises",
        truth: "Bandits faking it",
        solution: "Perception or Combat",
        failure: "Clerics are useless here.",
        rewards: { gold: 40, rep: 10 }
    }
];
