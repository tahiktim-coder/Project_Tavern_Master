/**
 * RESOLUTION SYSTEM
 * Calculates the outcome of a quest assignment.
 * Using Global Namespace Pattern
 */

window.GameSystems = window.GameSystems || {};

class ResolutionManager {
    static resolve(quest, adventurer) {
        console.log(`resolving quest: ${quest.title} for ${adventurer.name}`);
        console.log("Resolution: STEP 1 - About to generate tags");

        // 1. GENERATE TAGS
        console.log("Resolution: Calling getAdventurerTags...");
        const advTags = this.getAdventurerTags(adventurer);
        console.log("Resolution: getAdventurerTags returned:", advTags);

        console.log("Resolution: Getting quest.tags...");
        const questTags = quest.tags || [];
        console.log("Resolution: Quest tags retrieved:", questTags);

        console.log("Adventurer Tags:", advTags);
        console.log("Quest Tags:", questTags);

        // 2. RUN RULE ENGINE
        // Base Score (50/100)
        let score = 50 + (adventurer.stats.str + adventurer.stats.int + adventurer.stats.dex);
        let log = [];
        let fatalResult = null; // If set, overrides everything (e.g. Heatstroke)

        console.log("Resolution: About to call getRules()");
        const rules = this.getRules();
        console.log("Resolution: getRules() returned", rules.length, "rules");

        rules.forEach(rule => {
            // Check if rule applies to this quest
            const triggerMatch = rule.triggers.some(t => questTags.includes(t));
            if (triggerMatch) {
                // Check if adventurer meets condition
                const advMatch = rule.check(advTags, adventurer);

                if (advMatch) {
                    // Apply Effect
                    console.log(`Rule Triggered: ${rule.id}`);
                    if (rule.type === 'FATAL') {
                        fatalResult = rule.result;
                        log.push(rule.msg);
                    } else if (rule.type === 'PENALTY') {
                        score -= rule.val;
                        log.push(rule.msg);
                    } else if (rule.type === 'BONUS') {
                        score += rule.val;
                        log.push(rule.msg);
                    }
                }
            }
        });

        console.log("Resolution: Rule engine complete. Fatal:", fatalResult, "Score:", score);

        // 3. DETERMINE OUTCOME
        let result = "UNKNOWN";
        let flavorText = "";

        if (fatalResult) {
            result = "FAILURE"; // Or DEATH if supported later
            flavorText = log[log.length - 1]; // Use the fatal message
        } else {
            // Random Variance (+/- 20)
            score += (Math.random() * 40 - 20);

            if (score > 100) {
                result = "SUCCESS";
                flavorText = "The guild marks this as a flawless victory. " + (log.length > 0 ? log.join(" ") : "");
            } else if (score > 60) {
                result = "MIXED";
                flavorText = "They survived, but it was messy. " + (log.length > 0 ? log.join(" ") : "");
            } else {
                result = "FAILURE";
                flavorText = "Defeat. " + (log.length > 0 ? log.join(" ") : "They were simply unprepared.");
            }
        }

        console.log("Resolution: Outcome determined -", result);

        // 3.5 PERSISTENCE SAVE (Optional)
        try {
            if (window.gameState && window.gameState.persistence) {
                console.log("Resolution: Saving to persistence...");
                window.gameState.persistence.saveAdventurer(adventurer, {
                    questTitle: quest.title,
                    result: result
                });
            } else {
                console.log("Resolution: Persistence system not available, skipping save");
            }
        } catch (err) {
            console.error("Resolution: Persistence save failed:", err);
        }

        console.log("Resolution: Preparing return object...");
        const returnObj = {
            result,
            score,
            log,
            questTitle: quest.title,
            adventurerName: adventurer.name,
            flavorText
        };
        console.log("Resolution: Returning:", returnObj);
        return returnObj;
    }

