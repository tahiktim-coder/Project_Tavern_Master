# Adventurer Generator Architecture (The "DNA")

To ensure every adventurer feels unique, we use a "Slot & Key" generation system. We don't just spawn a "Knight". We spawn a *Entity* built from layers.

## 1. The Core Seed (The "Soul")
Every character starts with a hidden 32-bit Seed. This seed determines everything, allowing us to "Remember" them just by saving one number.

## 2. Visual Architecture (The Layers)
We construct the pixel art in layers (Bottom to Top).
*   **Layer 1: Body Base** (Human / Elf / Dwarf / Orc).
*   **Layer 2: Skin Tone & Scars** (Smooth / Rough / Battle-Scarred).
*   **Layer 3: Eyes & Expression** (Determined by Personality).
    *   *Wide Eyes* = `Curious` or `Paranoid`.
    *   *Heavy Lids* = `Lazy` or `Drunk`.
    *   *Shifty Eyes* = `Untrustworthy`.
*   **Layer 4: Hair/Beard** (Color + Style).
*   **Layer 5: Under-Armor** (Clothes).
*   **Layer 6: Armor** (Driven by Equipment Quality).
    *   *Shiny* = New/Rich.
    *   *Rusted* = Poor/Unlucky.
*   **Layer 7: Prop (Main Hand)** (Weapon).
*   **Layer 8: Prop (Off Hand)** (Shield / Torch / Beer Mug).

## 3. Procedural Backstory (The "Why")
We combine strings to generate a motive text.
`[Origin] + [Tragedy/Event] + [Current Goal]`
*   *Example*: "A former [Royal Guard] who [Lost his Honor] and now seeks [Redemption]."
*   *Example*: "A [Farm Boy] who [Found a Magic Sword] and now seeks [To Impress a Girl]."

## 4. Stat Generation Logic
We don't use flat random numbers. We use **Archetype Bias**.
1.  **Select Class Archetype** (e.g. Knight).
2.  **Base Roll**: `STR: 8-10`, `INT: 2-4`.
3.  **Apply Life Filters** (Age):
    *   *Young*: +STR, -WIS.
    *   *Old*: -STR, +WIS.
4.  **Apply Hidden Traits**:
    *   *Drunk*: -2 All Stats.
    *   *Blessed*: +2 All Stats.

## 5. The "Unique Factor"
1 in 20 adventurers gets a **"Quirk"** that overrides standard logic.
*   **The Pacifist Orc**: A massive Orc who refuses to carry a weapon (Equipment slot forced to "Flower").
*   **The Child Prodigy**: A tiny sprite with Level 100 Magic.
