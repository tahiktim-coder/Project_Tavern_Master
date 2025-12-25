# Game Mechanics Analysis & Comparative Study

## 1. Executive Summary
This document analyzes mechanics from *XCOM 2*, *Dragon Age: Inquisition*, and *Reigns* to identify high-impact features for *Tavern Master*. The goal is to enhance strategic depth and emotional investment without introducing real-time combat or complex tactical layers.

## 2. Comparative Analysis

### A. XCOM 2 (The Strategy Layer)
**Core Experience**: Attrition, Memorialization, and Hard Choices.

| Mechanic | How it works in XCOM 2 | Proposed Application in Tavern Master | Rating |
| :--- | :--- | :--- | :--- |
| **The Memorial** | A dedicated room listing fallen soldiers, their rank, and mission of death. | **"The Guild Crypt"**: A simple UI view listing deceased adventurers, their Level, and the specialized "Death Reason" (e.g., "Mauled by a Bear on Day 12"). | ⭐⭐⭐⭐⭐ (Easy Win) |
| **Guerilla Ops (Dilemmas)** | Player chooses 1 of 3 missions. The ignored 2 result in "Dark Events" (permanent/temporary enemy buffs). | **"Conflicting Interests"**: The Crown demands a guard detail (Reputation) BUT the local Merchant needs an escort (Gold). You only have manpower for one. The ignored faction applies a penalty (Tax Hike vs Item Cost Inc). | ⭐⭐⭐⭐⭐ (High Impact) |
| **Roster Fatigue/Wounds** | Soldiers need time to recover. You cannot spam your 'A-Team'. | **"Stamina/Injury System"**: We already have Injuries. We can expand this to "Fatigue" – sending a hero 3 days in a row increases Accident Chance, forcing roster rotation. | ⭐⭐⭐⭐ |

### B. Dragon Age: Inquisition (The War Table)
**Core Experience**: Delegation, Approach, and Political Power.

| Mechanic | How it works in DAI | Proposed Application in Tavern Master | Rating |
| :--- | :--- | :--- | :--- |
| **Tri-Fold Approach** | Missions can be solved by **Force** (Cullen), **Secrets** (Leliana), or **Diplomacy** (Josephine). Different rewards/timings per approach. | **"Class-Based Solutions"**: A Quest "Goblin Encampment" could be solved by: <br>1. **Warrior**: Wipe them out (Loot++, Injury Risk).<br>2. **Rogue**: Steal supplies (Gold++, Safe).<br>3. **Cleric/Paladin**: Negotiate truce (Reputation++). | ⭐⭐⭐⭐⭐ (Adds Depth) |
| **The "Commander" Feel** | You don't fight; you move pins on a map. | **"The Map View"**: Instead of just a list of quests, a visual Map where we drag tokens (Adventurers) onto locations. | ⭐⭐⭐ (Good for UI polish) |

### C. Reigns (Nerial)
**Core Experience**: Balance of Power, Binary Choices, Narrative Rhythm.

| Mechanic | How it works in Reigns | Proposed Application in Tavern Master | Rating |
| :--- | :--- | :--- | :--- |
| **The Four Pillars** | Choices affect Church, People, Army, Gold. If ANY meter hits 0 or 100, you die. | **"Faction Balancing"**: Track **Crown Favor**, **Guild Wealth**, **Town Popularity**. High Crown Favor is good, but if Town Popularity drops ("The King's Lapdog"), riots occur. | ⭐⭐⭐⭐ |
| **Rapid Fire Decisions** | Swipe Left/Right. Instant feedback. | **"The Morning Briefing"**: Before assigning quests, the Guild Master sits at the desk. 3-4 Cards appear (Petitioners). Accept/Decline stamps. (e.g., "Beggar asks for 10g" -> Pay or Kick out). | ⭐⭐⭐⭐⭐ (Fits "Bureaucracy" theme) |

### D. Other Inspirations (Honorable Mentions)

#### *Darkest Dungeon* (Red Hook Studios)
*   **Quirks & Stress**: Heroes gain "Fear of Spiders" or "Kleptomania" based on mishandled quests.
*   **Application**: Our **Traits** system can evolve. If a hero fails a "Crypt" quest, they gain "Fear of Undead" (Debuff vs Undead).

#### *Papers, Please* (Lucas Pope)
*   **Tactile Bureaucracy**: Stamping papers, checking details.
*   **Application**: We already have the **Stamp**. We can lean into this. inspecting a Quest: "Wait, this payout looks fake?" -> Deny Quest.

---

## 3. Recommended Roadmap Integration

### Phase 1: The "Living" Roster (XCOM Style)
*   **Implement "The Crypt"**: Persist dead characters in a separate list.
*   **Implement "Fatigue"**: Simple counter. 3 Quests = Needs Rest.

### Phase 2: The "Morning Desk" (Reigns/Papers Please)
*   **Pre-Quest Phase**: Before the Quest Board opens, you deal with 3 random Event Cards.
*   **Mechanic**: Card appears. Two buttons (Accept/Reject or Option A/B). 
*   **Impact**: Modifies Gold, Rep, or adds a temporary Buff/Debuff to the Guild ("High Morale: +10% Success today").

### Phase 3: The "War Table" (DAI Style Questing)
*   **Dilemma Quests**: "Royal Mandate: Beast Hunt" vs "Merchant Guild: Trade Route".
*   **The Choice**: Assigning your best team to one guarantees success but leaves the other vulnerable.
*   **Class Flavored Outcomes**: Text descriptions change based on who led the party.

## 4. Immediate Action Item: The Scripted Intro
For the upcoming "Scripted Intro", we should introduce the **Dilemma**.
*   **Scenario**: The King demands taxes (Gold) BUT the Town is starving (Requests Gold).
*   **Player Choice**: 
    *   Pay King: Crown Rep +, Town Rep --.
    *   Feed Town: Crown Rep --, Town Rep ++.
*   **Consequence**: The messenger reacts differently.