    static getAdventurerTags(adventurer) {
        let tags = [];

        // Class Tags
        if (adventurer.classId) tags.push(adventurer.classId);

        // Trait Tags (Lowercase, underscored)
        if (adventurer.traits) {
            adventurer.traits.forEach(t => tags.push(t.toLowerCase().replace(' ', '_')));
        }

        // Equipment Tags (Derived)
        // TODO: In future, equipment should have its own data. For now, infer.
        if (adventurer.equipment) {
            if (adventurer.equipment.armor === 'Plate') tags.push('heavy_armor');
            if (adventurer.equipment.mainHand && adventurer.equipment.mainHand.includes('Sword')) tags.push('edged_weapon');
            if (adventurer.equipment.mainHand && adventurer.equipment.mainHand.includes('Axe')) tags.push('edged_weapon');
            if (adventurer.equipment.mainHand && adventurer.equipment.mainHand.includes('Mace')) tags.push('blunt_weapon');
        }

        // Stat derived tags
        if (adventurer.stats) {
            if (adventurer.stats.dex < 5) tags.push('clumsy');
            if (adventurer.stats.str > 8) tags.push('strong');
            if (adventurer.stats.int > 8) tags.push('smart');
        }

        // Visual Tags (The most important for "Tells")
        if (adventurer.visuals && Array.isArray(adventurer.visuals)) {
            tags.push(...adventurer.visuals);
        }

        return tags;
    }

    static getRules() {
        return [
            // --- HAZARDS ---
            {
                id: 'heatstroke',
                triggers: ['volcano', 'desert'],
                check: (tags) => tags.includes('heavy_armor') || tags.includes('pristine_armor'),
                type: 'FATAL',
                result: 'FAILURE',
                msg: "CRITICAL FAILURE: Their heavy armor turned into an oven in the heat. They passed out before the fight began."
            },
            {
                id: 'drowning',
                triggers: ['swamp', 'water'],
                check: (tags) => tags.includes('heavy_armor'),
                type: 'FATAL',
                result: 'FAILURE',
                msg: "CRITICAL FAILURE: The weight of their armor dragged them under the mud."
            },
            {
                id: 'falling',
                triggers: ['falling_risk', 'climb'],
                check: (tags) => tags.includes('clumsy') || tags.includes('heavy_armor'),
                type: 'FATAL',
                result: 'FAILURE',
                msg: "They slipped and fell. Gravity is a cruel mistress."
            },

            // --- ENEMY COUNTERS ---
            {
                id: 'weapon_bounce',
                triggers: ['hard_shell', 'golems'],
                check: (tags) => tags.includes('edged_weapon') && !tags.includes('strong'),
                type: 'PENALTY',
                val: 60,
                msg: "Their blade chipped against the stone hide. Useless."
            },
            {
                id: 'blunt_crush',
                triggers: ['golems'],
                check: (tags) => tags.includes('blunt_weapon'),
                type: 'BONUS',
                val: 40,
                msg: "The blunt impact shattered the construct."
            },
            {
                id: 'ghost_miss',
                triggers: ['ghost'],
                check: (tags) => !tags.includes('magic') && !tags.includes('cleric'),
                type: 'FATAL',
                result: 'FAILURE',
                msg: "Their physical weapons passed right through the spirit."
            },

            // --- TRAITS ---
            {
                id: 'coward_flee',
                triggers: ['dragon', 'undead', 'boss'], // Scary things
                check: (tags) => tags.includes('cowardly'),
                type: 'FATAL',
                result: 'FAILURE',
                msg: "They took one look at the horror and ran away."
            },
            {
                id: 'stealth_fail',
                triggers: ['stealth_required'],
                check: (tags) => tags.includes('heavy_armor') || tags.includes('clumsy'),
                type: 'FATAL',
                result: 'FAILURE',
                msg: "CLANK. CLANK. The enemy heard them coming a mile away."
            }
        ];
    }
}

window.GameSystems.ResolutionManager = ResolutionManager;
