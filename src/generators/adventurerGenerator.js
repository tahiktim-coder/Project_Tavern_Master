import { ADVENTURER_DATA } from '../data/adventurerData.js';
import { Adventurer } from '../models/Adventurer.js';

export class AdventurerGenerator {
    static generate(day = 1) {
        // 1. Pick Archetype
        const archetypeKeys = Object.keys(ADVENTURER_DATA.archetypes);
        const archetypeKey = archetypeKeys[Math.floor(Math.random() * archetypeKeys.length)];
        const archetypeData = ADVENTURER_DATA.archetypes[archetypeKey];

        // 2. Pick Class
        const charClass = archetypeData.classes[Math.floor(Math.random() * archetypeData.classes.length)];

        // 3. Roll Stats
        const stats = {
            str: this.randomRange(charClass.stats.str[0], charClass.stats.str[1]),
            int: this.randomRange(charClass.stats.int[0], charClass.stats.int[1]),
            dex: this.randomRange(charClass.stats.dex[0], charClass.stats.dex[1]),
            vit: this.randomRange(3, 8) // Base VIT for now
        };

        // 4. Traits
        const traits = [...charClass.traits];

        // 5. Pick Race based on class
        const race = this.pickRaceForClass(charClass.id);

        // 6. Determine Visual Class (Map unsupported classes to supported assets)
        const visualClass = this.getVisualClass(charClass.id);

        // 7. Equipment (Placeholder for now, just strings)
        const equipment = {
            mainHand: "Basic Weapon",
            armor: "Basic Armor"
        };

        // 8. Name Generation (Simple Placeholder)
        const names = ["Garrett", "Lyra", "Thorn", "Elara", "Ragnar", "Sylas"];
        const name = names[Math.floor(Math.random() * names.length)] + " the " + charClass.name;

        return new Adventurer({
            name: name,
            archetype: archetypeKey,
            classId: charClass.id,
            visualClass: visualClass, // Pass mapped visual class
            race: race,
            stats: stats,
            traits: traits,
            equipment: equipment
        });
    }

    static getVisualClass(classId) {
        // Map logical classes to asset filenames (e.g. barbarian -> warrior)
        const map = {
            // Martial
            barbarian: 'warrior',
            guard: 'warrior',
            pit_fighter: 'warrior',
            ronin: 'warrior',
            mercenary: 'warrior',

            // Arcane
            battle_mage: 'mage',
            scholar: 'wizard',
            elementalist: 'mage',
            illusionist: 'mage',
            hedge_wizard: 'wizard',

            // Cunning
            spy: 'rogue',
            treasure_hunter: 'rogue',
            bard: 'rogue', // Fallback
            assassin: 'assassin', // Supported

            // Divine
            monk: 'cleric',
            cultist: 'cleric'
        };
        return map[classId] || classId;
    }

    static pickRaceForClass(classId) {
        // Map classes to appropriate races based on our available portraits
        const raceMap = {
            // Martial - we have: human_warrior, orc_barbarian
            warrior: 'human',
            knight: 'human',
            barbarian: Math.random() < 0.7 ? 'orc' : 'human',
            guard: 'human',
            pit_fighter: 'human',
            ronin: 'human',
            mercenary: 'human',

            // Arcane - we have: human_necromancer, elf_mage  
            battle_mage: 'elf',
            scholar: 'human',
            necromancer: 'human',
            illusionist: 'elf',
            elementalist: 'elf',
            hedge_wizard: 'human',

            // Cunning - we have: elf_ranger, human_rogue
            rogue: 'human',
            ranger: 'elf',
            bard: 'human',
            assassin: 'human',
            treasure_hunter: 'human',
            spy: 'human',

            // Divine - we have: dwarf_paladin, human_cleric
            cleric: 'human',
            paladin: 'dwarf',
            druid: 'elf',
            monk: 'human',
            cultist: 'human'
        };

        return raceMap[classId] || 'human'; // Default to human if not mapped
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
