# 🚀 PROJECT MIGRATION GUIDE (Read Me First)

**To the AI Assistant taking over:**
This project is in the middle of a "V2 Pivot". We are moving from a Canvas-based prototype to a DOM-based "App" interface (inspired by *Reigns* and *XCOM*).

## 1. Context & Vision
The user wants a **Minimalist UI** (Stack of Cards) but with **Deep Simulation** (Hidden Stats/History).
*   **Design Bible**: Read `docs/V2_Concept_Bible.md` (The "Soul" of the game).
*   **Technical Plan**: Read `docs/Implementation_Plan_V2.md` (The "Steps").

## 2. Critical Files (Do Not Delete)
We are **reusing logic** from the old version (`v1`) to power the new version (`v2`).
*   `src/generators/adventurerGenerator.js`: The complex character generator.
*   `js/data/traitData.js`: The database of traits.
*   `js/data/questData.js`: The database of quests.

## 3. The New Workspace (`v2/`)
Your work should be focused entirely inside the `v2/` folder.
*   `v2/index.html`: The new entry point.
*   `v2/js/App.js`: The new controller (already linked to the old generator).
*   `v2/css/`: The new styles.

## 4. Immediate Next Steps
1.  **Read the docs** listed above.
2.  **Run `v2/index.html`** to see the current "Card Stack" prototype.
3.  **Execute Phase 2** of the Implementation Plan: "The Dossier".
    *   Make the "Inspect" overlay show real data from the generator.
    *   Implement the "Backstory Generator" in `v2/js/App.js`.

---
*Note to User: Just tell the new AI "Please read MIGRATION_GUIDE.md and start working."*
