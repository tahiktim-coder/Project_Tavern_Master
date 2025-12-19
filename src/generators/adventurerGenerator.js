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

        // 5. Equipment (Placeholder for now, just strings)
        const equipment = {
            mainHand: "Basic Weapon",
            armor: "Basic Armor"
        };

        // 6. Name Generation (Simple Placeholder)
        const names = ["Garrett", "Lyra", "Thorn", "Elara", "Ragnar", "Sylas"];
        const name = names[Math.floor(Math.random() * names.length)] + " the " + charClass.name;

        return new Adventurer({
            name: name,
            archetype: archetypeKey,
            classId: charClass.id,
            stats: stats,
            traits: traits,
            equipment: equipment
        });
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
