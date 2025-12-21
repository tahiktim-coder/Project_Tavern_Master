/**
 * INJURY TYPES DATA
 * Defines all possible injuries from quest failures
 */

export const INJURY_TYPES = {
    // Temporary injuries (heal over time)
    BROKEN_ARM: {
        id: 'broken_arm',
        name: 'Broken Arm',
        statPenalty: { str: -3 },
        duration: 5,
        visual: 'bandaged_arm',
        description: 'Cannot wield weapons effectively'
    },
    BROKEN_LEG: {
        id: 'broken_leg',
        name: 'Shattered Leg',
        statPenalty: { dex: -3 },
        duration: 7,
        visual: 'limping',
        description: 'Reduced mobility'
    },
    SCARRED: {
        id: 'scarred',
        name: 'Battle Scars',
        statPenalty: { vit: -1 },
        duration: -1, // permanent
        visual: 'scars',
        description: 'Permanent wounds'
    },

    // PERMANENT limb losses (player mistakes)
    LOST_ARM: {
        id: 'lost_arm',
        name: 'Left Arm',
        statPenalty: { str: -4, dex: -3 },
        duration: -1, // PERMANENT
        visual: 'missing_arm',
        description: 'Cannot wield two-handed weapons'
    },
    LOST_LEG: {
        id: 'lost_leg',
        name: 'Right Leg',
        statPenalty: { dex: -5, vit: -2 },
        duration: -1, // PERMANENT
        visual: 'wooden_leg',
        description: 'Movement severely impaired'
    },
    LOST_EYE: {
        id: 'lost_eye',
        name: 'an Eye',
        statPenalty: { int: -2, dex: -2 },
        duration: -1, // PERMANENT
        visual: 'eye_patch',
        description: 'Depth perception gone'
    },
    MAIMED: {
        id: 'maimed',
        name: 'Hand (maimed)',
        statPenalty: { dex: -4, str: -2 },
        duration: -1, // PERMANENT
        visual: 'bandaged_hand',
        description: 'Fingers crushed beyond repair'
    },

    // Special injuries
    CURSED: {
        id: 'cursed',
        name: 'Cursed',
        statPenalty: { str: -2, int: -2, dex: -2 },
        duration: -1, // until cleansed
        visual: 'purple_aura',
        description: 'Dark magic weakens them'
    }
};

// Helper to get random injury by severity
export function getRandomInjury(severity = 'minor') {
    if (severity === 'permanent') {
        const permanent = [
            INJURY_TYPES.LOST_ARM,
            INJURY_TYPES.LOST_LEG,
            INJURY_TYPES.LOST_EYE,
            INJURY_TYPES.MAIMED
        ];
        return { ...permanent[Math.floor(Math.random() * permanent.length)] };
    } else {
        const minor = [
            INJURY_TYPES.BROKEN_ARM,
            INJURY_TYPES.BROKEN_LEG,
            INJURY_TYPES.SCARRED
        ];
        return { ...minor[Math.floor(Math.random() * minor.length)] };
    }
}
