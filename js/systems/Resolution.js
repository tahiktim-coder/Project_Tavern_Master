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

        // 3. DETERMINE OUTCOME (with injury/death)
        let result = "UNKNOWN";
        let flavorText = "";

        // Store original match score for failure severity
        const matchScore = score;

        if (fatalResult) {
            result = "FAILURE";
            flavorText = log[log.length - 1];
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

                // NEW: Determine failure severity and consequences
                const failureSeverity = this.determineFailureSeverity(matchScore, quest.rank);

                if (failureSeverity === 'MINOR') {
                    // Injury but survived
                    const injury = this.selectRandomInjury();
                    if (!adventurer.injuries) adventurer.injuries = [];
                    adventurer.injuries.push(injury);
                    flavorText = `${adventurer.name} was outmatched and took ${injury.name}. ` + (log.length > 0 ? log.join(" ") : "");
                } else if (failureSeverity === 'CRITICAL') {
                    // Check survival
                    const survives = this.checkSurvival(adventurer, quest.rank);
                    if (!survives) {
                        adventurer.isDead = true;
                        adventurer.deathReason = `${adventurer.name} was killed. You sent them unprepared.`;
                        adventurer.deathDay = (window.gameState && window.gameState.day) || 1;
                        flavorText = adventurer.deathReason;
                    } else {
                        // PERMANENT limb loss
                        const permanentInjury = this.selectPermanentInjury();
                        if (!adventurer.injuries) adventurer.injuries = [];
                        adventurer.injuries.push(permanentInjury);
                        flavorText = `${adventurer.name} lost their ${permanentInjury.name}. A grave mistake.`;
                    }
                } else {
                    // CATASTROPHIC - terrible mismatch
                    adventurer.isDead = true;
                    adventurer.deathReason = `${adventurer.name} never stood a chance. This death is on you.`;
                    adventurer.deathDay = (window.gameState && window.gameState.day) || 1;
                    flavorText = adventurer.deathReason;
                }
            }
        }

        console.log("Resolution: Outcome determined -", result);

        // 3.5 CALCULATE GOLD EARNED
        const baseReward = (quest.rewards && quest.rewards.gold) || 0;
        let goldEarned = 0;

        if (result === "SUCCESS") {
            goldEarned = baseReward; // Full reward
        } else if (result === "MIXED") {
            goldEarned = Math.floor(baseReward * 0.5); // Half reward
        } else if (result === "FAILURE" && !adventurer.isDead && adventurer.injuries.length > 0) {
            // Partial reward if injured but alive
            goldEarned = Math.floor(baseReward * 0.25);
        } else {
            goldEarned = 0; // No reward for death
        }

        console.log(`Resolution: Gold calculation - Base: ${baseReward}, Earned: ${goldEarned}`);

        // 3.6 UPDATE HISTORY & CROWN QUEST
        if (adventurer.questHistory) {
            adventurer.questHistory.total++;
            const rank = quest.rank || 'C';
            // Init byRank if missing
            if (!adventurer.questHistory.byRank) adventurer.questHistory.byRank = { S: 0, A: 0, B: 0, C: 0, D: 0 };

            if (result === 'SUCCESS') {
                if (adventurer.questHistory.byRank[rank] !== undefined) {
                    adventurer.questHistory.byRank[rank]++;
                }
            }
        }

        // 3.5 XP & LEVEL UP (NEW)
        if (result === 'SUCCESS' || result === 'MIXED') {
            const xpMap = { 'D': 50, 'C': 100, 'B': 250, 'A': 500, 'S': 1000 };
            const xp = xpMap[quest.rank] || 50;

            // Safety check for method existence (in case of old instances)
            if (typeof adventurer.gainXp === 'function') {
                const leveledUp = adventurer.gainXp(xp);
                log.push(`Gained ${xp} XP.`);
                if (leveledUp) {
                    log.push(`*** LEVEL UP! Reached Level ${adventurer.level}! ***`);
                    flavorText += ` ${adventurer.name} feels stronger!`;
                }
            }
        }

        // CROWN QUEST CHECK
        if (window.GameSystems.CrownChecker) {
            // DELEGATE TO DEDICATED CHECKER
            window.GameSystems.CrownChecker.check(window.gameState, quest, adventurer, result);
        } else {
            console.error("Resolution: CrownChecker system not found!");
        }

        // 3.6 PERSISTENCE SAVE (Optional)
        try {
            if (window.gameState && window.gameState.persistence) {
                console.log("Resolution: Saving to persistence...");
                window.gameState.persistence.saveAdventurer(adventurer, {
                    questTitle: quest.title,
                    result: result
                });

                // SAVE GLOBAL STATE (Crown Progress)
                window.gameState.persistence.saveGlobal(window.gameState);

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
            flavorText,
            goldEarned // NEW: Include gold in result
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

    // NEW: Injury & Death System Helpers
    static determineFailureSeverity(matchScore, questRank) {
        // S/A rank: more likely critical/catastrophic
        // Low score: worse outcome
        const rankWeights = { S: 0.7, A: 0.5, B: 0.3, C: 0.2, D: 0.1, E: 0.05 };
        const rankWeight = rankWeights[questRank] || 0.2;

        // Terrible mismatch (score < 20) = catastrophic
        if (matchScore < 20 && questRank in ['S', 'A']) {
            return 'CATASTROPHIC';
        }

        // Random chance weighted by rank
        const roll = Math.random();
        if (roll < rankWeight) {
            return 'CRITICAL'; // Permanent injury or death
        } else {
            return 'MINOR'; // Temporary injury
        }
    }

    static selectRandomInjury() {
        // Temporary injuries
        const injuries = [
            { id: 'broken_arm', name: 'Broken Arm', statPenalty: { str: -3 }, duration: 5, visual: 'bandaged_arm' },
            { id: 'broken_leg', name: 'Shattered Leg', statPenalty: { dex: -3 }, duration: 7, visual: 'limping' },
            { id: 'scarred', name: 'Battle Scars', statPenalty: { vit: -1 }, duration: -1, visual: 'scars' }
        ];
        return { ...injuries[Math.floor(Math.random() * injuries.length)] };
    }

    static selectPermanentInjury() {
        // PERMANENT limb losses
        const permanent = [
            { id: 'lost_arm', name: 'Left Arm', statPenalty: { str: -4, dex: -3 }, duration: -1, visual: 'missing_arm' },
            { id: 'lost_leg', name: 'Right Leg', statPenalty: { dex: -5, vit: -2 }, duration: -1, visual: 'wooden_leg' },
            { id: 'lost_eye', name: 'an Eye', statPenalty: { int: -2, dex: -2 }, duration: -1, visual: 'eye_patch' },
            { id: 'maimed', name: 'Hand (maimed)', statPenalty: { dex: -4, str: -2 }, duration: -1, visual: 'bandaged_hand' }
        ];
        return { ...permanent[Math.floor(Math.random() * permanent.length)] };
    }

    static checkSurvival(adventurer, questRank) {
        // Higher VIT = better survival chance
        // Higher rank = more dangerous
        const baseChance = (adventurer.stats.vit || 5) / 10; // 0.3 to 1.0
        const rankPenalties = { S: -0.4, A: -0.3, B: -0.2, C: -0.1, D: 0, E: 0.1 };
        const survivalChance = Math.max(0.1, baseChance + (rankPenalties[questRank] || 0));
        return Math.random() < survivalChance;
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
