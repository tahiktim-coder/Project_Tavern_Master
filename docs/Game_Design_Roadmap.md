# Guild Master - Game Design Roadmap & Current State

## 1. Current Game Loop & Systems
The game effectively combines **Resource Evaluation (Papers, Please)** with **Guild Management (Darkest Dungeon)**.

### **The Daily Loop**
1.  **Morning Phase**:
    *   **Generation**: New Day (Day N+1). Daily Roster reset (everyone available).
    *   **Quest Board**: 3-6 procedurally generated quests appear (varying difficulty/gold).
    *   **Economy**: Upkeep is calculated. Random Daily Event triggers (Tax, Donation, Festival).

2.  **Action Phase (Tavern View)**:
    *   **Arrival**: An adventurer enters. Generated from ~12 Classes, 4 Races, and random visual traits.
    *   **Inspection (The "Scanner")**: Player right-clicks to reveal hidden info (Flavor text hints at high stats or hidden traits like "Greedy").
    *   **Decision**:
        *   **Recruit**: Pay 100g to add to persistent Roster.
        *   **Quest**: Drag Quest to Adventurer (Guild Member or Freelancer).
        *   **Dismiss**: Send away to see the next applicant.
    *   **Management**: Open Guild Roster to view detailed stats, heal injuries (-50g), or fire members.

3.  **Resolution Phase (End Day)**:
    *   **Simulation**: The game calculates outcomes based on `Stats vs. Difficulty`.
    *   **Consequences**: Success (Gold), Failure (Injury/Nothing), Death (Permadeath).
    *   **Ledger**: A summary screen shows the day's financials (Gross - Upkeep + Events = Net) and quest outcomes.

---

## 2. Enrichment Roadmap (The "Vibe" Expansion)
To deepen the "Gritty Management" vibe, we should focus on mechanics that force difficult choices and expand the narrative.

### **A. Content Depth (Classes & Visuals)**
*   **Goal**: Make every adventurer feel unique and "scannable".
*   **New Classes**:
    *   *Specialists*: Alchemist (Int/Vit), Beastmaster (Dex/Vit), Witch Hunter (Str/Int).
    *   *Prestige*: Dragon Knight, Archmage (Rare spawns).
*   **Visual storytelling**:
    *   More "Visual Traits" that link to gameplay (e.g., "Shifty Eyes" = High chance to steal loot).
    *   Racial variants (e.g., Dark Elves, Mountain Dwarves).

### **B. Enhanced Resolution & Outcomes**
*   **Goal**: Move beyond "Win/Fail". Make the unexpected happen.
*   **Complex Outcomes**:
    *   *Betrayal*: A "Greedy" adventurer wins but keeps the gold.
    *   *Heroics*: A "Brave" adventurer sacrifices themselves to save the team (if we add parties).
    *   *Maiming*: Specific injuries (e.g., "Lost Eye" = -2 Accuracy/Dex).
*   **Quest Types**:
    *   *Dungeon Delves*: Multi-day quests (Adventurer is gone for 3 days, high reward).
    *   *Escort*: Requires High Vitality (Meatshield).

### **C. Guild Progression (The Meta-Game)**
*   **Goal**: Give the player something to spend Gold on besides Healing.
*   **Facilities Upgrades**:
    *   *Barracks*: Increase Roster Cap (2 -> 4 -> 6).
    *   *Infirmary*: Reduce Healing cost (50g -> 25g).
    *   *Scout Network*: improved Inspection info (reveals exact stats?).
    *   *Tavern Decor*: Attracts higher-tier adventurers.
*   **Equipment**: Buy basic gear to buff low-stat recruits (e.g., "Iron Shield" +1 VIT).

### **D. Narrative Events (World Building)**
*   **Goal**: Make the world feel alive and changing.
*   **Story Arcs**:
    *   The "Dragon Threat": Starts as rumors (Event), leads to burnt villages (Quests), culminates in Boss Fight.
    *   The "Plague": Sickness spreads. Healers are in high demand.
*   **Interactive Events**:
    *   "A shadowed figure offers a cursed artifact." -> Buy or Ban?
    *   "Royal Inspection." -> Bribe or hoping your papers are in order?

### **E. Victory Conditions**
*   **Capitalism**: amass 10,000 Gold.
*   **Legend**: Complete 5 "S-Rank" Legendary Quests.
*   **Influence**: Maximize Reputation with the King (Political ending).

---

## 3. Comparison to Genre Giants
*   *Papers, Please*: We have the "Inspection/Scanner". We can lean harder into *spotting lies* (e.g., Adventurer claims to be a Knight, scanner reveals "Stolen Crest").
*   *Darkest Dungeon*: We have the "Stress/Injury" management. We can add "Quirks" that develop over time (e.g., "Fear of Spiders" after a failed spider quest).
*   *Recettear*: We have the Economy. We can add "Haggling" or fluctuating market prices for quest rewards.
