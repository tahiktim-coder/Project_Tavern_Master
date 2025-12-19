/**
 * TRAIT DATA REGISTRY (Visual Tells)
 * Converted from mechanics_inspection.md
 * Using Global Namespace Pattern for local execution (Step 1 Implementation)
 */

window.GameData = window.GameData || {};

window.GameData.VisualTraits = {
    // 1. Physical Tells (Body Language & Condition)
    "shaking": {
        id: "shaking",
        name: "Shaking Hands",
        meanings: ["Coward", "Withdrawal (Addict)", "Cold"],
        visual_cue: "hand_shake_anim", // Placeholder for actual sprite tag
        risk: "Morale Break"
    },
    "looking_away": {
        id: "looking_away",
        name: "Averted Gaze",
        meanings: ["Lying", "Untrustworthy", "Shy"],
        visual_cue: "head_turn_anim",
        risk: "Theft / Betrayal"
    },
    "bandaged": {
        id: "bandaged",
        name: "Heavy Bandages",
        meanings: ["Injured", "Cursed", "Hiding Identity"],
        visual_cue: "body_bandage_sprite",
        risk: "Low HP Start"
    },

    // 2. Gear Tells (Equipment Condition)
    "pristine_armor": {
        id: "pristine_armor",
        name: "Brand New Armor",
        meanings: ["Rookie (Rich)", "Meticulous"],
        visual_cue: "shine_effect",
        risk: "Inexperience"
    },
    "rusty_gear": {
        id: "rusty_gear",
        name: "Rusted Weapons",
        meanings: ["Poor", "Lazy", "Cursed Item"],
        visual_cue: "rust_color_overlay",
        risk: "Equipment Breakage"
    },
    "expensive_jewelry": {
        id: "expensive_jewelry",
        name: "Expensive Jewelry",
        meanings: ["Wealthy", "Thief", "Noble"],
        visual_cue: "bling_sprite",
        risk: "Greed"
    },

    // 3. Supernatural Tells
    "glowing_eyes": {
        id: "glowing_eyes",
        name: "Glowing Eyes",
        meanings: ["Magical", "Possessed", "Night Vision"],
        visual_cue: "eye_glow_anim",
        risk: "Magic Volatility"
    },
    "no_shadow": {
        id: "no_shadow",
        name: "No Shadow",
        meanings: ["Vampire", "Ghost", "Illusion"],
        visual_cue: "shadow_missing",
        risk: "Monster in disguise"
    }
};

// Dialogue Questions mapped to Traits
window.GameData.Questions = {
    "capabilities": [
        { q: "Can you handle a sword?", check: "confidence" },
        { q: "How is your health?", check: "injury" }
    ],
    "history": [
        { q: "Where are you from?", check: "origin" },
        { q: "How did you get that scar?", check: "veteran_status" }
    ]
};
