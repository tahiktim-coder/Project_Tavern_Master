# Project Tavern Master: Deep Dive Design Concept & Evolved Roadmap

## 1. The Core Philosophy: "Choice Matters & Time is Finite"
We are pivoting from an "Endless Clicker" to a **Weekly Survival Strategy**. The player is not just a filter; they are a manager of a dwindling resource (people) against a rising tide (King's Demands).

---

## 2. The New Loop: "The King's Week"

### **A. Maximum Constraint (The Quota)**
*   **Concept**: The game is broken into 7-Day cycles.
*   **The Driver**: At the start of the week, the King sends a Demand.
    *   *Example*: "Submit 500 Gold and 3 Monster Trophies by Sunday."
*   **The Failure State**: Miss the quota? The King invokes a penalty (Gold Fine, Reputation Hit, or "Game Over" on repeat failures). This creates the **Time Pressure** without needing a literal timer.

### **B. The Town Pool (Finite Resources)**
Instead of infinite random heroes generating every time you click "Next":
*   **The Pool**: On "Monday", ~15 Adventurers arrive in town. 
    *   *You know this number via your Spy Network.*
*   **The Queue**: Every day, a subset of these 15 visit your tavern.
*   **Persistence**: If you reject "Garrett" on Monday, he goes back into the pool.
    *   *The Risk*: On Tuesday, Garrett might try a quest on his own. He might level up (become stronger/more expensive) OR he might die/leave town. 
*   **The Dilemma**: 
    *   "Do I hire this mediocre guy now because I need bodies?" 
    *   "Or do I wait for the Elite Knight I saw yesterday to come back?"

---

## 3. Narrative Injection: "Morning Visitors"
Inspired by *Yes, Your Grace*. Before the standard recruiting loop begins, specific NPCs visit the Guild Hall.

*   **The Widow/Orphan**: A family member of an adventurer who died under your command.
    *   *Choice*: Pay "Blood Money" (Save Reputation) OR Deny (Save Gold, lose Rep).
*   **The Black Market Dealer**: Offers rare items or "Illegal Contracts" (High Gold, Risk of Inspector Raid).
*   **The King's Guard**: Demands you hand over a specific guild member who is "Under Arrest".
    *   *Choice*: Hand them over (Lose Member) OR Bribe/Hide them (Cost Gold/Rep).

---

## 4. RPG Depth: Veterancy & "The Soul"
Heroes must transcend being stats. They need **Stories**.

### **A. Evolution (Leveling Up)**
*   Adventurers gain **XP** on success.
*   **Levels**: Level 1 (Rookie) -> Level 5 (Legend).
*   **Stats**: Grow dynamically. A "Scrawny" boy who survives 10 tanking missions might gain the "Hardened" trait and +VIT.

### **B. The Ledger of Deeds**
*   **Dossier**: Clicking a Hero shows their history.
    *   *"Day 3: Slew the Rat King."*
    *   *"Day 5: Saved Elara from a trap."*
*   **Sacrifice**: A high-loyalty hero might trigger a special resolution event: "The party was wiped out, but Garrett held the line. He died so the others could escape." (Saves the rest of the party and the Loot).

### **C. Scars & Trauma**
*   Physical Injuries are healed with Gold.
*   **Mental Scars** stay. "Fear of Spiders" -> Refuses Spider Quests. "Gambler" -> Sometimes loses quest gold.

---

## 5. Chained Events & Unlocks
Actions should have Ripples.

*   **The Spy Network**: 
    *   Hire a **Rogue/Spy** class. 
    *   *Unlock*: "Espionage" tab. You can send them to "Spy on Town" instead of a Quest.
    *   *Result*: Reveals exactly who is in the Town Pool for the week + Hidden traits of visitors.
*   **The Merchant Alliance**:
    *   Complete 3 "Escort Caravan" quests.
    *   *Unlock*: A Merchant sets up shop in your Guild. You can now buy/sell items.
*   **The Monster Ecosystem**:
    *   Fail to clear "Rat Cellar" -> Rats breed -> "Rat King" Boss appears (Harder) -> Plague spreads (Town Pool shrinks).

---

## 6. Platform Strategy (Mobile First)
*   **Session Design**: ONE DAY is a session (~3 mins). ONE WEEK is a Chapter (~20 mins).
*   **UI Focus**: Big buttons, swipe to reject/accept.
*   **Retention**: "Your ledger is updated" notification. "A new ship arrived in port" (Weekly reset notification).

---

## 7. Immediate Development Steps (The Prototype)
To achieve this vision, we move in phases:

1.  **Phase 1: The Town Pool (Backend)**
    *   Stop generating a new random guy every "Next".
    *   Generate a `TownRoster` array of 10 objects at start of game.
    *   `NextAdventurer` picks from this array.
2.  **Phase 2: Persistent Growth**
    *   When a Guild Member returns from a quest, `XP++`. If XP > Threshold, `Stats++`.
3.  **Phase 3: The Week Cycle**
    *   Add `Day: 1/7` UI.
    *   Add a simple "Rent Due: 500G" check on Day 7.
